

## Goal

Add an internal-only checklist page at `/seo-checklist` that walks you through the three Search Console verification steps for `deepgrain.ai`: domain verification, sitemap submission, and URL Inspection on the homepage. Persistent per-step completion state in `localStorage` so progress survives reloads.

## Approach

A single new route, noindexed, not linked from any public nav — you reach it by typing the URL. Three numbered steps, each as a card with: a one-line goal, the exact actions to take in Search Console, a deep link straight into the right GSC screen, copy-to-clipboard buttons for the values you'll paste (your domain, your sitemap URL, your homepage URL), and a checkbox that marks the step done.

A small progress indicator at the top ("1 of 3 complete") and a "Reset checklist" link at the bottom.

### The three steps

1. **Verify the domain in Search Console**
   - Goal: prove ownership of `deepgrain.ai` so GSC will show indexing data.
   - Action summary: open Search Console → Add property → choose **Domain** (not URL prefix) → enter `deepgrain.ai` → copy the TXT record GSC gives you → add it at your DNS provider → click Verify.
   - Deep link: `https://search.google.com/search-console/welcome`
   - Copy buttons: `deepgrain.ai`
   - Note that DNS propagation can take a few minutes to a few hours; if Verify fails, wait and retry — don't delete the property.

2. **Submit the sitemap**
   - Goal: tell Google where every canonical URL on the site lives.
   - Action summary: in Search Console for the verified `deepgrain.ai` property → left nav → **Sitemaps** → paste the sitemap path → Submit. Confirm status reads "Success".
   - Deep link: `https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Adeepgrain.ai`
   - Copy buttons: `https://deepgrain.ai/sitemap.xml` and the path-only form `sitemap.xml`
   - Note: the sitemap is already generated at build time by `vite-plugins/deepgrain-seo.ts` and served from `public/sitemap.xml` — nothing to deploy, just submit.

3. **Run URL Inspection on the homepage**
   - Goal: force Google to fetch and render the homepage now, confirm the prerendered HTML is what Googlebot sees, and request indexing.
   - Action summary: in Search Console → top search bar → paste `https://deepgrain.ai/` → wait for the inspection result → click **Test live URL** → when it returns, click **View tested page → Screenshot** and **HTML** to confirm the rendered content includes the H1 and hero copy → back on the inspection screen click **Request indexing**.
   - Deep link: `https://search.google.com/search-console/inspect?resource_id=sc-domain%3Adeepgrain.ai&url=https%3A%2F%2Fdeepgrain.ai%2F`
   - Copy buttons: `https://deepgrain.ai/`
   - Note: this is also the definitive answer to the earlier "is the site invisible to crawlers?" question — the rendered HTML preview in URL Inspection is exactly what Google indexes.

### State

- `localStorage` key `deepgrain.seo-checklist.v1` storing `{ step1: boolean, step2: boolean, step3: boolean }`.
- Hydrate on mount, write on every change. No backend, no auth — this is a personal operator tool.

### Visual treatment

Reuse existing site chrome and tokens — `BarkSection` for the page background, `Eyebrow` + display heading for the page header, the existing card styling pattern from `IntelligenceTeaser`/`ArticleCard` for each step, `PillButton` (filled) for the "Open in Search Console" deep links and (outline) for "Copy". Checkbox uses a simple bordered square with a brass tick when checked. No new design tokens.

`PageMeta` with `noindex` so the checklist itself never appears in search results. Page is wrapped in `<main>` via the existing `SiteShell`, and gets a `data-no-rule` on its first section so the auto-applied brass top-rule from `<main>` is suppressed (the page sits directly under the nav, no rule needed above the first card).

## Files

- `src/pages/SeoChecklist.tsx` — new page. Three step cards, progress indicator, reset link, `PageMeta` with `noindex`, all state in a single `useState` + `useEffect` pair against `localStorage`.
- `src/App.tsx` — register `<Route path="/seo-checklist" element={<SeoChecklist />} />` inside the existing lazy-loaded route block (`const SeoChecklist = lazy(() => import("./pages/SeoChecklist"))`).

## Out of scope

- Linking the checklist from the public nav, footer, or sitemap — it stays unlisted and noindexed.
- Adding the checklist URL to `sitemap.xml` or `robots.txt`.
- Automating any GSC API calls (would require OAuth + a service account; not worth it for a one-time setup).
- The earlier debate about migrating to Next.js / adding a prerender plugin — unchanged from the previous turn's conclusion (not needed).

