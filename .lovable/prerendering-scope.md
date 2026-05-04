# Prerendering scope and recommendation

## Why this matters

Deepgrain is a Vite + React SPA. The shipped HTML is a near-empty `<div id="root">`. Crawlers that do not execute JavaScript see no content, no JSON-LD, no meta past what is in `index.html`.

Who that hurts:
- **LLM crawlers** (GPTBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended) almost universally do not execute JS. They see nothing on every Intelligence page.
- **Bing** is a partial JS renderer at best. Coverage is unreliable.
- **Social scrapers** (LinkedIn, Twitter, Slack, iMessage previews) read static HTML only. They do see the homepage `og-image.png` but per-article OG tags are missed.
- **Google** does render JS, but with delay and budget limits. Static HTML is faster to index and ranks more reliably.

For a publication-led growth strategy, prerendering is the single highest-leverage technical change.

## Options

### Option A: vite-plugin-prerender / vite-plugin-ssr-prerender (build-time)

Run a headless Chromium in the build, visit each route, save the rendered HTML to `dist/<route>/index.html`. React hydrates on the client.

- Pros: pure static output, works on any static host (Netlify, Vercel, Cloudflare Pages, Lovable).
- Cons: adds Puppeteer or Playwright (~250 MB Chromium download) to the build. Build time goes from seconds to a couple of minutes for ~70 routes. Needs `react-helmet-async` to be SSR-aware (it already is).

### Option B: react-snap (postbuild hook)

Older but battle-tested. Postbuild script that crawls localhost and writes static HTML.

- Pros: zero config, mature.
- Cons: unmaintained (last release 2019), uses Puppeteer too.

### Option C: Migrate to a framework with built-in SSG (Astro, Next.js)

Move the project to Astro (perfect fit for content-led sites) or Next.js with `output: "export"`.

- Pros: SSG is a first-class citizen, smaller bundles, better DX for content sites long term.
- Cons: large rewrite. Not appropriate for this loop. The runtime stack guidance for this project is React 18 + Vite + Tailwind; framework switches would be off-platform.

### Option D: Edge-rendered with a lightweight prerender service (Prerender.io)

Sit a service in front that renders on demand and caches by URL.

- Pros: no build changes.
- Cons: ongoing cost, third-party dependency, not free under any meaningful traffic.

## Recommendation

**Option A**, using `vite-plugin-prerender-spa` or a small custom Puppeteer postbuild script that mirrors what `scripts/build-seo-indexes.mjs` already does for sitemap generation. We already have a smoke-test script that walks every MDX route, so the pattern is proven.

## Open questions for the user

1. **Hosting**: where is `deepgrain.ai` hosted in production? Lovable's published URL serves the SPA `index.html` for every route. To ship prerendering we need to either:
   - (a) keep using Lovable's hosting and confirm it will serve `dist/intelligence/foo/index.html` when the path is `/intelligence/foo`, or
   - (b) move to a host that does (Netlify, Vercel, Cloudflare Pages) with a redirect rule that prefers the prerendered file and falls back to `index.html`.
2. **Build time tolerance**: a full prerender of ~70 routes takes ~60-120s on top of the existing build. Acceptable?
3. **Dynamic routes**: today every public route is enumerated in `sitemap.xml`. We can use that as the input list, so no separate config needed.

## Suggested execution plan (when greenlit)

1. Add a dev dependency on `puppeteer` (or `playwright-chromium` which is smaller).
2. Add `scripts/prerender.mjs` that:
   - Spins up `vite preview` in the background.
   - Reads every URL from `public/sitemap.xml`.
   - Visits each, waits for `document.querySelector("h1")`, captures `document.documentElement.outerHTML`.
   - Writes to `dist/<path>/index.html`.
   - Strips dev-only artifacts (Vite client script, react-refresh).
3. Wire as `postbuild` in `package.json`.
4. Add a smoke test that grep'ing the prerendered HTML finds the article H1, JSON-LD blocks, and meta description.
5. Ship a hosting redirect rule so the prerendered file is preferred.

Estimated effort: half a day, plus hosting verification with the user.
