// supabase/functions/resend-brain-link/smoke_test.ts
//
// Staging smoke test: exercises /resend-brain-link and /open-brain end-to-end
// against a real (staging) project, using a freshly-seeded subscriber. Catches
// runtime differences (missing deno.json, broken npm specifiers, missing env,
// RLS regressions, redirect changes) BEFORE deploy.
//
// Run with:
//   deno test --allow-net --allow-env supabase/functions/resend-brain-link/smoke_test.ts
//
// Loads SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY from .env via dotenv. Uses
// the SERVICE ROLE key directly to seed and clean up state — DO NOT point
// this at production. Only run against a staging project.

import 'https://deno.land/std@0.224.0/dotenv/load.ts'
import {
  assert,
  assertEquals,
  assertExists,
} from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_URL =
  Deno.env.get('SMOKE_SUPABASE_URL') ??
  Deno.env.get('SUPABASE_URL') ??
  Deno.env.get('VITE_SUPABASE_URL')!
const SERVICE_ROLE_KEY =
  Deno.env.get('SMOKE_SERVICE_ROLE_KEY') ??
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

assert(SUPABASE_URL, 'Missing SUPABASE_URL (set SMOKE_SUPABASE_URL or SUPABASE_URL)')
assert(
  SERVICE_ROLE_KEY,
  'Missing SERVICE_ROLE_KEY (set SMOKE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY)',
)
assert(
  !SUPABASE_URL.includes('todgunffzlopbenewfnp') ||
    Deno.env.get('SMOKE_ALLOW_PROD') === '1',
  'Refusing to run against production. Set SMOKE_ALLOW_PROD=1 to override.',
)

const RESEND_URL = `${SUPABASE_URL}/functions/v1/resend-brain-link`
const OPEN_URL = `${SUPABASE_URL}/functions/v1/open-brain`

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

function uniqueEmail(prefix: string): string {
  const stamp = Date.now().toString(36)
  const rnd = Math.random().toString(36).slice(2, 8)
  return `smoke+${prefix}-${stamp}-${rnd}@deepgrain.test`
}

async function seedSubscriber(opts: {
  email: string
  unsubscribed?: boolean
  suppressed?: boolean
}): Promise<{ id: string }> {
  const { data, error } = await admin
    .from('brain_subscribers')
    .insert({
      email: opts.email,
      first_name: 'Smoke',
      consent_given: true,
      consent_timestamp: new Date().toISOString(),
      source: 'smoke-test',
      unsubscribed_at: opts.unsubscribed ? new Date().toISOString() : null,
    })
    .select('id')
    .single()
  if (error) throw new Error(`seed subscriber failed: ${error.message}`)

  if (opts.suppressed) {
    const { error: supErr } = await admin
      .from('suppressed_emails')
      .insert({ email: opts.email, reason: 'bounce', metadata: { smoke: true } })
    if (supErr) throw new Error(`seed suppression failed: ${supErr.message}`)
  }
  return { id: data.id }
}

async function cleanup(email: string, subscriberId?: string): Promise<void> {
  if (subscriberId) {
    await admin.from('brain_access_tokens').delete().eq('subscriber_id', subscriberId)
  }
  await admin.from('brain_subscribers').delete().eq('email', email)
  await admin.from('suppressed_emails').delete().eq('email', email)
  await admin.from('email_unsubscribe_tokens').delete().eq('email', email)
  await admin.from('email_send_log').delete().eq('recipient_email', email)
}

async function postResend(body: Record<string, unknown>) {
  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let json: Record<string, unknown> = {}
  try {
    json = text ? JSON.parse(text) : {}
  } catch { /* non-JSON body */ }
  return { status: res.status, json, text }
}

async function getOpenBrain(token: string) {
  const res = await fetch(`${OPEN_URL}?t=${encodeURIComponent(token)}`, {
    method: 'GET',
    redirect: 'manual',
    headers: { Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  })
  // Always consume body to avoid resource leaks.
  const text = await res.text()
  return { status: res.status, location: res.headers.get('location'), text }
}

// ─── Tests ────────────────────────────────────────────────────────────

Deno.test('resend: not_found for unknown email', async () => {
  const email = uniqueEmail('nf')
  try {
    const r = await postResend({ email })
    assertEquals(r.status, 200)
    assertEquals(r.json.status, 'not_found')
  } finally {
    await cleanup(email)
  }
})

Deno.test('resend: validation_failed for invalid email', async () => {
  const r = await postResend({ email: 'not-an-email' })
  assertEquals(r.status, 400)
})

Deno.test('resend: honeypot returns generic sent', async () => {
  const email = uniqueEmail('hp')
  const r = await postResend({ email, website: 'http://spam.example' })
  assertEquals(r.status, 200)
  assertEquals(r.json.status, 'sent')
  // No subscriber should have been created or touched.
  const { data } = await admin
    .from('brain_subscribers')
    .select('id')
    .eq('email', email)
    .maybeSingle()
  assertEquals(data, null)
})

Deno.test('resend: unsubscribed subscriber returns unsubscribed', async () => {
  const email = uniqueEmail('unsub')
  const seeded = await seedSubscriber({ email, unsubscribed: true })
  try {
    const r = await postResend({ email })
    assertEquals(r.status, 200)
    assertEquals(r.json.status, 'unsubscribed')
    assertExists(r.json.since)
  } finally {
    await cleanup(email, seeded.id)
  }
})

Deno.test('resend: suppressed email returns suppressed', async () => {
  const email = uniqueEmail('sup')
  const seeded = await seedSubscriber({ email, suppressed: true })
  try {
    const r = await postResend({ email })
    assertEquals(r.status, 200)
    assertEquals(r.json.status, 'suppressed')
    assertExists(r.json.reason)
  } finally {
    await cleanup(email, seeded.id)
  }
})

Deno.test(
  'end-to-end: resend mints token → open-brain redirects to Notion',
  async () => {
    const email = uniqueEmail('e2e')
    const seeded = await seedSubscriber({ email })
    try {
      // 1) Resend should mint a fresh token and return sent.
      const r = await postResend({ email })
      assertEquals(r.status, 200, `resend body: ${r.text}`)
      assertEquals(r.json.status, 'sent')

      // 2) Verify a fresh, active token exists for this subscriber.
      const { data: tokens, error: tokErr } = await admin
        .from('brain_access_tokens')
        .select('token, revoked_at, expires_at')
        .eq('subscriber_id', seeded.id)
        .is('revoked_at', null)
      assertEquals(tokErr, null)
      assert(tokens && tokens.length === 1, `expected 1 active token, got ${tokens?.length}`)
      const token = tokens[0].token as string
      assert(token.length === 64, `expected 64-char hex token, got ${token.length}`)

      // 3) open-brain with the minted token must 302 to the Notion URL.
      const open = await getOpenBrain(token)
      assertEquals(open.status, 302, `open-brain body: ${open.text.slice(0, 200)}`)
      assert(
        open.location && /notion\.(so|site)/.test(open.location),
        `expected Notion redirect, got: ${open.location}`,
      )

      // 4) Calling resend again should revoke the old token and mint a new one.
      const r2 = await postResend({ email })
      assertEquals(r2.json.status, 'sent')
      const { data: tokensAfter } = await admin
        .from('brain_access_tokens')
        .select('token, revoked_at, revoke_reason')
        .eq('subscriber_id', seeded.id)
      const active = tokensAfter?.filter((t) => !t.revoked_at) ?? []
      const revoked = tokensAfter?.filter((t) => t.revoked_at) ?? []
      assertEquals(active.length, 1, 'exactly one active token after second resend')
      assert(
        revoked.some((t) => t.revoke_reason === 'resend_superseded'),
        'old token should be marked resend_superseded',
      )

      // 5) Old (revoked) token should now fail open-brain with 410.
      const openOld = await getOpenBrain(token)
      assertEquals(openOld.status, 410)
    } finally {
      await cleanup(email, seeded.id)
    }
  },
)

Deno.test('open-brain: malformed token returns 400', async () => {
  const r = await getOpenBrain('short')
  assertEquals(r.status, 400)
})

Deno.test('open-brain: unknown token returns 404', async () => {
  const fake = 'a'.repeat(64)
  const r = await getOpenBrain(fake)
  assertEquals(r.status, 404)
})
