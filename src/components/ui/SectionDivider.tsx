import { cn } from "@/lib/utils";

/**
 * Brass hairline divider for use between non-section blocks where the
 * global `section + section` rule in SiteShell does not apply.
 */
export const SectionDivider = ({ className }: { className?: string }) => (
  <hr className={cn("section-rule border-0", className)} aria-hidden="true" />
);
