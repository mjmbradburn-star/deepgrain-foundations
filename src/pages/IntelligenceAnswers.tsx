import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ANSWERS } from "@/data/answers";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

const SITE = "https://deepgrain.ai";
const URL = `${SITE}/intelligence/answers`;

/**
 * Answer Engine Optimisation hub. Each Q/A becomes a Question node inside a
 * QAPage JSON-LD block, and the page itself emits FAQPage as a secondary
 * signal. The combination is what Perplexity, Claude and Google's AI Overviews
 * tend to grab when they need a one-paragraph reply.
 */
const IntelligenceAnswers = () => {
  const qaPageLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: ANSWERS.map((a) => ({
      "@type": "Question",
      "@id": `${URL}#${a.slug}`,
      name: a.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: a.answer,
        url: a.link?.startsWith("http") ? a.link : a.link ? `${SITE}${a.link}` : URL,
        author: { "@type": "Organization", name: "Deepgrain" },
      },
    })),
  };

  // Mirror the same Q/A as a FAQPage. Belt-and-braces; both schemas are
  // legitimately applicable to a hub page like this and Google has ingested
  // both for years. We're not stuffing — every answer is unique, sourced.
  const faqPageLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ANSWERS.map((a) => ({
      "@type": "Question",
      name: a.question,
      acceptedAnswer: { "@type": "Answer", text: a.answer },
    })),
  };

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: `${SITE}/` },
    { name: "Intelligence", url: `${SITE}/intelligence` },
    { name: "Answers", url: URL },
  ]);

  return (
    <>
      <Helmet>
        <title>Answers: AI operating system, AI OS, AI workspace | Deepgrain</title>
        <meta
          name="description"
          content="Direct answers to the questions people actually search: what is an AI operating system, how is an AI OS different from an operating model, why AI pilots stall, and more. Sourced from Deepgrain Intelligence."
        />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Deepgrain Intelligence: Answers" />
        <meta property="og:description" content="Direct answers to the questions people actually search about AI operating systems, AI workspaces, and AI readiness." />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://deepgrain.ai/og-intelligence.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(qaPageLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqPageLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <section className="bg-green text-cream pt-40 md:pt-48 pb-16 md:pb-20">
        <div className="container-grain max-w-3xl">
          <Eyebrow className="text-brass">Intelligence · Answers</Eyebrow>
          <h1
            className="font-display text-5xl md:text-7xl leading-[0.95] mt-6 mb-6"
            style={{ letterSpacing: "-0.015em" }}
          >
            Direct answers, no preamble.
          </h1>
          <p className="text-lg md:text-xl text-cream/75 leading-relaxed">
            The questions people actually type into search bars and AI
            assistants, answered in a paragraph each. If you want the long
            read, follow the link under each answer.
          </p>
        </div>
      </section>

      <section className="bg-linen py-20 md:py-28">
        <div className="container-grain max-w-3xl">
          <ol className="space-y-14 list-none">
            {ANSWERS.map((a) => (
              <li key={a.slug} id={a.slug} className="scroll-mt-32">
                <h2
                  className="font-display text-2xl md:text-3xl text-walnut leading-snug mb-4"
                  style={{ letterSpacing: "-0.005em" }}
                >
                  {a.question}
                </h2>
                <p className="font-sans text-[18px] leading-[1.7] text-walnut/85 mb-3">
                  {a.answer}
                </p>
                {a.link && (
                  <Link
                    to={a.link}
                    className="text-[12px] uppercase text-green hover:text-brass transition-colors"
                    style={{ letterSpacing: "0.14em" }}
                  >
                    {a.linkLabel ?? "Read the article"} →
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
};

export default IntelligenceAnswers;
