declare module "virtual:intelligence-manifest" {
  import type { ComponentType } from "react";
  import type { ArticleFrontmatter } from "@/lib/intelligence";

  export const FRONTMATTERS: (ArticleFrontmatter & { __path: string })[];
  export const LOADERS: Record<string, () => Promise<{ default: ComponentType }>>;
}
