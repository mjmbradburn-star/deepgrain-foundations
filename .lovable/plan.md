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

## Next: Batch C (P2–P3) when you're ready

13. Mobile hero rebalance at <=430px
14. Nav active state + sticky reading progress
15. Brain page conversion pass
16. Reading experience polish on /intelligence
17. Useful 404 page
18. Topic clusters audit (efficiency gaps, AI OS, People Ops champions)
19. GSC + IndexNow ping on deploy
20. Quarterly SEO scan ritual

Reply "go C" or pick specific items.
