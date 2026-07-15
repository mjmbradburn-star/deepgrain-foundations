import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { ValueVisualiser } from "@/components/sections/ValueVisualiser";
import { BuildVsHire } from "@/components/sections/BuildVsHire";
import { FAQ, buildFAQLd, type FAQItem } from "@/components/sections/FAQ";
import { BarkSection } from "@/components/ui/BarkSection";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { ThreeLevels } from "@/components/sections/deck/ThreeLevels";
import { WorkedExample } from "@/components/sections/deck/WorkedExample";
import { AuditPrompt } from "@/components/sections/deck/AuditPrompt";

// Each FAQ keeps `answer` as the canonical text mirrored in JSON-LD; `answerNode`
// adds inline navigation (where natural) plus a small "Ask about this" CTA that
// deep-links to /contact with a question-specific prefill in ?subject=.
const linkCls = "text-brass underline-offset-4 hover:underline transition-colors duration-300";
const trailingCls = "inline-flex items-center gap-1 text-sm text-brass font-medium hover:text-walnut transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";
const ctaCls = "inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/5 hover:bg-brass hover:text-cream text-brass text-xs font-semibold uppercase tracking-[0.12em] px-4 py-2 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]";

/** Build a /contact link with a polite, conversational prefill quoting the FAQ. */
const askLink = (prompt: string) =>
  `/contact?subject=${encodeURIComponent(prompt)}`;

/** Footer row under each FAQ answer: optional related link + the contextual CTA. */
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
    question: "How long does a Deepgrain engagement run?",
    answer:
      "Most engagements run between three and nine months. We start with a 30-day Read phase to surface the operating reality, then move into Craft (typically 60–120 days of focused interventions paired with champion development), and finally a Scale phase that hands the practice over to your team. Some clients renew into a lighter advisory cadence after that.",
    answerNode: (
      <>
        Most engagements run between three and nine months. We start with a 30-day{" "}
        <Link to="/method#read" className={linkCls}>Read</Link> phase to surface the operating reality, then move into{" "}
        <Link to="/method#craft" className={linkCls}>Craft</Link> (typically 60–120 days of focused interventions paired with champion development), and finally a{" "}
        <Link to="/method#scale" className={linkCls}>Scale</Link> phase that hands the practice over to your team. Some clients renew into a lighter advisory cadence after that.
        <FaqFooter ask="I'd like to understand what an engagement timeline would look like for us. A bit about our situation: " />
      </>
    ),
  },
  {
    question: "What does the first 30 days actually look like?",
    answer:
      "The Read phase. Matt sits inside your operating cadence: standups, one-to-ones, leadership reviews. He runs structured interviews across the org. The output is a written diagnostic: where the operating story diverges from the operating reality, which interventions would compound, and which would break the grain. No slideware, no benchmarks. A document leadership can act on.",
    answerNode: (
      <>
        The <Link to="/method#read" className={linkCls}>Read</Link> phase. Matt sits inside your operating cadence: standups, one-to-ones, leadership reviews. He runs structured interviews across the org. The output is a written diagnostic: where the operating story diverges from the operating reality, which interventions would compound, and which would break the grain. No slideware, no benchmarks. A document leadership can act on.
        <FaqFooter ask="I'd like to talk about what a Read phase would surface in our organisation. A bit about us: " />
      </>
    ),
  },
  {
    question: "What deliverables do we walk away with?",
    answer:
      "Three things. First, the diagnostic document from the Read phase. Second, the interventions themselves: usually a small set of agentic systems and operating rituals built and shipped during Craft. Third, three or four trained champions inside the team who can extend, debug, and govern the work after we leave. The capability stays with you, not in a vendor.",
    answerNode: (
      <>
        Three things. First, the diagnostic document from the{" "}
        <Link to="/method#read" className={linkCls}>Read</Link> phase. Second, the interventions themselves: usually a small set of agentic systems and operating rituals built and shipped during{" "}
        <Link to="/method#craft" className={linkCls}>Craft</Link>. Third, three or four trained champions inside the team who can extend, debug, and govern the work after we leave. The capability stays with you, not in a vendor.
        <FaqFooter
          related={{ to: "/enablement", label: "See how champions are trained →" }}
          ask="I'd like to understand what deliverables would look like for our function. A bit about us: "
        />
      </>
    ),
  },
  {
    question: "Who is the right fit for this work?",
    answer:
      "Founders and operating leaders inside organisations worth getting right: typically AI-native, defence tech, financial data, transit and mobility, or climate. The common thread: leadership willing to look at the operating reality honestly, and a team capable of holding the practice once we hand it over.",
    answerNode: (
      <>
        Founders and operating leaders inside organisations worth getting right: typically AI-native, defence tech, financial data, transit and mobility, or climate. The common thread: leadership willing to look at the operating reality honestly, and a team capable of holding the practice once we hand it over.
        <FaqFooter
          related={{ to: "/work", label: "See who we work with →" }}
          ask="I'd like to know whether we're a fit for Deepgrain. A bit about our organisation: "
        />
      </>
    ),
  },
  {
    question: "Do I need a technical team to make this work?",
    answer:
      "No. The champion model is built around non-engineers: heads of People, ops leads, chiefs of staff, domain operators. They learn to design and run agents inside their own function. We bring the engineering muscle when something needs to be built deeper, but the day-to-day capability lives with operators, not coders.",
    answerNode: (
      <>
        No. The champion model is built around non-engineers: heads of People, ops leads, chiefs of staff, domain operators. They learn to design and run agents inside their own function. We bring the engineering muscle when something needs to be built deeper, but the day-to-day capability lives with operators, not coders.
        <FaqFooter
          related={{ to: "/enablement", label: "How the champion model works →" }}
          ask="I'd like to talk about who in our team could become champions. A bit about our function: "
        />
      </>
    ),
  },
  {
    question: "How does pricing work?",
    answer:
      "Engagements are scoped per phase, not by retainer or day rate. If you want a fixed number before that conversation, start with the Grain Audit: two weeks, £2,000, one process mapped end to end. It's credited in full against a programme if you go further.",
    answerNode: (
      <>
        Engagements are scoped per phase, not by retainer or day rate. If you want a fixed number before that conversation, start with the{" "}
        <Link to="/grain-audit" className={linkCls}>Grain Audit</Link>: two weeks, £2,000, one process mapped end to end. It's credited in full against a programme if you go further.
        <FaqFooter
          related={{ to: "/grain-audit", label: "Book a Grain Audit →" }}
          ask="I'd like an indicative range for a full engagement, beyond the Grain Audit. A bit about what we're trying to fix: "
        />
      </>
    ),
  },
];

// HowTo schema mirrors the visible Read · Craft · Scale sections below.
// Step descriptions stay short and faithful to the on-page prose so the
// markup-vs-content match Google requires for HowTo eligibility holds.
const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "The Deepgrain method: Read · Craft · Scale",
  description:
    "Three sequential movements for building AI capability that compounds inside an organisation: read the operating reality, craft interventions with the grain, then leave something that scales.",
  totalTime: "P9M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Read the grain",
      url: "https://deepgrain.ai/method#read",
      text: "A 30-day operating diagnostic. Sit inside the operating cadence, run structured interviews, and surface where the operating story diverges from the operating reality. Output is a written diagnostic leadership can act on, not slideware.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Craft with the grain",
      url: "https://deepgrain.ai/method#craft",
      text: "Build a small set of agentic systems and operating rituals alongside three or four internal champions. Human judgement and machine precision working together, designed around how this specific organisation actually moves.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Scale without breaking the grain",
      url: "https://deepgrain.ai/method#scale",
      text: "Hand the practice to the team. Trained champions extend the work into corners we never touched. The capability stays in the function, not in a vendor.",
    },
  ],
};

// Service schema declares the consultancy offering for entity-graph clarity.
// Kept conservative: no price (no public pricing on site), no aggregateRating
// (no published reviews). Only claims that are supported by visible page copy.
const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Deepgrain operating consultancy",
  serviceType: "Organisational consultancy and AI operating systems",
  description:
    "Operating consultancy that reads an organisation's grain, builds agentic systems and rituals with it, and leaves a trained internal capability behind.",
  url: "https://deepgrain.ai/method",
  provider: {
    "@type": "Organization",
    name: "Deepgrain",
    url: "https://deepgrain.ai",
    email: "matt@deepgrain.ai",
  },
  areaServed: { "@type": "Place", name: "United Kingdom" },
  audience: {
    "@type": "Audience",
    audienceType: "Founders and operating leaders in AI-native, defence tech, financial data, transit and mobility, and climate organisations",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Engagement phases",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Read",
          description: "30-day operating diagnostic. Written output leadership can act on.",
          url: "https://deepgrain.ai/method#read",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Craft",
          description: "Building agentic systems and operating rituals with internal champions.",
          url: "https://deepgrain.ai/method#craft",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Scale",
          description: "Capability handover. Champions extend the practice after the engagement ends.",
          url: "https://deepgrain.ai/method#scale",
        },
      },
    ],
  },
};

// Film-grain: a fixed, pointer-events-none SVG-noise plate for a physical-paper
// feel, matching the treatment on Home. Static (no animation), GPU-composited,
// and scoped to this page only.
const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

const FilmGrain = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-multiply motion-reduce:opacity-[0.025]"
    style={{ backgroundImage: NOISE_URL, backgroundSize: "140px 140px" }}
  />
);

/** Trailing arrow nested in its own circular wrapper, with magnetic hover. Mirrors the Home hero CTA treatment. */
const ArrowCircle = ({ tone = "green" }: { tone?: "green" | "cream" }) => (
  <span
    aria-hidden
    className={cn(
      "ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
      "group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105",
      tone === "green" ? "bg-green/10 text-green" : "bg-cream/10 text-cream",
    )}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

/**
 * Double-bezel pull-quote: outer machined tray + inner core with concentric
 * radii and an inset highlight, replacing the plain border-l callout so the
 * four proof-quotes read as physical artefacts rather than flat text.
 * Page-local to /method.
 */
const QuoteBezel = ({
  tone = "linen",
  className,
  children,
}: {
  tone?: "linen" | "green";
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "rounded-[1.75rem] p-1.5 ring-1",
      tone === "linen" ? "bg-brass/[0.05] ring-brass/20" : "bg-cream/[0.05] ring-cream/15",
      className,
    )}
  >
    <div
      className={cn(
        "rounded-[1.375rem] border px-7 py-7 md:px-9 md:py-8",
        tone === "linen"
          ? "bg-cream border-brass/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]"
          : "bg-bark/40 border-cream/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]",
      )}
    >
      {children}
    </div>
  </div>
);

const MethodPage = () => {
  const grainAuditHref = "/grain-audit";
  const onGrainAudit = () =>
    track("cta_click", {
      cta_id: "grain_audit_method_close",
      cta_location: "method_close",
      cta_label: "Book a Grain Audit",
      link_url: grainAuditHref,
    });

  return (
    <>
      <FilmGrain />
      <PageMeta
        title="Method · Read · Craft · Scale | Deepgrain"
        description="The Deepgrain method in full. Read the operating reality, craft the smallest interventions that compound, then scale without breaking the grain."
        image="https://deepgrain.ai/og-method.png"
        path="/method"
        jsonLd={[
          buildBreadcrumbLd([
            { name: "Home", url: "https://deepgrain.ai/" },
            { name: "Method", url: "https://deepgrain.ai/method" },
          ]),
          buildFAQLd(FAQ_ITEMS),
          howToLd,
          serviceLd,
        ]}
      />
      {/* Hero: deck shape, eyebrow, single assertion, no glossy image */}
      <section className="relative bg-green text-cream pt-40 pb-24 md:pb-32 overflow-hidden">
        <Parallax speed={0.12} max={80} className="absolute inset-0">
          <TopoBackdrop variant="ridge" opacity={0.22} />
        </Parallax>
        <div className="relative container-grain max-w-5xl">
          <Reveal>
            <SectionEyebrow className="mb-6" />
            <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[88px] leading-[1.02] text-balance max-w-4xl">
              Read. Craft. Scale. In that order, always.
            </h1>
            <p className="mt-8 max-w-2xl text-cream/80 text-lg leading-relaxed">
              The strategic, the functional and the individual move together, or the work stalls
              at a pilot like every other AI rollout you've watched.
            </p>
            <div className="mt-10">
              <AuditPrompt
                tone="green"
                ctaId="audit_method_hero"
                ctaLocation="method_hero"
                headline="Walk one workflow through it with me."
                sub="Thirty minutes. Read, atomise, agree the first move."
                prefill="I'd like to walk one workflow through the method with you. The workflow is:"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Three levels: the page spine, deck slides 5 + 6. Shared with About - not
          restyled here, only rendered; any edits belong in the component's own file. */}
      <ThreeLevels />

      {/* Worked example: sits between the spine and the Read/Craft/Scale narrative.
          Shared with Home, already carries the double-bezel treatment from there. */}
      <WorkedExample />

      {/* Read */}
      <section id="read" className="bg-linen text-body section-pad scroll-mt-40">
        <div className="container-grain max-w-3xl">
          <Reveal>
            <SectionEyebrow tone="linen" pill className="mb-6">01 Read</SectionEyebrow>
            <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
              Before we touch a thing, we understand.
            </h2>
            <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
              <p>
                Most consulting starts with the org chart. We start somewhere
                else. The org chart is rarely how decisions actually get made,
                and the strategy deck is rarely what drives the outcome.
              </p>
              <p className="hidden md:block">
                Underneath all of it is a grain. The real pattern of how this
                organisation moves and decides. We read it first. We talk to
                the people doing the work. We watch where energy flows and
                where it stalls. We find the fractures forming before anyone
                has named them. Only then do we build.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <QuoteBezel tone="linen" className="mt-10">
              <blockquote className="font-display text-walnut text-xl md:text-2xl leading-snug italic">
                “If you can't name where the work is actually getting stuck, every tool you buy will land in the wrong place.”
              </blockquote>
              <figcaption className="mt-4 text-sm text-body/70">
                From{" "}
                <Link to="/intelligence/diagnosing-ai-readiness-in-people-ops" className={linkCls}>
                  Diagnosing AI readiness in People Ops →
                </Link>
              </figcaption>
            </QuoteBezel>
          </Reveal>
        </div>
      </section>

      {/* Craft */}
      <BarkSection
        id="craft"
        className="section-pad scroll-mt-40"
        contentClassName="container-grain max-w-3xl"
      >
        <Reveal>
          <SectionEyebrow pill className="mb-6">02 Craft</SectionEyebrow>
          <h2 className="font-display text-cream text-4xl md:text-6xl leading-tight">
            We build with the grain, not against it.
          </h2>
          <div className="mt-10 space-y-6 text-cream/80 leading-relaxed text-lg">
            <p>
              Human judgement. Machine precision. In the room together from
              day one. Agents that remove friction without removing thought.
              Systems designed around how this specific place actually works,
              not borrowed from a playbook that worked somewhere else.
            </p>
            <p className="hidden md:block">
              The carpenter knows the wood will split if you cut against the
              grain. So do we. We build alongside your people, in your tools,
              with your context. Then we hand it over.
            </p>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <QuoteBezel tone="green" className="mt-10">
            <blockquote className="font-display text-cream text-xl md:text-2xl leading-snug italic">
              “A prompt is a moment of cleverness. A system is what makes the cleverness reliable on a Tuesday afternoon when nobody's watching.”
            </blockquote>
            <figcaption className="mt-4 text-sm text-cream/60">
              From{" "}
              <Link to="/intelligence/from-prompts-to-systems" className={linkCls}>
                From prompts to systems →
              </Link>
            </figcaption>
          </QuoteBezel>
        </Reveal>
      </BarkSection>

      {/* Empowerment beat */}
      <section className="bg-linen text-body section-pad">
        <div className="container-grain max-w-3xl">
          <Reveal>
            <SectionEyebrow tone="linen" pill className="mb-6">The partnership</SectionEyebrow>
            <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
              Agents that partner. People who grow.
            </h2>
            <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
              <p>
                Agents take the repeatable, low-judgement work. Your champions
                learn to design, run, and extend them. The capability stays in
                the team, not in a vendor.{" "}
                <Link to="/enablement" className={linkCls}>
                  See how enablement works →
                </Link>
              </p>
              <p className="hidden md:block">
                It's a training programme first. The systems ship as a side
                effect, and the hours we reclaim go straight back to your
                people, for the work only they can do.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <QuoteBezel tone="linen" className="mt-10">
              <blockquote className="font-display text-walnut text-xl md:text-2xl leading-snug italic">
                “The leaders who get this right don't lead the rollout. They lead the conditions that make the rollout inevitable.”
              </blockquote>
              <figcaption className="mt-4 text-sm text-body/70">
                From{" "}
                <Link to="/intelligence/leading-the-ai-transformation" className={linkCls}>
                  Leading the AI transformation →
                </Link>
              </figcaption>
            </QuoteBezel>
          </Reveal>
        </div>
      </section>

      {/* Build vs Hire: sits between Craft and Scale. Page-specific to /method. */}
      <BuildVsHire />

      {/* Scale */}
      <section id="scale" className="bg-linen text-body section-pad scroll-mt-40">
        <div className="container-grain max-w-3xl">
          <Reveal>
            <SectionEyebrow tone="linen" pill className="mb-6">03 Scale</SectionEyebrow>
            <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
              We leave something that compounds.
            </h2>
            <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
              <p>
                Not a deck. A genuine capability. Teams who think well with AI.
                Structures that hold as you scale.
              </p>
              <p className="hidden md:block">
                Months after we leave, the champions are still building. They
                have extended the work into places we never touched. That is
                the test: what you still have, and what you have added, long
                after the invoices stop. The guardrails that keep it
                trustworthy live with the team too, through{" "}
                <Link to="/intelligence/ai-governance-for-people-teams" className={linkCls}>
                  governance designed for the people doing the work
                </Link>
                , not bolted on after the fact.
              </p>
            </div>
          </Reveal>

          {/* Champions trained: same double-bezel pull-quote treatment as Read/Craft/Empowerment, at a larger anchor weight for the closing beat. */}
          <Reveal delay={160}>
            <QuoteBezel tone="linen" className="mt-12">
              <blockquote className="font-display text-walnut text-2xl md:text-3xl leading-snug italic text-balance">
                “You don't need engineers to build AI capability inside the
                function. You need three or four champions, given air cover
                and time.”
              </blockquote>
              <figcaption className="mt-4 text-sm text-body/70">
                <Link to="/intelligence/the-champion-model" className={linkCls}>
                  Read: The champion model →
                </Link>
              </figcaption>
            </QuoteBezel>
          </Reveal>
        </div>
      </section>

      {/* Value visualiser: page-specific to /method. */}
      <ValueVisualiser />

      {/* FAQ: shared with Enablement, Work, IntelligenceArticle - not restyled here. */}
      <FAQ heading="What clients ask before they engage." items={FAQ_ITEMS} />

      {/* CTA: Grain Audit, the paid bridge offer for a reader who just read the whole method */}
      <section className="relative bg-green text-cream section-pad overflow-hidden">
        <Parallax speed={0.14} max={90} className="absolute inset-0">
          <TopoBackdrop variant="basin" opacity={0.16} />
        </Parallax>
        <div className="relative container-grain max-w-3xl">
          <Reveal>
            <SectionEyebrow pill className="mb-6">The Grain Audit</SectionEyebrow>
            <h2 className="font-display text-cream text-4xl md:text-6xl leading-tight text-balance">
              Don't take the method on faith. Run it on one process.
            </h2>
            <p className="mt-6 max-w-2xl text-cream/80 text-lg leading-relaxed">
              The Grain Audit maps one People Ops process end to end, ranks the
              highest-return automations, and hands you a 90-day plan you keep
              whether or not we work together. Two weeks. £2,000, credited in
              full against a programme. Three slots a month.
            </p>
            <div className="mt-10">
              <Link
                to={grainAuditHref}
                onClick={onGrainAudit}
                className="group inline-flex items-center gap-1 rounded-full bg-cream text-green pl-7 pr-3 py-3 font-sans text-sm tracking-wider transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream/90 active:scale-[0.98] shadow-[0_1px_0_hsl(var(--cream)/0.6)_inset]"
              >
                Book a Grain Audit
                <ArrowCircle tone="green" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default MethodPage;
