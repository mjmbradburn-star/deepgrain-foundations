import { forwardRef, useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  /** If true, animate every time `value` changes (not just on first reveal). Useful for live calculators. */
  live?: boolean;
  className?: string;
  formatter?: (n: number) => string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Counts up to `value` with an ease-out curve. Triggers on scroll into view by default,
 * or re-animates on every value change when `live` is true.
 */
const AnimatedNumberInner = forwardRef<HTMLSpanElement, AnimatedNumberProps>(({
  value,
  duration = 1400,
  decimals = 0,
  suffix = "",
  prefix = "",
  live = false,
  className,
  formatter,
}, forwardedRef) => {
  const [display, setDisplay] = useState(live ? value : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);
  const fromRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const animate = (from: number, to: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (prefersReducedMotion()) {
      setDisplay(to);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOut(t);
      setDisplay(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // Live mode: re-animate from previous value to new value on every change.
  useEffect(() => {
    if (!live) return;
    const from = display;
    fromRef.current = value;
    animate(from, value);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, live]);

  // Reveal mode: animate once when scrolled into view.
  useEffect(() => {
    if (live) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            animate(0, value);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, live]);

  const formatted = formatter
    ? formatter(display)
    : display.toLocaleString("en-GB", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  const setRefs = (node: HTMLSpanElement | null) => {
    ref.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLSpanElement | null>).current = node;
    }
  };

  return (
    <span ref={setRefs} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
});

AnimatedNumberInner.displayName = "AnimatedNumber";

export const AnimatedNumber = AnimatedNumberInner;
