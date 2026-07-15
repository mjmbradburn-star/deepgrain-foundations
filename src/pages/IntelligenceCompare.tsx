import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { COMPARES } from "@/data/compares";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

const SITE = "https://deepgrain.ai";

/**
 * Shared template for /intelligence/<x>-vs-<y> pages.
 *
 * These pages target zero-competition long-tail comparisons that sit one
 * search step downstream of the AI OS pillar. Each is short on purpose , 
 * a comparison table, a tight summary, an FAQ, and a "read deeper" rail
 * back into the article cluster. The point is to rank, not to lecture.
 */
const IntelligenceCompare = ({ slug }: { slug: string }) => {
  const entry = COMPARES.find((c) => c.slug === slug);
  if (!entry) return <Navigate to="/intelligence" replace />;

  const url = `${SITE}/intelligence/${entry.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    author: { "@type": "Person", name: "Matthew Bradburn", url: `${SITE}/about` },
    publisher: { "@type": "Organization", name: "Deepgrain", url: SITE },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: `${SITE}/` },
    { name: "Intelligence", url: `${SITE}/intelligence` },
    { name: entry.left + " vs " + entry.right, url },
  ]);

  const faqLd = entry.faqs && entry.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entry.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <Helmet>
        <title>{entry.title} | Deepgrain Intelligence</title>
        <meta name="description" content={entry.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={entry.title} />
        <meta property="og:description" content={entry.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://deepgrain.ai/og-intelligence.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        {faqLd && <script type="application/ld+json">{JSON.stringify(faqLd)}</script>}
      </Helmet>

      <header className="bg-green text-cream pt-40 md:pt-48 pb-16 md:pb-20">
        <div className="container-grain max-w-3xl">
          <Eyebrow className="text-brass">Intelligence · Compare</Eyebrow>
          <h1
            className="font-display text-4xl md:text-6xl leading-[1.0] mt-6 mb-6"
            style={{ letterSpacing: "-0.015em" }}
          >
            {entry.left} <span className="text-brass">vs</span> {entry.right}
          </h1>
          <p className="text-lg md:text-xl text-cream/75 leading-relaxed">
            {entry.description}
          </p>
        </div>
      </header>

      <article className="bg-linen py-16 md:py-24">
        <div className="container-grain max-w-3xl">
          <p className="font-sans text-[18px] leading-[1.7] text-walnut/85 mb-10">
            {entry.intro}
          </p>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-md border border-walnut/15 bg-cream/40">
            <table className="w-full text-left text-[15px]">
              <thead className="bg-walnut/5">
                <tr>
                  <th className="px-4 py-3 font-display text-walnut/70 uppercase text-[11px] tracking-widest">Axis</th>
                  <th className="px-4 py-3 font-display text-walnut">{entry.left}</th>
                  <th className="px-4 py-3 font-display text-walnut">{entry.right}</th>
                </tr>
              </thead>
              <tbody>
                {entry.rows.map((r) => (
                  <tr key={r.axis} className="border-t border-walnut/10">
                    <th scope="row" className="px-4 py-3 font-medium text-walnut/80 align-top w-[28%]">{r.axis}</th>
                    <td className="px-4 py-3 text-walnut/85 align-top">{r.left}</td>
                    <td className="px-4 py-3 text-walnut/85 align-top">{r.right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2
            id="in-one-paragraph"
            className="font-display text-2xl md:text-3xl text-walnut leading-snug mt-14 mb-4 scroll-mt-32"
            style={{ letterSpacing: "-0.005em" }}
          >
            In one paragraph
          </h2>
          <p className="font-sans text-[18px] leading-[1.7] text-walnut/85">{entry.summary}</p>

          {entry.faqs && entry.faqs.length > 0 && (
            <>
              <h2
                id="common-questions"
                className="font-display text-2xl md:text-3xl text-walnut leading-snug mt-14 mb-6 scroll-mt-32"
                style={{ letterSpacing: "-0.005em" }}
              >
                Common questions
              </h2>
              <dl className="space-y-8">
                {entry.faqs.map((f) => (
                  <div key={f.question}>
                    <dt className="font-display text-lg md:text-xl text-walnut mb-2">{f.question}</dt>
                    <dd className="font-sans text-[17px] leading-[1.65] text-walnut/85">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <h2
            className="font-display text-2xl md:text-3xl text-walnut leading-snug mt-14 mb-6"
            style={{ letterSpacing: "-0.005em" }}
          >
            Read deeper
          </h2>
          <ul className="space-y-3 list-none">
            {entry.related.map((r) => (
              <li key={r.href}>
                <Link
                  to={r.href}
                  className="text-green underline decoration-brass underline-offset-4 hover:text-brass"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
};

export default IntelligenceCompare;
