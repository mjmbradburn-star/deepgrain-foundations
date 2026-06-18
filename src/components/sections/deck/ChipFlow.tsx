import { type ReactNode, Fragment } from "react";
import { cn } from "@/lib/utils";

export interface ChipItem {
  label?: string;
  title: ReactNode;
  icon?: ReactNode;
  /** Optional sublabel rendered under the title in small caps. */
  sub?: string;
}

interface ChipFlowProps {
  items: ChipItem[];
  tone?: "green" | "linen";
  className?: string;
  /** Hide the arrow separators (use when items are conceptually parallel). */
  noArrows?: boolean;
}

/**
 * Chips with optional icons, connected by hairline arrows. Used for the
 * method ladder, the before/after, and the agent architecture.
 */
export const ChipFlow = ({ items, tone = "green", className, noArrows }: ChipFlowProps) => {
  const isGreen = tone === "green";
  const chipBg = isGreen ? "bg-cream" : "bg-cream";
  const chipBorder = isGreen ? "border-cream/0" : "border-walnut/10";
  const labelColor = "text-brass";
  const titleColor = "text-walnut";
  const arrowColor = isGreen ? "text-brass/80" : "text-brass/80";

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-stretch gap-4 md:gap-3",
        className,
      )}
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          <div
            className={cn(
              "flex-1 rounded-2xl px-6 py-7 md:py-9 flex flex-col items-center text-center shadow-[0_10px_30px_-20px_hsl(var(--green)/0.6)] border",
              chipBg,
              chipBorder,
            )}
          >
            {item.icon && (
              <div className="w-9 h-9 rounded-full border border-brass/40 flex items-center justify-center text-brass mb-4">
                {item.icon}
              </div>
            )}
            {item.label && (
              <div
                className={cn("font-sans uppercase mb-1.5", labelColor)}
                style={{ fontSize: "10px", letterSpacing: "0.2em", fontWeight: 600 }}
              >
                {item.label}
              </div>
            )}
            <div className={cn("font-display text-xl md:text-2xl leading-snug", titleColor)}>
              {item.title}
            </div>
            {item.sub && (
              <div className="text-walnut/60 text-xs mt-2 tracking-wide">{item.sub}</div>
            )}
          </div>
          {!noArrows && i < items.length - 1 && (
            <div className={cn("hidden md:flex items-center justify-center w-6", arrowColor)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};
