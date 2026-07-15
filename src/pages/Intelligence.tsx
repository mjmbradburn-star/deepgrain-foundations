import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ARTICLES,
  CATEGORIES,
  getArticlesByCategory,
} from "@/lib/intelligence";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { track } from "@/lib/analytics";

const Intelligence = () => {
  const url = "https://www.deepgrain.ai/intelligence";
  const populatedCategories = CATEGORIES.map((cat) => ({
    cat,
    items: getArticlesByCategory(cat.slug),
  })).filter(({ items }) => items.length > 0);

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
      url: `https://www.deepgrain.ai/intelligence/${a.frontmatter.slug}`,
      datePublished: a.frontmatter.publishedAt,
      author: { "@type": "Person", name: a.frontmatter.author },
    })),
  };

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: "https://www.deepgrain.ai/" },
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
        <meta property="og:image" content="https://www.deepgrain.ai/og-intelligence.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.deepgrain.ai/og-intelligence.png" />
        <meta property="og:url" content={url} />
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      {/* Hero: deck shape */}
      <section className="relative bg-green text-cream pt-40 md:pt-48 pb-24 md:pb-32 overflow-hidden">
        <TopoBackdrop variant="basin" opacity={0.18} />
        <div className="relative container-grain max-w-4xl">
          <SectionEyebrow className="mb-6" />
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 max-w-3xl"
            style={{ letterSpacing: "-0.015em" }}
          >
            Reading the grain, in writing.
          </h1>
          <p className="text-lg md:text-xl text-cream/75 leading-relaxed max-w-2xl">
            Essays on organisational consultancy, AI operating systems, and operating leadership.
            Slow reading for people building things that compound.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-[12px] uppercase" style={{ letterSpacing: "0.14em" }}>
            <Link to="/intelligence/pillars" className="text-brass hover:text-cream transition-colors">Pillar deep-dives →</Link>
            <span className="text-cream/30">·</span>
            <Link to="/intelligence/glossary" className="text-brass hover:text-cream transition-colors">Glossary →</Link>
            <span className="text-cream/30">·</span>
            <Link to="/intelligence/answers" className="text-brass hover:text-cream transition-colors">Answers →</Link>
          </div>
        </div>
      </section>

      {/* Contents: the single overview. One index, not two, this is both the
          section list and the jump nav. The per-category detail below is the
          content itself, not a second copy of the index. */}
      <section
        id="contents"
        aria-labelledby="contents-heading"
        className="bg-cream/40 border-y border-walnut/10 py-14 md:py-16"
      >
        <div className="container-grain">
          <Eyebrow>Contents</Eyebrow>
          <nav aria-label="Intelligence contents" className="mt-6">
            <ol className="flex flex-wrap gap-x-10 gap-y-4 list-none">
              {populatedCategories.map(({ cat, items }, i) => (
                <li key={cat.slug}>
                  <a
                    href={`#${cat.slug}`}
                    className="group inline-flex items-baseline gap-2.5 font-display text-lg md:text-xl text-walnut transition-colors hover:text-brass"
                    style={{ letterSpacing: "-0.005em" }}
                  >
                    <span className="font-sans text-xs text-walnut/40 tabular-nums" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {cat.name}
                    <span className="font-sans text-sm text-walnut/40">
                      {items.length}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Categories: all tracks, one stream, one rule language throughout */}
      <section className="bg-linen py-24 md:py-32">
        <div className="container-grain space-y-24">
          {populatedCategories.map(({ cat, items }) => (
            <div key={cat.slug} id={cat.slug} className="scroll-mt-32">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-4 pb-6 border-b border-walnut/15">
                <div>
                  <Eyebrow>{cat.name}</Eyebrow>
                  <h2 className="font-display text-2xl md:text-3xl text-walnut mt-2 max-w-xl">
                    <span className="sr-only">{cat.name}: </span>
                    {cat.description}
                  </h2>
                </div>
                <Link
                  to={`/intelligence/category/${cat.slug}`}
                  className="text-[11px] uppercase text-green hover:text-brass transition-colors shrink-0"
                  style={{ letterSpacing: "0.14em" }}
                >
                  All {items.length} →
                </Link>
              </div>
              <div>
                {items.map((a) => (
                  <ArticleCard key={a.frontmatter.slug} article={a} variant="row" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Close: the paid bridge offer, not a soft "book a call". Readers who
          have made it this far through the essays are warm; point them at the
          Grain Audit, not a generic contact form. */}
      <section className="relative bg-green text-cream section-pad overflow-hidden">
        <TopoBackdrop variant="basin" opacity={0.16} />
        <div className="relative container-grain max-w-2xl">
          <Eyebrow withRule className="text-brass mb-6">
            The next move
          </Eyebrow>
          <h2 className="font-display text-3xl md:text-5xl leading-[1.08] max-w-xl">
            Reading is one thing. Doing is another.
          </h2>
          <p className="mt-6 max-w-xl text-cream/75 leading-relaxed">
            The Grain Audit maps one People Ops process end to end, ranks the highest-return
            automations, and hands you a 90-day plan you keep whether or not we work together.
            Two weeks. GBP 2,000, credited in full against a programme. Three slots a month.
          </p>
          <Link
            to="/grain-audit"
            onClick={() =>
              track("cta_click", {
                cta_id: "audit_intelligence_close",
                cta_location: "intelligence",
                cta_label: "Book a Grain Audit",
                link_url: "/grain-audit",
              })
            }
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 font-sans text-sm tracking-wider text-green transition-all duration-300 hover:bg-cream/90"
          >
            Book a Grain Audit
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
          </Link>
          <p className="mt-6 text-cream/50 text-sm">
            Not ready to commit? Take the{" "}
            <Link to="/readiness" className="underline hover:text-cream">
              readiness assessment
            </Link>{" "}
            first.
          </p>
        </div>
      </section>
    </>
  );
};

export default Intelligence;
