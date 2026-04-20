import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export const Eyebrow = forwardRef<HTMLParagraphElement, EyebrowProps>(
  ({ children, className }, ref) => (
    <p ref={ref} className={cn("eyebrow", className)}>
      {children}
    </p>
  ),
);
Eyebrow.displayName = "Eyebrow";
