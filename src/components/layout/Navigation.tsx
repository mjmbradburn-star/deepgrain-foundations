import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/method", label: "Method" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

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
          scrolled || open
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
                      active ? "text-cream opacity-100" : "text-cream/70 hover:opacity-100",
                    )}
                    style={{ letterSpacing: "0.12em" }}
                  >
                    {link.label}
                  </Link>
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-2 left-0 right-0 h-px bg-brass"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-40 bg-green flex flex-col items-center justify-center gap-10 md:hidden"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
