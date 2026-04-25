import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/method", label: "Method" },
  { to: "/work", label: "Work" },
  { to: "/enablement", label: "Enablement" },
  { to: "/intelligence", label: "Intelligence" },
  { to: "/brain", label: "Brain" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

/**
 * CSS-only navigation. The previous version pulled framer-motion (43KB gzipped)
 * onto the critical path for a single underline transition and a slide-in panel.
 */
export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled || open || pathname.startsWith("/method") || pathname.startsWith("/enablement")
            ? "bg-green/95 backdrop-blur-md"
            : "bg-transparent",
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

          <ul className="hidden md:flex items-center gap-10">
            {links.map((link) => {
              const active = pathname === link.to;
              return (
                <li key={link.to} className="relative">
                  <Link
                    to={link.to}
                    className={cn(
                      "font-sans uppercase text-[11px] transition-opacity duration-200",
                      active
                        ? "text-cream opacity-100"
                        : "text-cream/70 hover:opacity-100",
                    )}
                    style={{ letterSpacing: "0.12em" }}
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
          </ul>

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

      {/* Mobile slide-in panel — CSS transition, no JS animation lib. */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-green flex flex-col items-center justify-center gap-10 md:hidden transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          open ? "translate-y-0" : "-translate-y-full pointer-events-none",
        )}
        aria-hidden={!open}
      >
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="font-display text-cream text-5xl"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
};
