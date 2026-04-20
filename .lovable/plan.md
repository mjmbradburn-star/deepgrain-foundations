
## Goal
Strip AI tells from the homepage Method section and the Work page. Same voice rules as `/enablement`: no em dashes, no tricolons, no "we don't X, we Y" flips, no "it's not X, it's Y", tighter and plainer.

## Scope

### 1. Homepage Method section — `src/components/sections/Method.tsx`
Audit and rewrite:
- Eyebrow / heading / subhead
- The three step cards (Read, Craft, Scale) — titles and bodies
- Any CTA copy
- Keep the "Or see how we train your team" link wording (already approved last pass)

### 2. Work page — `src/pages/Work.tsx`
Audit and rewrite:
- Page hero (eyebrow, H1, subhead)
- Any intro / framing copy above the case study grid
- Case study card copy if it lives in the page (otherwise flag `src/data/caseStudies.ts` and `src/components/sections/CaseStudyCard.tsx`)
- The walnut outcome band above the email capture
- Email capture surrounding copy if present

### 3. Data file — `src/data/caseStudies.ts`
If case study titles, summaries, or outcome strings contain em dashes / tricolons / rhetorical flips, rewrite those too. Most likely culprits.

## Voice rules (same as last pass)
- No `—` anywhere. Replace with `.`, `,`, or `:`.
- No "X, Y, and Z" tricolons used for rhythm. One or two beats max.
- No "we don't X. we Y." or "it's not X, it's Y."
- No "operating", "craftsmanship", "deeply", "truly", "simply" filler unless load-bearing.
- Short sentences. Active voice. Specific nouns.
- Keep proper nouns and the existing brand vocabulary (Read, Craft, Scale; deepgrain; operating system; champions).

## Process
1. Read `Method.tsx`, `Work.tsx`, `caseStudies.ts`, and `CaseStudyCard.tsx` in parallel.
2. Identify every offending string. Note line numbers.
3. Rewrite in place via `code--line_replace`. Copy-only edits, no structural or component changes.
4. Grep the two files + the data file for `—` after edits to confirm zero em dashes remain.

## Files likely edited
- `src/components/sections/Method.tsx`
- `src/pages/Work.tsx`
- `src/data/caseStudies.ts` (probable)
- `src/components/sections/CaseStudyCard.tsx` (only if it contains hardcoded copy, not just layout)

## Out of scope
- No layout, component, or routing changes.
- No changes to other pages or sections this pass.
- No changes to the email capture form mechanics.

## Deliverable
One pass, all offending copy on the homepage Method section and the entire Work page rewritten in your voice. Zero em dashes. Ready for you to read and red-pen.
