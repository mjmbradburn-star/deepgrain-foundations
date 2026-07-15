import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionEyebrowProps {
  children?: ReactNode;
  className?: string;
  /** Tone of the surrounding section - drives the brass/walnut variant. */
  tone?: "green" | "linen";
  /**
   * Render as a rounded pill badge (brass dot + tracked label inside a hairline
   * capsule) instead of the default rule + label rail. Opt-in; default off.
   */
  pill?: boolean;
}

/**
 * Deck-style eyebrow. Renders as `,  LABEL` with a brass em-dash glyph
 * preserved before the tracked-caps label, matching the rail used on every
 * Montagu slide. The em-dash is a deliberate typographic mark here, not
 * prose copy, so it sits outside the project's "no em dashes in prose" rule.
 */
export const SectionEyebrow = ({
  children,
  className,
  tone = "green",
  pill = false,
}: SectionEyebrowProps) => {
  const label =
    tone === "green" ? "text-brass" : "text-brass";
  const content = children || "DEEPGRAIN · AN OPERATING CONSULTANCY BUILT FOR THE AI ERA.";

  if (pill) {
    return (
      <p
        className={cn(
          "inline-flex items-center gap-2.5 rounded-full border border-brass/30 bg-brass/[0.06] px-4 py-1.5 font-sans uppercase",
          label,
          className,
        )}
        style={{ fontSize: "11px", letterSpacing: "0.22em", fontWeight: 600 }}
      >
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
        <span>{content}</span>
      </p>
    );
  }

  return (
    <p
      className={cn(
        "flex items-center gap-3 font-sans uppercase",
        label,
        className,
      )}
      style={{ fontSize: "11px", letterSpacing: "0.22em", fontWeight: 600 }}
    >
      <span aria-hidden className="inline-block h-px w-8 bg-brass/80" />
      <span>{content}</span>
    </p>
  );
};
