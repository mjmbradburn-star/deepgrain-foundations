

## Goal

Render the 3px brass hairline rule between the page header/hero block and the first content section on every page, matching the divider that already runs between subsequent adjacent sections.

## Why it's missing today

The global rule in `SiteShell`'s `<main>` is `[&_section+section]:border-t-[3px]` — it only fires when one `<section>` is *immediately preceded* by another `<section>`. The very first section on each page (the Hero on `/`, or the page header on every other route) has no `<section>` sibling above it, so it gets no top border. The fixed `<Navigation>` header sits outside `<main>`, so it never satisfies the selector either.

## Approach

Add a top border to the **first** `<section>` inside `<main>` as well, using the same brass token and thickness, so the rule appears under the nav/hero on every page automatically.

One change in `src/components/layout/SiteShell.tsx`: extend the existing className on `<main>` with `[&_section:first-of-type]:border-t-[3px] [&_section:first-of-type]:border-brass/35`. The `:first-of-type` pseudo targets the first `<section>` descendant, which on `/` is the Hero (we'll exempt it — see below) and on every other page is the page-header section.

### Exempting the Hero on `/`

The Hero is a full-bleed dark image and a brass line directly under the fixed nav would float awkwardly over it. We add `data-no-rule` to the Hero's root `<section>` and refine the selector to `[&_section:first-of-type:not([data-no-rule])]:border-t-[3px]` so the rule is suppressed there. Every other page's first section (which is a normal page header on linen) gets the divider.

## Files

- `src/components/layout/SiteShell.tsx` — extend the `<main>` className with the first-section selector (with the `:not([data-no-rule])` guard).
- `src/components/sections/Hero.tsx` — add `data-no-rule` to the root `<section>`.

## Out of scope

- Changing thickness or colour (already 3px brass/35).
- Adding a rule between `<main>` and `<Footer>` — separate request.
- Touching the BarkGrain debug code from the previous turn.

