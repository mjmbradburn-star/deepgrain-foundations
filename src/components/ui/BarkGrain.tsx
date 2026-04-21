/**
 * Organic wood-grain texture layer for dark grey-green (bark) surfaces.
 * Three-layer structure to keep SVG transform quirks out of the animation:
 *   outer gradient div (clip)
 *     → inner `.bark-grain-anim` div (owns the animation, HTML transform)
 *       → static SVG (pure texture, no offsets, no animation)
 * Append `?debugGrain=1` to any URL to outline the animated wrapper and
 * register it with a fixed HUD that samples computed transform.
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
  const animRef = useRef<HTMLDivElement | null>(null);
  const debug = isGrainDebug();

  useEffect(() => {
    if (!debug) return;
    const el = animRef.current;
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
      <div
        ref={animRef}
        className="bark-grain-anim absolute -inset-[5%]"
        style={{
          opacity: 0.35,
          ...(debug
            ? {
                outline: "2px dashed #ff4fd8",
                outlineOffset: "-2px",
                backgroundColor: "rgba(255, 79, 216, 0.15)",
                // Force motion on in debug, even under reduced-motion
                animation:
                  "grain-flow-boot 6s ease-out 1, grain-flow 12s ease-in-out 6s infinite",
              }
            : {}),
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: "block" }}
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
    </div>
  );
};
