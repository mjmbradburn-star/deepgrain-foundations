import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
export const config = { maxDuration: 30, api: { bodyParser: false } };
const uuid = (value) => { const h = createHash('sha256').update(value).digest('hex'); return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`; };
const readRaw = (req) => new Promise((resolve, reject) => { const chunks = []; req.on('data', (c) => chunks.push(c)); req.on('end', () => resolve(Buffer.concat(chunks))); req.on('error', reject); });
function verify(raw, headers, secret) {
  const id = headers['svix-id'], ts = headers['svix-timestamp'], sigs = headers['svix-signature'];
  if (!id || !ts || !sigs || !secret) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = createHmac('sha256', key).update(`${id}.${ts}.${raw.toString('utf8')}`).digest();
  return String(sigs).split(' ').some((part) => {
    const [version, sig] = part.split(',');
    if (version !== 'v1' || !sig) return false;
    const given = Buffer.from(sig, 'base64');
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).end();
  const secret = process.env.RESEND_WEBHOOK_SECRET, phKey = process.env.POSTHOG_PROJECT_KEY;
  if (!secret || !phKey) return res.status(503).json({ error: 'Missing configuration' });
  const raw = await readRaw(req);
  if (!verify(raw, req.headers, secret)) return res.status(401).json({ error: 'Bad signature' });
  let evt;
  try { evt = JSON.parse(raw.toString('utf8')); } catch { return res.status(400).json({ error: 'Bad JSON' }); }
  const type = String(evt.type || '');
  if (!type.startsWith('email.')) return res.status(200).json({ ok: true, ignored: type });
  const d = evt.data || {};
  const recipients = (Array.isArray(d.to) ? d.to : [d.to]).filter(Boolean).map((x) => String(x).trim().toLowerCase());
  if (!recipients.length) return res.status(200).json({ ok: true, ignored: 'no recipient' });
  const svixId = String(req.headers['svix-id']);
  const batch = recipients.map((email) => ({
    event: `resend_${type.slice(6)}`,
    uuid: uuid(`resend:${svixId}:${email}`),
    timestamp: evt.created_at || new Date().toISOString(),
    properties: {
      distinct_id: email, $process_person_profile: true, $set: { email }, $geoip_disable: true,
      source: 'resend_webhook', resend_email_id: d.email_id, resend_broadcast_id: d.broadcast_id, subject: d.subject,
      from: d.from, tags: d.tags, click_link: d.click && d.click.link, bounce_type: d.bounce && d.bounce.type,
      bounce_message: d.bounce && d.bounce.message
    }
  }));
  try {
    const r = await fetch('https://eu.i.posthog.com/batch/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ api_key: phKey, batch }), signal: AbortSignal.timeout(15000) });
    if (!r.ok) return res.status(502).json({ error: `PostHog HTTP ${r.status}` });
    return res.status(200).json({ ok: true, events: batch.length });
  } catch (e) { return res.status(502).json({ error: e.message }); }
}
