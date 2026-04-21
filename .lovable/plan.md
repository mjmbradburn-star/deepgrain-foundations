

## Goal

Replace the ad-hoc `[&_section+section]:…` and `[&_section:first-of-type:not([data-no-rule])]:…` selectors currently living on `<main>` in `SiteShell.tsx`, plus the manual `border-t-[3px] border-brass/35` on `<Footer>`, with a single reusable utility class so any new section or footer-like block automatically picks up the 3px brass rule behaviour without anyone remembering selectors.

## Approach

Add one utility class — `.brass-rule` — in `src/index.css` under `@layer utilities`, defined as:

```css
.brass-rule { border-top: 3px solid hsl(var(--brass) / 0.35); }
```

This is the same visual we already produce inline; centralising it means the colour/thickness can be tuned in exactly one place forever.

Then expose it via two opt-in patterns on `<main>`:

1. **Auto-applied between adjacent sections and above the first section** — keep the global behaviour, but express it through the new utility instead of duplicating the border declaration. We rewrite the `<main>` className to:

   ```
   [&_section+section]:brass-rule
   [&_section:first-of-type:not([data-no-rule])]:brass-rule
   ```

   Tailwind's arbitrary-variant syntax happily applies a custom class via the descendant selector, so this works without any plugin. The `data-no-rule` escape hatch on the Hero stays untouched.

2. **Manual application** — anything outside `<main>` (today: the Footer; tomorrow: a CTA strip, a callout band, etc.) just adds `className="brass-rule"` and gets the identical line. We replace the Footer's hand-written `border-t-[3px] border-brass/35` with `brass-rule`.

### Why a CSS utility, not a Tailwind plugin or a React component

- **vs. plugin**: a plugin requires `tailwind.config.ts` surgery and a build cycle to iterate. A single CSS rule in `index.css` is clearer for one declaration and matches how `.section-pad`, `.container-grain`, and `.section-rule` are already defined in this file.
- **vs. `<BrassRule />` component**: we already have `src/components/ui/BrassRule.tsx` for explicit standalone hairlines inside content. The need here is a *modifier* on existing block boundaries (sections, footer), not an inserted element — a class is the right shape.

## Files

- `src/index.css` — add `.brass-rule { border-top: 3px solid hsl(var(--brass) / 0.35); }` inside the existing `@layer utilities` block.
- `src/components/layout/SiteShell.tsx` — replace the two long arbitrary-variant border declarations on `<main>` with `[&_section+section]:brass-rule` and `[&_section:first-of-type:not([data-no-rule])]:brass-rule`.
- `src/components/layout/Footer.tsx` — replace `border-t-[3px] border-brass/35` with `brass-rule`.

## Out of scope

- Removing or restyling the existing `.section-rule` utility (semantically different — it's a standalone `<hr>`-style block, not a top border).
- Touching `BrassRule.tsx` (still the right choice for inline content rules).
- Changing where dividers appear, the `data-no-rule` escape hatch on the Hero, or the colour/thickness values.

