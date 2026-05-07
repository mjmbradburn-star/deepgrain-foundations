# Deepgrain — repo intent

> The goal of this file is one thing: make the intent of the codebase obvious to any agent (or human) reading the code, so changes stay in character.

---

## 1. What this repo is

This is the marketing site for **Deepgrain** — an organisational consultancy run by Matthew Bradburn. The site lives at `https://deepgrain.ai`. It is a Vite + React + TypeScript SPA, originally bootstrapped on Lovable, with Supabase for forms and email, and a non-trivial static-prerender + structured-data pipeline bolted on for distribution.

The site is the public surface of the consultancy. It does three jobs at once:

1. **Position the offering.** Explain what Deepgrain does (Read · Craft · Scale) and why it's different from slideware consulting or vendor-sold AI.
2. **Run a dual content engine.** ~50 long-form essays across two tracks (Deepgrain and People Ops AI) that prove the thinking and pull traffic.
3. **Capture leads.** A contact form for engagement enquiries, and `/brain` — a free email-gated resource ("The People Ops AI Brain") for the People Ops audience.

There is no e-commerce, no auth, no app behind the site. It is content + lead capture, full stop.

---

## 2. The offering, in plain English

Deepgrain is "organisational consultancy that reads the grain of how a company actually operates — then changes it without breaking what works."

The core engagement is structured as three named phases (visible everywhere on the site, and the spine of the IA):

- **Read** — A 30-day operating diagnostic. Where work actually flows, where decisions get made, where AI leverage is sitting unused.
- **Craft** — Agents and automations built into the workflow, function by function. Plus the enablement and training so the team can run them.
- **Scale** — Strategy at the top, capability across the team. Embed the operating cadence so the gains compound after Deepgrain leaves.

The brand promise is "**the capability stays with you, not in a vendor.**" Anything in the codebase that implies SaaS lock-in, vendor-managed services, or hand-wavy strategy decks is off-message.

---

## 3. Audience — two, equally weighted

This site is intentionally serving **two distinct buyer personas with equal weight**:

1. **Founders and operating leaders** at AI-native, defence-tech, financial-data, transit/mobility, and climate-venture companies — buyers of the bespoke Read · Craft · Scale engagement. Surfaced via `/method`, `/work`, sector-lens essays under `/intelligence/...`, and the contact form.
2. **People / HR leaders** (CPOs, HRBPs, TA leaders) — same Read · Craft · Scale offering, told through a People Ops lens. Surfaced via the People Ops track at `/intelligence/...` and the `/brain` lead magnet.

Treat **People Ops AI as a vertical specialty of the same consultancy, not a separate product or wedge funnel.** The Brain, the People Ops essays, and the People Ops feed (`/feed/people-ops.xml`) are not building a different business — they are the same business, talking to a different department's leader.

When making changes, ask: does this change serve both audiences, or only one? If only one, is the impact on the other deliberate?

---

## 4. Brand voice

The voice is the most distinctive thing about the site. Preserve it.

- **Wood-grain metaphor as the core image.** "Work with the grain", "every organisation has a grain", "read the grain", "scaling without breaking the grain". The visual identity (linen background, brass dividers, walnut/bark surfaces, Cormorant Garamond serif, the `BarkGrain` SVG turbulence component) is downstream of this metaphor — keep them coherent.
- **Anti-slideware, anti-vendor.** Copy explicitly contrasts with "benchmarks", "slideware", "platforms you rent". Avoid generic consulting noun-soup ("synergy", "transformation", "best-in-class").
- **Operator, not salesy.** Pricing is deliberately not on the site. The CTA is "write to matt@deepgrain.ai". Don't introduce form-driven pricing tiers, ROI calculators, or "book a discovery call" widgets unless explicitly asked.
- **Concrete and grounded.** Sentences tend to be short. Claims tend to be observable. Hero copy is `Work with the grain.` followed by `Every organisation has a grain. Most leaders are working against theirs without realising it.`

Brand colour tokens (defined in `tailwind.config.ts` and `src/index.css`): `green` (forest, primary), `brass` (accent), `walnut`, `cream`, `linen` / `linen-dark`, `bark` / `bark-2`, `body-text`. Use named tokens, not raw hex.

---

## 5. Site map (what lives where)

Routes are declared in `src/App.tsx`. Lazy-loaded page components live in `src/pages/`.

**Brand / funnel**
- `/` — Home (Hero, ICP triplet, Read·Craft·Scale, social proof, Simple AI primer video)
- `/method` — Read · Craft · Scale deep dive + FAQ
- `/work` — Case studies, outcomes, FAQ
- `/about` — Matthew + company
- `/contact` — Enquiry form (writes to Supabase `enquiries`)
- `/enablement` — Champion-training programme

**Intelligence (content engine)**
- `/intelligence` — Hub
- `/intelligence/category/:name`, `/intelligence/pillars`, `/intelligence/pillar/:slug`, `/intelligence/cluster/:slug`, `/intelligence/glossary`, `/intelligence/answers`, `/answers/:slug`
- `/intelligence/:slug` — Single essay (MDX)
- Three hand-built comparison routes: `/intelligence/ai-operating-system-vs-operating-model`, `/intelligence/ai-os-vs-ai-platform`, `/intelligence/ai-os-vs-automation`

**Lead magnet**
- `/brain` — People Ops AI Brain landing + email capture (calls `send-brain-welcome` edge function)
- `/brain/resend` — Resend the link

**Compliance**
- `/privacy`, `/cookies`, `/terms`, `/unsubscribe`, `/seo-checklist`, `*` (404)

**Sibling property (off this repo)**
- `https://aioi.deepgrain.ai` — referenced via `src/lib/aioi.ts` (`AIOI_URL`). The "AI Operating Index" is a separate property; this repo only links out to it.

---

## 6. Content engine: two tracks, one offering

Essays are MDX files under `src/content/intelligence/`:

- **Deepgrain track** — root of the folder. ~26 essays across Foundations, AI & Operating Systems, Method & Practice, Sector Lenses (defence-tech, financial-data, climate, transit/mobility, AI-native), Leadership & Craft.
- **People Ops AI track** — `src/content/intelligence/people-ops/`. ~23 essays across Foundations, Systems & Automation, Builders & Champions, Governance & Trust.

Both tracks publish into the same `/intelligence/...` URL space and the same React renderer (`src/pages/IntelligenceArticle.tsx`). They are differentiated by frontmatter `track`, category metadata in `src/lib/intelligence.ts`, and the People-Ops-only feed at `/feed/people-ops.xml`.

**Article structural contract** (enforced by `src/test/intelligence-structure.test.ts` — gated in prebuild):
- Every essay must include a `<TLDR>` block near the top and a `<KeyTakeaways>` block near the end. Both must be non-empty. These are the LLM retrieval anchors (see §7).
- Frontmatter supplies the `<h1>`. Don't put a top-level `#` heading in the MDX body.
- Heading hierarchy starts at `##` and doesn't skip levels.
- Every essay must have at least one internal `/intelligence/` link.
- If an essay exports `faqs`, the shape is validated by `src/test/faq-jsonld.test.ts` and surfaced as `FAQPage` JSON-LD.

The Vite plugin `vite-plugins/intelligence-manifest.ts` walks the MDX folder and emits a `virtual:intelligence-manifest` module with eager frontmatter + lazy loaders. Adding a new essay = adding a new `.mdx` file with valid frontmatter; nothing to register manually.

---

## 7. Distribution strategy: belt-and-braces (Google + LLMs)

The site is intentionally optimised for **both** traditional search engines **and** LLM-based answer engines (ChatGPT, Claude, Perplexity, Google AI Overviews). Neither channel is treated as primary; both matter, and the infrastructure exists to hedge across them. Don't quietly drop or weaken either side.

**For traditional search**
- Per-page `<title>`, meta description, canonical (`src/components/seo/PageMeta.tsx`).
- Sitemap (`/sitemap.xml`), RSS feeds (`/feed.xml`, `/feed/people-ops.xml`), video sitemap.
- Verification meta tags injected at build time from env via `scripts/inject-verification-codes.mjs`.
- Strong JSON-LD: `Organization`, `WebSite`, `Article`, `FAQPage`, `BreadcrumbList`, `CollectionPage` + `ItemList`, `Person`, `VideoObject`, `Offer`. Validated post-build by `scripts/validate-jsonld.mjs`.

**For LLM answer engines**
- `/llms.txt` (concise index) and `/llms-full.txt` (full plain-text corpus, newest-first, with a fixed-key header per article). Generated by `scripts/build-seo-indexes.mjs`. The format is a stability contract — see `docs/llms-full-format.md`. Don't silently change field names, ordering, or the `========` rule.
- Every essay's `<TLDR>` and `<KeyTakeaways>` blocks are designed as ideal retrieval chunks — short, self-contained, scannable. The `intelligence-structure` test enforces this.
- Static prerendering of every sitemap route via `scripts/prerender-intelligence.mjs` (Puppeteer + `vite preview`), because GPTBot / ClaudeBot / PerplexityBot don't reliably execute JavaScript. Output goes to `dist/<route>/index.html`.

The build is gated. `npm run prebuild` runs SEO index generation **and** the three SEO/structure tests; `vite-plugins/prerender.ts` runs prerender + JSON-LD + canonical + shell validators on `closeBundle`. If you add a route, add it to the sitemap; if you add JSON-LD, run the validator.

---

## 8. Tech stack and architecture (the bits worth knowing)

- **Framework:** Vite 5 + React 18 + React Router 6 + TypeScript. SWC (`@vitejs/plugin-react-swc`) for transforms.
- **MDX:** `@mdx-js/rollup` + `remark-gfm`. MDX articles compile through a custom `intelligence-manifest` virtual module; do not import them directly by path elsewhere.
- **Styling:** Tailwind + CSS variables. Named brand tokens; no inline hex. shadcn/ui is partial — only the primitives that exist in `src/components/ui/`. Don't pull in the full shadcn suite.
- **Backend:** Supabase (`todgunffzlopbenewfnp`). Tables: `enquiries`, `brain_subscribers`, `email_send_log`, `suppressed_emails`, `email_unsubscribe_tokens`, `email_send_state`. Edge functions: `send-brain-welcome`, `send-transactional-email`, `handle-email-suppression`, `handle-email-unsubscribe`, `preview-transactional-email`, `auth-email-hook`, `resend-brain-link`, `process-email-queue`, `sync-brain-subscribers-to-notion`. Email pipeline is queue-backed (pgmq) with append-only suppression.
- **Forms:** Three — `BrainCaptureForm` (calls edge function), `ContactForm` (direct insert with Zod validation), `EmailCapture` (newsletter). Submissions don't leak whether an email is already on the list.
- **Analytics:** GA4 `G-93DFWMX8GP`, loaded post-`load` to keep ~156KB off the critical path. SPA pageviews fired manually in `src/components/analytics/Analytics.tsx`. Standard event names: `page_view`, `click` (with `outbound`/`email`/`phone` flavours), `form_submit`, `form_submit_attempt`, `faq_toggle`. Use `src/lib/analytics.ts` rather than calling `window.gtag` directly.
- **Lovable:** `lovable-tagger` runs only in dev (`vite.config.ts`). It tags components for Lovable's editor and is irrelevant to production. Don't remove it; don't rely on it.

---

## 9. Conventions and invariants — don't break these

These are the non-negotiables. Most are enforced by tests; some aren't, but should be.

- **Prebuild test gates.** `src/test/faq-jsonld.test.ts`, `src/test/people-ops-seo.test.ts`, `src/test/intelligence-structure.test.ts` run on `prebuild`. They are not optional and they are not flaky. If they fail, the content is wrong, not the test.
- **TLDR + KeyTakeaways on every essay.** Required structural blocks. They double as LLM chunk anchors and human scan anchors.
- **Unique titles + meta descriptions.** Especially across the People Ops cluster (enforced by `people-ops-seo.test.ts`).
- **Single H1 per page, sourced from frontmatter.** Heading levels descend without skips.
- **At least one internal `/intelligence/` link per essay.** Cross-linking is part of the SEO spine.
- **`llms-full.txt` format is a contract.** Field names, order, and delimiters are stable. Document changes in `docs/llms-full-format.md` before shipping.
- **Canonical URLs match served paths.** Verified by `scripts/validate-canonicals.mjs`.
- **No empty SPA shells in `dist/`.** Verified by `scripts/validate-shell.mjs`.
- **Use named brand tokens** (`bg-linen`, `text-cream`, `border-brass`) rather than raw colour values.
- **CTA tone.** Direct email (`matt@deepgrain.ai`) or `/contact`. Not "Book a call", not "Get a quote", not "Start your free trial".

---

## 10. Common pitfalls / non-goals

- **Don't introduce a new content track without a plan.** Two tracks is deliberate. A third would dilute both.
- **Don't lean on Lovable for production behaviour.** It's a dev-time editor only. Custom Vite plugins (`deepgrain-seo`, `intelligence-manifest`, `prerender`) are the source of truth for SEO output.
- **Don't break prerendering for the sake of a fancy interaction.** If a feature requires client-only state to render meaningful content, the LLM/SEO crawlers won't see it, and that's the whole point of the pipeline.
- **Don't add tracking that fires on the critical path.** Analytics is deferred for a reason (FCP/LCP).
- **Don't add a pricing page, a calculator, or a "book a call" widget** without explicit instruction. The funnel is intentionally low-friction-low-coercion.
- **Don't refactor the brand voice into generic SaaS copy.** "Work with the grain" is the product, not just a slogan.

---

## 11. Quick file map

```
src/
  App.tsx                       # all routes
  main.tsx                      # entry
  index.css                     # tokens + animations
  pages/                        # one file per route
  components/
    sections/                   # full-width page sections (Hero, WhatWeDo, FAQ, ...)
    intelligence/               # MDX renderer + TLDR/KeyTakeaways/Takeaway
    forms/                      # BrainCaptureForm, ContactForm, EmailCapture
    seo/                        # PageMeta, JSON-LD builders
    layout/                     # SiteShell, header, footer
    ui/                         # shadcn-style primitives + BarkGrain, PillButton, ScrollReveal
    analytics/                  # GA4 wiring
  content/intelligence/         # MDX essays (Deepgrain track)
    people-ops/                 # MDX essays (People Ops track)
  data/                         # static reference data (caseStudies, glossary, pillars, brainCards, ...)
  lib/                          # intelligence loader, breadcrumbs, analytics, aioi link
  integrations/supabase/        # client + generated types
  test/                         # vitest specs (incl. the three prebuild gates)
scripts/                        # build-seo-indexes, validate-*, prerender-intelligence, inject-verification-codes
vite-plugins/                   # deepgrain-seo, intelligence-manifest, prerender
supabase/                       # config + edge functions
docs/                           # prepublish-checklist, llms-full-format, seo-console-setup
```

---

## 12. Verification: have I got the intent right?

If a change you're considering would:

- weaken either the Google or the LLM distribution channel, **or**
- privilege the founder/operator audience over the People/HR audience (or vice versa) without it being asked for, **or**
- soften the wood-grain / anti-slideware brand voice into generic consulting copy, **or**
- add a SaaS-shaped feature (pricing tiers, app login, in-app booking) that the offering is deliberately not, **or**
- skip or weaken any of the prebuild gates, the prerender step, or the `llms-full.txt` format contract,

then it is probably out of character with the intent of this repo, and worth flagging to Matt before you ship it.
