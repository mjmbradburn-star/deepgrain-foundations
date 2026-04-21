import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  getArticlesByTrack,
  getCategoriesByTrack,
  getArticlesByCategory,
} from "@/lib/intelligence";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { AIOI_URL } from "@/lib/aioi";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

const PeopleOps = () => {
  const url = "https://deepgrain.ai/intelligence/people-ops";
  const articles = getArticlesByTrack("people-ops");
  const categories = getCategoriesByTrack("people-ops");

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "The People Ops AI Brain | Deepgrain Intelligence",
    description:
      "From prompts to systems: building AI-powered People Operations. Frameworks, governance, and the craft of working with AI inside People teams.",
    url,
    hasPart: articles.map((a) => ({
      "@type": "Article",
      headline: a.frontmatter.title,
      url: `https://deepgrain.ai/intelligence/${a.frontmatter.slug}`,
      datePublished: a.frontmatter.publishedAt,
      author: { "@type": "Person", name: a.frontmatter.author },
    })),
  };

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: "https://deepgrain.ai/" },
    { name: "Intelligence", url: "https://deepgrain.ai/intelligence" },
    { name: "People Ops AI Brain", url },
  ]);

  return (
    <>
      <Helmet>
        <title>People Ops AI Brain | Deepgrain Intelligence</title>
        <meta
          name="description"
          content="From prompts to systems: building AI-powered People Operations. A track for People leaders moving from individual experiments to operating leverage."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="People Ops AI Brain | Deepgrain Intelligence" />
        <meta
          property="og:description"
          content="From prompts to systems: building AI-powered People Operations."
        />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://deepgrain.ai/og-people-ops.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://deepgrain.ai/og-people-ops.png" />
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-walnut text-cream pt-40 md:pt-48 pb-24 md:pb-32 relative overflow-hidden">
        <div className="container-grain max-w-4xl relative">
          <Link
            to="/intelligence"
            className="text-[11px] uppercase text-brass hover:text-cream transition-colors"
            style={{ letterSpacing: "0.16em" }}
          >
            ← All Intelligence
          </Link>
          <Eyebrow className="text-brass mt-8">A Deepgrain Track</Eyebrow>
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mt-6 mb-8"
            style={{ letterSpacing: "-0.015em" }}
          >
            The People Ops<br />AI Brain.
          </h1>
          <p className="text-lg md:text-xl text-cream/80 leading-relaxed max-w-2xl mb-10">
            From prompts to systems. A track for Heads of People, CPOs, HRBPs and TA leaders
            building real operating leverage with AI — not novelty, not pilots, infrastructure.
          </p>
          <div className="border-l-2 border-brass pl-6 max-w-2xl">
            <p className="text-cream/70 leading-relaxed italic font-display text-xl">
              Most People teams are stuck between dabbling and tool-shopping. Neither
              produces capability. This track is about the third path: building.
            </p>
          </div>
        </div>
      </section>

      {/* Two traps */}
      <section className="bg-linen text-body py-24 md:py-32">
        <div className="container-grain max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-cream/60 rounded-2xl p-10 border border-walnut/10">
              <Eyebrow className="text-green/70 mb-4">Trap 1</Eyebrow>
              <h3 className="font-display text-2xl md:text-3xl text-walnut mb-4">
                The Dabbler
              </h3>
              <p className="text-walnut/75 leading-relaxed">
                Tried ChatGPT once, got a generic output, gave up. Treats AI like Google —
                a question today, no memory tomorrow. Individual tricks, no team capability.
              </p>
            </div>
            <div className="bg-cream/60 rounded-2xl p-10 border border-walnut/10">
              <Eyebrow className="text-green/70 mb-4">Trap 2</Eyebrow>
              <h3 className="font-display text-2xl md:text-3xl text-walnut mb-4">
                The Tool Shopper
              </h3>
              <p className="text-walnut/75 leading-relaxed">
                Spends months evaluating tools, running pilots, writing strategies nobody
                reads. The market moves on. Nothing gets built. AI as novelty, not infrastructure.
              </p>
            </div>
          </div>
          <p className="font-display text-3xl md:text-4xl text-walnut text-center max-w-3xl mx-auto mt-16 leading-tight text-balance">
            This track is the third path. The one where People teams become builders.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-linen pb-24 md:pb-32">
        <div className="container-grain space-y-24">
          {categories.map((cat) => {
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

      {/* AIOI CTA */}
      <section className="bg-green text-cream py-20 md:py-28">
        <div className="container-grain max-w-3xl text-center">
          <Eyebrow className="text-brass">Diagnostic</Eyebrow>
          <h2
            className="font-display text-3xl md:text-5xl mt-4 mb-6 leading-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            Where does your People function stand on AI?
          </h2>
          <p className="text-cream/75 max-w-xl mx-auto mb-10 leading-relaxed">
            The AI Operating Index — a free 8-pillar diagnostic that shows you where
            your operating system holds and where it gives.
          </p>
          <PillButton href={AIOI_URL} variant="filled" external>
            Begin the index →
          </PillButton>
        </div>
      </section>
    </>
  );
};

export default PeopleOps;
