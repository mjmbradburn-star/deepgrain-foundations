# SSR migration plan: Vite + React Router → TanStack Start

Status: deferred. This document is the brief, not a commitment.

## Why migrate

- **True per-request SSR.** The current stack relies on a build-time
  prerender (puppeteer) that snapshots every route. It is functionally
  equivalent to SSR for static content and crawlers, but it cannot
  serve per-request data (signed-in Brain dashboard, personalised
  intelligence feed, A/B tested copy, time-of-day variants).
- **Streaming.** TanStack Start streams HTML as components resolve,
  which lowers TTFB on long article pages.
- **Server loaders.** Data-fetching colocated with routes, executed on
  the server, no flash-of-loading on first paint. Removes the need to
  hydrate big intelligence indexes client-side.
- **First-class head API.** Replaces react-helmet-async (which mutates
  document.head client-side and only works for JS-executing crawlers).
  The Start head API renders into the SSR'd HTML directly.

## When to migrate

Trigger any one of:
1. We add a route whose content is genuinely per-request (Brain dashboard,
   logged-in /work case studies, personalised reading feed).
2. Lovable ships an in-place migration tool from Vite/React Router to
   TanStack Start.
3. The prerender pipeline costs more to maintain than the alternative
   (e.g. puppeteer keeps breaking on the build sandbox).

Until one of those fires, the hardened prerender is the better
ROI.

## Scope

| Area | Current | Post-migration |
|------|---------|----------------|
| Router | react-router-dom v6 declarative routes in src/App.tsx | TanStack Router file-based routes in src/routes/ |
| Head meta | react-helmet-async + PageMeta wrapper | Start `head()` returned from each route |
| MDX pipeline | @mdx-js/rollup + virtual:intelligence-manifest plugin | TanStack Start MDX integration or vite-plugin-mdx (likely retained) |
| Data | Eager imports (CATEGORIES, PILLARS, ANSWERS, etc.) | Server loaders returning the same shape |
| Prerender | scripts/prerender-intelligence.mjs (puppeteer) | Built-in; retire the script |
| Validators | scripts/validate-{shell,canonicals,jsonld}.mjs | Keep as crawl-tests against the deployed origin |
| Plugins | deepgrainSeoPlugin, intelligenceManifestPlugin, deepgrainPrerenderPlugin | intelligenceManifest likely portable; SEO + prerender plugins retired |
| Edge functions | supabase/functions/* | No change |
| Auth / Brain capture | client-side supabase.functions.invoke | No change, or move to server actions later |

## Risks

- **Design system.** Tailwind tokens, brass-rule, grain backgrounds — all
  client CSS, no risk. Animations using Framer Motion need re-verification
  under streaming SSR (initial HTML must not include hydration-mismatching
  animation state).
- **Build time.** TanStack Start builds are heavier than Vite SPA builds.
  Acceptable on Lovable hosting but worth measuring before committing.
- **Lovable hosting compatibility.** Lovable supports TanStack Start for
  *new* projects. An *existing* Vite project being migrated in place is
  not yet a documented supported flow. Confirm with Lovable support
  before scheduling the work.
- **Custom Vite plugins.** Three of them. `intelligenceManifestPlugin`
  emits a virtual module — likely portable. `deepgrainSeoPlugin` and
  `deepgrainPrerenderPlugin` are retired entirely (Start replaces them).
- **Test surface.** vitest-based JSON-LD/SEO tests must be re-pointed at
  the new route module shape.
- **Internal link graph + sitemap generator.** scripts/build-seo-indexes.mjs
  and scripts/audit-routes.mjs need updates: routes come from the file
  system, not src/App.tsx.

## Effort estimate

- 2-3 days: routing migration, head meta, MDX integration, page-by-page
  port (24 pages).
- 1 day: server loaders for intelligence indexes, breadcrumb/JSON-LD
  helpers, retire prerender pipeline.
- 1 day: QA across all routes (visual regressions, lighthouse, social
  preview crawlers).
- 0.5 day: CI updates, sitemap generator, audit-routes rewrite.

Total: ~4-5 working days plus contingency.

## Out-of-scope (post-migration follow-ups, not blockers)

- Move Brain capture to a server action.
- Add per-request locale/AB-test variants on the home page.
- Replace the puppeteer crawl tests with playwright-against-prod smoke
  tests.

## Decision log

- 2026-05-13 (Matt + Lovable agent): chose to harden prerender now and
  defer migration. Rationale: site is fully static-content, crawlers
  see identical HTML either way, migration delivers no SEO/AIO win on
  its own. Revisit when Brain dashboard is on the roadmap.
