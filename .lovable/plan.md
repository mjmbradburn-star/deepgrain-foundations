ns

# Growth plan: search + LLM visibility

Goal: more qualified traffic from Google and more citations in ChatGPT, Claude, Perplexity, Gemini answers. Sequenced by leverage, not effort.

## Current state (verified)

- Article pages already ship: per-page title, description, canonical, OG/Twitter, Article + Breadcrumb + FAQ JSON-LD, bespoke OG cards, related articles, cluster chips.
- `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Googlebot, Bingbot.
- `llms.txt`, `llms-full.txt`, `sitemap.xml`, RSS feeds present and built by `scripts/build-seo-indexes.mjs`.
- GA4 wired (G-93DFWMX8GP), 25 long-form pillar/article MDX files live, plus People Ops cluster.
- Gap: site is a Vite SPA. Crawlers without JS rendering see an empty `#root`. No author Person schema. No visible Updated date. No TL;DR blocks. No Search Console / Bing Webmaster verification recorded. No backlink or distribution motion.

---

## Track 1: Technical (engineering)

Ordered by impact.

### 1.1 Static prerendering for all content routes  *(highest leverage)*

- Add a `postbuild` step using a small Puppeteer/Playwright script that visits every route in `sitemap.xml`, waits for hydration, and writes the rendered HTML to `dist/<route>/index.html`.
- Configure Vite/host to serve the prerendered HTML and let React hydrate on top.
- Result: GPTBot, ClaudeBot, PerplexityBot, CCBot, social scrapers all get full HTML, JSON-LD, and meta tags on first byte.

### 1.2 Author entity + richer schema

- Add Person JSON-LD for Matthew Bradburn on `/about` with `sameAs` (LinkedIn, X, GitHub if any), jobTitle, image, knowsAbout.
- Reference the same `@id` from every Article's `author`. (Already partially wired.)
- Add `dateModified` to article frontmatter and Article JSON-LD.
- Add `WebPage` + `BreadcrumbList` to non-article pages (Home, About, Work, Enablement, Method, Pillars, Category).

### 1.3 Performance + Core Web Vitals pass

- Lighthouse audit homepage + one article + one pillar. Track LCP, CLS, INP.
- Quick wins likely: defer Cormorant font swap, lazy-load below-fold images, audit hero on mobile (430px viewport).

### 1.4 Search Console + Bing Webmaster

- Add verification meta tags. Submit sitemap. Set up weekly review of Coverage and Performance reports.

### 1.5 Internal link graph upgrades

- Visible breadcrumbs on every content page (data already in JSON-LD).
- "Read next" beyond Related articles: prev/next within cluster.
- Pillar hub pages: list all cluster articles with descriptions + reading time, not just titles.

### 1.6 Sitemap + feeds hygiene

- Add `lastmod` per URL from frontmatter `updatedAt`.
- Split sitemap by section (intelligence, pillars, glossary, answers) if >500 URLs eventually.
- Include `image:image` entries in sitemap for hero images.

---

## Track 2: Content (editorial)

LLMs and Google reward sourced, structured, freshly-dated reference material.

### 2.1 Article-level upgrades (apply to every MDX)

- **TL;DR block** at top: 3–5 bullets. LLM retrievers chunk and quote these directly.
- **Key takeaways** at bottom. Same reason.
- **Visible Published / Updated** dates near title.
- **Author byline** linking to /about#matthew-bradburn.
- **Outbound citations** to primary sources (papers, vendor docs, books). LLMs over-weight pages that look like reference material.
- **FAQ block** at the bottom of every article (already supported via `faqs` frontmatter, audit which articles are missing it).

### 2.2 Pillar hub depth

- Each pillar page: 200–400 word intro framing the topic, then the cluster article list with descriptions, then a definitions/glossary strip, then a "Start here / Go deeper" pathway.
- This is the page Google ranks for the head term and LLMs cite for definitions.

### 2.3 Glossary expansion

- One entry per recurring concept (operating system, operating model, grain, AI readiness, operating intervention, etc.).
- Each glossary entry: definition, 2 sentence elaboration, "see also" links into pillars/articles. DefinedTerm JSON-LD.
- Glossary entries punch above their weight in LLM citations.

### 2.4 Answers / questions content type

- `IntelligenceAnswers` already exists. Mine "People also ask" and AlsoAsked for the head queries each pillar targets, write a 200–400 word answer per question, link into the relevant article. Mark up as QAPage.

### 2.5 Comparison pages

- `IntelligenceCompare` exists. Build out the obvious "X vs Y" pages (operating system vs operating model, founder vs operator mode, strategy vs operating reality, change programme vs operating intervention). Comparison pages convert well in both Google and LLM answers.

### 2.6 Editorial cadence

- One new long-form per week, one updated piece per week (republish with bumped `updatedAt`). Freshness is a ranking signal and triggers re-crawl.

---

## Suggested sequencing (next 8 weeks)

```text
Week 1   Prerendering + Search Console/Bing verification + Lighthouse baseline
Week 2   Author Person schema, dateModified, visible dates, breadcrumbs sitewide
Week 3   TL;DR + Key takeaways across all 25 articles
Week 4   Pillar hub depth pass + 3 new comparison pages
Week 5   Glossary build-out (15-20 entries) + QAPage answers
Week 6   First guest post pitched + LinkedIn cadence live + newsletter weekly
Week 7   Performance pass + sitemap lastmod + image sitemap
Week 8   LLM citation tracking dashboard, review what's working, double down
```

---

---

## What I'd build first if you approve

1. Prerendering pipeline (unlocks everything else).
2. Author Person schema + visible Published/Updated dates + sitewide breadcrumbs.
3. TL;DR + Key takeaways component, applied across every article.

Tell me which tracks to start, or I'll default to those three in that order.  
  
I want you to run Track 1 and 2 as Track 3 is VERY human 