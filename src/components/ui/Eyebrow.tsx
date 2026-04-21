import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  /**
   * When true, renders a thin brass rule beside the eyebrow that animates
   * scaleX 0→1 when the closest scroll-revealed ancestor enters view.
   * Hooks into the existing `[data-reveal="in"]` selector — no extra JS.
   */
  withRule?: boolean;
}

export const Eyebrow = forwardRef<HTMLParagraphElement, EyebrowProps>(
  ({ children, className, withRule }, ref) => {
    if (withRule) {
      return (
        <p
          ref={ref}
          className={cn("eyebrow flex items-center gap-3", className)}
        >
          <span
            aria-hidden
            className="inline-block h-px w-10 bg-brass origin-left scale-x-0 transition-transform duration-[600ms] ease-out [[data-reveal='in']_&]:scale-x-100"
          />
          <span>{children}</span>
        </p>
      );
    }
    return (
      <p ref={ref} className={cn("eyebrow", className)}>
        {children}
      </p>
    );
  },
);
Eyebrow.displayName = "Eyebrow";
