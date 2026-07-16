import { useId } from "react";

/**
 * The signature artifact: a living wood-grain cross-section. Perfect concentric
 * rings are warped into organic growth rings by a static turbulence-displacement
 * filter (rendered once, cheap), then a brass light sweeps around the band on a
 * slow loop and the whole piece breathes almost imperceptibly. This is the grain
 * metaphor made alive, not a stock render in a box.
 *
 * Motion is GPU-only (a rotating masked sheen + a slow scale breathe) and the
 * expensive displacement filter never re-runs per frame. Fully static under
 * prefers-reduced-motion.
 */
export const GrainRings = ({ className }: { className?: string }) => {
  const uid = useId().replace(/:/g, "");
  const warp = `warp-${uid}`;
  const ring = `ring-${uid}`;
  const core = `core-${uid}`;

  // Organic, non-uniform ring spacing. Wood never grows evenly.
  const radii = [22, 40, 55, 73, 86, 104, 121, 134, 152, 170, 184, 203, 221, 240, 258, 276];

  return (
    <div className={["grain-art relative aspect-square w-full", className].filter(Boolean).join(" ")}>
      <svg
        viewBox="0 0 600 600"
        className="grain-art-svg absolute inset-0 h-full w-full"
        role="img"
        aria-label="Concentric growth rings, the grain of an organisation"
      >
        <defs>
          <filter id={warp} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="11" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <radialGradient id={ring} cx="42%" cy="40%" r="66%">
            <stop offset="0%" stopColor="hsl(var(--brass))" stopOpacity="1" />
            <stop offset="40%" stopColor="hsl(var(--brass))" stopOpacity="0.88" />
            <stop offset="70%" stopColor="hsl(var(--cream))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--brass))" stopOpacity="0.42" />
          </radialGradient>
          <radialGradient id={core} cx="42%" cy="40%" r="60%">
            <stop offset="0%" stopColor="hsl(var(--brass))" stopOpacity="0.62" />
            <stop offset="55%" stopColor="hsl(var(--brass))" stopOpacity="0.16" />
            <stop offset="100%" stopColor="hsl(var(--brass))" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g filter={`url(#${warp})`}>
          <circle cx="300" cy="300" r="150" fill={`url(#${core})`} />
          {radii.map((r, i) => (
            <circle
              key={r}
              cx="300"
              cy="300"
              r={r}
              fill="none"
              stroke={`url(#${ring})`}
              strokeWidth={2.2 + ((i + 2) % 4) * 1}
              strokeOpacity={0.98 - i * 0.011}
            />
          ))}
        </g>
      </svg>

      {/* Brass light raking around the rings. */}
      <div className="grain-sheen absolute inset-0" aria-hidden />

      <style>{`
        .grain-art { will-change: transform; }
        .grain-art-svg { animation: grain-breathe 14s ease-in-out infinite; transform-origin: 46% 42%; }
        .grain-sheen {
          border-radius: 50%;
          background: conic-gradient(from 0deg,
            transparent 0deg,
            hsl(var(--brass) / 0.30) 26deg,
            hsl(var(--cream) / 0.14) 46deg,
            transparent 92deg,
            transparent 360deg);
          -webkit-mask: radial-gradient(circle at 46% 42%, transparent 6%, #000 20%, #000 90%, transparent 99%);
                  mask: radial-gradient(circle at 46% 42%, transparent 6%, #000 20%, #000 90%, transparent 99%);
          mix-blend-mode: screen;
          animation: grain-rake 11s linear infinite;
        }
        @keyframes grain-rake { to { transform: rotate(360deg); } }
        @keyframes grain-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.018); }
        }
        @media (prefers-reduced-motion: reduce) {
          .grain-art-svg, .grain-sheen { animation: none; }
        }
      `}</style>
    </div>
  );
};
