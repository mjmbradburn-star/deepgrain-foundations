# Roadmap

- [x] Surgical revert of nine files
  - Restored to `449c265`: `src/App.tsx`, `src/components/layout/Footer.tsx`, `src/lib/intelligence.ts`, `src/pages/Home.tsx`
  - Deleted (absent at `449c265`): `src/components/ErrorBoundary.tsx`, `src/lib/lazyRecovery.ts`, `src/test/lazy-recovery.test.ts`
  - Restored to `449c265^` (961e2fe): `src/integrations/supabase/previewAuthStorage.ts`, `supabase/functions/mcp/index.ts`
  - Verified: changed-file set is exactly those nine; restored files byte-identical to target revisions; Stripe monitor source, token check, session.ts, generated types untouched
  - Verified: typecheck clean, 395 tests pass, build OK, home page loads with no errors
