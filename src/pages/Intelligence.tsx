import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ARTICLES, CATEGORIES, getArticlesByCategory } from "@/lib/intelligence";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";

const Intelligence = () => {
  const url = "https://deepgrain.ai/intelligence";

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Deepgrain Intelligence",
    description:
      "Essays on organisational consultancy, AI operating systems, and the craft of operating leadership.",
    url,
    hasPart: ARTICLES.map((a) => ({
      "@type": "Article",
      headline: a.frontmatter.title,
      url: `https://deepgrain.ai/intelligence/${a.frontmatter.slug}`,
      datePublished: a.frontmatter.publishedAt,
      author: { "@type": "Person", name: a.frontmatter.author },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Intelligence — Deepgrain</title>
        <meta
          name="description"
          content="Essays on organisational consultancy, AI operating systems, and the craft of operating leadership."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Intelligence — Deepgrain" />
        <meta
          property="og:description"
          content="Essays on organisational consultancy, AI operating systems, and the craft of operating leadership."
        />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-green text-cream pt-40 md:pt-48 pb-24 md:pb-32">
        <div className="container-grain max-w-4xl">
          <Eyebrow className="text-brass">Deepgrain Intelligence</Eyebrow>
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mt-6 mb-8"
            style={{ letterSpacing: "-0.015em" }}
          >
            Reading the grain, in writing.
          </h1>
          <p className="text-lg md:text-xl text-cream/75 leading-relaxed max-w-2xl">
            Essays on organisational consultancy, AI operating systems, and the
            quiet discipline of operating leadership. Slow reading for people
            building things that compound.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-linen py-24 md:py-32">
        <div className="container-grain space-y-24">
          {CATEGORIES.map((cat) => {
            const items = getArticlesByCategory(cat.slug);
            if (items.length === 0) return null;
            return (
              <div key={cat.slug}>
                <div className="flex flex-wrap items-end justify-between gap-4 mb-10 pb-6 border-b border-walnut/15">
                  <div>
                    <Eyebrow>{cat.name}</Eyebrow>
                    <p className="font-display text-2xl md:text-3xl text-walnut mt-2 max-w-xl">
                      {cat.description}
                    </p>
                  </div>
                  <Link
                    to={`/intelligence/category/${cat.slug}`}
                    className="text-[11px] uppercase text-green hover:text-brass transition-colors"
                    style={{ letterSpacing: "0.14em" }}
                  >
                    View all {items.length} →
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((a) => (
                    <ArticleCard key={a.frontmatter.slug} article={a} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Intelligence;
