## Reality check

Lovable does not offer a "turn on SSR" switch for this project. True SSR is only the default on new TanStack Start scaffolds (post May 2026). This codebase is Vite + React Router with a heavy custom prerender pipeline (`vite-plugins/prerender.ts`, `scripts/prerender-intelligence.mjs`, `scripts/validate-shell.mjs`, `validate-canonicals.mjs`, `validate-jsonld.mjs`).

For a fully static-content site like Deepgrain (intelligence MDX, method, about, etc.), **build-time prerender produces the same HTML a crawler sees from SSR**. Migrating to TS Start is a multi-day rewrite (routes, head, MDX pipeline, plugins, tests) and would not move the SEO/AIO needle on its own. Per your answer, we ship hardened prerender now and produce a written migration plan for later.

On the "dynamic content" question: the only routes that touch per-request data are `/brain` and `/brain/resend` (signed-in flows). These should be `noindex`, not SSR'd. Everything else is build-time-knowable.

## Goals

1. Every route a crawler can reach ships **fully rendered HTML** with correct title, description, canonical, OG, Twitter, and route-specific JSON-LD.
2. Build **fails loudly** if any route regresses to the SPA shell, so the issue can never silently ship again.
3. Single source of truth for the route list (sitemap), with parity checks across `App.tsx`, `sitemap.xml`, `llms.txt`, `feed.xml`.
4. A written, reviewed migration plan to TanStack Start kept in `docs/`.

## Phase 1: Route-source parity (the silent-gap fixer)

Today the prerender trusts `public/sitemap.xml`. If a route is added to `App.tsx` and the dev forgets the sitemap, it never gets prerendered. We close that gap.

- Add `scripts/audit-routes.mjs`:
  - Parse `<Route path=...>` from `src/App.tsx` (static + dynamic params).
  - Expand dynamic params (`:slug`, `:name`) using the same data sources the pages use (`src/lib/intelligence.ts`, `src/data/pillars.ts`, `src/data/answers.ts`, `src/data/compares.ts`, `src/lib/clusters.ts`, `src/data/glossary.ts`).
  - Skip `*`, redirect-only routes, and explicit-noindex routes (`/brain`, `/brain/resend`, `/unsubscribe`).
  - Diff against `public/sitemap.xml`. Exit non-zero on drift.
- Wire it in `vite-plugins/prerender.ts` as the first step, before `prerender-intelligence.mjs`. Build fails if drift.

## Phase 2: noindex hygiene

- Add `noindex` PageMeta to `Brain`, `BrainResend`, `Unsubscribe` (Unsubscribe already has it; verify Brain pages).
- `validate-shell.mjs`: skip the structured-data / leak checks for routes carrying `<meta name="robots" content="noindex...">`, but still assert the file exists.

## Phase 3: Per-route head completeness sweep

- Audit every page component for `<PageMeta>` presence. Currently confirmed on `Home`. Check: `About`, `Work`, `Contact`, `MethodPage`, `Enablement`, `Intelligence`, `IntelligenceArticle`, `IntelligenceCategory`, `IntelligenceCluster`, `IntelligencePillar`, `IntelligencePillars`, `IntelligenceGlossary`, `IntelligenceAnswers`, `AnswerDetail`, `IntelligenceCompare`, `Privacy`, `Terms`, `Cookies`, `SeoChecklist`, `NotFound`.
- Where missing or thin: add canonical, og:*, twitter:*, and the right JSON-LD type (`Article`/`BlogPosting` for intelligence, `CollectionPage` for index pages, `BreadcrumbList` everywhere deep, `FAQPage` for `/answers/*`, `AboutPage`, `ContactPage`).
- Add a unit test (`src/test/page-meta-coverage.test.ts`) asserting every non-noindex route has a `<PageMeta>` import.

## Phase 4: Prerender robustness

- `prerender-intelligence.mjs`:
  - Replace `waitForSelector("h1")` with a stronger ready signal: wait for `<main>` AND a route-specific `[data-prerender-ready]` marker emitted by `SiteShell` once Helmet has flushed.
  - Block analytics/3rd-party scripts during prerender to keep snapshots clean.
  - Strip cookie banner from snapshot HTML (visual-only, ships post-hydration anyway).
  - Snapshot HTML through `prettier`-style minimal normalisation so JSON-LD diffs are stable in CI.
  - Fail the build on any failure (current script swallows them).
- `validate-shell.mjs` already has leak/title/structured-data checks. Add: `og:url` matches canonical; `twitter:title` non-empty; `<h1>` text length > 8.

## Phase 5: AIO (LLM crawler) polish

- Verify `public/llms.txt` and `public/llms-full.txt` are regenerated from the same route source as the sitemap (avoid drift). Hook into `audit-routes.mjs`.
- Ensure each intelligence article ships an `Article` JSON-LD with `author`, `datePublished`, `dateModified`, `headline`, `articleBody` (truncated), and `mainEntityOfPage`.
- Add `Speakable` schema on `/answers/*` pages (good AIO win, cheap).

## Phase 6: CI gate

- `.github/workflows/ci.yml`: ensure `npm run build` runs prerender + all four validators and fails red on any non-zero exit. Currently the prerender plugin catches and logs failures as non-fatal, change to fatal in CI (gate via `CI=true`).

## Phase 7: TanStack Start migration brief (deliverable, not code)

Write `docs/ssr-migration-plan.md` covering:
- Why migrate (true per-request SSR, streaming, server loaders for personalised Brain pages).
- Scope: routes, head (Helmet → Start head API), MDX pipeline, prerender plugin retirement, validators kept as crawl tests, Supabase edge function compatibility.
- Risks: design-system regressions, build time, Lovable hosting compatibility for Vite-Start hybrid, current custom plugins (`deepgrainSeoPlugin`, `intelligenceManifestPlugin`, `deepgrainPrerenderPlugin`).
- Estimate: ~3-5 day rebuild + 1 day QA.
- Trigger: revisit when Lovable offers in-place migration or when a Brain dashboard or other per-user view needs SSR.

## Files this will touch

New:
- `scripts/audit-routes.mjs`
- `src/test/page-meta-coverage.test.ts`
- `docs/ssr-migration-plan.md`

Edited:
- `vite-plugins/prerender.ts` (add audit step, fail-fast in CI)
- `scripts/prerender-intelligence.mjs` (ready marker, fail on error, strip noise)
- `scripts/validate-shell.mjs` (skip noindex routes, extra assertions)
- `src/components/layout/SiteShell.tsx` (emit `data-prerender-ready` after first paint)
- `src/components/seo/PageMeta.tsx` (no change expected; verify)
- Page components missing or thin on `<PageMeta>` (list confirmed in Phase 3)
- `.github/workflows/ci.yml` (fatal validators in CI)

## Out of scope (explicit)

- No migration to TanStack Start in this pass.
- No changes to design tokens, copy, or visual layout.
- No changes to Supabase, auth, or edge functions.
- No new content; only metadata + prerender plumbing.
