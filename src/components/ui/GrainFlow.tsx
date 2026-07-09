import { cn } from "@/lib/utils";

interface GrainFlowProps {
  className?: string;
  /** Stroke colour token. Brass reads on both surfaces. */
  tone?: "brass" | "walnut" | "cream";
  /** 0-1, default 0.25 */
  opacity?: number;
  /** Set false to render statically (the drift also stops for reduced motion). */
  drift?: boolean;
}

/**
 * Wood-grain contour lines flowing around a knot, as an organic layer that
 * crosses section seams. Inline SVG, ~1.5kb. The drift is a single GPU
 * translate3d loop (90s, matching the bark surface) and collapses to static
 * under prefers-reduced-motion via the .grain-drift rule in index.css.
 * Decorative only.
 */
export const GrainFlow = ({
  className,
  tone = "brass",
  opacity = 0.25,
  drift = true,
}: GrainFlowProps) => {
  const stroke = `hsl(var(--${tone}))`;
  // Grain lines bend around a knot centred at (1050, 150).
  const knotX = 1050;
  const knotY = 150;
  const lines = Array.from({ length: 9 }, (_, i) => {
    const baseY = 30 + i * 30;
    const points = Array.from({ length: 41 }, (_, j) => {
      const x = j * 60;
      const dx = x - knotX;
      const dy = baseY - knotY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Push each line away from the knot, decaying with distance.
      const push = 900 / (dist / 40 + 3.2);
      const y = baseY + (dy >= 0 ? push : -push) * 0.55 + Math.sin(j * 0.35 + i * 0.8) * 7;
      return `${j === 0 ? "M" : "L"} ${x} ${y.toFixed(1)}`;
    });
    return points.join(" ");
  });

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none overflow-hidden", className)}
      style={{ opacity }}
    >
      <div className={drift ? "grain-drift w-[200%] flex" : "w-[200%] flex"}>
        {[0, 1].map((copy) => (
          <svg
            key={copy}
            viewBox="0 0 2400 300"
            preserveAspectRatio="none"
            className="w-1/2 h-full shrink-0"
          >
            <g fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round">
              {lines.map((d, i) => (
                <path key={i} d={d} opacity={0.35 + (i % 4) * 0.16} />
              ))}
              {/* the knot itself: three nested ellipses */}
              <ellipse cx={knotX} cy={knotY} rx="52" ry="20" opacity="0.7" />
              <ellipse cx={knotX} cy={knotY} rx="30" ry="11" opacity="0.55" />
              <ellipse cx={knotX} cy={knotY} rx="12" ry="4.5" opacity="0.45" />
            </g>
          </svg>
        ))}
      </div>
    </div>
  );
};
