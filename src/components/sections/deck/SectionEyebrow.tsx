import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionEyebrowProps {
  children?: ReactNode;
  className?: string;
  /** Tone of the surrounding section — drives the brass/walnut variant. */
  tone?: "green" | "linen";
}

/**
 * Deck-style eyebrow. Renders as `— LABEL` with a brass em-dash glyph
 * preserved before the tracked-caps label, matching the rail used on every
 * Montagu slide. The em-dash is a deliberate typographic mark here, not
 * prose copy, so it sits outside the project's "no em dashes in prose" rule.
 */
export const SectionEyebrow = ({
  children,
  className,
  tone = "green",
}: SectionEyebrowProps) => {
  const label =
    tone === "green" ? "text-brass" : "text-brass";
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
      <span>{children || "DEEPGRAIN · AN OPERATING CONSULTANCY BUILT FOR THE AI ERA."}</span>
    </p>
  );
};
