import {
  Children,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. Lower = faster. Default 42. */
  speed?: number;
  /** Scroll direction. Default "left". */
  direction?: "left" | "right";
  /** Pause the scroll while hovered. Default true. */
  pauseOnHover?: boolean;
  /** Gap between items, any Tailwind gap class. Default "gap-6". */
  gapClassName?: string;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Seamless horizontal marquee. Duplicates its children once and translates the
 * track by -50%, so the loop is joinless. GPU-only transform, one CSS keyframe
 * (`scroll-left` in index.css), pausable on hover.
 *
 * Under `prefers-reduced-motion` the track renders static (single copy, no
 * animation) so nothing moves. Use for logo walls or capability strips.
 */
export const Marquee = ({
  children,
  speed = 42,
  direction = "left",
  pauseOnHover = true,
  gapClassName = "gap-6",
  className,
}: MarqueeProps) => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(prefersReducedMotion()), []);

  const items = Children.toArray(children);

  if (reduced) {
    return (
      <div className={cn("dg-marquee w-full overflow-hidden", className)}>
        <div className={cn("flex w-max flex-wrap", gapClassName)}>{items}</div>
      </div>
    );
  }

  const trackStyle: CSSProperties = {
    animation: `scroll-left ${speed}s linear infinite`,
    animationDirection: direction === "right" ? "reverse" : "normal",
  };

  return (
    <div className={cn("dg-marquee w-full overflow-hidden", className)}>
      <div
        className={cn("dg-marquee-track flex w-max", gapClassName)}
        data-pause={pauseOnHover ? "true" : "false"}
        style={trackStyle}
      >
        {items}
        {/* Second copy makes the -50% loop seamless. `display:contents` keeps
            the duplicates as uniform flex siblings so the join is joinless.
            Decorative, hidden from assistive tech. */}
        <span style={{ display: "contents" }} aria-hidden>
          {items}
        </span>
      </div>
    </div>
  );
};
