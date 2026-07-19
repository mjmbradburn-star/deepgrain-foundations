import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { ANSWERS, type AnswerEntry } from "@/data/answers";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AssessmentLadder } from "@/components/sections/AssessmentLadder";
import { getArticleBySlug } from "@/lib/intelligence";
import type { ClusterSlug } from "@/lib/clusters";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

/**
 * An answer's `link` usually points into an Intelligence article (optionally
 * with a `#fragment`). Resolve it to that article's cluster set so related
 * answers can be picked by real topic, not by list position.
 */
const clustersForAnswer = (link?: string): Set<ClusterSlug> => {
  if (!link || !link.startsWith("/intelligence/")) return new Set();
  const articleSlug = link.slice("/intelligence/".length).split("#")[0];
  const f = getArticleBySlug(articleSlug)?.frontmatter;
  return new Set<ClusterSlug>([
    ...(f?.primaryCluster ? [f.primaryCluster] : []),
    ...(f?.clusters ?? []),
  ]);
};

/**
 * Cluster-matched related answers, falling back to the previous
 * recency-stable modulo pick when there is no cluster signal (no link, or
 * the linked article carries no cluster tags), so the section is never empty.
 */
const getRelatedAnswers = (idx: number, entry: AnswerEntry, limit = 3): AnswerEntry[] => {
  const modulo = Array.from({ length: limit }, (_, n) => ANSWERS[(idx + n + 1) % ANSWERS.length]).filter(
    (a) => a.slug !== entry.slug,
  );

  const entryClusters = clustersForAnswer(entry.link);
  if (entryClusters.size === 0) return modulo;

  const scored = ANSWERS.map((a, i) => ({ a, i }))
    .filter(({ a }) => a.slug !== entry.slug)
    .map(({ a, i }) => {
      const otherClusters = clustersForAnswer(a.link);
      let score = 0;
      for (const c of otherClusters) if (entryClusters.has(c)) score++;
      return { a, i, score };
    })
    .sort((x, y) => y.score - x.score || x.i - y.i);

  const matched = scored.filter((s) => s.score > 0).map((s) => s.a);
  if (matched.length >= limit) return matched.slice(0, limit);

  const chosen = new Set(matched.map((a) => a.slug));
  const fillers = modulo.filter((a) => !chosen.has(a.slug));
  return [...matched, ...fillers].slice(0, limit);
};

/**
 * Per-question canonical URL. Route: /answers/:slug
 *
 * Answer engines (ChatGPT search, Perplexity, Gemini) cite question-shaped
 * pages disproportionately because the URL, the title, and the visible body
 * all align with how a query is phrased. Each page emits QAPage JSON-LD
 * (the schema.org type designed for single-question Q&A pages).
 */
const AnswerDetail = () => {
  const { slug = "" } = useParams();
  const idx = ANSWERS.findIndex((a) => a.slug === slug);
  if (idx === -1) return <Navigate to="/intelligence/answers" replace />;
  const entry = ANSWERS[idx];

  const url = `https://www.deepgrain.ai/answers/${entry.slug}`;
  const description = entry.answer.slice(0, 158);

  const related = getRelatedAnswers(idx, entry, 3);

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: "https://www.deepgrain.ai/" },
    { name: "Answers", url: "https://www.deepgrain.ai/intelligence/answers" },
    { name: entry.question, url },
  ]);

  const qaLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: entry.question,
      text: entry.question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
        url,
        author: {
          "@type": "Person",
          name: "Matthew Bradburn",
          url: "https://www.deepgrain.ai/about",
        },
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>{entry.question} | Deepgrain</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={entry.question} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(qaLd)}</script>
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article className="bg-cream pt-40 md:pt-48 pb-20 md:pb-28">
        <div className="container-grain max-w-3xl">
          <Link
            to="/intelligence/answers"
            className="text-[11px] uppercase text-brass hover:text-walnut transition-colors"
            style={{ letterSpacing: "0.16em" }}
          >
            ← All answers
          </Link>
          <Eyebrow className="mt-8">Answer</Eyebrow>
          <h1
            className="font-display text-3xl md:text-5xl text-walnut leading-tight mt-4 mb-8"
            style={{ letterSpacing: "-0.015em" }}
          >
            {entry.question}
          </h1>
          <p className="text-walnut/85 text-lg md:text-xl leading-relaxed">
            {entry.answer}
          </p>
          {entry.link && (
            <p className="mt-8">
              <Link
                to={entry.link}
                className="inline-flex items-center text-green hover:text-brass transition-colors text-base underline-offset-4 hover:underline"
              >
                {entry.linkLabel ?? "Read the full article"} →
              </Link>
            </p>
          )}
          <div className="mt-10 pt-8 border-t border-walnut/15">
            <AssessmentLadder
              variant="inline"
              tone="linen"
              tools={["readiness"]}
              ctaLocation="answer_footer"
            />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-linen border-t border-walnut/10 py-16 md:py-20">
          <div className="container-grain max-w-3xl">
            <Eyebrow>Related answers</Eyebrow>
            <ul className="mt-6 space-y-4">
              {related.map((a) => (
                <li key={a.slug}>
                  <Link
                    to={`/answers/${a.slug}`}
                    className="block group"
                  >
                    <h2 className="font-display text-xl text-walnut group-hover:text-brass transition-colors">
                      {a.question}
                    </h2>
                    <p className="text-sm text-walnut/65 mt-1 line-clamp-2">{a.answer}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
};

export default AnswerDetail;
