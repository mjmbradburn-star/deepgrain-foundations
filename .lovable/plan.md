# Audit + delivery log

## Shipped in Batch A + B (this round)

- **SiteEntityLd extended**: added `ProfessionalService` entity (serviceType, areaServed, BusinessAudience) alongside the existing Organization, Person, WebSite blocks. Sitewide.
- **Homepage FAQ block**: 5 questions in literal GSC/Semrush phrasings, mounted as a `<HomeFAQ />` section above `Invitation`. Mirrored exactly in a `FAQPage` JSON-LD passed to `PageMeta` so the schema matches the rendered prose.
- **Homepage meta tightened**: description rewritten to a verb-led 150-char sentence.
- **Per-answer detail pages wired into the journey**: `/intelligence/answers` hub now links each Q to its `/answers/:slug` canonical page (in addition to keeping the deep link into the source article).
- **Legacy answer URL redirect**: `/intelligence/answers/:slug` now 301-redirects (client-side replace) to `/answers/:slug`, in case any external link or old indexed URL exists in that shape.
- **Sitemap**: appended all 15 `/answers/:slug` entries.

## Already present, no action needed

- Hero LCP preload + `fetchpriority="high"` + responsive srcset (q=45 webp).
- `/answers/:slug` routes with QAPage JSON-LD + breadcrumb.
- `WhatWeDo` ("Read. Craft. Scale.") strip on home.
- `IntelligenceTeaser` (3 latest articles) on home.
- `LogoCarousel` proof strip under hero.
- Organization, Person, WebSite JSON-LD sitewide.
- Per-route canonical + Helmet meta via `PageMeta`.

## Intentionally deferred

- **Per-article OG image generator** (P1/11): real infra change, scope as a standalone batch with `satori` at build time.
- **WebSite SearchAction**: skipped until `/intelligence` accepts a `?q=` parameter. Adding it now would point Google at a non-functional search target.
- **Contrast pass**: no specific failing surfaces flagged. Will re-run Lighthouse after this batch and fix only what the scan reports.
- **Cookie banner mobile rebalance**: current implementation is `bottom-4 left-4 right-4` with `sm:max-w-md`, sits well below the hero CTA on every viewport tested. No change needed.

## What I will NOT touch without further sign-off

- Palette, typography pairing, brand voice.
- Routing structure for non-answers pages.
- The Brain email funnel mechanics.
- The MDX content body of existing articles.

## Shipped in Batch C (this round)

13. **Mobile hero rebalance** — Hero drops to 70vh ≤640px, display type scales from 2.25rem on xs, subhead + CTAs lift above the fold. `Hero.tsx`.
14. **Nav active state + reading progress** — Section-aware highlight (any `/intelligence/*` or `/answers/*` highlights Intelligence; same for Method, Enablement, Brain), `aria-current="page"` on exact match. New `ReadingProgress` sticky brass bar mounted on article, pillar, cluster and answer routes via `SiteShell`.
15. **Brain page conversion pass** — Added the "Read by heads of People at…" subscriber proof line under the primary CTA. Single primary CTA preserved.
16. **Reading experience on intelligence** — Wider measure on lg+ (680/720px), drop-cap on the first article paragraph (scoped to `.article-prose`), `SaveLink` ("Save to read later") stub in both the article header and the post-body footer. Reading time + last-updated were already at the top.
17. **Useful 404** — Replaced with: brass search box that routes to `/intelligence?q=`, three recommended reads (featured, topped up with most recent), single back-to-start CTA. Stays `noindex`.
18. **Topic cluster audit** — `docs/topic-cluster-audit.md`. Three clusters (efficiency gaps, AI operating systems, People Ops champions) mapped pillar → spokes → answers with explicit gaps and a build backlog.
19. **IndexNow + lastmod check** — `scripts/check-sitemap-lastmod.mjs` (non-blocking pre-publish sanity check). The actual IndexNow ping already runs from `supabase/functions/ping-indexnow` on a 10-minute pg_cron, detecting sitemap.xml diffs by content hash.
20. **Quarterly SEO snapshot** — `docs/seo-reports/2026-Q2.md` template ready to fill at end of quarter.

## Open items

- The `/intelligence?q=` target for the 404 search and the WebSite `SearchAction` still need the `/intelligence` list page to actually consume `?q=`. Cheap follow-up, not in this batch.
- Run Lighthouse post-publish to confirm hero LCP + contrast pass and clear the two stale Lighthouse findings.

