/**
 * Organic wood-grain texture layer for dark grey-green (bark) surfaces.
 * See file history for full notes. Now includes an opt-in debug mode
 * (append `?debugGrain=1` to the URL) that outlines the animated SVG
 * and registers it with a fixed HUD so we can verify motion.
 */
import { useEffect, useRef } from "react";
import { isGrainDebug, registerGrain } from "@/lib/debugGrain";

interface BarkGrainProps {
  seed?: number;
}

export const BarkGrain = ({ seed = 7 }: BarkGrainProps) => {
  const fibreSeed = seed;
  const figureSeed = seed + 13;
  const fibreId = `bark-fibre-${seed}`;
  const figureId = `bark-figure-${seed}`;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const debug = isGrainDebug();

  useEffect(() => {
    if (!debug) return;
    const el = svgRef.current;
    const parent = el?.parentElement ?? null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line no-console
    console.info("[BarkGrain] mount", {
      seed,
      parentTag: parent?.tagName,
      parentClass: parent?.className,
      parentOverflow: parent ? getComputedStyle(parent).overflow : null,
      parentPosition: parent ? getComputedStyle(parent).position : null,
      prefersReducedMotion: reduced,
    });
    return registerGrain(seed, el);
  }, [debug, seed]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, hsl(var(--bark)) 0%, hsl(var(--bark-2)) 50%, hsl(var(--bark)) 100%)",
      }}
    >
      <svg
        ref={svgRef}
        className="bark-grain absolute"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          opacity: 0.35,
          top: "-5%",
          left: "-5%",
          width: "110%",
          height: "110%",
          ...(debug
            ? {
                outline: "2px dashed #ff4fd8",
                outlineOffset: "-2px",
                backgroundColor: "rgba(255, 79, 216, 0.15)",
                // Force motion on in debug, even under reduced-motion
                animation: "grain-flow 12s ease-in-out infinite",
              }
            : {}),
        }}
      >
        <defs>
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
