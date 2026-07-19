import { Fragment } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ARTICLES,
  CATEGORIES,
  getArticlesByCategory,
} from "@/lib/intelligence";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { IntelligenceCTA } from "@/components/intelligence/IntelligenceCTA";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { AssessmentLadder } from "@/components/sections/AssessmentLadder";
import { cn } from "@/lib/utils";

const TRACK_LABEL: Record<string, string> = {
  deepgrain: "Deepgrain",
  "people-ops": "People Ops",
};

const Intelligence = () => {
  const url = "https://www.deepgrain.ai/intelligence";
  const populatedCategories = CATEGORIES.map((cat) => ({
    cat,
    items: getArticlesByCategory(cat.slug),
  })).filter(({ items }) => items.length > 0);

  // Group by track and restart the ordinal numbering per track, so the
  // Contents nav and the section loop below both read as two runs (01-05,
  // then 01-04) instead of one confusing 01-09 sequence spanning two tracks.
  const trackOrder = ["deepgrain", "people-ops"] as const;
  const trackGroups = trackOrder
    .map((t) => ({
      track: t,
      label: TRACK_LABEL[t],
      items: populatedCategories.filter(({ cat }) => cat.track === t),
    }))
    .filter((g) => g.items.length > 0);

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
          <p
            id="contents-heading"
            className="font-sans uppercase text-walnut text-[11px] tracking-[0.14em] font-semibold"
          >
            Contents
          </p>
          <nav aria-label="Intelligence contents" className="mt-6 space-y-8">
            {trackGroups.map((group) => (
              <div key={group.track}>
                <p
                  className="text-[11px] uppercase text-walnut/40 mb-3"
                  style={{ letterSpacing: "0.14em" }}
                >
                  {group.label}
                </p>
                <ol className="flex flex-wrap gap-x-10 gap-y-4 list-none">
                  {group.items.map(({ cat, items }, i) => (
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
              </div>
            ))}
          </nav>
        </div>
      </section>

      {/* Categories: grouped by track, each track restarting its own 01-0N
          ordinal, with a lighter assessment surface between the two tracks
          (immediately after the 5th, Deepgrain-track category) for readers
          who would rather have a number than another essay. */}
      {trackGroups.map((group, gi) => (
        <Fragment key={group.track}>
          <section
            className={cn(
              "bg-linen",
              gi === 0 ? "pt-24 md:pt-32 pb-0" : "pt-0 pb-24 md:pb-32",
            )}
          >
            <div className="container-grain">
              <p
                className="text-[11px] uppercase text-walnut/40 mb-10"
                style={{ letterSpacing: "0.16em" }}
              >
                {group.label}
              </p>
              <div className="space-y-24">
                {group.items.map(({ cat, items }) => (
                  <div key={cat.slug} id={cat.slug} className="scroll-mt-32">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-4 pb-6 border-b border-walnut/15">
                      <div>
                        <h2 className="font-display text-2xl md:text-3xl text-walnut max-w-xl">
                          {cat.name}
                        </h2>
                        <p className="text-walnut/70 text-base md:text-lg leading-relaxed mt-2 max-w-xl">
                          {cat.description}
                        </p>
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
            </div>
          </section>

          {/* Sits between the two tracks: after the Deepgrain track's last
              category, before People Ops begins. */}
          {gi === 0 && trackGroups.length > 1 && (
            <AssessmentLadder
              variant="band"
              tone="linen"
              tools={["readiness"]}
              heading="Prefer a number to a shelf of essays?"
              ctaLocation="intel_midpage"
            />
          )}
        </Fragment>
      ))}

      {/* Close: the paid bridge offer, not a soft "book a call". Readers who
          have made it this far through the essays are warm; point them at the
          Grain Audit, not a generic contact form. */}
      <IntelligenceCTA />
    </>
  );
};

export default Intelligence;
