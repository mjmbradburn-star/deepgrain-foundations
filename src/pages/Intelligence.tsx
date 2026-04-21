import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ARTICLES,
  getArticlesByCategory,
  getCategoriesByTrack,
} from "@/lib/intelligence";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

const Intelligence = () => {
  const url = "https://deepgrain.ai/intelligence";
  const deepgrainCategories = getCategoriesByTrack("deepgrain");

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

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: "https://deepgrain.ai/" },
    { name: "Intelligence", url },
  ]);

  return (
    <>
      <Helmet>
        <title>Intelligence | Deepgrain</title>
        <meta
          name="description"
          content="Essays on organisational consultancy, AI operating systems, and the craft of operating leadership."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Intelligence | Deepgrain" />
        <meta
          property="og:description"
          content="Field notes from running real organisations. Essays, case detail, and operating intelligence from Deepgrain."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://deepgrain.ai/og-intelligence.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://deepgrain.ai/og-intelligence.png" />
        <meta property="og:url" content={url} />
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
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

      {/* People Ops track signpost */}
      <section className="bg-walnut text-cream py-16 md:py-20 border-b border-brass/15">
        <div className="container-grain">
          <Link
            to="/intelligence/people-ops"
            className="group block max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-[auto,1fr,auto] gap-6 md:gap-10 items-center">
              <Eyebrow className="text-brass">A Track</Eyebrow>
              <div>
                <h2
                  className="font-display text-3xl md:text-4xl lg:text-5xl text-cream group-hover:text-brass transition-colors leading-tight"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  The People Ops AI Brain
                </h2>
                <p className="text-cream/70 mt-3 max-w-2xl leading-relaxed">
                  A dedicated track for People leaders building AI capability —
                  from prompts to systems, with governance that holds.
                </p>
              </div>
              <span
                className="text-[11px] uppercase text-brass group-hover:translate-x-1 transition-transform"
                style={{ letterSpacing: "0.16em" }}
              >
                Enter →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Section index — mirrors breadcrumb hierarchy with deep anchor links.
          Reinforces the BreadcrumbList JSON-LD with on-page navigation that
          search engines can follow as named-fragment URLs. */}
      <section
        id="sections"
        aria-labelledby="sections-heading"
        className="bg-cream/40 border-y border-walnut/10 py-16 md:py-20"
      >
        <div className="container-grain">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <Eyebrow>On this page</Eyebrow>
              <h2
                id="sections-heading"
                className="font-display text-2xl md:text-3xl text-walnut mt-2"
                style={{ letterSpacing: "-0.005em" }}
              >
                Sections of the Deepgrain track
              </h2>
            </div>
            <Link
              to="/intelligence/people-ops"
              className="text-[11px] uppercase text-green hover:text-brass transition-colors"
              style={{ letterSpacing: "0.14em" }}
            >
              Switch to People Ops track →
            </Link>
          </div>
          <nav aria-label="Intelligence sections">
            <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 list-none counter-reset-[section]">
              {deepgrainCategories.map((cat, i) => {
                const items = getArticlesByCategory(cat.slug);
                if (items.length === 0) return null;
                return (
                  <li key={cat.slug}>
                    <a
                      href={`#${cat.slug}`}
                      className="group flex items-baseline gap-4 rounded-lg border border-walnut/10 bg-cream/60 hover:bg-cream hover:border-brass/40 px-5 py-4 transition-colors"
                    >
                      <span
                        className="font-display text-brass text-sm tabular-nums shrink-0"
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span className="block font-display text-walnut text-base md:text-lg leading-tight group-hover:text-green transition-colors">
                          {cat.name}
                        </span>
                        <span className="block text-walnut/60 text-xs mt-1">
                          {items.length} {items.length === 1 ? "article" : "articles"}
                        </span>
                      </span>
                      <span
                        className="text-brass text-sm group-hover:translate-x-1 transition-transform"
                        aria-hidden
                      >
                        ↓
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </section>

      {/* Categories — Deepgrain track only */}
      <section className="bg-linen py-24 md:py-32">
        <div className="container-grain space-y-24">
          {deepgrainCategories.map((cat) => {
            const items = getArticlesByCategory(cat.slug);
            if (items.length === 0) return null;
            return (
              <div key={cat.slug} id={cat.slug} className="scroll-mt-32">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-10 pb-6 border-b border-walnut/15">
                  <div>
                    <Eyebrow>{cat.name}</Eyebrow>
                    <p className="font-display text-2xl md:text-3xl text-walnut mt-2 max-w-xl">
                      {cat.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <Link
                      to={`/intelligence/category/${cat.slug}`}
                      className="text-[11px] uppercase text-green hover:text-brass transition-colors"
                      style={{ letterSpacing: "0.14em" }}
                    >
                      View all {items.length} →
                    </Link>
                    <a
                      href="#sections"
                      className="text-[11px] uppercase text-walnut/50 hover:text-brass transition-colors"
                      style={{ letterSpacing: "0.14em" }}
                      aria-label="Back to section index"
                    >
                      ↑ Index
                    </a>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
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
