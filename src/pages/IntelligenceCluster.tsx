import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { CLUSTERS, getCluster } from "@/lib/clusters";
import { getArticlesByCluster } from "@/lib/intelligence";
import { getPillar } from "@/data/pillars";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { IntelligenceCTA } from "@/components/intelligence/IntelligenceCTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

/**
 * Topic-cluster index page.
 * Route: /intelligence/cluster/:slug
 *
 * Each cluster is a curated topical home that groups articles across
 * categories. The page emits CollectionPage + ItemList JSON-LD so search
 * engines and answer engines can ingest it as a resource hub.
 */
const IntelligenceCluster = () => {
  const { slug = "" } = useParams();
  const cluster = getCluster(slug);
  if (!cluster) return <Navigate to="/intelligence" replace />;

  const articles = getArticlesByCluster(slug);
  const url = `https://www.deepgrain.ai/intelligence/cluster/${cluster.slug}`;

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: "https://www.deepgrain.ai/" },
    { name: "Intelligence", url: "https://www.deepgrain.ai/intelligence" },
    { name: cluster.name, url },
  ]);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cluster.name,
    description: cluster.description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Deepgrain",
      url: "https://www.deepgrain.ai",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://www.deepgrain.ai/intelligence/${a.frontmatter.slug}`,
        name: a.frontmatter.title,
      })),
    },
  };

  const adjacent = CLUSTERS.filter((c) => c.slug !== cluster.slug).slice(0, 6);
  const parentPillar = getPillar(cluster.parentPillar);

  return (
    <>
      <Helmet>
        <title>{cluster.name} | Deepgrain Intelligence</title>
        <meta name="description" content={cluster.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${cluster.name} | Deepgrain`} />
        <meta property="og:description" content={cluster.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="bg-green text-cream pt-40 md:pt-48 pb-20 md:pb-28">
        <div className="container-grain max-w-4xl">
          <Link
            to="/intelligence"
            className="text-[11px] uppercase text-brass hover:text-cream transition-colors"
            style={{ letterSpacing: "0.16em" }}
          >
            ← All Intelligence
          </Link>
          <Eyebrow className="text-brass mt-8">Topic Cluster</Eyebrow>
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.0] mt-4 mb-8"
            style={{ letterSpacing: "-0.015em" }}
          >
            {cluster.name}
          </h1>
          <p className="text-lg md:text-2xl text-cream/80 leading-relaxed max-w-3xl">
            {cluster.description}
          </p>
          <p className="mt-6 text-sm text-cream/60">
            {articles.length} {articles.length === 1 ? "article" : "articles"} in this cluster.
          </p>
          {parentPillar && (
            <p className="mt-2 text-sm text-cream/60">
              Part of the fuller{" "}
              <Link
                to={`/intelligence/pillar/${parentPillar.slug}`}
                className="underline hover:text-cream"
              >
                {parentPillar.title}
              </Link>{" "}
              pillar →
            </p>
          )}
        </div>
      </section>

      <section className="bg-linen py-20 md:py-28">
        <div className="container-grain">
          {articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {articles.map((a) => (
                <ArticleCard key={a.frontmatter.slug} article={a} />
              ))}
            </div>
          ) : (
            <p className="text-walnut/70 text-lg">
              No articles tagged in this cluster yet. Check back soon.
            </p>
          )}
        </div>
      </section>

      <section className="bg-cream/40 border-t border-walnut/10 py-16 md:py-20">
        <div className="container-grain max-w-4xl">
          <Eyebrow>Adjacent clusters</Eyebrow>
          <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {adjacent.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/intelligence/cluster/${c.slug}`}
                  className="block rounded-lg border border-walnut/15 bg-cream px-4 py-3 text-walnut hover:border-brass hover:text-brass transition-colors"
                >
                  <span className="font-display text-lg">{c.name}</span>
                  <span className="block text-xs text-walnut/60 mt-1">{c.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <IntelligenceCTA />
    </>
  );
};

export default IntelligenceCluster;
