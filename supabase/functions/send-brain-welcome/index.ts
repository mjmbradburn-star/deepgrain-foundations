// supabase/functions/send-brain-welcome/index.ts
//
// Public endpoint hit by the /brain capture form. Validates the payload,
// inserts a row into `brain_subscribers` (service-role, bypasses RLS),
// then invokes `send-transactional-email` with the `brain-welcome` template.
//
// Deployed with verify_jwt = false because the form is unauthenticated.
// Abuse is mitigated with: a strict zod schema, a throwaway-domain blocklist,
// and an in-memory IP rate limit (5 / 60s).

import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { template as brainWelcomeTemplate } from '../_shared/transactional-email-templates/brain-welcome.tsx'

// Email pipeline constants — must mirror send-transactional-email/index.ts.
// Re-run the email domain setup flow if these need to change.
const SITE_NAME = 'deepgrain-foundations'
const SENDER_DOMAIN = 'notify.www.deepgrain.ai'
const FROM_DOMAIN = 'notify.www.deepgrain.ai'

function generateUnsubscribeToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

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

// ──────────────────────────────────────────────────────────────────────
// Server-side metrics
//
// All outcomes are logged in two places:
//
//   1. Structured stdout JSON line (`brain_welcome_metric`) — picked up by
//      the edge function log explorer and easy to grep.
//   2. A row in `email_send_log` with template_name = 'brain-welcome' and a
//      synthetic `message_id` of `brain-welcome-meta-<uuid>` for outcomes
//      that don't correspond to an actual send attempt (duplicate, blocked,
//      rate-limited, validation_failed, …). The real send goes through
//      `send-transactional-email` and produces its own `email_send_log` rows
//      keyed by the proper `brain-welcome-<subscriber_id>` message_id.
//
// Sensitive inputs (raw email, IP, user agent) are never written to
// `email_send_log.metadata` — only hashed/abbreviated forms.
// ──────────────────────────────────────────────────────────────────────

type Outcome =
  | 'success'           // new subscriber, send queued
  | 'duplicate'         // email already on file
  | 'blocked_domain'    // disposable / throwaway domain
  | 'rate_limited'      // IP exceeded the 5/60s window
  | 'validation_failed' // payload failed validation
  | 'invalid_json'      // body wasn't JSON
  | 'method_not_allowed'
  | 'config_error'      // missing SUPABASE_* envs
  | 'lookup_failed'     // SELECT against brain_subscribers errored
  | 'insert_failed'     // INSERT into brain_subscribers errored
  | 'send_failed'       // send-transactional-email returned non-OK
  | 'send_suppressed'   // recipient is on the suppression list

// Short SHA-256 fingerprint of the email. Lets us correlate metric rows
// for the same recipient without ever logging the address itself.
async function emailFingerprint(email: string | null): Promise<string | null> {
  if (!email) return null
  const data = new TextEncoder().encode(email.toLowerCase().trim())
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Drop the last octet of an IPv4 address (or the tail of v6) so logs keep
// an aggregation key without storing the full client IP.
function maskIp(ip: string): string {
  if (!ip || ip === 'unknown') return 'unknown'
  if (ip.includes(':')) {
    return ip.split(':').slice(0, 3).join(':') + ':…'
  }
  const parts = ip.split('.')
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.x`
  return 'masked'
}

interface OutcomeContext {
  ip: string
  email?: string | null
  domain?: string | null
  detail?: Record<string, unknown>
}

// Use `any` for the client here so we don't fight the deeply-inferred
// generics from createClient — this helper only ever calls a single insert.
// deno-lint-ignore no-explicit-any
async function logOutcome(
  supabase: any | null,
  outcome: Outcome,
  ctx: OutcomeContext,
): Promise<void> {
  const fingerprint = await emailFingerprint(ctx.email ?? null)
  const ipMasked = maskIp(ctx.ip)

  // 1) Structured stdout — single source of truth for the agent / log search.
  const line = {
    metric: 'brain_welcome_metric',
    outcome,
    domain: ctx.domain ?? null,
    email_fp: fingerprint,
    ip_masked: ipMasked,
    ts: new Date().toISOString(),
    ...(ctx.detail ?? {}),
  }
  const negative: Outcome[] = [
    'blocked_domain',
    'rate_limited',
    'validation_failed',
    'invalid_json',
    'method_not_allowed',
    'config_error',
    'lookup_failed',
    'insert_failed',
    'send_failed',
    'send_suppressed',
  ]
  if (negative.includes(outcome)) {
    console.warn(JSON.stringify(line))
  } else {
    console.log(JSON.stringify(line))
  }

  // 2) email_send_log — only for negative/edge outcomes. We deliberately
  //    skip `success` here because send-transactional-email writes its own
  //    pending→sent rows under the real `brain-welcome-<id>` message_id.
  //    Writing a duplicate would inflate dashboard counts.
  if (!supabase || outcome === 'success') return
  try {
    // Map onto the constrained `status` enum on email_send_log. The
    // granular outcome stays in metadata.outcome.
    //   send_suppressed → suppressed
    //   everything else → failed (with reason in error_message + metadata)
    const status = outcome === 'send_suppressed' ? 'suppressed' : 'failed'

    await supabase.from('email_send_log').insert({
      message_id: `brain-welcome-meta-${crypto.randomUUID()}`,
      template_name: 'brain-welcome',
      // Recipient is required by schema. For meta rows where we don't have
      // a validated address, log a stable sentinel so we don't leak garbage.
      recipient_email: ctx.email ?? 'unknown@brain-welcome.meta',
      status,
      error_message: typeof ctx.detail?.reason === 'string'
        ? (ctx.detail.reason as string)
        : null,
      metadata: {
        outcome,
        domain: ctx.domain ?? null,
        email_fp: fingerprint,
        ip_masked: ipMasked,
        ...(ctx.detail ?? {}),
      },
    })
  } catch (err) {
    console.warn('send-brain-welcome: metric persist failed', {
      outcome,
      err: String(err),
    })
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Resolve client IP early so all metrics carry it.
  const forwardedFor = req.headers.get('x-forwarded-for') ?? ''
  const ip = forwardedFor.split(',')[0]?.trim() || 'unknown'

  if (req.method !== 'POST') {
    await logOutcome(null, 'method_not_allowed', { ip, detail: { method: req.method } })
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const supabasePublishableKey =
    Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !supabaseServiceKey || !supabasePublishableKey) {
    await logOutcome(null, 'config_error', { ip })
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  if (rateLimited(ip)) {
    await logOutcome(supabase, 'rate_limited', { ip })
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
    await logOutcome(supabase, 'invalid_json', { ip })
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  const parsed = validatePayload(raw)
  if (!parsed.ok) {
    await logOutcome(supabase, 'validation_failed', {
      ip,
      detail: { fields: Object.keys(parsed.issues) },
    })
    return jsonResponse({ error: 'Validation failed', issues: parsed.issues }, 400)
  }

  const { firstName, email, consentGiven, consentTimestamp, source, referrer, userAgent } =
    parsed.data
  const domain = email.split('@')[1] ?? ''

  // Block disposable domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    await logOutcome(supabase, 'blocked_domain', { ip, email, domain })
    // Same shape as success — don't leak the blocklist.
    return successResponse()
  }

  // Check for existing subscriber. We treat duplicates as success
  // (idempotent UX) and skip resending the email.
  const { data: existing, error: lookupError } = await supabase
    .from('brain_subscribers')
    .select('id, email_status, unsubscribed_at')
    .eq('email', email)
    .maybeSingle()

  if (lookupError) {
    await logOutcome(supabase, 'lookup_failed', {
      ip,
      email,
      domain,
      detail: { reason: lookupError.message },
    })
    return jsonResponse({ error: 'Something went wrong. Try again shortly.' }, 500)
  }

  if (existing) {
    await logOutcome(supabase, 'duplicate', {
      ip,
      email,
      domain,
      detail: {
        prior_status: existing.email_status,
        unsubscribed: Boolean(existing.unsubscribed_at),
      },
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
    await logOutcome(supabase, 'insert_failed', {
      ip,
      email,
      domain,
      detail: { reason: insertError?.message ?? 'no row returned' },
    })
    return jsonResponse({ error: 'Something went wrong. Try again shortly.' }, 500)
  }

  // Render the brain-welcome React Email template inline and enqueue the
  // pre-rendered payload directly to the `transactional_emails` pgmq queue
  // via the `enqueue_email` RPC. This bypasses send-transactional-email's
  // HTTP entry point — that gateway rejects calls from this function under
  // the asymmetric-keys regime — while preserving exactly the same payload
  // shape the dispatcher (process-email-queue) expects.
  const messageId = `brain-welcome-${inserted.id}`
  const idempotencyKey = `brain-welcome-${inserted.id}`

  let sentOk = false
  let sendErrorReason: string | null = null

  try {
    // 1. Suppression check — never enqueue to a suppressed address.
    const { data: suppressed, error: suppressedError } = await supabase
      .from('suppressed_emails')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    if (suppressedError) throw new Error(`suppression_check_failed: ${suppressedError.message}`)

    if (suppressed) {
      await logOutcome(supabase, 'send_suppressed', {
        ip,
        email,
        domain,
        detail: { subscriber_id: inserted.id },
      })
      // Stamp the subscriber row + bail.
      await supabase
        .from('brain_subscribers')
        .update({ email_status: 'suppressed' })
        .eq('id', inserted.id)
      return successResponse()
    }

    // 2. Get-or-create the unsubscribe token for this recipient.
    const { data: existingToken } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token, used_at')
      .eq('email', email)
      .maybeSingle()

    let unsubscribeToken: string
    if (existingToken && !existingToken.used_at) {
      unsubscribeToken = existingToken.token
    } else if (!existingToken) {
      unsubscribeToken = generateUnsubscribeToken()
      await supabase
        .from('email_unsubscribe_tokens')
        .upsert(
          { token: unsubscribeToken, email },
          { onConflict: 'email', ignoreDuplicates: true },
        )
      // Re-read in case another request raced us.
      const { data: stored } = await supabase
        .from('email_unsubscribe_tokens')
        .select('token')
        .eq('email', email)
        .maybeSingle()
      if (!stored?.token) throw new Error('unsubscribe_token_persist_failed')
      unsubscribeToken = stored.token
    } else {
      // Token used — recipient unsubscribed but isn't on suppression list.
      // Treat as suppressed and skip sending.
      await logOutcome(supabase, 'send_suppressed', {
        ip,
        email,
        domain,
        detail: { subscriber_id: inserted.id, reason: 'unsubscribe_token_used' },
      })
      await supabase
        .from('brain_subscribers')
        .update({ email_status: 'suppressed' })
        .eq('id', inserted.id)
      return successResponse()
    }

    // 3. Render the React Email template to HTML + plain text.
    const templateData = {
      firstName,
      brainUrl: BRAIN_NOTION_URL,
      aioiUrl: AIOI_URL,
    }
    const html = await renderAsync(
      React.createElement(brainWelcomeTemplate.component, templateData),
    )
    const plainText = await renderAsync(
      React.createElement(brainWelcomeTemplate.component, templateData),
      { plainText: true },
    )
    const resolvedSubject =
      typeof brainWelcomeTemplate.subject === 'function'
        ? brainWelcomeTemplate.subject(templateData)
        : brainWelcomeTemplate.subject

    // 4. Log a `pending` row before enqueue so we have a record even if
    //    enqueue throws.
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: 'brain-welcome',
      recipient_email: email,
      status: 'pending',
    })

    // 5. Enqueue. Payload shape mirrors send-transactional-email exactly
    //    so the dispatcher consumes it without any branching.
    const { error: enqueueError } = await supabase.rpc('enqueue_email', {
      queue_name: 'transactional_emails',
      payload: {
        message_id: messageId,
        to: email,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject: resolvedSubject,
        html,
        text: plainText,
        purpose: 'transactional',
        label: 'brain-welcome',
        idempotency_key: idempotencyKey,
        unsubscribe_token: unsubscribeToken,
        queued_at: new Date().toISOString(),
      },
    })

    if (enqueueError) throw new Error(`enqueue_failed: ${enqueueError.message}`)

    sentOk = true
  } catch (e) {
    sentOk = false
    sendErrorReason = e instanceof Error ? e.message : 'enqueue_unknown_error'
    // Best-effort failure record so the dashboard reflects what happened.
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: 'brain-welcome',
      recipient_email: email,
      status: 'failed',
      error_message: sendErrorReason,
    })
  }

  const status = sentOk ? 'queued' : 'failed'


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

  if (sentOk) {
    await logOutcome(supabase, 'success', {
      ip,
      email,
      domain,
      detail: { subscriber_id: inserted.id },
    })
  } else {
    await logOutcome(supabase, 'send_failed', {
      ip,
      email,
      domain,
      detail: {
        subscriber_id: inserted.id,
        http_status: httpStatus,
        reason: sendErrorReason,
      },
    })
  }

  // Always return the same success shape — never reveal send-side outcome.
  return successResponse()
})
