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
 * Deck-style eyebrow: tracked-caps label, brass on a dark surface, a readable
 * ink tone on linen. The plain (non-pill) variant no longer carries a
 * decorative hairline rule; a rule beside a label added no meaning, so it was
 * removed. Use `pill` for the rounded-capsule variant with the brass dot.
 */
export const SectionEyebrow = ({
  children,
  className,
  tone = "green",
  pill = false,
}: SectionEyebrowProps) => {
  const label = tone === "linen" ? "text-walnut" : "text-brass";
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
      className={cn("font-sans uppercase", label, className)}
      style={{ fontSize: "11px", letterSpacing: "0.22em", fontWeight: 600 }}
    >
      {content}
    </p>
  );
};
