import { Link } from "react-router-dom";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CLUSTERS_BY_SLUG, type ClusterSlug } from "@/lib/clusters";
import { getArticlesByCluster, type Article } from "@/lib/intelligence";

interface Props {
  /**
   * Source articles for the surrounding page (pillar section, category, or
   * single article). We tally their `primaryCluster` + `clusters` to decide
   * which clusters this page is most "about", then render related modules.
   */
  sourceArticles: Article[];
  /** Slugs to exclude from related results (typically the page's own articles). */
  excludeSlugs?: string[];
  /** How many clusters to render. Default 2. */
  maxClusters?: number;
  /** How many articles per cluster. Default 3. */
  perCluster?: number;
  /** Heading + section background. */
  variant?: "linen" | "cream";
  heading?: string;
  kicker?: string;
}

/**
 * Tally cluster occurrences (primary weighted higher) across the source set
 * to surface the dominant clusters for a page. Stable, deterministic order
 * keeps SEO output consistent between builds.
 */
const rankClusters = (articles: Article[]): ClusterSlug[] => {
  const score = new Map<ClusterSlug, number>();
  const firstSeen = new Map<ClusterSlug, number>();
  articles.forEach((a, i) => {
    const f = a.frontmatter;
    if (f.primaryCluster) {
      score.set(f.primaryCluster, (score.get(f.primaryCluster) ?? 0) + 3);
      if (!firstSeen.has(f.primaryCluster)) firstSeen.set(f.primaryCluster, i);
    }
    for (const c of f.clusters ?? []) {
      score.set(c, (score.get(c) ?? 0) + 1);
      if (!firstSeen.has(c)) firstSeen.set(c, i);
    }
  });
  return Array.from(score.entries())
    .sort(
      (a, b) =>
        b[1] - a[1] ||
        (firstSeen.get(a[0]) ?? 0) - (firstSeen.get(b[0]) ?? 0)
    )
    .map(([slug]) => slug);
};

/**
 * SEO-ready "Related articles" module driven by primaryCluster + clusters
 * metadata. Renders one mini-collection per dominant cluster with a link
 * to the full cluster index. Silently no-ops when there is nothing useful
 * to show, so it is safe to drop into any pillar/topic/article page.
 */
export const RelatedClusterArticles = ({
  sourceArticles,
  excludeSlugs = [],
  maxClusters = 2,
  perCluster = 3,
  variant = "linen",
  heading = "Related across the library",
  kicker = "Related articles",
}: Props) => {
  const exclude = new Set([
    ...excludeSlugs,
    ...sourceArticles.map((a) => a.frontmatter.slug),
  ]);

  const blocks = rankClusters(sourceArticles)
    .map((cluster) => {
      const cluster_meta = CLUSTERS_BY_SLUG[cluster];
      if (!cluster_meta) return null;
      const items = getArticlesByCluster(cluster)
        .filter((a) => !exclude.has(a.frontmatter.slug))
        .slice(0, perCluster);
      if (items.length === 0) return null;
      return { cluster: cluster_meta, items };
    })
    .filter((b): b is { cluster: typeof CLUSTERS_BY_SLUG[ClusterSlug]; items: Article[] } => Boolean(b))
    .slice(0, maxClusters);

  if (blocks.length === 0) return null;

  const bg = variant === "cream" ? "bg-cream/40 border-y border-walnut/10" : "bg-linen";

  return (
    <section className={`${bg} py-20 md:py-28`}>
      <div className="container-grain">
        <div className="max-w-3xl mb-12">
          <Eyebrow>{kicker}</Eyebrow>
          <h2
            className="font-display text-3xl md:text-5xl text-walnut mt-3"
            style={{ letterSpacing: "-0.015em" }}
          >
            {heading}
          </h2>
        </div>

        <div className="space-y-16">
          {blocks.map(({ cluster, items }) => (
            <div key={cluster.slug}>
              <div className="flex items-baseline justify-between gap-6 mb-6 pb-4 border-b border-walnut/15">
                <div>
                  <Eyebrow>{cluster.short}</Eyebrow>
                  <h3 className="font-display text-xl md:text-2xl text-walnut mt-2">
                    {cluster.name}
                  </h3>
                </div>
                <Link
                  to={`/intelligence/cluster/${cluster.slug}`}
                  className="text-sm text-green hover:text-brass transition-colors whitespace-nowrap"
                >
                  See all →
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {items.map((a) => (
                  <ArticleCard key={a.frontmatter.slug} article={a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
