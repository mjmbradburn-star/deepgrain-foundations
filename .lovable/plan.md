
## Goal
Standardise all page `<title>` tags on the pipe separator (`|`) so the brand has zero em dashes anywhere in head metadata.

## Findings
From the earlier audit, 9 files use `Title — Deepgrain` in their `PageMeta` title. The newer legal pages I just shipped (`Privacy`, `Cookies`, `Terms`) and `Work` already use `|`, so the codebase is half-converted.

Files to touch (title strings only):
- `src/pages/Home.tsx`
- `src/pages/About.tsx`
- `src/pages/Enablement.tsx`
- `src/pages/Intelligence.tsx`
- `src/pages/IntelligenceArticle.tsx`
- `src/pages/IntelligenceCategory.tsx`
- `src/pages/MethodPage.tsx`
- `src/pages/PeopleOps.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Unsubscribe.tsx` (if present)
- `src/pages/NotFound.tsx` (if present)
- `index.html` (default `<title>`, if it uses an em dash)

## Change
For each: replace ` — Deepgrain` with ` | Deepgrain` in the title prop only. No body copy, no descriptions, no MDX. OG/Twitter titles inherit from the same string via `PageMeta`, so they update automatically.

## Out of scope
- MDX prose em dashes (separate decision).
- Body copy em dashes (separate pass).
- Description fields (no separator issue there).
