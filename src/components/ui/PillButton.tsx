import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PillButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "outline" | "filled";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  external?: boolean;
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

  if (href) {
    if (external || href.startsWith("mailto:") || href.startsWith("http")) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
};
