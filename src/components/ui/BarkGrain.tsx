/**
 * Bark texture layer for dark grey-green sections.
 *
 * Renders a single static, CDN-hosted bark photograph behind the section
 * content. Replaces the previous animated SVG turbulence + grain-flow
 * keyframes; the static asset is faster, sharper, and visually richer.
 *
 * Public API is unchanged so every existing `<BarkGrain />` / `BarkSection`
 * call site keeps working. The `seed` prop is accepted but no longer used.
 */
import bark1200 from "@/assets/textures/bark-1200.webp.asset.json";
import bark1800 from "@/assets/textures/bark-1800.webp.asset.json";

interface BarkGrainProps {
  /** Retained for API compatibility. No longer affects rendering. */
  seed?: number;
}

export const BarkGrain = (_props: BarkGrainProps = {}) => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    style={{
      background:
        "linear-gradient(180deg, hsl(var(--bark)) 0%, hsl(var(--bark-2)) 50%, hsl(var(--bark)) 100%)",
    }}
  >
    <img
      src={bark1200.url}
      srcSet={`${bark1200.url} 1200w, ${bark1800.url} 1800w`}
      sizes="100vw"
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ opacity: 0.85, mixBlendMode: "normal" }}
    />
  </div>
);
