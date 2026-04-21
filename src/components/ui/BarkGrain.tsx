/**
 * Animated wood-grain texture layer for dark grey-green (bark) surfaces.
 *
 * Sits at `z-0` inside any `relative overflow-hidden` parent with `bg-bark`.
 * Content should be wrapped in a `relative z-10` container (BarkSection does
 * this automatically) so it always paints above the grain.
 *
 * Two background layers (down from four) keep paint cost low while preserving
 * the wood look:
 *   1. A tight highlight/shadow stripe pair drifting one way.
 *   2. A wider, softer knot band drifting the other way at half speed.
 *
 * No blend modes — the colours are pre-baked at the right alpha so the
 * compositor can fast-path the layer. Animation runs on `background-position`
 * only, which the browser GPU-accelerates.
 */
export const BarkGrain = () => (
  <div
    aria-hidden
    className="bark-grain pointer-events-none absolute inset-0 z-0"
    style={{
      backgroundImage: [
        // Tight grain: bright cream highlight + dark shadow in one repeating band.
        "repeating-linear-gradient(90deg, hsl(var(--cream) / 0.10) 0px, hsl(var(--cream) / 0.10) 1px, transparent 1px, transparent 3px, hsl(0 0% 0% / 0.18) 3px, hsl(0 0% 0% / 0.18) 4px, transparent 4px, transparent 7px)",
        // Wider knot/streak band — soft, low-frequency.
        "repeating-linear-gradient(90deg, hsl(var(--cream) / 0.05) 0px, hsl(var(--cream) / 0.05) 2px, transparent 2px, transparent 19px)",
      ].join(", "),
      backgroundSize: "220% 100%, 320% 100%",
    }}
  />
);
