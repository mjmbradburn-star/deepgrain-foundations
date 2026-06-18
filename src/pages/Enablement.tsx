import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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
import { AuditPrompt } from "@/components/sections/deck/AuditPrompt";

// Each FAQ keeps `answer` as the canonical text mirrored in JSON-LD; `answerNode`
// adds inline navigation, an optional "Related" link, and a contextual "Ask about
// this" CTA that deep-links to /contact with a question-specific ?subject= prefill.
const linkCls = "text-brass underline-offset-4 hover:underline";
const trailingCls = "inline-flex items-center gap-1 text-sm text-brass font-medium hover:text-walnut transition-colors";
const ctaCls = "inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/5 hover:bg-brass hover:text-cream text-brass text-xs font-semibold uppercase tracking-[0.12em] px-4 py-2 transition-colors";

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

const faqItems: FAQItem[] = [
  {
    question: "How does onboarding work in the first two weeks?",
    answer:
      "We name an exec sponsor, identify three or four champions inside the function, and pick one bounded, painful workflow to build first. No procurement marathon, no tooling debate — we use what you already have where we can, and stand up the missing pieces (an LLM provider, one workflow tool) on the right terms in week one.",
    answerNode: (
      <>
        We name an exec sponsor, identify three or four champions inside the function, and pick one bounded, painful workflow to build first. No procurement marathon, no tooling debate — we use what you already have where we can, and stand up the missing pieces (an LLM provider, one workflow tool) on the right terms in week one.
        <FaqFooter
          related={{ to: "/method#read", label: "01 Read · Before we touch a thing, we understand →" }}
          ask="I'd like to understand what onboarding would look like for our team. A bit about us: "
        />
      </>
    ),
  },
  {
    question: "Who from our team needs to be involved, and how much of their time?",
    answer:
      "An exec sponsor for air cover (a few hours a month), and three or four champions giving roughly a fifth of their week. Champions are existing senior coordinators, People Partners, or Ops leads — people you already pay, given a different mandate. We do not need engineers.",
    answerNode: (
      <>
        An exec sponsor for air cover (a few hours a month), and three or four{" "}
        <Link to="/intelligence/the-champion-model" className={linkCls}>champions</Link> giving roughly a fifth of their week. Champions are existing senior coordinators, People Partners, or Ops leads — people you already pay, given a different mandate. We do not need engineers.
        <FaqFooter ask="I'd like to talk about who in our team could become champions. A bit about our function: " />
      </>
    ),
  },
  {
    question: "What does the coaching curriculum actually cover?",
    answer:
      "Six modules run alongside live builds: reading the grain, briefing agents, wiring workflows, governance and trust, measuring value, and sustaining the practice. There is no classroom phase — champions learn the craft on their own systems, with their own data, on problems they already wanted to solve.",
    answerNode: (
      <>
        Six modules run alongside live builds: reading the grain, briefing agents, wiring workflows, governance and trust, measuring value, and sustaining the practice. There is no classroom phase — champions learn the{" "}
        <Link to="/method#craft" className={linkCls}>craft</Link> on their own systems, with their own data, on problems they already wanted to solve.
        <FaqFooter ask="I'd like to know more about the coaching curriculum and how it would map to our team. A bit about our context: " />
      </>
    ),
  },
  {
    question: "What happens after the engagement ends?",
    answer:
      "Champions keep building. They extend the practice into corners we never touched, and train the next champion. We stay reachable for occasional questions, but the capability is genuinely held by the team — not parked with a vendor on a retainer.",
    answerNode: (
      <>
        Champions keep building. They extend the practice into corners we never touched, and train the next champion. We stay reachable for occasional questions, but the capability is genuinely held by the team — not parked with a vendor on a retainer.
        <FaqFooter
          related={{ to: "/method#scale", label: "03 Scale · We leave something that compounds →" }}
          ask="I'd like to understand what life looks like after the engagement ends. A bit about us: "
        />
      </>
    ),
  },
  {
    question: "How do you measure that the capability has actually transferred?",
    answer:
      "Three signals. Champions ship a workflow we did not scope, end-to-end, without us. A new joiner is brought up to speed by a colleague rather than a deck. And six months on, the workflow count has grown — not flatlined. If those are not true, the engagement did not land, regardless of hours saved.",
    answerNode: (
      <>
        Three signals. Champions ship a workflow we did not scope, end-to-end, without us. A new joiner is brought up to speed by a colleague rather than a deck. And six months on, the workflow count has grown — not flatlined. If those are not true, the engagement did not land, regardless of hours saved.
        <FaqFooter
          related={{ to: "/work", label: "See where it has landed →" }}
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
    body: "Where agents fit, and where human judgment has to stay.",
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
    body: "Hours saved, judgment freed, capability gained. A real story about what changed.",
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
  "A governance pattern your team understands and can defend.",
  "Capability that keeps growing into corners we never touched.",
];

const Enablement = () => (
  <>
    <PageMeta
      title="Enablement | Coaching and champions | Deepgrain"
      description="What 'people upskilled' means in a Deepgrain engagement: the coaching curriculum, the champion model, and capability your team keeps."
      image="https://deepgrain.ai/og-enablement.png"
      path="/enablement"
      jsonLd={[
        buildBreadcrumbLd([
          { name: "Home", url: "https://deepgrain.ai/" },
          { name: "Enablement", url: "https://deepgrain.ai/enablement" },
        ]),
        buildFAQLd(faqItems),
      ]}
    />

    {/* Hero — deck shape */}
    <section className="relative bg-green text-cream pt-40 pb-24 md:pb-32 overflow-hidden">
      <TopoBackdrop variant="ridge" opacity={0.22} />
      <div className="relative container-grain max-w-5xl">
        <ScrollReveal>
          <SectionEyebrow className="mb-6">Enablement</SectionEyebrow>
          <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[88px] leading-[1.02] text-balance max-w-4xl">
            Find your builder. Move your middle layer.
          </h1>
          <p className="mt-8 max-w-2xl text-cream/80 text-lg leading-relaxed">
            Agents take the repeatable work. People learn to design, run and extend them. When we
            leave, the capability stays in the team, not in a vendor.
          </p>

          <dl className="mt-14 grid gap-10 sm:grid-cols-3 border-t border-cream/15 pt-10 max-w-2xl">
            <div>
              <dt className="font-display font-semibold text-brass text-5xl md:text-6xl leading-none tabular-nums">
                <AnimatedNumber value={37} />
              </dt>
              <dd className="mt-3 text-[11px] uppercase tracking-[0.2em] text-cream/70 font-semibold">
                Champions trained
              </dd>
            </div>
            <div>
              <dt className="font-display font-semibold text-brass text-5xl md:text-6xl leading-none tabular-nums">
                <AnimatedNumber value={11} />
              </dt>
              <dd className="mt-3 text-[11px] uppercase tracking-[0.2em] text-cream/70 font-semibold">
                Functions reshaped
              </dd>
            </div>
            <div>
              <dt className="font-display font-semibold text-brass text-5xl md:text-6xl leading-none tabular-nums">
                <AnimatedNumber value={0} />
              </dt>
              <dd className="mt-3 text-[11px] uppercase tracking-[0.2em] text-cream/70 font-semibold">
                Vendor lock-in
              </dd>
            </div>
          </dl>
        </ScrollReveal>
      </div>
    </section>

    {/* Builder vs middle layer — deck slide 13 */}
    <BuilderVsMiddle />

    {/* The matrix — deck slide 14 */}
    <RoleMatrix />

    {/* What "people upskilled" means */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain">
        <ScrollReveal>
          <div className="max-w-3xl">
            <Eyebrow className="text-brass mb-4">People upskilled</Eyebrow>
            <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
              What the metric means.
            </h2>
            <p className="mt-8 text-body/85 text-lg leading-relaxed">
              When we report &ldquo;people upskilled&rdquo; at the end of an engagement, we
              mean three things. Not certificates. Not seat licences. A change in what the
              team can do without us in the room.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {upskilled.map((u) => (
              <div key={u.title} className="border-t border-walnut/15 pt-6">
                <div className="font-display text-walnut text-2xl mb-3">
                  {u.title}
                </div>
                <p className="text-body/80 leading-relaxed">{u.body}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Champion model */}
    <section className="bg-cream text-body section-pad">
      <div className="container-grain">
        <ScrollReveal>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow className="text-brass mb-4">The champion model</Eyebrow>
              <h2 className="font-display text-walnut text-4xl md:text-5xl leading-tight">
                You need three or four champions, not engineers.
              </h2>
              <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
                <p>
                  A champion is someone already inside the team. A senior coordinator, a
                  People Partner, an Ops lead. Someone with deep tacit knowledge of how the
                  work flows, and curiosity about wiring things together. People you already
                  pay, given a different mandate.
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
                  The nucleus of a real practice.
                </p>
              </div>
              <Link
                to="/intelligence/the-champion-model"
                className="group mt-10 inline-flex items-center gap-1 text-sm text-brass font-medium transition-colors hover:text-walnut"
              >
                Read the full essay
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
              </Link>
            </div>

            <div className="rounded-2xl border-l-4 border-brass bg-walnut/[0.04] p-8 md:p-10">
              <div className="text-[11px] uppercase tracking-[0.2em] text-brass font-semibold">
                What a champion needs
              </div>
              <ul className="mt-6 space-y-7">
                {championNeeds.map((c) => (
                  <li key={c.label}>
                    <div className="font-display text-walnut text-xl">{c.label}</div>
                    <p className="mt-2 text-body/80 leading-relaxed">{c.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Curriculum */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain">
        <ScrollReveal>
          <div className="max-w-3xl">
            <Eyebrow className="text-brass mb-4">The coaching curriculum</Eyebrow>
            <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
              Six modules, run alongside the build.
            </h2>
            <p className="mt-8 text-body/85 text-lg leading-relaxed">
              The curriculum runs in parallel with shipping real workflows. No classroom
              phase. People learn the craft on their own systems, with their own data, on
              problems they already wanted to solve.
            </p>
          </div>

          <div className="mt-16 divide-y divide-walnut/15 border-t border-walnut/15">
            {curriculum.map((m) => (
              <div
                key={m.n}
                className="grid gap-4 py-8 md:grid-cols-[80px_1fr_140px] md:items-baseline md:gap-10"
              >
                <div className="font-display text-brass text-2xl">{m.n}</div>
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
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Outcomes */}
    <BarkSection className="section-pad" contentClassName="container-grain">
      <ScrollReveal>
        <div className="max-w-3xl">
          <Eyebrow className="text-brass mb-4">What you walk away with</Eyebrow>
          <h2 className="font-display text-cream text-4xl md:text-6xl leading-tight">
            A practice the team holds.
          </h2>
        </div>
        <ul className="mt-14 grid gap-8 md:grid-cols-2">
          {outcomes.map((o) => (
            <li
              key={o}
              className="border-t border-brass/40 pt-6 text-cream/85 text-lg leading-relaxed"
            >
              {o}
            </li>
          ))}
        </ul>
        <BrassRule className="mt-16" />
        <p className="mt-10 max-w-2xl text-cream/70 leading-relaxed">
          Six months on, the champions are still building. They have extended the work
          into places nobody asked them to touch, and they are training the next champion.
          That is what capability looks like.
        </p>
        <div className="mt-12">
          <PillButton href="/intelligence/the-champion-model" variant="outline">
            Read the champion model →
          </PillButton>
        </div>
      </ScrollReveal>
    </BarkSection>

    <FAQ
      eyebrow="Onboarding & after"
      heading="What working with us actually looks like."
      items={faqItems}
    />

    <Invitation />
  </>
);

export default Enablement;
