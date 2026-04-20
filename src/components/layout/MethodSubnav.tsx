import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/method", label: "Method" },
  { to: "/enablement", label: "Enablement" },
];

/**
 * Section sub-nav for the Method ↔ Enablement pair. Renders only on those
 * routes. Fixed under the primary nav, same green palette, low height.
 *
 * Note: pages on these routes use pt-40 (160px) which clears the 96/112px
 * primary nav + 40px sub-nav on every viewport.
 */
export const MethodSubnav = () => {
  const { pathname } = useLocation();
  const show = pathname.startsWith("/method") || pathname.startsWith("/enablement");
  if (!show) return null;

  return (
    <div className="fixed top-24 md:top-28 inset-x-0 z-40 bg-green/95 backdrop-blur-md border-t border-cream/10">
      <div className="container-grain flex items-center gap-8 h-10">
        <span
          className="hidden sm:inline font-sans uppercase text-[10px] text-cream/50"
          style={{ letterSpacing: "0.18em" }}
        >
          In this section
        </span>
        <ul className="flex items-center gap-6">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <li key={item.to} className="relative">
                <Link
                  to={item.to}
                  className={cn(
                    "font-sans uppercase text-[11px] transition-opacity duration-200 py-1",
                    active
                      ? "text-cream opacity-100"
                      : "text-cream/60 hover:opacity-100",
                  )}
                  style={{ letterSpacing: "0.12em" }}
                >
                  {item.label}
                </Link>
                {active && (
                  <span
                    aria-hidden
                    className="absolute -bottom-0 left-0 right-0 h-px bg-brass"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
