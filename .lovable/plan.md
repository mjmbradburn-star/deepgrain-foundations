

## Goal

Replace the current uniform vertical-stripe "grain" with a real wood-grain texture — organic, flowing, knot-bearing — that drifts very slowly behind content on every bark section, while preserving readability and our dark grey-green palette. Also harden the code so the recent `Component is not a function` error cannot recur.

## Reference

The uploaded grey oak image: long vertical fibres, a clear central knot/cathedral figure, soft variation in tone, no hard repeating lines. We will evoke this — not embed the photo (it's grey, not grey-green, and a tiled photo would clash with our palette and add weight).

## Approach — organic grain (SVG, no photo)

Replace `BarkGrain.tsx`'s two `repeating-linear-gradient`s with an inline SVG turbulence texture. SVG `<feTurbulence>` + `<feDisplacementMap>` generates non-repeating, wood-like fibres natively in the browser, ~2KB, GPU-composited as a single layer.

Construction (one `<svg>` rendered as an absolutely-positioned layer, `aria-hidden`):

1. **Base wash** — vertical linear gradient using our tokens `--bark` → `--bark-2` → `--bark` so the surface still reads as our dark grey-green.
2. **Fibre layer** — `<feTurbulence type="fractalNoise" baseFrequency="0.9 0.012" numOctaves="2">` (high X frequency, very low Y frequency) produces long vertical fibres like real grain. Piped through `<feColorMatrix>` to tint toward cream highlights and ink shadows at ~10–14% alpha.
3. **Knot/figure layer** — a second, lower-frequency turbulence (`baseFrequency="0.015 0.008"`) at ~6% alpha gives the soft cathedral figure and occasional knots. No two sections look identical because each `<feTurbulence>` gets a different `seed` (we'll seed once per mount with `useId`).
4. **Motion** — instead of sliding background-position, we animate the SVG's `transform: translate3d(...)` on a 120s cycle (twice as slow as today) plus a barely-perceptible `scale(1.02)` breathe. A single transform on one layer = cheap, GPU-accelerated, and the turbulence itself stays put so the grain looks like it's *flowing* slightly rather than scrolling.
5. **Readability guard** — overall layer opacity capped at `0.35`, and `BarkSection` keeps the existing `z-10` content wrapper. No blend modes (avoids the soft-light cost we just removed).
6. **Reduced motion** — existing `@media (prefers-reduced-motion: reduce)` block already disables `.bark-grain` animation; we keep that selector so the new transform animation is also halted.

Net result: a slow, living, non-repeating grain that visibly resembles the reference photo's flow, rendered from one SVG layer instead of three gradient layers.

## Approach — error hardening

The `TypeError: Component is not a function` came from `BarkSection` being consumed during HMR while a render-prop edit was mid-flight. To make it impossible to recur:

- Keep `BarkSection` a plain named function component (no `forwardRef`, no dynamic `as` evaluation surprises). Default `as` to the string `"section"` and narrow the `as` prop type to `"section" | "footer" | "aside" | "div"` so a bad value can't be passed.
- Export `BarkGrain` and `BarkSection` as named exports only (already the case) and confirm every consumer uses the named import (audit list below).
- Add a tiny runtime guard: if `Tag` is somehow falsy, fall back to `"section"`. Cheap, eliminates the blank-screen failure mode.

## Files

- `src/components/ui/BarkGrain.tsx` — replace gradient stack with SVG turbulence layer + slow transform animation; accept optional `seed` prop.
- `src/components/ui/BarkSection.tsx` — narrow `as` typing, add fallback, pass a stable `useId`-derived seed to `BarkGrain` so each section's grain is unique.
- `src/index.css` — replace `@keyframes grain-drift` (background-position) with `@keyframes grain-flow` (transform translate + micro-scale), 120s duration; keep the reduced-motion guard.
- No other files change. All existing `BarkSection` consumers (`Footer`, `ICPStrip`, `ClientVoice`, `Method`, `About`, `Work`, `PeopleOps`, `IntelligenceArticle`) inherit the new look automatically.

## Out of scope

- Embedding the uploaded photo as a tiled background (palette mismatch, weight, repeat artefacts).
- Touching Hero, light/linen sections, or any non-bark surface.

