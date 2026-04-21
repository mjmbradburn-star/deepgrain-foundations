declare module "virtual:intelligence-manifest" {
  import type { ComponentType } from "react";
  import type { ArticleFrontmatter } from "@/lib/intelligence";
  import type { FAQItem } from "@/components/sections/FAQ";

  export const FRONTMATTERS: (ArticleFrontmatter & { __path: string })[];
  export const LOADERS: Record<string, () => Promise<{ default: ComponentType }>>;
  /** Article FAQs keyed by absolute MDX path. Only present when an article
   *  exports `const faqs = [...]`. Used to emit FAQPage JSON-LD + render the
   *  on-page Common questions block. */
  export const FAQS: Record<string, FAQItem[]>;
}
