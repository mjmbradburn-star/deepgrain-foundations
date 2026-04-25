// open-brain: validates a per-subscriber access token and 302-redirects
// to the secret Notion URL. The Notion URL is never exposed in HTML, JSON,
// sitemap, or marketing surfaces — only here, only after token validation.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_BASE = 'https://deepgrain.ai'

function htmlResponse(
  title: string,
  body: string,
  status = 200,
  resendReason?: 'not_found' | 'revoked' | 'expired' | 'malformed',
): Response {
  const cta = resendReason
    ? `<p><a class="btn" href="${SITE_BASE}/brain/resend?reason=${resendReason}">Request a fresh link →</a></p>`
    : `<p><a href="${SITE_BASE}/brain">Return to deepgrain.ai/brain</a></p>`
  // Tiny self-contained HTML — keeps copy on-brand without pulling the SPA bundle.
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>${title} · Deepgrain</title>
  <style>
    :root { color-scheme: light; }
    html, body { margin: 0; padding: 0; background: #faf8f3; color: #1a1a1a; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
    main { max-width: 560px; margin: 0 auto; padding: 96px 24px; }
    h1 { font-size: 28px; font-weight: 500; letter-spacing: -0.01em; margin: 0 0 16px; }
    p { font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; }
    a { color: #1a1a1a; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
    a.btn { display: inline-block; padding: 12px 22px; border: 1px solid #1a1a1a; border-radius: 999px; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; }
    a.btn:hover { background: #1a1a1a; color: #faf8f3; }
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    ${body}
    ${cta}
  </main>
</body>
</html>`
  return new Response(html, {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return htmlResponse('Method not allowed', '<p>This link only accepts GET requests.</p>', 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const brainUrl = Deno.env.get('BRAIN_NOTION_URL')

  if (!supabaseUrl || !supabaseServiceKey || !brainUrl) {
    console.error('open-brain: missing config', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
      hasBrain: !!brainUrl,
    })
    return htmlResponse(
      'Service unavailable',
      '<p>The Brain link service is temporarily misconfigured. Please email <a href="mailto:matt@peopleleaders.io">matt@peopleleaders.io</a>.</p>',
      500,
    )
  }

  // Defensive: refuse to ever resolve to a public notion.so/notion.site URL
  // that hasn't been swapped to the rotated, locked-down one.
  try {
    const parsed = new URL(brainUrl)
    if (!/notion\.so$|notion\.site$/.test(parsed.hostname)) {
      console.error('open-brain: BRAIN_NOTION_URL is not a Notion host', { host: parsed.hostname })
      return htmlResponse('Service unavailable', '<p>The Brain link is misconfigured.</p>', 500)
    }
  } catch {
    return htmlResponse('Service unavailable', '<p>The Brain link is misconfigured.</p>', 500)
  }

  const url = new URL(req.url)
  const token = url.searchParams.get('t')

  if (!token || token.length < 16 || token.length > 128) {
    return htmlResponse(
      'Link not recognised',
      '<p>This Brain link is missing or malformed. If you signed up but never received a working link, request a fresh one by re-submitting the form on deepgrain.ai/brain.</p>',
      400,
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: tokenRow, error: lookupError } = await supabase
    .from('brain_access_tokens')
    .select('id, subscriber_id, expires_at, revoked_at, revoke_reason, use_count')
    .eq('token', token)
    .maybeSingle()

  if (lookupError) {
    console.error('open-brain: lookup failed', { error: lookupError })
    return htmlResponse('Service unavailable', '<p>Please try again in a moment.</p>', 500)
  }

  if (!tokenRow) {
    return htmlResponse(
      'Link not recognised',
      '<p>This Brain link doesn’t match any active subscriber. Request a fresh one by re-submitting the form on deepgrain.ai/brain.</p>',
      404,
    )
  }

  if (tokenRow.revoked_at) {
    return htmlResponse(
      'Access revoked',
      `<p>This Brain link has been revoked${tokenRow.revoke_reason ? ` (${tokenRow.revoke_reason})` : ''}. If this is unexpected, email <a href="mailto:matt@peopleleaders.io">matt@peopleleaders.io</a>.</p>`,
      410,
    )
  }

  if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
    return htmlResponse(
      'Link expired',
      '<p>This Brain link has expired. Request a fresh one by re-submitting the form on deepgrain.ai/brain.</p>',
      410,
    )
  }

  // Best-effort audit. Don't block the redirect on failure.
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null

  supabase
    .from('brain_access_tokens')
    .update({
      last_used_at: new Date().toISOString(),
      use_count: (tokenRow.use_count ?? 0) + 1,
      last_ip: ip,
    })
    .eq('id', tokenRow.id)
    .then(({ error }) => {
      if (error) console.warn('open-brain: audit update failed', { error })
    })

  return new Response(null, {
    status: 302,
    headers: {
      Location: brainUrl,
      'Cache-Control': 'private, no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
})
