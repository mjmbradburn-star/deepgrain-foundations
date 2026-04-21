/**
 * Organic wood-grain texture layer for dark grey-green (bark) surfaces.
 *
 * Built from SVG turbulence (not repeating gradients) so the grain reads as
 * real wood: long vertical fibres, soft cathedral figure, subtle knots, no
 * uniform stripes. Two filtered layers stack inside one `<svg>`:
 *   1. Tight high-X / low-Y turbulence → fine vertical fibres.
 *   2. Low-frequency turbulence → broad cathedral figure / knots.
 * Each consumer passes a unique `seed` so no two sections look identical.
 *
 * Sits at `z-0` inside any `relative overflow-hidden` parent with `bg-bark`.
 * Content should be wrapped in a `relative z-10` container (BarkSection does
 * this automatically) so it always paints above the grain.
 *
 * Motion: animated via a single `transform` on the wrapper (`.bark-grain`),
 * 120s cycle, GPU-accelerated. Reduced-motion users get a static grain.
 */
interface BarkGrainProps {
  seed?: number;
}

export const BarkGrain = ({ seed = 7 }: BarkGrainProps) => {
  const fibreSeed = seed;
  const figureSeed = seed + 13;
  const fibreId = `bark-fibre-${seed}`;
  const figureId = `bark-figure-${seed}`;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        // Base dark grey-green wash so the SVG fibres tint over a real surface.
        background:
          "linear-gradient(180deg, hsl(var(--bark)) 0%, hsl(var(--bark-2)) 50%, hsl(var(--bark)) 100%)",
      }}
    >
      <svg
        className="bark-grain absolute"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ opacity: 0.35, top: "-5%", left: "-5%", width: "110%", height: "110%" }}
      >
        <defs>
          {/* Fine vertical fibres: high X frequency, very low Y frequency. */}
          <filter id={fibreId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9 0.012"
              numOctaves={2}
              seed={fibreSeed}
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.95
                      0 0 0 0 0.93
                      0 0 0 0 0.85
                      0 0 0 0.45 -0.2"
            />
          </filter>
          {/* Broad figure / knots: low frequency in both axes. */}
          <filter id={figureId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.008"
              numOctaves={2}
              seed={figureSeed}
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.05
                      0 0 0 0 0.07
                      0 0 0 0 0.05
                      0 0 0 0.55 -0.25"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${fibreId})`} />
        <rect width="100%" height="100%" filter={`url(#${figureId})`} />
      </svg>
    </div>
  );
};
