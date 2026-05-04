import { Link } from "react-router-dom";
import { CLUSTERS_BY_SLUG, type ClusterSlug } from "@/lib/clusters";

interface ClusterChipsProps {
  primary?: ClusterSlug;
  secondary?: ClusterSlug[];
  className?: string;
}

/**
 * Renders the cluster taxonomy for an article as a row of small linked chips.
 * Primary cluster is visually emphasised. Used near the top of article pages
 * to surface the topic-cluster index page each piece belongs to, which is a
 * strong internal-link signal for both Google and answer engines.
 */
export const ClusterChips = ({ primary, secondary = [], className = "" }: ClusterChipsProps) => {
  const all = [
    primary && { slug: primary, isPrimary: true },
    ...secondary
      .filter((s) => s !== primary)
      .map((slug) => ({ slug, isPrimary: false })),
  ].filter(Boolean) as { slug: ClusterSlug; isPrimary: boolean }[];

  if (all.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Topic clusters">
      {all.map(({ slug, isPrimary }) => {
        const c = CLUSTERS_BY_SLUG[slug];
        if (!c) return null;
        return (
          <li key={slug}>
            <Link
              to={`/intelligence/cluster/${c.slug}`}
              className={
                isPrimary
                  ? "inline-flex items-center rounded-full border border-brass/60 bg-brass/15 px-3 py-1 text-xs uppercase tracking-[0.12em] text-brass hover:bg-brass/25 transition-colors"
                  : "inline-flex items-center rounded-full border border-walnut/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-walnut/70 hover:border-brass hover:text-brass transition-colors"
              }
            >
              {c.short}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
