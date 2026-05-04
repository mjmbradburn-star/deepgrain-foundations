import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { getPillar, PILLARS } from "@/data/pillars";
import { getArticleBySlug } from "@/lib/intelligence";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { RelatedClusterArticles } from "@/components/intelligence/RelatedClusterArticles";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PillarGlossaryStrip } from "@/components/intelligence/PillarGlossaryStrip";

const IntelligencePillar = () => {
  const { slug = "" } = useParams();
  const pillar = getPillar(slug);
  if (!pillar) return <Navigate to="/intelligence/pillars" replace />;

  const url = `https://deepgrain.ai/intelligence/pillar/${pillar.slug}`;

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: "https://deepgrain.ai/" },
    { name: "Intelligence", url: "https://deepgrain.ai/intelligence" },
    { name: "Pillars", url: "https://deepgrain.ai/intelligence/pillars" },
    { name: pillar.title, url },
  ]);

  // Resolve article slugs to live articles. Drop missing ones silently so a
  // typo in the pillar definition does not crash the page in production.
  const sections = pillar.sections.map((s) => ({
    ...s,
    items: s.articles.map(getArticleBySlug).filter(Boolean) as NonNullable<
      ReturnType<typeof getArticleBySlug>
    >[],
  }));

  // ItemList JSON-LD per section helps search engines parse the cluster.
  const itemListLds = sections.map((s) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: s.heading,
    itemListElement: s.items.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://deepgrain.ai/intelligence/${a.frontmatter.slug}`,
      name: a.frontmatter.title,
    })),
  }));

  return (
    <>
      <Helmet>
        <title>{pillar.title} | Deepgrain Intelligence</title>
        <meta name="description" content={pillar.description} />
        <meta name="keywords" content={pillar.keywords.join(", ")} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${pillar.title} | Deepgrain`} />
        <meta property="og:description" content={pillar.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        {itemListLds.map((ld, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(ld)}
          </script>
        ))}
      </Helmet>

      <section className="bg-green text-cream pt-40 md:pt-48 pb-20 md:pb-28">
        <div className="container-grain max-w-4xl">
          <Breadcrumbs
            variant="dark"
            className="mb-6"
            items={[
              { name: "Home", href: "/" },
              { name: "Intelligence", href: "/intelligence" },
              { name: "Pillars", href: "/intelligence/pillars" },
              { name: pillar.title },
            ]}
          />
          <Link
            to="/intelligence/pillars"
            className="text-[11px] uppercase text-brass hover:text-cream transition-colors"
            style={{ letterSpacing: "0.16em" }}
          >
            ← All pillars
          </Link>
          <Eyebrow className="text-brass mt-8">Pillar Deep-Dive</Eyebrow>
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.0] mt-4 mb-8"
            style={{ letterSpacing: "-0.015em" }}
          >
            {pillar.title}
          </h1>
          <p className="text-lg md:text-2xl text-cream/80 leading-relaxed max-w-3xl">
            {pillar.lede}
          </p>
        </div>
      </section>

      {/* Long-form intro */}
      <section className="bg-cream/40 border-y border-walnut/10 py-20 md:py-24">
        <div className="container-grain max-w-3xl space-y-6">
          {pillar.intro.map((p, i) => (
            <p
              key={i}
              className="text-walnut/85 text-lg md:text-xl leading-relaxed"
            >
              {p}
            </p>
          ))}
          <nav aria-label="On this pillar" className="pt-6 border-t border-walnut/15">
            <Eyebrow>In this pillar</Eyebrow>
            <ol className="mt-4 space-y-2">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#${s.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="text-green hover:text-brass transition-colors"
                  >
                    {String(i + 1).padStart(2, "0")} · {s.heading}
                    <span className="text-walnut/50 text-sm ml-2">
                      ({s.items.length} {s.items.length === 1 ? "article" : "articles"})
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Cluster sections */}
      <section className="bg-linen py-24 md:py-32">
        <div className="container-grain space-y-24">
          {sections.map((s) => {
            const id = s.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <div key={s.heading} id={id} className="scroll-mt-32">
                <div className="mb-10 pb-6 border-b border-walnut/15 max-w-3xl">
                  <Eyebrow>{s.heading}</Eyebrow>
                  <p className="font-display text-2xl md:text-3xl text-walnut mt-3">
                    {s.intro}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {s.items.map((a) => (
                    <ArticleCard key={a.frontmatter.slug} article={a} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brief glossary strip wired to the canonical glossary page */}
      <PillarGlossaryStrip pillarSlug={pillar.slug} />

      {/* SEO-ready related modules driven by primaryCluster + clusters */}
      <RelatedClusterArticles
        sourceArticles={sections.flatMap((s) => s.items)}
        excludeSlugs={sections.flatMap((s) => s.items.map((a) => a.frontmatter.slug))}
        heading="Related across the library"
        kicker="Related articles"
      />

      {/* Related pillars */}
      {pillar.related && pillar.related.length > 0 && (
        <section className="bg-green text-cream py-20 md:py-24">
          <div className="container-grain max-w-3xl">
            <Eyebrow className="text-brass">Adjacent pillars</Eyebrow>
            <h2
              className="font-display text-3xl md:text-4xl mt-3 mb-8"
              style={{ letterSpacing: "-0.01em" }}
            >
              Keep going.
            </h2>
            <ul className="space-y-3">
              {pillar.related.map((r) => {
                const target = PILLARS.find((p) => p.slug === r.slug);
                if (!target) return null;
                return (
                  <li key={r.slug}>
                    <Link
                      to={`/intelligence/pillar/${r.slug}`}
                      className="text-cream hover:text-brass transition-colors text-lg md:text-xl underline-offset-4 hover:underline"
                    >
                      {r.label} →
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
};

export default IntelligencePillar;
