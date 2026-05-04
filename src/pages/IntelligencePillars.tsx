import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { PILLARS } from "@/data/pillars";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

const IntelligencePillars = () => {
  const url = "https://deepgrain.ai/intelligence/pillars";

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: "https://deepgrain.ai/" },
    { name: "Intelligence", url: "https://deepgrain.ai/intelligence" },
    { name: "Pillars", url },
  ]);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Deepgrain Intelligence Pillars",
    description:
      "Pillar deep-dives that group the Deepgrain library into clear topic clusters.",
    url,
    hasPart: PILLARS.map((p) => ({
      "@type": "WebPage",
      name: p.title,
      url: `https://deepgrain.ai/intelligence/pillar/${p.slug}`,
      description: p.description,
    })),
  };

  return (
    <>
      <Helmet>
        <title>Pillar Deep-Dives | Deepgrain Intelligence</title>
        <meta
          name="description"
          content="Pillar deep-dives that group the Deepgrain library into clear topic clusters: AI operating systems, AI workspace for People Ops, operating leadership, and sector lenses."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Pillar Deep-Dives | Deepgrain Intelligence" />
        <meta property="og:description" content="Topic-cluster deep-dives across the Deepgrain library." />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
      </Helmet>

      <section className="bg-green text-cream pt-40 md:pt-48 pb-20 md:pb-28">
        <div className="container-grain max-w-4xl">
          <Link
            to="/intelligence"
            className="text-[11px] uppercase text-brass hover:text-cream transition-colors"
            style={{ letterSpacing: "0.16em" }}
          >
            ← All intelligence
          </Link>
          <Eyebrow className="text-brass mt-8">Pillar Deep-Dives</Eyebrow>
          <h1
            className="font-display text-5xl md:text-7xl leading-[0.98] mt-4 mb-8"
            style={{ letterSpacing: "-0.015em" }}
          >
            The library, organised by what it teaches.
          </h1>
          <p className="text-lg md:text-xl text-cream/75 leading-relaxed max-w-2xl">
            Four pillar pages, each a deep-dive hub that pulls every related
            essay into a single, navigable cluster. Start with the head term,
            follow the spokes.
          </p>
        </div>
      </section>

      <section className="bg-linen py-24 md:py-32">
        <div className="container-grain space-y-10">
          {PILLARS.map((p, i) => (
            <Link
              key={p.slug}
              to={`/intelligence/pillar/${p.slug}`}
              className="group block rounded-2xl border border-walnut/15 bg-cream/70 hover:bg-cream hover:border-brass/50 px-6 md:px-10 py-8 md:py-10 transition-colors"
            >
              <div className="flex items-baseline gap-6 mb-4">
                <span
                  className="font-display text-brass text-sm tabular-nums"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Eyebrow>Pillar</Eyebrow>
              </div>
              <h2
                className="font-display text-3xl md:text-5xl text-walnut leading-[1.05] group-hover:text-green transition-colors"
                style={{ letterSpacing: "-0.01em" }}
              >
                {p.title}
              </h2>
              <p className="text-walnut/70 mt-4 max-w-3xl text-base md:text-lg leading-relaxed">
                {p.lede}
              </p>
              <div
                className="text-[11px] uppercase text-green mt-6 group-hover:text-brass transition-colors"
                style={{ letterSpacing: "0.16em" }}
              >
                Enter the pillar →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default IntelligencePillars;
