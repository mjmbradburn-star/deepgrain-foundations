import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export const Eyebrow = ({ children, className }: EyebrowProps) => (
  <p className={cn("eyebrow", className)}>{children}</p>
);
