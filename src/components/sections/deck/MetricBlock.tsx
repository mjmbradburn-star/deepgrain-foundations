import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricBlockProps {
  label?: ReactNode;
  value: ReactNode;
  caption?: ReactNode;
  tone?: "green" | "linen";
  size?: "md" | "lg";
  className?: string;
}

/**
 * Display-serif numeric anchor. The number carries the argument; the label
 * and caption support it. Matches the deck's `40 min`, `12 min`, `1 FTE`
 * pattern.
 */
export const MetricBlock = ({
  label,
  value,
  caption,
  tone = "green",
  size = "md",
  className,
}: MetricBlockProps) => {
  const isGreen = tone === "green";
  const labelColor = isGreen ? "text-brass" : "text-brass";
  const valueColor = isGreen ? "text-brass" : "text-brass";
  const captionColor = isGreen ? "text-cream/75" : "text-walnut/75";

  const valueSize =
    size === "lg"
      ? "text-[88px] md:text-[140px] leading-[0.95]"
      : "text-[64px] md:text-[96px] leading-[0.95]";

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <span
          className={cn("font-sans uppercase mb-2", labelColor)}
          style={{ fontSize: "11px", letterSpacing: "0.18em", fontWeight: 600 }}
        >
          {label}
        </span>
      )}
      <span
        className={cn("font-display font-medium tracking-tight", valueColor, valueSize)}
        style={{ fontVariantNumeric: "lining-nums" }}
      >
        {value}
      </span>
      {caption && (
        <span className={cn("mt-3 max-w-md leading-relaxed text-sm md:text-base", captionColor)}>
          {caption}
        </span>
      )}
    </div>
  );
};
