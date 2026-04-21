

## Goal

Restore visible (but still gentle) motion to the wood-grain texture on every bark section. Currently the grain is static because the animated transform is applied to the wrapper `<div>`, but the SVG inside fills the wrapper exactly — so translating the wrapper moves nothing visible. We need the *texture* to drift, not its container.

## Why there's no motion now

In `BarkGrain.tsx` the `.bark-grain` wrapper has `position: absolute; inset: 0` and the `<svg>` inside has `width: 100%; height: 100%`. The CSS keyframe `grain-flow` translates the wrapper by ~1% — but because the wrapper is clipped to the section bounds and the SVG fills it edge-to-edge, the visible pixels don't change. Net effect: zero perceptible motion.

## Fix

Two small, surgical changes:

1. **Move the animation onto the SVG, not the wrapper, and oversize the SVG so it has room to drift.**
   - Wrapper stays static (`absolute inset-0`, holds the base gradient wash).
   - The `<svg>` is sized `width: 110%; height: 110%` and offset `left: -5%; top: -5%`, then gets the `bark-grain` class with the transform animation. Now translating it by 2–3% reveals fresh turbulence on each side instead of clipping to nothing.

2. **Make the keyframe motion larger and a touch faster, but still gentle.**
   - New `@keyframes grain-flow`: drifts `translate3d(-3%, 1.5%, 0)` at the midpoint and back, with a barely-there `scale(1.04)` breathe.
   - Duration: 90s (down from 120s) — slow enough to feel ambient, fast enough that a viewer notices movement within 10–15 seconds.
   - Easing stays `ease-in-out` so it glides rather than ticks.

3. **Keep readability and reduced-motion guards intact.**
   - SVG opacity stays at 0.35.
   - The existing `@media (prefers-reduced-motion: reduce)` block already disables `.bark-grain` animation — no change needed.

## Files

- `src/components/ui/BarkGrain.tsx` — move the `bark-grain` class from the wrapper `<div>` to the `<svg>`; oversize and offset the SVG so it has room to translate without revealing the section background.
- `src/index.css` — update `@keyframes grain-flow` values (larger translate, slight scale) and shorten duration to 90s.

No other files change. All bark sections (`Footer`, `ICPStrip`, `ClientVoice`, `Method`, `MobileProofVoice`, `About`, `Work`, `PeopleOps`, `IntelligenceArticle`, `Intelligence`, `Enablement`, `MethodPage`) inherit the restored motion automatically.

## Out of scope

- Any change to grain colour, density, or seed logic.
- Touching non-bark surfaces.

