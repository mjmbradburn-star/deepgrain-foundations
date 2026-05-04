import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  name: string;
  /** Path relative to site root, e.g. "/intelligence". Omit on the current page. */
  href?: string;
}

/**
 * Visible breadcrumb trail. Pair with `buildBreadcrumbLd` so the visible
 * UI matches the JSON-LD Google parses. Variants match the two background
 * colour families used across content pages.
 */
export const Breadcrumbs = ({
  items,
  variant = "light",
  className = "",
}: {
  items: Crumb[];
  variant?: "light" | "dark";
  className?: string;
}) => {
  const colors =
    variant === "dark"
      ? { link: "text-cream/70 hover:text-cream", current: "text-cream", sep: "text-cream/40" }
      : { link: "text-walnut/60 hover:text-walnut", current: "text-walnut", sep: "text-walnut/30" };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`font-sans text-[12px] md:text-[13px] ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.name}-${i}`} className="flex items-center gap-1 min-w-0">
              {c.href && !last ? (
                <Link to={c.href} className={`${colors.link} transition-colors truncate`}>
                  {c.name}
                </Link>
              ) : (
                <span className={`${colors.current} truncate`} aria-current={last ? "page" : undefined}>
                  {c.name}
                </span>
              )}
              {!last && <ChevronRight className={`h-3 w-3 ${colors.sep}`} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
