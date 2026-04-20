
## Goal

Make `/enablement` easy to discover and reach without adding a fifth top-level nav item. Surface it from the existing nav and from the two pages where intent is highest (`/method`, `/work`), without burying it.

## Current state

- Top nav: Method · Work · Intelligence · About · Contact (4–5 items, tight on mobile).
- `/enablement` is reachable today from: footer link, the "Champions trained" callout on `/method`, and the inline empowerment paragraph link on `/method`. Nowhere on `/work`. Nowhere from the homepage. Nowhere from the nav itself.
- Nav is a flat CSS-only list (`Navigation.tsx`); no dropdown infrastructure exists. Mobile nav is a full-screen panel.

## Options considered

**A. Hover/click mega-menu under "Method"**
A small panel reveals on hover (desktop) / tap (mobile) showing two children: *The Method* and *Enablement*. Method stays the parent because enablement IS part of how Deepgrain delivers — it sits naturally underneath.
- Pro: Discoverable from every page, no new top-level item, semantically honest (enablement is part of the method).
- Con: Adds JS + a11y surface (keyboard, escape, focus trap on mobile). New pattern in an otherwise flat, restrained nav.

**B. Persistent secondary line under the primary nav**
A thin row beneath the main nav (only on `/method` and `/enablement`) showing: *Method overview · Enablement*. Acts as a section nav.
- Pro: Zero hover/click complexity, scoped to relevant pages, very calm visually.
- Con: Only visible on those two pages, so doesn't help discovery elsewhere.

**C. Homepage Method teaser gets a second link**
The existing `Method` section on the homepage already has one CTA. Add a secondary inline link: *"See how we train your team →"* pointing at `/enablement`.
- Pro: One-line change, surfaces enablement to every homepage visitor (133 of last week's 134 pageviews were `/`).
- Con: Homepage-only.

**D. `/work` page gets an "Enablement outcomes" cross-link**
At the bottom of `/work`, before the Invitation, add a small band: *"Every engagement leaves a trained team behind. See how →"* linking to `/enablement`.
- Pro: Hits the buyer reading case studies — exactly the moment the question "what do we get long-term?" arises.
- Con: Single page only.

**E. Promote into top nav between Method and Work** *(rejected by user)*

## Recommendation — combine B + C + D, skip A

Three small, low-risk surfaces beat one heavy dropdown. Together they hit every entry path (homepage, method, work, footer) without adding JS, a11y debt, or visual noise to the nav. A dropdown is a real pattern shift for one child link — disproportionate.

If after a few weeks the analytics show enablement is still under-visited, we revisit option A as a deliberate upgrade.

## Plan

**1. Section sub-nav (Option B)** — `src/components/layout/SiteShell.tsx` or a new tiny `MethodSubnav.tsx` rendered conditionally when `pathname` starts with `/method` or `/enablement`. Two pill links: *Method* · *Enablement*, brass underline on active. Sits flush under the main nav, same green background, low height (~40px).

**2. Homepage Method teaser link (Option C)** — `src/components/sections/Method.tsx`. Add a secondary text link beneath the existing CTA: *"Or see how we train your team →"* → `/enablement`.

**3. Work page outcome band (Option D)** — `src/pages/Work.tsx`. Add a one-line band before the closing CTA/Invitation: short sentence + arrow link to `/enablement`.

**4. Footer link** — already exists, no change.

No changes to `Navigation.tsx`, no dropdown JS, no new dependencies.

## Files touched

- New: `src/components/layout/MethodSubnav.tsx` (~30 lines)
- Edited: `src/components/layout/SiteShell.tsx` (mount the subnav)
- Edited: `src/components/sections/Method.tsx` (one extra link)
- Edited: `src/pages/Work.tsx` (one outcome band)

## Why this works

- Enablement becomes reachable in **one click** from the homepage, `/method`, `/work`, the `/method` Champions callout, and the footer — five entry points without touching the primary nav.
- The sub-nav makes Method ↔ Enablement feel like one section, which matches the actual offering.
- Reversible. If the sub-nav feels heavy, delete one component and one mount line.
