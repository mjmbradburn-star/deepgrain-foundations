import { cn } from "@/lib/utils";

interface TopoBackdropProps {
  className?: string;
  /**
   * `ridge` — brass contour ridge, right-aligned. Mirrors the deck title slide.
   * `basin` — soft centered contour basin. Mirrors the "Stop auditing roles" slide.
   */
  variant?: "ridge" | "basin";
  /** 0–1, default 0.28. */
  opacity?: number;
}

/**
 * Brass topographic contour layer. Inline SVG so it ships with no extra
 * network round-trip and adds ~2kb gzipped. Decorative — aria-hidden.
 */
export const TopoBackdrop = ({
  className,
  variant = "ridge",
  opacity = 0.28,
}: TopoBackdropProps) => {
  if (variant === "basin") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
        style={{ opacity }}
      >
        <defs>
          <linearGradient id="topo-basin-fade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--brass))" stopOpacity="0" />
            <stop offset="40%" stopColor="hsl(var(--brass))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--brass))" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#topo-basin-fade)"
          strokeWidth="1"
          strokeLinecap="round"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
            const y = 200 + i * 50;
            const amp = 40 + i * 6;
            const phase = i * 0.35;
            const d = Array.from({ length: 33 }, (_, j) => {
              const x = j * 50;
              const yy =
                y +
                Math.sin(j * 0.35 + phase) * amp +
                Math.cos(j * 0.15 + phase * 2) * (amp * 0.4);
              return `${j === 0 ? "M" : "L"} ${x} ${yy}`;
            }).join(" ");
            return <path key={i} d={d} opacity={0.25 + (i % 5) * 0.12} />;
          })}
        </g>
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="topo-ridge-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="hsl(var(--brass))" stopOpacity="0" />
          <stop offset="55%" stopColor="hsl(var(--brass))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--brass))" stopOpacity="1" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#topo-ridge-fade)"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const baseY = 180 + i * 70;
          const amp = 80 + i * 10;
          const phase = i * 0.5;
          const d = Array.from({ length: 33 }, (_, j) => {
            const x = j * 50;
            const yy =
              baseY +
              Math.sin(j * 0.28 + phase) * amp -
              Math.max(0, (j - 18)) * (12 + i * 1.5);
            return `${j === 0 ? "M" : "L"} ${x} ${yy}`;
          }).join(" ");
          return <path key={i} d={d} opacity={0.4 + (i % 4) * 0.15} />;
        })}
      </g>
    </svg>
  );
};
