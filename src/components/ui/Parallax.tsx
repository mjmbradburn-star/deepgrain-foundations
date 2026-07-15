import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  /**
   * Parallax strength. Positive values drift the layer slower than the scroll
   * (classic depth), negative values push it the other way. Sensible range
   * -0.4 to 0.4. Default 0.15.
   */
  speed?: number;
  className?: string;
  style?: CSSProperties;
  /** Cap the translation in px so a backdrop never drifts out of its frame. */
  max?: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll-driven parallax wrapper. Translates its child on the Y axis as the
 * element passes through the viewport, so grain and topographic backdrops sit
 * on a deeper plane than the copy above them.
 *
 * GPU-only (`transform` / `translate3d`), a single passive scroll listener
 * batched into one `requestAnimationFrame`, and fully inert under
 * `prefers-reduced-motion`. Position the layer with `className`
 * (e.g. `absolute inset-0`); Parallax only owns the transform.
 */
export const Parallax = ({
  children,
  speed = 0.15,
  className,
  style,
  max = 120,
}: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    const apply = () => {
      frame.current = null;
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      // Distance of this layer's centre from the viewport centre, scaled.
      const raw = (viewportCenter - elementCenter) * speed;
      const offset = Math.max(-max, Math.min(max, raw));
      node.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (frame.current == null) frame.current = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [speed, max]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(className)}
      style={{ willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
};
