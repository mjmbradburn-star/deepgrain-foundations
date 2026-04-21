/**
 * Animated wood-grain texture layer for dark grey-green (bark) surfaces.
 *
 * Drop into any `relative overflow-hidden` parent with `bg-bark`. Two stacked
 * repeating-linear-gradients drift slowly via the `.bark-grain` keyframe; the
 * whole layer respects `prefers-reduced-motion` (handled in index.css).
 */
export const BarkGrain = () => (
  <div
    aria-hidden
    className="bark-grain pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-soft-light"
    style={{
      backgroundImage: [
        // Vertical depth wash so the section isn't flat.
        "linear-gradient(180deg, hsl(var(--bark)) 0%, hsl(var(--bark-2)) 50%, hsl(var(--bark)) 100%)",
        // Bright cream highlight grain — tight, sharp, drifts fastest.
        "repeating-linear-gradient(89deg, hsl(var(--cream) / 0.18) 0px, hsl(var(--cream) / 0.18) 1px, transparent 1px, transparent 4px)",
        // Dark shadow grain — slightly off-axis so it interferes with the highlight.
        "repeating-linear-gradient(91deg, hsl(0 0% 0% / 0.35) 0px, hsl(0 0% 0% / 0.35) 1px, transparent 1px, transparent 6px)",
        // Wider knot/streak band — soft, low-frequency, drifts slowest.
        "repeating-linear-gradient(90deg, hsl(var(--cream) / 0.08) 0px, hsl(var(--cream) / 0.08) 2px, transparent 2px, transparent 17px)",
      ].join(", "),
      backgroundSize: "100% 100%, 220% 100%, 180% 100%, 320% 100%",
    }}
  />
);
