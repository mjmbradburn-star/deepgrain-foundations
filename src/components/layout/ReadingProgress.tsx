import { useEffect, useState } from "react";

/**
 * Thin brass progress bar for long-form pages. Sits directly under the
 * primary nav. Tracks the document scroll position as a 0–100% fill so
 * readers can see how far into an article they are.
 *
 * Render conditionally — only on routes where it adds value (intelligence
 * articles, pillars, clusters).
 */
export const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (scrolled / max) * 100)) : 0;
      setProgress(pct);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
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
