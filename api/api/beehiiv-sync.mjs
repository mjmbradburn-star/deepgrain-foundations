import { createHash, timingSafeEqual } from 'node:crypto';
export const config = { maxDuration: 60 };
const uuid = (value) => { const h = createHash('sha256').update(value).digest('hex'); return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`; };
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const expected = process.env.CRON_SECRET || '';
  const supplied = String(req.headers.authorization || '').replace(/^Bearer /, '') || String(req.query.token || '');
  if (!expected || supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return res.status(401).json({error:'Unauthorized'});
  if (req.method !== 'GET') return res.status(405).end();
  const apiKey = process.env.BEEHIIV_API_KEY, phKey = process.env.POSTHOG_PROJECT_KEY;
  if (!apiKey || !phKey) return res.status(503).json({error:'Missing configuration'});
  const publication = 'pub_c891fdec-63e1-491e-a466-2868dd26afc1';
  const day = new Date().toISOString().slice(0,10), cutoff = Date.now()/1000 - 172800;
  let cursor = '', pages = 0, subscribers = 0, events = 0;
  try {
    do {
      const url = new URL(`https://api.beehiiv.com/v2/publications/${publication}/subscriptions`);
      url.searchParams.set('limit','100'); url.searchParams.append('expand[]','stats');
      if (cursor) url.searchParams.set('cursor',cursor); else if (pages) url.searchParams.set('page',String(pages+1));
      const response = await fetch(url, {headers:{Authorization:`Bearer ${apiKey}`}, signal:AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error(`beehiiv HTTP ${response.status}`);
      const body = await response.json(); const batch = [];
      for (const sub of body.data || []) {
        const email = String(sub.email || '').trim().toLowerCase(); if (!email) continue;
        subscribers++;
        const props = {distinct_id:email, $process_person_profile:true, $set:{email,beehiiv_subscription_id:sub.id,beehiiv_status:sub.status}, source:'beehiiv_api',publication_id:publication,subscription_id:sub.id};
        if (Number(sub.created) >= cutoff) batch.push({event:'beehiiv_subscribed',uuid:uuid(`beehiiv:created:${sub.id}`),timestamp:new Date(Number(sub.created)*1000).toISOString(),properties:{...props,utm_source:sub.utm_source,utm_medium:sub.utm_medium,utm_campaign:sub.utm_campaign}});
        if (sub.stats) batch.push({event:'beehiiv_engagement_snapshot',uuid:uuid(`beehiiv:stats:${sub.id}:${day}`),timestamp:`${day}T00:00:00.000Z`,properties:{...props,emails_received:sub.stats.emails_received,open_rate:sub.stats.open_rate,click_through_rate:sub.stats.click_through_rate,snapshot_date:day,measurement:'cumulative subscriber statistics, not individual opens or clicks'}});
      }
      if (batch.length) {
        const capture = await fetch('https://eu.i.posthog.com/batch/', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({api_key:phKey,batch}),signal:AbortSignal.timeout(15000)});
        if (!capture.ok) throw new Error(`PostHog HTTP ${capture.status}`); events += batch.length;
      }
      const pagination = body.pagination || body; cursor = pagination.next_cursor || ''; pages++;
      if (!cursor && pagination.total_pages && pages < pagination.total_pages) cursor = '';
      else if (!cursor) break;
      if (pages >= 30 && cursor) throw new Error('Pagination safety limit reached');
    } while (true);
    return res.status(200).json({ok:true,subscribers,events,pages,snapshot_date:day});
  } catch(e) { return res.status(502).json({error:e.message,pages,subscribers,events}); }
}
