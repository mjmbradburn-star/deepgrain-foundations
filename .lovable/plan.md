
## Goal
Ensure any anchor link or programmatic scroll to a `<section>` on `/method` or `/enablement` lands below the fixed primary nav + sub-nav, not underneath them.

## Fixed-bar heights
- Primary nav: `h-24` (96px) mobile, `h-28` (112px) `md+`
- Sub-nav: `h-10` (40px), positioned at `top-24` / `md:top-28`
- Combined clearance needed: **136px** mobile, **152px** desktop

## Approach
Add a small CSS rule scoped to the two routes that applies `scroll-margin-top` to every `<section>` inside `<main>`. Cleaner than touching every section in both pages.

Two viable spots:
1. **`src/index.css`** — add a route-agnostic utility class, then apply via a wrapper.
2. **`SiteShell.tsx`** — add a className to `<main>` when `hasSubnav`, with a Tailwind arbitrary variant targeting child sections.

Going with option 2, one-line change:

```tsx
<main
  className={cn(
    "flex-1",
    hasSubnav && "pt-10 [&_section]:scroll-mt-36 md:[&_section]:scroll-mt-[152px]"
  )}
>
```

- `scroll-mt-36` = 144px (covers 136px mobile with 8px breathing room)
- `md:scroll-mt-[152px]` = exact desktop clearance

## Files
- Edited: `src/components/layout/SiteShell.tsx` (one className addition)

## Why this is enough
- CSS-only, no JS.
- Scoped to routes that have the sub-nav (won't affect other pages).
- Applies to every current and future `<section>` on both pages automatically.
- No regression risk to layout — `scroll-margin-top` only affects scroll landing position, not rendering.
