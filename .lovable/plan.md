## What Business plan changes

On Notion Business you get two relevant capabilities the free/Plus tier doesn't have:

1. **Site permissions on published sites** — restrict a published Notion site so only specific email addresses (or a domain) can view it. Visitors get a "request access / sign in with email" gate; Notion sends them a magic link; only emails on the allow-list get through.
2. **Programmatic membership management via the Notion API** — you can add/remove guests on a page, and (with the published-sites API) manage the allow-list for a site.

This means we can make the Brain **actually private** instead of relying on a shared-secret URL. The `/brain` form becomes the system of record for who's allowed in, and Notion enforces the gate at view time.

---

## Recommended approach: Notion-enforced allow-list, synced from `brain_subscribers`

The flow becomes:

```text
User submits /brain form
  → send-brain-welcome inserts brain_subscribers row
  → send-brain-welcome calls Notion API to add email to the Brain site's allow-list
  → welcome email goes out with the published Brain URL
  → user clicks link → Notion shows email-gate → user enters their email
  → Notion sends magic link → user lands on the Brain
```

Unsubscribe / suppression flows the other way: when `brain_subscribers.unsubscribed_at` is stamped (or the address hits suppression), we call Notion to revoke that email's access.

---

## What changes in Notion (one-time setup)

1. **Share → Publish tab**: keep Publish ON for the `peopleleaders.notion.site/...` URL.
2. **Publish → Site permissions**: switch from "Anyone with the link" to **"Restrict access"** (Business-only setting). Add `matt@peopleleaders.io` as an initial allowed email so you don't lock yourself out.
3. **Search engine indexing → OFF.** It's currently On per your screenshot.
4. **Share tab → General access**: set the canonical `notion.so/...` URL to **No access**. Only the published site URL is the entry point.
5. **Rotate the published-site slug** once, to invalidate the link that's been circulating publicly.
6. **Create a Notion internal integration** (Settings → Connections → Develop integrations → New internal integration) with the minimum scopes needed to manage site members. Copy the integration token. Connect it to the Brain page (••• menu → Connections → add the integration).

---

## What changes in our codebase

### Phase 1 — Add the Notion sync to send-brain-welcome

1. **Secrets** (added via `add_secret`):
   - `NOTION_INTEGRATION_TOKEN` — the internal integration token.
   - `NOTION_BRAIN_SITE_ID` — the published-site identifier the API needs to manage members.
   - `BRAIN_NOTION_URL` — promote the existing hard-coded constant to a secret (currently in `supabase/functions/send-brain-welcome/index.ts` line 39 and `brain-welcome.tsx` previewData), and set it to the new rotated `peopleleaders.notion.site/...` URL.
2. **`send-brain-welcome/index.ts`**:
   - After successful insert into `brain_subscribers` and before enqueuing the welcome email, call the Notion API to add the email to the site allow-list.
   - Wrap in try/catch: if Notion sync fails, still send the email (so the user isn't stranded), but stamp `brain_subscribers.notion_sync_status = 'failed'` and log a `notion_sync_failed` outcome via the existing `logOutcome` helper.
   - Add a new outcome type `notion_sync_failed` to the `Outcome` union and the `negative` list.
3. **DB migration**: add two columns to `brain_subscribers` — `notion_sync_status text` (values: `pending` | `synced` | `failed` | `revoked`) and `notion_synced_at timestamptz`. Both nullable, no backfill needed.

### Phase 2 — Wire the revoke path

1. **`handle-email-unsubscribe/index.ts`**: when the token resolves to a brain subscriber, in addition to stamping `unsubscribed_at`, call the Notion API to revoke that email from the site allow-list. Same try/catch posture: log a metric, don't block the unsubscribe response.
2. **`handle-email-suppression/index.ts`** (bounce/complaint webhook): if the bounced/complained address exists in `brain_subscribers`, revoke from Notion as well.
3. Stamp `notion_sync_status = 'revoked'` on success.

### Phase 3 — Reconciliation safety net

A small scheduled edge function (daily via `pg_cron`) — `reconcile-brain-notion-access` — that:
- pulls the current Notion site allow-list,
- diff against `brain_subscribers` where `unsubscribed_at IS NULL` and `email_status NOT IN ('suppressed','bounced')`,
- adds anything missing, removes anything that shouldn't be there,
- logs the diff to a new `brain_notion_sync_log` table for audit.

This catches drift from failed Notion calls, manual edits in Notion's UI, or API outages.

### Phase 4 — Tighten the email + page

1. Update the welcome email copy in `brain-welcome.tsx` to set expectations: "When you click through, Notion will ask for your email so it can send a one-time sign-in link. Use the same address you signed up with."
2. Update `src/pages/Brain.tsx` success state copy to mirror the same expectation.
3. Update `src/pages/Privacy.tsx` Brain section to disclose that the email is shared with Notion to enforce the access gate (Notion becomes a named processor).

---

## Trade-offs to be aware of

- **One extra step for the reader.** Each visit (or each new device/cleared cookies) requires the Notion magic-link dance. This is the price of real enforcement. The welcome-email copy needs to set this expectation clearly or you'll get confused replies.
- **Email address must match.** If the subscriber forwards the welcome email to a colleague, the colleague can't get in unless they sign up themselves. That's the feature.
- **Notion API rate limits** apply. At your volume this is a non-issue, but the reconcile job should batch politely.
- **Notion outage = no new sign-ins.** The reconcile job + the "send the email even if Notion sync fails" fallback mean a temporary Notion API outage doesn't black-hole subscribers — they'll be added once Notion is back.

---

## Files touched

New:
- DB migration: add `notion_sync_status`, `notion_synced_at` to `brain_subscribers`; create `brain_notion_sync_log` table; schedule `reconcile-brain-notion-access` via `pg_cron`.
- `supabase/functions/_shared/notion-brain-access.ts` — small helper module for `addToAllowlist(email)` / `removeFromAllowlist(email)` / `listAllowlist()`.
- `supabase/functions/reconcile-brain-notion-access/` (index.ts + deno.json + config block).

Modified:
- `supabase/functions/send-brain-welcome/index.ts` — call sync helper, new outcome type.
- `supabase/functions/handle-email-unsubscribe/index.ts` — revoke on unsubscribe.
- `supabase/functions/handle-email-suppression/index.ts` — revoke on bounce/complaint.
- `supabase/functions/_shared/transactional-email-templates/brain-welcome.tsx` — explain the Notion email-gate; update preview URL.
- `src/pages/Brain.tsx` — success-state copy.
- `src/pages/Privacy.tsx` — disclose Notion as a processor.
- `public/robots.txt` — disallow the new slug as defence-in-depth.
- `supabase/config.toml` — config block for the new function.

---

## Out of scope

- Replacing the Notion magic-link UX with our own SSO bridge (would require Notion Enterprise + SCIM).
- Migrating the Brain content off Notion.
- Re-emailing existing subscribers to warn them of the new gate (separate decision; recommended once the sync is live and verified).

---

## Open question before I build

Do you want to **bulk-add all existing `brain_subscribers` to the Notion allow-list** as part of the rollout, so they're not locked out on their next visit? I'd do this as a one-shot script run after Phase 1 ships and before you rotate the slug. Say the word and I'll include it.
