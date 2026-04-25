// supabase/functions/send-brain-welcome/index.ts
//
// Public endpoint hit by the /brain capture form. Validates the payload,
// inserts a row into `brain_subscribers` (service-role, bypasses RLS),
// then invokes `send-transactional-email` with the `brain-welcome` template.
//
// Deployed with verify_jwt = false because the form is unauthenticated.
// Abuse is mitigated with: a strict zod schema, a throwaway-domain blocklist,
// and an in-memory IP rate limit (5 / 60s).

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// The Brain link Matt shared (the People Ops AI Brain Notion page) and
// the public AIOI URL. Both are public — baked in rather than secrets.
const BRAIN_NOTION_URL =
  'https://www.notion.so/The-Deepgrain-People-Ops-AI-Brain-2f61569da34481baa942d9758263742d'
const AIOI_URL = 'https://aioi.deepgrain.ai'

// Throwaway / disposable email domains we don't want to bother sending to.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'sharklasers.com',
  '10minutemail.com',
  'temp-mail.org',
  'yopmail.com',
  'trashmail.com',
  'fakeinbox.com',
  'getnada.com',
  'maildrop.cc',
  'tempmail.com',
  'throwawaymail.com',
])

// Permissive RFC-ish email regex — matches what the client validates.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface BrainPayload {
  firstName: string | null
  email: string
  consentGiven: true
  consentTimestamp: string | null
  source: string
  referrer: string | null
  userAgent: string | null
}

type ValidationResult =
  | { ok: true; data: BrainPayload }
  | { ok: false; issues: Record<string, string> }

function validatePayload(raw: unknown): ValidationResult {
  const issues: Record<string, string> = {}
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, issues: { _: 'Payload must be an object' } }
  }
  const r = raw as Record<string, unknown>

  // firstName — optional, max 80
  let firstName: string | null = null
  if (r.firstName !== undefined && r.firstName !== null && r.firstName !== '') {
    if (typeof r.firstName !== 'string') {
      issues.firstName = 'Must be a string'
    } else {
      const trimmed = r.firstName.trim()
      if (trimmed.length > 80) issues.firstName = 'Too long'
      else if (trimmed.length > 0) firstName = trimmed
    }
  }

  // email — required, lowercase, regex
  let email = ''
  if (typeof r.email !== 'string') {
    issues.email = 'Email is required'
  } else {
    email = r.email.trim().toLowerCase()
    if (email.length === 0) issues.email = 'Email is required'
    else if (email.length > 320) issues.email = 'Too long'
    else if (!EMAIL_REGEX.test(email)) issues.email = 'Invalid email'
  }

  // consentGiven — must be exactly true
  if (r.consentGiven !== true) {
    issues.consentGiven = 'Consent is required'
  }

  // consentTimestamp — optional ISO string
  let consentTimestamp: string | null = null
  if (r.consentTimestamp !== undefined && r.consentTimestamp !== null) {
    if (typeof r.consentTimestamp !== 'string' || isNaN(Date.parse(r.consentTimestamp))) {
      issues.consentTimestamp = 'Invalid timestamp'
    } else {
      consentTimestamp = r.consentTimestamp
    }
  }

  // source — optional, default 'brain'
  let source = 'brain'
  if (r.source !== undefined && r.source !== null && r.source !== '') {
    if (typeof r.source !== 'string') issues.source = 'Must be a string'
    else {
      const trimmed = r.source.trim()
      if (trimmed.length > 40) issues.source = 'Too long'
      else if (trimmed.length > 0) source = trimmed
    }
  }

  // referrer — optional, max 2000
  let referrer: string | null = null
  if (r.referrer !== undefined && r.referrer !== null && r.referrer !== '') {
    if (typeof r.referrer !== 'string') issues.referrer = 'Must be a string'
    else {
      const trimmed = r.referrer.trim().slice(0, 2000)
      if (trimmed.length > 0) referrer = trimmed
    }
  }

  // userAgent — optional, max 500
  let userAgent: string | null = null
  if (r.userAgent !== undefined && r.userAgent !== null && r.userAgent !== '') {
    if (typeof r.userAgent !== 'string') issues.userAgent = 'Must be a string'
    else {
      const trimmed = r.userAgent.trim().slice(0, 500)
      if (trimmed.length > 0) userAgent = trimmed
    }
  }

  if (Object.keys(issues).length > 0) {
    return { ok: false, issues }
  }
  return {
    ok: true,
    data: {
      firstName,
      email,
      consentGiven: true,
      consentTimestamp,
      source,
      referrer,
      userAgent,
    },
  }
}

// In-memory IP rate limit. 5 requests per 60s per IP. Resets on cold start —
// adequate for a low-volume lead-capture form, not a fortress.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5
const ipHits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const window = ipHits.get(ip)?.filter((t) => now - t < RATE_LIMIT_WINDOW_MS) ?? []
  if (window.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, window)
    return true
  }
  window.push(now)
  ipHits.set(ip, window)
  return false
}

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// Always-success response shape for the client. We never reveal whether an
// email already existed or was suppressed — keeps enumeration off the table.
const successResponse = () =>
  jsonResponse({ success: true, message: 'Check your inbox.' })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('send-brain-welcome: missing SUPABASE env')
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  // Resolve client IP (Supabase passes through x-forwarded-for).
  const forwardedFor = req.headers.get('x-forwarded-for') ?? ''
  const ip = forwardedFor.split(',')[0]?.trim() || 'unknown'

  if (rateLimited(ip)) {
    console.warn('send-brain-welcome: rate limited', { ip })
    return jsonResponse(
      { error: 'Too many requests. Please try again in a minute.' },
      429,
    )
  }

  // Parse body
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  const parsed = validatePayload(raw)
  if (!parsed.ok) {
    return jsonResponse({ error: 'Validation failed', issues: parsed.issues }, 400)
  }

  const { firstName, email, consentGiven, consentTimestamp, source, referrer, userAgent } =
    parsed.data

  // Block disposable domains
  const domain = email.split('@')[1] ?? ''
  if (DISPOSABLE_DOMAINS.has(domain)) {
    console.warn('send-brain-welcome: disposable domain blocked', { domain })
    // Same shape as success — don't leak the blocklist.
    return successResponse()
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Check for existing subscriber. We treat duplicates as success
  // (idempotent UX) and skip resending the email.
  const { data: existing, error: lookupError } = await supabase
    .from('brain_subscribers')
    .select('id, email_status, unsubscribed_at')
    .eq('email', email)
    .maybeSingle()

  if (lookupError) {
    console.error('send-brain-welcome: lookup failed', { lookupError })
    return jsonResponse({ error: 'Something went wrong. Try again shortly.' }, 500)
  }

  if (existing) {
    console.log('send-brain-welcome: duplicate subscriber, returning success', {
      id: existing.id,
    })
    return successResponse()
  }

  // Insert the subscriber row.
  const insertedConsentTimestamp =
    consentTimestamp ?? new Date().toISOString()

  const { data: inserted, error: insertError } = await supabase
    .from('brain_subscribers')
    .insert({
      first_name: firstName,
      email,
      consent_given: consentGiven,
      consent_timestamp: insertedConsentTimestamp,
      source,
      ip_address: ip,
      referrer: referrer ?? null,
      user_agent: userAgent ?? null,
    })
    .select('id')
    .single()

  if (insertError || !inserted) {
    console.error('send-brain-welcome: insert failed', { insertError })
    return jsonResponse({ error: 'Something went wrong. Try again shortly.' }, 500)
  }

  // Invoke send-transactional-email with the service-role key. That function
  // requires service_role — passing the same key the dispatcher uses works.
  const sendResp = await fetch(
    `${supabaseUrl}/functions/v1/send-transactional-email`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateName: 'brain-welcome',
        recipientEmail: email,
        idempotencyKey: `brain-welcome-${inserted.id}`,
        templateData: {
          firstName,
          brainUrl: BRAIN_NOTION_URL,
          aioiUrl: AIOI_URL,
        },
      }),
    },
  )

  let sendBody: { success?: boolean; reason?: string; error?: string } = {}
  try {
    sendBody = await sendResp.json()
  } catch {
    // ignore JSON parse failure
  }

  const sentOk = sendResp.ok && sendBody.success !== false
  const status = sentOk
    ? 'queued'
    : sendBody.reason === 'email_suppressed'
      ? 'suppressed'
      : 'failed'

  // Stamp the row with the outcome — best-effort, don't fail the request on it.
  const { error: updateError } = await supabase
    .from('brain_subscribers')
    .update({
      email_status: status,
      email_sent_at: sentOk ? new Date().toISOString() : null,
      email_provider_id: `brain-welcome-${inserted.id}`,
    })
    .eq('id', inserted.id)

  if (updateError) {
    console.warn('send-brain-welcome: status update failed', {
      updateError,
      id: inserted.id,
    })
  }

  if (!sentOk && status === 'failed') {
    console.error('send-brain-welcome: send-transactional-email failed', {
      status: sendResp.status,
      body: sendBody,
    })
    // Still return success to the user — their row is saved, retry happens
    // server-side via the queue or manually.
  }

  return successResponse()
})
