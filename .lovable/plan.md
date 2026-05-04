
# Authority push: hacky wins + deep plays

Two tracks. Track A is the clever/hacky stuff I can ship in one session, mostly machine-readable surfaces that LLMs and crawlers reward out of proportion to the effort. Track B is the proper content and backlink work, where I can do most of the production now and you do the human-in-the-loop posting.

## Track A — Hacky, ship today

### 1. Glossary page as a citation magnet
Single page at `/intelligence/glossary` listing 20-30 short definitions (AI OS, Operating Intervention, Read·Craft·Scale, Grain, Champion Model, Operating Ladder, Operating Cadence, Five Pillars, AI Workspace, etc.). Each entry:
- 1-2 sentence quotable definition (LLMs lift these verbatim)
- `DefinedTerm` JSON-LD per entry, wrapped in a `DefinedTermSet`
- Anchor `id` per term so other articles can deep-link `#ai-operating-system`
- Internal link out to the pillar article

Why hacky: glossary pages punch way above their weight in Perplexity/Claude citations, and the schema makes them eligible for Google's definition snippets.

### 2. "Compare" pages targeting zero-competition long-tail
Three thin but useful pages:
- `/intelligence/ai-operating-system-vs-operating-model`
- `/intelligence/ai-os-vs-ai-platform`
- `/intelligence/ai-os-vs-automation`

Each is a comparison table + 200 words + FAQ JSON-LD. These are the exact phrasings people Google after reading the pillar. Currently zero results compete properly. Internal links from the pillar into these.

### 3. HowTo + Article schema retrofit
Add `HowTo` JSON-LD to `/setting-up-your-ai-workspace` (already a procedural article, free schema win), and `Article` + `BreadcrumbList` to every Intelligence page that's missing it. Helper in `PageMeta.tsx`.

### 4. `/intelligence/answers` hub for AEO
A page that answers the actual GSC query strings as H2s ("What is an AI OS?", "What is an AI based operating system?", "How does an AI operating system differ from automation?"). Each answer is 40-60 words, schema'd as `QAPage`. This is pure Answer Engine Optimisation bait. Cost: ~1 page.

### 5. RSS + JSON Feed
Generate `/feed.xml` and `/feed.json` from the intelligence manifest. Submit to Feedly, Inoreader, and the LLM crawlers that respect them. Quiet syndication channel; runs forever once built.

### 6. `humans.txt`, updated `security.txt`, `ai.txt`
- `ai.txt` declaring permitted training/citation use (signal to AI crawlers we're cooperative)
- `humans.txt` with author bios + canonical URLs (helps E-E-A-T)

### 7. Author entity pages
`/about/matthew-bradburn` with `Person` JSON-LD, sameAs links to LinkedIn/X/GitHub, and a list of authored articles. Then set `author` on every Intelligence page's JSON-LD to point at this URL. This is the single biggest E-E-A-T lever you're missing.

### 8. Internal "cited by" rails
Auto-generate at the bottom of each pillar a "Referenced in" list pulled from the manifest (which articles link here). Free, dynamic, increases on-page link density to the pillar over time.

### 9. OG image per article
Vite plugin generates a per-article OG image with the title rendered on the cream/walnut palette. Better social CTR, better LLM previews. One-time build cost.

### 10. Sitemap split + news sitemap
Split `sitemap.xml` into `sitemap-pages.xml`, `sitemap-intelligence.xml`, `sitemap-news.xml` (last 48h of new articles). News sitemap gets faster indexing for fresh content.

## Track B — Proper depth, mostly buildable now

### 11. Rewrite the four placeholder articles
`five-pillars-of-ai-readiness`, `ai-operating-ladder-five-tiers`, `from-ai-experiments-to-ai-infrastructure`, `why-ai-pilots-stall-at-production` are all "placeholder scaffold". Google sees thin content linking to your pillar, which dilutes the cluster. I'll rewrite each to 1,200-1,800 words with FAQs, tables, and the same structural rigour as the AI OS pillar. This is the single biggest authority unlock.

### 12. One genuine linkable asset: "AI Operating Index 2026"
A short report (10-15 pages, served as a real HTML page on `/intelligence/ai-operating-index-2026` plus a downloadable PDF). Built from your existing frameworks plus a synthesised dataset/POV. Reports get cited by Substack/journalists in a way blog posts never do. I can draft the content and ship the page now; you can refine the numbers.

### 13. Backlink production (artefacts I can produce now, you post)
I'll generate, ready to copy-paste:
- 3 LinkedIn long-form posts (AI OS, AI Workspace, Champion Model) with canonical link back
- 1 Hacker News "Show HN" post for AIOI
- 1 Indie Hackers post
- 5 directory submission blurbs (Clutch, The Org, Crunchbase, Consultancy.uk, AI Consultancies)
- 2 guest post pitches (peopleops.com, CharthHR/Charthop blog) with full draft articles attached
- A Reddit-safe post for r/PeopleOps and r/HRTech (no-link, value-first, with a soft mention)

All written in your voice, no em dashes, ready to ship.

### 14. Substack/newsletter-bait teardown
One long-form teardown ("Why most AI pilots die between Q3 and Q1") designed for newsletter quotation. I draft it now.

### 15. Wikipedia-adjacent: contribute references
Identify 3-5 existing Wikipedia articles ("Operating model", "Enterprise AI", "AI agent") where Deepgrain Intelligence articles would qualify as legitimate references. I produce the suggested edits; you submit from a real account (Wikipedia rejects obvious self-promotion, so this is light-touch).

## What I'll ship in the next session if you approve

Ring A (today): items 1, 2, 3, 4, 6, 7, 8, 10. That's the glossary, three compare pages, schema retrofit, answers hub, ai.txt/humans.txt, author entity, cited-by rails, sitemap split. ~8 files touched, no credit spend on AI generation since it's mostly templated.

Ring B (today, parallel): items 11 (rewrite the four placeholders) and 13 (backlink artefacts as markdown drafts in `/docs/distribution/`).

Deferred to next pass (heavier): 5 (RSS), 9 (OG image generator), 12 (AIOI 2026 report), 14 (teardown), 15 (Wikipedia).

## What I'm explicitly not doing

- No black-hat link schemes, PBNs, or paid backlinks
- No keyword stuffing or doorway pages (the compare pages are genuinely useful, not thin)
- No AI-generated mass content; the rewrites are structured, in-voice, and pass the "would you publish this" test
- No new subdomains or redesigns

## Technical scope (for the build phase)

Files I'd touch:
- `src/pages/IntelligenceGlossary.tsx` (new), `IntelligenceAnswers.tsx` (new), `IntelligenceCompare.tsx` (new shared template), `AuthorPage.tsx` (new)
- `src/components/seo/PageMeta.tsx` — add `definedTerm`, `qaPage`, `howTo`, `person` schema helpers
- `src/components/intelligence/CitedByRail.tsx` (new) — reads manifest
- `src/content/intelligence/glossary.ts` (new data source)
- `src/content/intelligence/compare/*.mdx` (3 new files)
- `src/content/intelligence/{five-pillars,ai-operating-ladder,from-ai-experiments,why-ai-pilots-stall}.mdx` — full rewrites
- `public/sitemap.xml` → `sitemap.xml` (index) + `sitemap-pages.xml` + `sitemap-intelligence.xml` + `sitemap-news.xml`
- `public/ai.txt`, `public/humans.txt` (new)
- `vite-plugins/intelligence-manifest.ts` — extend with backlink graph for cited-by
- `docs/distribution/` (new dir) — LinkedIn posts, HN/IH posts, directory blurbs, guest pitch drafts
- Trigger `ping-indexnow` after deploy

## Success metric (30 days)

- Glossary page indexed and ranking for at least 5 "what is" queries
- All 4 placeholders rewritten and gaining impressions
- Pillar moves from position 75 → under 25
- At least 2 external backlinks from your distribution work
- First Perplexity/Claude citation visible in referer logs

Approve and I'll execute Ring A + Ring B in the next session.
