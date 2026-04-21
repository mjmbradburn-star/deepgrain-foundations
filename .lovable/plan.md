

## Goal

Apply the brass hairline divider — currently only on `ICPStrip` (the bit you love at the top of the home page) — between every section on every page, on both desktop and mobile, and bump it from 1px to ~3px so it reads more confidently.

## What you're seeing today

`ICPStrip` uses `border-y border-brass/30` at 1px. That produces the thin bronze line above and below the section in your screenshot. No other section has it, which is why it appears nowhere else on the site.

## Approach

1. **New token + utility for the divider.** Add a single CSS utility class `.section-rule` in `src/index.css`:
   - `border-top: 3px solid hsl(var(--brass) / 0.35)`
   - `border-color` exposed via the existing `--brass` token so it works on both bark/green and linen/cream backgrounds without further tweaking.
   - At ≤768px we keep it 3px (you asked for desktop *and* mobile).
   - One class, so any future section gets the divider with a single class addition.

2. **New tiny component `SectionDivider`** in `src/components/ui/SectionDivider.tsx` — a full-width `<hr>` that renders the rule. Useful where a section can't easily host a top-border (e.g. between two sections that have padding/background colour changes mid-page). It just emits `<hr className="section-rule" />` and accepts an optional `className` for spacing overrides.

3. **Insert the rule globally via `SiteShell`'s `<main>`** so we don't have to touch every page. Add a Tailwind plugin-free utility on `<main>`:
   ```
   [&>section+section]:border-t-[3px]
   [&>section+section]:border-brass/35
   ```
   This adds a 3px brass top border between every adjacent `<section>` rendered as a direct child of `<main>`. Works for any page that composes its content as a flat list of `<section>` elements (which all current pages do via `Home`, `MethodPage`, `Enablement`, `Work`, `About`, `Contact`, `Intelligence`, `IntelligenceArticle`, `IntelligenceCategory`, `PeopleOps`, `Privacy`, `Cookies`, `Terms`, `Unsubscribe`, `NotFound`).

4. **Update `ICPStrip`** to drop its bespoke `border-y border-brass/30` and inherit the global rule. Keeps a single source of truth and ensures uniform thickness.

5. **Suppress the rule above the Hero.** The first section on `/` is the Hero, which sits flush under the nav; the global selector `section + section` only targets adjacent sections, so the Hero is already exempt. No further work needed.

6. **Lazy-loaded sections on Home.** `Home.tsx` wraps below-the-fold sections in a single `<Suspense>` boundary whose fallback is a `<div>`. Once Suspense resolves, the children become real adjacent `<section>` siblings of `Hero` and `ICPStrip`, so the `section + section` selector still applies. Confirmed by reading `Home.tsx` — fallback is replaced in place.

7. **Mobile parity.** Because `border-t-[3px]` is not breakpoint-prefixed, it renders identically on mobile and desktop. No extra responsive rules.

## Files

- `src/index.css` — add `.section-rule` utility (used by the optional `SectionDivider` component and as documentation of the token).
- `src/components/layout/SiteShell.tsx` — add `[&>section+section]:border-t-[3px] [&>section+section]:border-brass/35` (and equivalent for the Suspense-wrapped children block) to the `<main>` className so adjacent sections get the rule automatically.
- `src/components/sections/ICPStrip.tsx` — remove the now-redundant `border-y border-brass/30`.
- `src/components/ui/SectionDivider.tsx` — new component for the rare case a page needs to insert a divider between non-section blocks.

## Out of scope

- Changing the brass colour or opacity globally.
- Adding the rule inside the Hero or above the footer (the footer already sits flush; we'll add the rule between the last `<section>` and `<Footer>` only if you want — say the word and I'll include it).
- Rules between sub-sections inside a single `<section>` block (those keep using the existing `BrassRule` component).

