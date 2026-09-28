# Roadmap

- [ ] Surgical revert of nine files (in progress)
  - Restore to `449c265`: `src/App.tsx`, `src/components/layout/Footer.tsx`, `src/lib/intelligence.ts`, `src/pages/Home.tsx`
  - Delete (absent at `449c265`): `src/components/ErrorBoundary.tsx`, `src/lib/lazyRecovery.ts`, `src/test/lazy-recovery.test.ts`
  - Restore to `449c265^` (961e2fe): `src/integrations/supabase/previewAuthStorage.ts`, `supabase/functions/mcp/index.ts`
  - Preserve untouched: `sync-stripe-checkout` source and token check, `session.ts`, generated database types, Stripe secrets/schema/cron
  - Show exact changed-file set before any commit; stop if the set does not match the nine paths exactly
