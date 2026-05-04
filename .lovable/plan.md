## What I tested

I exercised the recently changed surfaces end-to-end against the live backend.

### Edge function auth gates (post-hardening) — all good
| Function | No auth | Anon JWT | Result |
|---|---|---|---|
| `ping-indexnow` | 401 Unauthorized | 403 Forbidden | ✅ correctly service-role only |
| `send-transactional-email` | (gateway) | 403 Forbidden | ✅ correctly service-role only |
| `sync-brain-subscribers-to-notion` | (gateway) | 403 Forbidden | ✅ correctly service-role only |

### Sitemap / IndexNow plumbing
- `https://deepgrain.ai/sitemap.xml` → 200, 56 URLs.
- IndexNow key file `74fbf61ed22a2c644b4d621320ac07b9.txt` → 200.
- `sitemap_state` row populated, last successful ping recorded earlier today (status 200).
- Recent `send-brain-welcome` invocations show real signups succeeding.

### Database linter / security scan
- Security scan: 0 outstanding findings.
- Supabase linter: 2 WARN (`USING (true)` on INSERT, see issue 2 below).

## Issues found

### 1. CRITICAL — IndexNow cron is now broken (silent failure)

The hardening I shipped requires a `service_role` JWT, but the pg_cron job (`jobid: 7`, schedule `*/10 * * * *`) for `ping-indexnow` was created with the **public anon key** hardcoded in both `Authorization` and `apikey` headers. After the security fix, every cron tick now gets a 403 Forbidden, so the sitemap is no longer being auto-pinged. The other cron jobs (`process-email-queue`, `reconcile-brain-access`, `sync-brain-subscribers-to-notion`) correctly read `email_queue_service_role_key` from the Vault, so they still work.

**Fix:** Replace the `ping-indexnow` cron command to read the service-role JWT from the Vault, matching the pattern used by the other three jobs. Migration:

```sql
SELECT cron.unschedule(7); -- or unschedule by name if named
SELECT cron.schedule(
  'ping-indexnow-every-10-min',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://todgunffzlopbenewfnp.supabase.co/functions/v1/ping-indexnow',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets
        WHERE name = 'email_queue_service_role_key' LIMIT 1
      )
    ),
    body := '{"trigger":"cron"}'::jsonb,
    timeout_milliseconds := 30000
  );
  $$
);
```

I'll also drop the redundant `apikey` header (gateway only needs the `Authorization` Bearer for `verify_jwt = false` functions enforcing role in-code).

### 2. WARN — Two public INSERT policies use `WITH CHECK (true)`

Linter flags `public.enquiries` ("Anyone can submit an enquiry") and `public.subscribers` ("Anyone can subscribe") as overly permissive. Both are intentionally public-write (anonymous form submissions), so we cannot scope them by `auth.uid()`. The right move is one of:

- **Acknowledge as intentional** (matches site behaviour) and mark the linter findings as accepted in the security memory, OR
- **Add lightweight write constraints** so they aren't trivially abusable. Recommended additions:
  - `enquiries`: enforce non-empty `email` + `message`, length bounds (e.g. `length(message) BETWEEN 1 AND 5000`), and a basic email regex.
  - `subscribers`: enforce non-empty + valid-shape `email`, length bound, and reject obvious junk.

I recommend the second option (still permits public submits, but stops `INSERT ... DEFAULT VALUES` and oversize payloads). Both forms already have client-side validation and the contact form goes through an edge function, so this just hardens the DB floor.

```sql
DROP POLICY "Anyone can submit an enquiry" ON public.enquiries;
CREATE POLICY "Public can submit a valid enquiry"
  ON public.enquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(email) BETWEEN 5 AND 320
    AND length(coalesce(message,'')) BETWEEN 1 AND 5000
  );
-- analogous policy for public.subscribers
```

### 3. Minor — Migration drift

The runtime `pg_cron` schedule for `ping-indexnow` was never captured in `supabase/migrations/`. The fix migration above will close that gap going forward.

## Plan

1. **Write a migration** to:
   - Unschedule the broken `ping-indexnow` cron and re-schedule it using the Vault-stored service-role key.
   - Replace the two `WITH CHECK (true)` INSERT policies with format/length-validated equivalents.
2. **Smoke-test after deploy:** force a cron-style call from the migration with `SELECT net.http_post(...)`, then re-query `sitemap_state.last_pinged_at` to confirm the cron path now returns 200. Re-run the linter to confirm 0 warnings.
3. **Update security memory** noting that `enquiries`/`subscribers` allow public INSERT but with content validation, and that `ping-indexnow` cron is authenticated via the Vault secret.

No frontend changes required.
