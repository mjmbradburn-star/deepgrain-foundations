## Model note

There is no "Claude Fable" model in the Lovable AI Gateway catalog. The Anthropic family is not currently selectable here, the closest peers are `openai/gpt-5.5` and `google/gemini-3.1-pro-preview`. The site has no live AI feature today (no `useChat`, no edge function calling the gateway), so this is not blocking. If you want a Claude-backed feature added, confirm the exact model ID and where it should run (Brain chat? Intelligence Q&A?).

## What the audit found

- **Search footprint**: Semrush sees 1 organic keyword, 0 estimated traffic, no backlinks indexed. The site is effectively pre-rank. Upside is large because everything you publish is net-new surface.
- **Content depth**: Strong, ~50 MDX intelligence articles, answers corpus, pillars, glossary, llms.txt, llms-full.txt, feed.xml, sitemap. The plumbing is already better than 95% of consultancy sites.
- **Lighthouse findings (last published)**:
  - LCP slow, hero is a large forest image with no preload, no `fetchpriority="high"`, and the H1 is web-font dependent.
  - Contrast, some muted text on the dark hero and cream body fails AA.
- **Design/UX gaps from the homepage capture**:
  - Hero is 100vh of typography on a dark photo, no proof, no positioning sentence, no answer to "what does deepgrain sell". Mobile users at 430px get one giant word per line.
  - Cookie banner covers the primary CTA on mobile.
  - No visible above-the-fold social proof (logos, named clients, named outputs).
  - Nav has 7 top-level items, no active state, no current-section highlight.
- **SEO/AEO gaps**:
  - Per-route meta is via `PageMeta`/Helmet, that is fine, but most intelligence pages share a generic OG image.
  - No `Person` schema for Matt, no `ProfessionalService` schema, no `WebSite` SearchAction. Organization JSON-LD is present via `SiteEntityLd`.
  - Answers entries emit QAPage JSON-LD but the page is a single long scroll, each Q is not a dedicated URL, which weakens AEO citations.
  - Internal links from the homepage to intelligence are thin.
  - No FAQ on the homepage, no "what we do / who it is for" structured copy, both are AEO-friendly formats.

## The task list

Ordered by impact-to-effort. Each task is a single shippable unit.

### P0, ship this week (safe wins, no design risk)

1. **Hero LCP fix**. Add `<link rel="preload" as="image" fetchpriority="high">` for the hero forest image in `index.html`. Add explicit width/height. Set `font-display: swap` on the display serif `@font-face`. Target: LCP under 2.5s on 4G.
2. **Contrast pass**. Replace any `text-muted-foreground/50`, `text-cream/60` etc. that fail AA on the dark hero and cream body. Use semantic tokens at full opacity. Re-test the two flagged surfaces.
3. **Cookie banner mobile fix**. Move banner to bottom-right with max-width on >=sm, on mobile reduce height and never overlap the primary CTA. Test at 430px.
4. **Homepage meta tightening**. Title to a benefit-led 55-char string ("Deepgrain, AI operating systems for founder-led companies"). Meta description rewritten to 150 chars with a verb and an outcome.
5. **JSON-LD additions**:
   - `Person` for Matthew Bradburn on `/about` with sameAs (LinkedIn, X).
   - `ProfessionalService` on `/` with serviceType, areaServed, founder.
   - `WebSite` with `potentialAction` SearchAction pointing at `/intelligence?q=`.
6. **Mark the two Lighthouse findings fixed and trigger a republish + re-scan** after 1 and 2 land.

### P1, next, content + AEO leverage

7. **Per-answer URLs**. Promote `/intelligence/answers#slug` to real routes at `/intelligence/answers/:slug`. Each gets its own `<title>`, meta, QAPage JSON-LD, and a single H1 matching the question verbatim. Old hash links 301 to the new URLs via in-app redirect. This is the single biggest AEO move on the site, Perplexity and Google AIO cite single-question pages, not scroll-anchors.
8. **Homepage FAQ block**. 5 questions, 40-80 words each, the literal phrasings from GSC and Semrush: "What is an AI operating system", "How do you identify efficiency gaps AI can fill", "How is Deepgrain different from a management consultancy", "Who do you work with", "How long does an engagement take". Wired to FAQPage JSON-LD.
9. **"What we do" structured strip** on the homepage, three columns: Read, Craft, Scale, each with a one-line outcome and a link to a case study. Replaces nothing, adds above-the-fold meaning.
10. **Proof strip** under the hero, 5 client/sector logos or named outcomes. If logos are not approved, use named outcomes ("Cut hiring cycle 38% at a Series B defence tech company").
11. **OG images per intelligence article**. Build a single OG image generator (static, at build time, using `satori` or a templated PNG per slug from frontmatter title + category). Removes the shared generic OG.
12. **Internal linking from homepage**. Add a 3-card "Latest from Intelligence" section pulling the three most recent MDX entries. Currently the homepage barely links into the corpus.

### P2, design + UX polish

13. **Mobile hero rebalance**. At <=430px, drop hero to 70vh, shrink the display type to fit "Work with the grain." on three lines max, move the subhead and CTAs above the fold.
14. **Nav active state and current-section highlight** on `/method` and `/enablement`, plus a sticky thin progress bar on long intelligence articles.
15. **Brain page conversion pass**. Above-the-fold preview of one card, clearer single CTA, social proof of subscribers ("Read by heads of People at...").
16. **Reading experience on intelligence**. Slightly wider measure on `lg+`, drop-cap on the first paragraph, "Save to read later" stub (copy link), reading-time and last-updated visible at the top.
17. **404 page**. Replace with a useful one, search box plus three recommended reads from intelligence.

### P3, ongoing growth + governance

18. **Topic clusters**. Pick the three highest-intent clusters (efficiency gaps, AI operating systems, People Ops champions). For each, audit pillar -> spokes -> answers coverage, fill the gaps, add hub pages where missing.
19. **GSC + IndexNow ping wired to publish**. On deploy, fire `ping-indexnow` for changed routes (the function already exists). Add a check that sitemap.xml lastmod is bumped on the touched URLs.
20. **Quarterly SEO scan + Semrush trend check** as part of the release ritual. Snapshot in `docs/seo-reports/YYYY-Qn.md`.

## What I will NOT touch without further sign-off

- Palette, typography pairing, brand voice. They are working and on-memory.
- Routing structure for non-answers pages.
- The Brain email funnel mechanics (Supabase functions, Resend integration).
- The MDX content body of existing articles (only frontmatter and structural wrappers).

## How I propose to ship

Three batches, you approve each before I start:

- **Batch A (P0, tasks 1-6)**, one round trip. Low risk, mostly meta + CSS + JSON-LD.
- **Batch B (P1, tasks 7-12)**, two round trips because per-answer routes need redirect + sitemap + test updates.
- **Batch C (P2-P3, tasks 13-20)**, scoped per task, you pick the order.

Reply with "go A", "go A and B", or edits to the list and I will start.
