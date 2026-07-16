import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "dg_pill_dismissed";

/**
 * Persistent booking prompt. Slides in once the hero has scrolled away and
 * retreats again as the footer (and the closing invitation just above it)
 * approaches, so it never doubles up with an on-screen CTA. One action only:
 * Book a Grain Audit. Dismissible for the session, and fully static under
 * prefers-reduced-motion.
 *
 * A single passive scroll listener batched into one requestAnimationFrame,
 * mirroring the pattern in Navigation and Parallax. setVisible only flips the
 * boolean, so React bails out of re-render on every frame where it is unchanged.
 */
export const StickyBookingPill = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // start hidden until mounted

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    setDismissed(false);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        const docH = document.documentElement.scrollHeight;
        const pastHero = y > vh * 0.85;
        const nearBottom = y + vh > docH - 660;
        setVisible(pastHero && !nearBottom);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  const onBook = () =>
    track("cta_click", {
      cta_id: "audit_sticky_pill",
      cta_location: "sticky_pill",
      cta_label: "Book a Grain Audit",
      link_url: "/grain-audit",
    });

  if (dismissed) return null;

  return (
    <div
      className={[
        "fixed z-40 right-4 md:right-6 bottom-4 md:bottom-6 left-4 md:left-auto",
        "flex justify-center md:justify-end",
        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div className="group/pill relative inline-flex items-center gap-1 rounded-full bg-green/95 backdrop-blur-md ring-1 ring-brass/40 shadow-[0_16px_44px_-16px_rgba(0,0,0,0.6)] pl-5 pr-2 py-2">
        <span className="hidden sm:inline font-display italic text-cream/60 text-[13px] pr-1">
          Two weeks. One workflow.
        </span>
        <Link
          to="/grain-audit"
          onClick={onBook}
          tabIndex={visible ? 0 : -1}
          className="group inline-flex items-center gap-1 rounded-full bg-cream text-green pl-4 pr-2 py-2 font-sans uppercase text-[11px] tracking-[0.12em] transition-colors duration-300 hover:bg-cream/90 active:scale-[0.98]"
        >
          Book a Grain Audit
          <span className="ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green/10 text-green transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
        <button
          type="button"
          onClick={dismiss}
          tabIndex={visible ? 0 : -1}
          aria-label="Dismiss"
          className="ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-cream/45 hover:text-cream/80 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};
