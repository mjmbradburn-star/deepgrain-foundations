import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { PillButton } from "@/components/ui/PillButton";
import { BrassRule } from "@/components/ui/BrassRule";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { Invitation } from "@/components/sections/Invitation";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { FAQ, buildFAQLd, type FAQItem } from "@/components/sections/FAQ";
import { BarkSection } from "@/components/ui/BarkSection";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { BuilderVsMiddle } from "@/components/sections/deck/BuilderVsMiddle";
import { RoleMatrix } from "@/components/sections/deck/RoleMatrix";
import { AssessmentLadder } from "@/components/sections/AssessmentLadder";

/** Trailing arrow nested in its own circular wrapper, magnetic on hover. Mirrors
 * the button-in-button treatment on HeroDeck / IntelligenceTeaser. */
const ArrowGlyph = ({ tone = "brass" }: { tone?: "brass" | "cream" | "green" }) => (
  <span
    aria-hidden
    className={[
      "ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
      "group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105",
      tone === "cream" ? "bg-cream/10 text-cream" : tone === "green" ? "bg-green/10 text-green" : "bg-brass/10 text-brass",
    ].join(" ")}
  >
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

// Each FAQ keeps `answer` as the canonical text mirrored in JSON-LD; `answerNode`
// adds inline navigation, an optional "Related" link, and a contextual "Ask about
// this" CTA that deep-links to /contact with a question-specific ?subject= prefill.
const linkCls = "text-brass underline-offset-4 hover:underline";
const trailingCls = "group inline-flex items-center gap-1 text-sm text-brass font-medium hover:text-walnut transition-colors";
const ctaCls = "group inline-flex items-center rounded-full border border-brass/40 bg-brass/5 hover:bg-brass/10 text-brass text-xs font-semibold uppercase tracking-[0.12em] pl-4 pr-1.5 py-1.5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]";

/** Build a /contact link with a polite, conversational prefill quoting the FAQ. */
const askLink = (prompt: string) =>
  `/contact?subject=${encodeURIComponent(prompt)}`;

/** Footer row under each FAQ answer: optional related links + the contextual CTA. */
const FaqFooter = ({
  related,
  ask,
}: {
  related?: { to: string; label: string }[];
  ask: string;
}) => (
  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
    {related?.map((r) => (
      <Link key={r.to} to={r.to} className={trailingCls}>
        {r.label}
      </Link>
    ))}
    <Link to={askLink(ask)} className={ctaCls}>
      Ask about this
      <ArrowGlyph />
    </Link>
  </div>
);

const faqItems: FAQItem[] = [
  {
    question: "How does onboarding work in the first two weeks?",
    answer:
      "We name an exec sponsor, identify three or four champions inside the function, and pick one bounded, painful workflow to build first. No procurement marathon, no tooling debate. We use what you already have where we can, and stand up the missing pieces (an LLM provider, one workflow tool) on the right terms in week one.",
    answerNode: (
      <>
        We name an exec sponsor, identify three or four champions inside the function, and pick one bounded, painful workflow to build first. No procurement marathon, no tooling debate. We use what you already have where we can, and stand up the missing pieces (an LLM provider, one workflow tool) on the right terms in week one.
        <FaqFooter
          related={[
            { to: "/method#read", label: "01 Read · Before we touch a thing, we understand →" },
            { to: "/readiness", label: "Score your function first, about ten minutes →" },
          ]}
          ask="I'd like to understand what onboarding would look like for our team. A bit about us: "
        />
      </>
    ),
  },
  {
    question: "Who from our team needs to be involved, and how much of their time?",
    answer:
      "An exec sponsor for air cover (a few hours a month), and three or four champions giving roughly a fifth of their week. Champions are existing senior coordinators, People Partners, or Ops leads: people you already pay, given a different mandate. We do not need engineers.",
    answerNode: (
      <>
        An exec sponsor for air cover (a few hours a month), and three or four{" "}
        <Link to="/intelligence/the-champion-model" className={linkCls}>champions</Link> giving roughly a fifth of their week. Champions are existing senior coordinators, People Partners, or Ops leads: people you already pay, given a different mandate. We do not need engineers.
        <FaqFooter ask="I'd like to talk about who in our team could become champions. A bit about our function: " />
      </>
    ),
  },
  {
    question: "What does the coaching curriculum actually cover?",
    answer:
      "Six modules run alongside live builds: reading the grain, briefing agents, wiring workflows, governance and trust, measuring value, and sustaining the practice. There is no classroom phase. Champions learn the craft on their own systems, with their own data, on problems they already wanted to solve.",
    answerNode: (
      <>
        Six modules run alongside live builds: reading the grain, briefing agents, wiring workflows, governance and trust, measuring value, and sustaining the practice. There is no classroom phase. Champions learn the{" "}
        <Link to="/method#craft" className={linkCls}>craft</Link> on their own systems, with their own data, on problems they already wanted to solve.
        <FaqFooter ask="I'd like to know more about the coaching curriculum and how it would map to our team. A bit about our context: " />
      </>
    ),
  },
  {
    question: "What happens after the engagement ends?",
    answer:
      "Champions keep building. They extend the practice into corners we never touched, and train the next champion. We stay reachable for occasional questions, but the capability is genuinely held by the team, not parked with a vendor on a retainer.",
    answerNode: (
      <>
        Champions keep building. They extend the practice into corners we never touched, and train the next champion. We stay reachable for occasional questions, but the capability is genuinely held by the team, not parked with a vendor on a retainer.
        <FaqFooter
          related={[{ to: "/method#scale", label: "03 Scale · We leave something that compounds →" }]}
          ask="I'd like to understand what life looks like after the engagement ends. A bit about us: "
        />
      </>
    ),
  },
  {
    question: "How do you measure that the capability has actually transferred?",
    answer:
      "Three signals. Champions ship a workflow we did not scope, end-to-end, without us. A new joiner is brought up to speed by a colleague rather than a deck. And six months on, the workflow count has grown, not flatlined. If those are not true, the engagement did not land, regardless of hours saved.",
    answerNode: (
      <>
        Three signals. Champions ship a workflow we did not scope, end-to-end, without us. A new joiner is brought up to speed by a colleague rather than a deck. And six months on, the workflow count has grown, not flatlined. If those are not true, the engagement did not land, regardless of hours saved.
        <FaqFooter
          related={[{ to: "/work", label: "See where it has landed →" }]}
          ask="I'd like to talk about how we'd measure capability transfer in our context. A bit about us: "
        />
      </>
    ),
  },
];

const upskilled = [
  {
    title: "Fluency",
    body: "Everyone in the function can brief an agent and judge its output. The work stops feeling foreign.",
  },
  {
    title: "Craft",
    body: "Three or four champions design and ship workflows themselves. They are your internal builders.",
  },
  {
    title: "Practice",
    body: "The capability stays after we leave. New joiners pick it up from colleagues, not from a deck.",
  },
];

/** Decorative brass glyphs paired with `upskilled` by index. Presentation only,
 * no copy change: mirrors the nested-circle icon treatment on TheCounterweight. */
const upskilledIcons = ["✦", "◈", "◌"];

const championNeeds = [
  {
    label: "Air cover",
    body: "A named exec sponsor, and a protected fifth of the week that does not get pulled into the next crisis.",
  },
  {
    label: "Tools and budget",
    body: "One workflow tool, an LLM provider on the right terms, a small monthly budget with no procurement friction.",
  },
  {
    label: "A small starting brief",
    body: "One bounded, painful workflow owned by a willing colleague. Not a programme. A first build.",
  },
];

const curriculum = [
  {
    n: "01",
    title: "Reading the grain",
    body: "Where agents fit, and where human judgement has to stay.",
    duration: "Half day",
  },
  {
    n: "02",
    title: "Briefing agents",
    body: "Prompts as specifications. Writing for a system that has to act.",
    duration: "1 week",
  },
  {
    n: "03",
    title: "Wiring workflows",
    body: "Tools, triggers, and handoffs. The plumbing that makes an agent useful in a real working day.",
    duration: "2 weeks",
  },
  {
    n: "04",
    title: "Governance and trust",
    body: "What stays human, what gets reviewed, what gets logged.",
    duration: "1 week",
  },
  {
    n: "05",
    title: "Measuring value",
    body: "Hours saved, judgement freed, capability gained. Numbers you can say out loud in the boardroom, not vibes.",
    duration: "Half day",
  },
  {
    n: "06",
    title: "Sustaining the practice",
    body: "Running the champion circle after we leave. Reviewing each other's work. Training the next one.",
    duration: "Ongoing",
  },
];

const outcomes = [
  "Three or four trained champions inside the function.",
  "Eight to twelve production workflows, owned by the teams that use them.",
  "A governance pattern your team understands, not one they take on faith.",
  "Capability that keeps growing into corners we never touched.",
];

const Enablement = () => (
  <>
    <PageMeta
      title="Enablement | Coaching and champions | Deepgrain"
      description="What 'people upskilled' means in a Deepgrain engagement: the coaching curriculum, the champion model, and capability your team keeps."
      image="https://www.deepgrain.ai/og-enablement.png"
      path="/enablement"
      jsonLd={[
        buildBreadcrumbLd([
          { name: "Home", url: "https://www.deepgrain.ai/" },
          { name: "Enablement", url: "https://www.deepgrain.ai/enablement" },
        ]),
        buildFAQLd(faqItems),
      ]}
    />

    {/* Hero: deck shape */}
    <section className="relative bg-green text-cream pt-40 pb-28 md:pb-40 overflow-hidden">
      <Parallax speed={0.12} max={80} className="absolute inset-y-[-15%] inset-x-0 z-[1] pointer-events-none">
        <TopoBackdrop variant="ridge" opacity={0.22} />
      </Parallax>
      <div className="relative z-10 container-grain max-w-5xl">
        <Reveal>
          <SectionEyebrow className="mb-6" />
          <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[88px] leading-[1.02] text-balance max-w-4xl">
            Find your builder. Move your middle layer.
          </h1>
          <p className="mt-8 max-w-2xl text-cream/80 text-lg leading-relaxed">
            Agents take the repeatable work. People learn to run it, extend it, own it. When we
            leave, the capability stays in the team, not in us.
          </p>

          <dl className="mt-14 grid gap-10 sm:grid-cols-3 border-t border-cream/15 pt-10 max-w-2xl">
            <div>
              <dt className="font-display font-semibold text-brass text-5xl md:text-6xl leading-none tabular-nums">
                <AnimatedNumber value={100} suffix="+" countUp />
              </dt>
              <dd className="mt-3 text-[11px] uppercase tracking-[0.2em] text-cream/70 font-semibold">
                Cohorts run
              </dd>
            </div>
            <div>
              <dt className="font-display font-semibold text-brass text-5xl md:text-6xl leading-none tabular-nums">
                <AnimatedNumber value={7} countUp />
              </dt>
              <dd className="mt-3 text-[11px] uppercase tracking-[0.2em] text-cream/70 font-semibold">
                Sectors served
              </dd>
            </div>
            <div>
              <dt className="font-display font-semibold text-brass text-5xl md:text-6xl leading-none tabular-nums">
                <AnimatedNumber value={0} countUp />
              </dt>
              <dd className="mt-3 text-[11px] uppercase tracking-[0.2em] text-cream/70 font-semibold">
                Vendor lock-in
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>

    {/* Builder vs middle layer: deck slide 13 */}
    <BuilderVsMiddle />

    {/* The matrix: deck slide 14 */}
    <RoleMatrix />

    {/* What "people upskilled" means */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
              What &ldquo;people upskilled&rdquo; means.
            </h2>
            <p className="mt-8 text-body/85 text-lg leading-relaxed">
              When we report &ldquo;people upskilled&rdquo; at the end of an engagement, we
              mean three things. Not certificates. Not seat licences. A change in what the
              team can do without us in the room.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {upskilled.map((u, i) => (
            <Reveal key={u.title} delay={i * 90}>
              <div className="border-t border-walnut/20 pt-6">
                <div className="mb-5 rounded-full bg-brass/10 p-1 ring-1 ring-brass/20 w-11 h-11 flex items-center justify-center">
                  <span className="flex h-full w-full items-center justify-center rounded-full text-brass text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                    {upskilledIcons[i]}
                  </span>
                </div>
                <div className="font-display text-walnut text-2xl mb-3">
                  {u.title}
                </div>
                <p className="text-body/80 leading-relaxed">{u.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Champion model */}
    <section className="bg-cream text-body section-pad">
      <div className="container-grain">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="font-display text-walnut text-4xl md:text-5xl leading-tight">
              You need three or four champions, not engineers.
            </h2>
            <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
              <p>
                A champion is someone already inside the team. A senior coordinator, a
                People Partner, an Ops lead. Someone who knows how the work actually flows,
                and wants to wire things together. People you already pay, given a
                different mandate.
              </p>
              <p>
                This works because of grain. Champions know where the friction is, because
                they live in it. They know which approvals are theatre and which handoffs
                drop information. An engineer would have to discover all of that. The
                champion starts with it.
              </p>
              <p>
                Three or four champions, spread across the function, give you something a
                single builder cannot. Review. Shared patterns. Cover when one is buried.
                That&rsquo;s the start of a real practice.
              </p>
            </div>
            <Link
              to="/intelligence/the-champion-model"
              className="group mt-10 inline-flex items-center gap-1 text-sm text-brass font-medium transition-colors hover:text-walnut"
            >
              Read the full essay
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px"
                strokeWidth={2.25}
              />
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="border-t border-walnut/15 pt-8 lg:pt-0 lg:border-t-0 lg:border-l lg:border-walnut/15 lg:pl-16 h-full">
              <p className="font-sans text-walnut/60 text-sm font-semibold">What a champion needs</p>
              <ul className="mt-6 divide-y divide-walnut/15">
                {championNeeds.map((c) => (
                  <li key={c.label} className="py-6 first:pt-0 last:pb-0">
                    <div className="font-display text-walnut text-xl">{c.label}</div>
                    <p className="mt-2 text-body/80 leading-relaxed">{c.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    {/* Curriculum */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
              Six modules, run alongside the build.
            </h2>
            <p className="mt-8 text-body/85 text-lg leading-relaxed">
              The curriculum runs in parallel with shipping real workflows. No classroom
              phase. People learn the craft on their own systems, with their own data, on
              problems they already wanted to solve.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 divide-y divide-walnut/15 border-t border-walnut/15">
          {curriculum.map((m, i) => (
            <Reveal key={m.n} delay={i * 70}>
              <div className="grid gap-4 py-8 md:grid-cols-[80px_1fr_140px] md:items-baseline md:gap-10">
                <div className="flex md:block">
                  <span className="font-display text-brass text-2xl md:text-3xl leading-none tabular-nums">
                    {m.n}
                  </span>
                </div>
                <div>
                  <div className="font-display text-walnut text-2xl md:text-3xl">
                    {m.title}
                  </div>
                  <p className="mt-2 text-body/80 leading-relaxed">{m.body}</p>
                </div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-walnut/60 font-semibold md:text-right">
                  {m.duration}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Outcomes */}
    <BarkSection className="section-pad" contentClassName="container-grain">
      <Reveal>
        <div className="max-w-3xl">
          <h2 className="font-display text-cream text-4xl md:text-6xl leading-tight">
            A practice the team holds.
          </h2>
        </div>
      </Reveal>
      <ul className="mt-14 grid gap-8 md:grid-cols-2">
        {outcomes.map((o, i) => (
          <Reveal
            key={o}
            delay={i * 80}
            as="li"
            className="text-cream/85 text-lg leading-relaxed"
          >
            {o}
          </Reveal>
        ))}
      </ul>
      <Reveal delay={160}>
        <BrassRule className="mt-16" />
        <p className="mt-10 max-w-2xl text-cream/70 leading-relaxed">
          Six months on, the champions are still building. They have extended the work
          into places nobody asked them to touch, and they are training the next champion.
          That&rsquo;s what capability looks like.
        </p>
        <p className="mt-6 max-w-2xl text-cream/85 text-lg leading-relaxed">
          Not ready for the full programme? The Grain Audit maps one People Ops process
          end to end, ranks the highest-return automations, and hands you a 90-day plan
          you keep whether or not we work together. Two weeks. £2,000, credited in
          full against a programme. Three slots a month.
        </p>
        <p className="mt-6 max-w-2xl text-cream/60 text-sm">
          The path in: a free assessment, then a 30-minute call, then a Grain Audit, then
          the full programme. Start wherever you actually are.
        </p>
        <AssessmentLadder
          variant="inline"
          tone="bark"
          tools={["readiness"]}
          ctaLocation="enablement_outcomes"
          className="mt-8 max-w-2xl"
        />
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <PillButton
            href="/grain-audit"
            variant="filled"
            cta="grain_audit_enablement_outcomes"
            ctaLocation="enablement_outcomes"
            className="group active:scale-[0.98]"
          >
            Book a Grain Audit
            <ArrowGlyph tone="green" />
          </PillButton>
          <Link
            to="/intelligence/the-champion-model"
            className="group inline-flex items-center gap-1 text-sm text-cream/70 font-medium transition-colors hover:text-cream"
          >
            Read the champion model
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px"
              strokeWidth={2.25}
            />
          </Link>
        </div>
      </Reveal>
    </BarkSection>

    <FAQ
      eyebrow=""
      heading="What working with us actually looks like."
      items={faqItems}
    />

    <Invitation eyebrow="" />
  </>
);

export default Enablement;
