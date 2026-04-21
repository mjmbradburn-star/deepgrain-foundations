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
import { FAQ, buildFAQLd, type FAQItem } from "@/components/sections/FAQ";

// Match the Method page styling so contextual CTAs feel consistent across the site.
const linkCls = "text-brass underline-offset-4 hover:underline";
const trailingCls = "inline-flex items-center gap-1 text-sm text-brass font-medium hover:text-walnut transition-colors";
const ctaCls = "inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/5 hover:bg-brass hover:text-cream text-brass text-xs font-semibold uppercase tracking-[0.12em] px-4 py-2 transition-colors";

const askLink = (prompt: string) =>
  `/contact?subject=${encodeURIComponent(prompt)}`;

const FaqFooter = ({
  related,
  ask,
}: {
  related?: { to: string; label: string };
  ask: string;
}) => (
  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
    {related && (
      <Link to={related.to} className={trailingCls}>
        {related.label}
      </Link>
    )}
    <Link to={askLink(ask)} className={ctaCls}>
      Ask about this →
    </Link>
  </div>
);

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Where do most People teams get stuck with AI?",
    answer:
      "In one of two traps. The Dabbler tries ChatGPT once, gets a generic output, and gives up — individual tricks, no team capability. The Tool Shopper spends months evaluating tools and writing strategies nobody reads, while the market moves on. Neither path produces operating leverage. The third path is building: small, specific workflows that compound.",
    answerNode: (
      <>
        In one of two traps. The Dabbler tries ChatGPT once, gets a generic output, and gives up — individual tricks, no team capability. The Tool Shopper spends months evaluating tools and writing strategies nobody reads, while the market moves on. Neither path produces operating leverage. The third path is building: small, specific workflows that compound.
        <FaqFooter
          related={{ to: "/intelligence/people-ops/from-prompts-to-systems", label: "From prompts to systems →" }}
          ask="Our People function feels stuck between dabbling and tool-shopping. A bit about where we are: "
        />
      </>
    ),
  },
  {
    question: "Do we need to hire engineers to build AI workflows in our People function?",
    answer:
      "No. Hiring engineers into People to do AI usually backfires — they solve the problem they understand, which is rarely the problem the team has. The champion model uses three or four existing senior coordinators, HRBPs, or Ops leads, given a different mandate and a protected fifth of their week. They know where the friction is because they live in it.",
    answerNode: (
      <>
        No. Hiring engineers into People to do AI usually backfires — they solve the problem they understand, which is rarely the problem the team has. The{" "}
        <Link to="/intelligence/people-ops/the-champion-model" className={linkCls}>champion model</Link> uses three or four existing senior coordinators, HRBPs, or Ops leads, given a different mandate and a protected fifth of their week. They know where the friction is because they live in it.
        <FaqFooter
          related={{ to: "/enablement", label: "How champions are trained →" }}
          ask="I'd like to talk about who in our team could become AI champions. A bit about our function: "
        />
      </>
    ),
  },
  {
    question: "How do we know if our People function is ready to build with AI?",
    answer:
      "Six signals, in order of importance: data hygiene (one source of truth, not three), process clarity (can the workflow be drawn on a whiteboard in five minutes), tool fragmentation (under five integrations is workable), curiosity distribution (who has already played with AI), sponsor presence (a named senior leader who will defend the time), and risk posture (how the company thinks about AI risk). Sponsor presence is the single best predictor.",
    answerNode: (
      <>
        Six signals, in order of importance: data hygiene (one source of truth, not three), process clarity (can the workflow be drawn on a whiteboard in five minutes), tool fragmentation (under five integrations is workable), curiosity distribution (who has already played with AI), sponsor presence (a named senior leader who will defend the time), and risk posture (how the company thinks about AI risk). Sponsor presence is the single best predictor.
        <FaqFooter
          related={{ to: "/intelligence/people-ops/diagnosing-ai-readiness-in-people-ops", label: "The full readiness diagnostic →" }}
          ask="I'd like to understand how ready our People function is to build with AI. A bit about us: "
        />
      </>
    ),
  },
  {
    question: "How should we handle governance without slowing the work to a crawl?",
    answer:
      "Treat governance as steering, not braking. Decide early — in writing — which decisions a model never makes alone (hiring, termination, performance, comp, accommodations, discipline), which data the model never sees (special-category, NDA, identifiable salary), which outputs a human always reviews (anything that goes to a candidate or a regulator), and what logging exists. With those four boundaries set, you can move fast on everything else.",
    answerNode: (
      <>
        Treat governance as steering, not braking. Decide early — in writing — which decisions a model never makes alone (hiring, termination, performance, comp, accommodations, discipline), which data the model never sees (special-category, NDA, identifiable salary), which outputs a human always reviews (anything that goes to a candidate or a regulator), and what logging exists. With those four boundaries set, you can move fast on everything else.
        <FaqFooter
          related={{ to: "/intelligence/people-ops/ai-governance-for-people-teams", label: "AI governance for People teams →" }}
          ask="I'd like to talk about setting up governance for AI in our People function. A bit about our context: "
        />
      </>
    ),
  },
  {
    question: "What's the best first step if we want to take this seriously?",
    answer:
      "Start with the diagnostic. The AI Operating Index is a free 8-pillar self-assessment that shows you where your operating system holds and where it gives — across data, tools, governance, and capability. It produces a starting picture in under fifteen minutes. From there, the next move is usually a 30-day Read phase to surface the operating reality before any building begins.",
    answerNode: (
      <>
        Start with the diagnostic. The{" "}
        <a href={AIOI_URL} target="_blank" rel="noreferrer" className={linkCls}>
          AI Operating Index
        </a>{" "}
        is a free 8-pillar self-assessment that shows you where your operating system holds and where it gives — across data, tools, governance, and capability. It produces a starting picture in under fifteen minutes. From there, the next move is usually a 30-day{" "}
        <Link to="/method#read" className={linkCls}>Read</Link> phase to surface the operating reality before any building begins.
        <FaqFooter ask="I'd like to talk about how to start building AI capability in our People function. A bit about us: " />
      </>
    ),
  },
];

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
