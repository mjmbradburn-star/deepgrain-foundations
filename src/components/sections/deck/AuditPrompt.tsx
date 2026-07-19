import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface AuditPromptProps {
  /** Headline above the CTA. Default: "Map one workflow with me." */
  headline?: string;
  /** Soft italic line beneath the headline. */
  sub?: string;
  /**
   * Section-specific prefill for the contact form. The form reads `?subject=`
   * and drops it straight into the message field so the user lands on a
   * pre-written sentence, not a blank page.
   */
  prefill: string;
  /** Stable analytics id, e.g. `audit_home_worked_example`. */
  ctaId: string;
  ctaLocation?: string;
  tone?: "green" | "linen";
  className?: string;
}

/**
 * The recurring CTA spine. One offer, repeated everywhere the user has been
 * given a reason to act. Always points at /contact with a `?subject=` prefill
 * so the contact form is never a blank page.
 */
export const AuditPrompt = ({
  headline = "Map one workflow with me.",
  sub = "Thirty minutes. Leave with one move for Monday.",
  prefill,
  ctaId,
  ctaLocation,
  tone = "green",
  className,
}: AuditPromptProps) => {
  const isGreen = tone === "green";
  const href = `/contact?subject=${encodeURIComponent(prefill)}`;

  const onClick = () => {
    track("cta_click", {
      cta_id: ctaId,
      cta_location: ctaLocation,
      cta_label: "Book a 30-minute call",
      link_url: href,
    });
  };

  return (
    <div className={cn("flex flex-col items-start gap-5", className)}>
      <div>
        <h3
          className={cn(
            "font-display text-3xl md:text-4xl leading-[1.1]",
            isGreen ? "text-cream" : "text-walnut",
          )}
        >
          {headline}
        </h3>
        {sub && (
          <p
            className={cn(
              "font-display italic mt-2 text-lg md:text-xl",
              isGreen ? "text-cream/70" : "text-walnut/70",
            )}
          >
            {sub}
          </p>
        )}
      </div>
      <Link
        to={href}
        onClick={onClick}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-sans text-sm tracking-wider transition-all duration-300",
          isGreen
            ? "bg-cream text-green hover:bg-cream/90"
            : "bg-green text-cream hover:bg-green/90",
        )}
      >
        Book a 30-minute call
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </div>
  );
};
