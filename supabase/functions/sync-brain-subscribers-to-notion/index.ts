// sync-brain-subscribers-to-notion
// Daily cron job: pushes new brain_subscribers rows into a Notion database.
// Incremental via notion_sync_state.last_synced_at; idempotent by Subscriber ID.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Subscribers DB ID is read from the NOTION_SUBSCRIBERS_DB_ID secret so the
// sync never targets a hardcoded / wrong database. Validated at startup below.
const FALLBACK_NOTION_DATABASE_ID = "34e1569d-a344-80ef-8252-000bc45c1354";
const NOTION_VERSION = "2022-06-28";
const NOTION_BASE = "https://api.notion.com/v1";

function normaliseDbId(raw: string): string {
  // Accept full URLs, dashed UUIDs, or 32-char hex; return dashed UUID.
  let id = raw.trim();
  // Pull last path segment if a URL was pasted
  const urlMatch = id.match(/[0-9a-fA-F]{32}|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  if (urlMatch) id = urlMatch[0];
  id = id.replace(/-/g, "").toLowerCase();
  if (id.length !== 32 || !/^[0-9a-f]{32}$/.test(id)) {
    throw new Error(
      `NOTION_SUBSCRIBERS_DB_ID is not a valid Notion ID: "${raw}"`,
    );
  }
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
}

async function validateNotionDatabase(
  dbId: string,
  apiKey: string,
): Promise<void> {
  // Try the v1 databases endpoint first (works for legacy + simple DBs).
  const res = await notionFetch(`/databases/${dbId}`, { method: "GET" }, apiKey);
  if (res.ok) {
    await res.text();
    return;
  }
  const body = await res.text();
  throw new Error(
    `Notion DB validation failed for ${dbId} (${res.status}): ${body}`,
  );
}

interface BrainSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  source: string | null;
  referrer: string | null;
  created_at: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isHttpUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

async function notionFetch(
  path: string,
  init: RequestInit,
  apiKey: string,
): Promise<Response> {
  return fetch(`${NOTION_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

async function existsInNotion(
  subscriberId: string,
  apiKey: string,
  dbId: string,
): Promise<boolean> {
  const res = await notionFetch(
    `/databases/${dbId}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        filter: {
          property: "Subscriber ID",
          rich_text: { equals: subscriberId },
        },
        page_size: 1,
      }),
    },
    apiKey,
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion query failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return Array.isArray(data.results) && data.results.length > 0;
}

async function createNotionPage(
  sub: BrainSubscriber,
  apiKey: string,
  dbId: string,
): Promise<void> {
  const displayName =
    (sub.first_name && sub.first_name.trim()) || sub.email;

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: displayName.slice(0, 200) } }] },
    Email: { email: sub.email },
    "Subscriber ID": {
      rich_text: [{ text: { content: sub.id } }],
    },
    "Signed Up": { date: { start: sub.created_at } },
  };

  if (sub.source) {
    properties["Source"] = { select: { name: sub.source } };
  }
  if (isHttpUrl(sub.referrer)) {
    properties["Referrer"] = { url: sub.referrer };
  }

  const res = await notionFetch(
    "/pages",
    {
      method: "POST",
      body: JSON.stringify({
        parent: { database_id: dbId },
        properties,
      }),
    },
    apiKey,
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Notion create page failed for ${sub.email} (${res.status}): ${body}`,
    );
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const notionKey = Deno.env.get("NOTION_API_KEY");

  if (!supabaseUrl || !serviceKey) {
    return new Response(
      JSON.stringify({ error: "Supabase env not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  if (!notionKey) {
    return new Response(
      JSON.stringify({ error: "NOTION_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Resolve + validate the target Notion database ID at startup so a
  // misconfigured secret fails fast (and never silently writes elsewhere).
  let notionDbId: string;
  try {
    const rawDbId =
      Deno.env.get("NOTION_SUBSCRIBERS_DB_ID") ?? FALLBACK_NOTION_DATABASE_ID;
    notionDbId = normaliseDbId(rawDbId);
    await validateNotionDatabase(notionDbId, notionKey);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("notion db validation failed", msg);
    return new Response(
      JSON.stringify({ error: `Notion DB validation failed: ${msg}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // 1. Read cursor
  const { data: stateRow, error: stateErr } = await supabase
    .from("notion_sync_state")
    .select("last_synced_at")
    .eq("id", 1)
    .maybeSingle();

  if (stateErr) {
    console.error("notion_sync_state read failed", stateErr);
    return new Response(
      JSON.stringify({ error: "state read failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const cursor = stateRow?.last_synced_at ?? "1970-01-01T00:00:00Z";

  // 2. Fetch new subscribers
  const { data: subs, error: subsErr } = await supabase
    .from("brain_subscribers")
    .select("id, email, first_name, source, referrer, created_at")
    .gt("created_at", cursor)
    .is("unsubscribed_at", null)
    .order("created_at", { ascending: true })
    .limit(500);

  if (subsErr) {
    console.error("brain_subscribers read failed", subsErr);
    return new Response(
      JSON.stringify({ error: "subscribers read failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let synced = 0;
  let skipped = 0;
  let maxCreatedAt = cursor;
  let runError: string | null = null;

  try {
    for (const sub of (subs ?? []) as BrainSubscriber[]) {
      const already = await existsInNotion(sub.id, notionKey);
      if (already) {
        skipped++;
      } else {
        await createNotionPage(sub, notionKey);
        synced++;
        await sleep(350); // stay below Notion's ~3 req/s ceiling
      }
      if (sub.created_at > maxCreatedAt) maxCreatedAt = sub.created_at;
    }
  } catch (err) {
    runError = err instanceof Error ? err.message : String(err);
    console.error("notion sync error", runError);
  }

  // 3. Update state — advance cursor only on clean run
  await supabase
    .from("notion_sync_state")
    .update({
      last_synced_at: runError ? cursor : maxCreatedAt,
      last_run_at: new Date().toISOString(),
      last_run_status: runError ? "error" : "ok",
      last_run_count: synced,
      last_run_error: runError,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  const status = runError ? 500 : 200;
  return new Response(
    JSON.stringify({
      ok: !runError,
      considered: subs?.length ?? 0,
      synced,
      skipped,
      cursor_advanced_to: runError ? cursor : maxCreatedAt,
      error: runError,
    }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
