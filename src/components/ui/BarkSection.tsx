import { useId, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { BarkGrain } from "@/components/ui/BarkGrain";

/**
 * Dark grey-green section wrapper with the animated wood-grain layer baked in.
 *
 * Use this anywhere we previously reached for `bg-walnut` on a full-width
 * section. It guarantees `bg-bark`, `relative overflow-hidden`, the
 * `<BarkGrain />` texture layer, and a `relative z-10` content wrapper so
 * children sit above the grain.
 *
 * `as` is narrowed to a small set of valid block-level element names - this
 * avoids the HMR-time "Component is not a function" failure that can happen
 * when an arbitrary `ElementType` is mid-edit. Defaults to `<section>`, with
 * a runtime fallback to `<section>` if anything falsy slips through.
 *
 * Each instance derives a unique grain seed from `useId`, so no two bark
 * sections render identical fibres.
 */
type BarkTag = "section" | "footer" | "aside" | "div";

interface BarkSectionProps extends HTMLAttributes<HTMLElement> {
  as?: BarkTag;
  contentClassName?: string;
}

export const BarkSection = ({
  as,
  className,
  contentClassName,
  children,
  ...rest
}: BarkSectionProps) => {
  const Tag = (as || "section") as BarkTag;
  const reactId = useId();
  // Derive a small positive integer seed from the React id so each section
  // gets a stable but unique turbulence pattern across re-renders.
  const seed =
    Array.from(reactId).reduce((acc, c) => acc + c.charCodeAt(0), 0) % 9973;

  return (
    <Tag
      className={cn("relative overflow-hidden bg-bark text-cream", className)}
      {...rest}
    >
      <BarkGrain seed={seed} />
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </Tag>
  );
};
