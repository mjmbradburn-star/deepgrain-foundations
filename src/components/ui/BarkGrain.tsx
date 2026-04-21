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
    className="bark-grain pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
    style={{
      backgroundImage: [
        "linear-gradient(180deg, hsl(var(--bark)) 0%, hsl(var(--bark-2)) 50%, hsl(var(--bark)) 100%)",
        "repeating-linear-gradient(88deg, hsl(var(--cream) / 0.06) 0px, hsl(var(--cream) / 0.06) 1px, transparent 1px, transparent 5px)",
        "repeating-linear-gradient(92deg, hsl(var(--bark-2) / 0.5) 0px, hsl(var(--bark-2) / 0.5) 1px, transparent 1px, transparent 7px)",
      ].join(", "),
      backgroundSize: "100% 100%, 200% 100%, 200% 100%",
    }}
  />
);
