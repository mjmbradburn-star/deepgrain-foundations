# "Resend my Brain link" flow

A dedicated path for users who can't access their link. They submit their email, and we either resend a fresh link **or** tell them honestly *why* we can't (unsubscribed, bounced/complained), with a clear next step.

## User-facing UX

New page at **`/brain/resend`** (linked from the email error pages — "Link not recognised", "Access revoked", "Link expired" — and as a small `Can't access your link?` link under the Brain capture form).

Single email field + submit. After submission, one of four states is shown:

1. **Sent** — *"We've emailed a fresh Brain link to <em>your address</em>. It should arrive within a minute."*
2. **Unsubscribed** — *"This address unsubscribed on <date>. We can't send Brain links to unsubscribed addresses. Reply to <support email> from this address and we'll re-enable it."*
3. **Suppressed (bounced/complained)** — *"Mail to this address has been bouncing or was marked as spam, so our provider is blocking sends. Try a different email, or reply to <support email> from a working address so we can sort it out."*
4. **Not on file** — *"We don't have a record of this address. [Sign up here]." (link to /brain)*

States 2–4 are the explicit "I know why I can't get access" feedback you asked for. State 1 is the happy path.

> Note on enumeration: the *original* /brain signup form deliberately hides whether an email is on file, to prevent enumeration. The resend flow is different by design — its whole purpose is diagnostic. We accept that trade-off here, gate it behind rate-limiting + CAPTCHA-lite (see below), and document it.

## New edge function: `resend-brain-link`

Public POST endpoint, `verify_jwt = false`, similar shape to `send-brain-welcome`.

Logic:

1. Validate email + consent to ToS, IP rate-limit (3 / 60s / IP — tighter than signup since this is a diagnostic endpoint).
2. Look up `brain_subscribers` by lowercased email.
3. Branching:
   - **No row** → respond `{ status: 'not_found' }`.
   - **Row + `unsubscribed_at` set** → respond `{ status: 'unsubscribed', since: <ISO date> }`. Do not send.
   - **Row exists** → check `suppressed_emails`. If present → respond `{ status: 'suppressed', reason: <reason> }`. Do not send.
   - **Otherwise** → revoke any active `brain_access_tokens` for that subscriber (defense-in-depth: stale tokens shouldn't keep working alongside the new one), mint a fresh token (12-month expiry, same as welcome), enqueue the existing `brain-welcome` template via `enqueue_email` with idempotency key `brain-resend-<subscriber_id>-<yyyymmddhh>` (one resend per hour max per subscriber even if rate limit allows), and respond `{ status: 'sent' }`.
4. Log every outcome to `email_send_log` as a meta row with `template_name = 'brain-welcome'` and `status` ∈ {sent, suppressed, failed} + `metadata.outcome` ∈ {`resend_sent`, `resend_unsubscribed`, `resend_suppressed`, `resend_not_found`, `resend_rate_limited`, …}, mirroring the metric pattern already used by `send-brain-welcome`.

## Email template tweak

Reuse the existing `brain-welcome` template — same content works for a resend. Add an optional `isResend` prop so the H1 reads *"Here's your Brain link again"* instead of the welcome heading when true. Subject becomes *"Your Brain link (resend)"* when `isResend`.

## New page: `src/pages/BrainResend.tsx`

- Matches the `/brain` design language (cream/walnut/brass tokens, same form styling as `BrainCaptureForm`).
- Email input + consent line + submit.
- After submit, replaces the form with the appropriate status block (1–4 above), each with a clear next action.
- Linked from:
  - `open-brain` HTML error pages ("Link not recognised", "Access revoked", "Link expired") — replace the current "Return to /brain" link with a primary "Request a fresh link" CTA pointing to `/brain/resend?reason=<revoked|expired|not_found>` so we can preselect copy.
  - A small text link under the capture form: *"Already signed up but can't find your link? [Resend it →]"*

## Abuse mitigation

- IP rate-limit: 3 / 60s (in-memory, same pattern as `send-brain-welcome`).
- Per-subscriber resend cooldown: hourly idempotency key prevents repeat sends to the same address even from different IPs.
- Honeypot field on the form (hidden input that bots fill in → silent reject).
- No CAPTCHA in v1. If we see abuse in `email_send_log`, we add Turnstile later.

## Security / privacy notes

- Disclosing unsubscribe / suppression status is a deliberate, scoped exception to our usual no-enumeration stance. It only applies to this `/brain/resend` endpoint.
- The Notion URL is still never returned to the client; only a fresh tokenised `/open-brain` link inside the email.
- `Privacy.tsx` gets one extra line: *"If you ask us to resend your Brain link, we'll tell you whether your address is unsubscribed or has been blocked due to bounces, so you know why access isn't working."*

## Files to create / change

**Create**
- `supabase/functions/resend-brain-link/index.ts`
- `src/pages/BrainResend.tsx`

**Edit**
- `supabase/functions/_shared/transactional-email-templates/brain-welcome.tsx` — add optional `isResend` prop; tweak heading + subject when set.
- `supabase/functions/open-brain/index.ts` — swap each error body's footer link to a "Request a fresh link" CTA pointing at `/brain/resend?reason=…`.
- `src/App.tsx` (or wherever routes live) — register `/brain/resend`.
- `src/components/forms/BrainCaptureForm.tsx` — add the small "Resend it →" helper link under the form.
- `src/pages/Privacy.tsx` — disclosure sentence.
- `supabase/config.toml` — `[functions.resend-brain-link] verify_jwt = false`.

## Out of scope (easy follow-ups)

- Self-serve "re-subscribe" button for unsubscribed users (currently we ask them to email support — keeps the audit trail clean).
- Turnstile/hCaptcha integration.
- Rate-limit telemetry dashboard.
