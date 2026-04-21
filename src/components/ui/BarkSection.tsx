import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { BarkGrain } from "@/components/ui/BarkGrain";

/**
 * Dark grey-green section wrapper with the animated wood-grain layer baked in.
 *
 * Use this anywhere we previously reached for `bg-walnut` on a full-width
 * section. It guarantees `bg-bark`, `relative overflow-hidden`, the
 * `<BarkGrain />` texture layer, and a `relative` content wrapper so children
 * sit above the grain.
 *
 * Pass `as` to render as `<footer>`, `<aside>`, etc. Defaults to `<section>`.
 * `contentClassName` styles the inner wrapper (e.g. `container-grain` + padding).
 */
interface BarkSectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  contentClassName?: string;
}

export const BarkSection = ({
  as: Tag = "section",
  className,
  contentClassName,
  children,
  ...rest
}: BarkSectionProps) => (
  <Tag
    className={cn("relative overflow-hidden bg-bark text-cream", className)}
    {...rest}
  >
    <BarkGrain />
    <div className={cn("relative", contentClassName)}>{children}</div>
  </Tag>
);
