# Pre-publish checklist

Run this before clicking **Publish → Update** in Lovable. It mirrors what GitHub
Actions runs on every push, so if it's green locally it'll be green in CI too.

## One command

```bash
npm run prepublish:check
```

That runs, in order:

1. `npm run lint` (eslint)
2. `npm run typecheck` (tsc, no emit)
3. `npm run test` (vitest, full suite)
4. `npm run build` (vite production build, also regenerates `sitemap.xml`, `llms.txt`, `llms-full.txt`)

The chain stops at the first failure. If everything passes, you're safe to
republish.

## Running steps individually

| Step | Command | What it catches |
|---|---|---|
| Lint | `npm run lint` | Style and React hook issues |
| Typecheck | `npm run typecheck` | Broken types, bad imports, missing props |
| Tests | `npm run test` | Behaviour regressions, FAQ JSON-LD shape |
| Build | `npm run build` | Bundle errors, asset resolution, sitemap drift |

## What's checked automatically

- `prebuild` already runs the FAQ JSON-LD test before every `npm run build`,
  so even a bare build catches schema drift.
- The Vite `deepgrain-seo` plugin audits `src/App.tsx` on every build and
  warns if a route is missing from the sitemap.
- GitHub Actions runs lint, typecheck, build, and the full vitest suite on
  every push and PR (see `.github/workflows/ci.yml`).

## After publishing

1. Open the published URL, hard-refresh (`Cmd+Shift+R`), and click through
   the routes you changed.
2. If you added or renamed a content URL, optionally call the
   `ping-indexnow` edge function to nudge search engines.
