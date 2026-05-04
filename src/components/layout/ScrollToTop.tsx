import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll behaviour on route change.
 *
 * Default: jump to top. If the URL carries a hash (e.g. deep link to a
 * heading inside an article), scroll the matching element into view instead.
 * The element may not exist yet on first paint for lazy/MDX content, so we
 * retry on a short rAF loop bounded to ~1s.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
      if (performance.now() - start < 1500) {
        frame = requestAnimationFrame(tick);
      } else {
        window.scrollTo(0, 0);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
};
