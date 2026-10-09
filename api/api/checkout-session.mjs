// Creates a Stripe Checkout Session server-side so the buyer's email, a PostHog id and
// marketing consent ride on the session (visible in Stripe even if it is never paid).
// Called by src/lib/checkoutGate.ts. Any failure here makes the page fall back to the
// plain Payment Link, so a bug in this file can never block a sale.
// Key: STRIPE_CHECKOUT_KEY (restricted: Checkout Sessions write only). Never logged.
import { createHash } from 'node:crypto';
export const config = { maxDuration: 15 };

const PLANS = {
  founding: 'price_1UIbDVQQIEQm1i6ql5ZqslXD', // £495
  standard: 'price_1UIbE3QQIEQm1i6qxRS28PCI', // £695
};
const LEGACY_VERSION = '2020-08-27';
const ORIGINS = new Set(['https://www.deepgrain.ai', 'https://deepgrain.ai']);
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const CONSENT_TEXT = 'Email me about this course, cohort dates and occasional updates from Deepgrain. Unsubscribe any time.';

// Best-effort per-instance limiter (serverless instances do not share memory). The
// Stripe Idempotency-Key below is the real double-click guard; this only slows scripts.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 6;
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const c of req) { chunks.push(c); if (Buffer.concat(chunks).length > 4096) throw new Error('too large'); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const origin = req.headers.origin;
  if (origin && ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!origin || !ORIGINS.has(origin)) return res.status(403).json({ error: 'Forbidden' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Slow down' });
  const key = process.env.STRIPE_CHECKOUT_KEY;
  if (!key) return res.status(503).json({ error: 'Not configured' });

  let body;
  try { body = await readJson(req); } catch { return res.status(400).json({ error: 'Bad request' }); }
  const plan = String(body.plan || '');
  const email = String(body.email || '').trim().toLowerCase();
  const price = PLANS[plan];
  if (!price) return res.status(400).json({ error: 'Unknown plan' });
  if (!EMAIL_RE.test(email) || email.length > 320) return res.status(400).json({ error: 'Invalid email' });
  const consent = body.consent === true;
  const ref = String(body.ref || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 100);

  const p = new URLSearchParams();
  p.set('mode', 'payment');
  p.set('line_items[0][price]', price);
  p.set('line_items[0][quantity]', '1');
  p.set('customer_email', email);
  p.set('customer_creation', 'always');
  if (ref) p.set('client_reference_id', ref);
  p.set('billing_address_collection', 'required');
  p.set('allow_promotion_codes', 'true');
  p.set('adaptive_pricing[enabled]', 'false');
  p.set('success_url', 'https://www.deepgrain.ai/waitlist?checkout=success&session_id={CHECKOUT_SESSION_ID}');
  p.set('cancel_url', 'https://www.deepgrain.ai/waitlist');
  p.set('metadata[source]', 'deepgrain_gate');
  p.set('metadata[plan]', plan);
  // CLAIMED only: anyone can POST this endpoint, so an unpaid session's consent is never
  // trusted for contact. The webhook only honours it once the session is paid.
  p.set('metadata[marketing_consent_claimed]', consent ? 'true' : 'false');
  if (consent) p.set('metadata[consent_text]', CONSENT_TEXT);

  // Mirror Maven: the Payments tab "Incomplete" row carries the email via PaymentIntent metadata.
  p.set('payment_intent_data[description]', plan === 'founding' ? 'Deepgrain Founding Course Seat' : 'Deepgrain Standard Course Seat');
  p.set('payment_intent_data[metadata][email]', email);
  p.set('payment_intent_data[metadata][plan]', plan);
  p.set('payment_intent_data[metadata][source]', 'deepgrain_gate');
  if (ref) p.set('payment_intent_data[metadata][client_reference_id]', ref);

  const idem = 'gate-' + createHash('sha256').update(`${email}|${plan}|${consent}|${ref}|${Math.floor(Date.now() / 300000)}`).digest('hex').slice(0, 40);
  // Older API version: Checkout creates the PaymentIntent up front, so an opened-but-unpaid
  // session shows in the dashboard Payments tab as "Incomplete" (like Maven). If Stripe rejects
  // that version for any reason we retry on the account default so a sale is never blocked.
  const call = (version, key2) => fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': key2,
      ...(version ? { 'Stripe-Version': version } : {}),
    },
    body: p,
  });
  try {
    let r = await call(LEGACY_VERSION, idem);
    let j = await r.json();
    if (!r.ok || !j.url) {
      console.error('stripe session failed on legacy version', r.status, j && j.error && j.error.code);
      r = await call(null, idem + 'd');
      j = await r.json();
    }
    if (!r.ok || !j.url) {
      console.error('stripe session failed', r.status, j && j.error && j.error.code);
      return res.status(502).json({ error: 'Checkout unavailable' });
    }
    return res.status(200).json({ url: j.url, id: j.id });
  } catch (e) {
    console.error('stripe session error', e && e.message);
    return res.status(502).json({ error: 'Checkout unavailable' });
  }
}
