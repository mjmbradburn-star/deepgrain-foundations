// Pings IndexNow with every URL in the Deepgrain sitemap.
// Bing, Yandex and Microsoft Copilot consume IndexNow; Google ignores it but
// Search Console handles Google separately.
//
// Scheduled daily via pg_cron (see migration). Also callable manually:
//   curl -X POST https://<project>.supabase.co/functions/v1/ping-indexnow

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

async function extractUrlsFromSitemap(): Promise<string[]> {
  const res = await fetch(SITEMAP_URL, {
    headers: { "User-Agent": "deepgrain-indexnow/1.0" },
  });
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const urls: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].trim());
  }
  return urls;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const urlList = await extractUrlsFromSitemap();
    if (urlList.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "no urls in sitemap" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // IndexNow accepts up to 10,000 URLs per request — we're well under.
    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    };

    const ping = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const responseText = await ping.text();
    const ok = ping.status >= 200 && ping.status < 300;

    return new Response(
      JSON.stringify({
        ok,
        status: ping.status,
        urlsSubmitted: urlList.length,
        endpoint: INDEXNOW_ENDPOINT,
        response: responseText.slice(0, 500),
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
