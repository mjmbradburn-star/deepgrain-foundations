# SEO Console Setup, the easy version

This is the short, click-by-click checklist to get Deepgrain ranking and tracked properly. Most of the technical work is already done in the codebase. The only things that need YOU are the bits where Google and Bing have to verify that you own the domain, and a couple of toggles inside the GA4 + Search Console UIs.

Total time: about 15 minutes.

---

## What's already done in the code

You do not need to touch any of this, it is shipped:

- `sitemap.xml` is generated from MDX content with per-URL `lastmod` dates.
- `feed.xml` and `feed/people-ops.xml` are generated and linked from `<head>`.
- `llms.txt` and `llms-full.txt` are generated for AI answer engines.
- Article JSON-LD already includes `author @id`, `datePublished`, `dateModified`, `publisher`, `image`, and `mainEntityOfPage`.
- `robots.txt` allows crawling and points to the sitemap.
- IndexNow is wired up: the `ping-indexnow` edge function pings Bing, Yandex, Seznam, Naver and Microsoft Copilot every 10 minutes whenever `sitemap.xml` actually changes. Google ignores IndexNow, Search Console handles Google.
- Verification meta tags for Google and Bing are already in `index.html`. They just need their codes filled in (step 1 below).

---

## Step 1, Google Search Console (5 min)

1. Go to https://search.google.com/search-console and sign in with the Google account you want to own the property.
2. Click **Add property**, choose **URL prefix**, enter exactly: `https://deepgrain.ai/`
3. Pick the **HTML tag** verification method. You'll see a tag like:
   ```html
   <meta name="google-site-verification" content="abc123XYZ..." />
   ```
4. Copy ONLY the value inside `content="..."` (the `abc123XYZ...` part).
5. Open `index.html` in the project and replace `REPLACE_WITH_GOOGLE_SITE_VERIFICATION_CODE` with that value.
6. Publish the site (top-right Publish button, then Update).
7. Back in Search Console, click **Verify**. Should turn green.
8. In the left sidebar, go to **Sitemaps**, paste `sitemap.xml`, click **Submit**. Repeat for `feed.xml`.

That's Google done. Indexing can take a few days to a few weeks.

---

## Step 2, Bing Webmaster Tools (3 min)

1. Go to https://www.bing.com/webmasters and sign in.
2. Easiest path: click **Import from Google Search Console**. It will pull the property over and verify automatically.
3. If you'd rather verify manually: **Add site** → enter `https://deepgrain.ai/` → choose **Meta tag** → copy the content value → paste into `index.html` replacing `REPLACE_WITH_BING_VERIFICATION_CODE` → publish → click Verify.
4. Submit `https://deepgrain.ai/sitemap.xml` under **Sitemaps**.

---

## Step 3, GA4 polish (5 min)

GA4 is already installed (`G-93DFWMX8GP`) and firing pageviews on every route change. These tweaks make the data more useful.

1. Open https://analytics.google.com → **Admin** (cog, bottom left).
2. Under **Property settings → Data collection and modification → Data collection**:
   - Turn ON **Google signals data collection**. (Adds demographics + cross-device.)
3. Under **Data settings → Data retention**:
   - Change **Event data retention** from 2 months to **14 months**. Save.
4. Under **Product links → Search Console links**:
   - Click **Link**, pick the `deepgrain.ai` Search Console property you set up in Step 1, pick the web data stream, confirm. This unlocks the Search Console reports inside GA4.
5. Optional but recommended, filter your own visits:
   - **Data Streams → Web stream → Configure tag settings → Show all → Define internal traffic.**
   - Add a rule: traffic_type = `internal`, IP address = your home/office IP.
   - Then **Data settings → Data filters → Internal Traffic → set to Active**.

---

## Step 4, you don't need to do anything for IndexNow

It runs itself every 10 minutes. If you ever want to force a re-ping of every URL (for example after a big content overhaul), an admin can call:

```
POST https://todgunffzlopbenewfnp.supabase.co/functions/v1/ping-indexnow?force=true
Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
```

---

## What "good" looks like after a few weeks

- Search Console **Coverage** report shows most URLs as **Indexed**.
- Search Console **Performance** shows impressions climbing for queries like "AI operating system", "people ops AI", "organisational consultancy".
- GA4 **Acquisition → Traffic acquisition** shows a growing **Organic Search** channel.
- Bing Webmaster shows pages indexed within days, courtesy of IndexNow.

---

## If something looks broken

- **Verification fails**: make sure you published after editing `index.html`. View source on https://deepgrain.ai/ and confirm the meta tag is present with your real code.
- **Sitemap rejected**: open https://deepgrain.ai/sitemap.xml in a browser, confirm it loads as XML. It should.
- **No data in GA4 Realtime**: check that you're not blocking analytics with an ad blocker on your own machine.
