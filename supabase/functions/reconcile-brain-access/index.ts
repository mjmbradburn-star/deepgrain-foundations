// reconcile-brain-access: scheduled audit job that ensures brain_access_tokens
// state matches the source of truth (brain_subscribers.unsubscribed_at +
// suppressed_emails). Triggers normally handle revocation in real time —
// this is a belt-and-braces daily sweep that catches any drift and writes
// an audit row regardless of outcome.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceKey) {
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase.rpc('reconcile_brain_access_tokens')

  if (error) {
    console.error('reconcile-brain-access: RPC failed', { error })
    return jsonResponse({ error: error.message }, 500)
  }

  console.log('reconcile-brain-access: completed', { result: data })

  return jsonResponse({ success: true, result: data })
})
