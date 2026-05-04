// Pings IndexNow with the URLs in the Deepgrain sitemap, but ONLY when the
// sitemap content has actually changed since the last check.
//
// How it works:
//   1. Fetch sitemap.xml
//   2. SHA-256 the body, compare to public.sitemap_state.content_hash
//   3. If unchanged → return { ok: true, changed: false } (no IndexNow call)
//   4. If changed → diff against the stored URL list, ping IndexNow with
//      the union of (added URLs ∪ removed URLs ∪ a small set of "always
//      important" anchor URLs like the home page), then persist the new
//      hash + URL list.
//
// Scheduled every 10 minutes via pg_cron. Also callable manually:
//   curl -X POST https://<project>.supabase.co/functions/v1/ping-indexnow
//   curl -X POST '.../ping-indexnow?force=true'   ← re-pings every URL
//
// Bing, Yandex, Seznam, Naver and Microsoft Copilot consume IndexNow.
// Google ignores it; Search Console handles Google separately.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const HOST = "deepgrain.ai";
const KEY = "74fbf61ed22a2c644b4d621320ac07b9";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const ANCHOR_URLS = [`https://${HOST}/`, `https://${HOST}/intelligence`];

interface SitemapFetch {
  body: string;
  hash: string;
  urls: string[];
}

async function fetchSitemap(): Promise<SitemapFetch> {
  const res = await fetch(SITEMAP_URL, {
    headers: { "User-Agent": "deepgrain-indexnow/1.0" },
  });
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const body = await res.text();

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(body),
  );
  const hash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const urls: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) urls.push(m[1].trim());

  return { body, hash, urls };
}

async function pingIndexNow(urlList: string[]) {
  const ping = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });
  return { status: ping.status, response: (await ping.text()).slice(0, 500) };
}

function parseJwtClaims(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1]
      .replaceAll("-", "+")
      .replaceAll("_", "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    return JSON.parse(atob(payload)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Require a service_role JWT. The anon key is public and would otherwise
  // let any caller force IndexNow pings (quota exhaustion) and overwrite
  // sitemap_state. Legitimate callers (cron, admin tooling) sign with
  // SUPABASE_SERVICE_ROLE_KEY.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
  const token = authHeader.slice("Bearer ".length).trim();
  const claims = parseJwtClaims(token);
  if (claims?.role !== "service_role") {
    return new Response(
      JSON.stringify({ error: "Forbidden" }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "true";

  try {
    const { hash, urls } = await fetchSitemap();

    const { data: state } = await supabase
      .from("sitemap_state")
      .select("content_hash, url_list")
      .eq("id", true)
      .maybeSingle();

    const previousHash: string | null = state?.content_hash ?? null;
    const previousUrls: string[] = (state?.url_list as string[]) ?? [];
    const checkedAt = new Date().toISOString();

    // Unchanged: record the check and return early. No IndexNow call.
    if (!force && previousHash === hash) {
      await supabase
        .from("sitemap_state")
        .update({ last_checked_at: checkedAt })
        .eq("id", true);

      return new Response(
        JSON.stringify({
          ok: true,
          changed: false,
          urlsInSitemap: urls.length,
          checkedAt,
          message: "sitemap unchanged, no ping sent",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Build the URL list to ping.
    // - On `force=true`: ping every URL in the sitemap.
    // - On a real change: ping the diff (added + removed) plus the anchor
    //   URLs so home/index always get a nudge, plus every URL when this is
    //   the very first run (no previous hash).
    const prevSet = new Set(previousUrls);
    const currSet = new Set(urls);
    const added = urls.filter((u) => !prevSet.has(u));
    const removed = previousUrls.filter((u) => !currSet.has(u));

    let toPing: string[];
    if (force || previousHash === null) {
      toPing = urls;
    } else {
      const merged = new Set<string>([...added, ...removed, ...ANCHOR_URLS]);
      // Strip any anchor URLs that aren't in the current sitemap (avoid
      // pinging a 404), and any "removed" URLs we just took out.
      toPing = [...merged].filter(
        (u) => currSet.has(u) || removed.includes(u),
      );
    }

    if (toPing.length === 0) {
      // Hash changed but no URL set difference (e.g. only lastmod updated).
      // Still ping the anchor URLs so search engines re-fetch.
      toPing = ANCHOR_URLS.filter((u) => currSet.has(u));
    }

    const { status, response } = await pingIndexNow(toPing);
    const ok = status >= 200 && status < 300;

    await supabase
      .from("sitemap_state")
      .update({
        content_hash: hash,
        url_list: urls,
        last_checked_at: checkedAt,
        last_changed_at: checkedAt,
        last_pinged_at: checkedAt,
        last_ping_status: status,
        last_ping_response: response,
      })
      .eq("id", true);

    return new Response(
      JSON.stringify({
        ok,
        changed: true,
        force,
        firstRun: previousHash === null,
        urlsInSitemap: urls.length,
        added: added.length,
        removed: removed.length,
        urlsPinged: toPing.length,
        indexNowStatus: status,
        indexNowResponse: response,
      }),
      {
        status: ok ? 200 : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
