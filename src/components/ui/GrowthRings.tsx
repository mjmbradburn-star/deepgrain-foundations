import { useEffect, useRef, useState } from "react";

interface GrowthRingsProps {
  /** One value per ring, 0-100, drawn innermost first. */
  values: number[];
  /** Labels matching values, used for the accessible description only. */
  labels?: string[];
  className?: string;
}

/**
 * Tree growth rings as a score visual. One ring per capability layer; the
 * brass arc length is the layer's score. Rings draw in over 1600ms with the
 * brand easing on first view, once, respecting prefers-reduced-motion.
 * Decorative reinforcement of the numeric bars, so the SVG itself is hidden
 * from assistive tech and the numbers remain the accessible source of truth.
 */
export const GrowthRings = ({ values, labels, className }: GrowthRingsProps) => {
  const [drawn, setDrawn] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const size = 420;
  const c = size / 2;
  const innerRadius = 58;
  const step = 38;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={
        labels
          ? `Growth rings: ${labels.map((l, i) => `${l} ${values[i]} out of 100`).join(", ")}`
          : undefined
      }
    >
      {/* faint heartwood centre */}
      <circle cx={c} cy={c} r={innerRadius - 22} fill="hsl(var(--brass) / 0.08)" />
      <circle
        cx={c}
        cy={c}
        r={innerRadius - 34}
        fill="none"
        stroke="hsl(var(--cream) / 0.12)"
        strokeWidth="1"
      />
      {values.map((value, i) => {
        const r = innerRadius + i * step;
        const circumference = 2 * Math.PI * r;
        const arc = (Math.max(0, Math.min(100, value)) / 100) * circumference;
        return (
          <g key={i}>
            <circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke="hsl(var(--cream) / 0.12)"
              strokeWidth="1"
            />
            <circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke="hsl(var(--brass) / 0.75)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${arc} ${circumference}`}
              strokeDashoffset={drawn ? 0 : arc}
              opacity={drawn ? 1 : 0}
              transform={`rotate(-90 ${c} ${c})`}
              style={{
                transition:
                  "stroke-dashoffset 1600ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 700ms cubic-bezier(0.25, 0.1, 0.25, 1)",
                transitionDelay: `${i * 140}ms`,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
};
