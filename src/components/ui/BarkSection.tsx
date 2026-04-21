import { forwardRef, type ElementType, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { BarkGrain } from "@/components/ui/BarkGrain";

/**
 * Dark grey-green section wrapper with the animated wood-grain layer baked in.
 *
 * Use this anywhere we previously reached for `bg-walnut` on a full-width
 * section. It guarantees:
 *   - the correct `bg-bark` token
 *   - `relative overflow-hidden` (required so the grain layer is clipped)
 *   - the `<BarkGrain />` texture layer beneath the content
 *   - a `relative` content wrapper so children sit above the grain
 *
 * Pass `as` to render as `<footer>`, `<aside>`, etc. Defaults to `<section>`.
 * `contentClassName` styles the inner wrapper (where you'd normally put
 * `container-grain`, padding, max-width, etc.).
 */
type BarkSectionProps<T extends ElementType = "section"> = {
  as?: T;
  contentClassName?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export const BarkSection = forwardRef<HTMLElement, BarkSectionProps>(
  ({ as, className, contentClassName, children, ...rest }, ref) => {
    const Tag = (as ?? "section") as ElementType;
    return (
      <Tag
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-bark text-cream",
          className,
        )}
        {...rest}
      >
        <BarkGrain />
        <div className={cn("relative", contentClassName)}>{children}</div>
      </Tag>
    );
  },
);
BarkSection.displayName = "BarkSection";
