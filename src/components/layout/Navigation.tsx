import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Primary narrative of the business. These earn a spot on the bar. */
const sections = [
  { to: "/method", label: "Method" },
  { to: "/work", label: "Work" },
  { to: "/enablement", label: "Enablement" },
  { to: "/intelligence", label: "Intelligence" },
  { to: "/about", label: "About" },
];

/** The interactive diagnostics and the reference model. Grouped, not dumped. */
const tools = [
  {
    to: "/readiness",
    label: "Readiness Assessment",
    blurb: "Score your People function in 8 minutes",
  },
  {
    to: "/exposure-map",
    label: "AI Exposure Map",
    blurb: "See what AI touches, function by function",
  },
  {
    to: "/brain",
    label: "The People Ops AI Brain",
    blurb: "The four-layer operating model, in full",
  },
];

const TOOL_PATHS = tools.map((t) => t.to);

const ArrowRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Chevron = ({ className }: { className?: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Information architecture, not a link dump. Five section links carry the
 * story; the three diagnostics live under a single Tools menu; the paid
 * offer is the one filled button. CSS-only (hover + focus-within for the
 * menu, a slide-down panel on mobile). No animation library on the critical
 * path.
 */
export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  // The nav is transparent only over a dark hero (home, readiness). Everywhere
  // else it stays solid from the top so cream links never sit on linen.
  const darkHeroRoute = pathname === "/" || pathname === "/readiness";
  const solid = scrolled || open || !darkHeroRoute;

  const sectionActive = (to: string) => {
    if (pathname === to) return true;
    if (to === "/intelligence")
      return pathname.startsWith("/intelligence") || pathname.startsWith("/answers");
    if (to === "/method") return pathname.startsWith("/method");
    if (to === "/enablement") return pathname.startsWith("/enablement");
    return false;
  };
  const toolsActive = TOOL_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const navLink =
    "font-sans uppercase text-[11px] tracking-[0.12em] transition-opacity duration-200";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          solid ? "bg-green/95 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="container-grain flex items-center justify-between h-24 md:h-28">
          <Link
            to="/"
            className="font-display text-cream uppercase font-semibold text-2xl md:text-3xl"
            style={{ letterSpacing: "0.14em" }}
          >
            Deepgrain
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-9">
            <ul className="flex items-center gap-9">
              {sections.map((link) => {
                const active = sectionActive(link.to);
                return (
                  <li key={link.to} className="relative">
                    <Link
                      to={link.to}
                      aria-current={pathname === link.to ? "page" : undefined}
                      className={cn(
                        navLink,
                        active ? "text-cream opacity-100" : "text-cream/70 hover:opacity-100",
                      )}
                    >
                      {link.label}
                    </Link>
                    {active && (
                      <span
                        aria-hidden
                        className="absolute -bottom-2 left-0 right-0 h-px bg-brass animate-[fade-in-up_0.4s_ease-out_both]"
                      />
                    )}
                  </li>
                );
              })}

              {/* Tools menu */}
              <li className="relative group">
                <button
                  type="button"
                  aria-haspopup="true"
                  className={cn(
                    navLink,
                    "inline-flex items-center gap-1.5 cursor-pointer",
                    toolsActive ? "text-cream opacity-100" : "text-cream/70 hover:opacity-100",
                  )}
                >
                  Tools
                  <Chevron className="opacity-60 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
                </button>
                {toolsActive && (
                  <span
                    aria-hidden
                    className="absolute -bottom-2 left-0 right-4 h-px bg-brass animate-[fade-in-up_0.4s_ease-out_both]"
                  />
                )}
                {/* pt-5 is the hover bridge from trigger to panel */}
                <div className="absolute right-0 top-full pt-5 opacity-0 invisible translate-y-1 transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0">
                  <div className="w-[320px] rounded-[16px] bg-bark ring-1 ring-cream/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] p-2">
                    {tools.map((t) => (
                      <Link
                        key={t.to}
                        to={t.to}
                        className="block rounded-[10px] px-3.5 py-3 transition-colors duration-200 hover:bg-cream/[0.06]"
                      >
                        <span className="block font-sans uppercase text-[11px] tracking-[0.12em] text-cream">
                          {t.label}
                        </span>
                        <span className="block font-display italic text-[13px] leading-snug text-cream/55 mt-0.5">
                          {t.blurb}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            </ul>

            <Link
              to="/grain-audit"
              className="group inline-flex items-center gap-1 rounded-full bg-cream text-green pl-5 pr-2.5 py-2 font-sans uppercase text-[11px] tracking-[0.12em] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/90 active:scale-[0.98] shadow-[0_1px_0_hsl(var(--cream)/0.6)_inset]"
            >
              Book a Grain Audit
              <span className="ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green/10 text-green transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                <ArrowRight />
              </span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-cream p-2 -mr-2"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-green md:hidden transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-y-auto",
          open ? "translate-y-0" : "-translate-y-full pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div className="min-h-full flex flex-col justify-center px-8 pt-28 pb-12 gap-8">
          <nav className="flex flex-col gap-5">
            {sections.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-display text-cream text-4xl leading-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="h-px bg-cream/15" />

          <div className="flex flex-col gap-4">
            <span
              className="font-sans uppercase text-brass text-[11px]"
              style={{ letterSpacing: "0.2em" }}
            >
              Tools
            </span>
            {tools.map((t) => (
              <Link key={t.to} to={t.to} className="flex flex-col">
                <span className="font-display text-cream text-2xl leading-tight">{t.label}</span>
                <span className="font-display italic text-cream/55 text-[15px] mt-0.5">
                  {t.blurb}
                </span>
              </Link>
            ))}
          </div>

          <Link
            to="/grain-audit"
            className="group mt-2 inline-flex items-center justify-between gap-2 rounded-full bg-cream text-green pl-7 pr-3 py-4 font-sans uppercase text-[13px] tracking-[0.12em]"
          >
            Book a Grain Audit
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green/10 text-green">
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/contact"
            className="font-sans uppercase text-cream/50 text-[11px] tracking-[0.2em] mt-1"
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  );
};
