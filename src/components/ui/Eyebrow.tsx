import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  /**
   * @deprecated No-op. The decorative hairline rule beside the eyebrow was a
   * slop tell ("the little rule beside a label") and has been removed. Kept
   * on the prop type so existing call sites do not need an edit; the eyebrow
   * now always renders as plain tracked-caps text.
   */
  withRule?: boolean;
}

export const Eyebrow = forwardRef<HTMLParagraphElement, EyebrowProps>(
  ({ children, className }, ref) => {
    return (
      <p ref={ref} className={cn("eyebrow", className)}>
        {children}
      </p>
    );
  },
);
Eyebrow.displayName = "Eyebrow";
