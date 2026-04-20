import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BrassRuleProps {
  className?: string;
  width?: string;
}

export const BrassRule = forwardRef<HTMLDivElement, BrassRuleProps>(
  ({ className, width = "60px" }, ref) => (
    <div
      ref={ref}
      className={cn("h-px bg-brass", className)}
      style={{ width }}
      aria-hidden="true"
    />
  ),
);
BrassRule.displayName = "BrassRule";
