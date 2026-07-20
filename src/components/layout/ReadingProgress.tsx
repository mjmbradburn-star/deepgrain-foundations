import { useEffect, useRef, useState } from "react";

/**
 * Thin brass progress bar for long-form pages. Sits directly under the
 * primary nav. Tracks the document scroll position as a 0 to 100% fill so
 * readers can see how far into an article they are.
 *
 * Scroll work is batched into one requestAnimationFrame and state only
 * changes when the rounded percentage actually moves, so a long article
 * does not re-render the bar on every scroll frame.
 *
 * Render conditionally - only on routes where it adds value (intelligence
 * articles, pillars, clusters).
 */
export const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);
  const last = useRef(-1);

  useEffect(() => {
    const measure = () => {
      frame.current = null;
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((scrolled / max) * 100))) : 0;
      if (pct !== last.current) {
        last.current = pct;
        setProgress(pct);
      }
    };
    const update = () => {
      if (frame.current == null) frame.current = requestAnimationFrame(measure);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-24 md:top-28 inset-x-0 z-40 h-[2px] bg-cream/10 pointer-events-none"
    >
      <div
        className="h-full bg-brass transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
