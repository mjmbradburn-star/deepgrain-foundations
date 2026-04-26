## Goal

Sync `brain_subscribers` (name, email, referrer, source, created_at) into the existing Notion "Subscribers" database once a day, cheaply and reliably.

## Approach

Use a Supabase Edge Function (`sync-brain-subscribers-to-notion`) triggered daily by `pg_cron`. Each run pulls only subscribers created since the last successful sync (incremental, so credit usage stays minimal — typically a handful of rows/day, zero rows on quiet days).

Notion writes go directly via Notion's REST API using a Notion Internal Integration token (no MCP at runtime — MCP is only used now, by me, to set up the database schema).

### Why this is "low credit / easy"

- Incremental: only new rows since last sync (uses a tiny `notion_sync_state` table with a `last_synced_at` cursor).
- Runs once/day via `pg_cron` → `net.http_post` → edge function. No polling, no webhooks, no extra infra.
- Direct `fetch` to Notion API — no SDK, no extra dependencies.
- Idempotent: each row is checked against Notion by email before insert (skip if exists), so re-runs never duplicate.

## Steps

### 1. Notion setup (I do this via MCP now)

- Add the required columns to the existing **Subscribers** database (currently only has `Name`):
  - `Name` (title) — populated with first name (or email if name is empty)
  - `Email` (email)
  - `Source` (select)
  - `Referrer` (URL)
  - `Signed Up` (date) — from `created_at`
  - `Subscriber ID` (rich_text) — the Supabase UUID, used for idempotency
- Ask user to create a **Notion Internal Integration** at notion.so/profile/integrations, copy the secret, and share the Subscribers database with the integration (Notion requires this share step — integrations can't see pages otherwise).

### 2. Secrets

Add one new secret:
- `NOTION_API_KEY` — the integration token from step 1.

(`Notion database ID` will be hardcoded in the function — it's not sensitive.)

### 3. Database

New tiny table `notion_sync_state`:
```
id int primary key default 1 (single row),
last_synced_at timestamptz not null default '1970-01-01',
last_run_at timestamptz,
last_run_status text,
last_run_count int,
last_run_error text
```
Service-role-only RLS.

### 4. Edge function `sync-brain-subscribers-to-notion`

- Reads `last_synced_at` from `notion_sync_state`.
- Selects `brain_subscribers` where `created_at > last_synced_at` AND `unsubscribed_at IS NULL`, ordered ascending.
- For each row: query Notion (filter by `Subscriber ID == row.id`) → if no match, create page; if match, skip.
- After all rows succeed, update `last_synced_at` to the max `created_at` processed.
- Logs per-run summary to `notion_sync_state` (count, error if any). Throws on Notion API errors so cron retries next day.
- `verify_jwt = true` (called only by cron with service key).

### 5. Schedule

`pg_cron` job at 06:00 UTC daily, posting to the function with the service role key (same pattern as existing email infra).

### 6. Backfill

First run will sweep all existing 25 subscribers (cursor starts at epoch). After that, daily runs will only handle new ones.

## Technical details

- Notion API: `POST https://api.notion.com/v1/pages` with `Notion-Version: 2022-06-28` header.
- Idempotency query: `POST /v1/databases/{id}/query` with filter on `Subscriber ID`.
- Rate-safe: Notion allows ~3 req/sec; we sleep 350ms between writes. Trivial for typical volumes.
- No MCP runtime dependency — MCP is just used now (by me) to add the columns to the Notion DB.

## Out of scope

- Two-way sync (Notion → Supabase). One-way only.
- Updating Notion when a subscriber unsubscribes (can add later if wanted — would set a "Status" property).
