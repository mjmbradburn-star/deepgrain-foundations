import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { GLOSSARY } from "@/data/glossary";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

const SITE = "https://deepgrain.ai";
const URL = `${SITE}/intelligence/glossary`;

const IntelligenceGlossary = () => {
  // Each entry becomes a DefinedTerm; the page wraps them in a DefinedTermSet
  // so search engines and LLMs can ingest the lot as a single dictionary.
  const definedTermSetLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Deepgrain Intelligence Glossary",
    description:
      "Working definitions of the operating, AI, and method terms used across Deepgrain Intelligence.",
    url: URL,
    hasDefinedTerm: GLOSSARY.map((g) => ({
      "@type": "DefinedTerm",
      "@id": `${URL}#${g.slug}`,
      name: g.term,
      alternateName: g.aliases,
      description: g.definition,
      inDefinedTermSet: URL,
      url: g.link?.startsWith("http") ? g.link : g.link ? `${SITE}${g.link}` : URL,
    })),
  };

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: `${SITE}/` },
    { name: "Intelligence", url: `${SITE}/intelligence` },
    { name: "Glossary", url: URL },
  ]);

  return (
    <>
      <Helmet>
        <title>Glossary: AI operating system, operating intervention, the grain | Deepgrain</title>
        <meta
          name="description"
          content="Working definitions of the operating, AI, and method terms used across Deepgrain Intelligence: AI operating system, operating intervention, Read · Craft · Scale, the grain, and more."
        />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Deepgrain Intelligence Glossary" />
        <meta property="og:description" content="Working definitions of the operating, AI, and method terms used across Deepgrain Intelligence." />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://deepgrain.ai/og-intelligence.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(definedTermSetLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <section className="bg-green text-cream pt-40 md:pt-48 pb-16 md:pb-20">
        <div className="container-grain max-w-3xl">
          <Eyebrow className="text-brass">Intelligence · Glossary</Eyebrow>
          <h1
            className="font-display text-5xl md:text-7xl leading-[0.95] mt-6 mb-6"
            style={{ letterSpacing: "-0.015em" }}
          >
            Working definitions.
          </h1>
          <p className="text-lg md:text-xl text-cream/75 leading-relaxed">
            Short, quotable definitions of the operating, AI, and method terms
            we keep using. Linked to the pillar where each one is explored in
            depth. Built so search engines and LLMs can ingest the lot in one
            pass.
          </p>
        </div>
      </section>

      {/* Term index */}
      <section className="bg-cream/40 border-b border-walnut/10 py-10">
        <div className="container-grain">
          <nav aria-label="Glossary index" className="flex flex-wrap gap-x-4 gap-y-2">
            {GLOSSARY.map((g) => (
              <a
                key={g.slug}
                href={`#${g.slug}`}
                className="text-sm text-walnut/70 hover:text-green underline decoration-brass/40 underline-offset-4"
              >
                {g.term}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Entries */}
      <section className="bg-linen py-20 md:py-28">
        <div className="container-grain max-w-3xl">
          <dl className="space-y-12">
            {GLOSSARY.map((g) => (
              <div key={g.slug} id={g.slug} className="scroll-mt-32">
                <dt className="flex flex-wrap items-baseline gap-3 mb-3">
                  <h2
                    className="font-display text-2xl md:text-3xl text-walnut leading-tight"
                    style={{ letterSpacing: "-0.005em" }}
                  >
                    {g.term}
                  </h2>
                  {g.aliases && g.aliases.length > 0 && (
                    <span className="text-sm text-walnut/50">
                      also: {g.aliases.join(", ")}
                    </span>
                  )}
                </dt>
                <dd className="font-sans text-[18px] leading-[1.7] text-walnut/85">
                  {g.definition}
                  {g.link && (
                    <>
                      {" "}
                      {g.link.startsWith("http") ? (
                        <a
                          href={g.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green underline decoration-brass underline-offset-4 hover:text-brass"
                        >
                          Read more →
                        </a>
                      ) : (
                        <Link
                          to={g.link}
                          className="text-green underline decoration-brass underline-offset-4 hover:text-brass"
                        >
                          Read more →
                        </Link>
                      )}
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
};

export default IntelligenceGlossary;
