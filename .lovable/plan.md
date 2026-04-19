

## Deepgrain Upgrade Plan — three specs, sequenced

### Reality check first

These three specs cover **two separate Lovable projects**:

| Spec | Where it lives | Action here |
|---|---|---|
| **AIOI** (AI Operating Index) | `aioi.deepgrain.ai` — explicitly a **separate Lovable project** | Spin up as a new project when you're ready. Not built in this codebase. |
| **Email Capture** | Footer + Work page on this site, plus AIOI + Intelligence | Build the deepgrain.ai portion here (footer form, Work page form, subscribers table). |
| **Intelligence Hub** | `deepgrain.ai/intelligence` — this project | Build here in full. |

The spec mentions Next.js, n8n, Loops, Resend, MDX/Contentlayer. This project is Vite + React + Lovable Cloud. I'll adapt: React Router routes instead of App Router, MDX via `@mdx-js/rollup`, Lovable Cloud (Supabase) for the subscribers table, Lovable Email for sequences (no n8n/Loops needed at v1).

---

### Phase 1 — Intelligence Hub foundation (this project)

**Routing & data model**
- New routes: `/intelligence` (index), `/intelligence/:slug` (article), `/intelligence/category/:name` (category)
- Add MDX support to Vite (`@mdx-js/rollup` + `remark-gfm`)
- Articles live in `src/content/intelligence/*.mdx` with frontmatter (title, slug, category, description, keywords, readTime, publishedAt, author)
- A small `articles.ts` registry auto-built from MDX glob imports

**Article page template**
- Header band (green) → article body (linen) → in-article AIOI CTA (green) → footer (walnut) with related articles + email capture
- Typography exactly per spec (Cormorant H1/H2/H3, 18px body, brass-bordered callouts, walnut code blocks)
- React Helmet (`react-helmet-async`) for `<title>`, meta description, OpenGraph, canonical, JSON-LD `Article` schema

**Hub index + category pages**
- `/intelligence`: hero, all 25 articles grouped by category, filter pills
- `/intelligence/category/:name`: filtered list

**SEO infrastructure**
- `public/llms.txt` with the spec content
- `public/sitemap.xml` generated at build time (small Vite plugin)
- `public/robots.txt` updated to reference llms.txt

**Article content at launch**
- Scaffold all 25 article files with frontmatter + a placeholder body so routes/SEO are live
- You fill in real prose article-by-article (or paste from Notion and I'll reformat)

**Homepage integration**
- New section between `LogoCarousel` and `Invitation` on `/` — linen bg, "Deepgrain Intelligence" eyebrow, 48px Cormorant headline, 3 featured article cards (green bg, cream text), "Browse all intelligence →" pill

---

### Phase 2 — Email capture (this project's portion)

**Backend**
- New `subscribers` table in Lovable Cloud:
  - `id, email (unique), name, source ('main-site'|'aioi'|'intelligence'), entry_article, subscribed_at, unsubscribed_at, status`
  - RLS: public INSERT, service-role SELECT/UPDATE
- Edge function `subscribe` to dedupe + insert + (optionally) trigger welcome email

**Frontend `<EmailCapture />` component**
- Props: `source`, `entryArticle?`, `layout: 'inline'|'stacked'`, `background: 'green'|'linen'|'walnut'`
- States: idle / submitting / success ("You're in. First email on its way.") / error
- Honeypot field for spam

**Placements**
- Footer (replaces current footer copy area): "Deepgrain Quarterly" eyebrow + italic Cormorant copy + email field
- Work page after case studies: "Follow the work" inline row
- Bottom of every Intelligence Hub article: "Keep reading" capture, auto-tagged with `entry_article` slug

**Welcome email (v1, Lovable Email)**
- One immediate welcome email per source (main-site / intelligence) using the spec copy
- Multi-step drip sequences (day 3, day 7, etc.) deferred — flag as Phase 2.5 once Lovable Email queue is comfortable
- AIOI-source sequences only matter once AIOI exists

---

### Phase 3 — AIOI (separate Lovable project)

When you're ready, say the word and I'll **spin up a new Lovable project** for `aioi.deepgrain.ai` and build:
- Design tokens, PillarChip, TierBadge, OptionCard, ProgressBar, RadarChart, HotspotCard, etc.
- Routes `/`, `/assess`, `/assess/start`, `/assess/q/:step`, `/assess/processing`, `/assess/r/:slug` (Overview/Plan/Report/Invite tabs), `/benchmarks`, `/manifesto`, `/pillars`, `/ladder`
- Supabase schema (respondents, responses, reports, questions, question_options, outcomes_library, benchmarks_materialised, events)
- For Claude scoring + PDF: spec says n8n + Browserless + R2. In Lovable Cloud we'd do this with **edge functions calling Lovable AI (Claude Sonnet 4) directly**, PDF via headless render, storage in Lovable Cloud Storage. Cleaner, fewer moving parts. We can decide that when we start.

This is its own sequence and won't touch the current project.

---

### Recommended execution order

1. **Phase 1A** — MDX setup + article template + 25 article scaffolds + hub index + homepage section
2. **Phase 1B** — SEO files (llms.txt, sitemap, robots, JSON-LD verified)
3. **Phase 2A** — `subscribers` table + `<EmailCapture />` component + footer + Work + article footer placements
4. **Phase 2B** — Welcome email (single email per source)
5. **Phase 3** — AIOI in a new project (your call when)

I'll execute one phase per message so you can review and approve as we go. Tell me **"Go Phase 1A"** to start, or which order you'd prefer.

