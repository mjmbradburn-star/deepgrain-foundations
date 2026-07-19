# deepgrain-foundations (Desktop copy)

This copy under `~/Desktop/Claude Code/deepgrain-foundations` is the active working copy as of 2026-07-19 (synced to origin/main, branch work happens here). The GitHub remote is https://github.com/mjmbradburn-star/deepgrain-foundations and Lovable deploys production from `main`. Pushing to `main` deploys the live site: pause-and-confirm with Matt first.

The older copy at `~/deepgrain-foundations` sits on a stale branch (`polish/exceptional-site`); do not assume it reflects production.

Build notes:

- `node_modules/@lovable.dev/mcp-js` and `cloud-auth-js` are LOCAL NO-OP STUBS (the real packages are in package.json and installed by Lovable cloud; local install is blocked by the supply-chain cooldown rules). Do not ship code that depends on stub behaviour beyond what production provides.
- `bun run typecheck` reports 5 pre-existing errors in `src/lib/mcp/*` and `src/integrations/lovable/*` when the real @lovable.dev packages are absent. Everything else must be clean.
- Real verification: `bun run build` (includes SEO index build, route/robots audits, 345 tests, prerender + canonical/shell validators) must pass with no validator failures.

For project context, stack notes, and SEO conventions, see the codebase itself. Global rules in `~/CLAUDE.md` apply, including the em-dash ban on all user-facing copy.
