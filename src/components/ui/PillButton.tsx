import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface PillButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "outline" | "filled";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  external?: boolean;
  /**
   * Stable identifier for analytics, e.g. "aioi_hero", "contact_invitation".
   * When set, fires a GA4 `cta_click` event with `cta_id`, `cta_location`,
   * `cta_label`, and `link_url`. Use snake_case ids so reports group cleanly.
   */
  cta?: string;
  /** Optional surface name for the event, e.g. "hero", "article_footer". */
  ctaLocation?: string;
}

export const PillButton = ({
  children,
  href,
  onClick,
  variant = "outline",
  type = "button",
  disabled,
  className,
  external,
  cta,
  ctaLocation,
}: PillButtonProps) => {
  const base =
    "inline-flex items-center justify-center rounded-full font-sans font-medium tracking-wider text-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    outline:
      "border border-cream/80 bg-transparent text-cream px-8 py-3.5 hover:bg-cream hover:text-green",
    filled:
      "bg-cream text-green px-10 py-4 hover:bg-cream/90 shadow-[0_0_0_1px_hsl(var(--cream)/0.2)]",
  };
  const classes = cn(base, variants[variant], className);

  /** Fire the cta_click event. Label is derived from children when string-ish. */
  const fireCta = () => {
    if (!cta) return;
    const label =
      typeof children === "string"
        ? children
        : Array.isArray(children)
          ? children.filter((c) => typeof c === "string").join(" ").trim()
          : undefined;
    track("cta_click", {
      cta_id: cta,
      cta_location: ctaLocation,
      cta_label: label?.slice(0, 100),
      link_url: href,
    });
  };

  if (href) {
    if (external || href.startsWith("mailto:") || href.startsWith("http") || href.startsWith("#")) {
      return (
        <a href={href} className={classes} onClick={fireCta}>
          {children}
        </a>
      );
    }

    return (
      <Link to={href} className={classes} onClick={fireCta}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={() => {
        fireCta();
        onClick?.();
      }}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};
