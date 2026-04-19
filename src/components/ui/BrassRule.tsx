import { cn } from "@/lib/utils";

interface BrassRuleProps {
  className?: string;
  width?: string;
}

export const BrassRule = ({ className, width = "60px" }: BrassRuleProps) => (
  <div
    className={cn("h-px bg-brass", className)}
    style={{ width }}
    aria-hidden="true"
  />
);
