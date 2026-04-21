

## Goal

Make the wood-grain motion unmistakably visible for the first few seconds after load, then ease back into the subtle ambient drift we have today. This gives a clear "yes, it's alive" signal without making the texture distracting long-term.

## Approach

Two-stage animation on `.bark-grain`:

1. **Boot stage (0–6s)**: a one-shot `grain-flow-boot` keyframe with larger amplitude (~8% translate, 1.08 scale) and a 6s duration. Runs once on mount.
2. **Ambient stage (6s →)**: the existing `grain-flow` keyframe with its current subtle values, started via `animation-delay: 6s` and `infinite`. Both animations are declared in a single `animation` shorthand list so the handoff is seamless.

Because both keyframes start and end at `transform: translate3d(0,0,0) scale(1)`, the transition between them is invisible — no jump.

### Reduced motion

The existing `@media (prefers-reduced-motion: reduce)` block in `index.css` already nukes `.bark-grain` animation. We leave that intact so users with the OS preference set see no motion at all, boot stage included.

### Debug mode

`BarkGrain.tsx` currently overrides `animation` to `grain-flow 12s ease-in-out infinite` when `?debugGrain=1` is set. We update that override to also chain the boot stage so debug sessions reflect production behaviour.

## Files

- `src/index.css` — add `@keyframes grain-flow-boot` (8% translate, 1.08 scale, 6s) and update `.bark-grain` to run `grain-flow-boot 6s ease-out 1, grain-flow 90s ease-in-out 6s infinite`.
- `src/components/ui/BarkGrain.tsx` — update the debug-mode `animation` override to the same two-stage chain (with the faster 12s ambient duration kept for debug visibility).

## Out of scope

- Changing the ambient amplitude or duration beyond the boot window.
- Touching non-bark surfaces or the Hero's `.hero-drift` layer.
- Removing the BarkGrain debug HUD.

