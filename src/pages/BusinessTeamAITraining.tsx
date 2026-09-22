import { Link } from "react-router-dom";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { FAQ, buildFAQLd, type FAQItem } from "@/components/sections/FAQ";
import { PillButton } from "@/components/ui/PillButton";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { GrainFlow } from "@/components/ui/GrainFlow";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";

const steps = [
  {
    n: "01",
    title: "Audit the work",
    body: "We start with the work, not the tools. Together we break a live process into steps, find the repeated effort and mark where human judgement must stay. That gives the session a real backlog instead of a list of generic prompts.",
  },
  {
    n: "02",
    title: "Run a tailored session",
    body: "One live session, rebuilt around the people in the room and the work they own. The team practises with its own examples in ChatGPT, Claude or the approved company tool, then judges the output against a clear quality bar.",
  },
  {
    n: "03",
    title: "Leave reusable collateral",
    body: "The session leaves tools people can use: a Click Audit worksheet, the four Cs crib sheet for reviewing AI-assisted work, a one-line quality test and a short glossary in the company's language.",
  },
  {
    n: "04",
    title: "Land it in 30 days",
    body: "The team agrees five actions for week one, turns its Click Audit into a build backlog and sets a 30-day definition of good. Training ends with owners and work in motion, not a recording nobody watches.",
  },
];

const teamExamples = [
  {
    title: "Operations",
    body: "Map handoffs, turn recurring requests into consistent workflows, draft standard operating procedures from real cases and build review points around exceptions.",
  },
  {
    title: "Sales and customer teams",
    body: "Prepare account briefs, turn call notes into next actions, draft follow-ups from approved context and review customer-facing work before it leaves the team.",
  },
  {
    title: "Marketing",
    body: "Turn a source interview into a usable content brief, adapt approved material for different channels and apply a shared quality test before publication.",
  },
  {
    title: "Finance and People",
    body: "Break policy-heavy work into safe steps, make recurring analysis easier to repeat and keep named human judgement at the point where the decision matters.",
  },
];

const faqItems: FAQItem[] = [
  {
    question: "Is this AI training for commercial teams or only People teams?",
    answer:
      "It is for business teams across Operations, Sales, Customer, Marketing, Finance and People. The exercises change with the function, but the method stays the same: audit the work, train on live examples, leave reusable collateral and agree a 30-day landing plan.",
  },
  {
    question: "Can you train a team on both ChatGPT and Claude?",
    answer:
      "Yes. ChatGPT and Claude training is shaped around the tools your company has approved. The aim is not to memorise one interface. It is to learn how to brief a model, supply useful context, judge the result and turn a repeatable task into a governed workflow.",
  },
  {
    question: "What does AI enablement for an operations team include?",
    answer:
      "It starts with one real operational process. We map the handoffs, identify repeated effort, define where judgement stays human and use those findings in the live training. The team leaves with a ranked backlog and a first 30-day plan, not a generic prompt library.",
  },
  {
    question: "Can the engagement combine an AI audit and training workshop?",
    answer:
      "Yes. The work audit supplies the examples and priorities for the training workshop. That makes the session specific to the company and gives the team a practical backlog to use afterwards. A deeper fixed-scope Grain Audit is also available when one process needs a full map and 90-day plan.",
  },
  {
    question: "What do participants receive after the session?",
    answer:
      "Participants receive the working materials used in the session, including the process worksheet, review crib sheet, quality test, glossary and landing plan. The exact pack is adapted to the team and the company's language.",
  },
];

const TRAINING_METHOD_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How Deepgrain runs AI training for business teams",
  description:
    "A four-step company AI training method: audit the work, run a tailored session, leave reusable collateral, and land the change in 30 days.",
  totalTime: "P30D",
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: step.body,
    url: `https://www.deepgrain.ai/ai-training-for-business-teams#step-${index + 1}`,
  })),
};

const TRAINING_KEYWORDS = [
  "AI training for commercial teams",
  "AI enablement for operations teams",
  "Claude training for business teams",
  "ChatGPT and Claude training for companies",
  "AI audit and training workshop for companies",
  "AI training for business teams",
];

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI training for business teams",
  serviceType: "AI audit and training workshop",
  keywords: TRAINING_KEYWORDS.join(", "),
  description:
    "Practical ChatGPT and Claude training for commercial and operations teams, built around a work audit, tailored session, reusable collateral and 30-day landing plan.",
  provider: { "@id": "https://www.deepgrain.ai/#organization" },
  areaServed: "Worldwide",
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Commercial, operations, customer, marketing, finance and People teams",
  },
};

const BusinessTeamAITraining = () => (
  <>
    <PageMeta
      title="AI Training for Business Teams | Deepgrain"
      description="Practical ChatGPT and Claude training for commercial and operations teams: work audit, tailored session, reusable tools and a 30-day landing plan."
      image="https://www.deepgrain.ai/og-enablement.png"
      path="/ai-training-for-business-teams"
      keywords={TRAINING_KEYWORDS}
      jsonLd={[
        SERVICE_LD,
        TRAINING_METHOD_LD,
        buildFAQLd(faqItems),
        buildBreadcrumbLd([
          { name: "Home", url: "https://www.deepgrain.ai/" },
          { name: "AI training for business teams", url: "https://www.deepgrain.ai/ai-training-for-business-teams" },
        ]),
      ]}
    />

    <section className="relative bg-green text-cream overflow-hidden" data-no-rule>
      <TopoBackdrop variant="ridge" opacity={0.2} />
      <div className="relative z-10 container-grain pt-24 pb-20 md:pt-36 md:pb-28">
        <SectionEyebrow className="mb-9">AI training for commercial teams</SectionEyebrow>
        <h1 className="font-display font-semibold max-w-5xl text-5xl md:text-7xl lg:text-[80px] leading-[1.03] text-balance">
          AI training built around the work your team already owns.
        </h1>
        <p className="mt-8 max-w-3xl text-cream/85 text-lg md:text-xl leading-relaxed">
          Practical ChatGPT and Claude training for business teams. We audit the work, run a
          tailored session, leave reusable tools and set a 30-day landing plan so the learning
          moves into actual use.
        </p>
        <div className="mt-11 flex flex-wrap items-center gap-5">
          <PillButton
            href="/contact?subject=I'd%20like%20to%20discuss%20AI%20training%20for%20our%20team%3A%20#write"
            variant="filled"
            cta="business_ai_training_hero"
            ctaLocation="business_ai_training_hero"
            className="bg-brass text-walnut hover:bg-brass/90 shadow-none"
          >
            Discuss your team →
          </PillButton>
          <Link to="/grain-audit" className="text-sm text-cream/75 underline underline-offset-4 decoration-brass hover:text-cream">
            Need a deeper process audit first? →
          </Link>
        </div>
      </div>
      <GrainFlow className="absolute inset-x-0 -bottom-4 h-36" tone="walnut" opacity={0.12} />
    </section>

    <section className="bg-linen text-walnut" data-no-rule>
      <div className="container-grain py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="h-px w-10 bg-brass/40 mb-9" />
          <h2 className="font-display font-semibold text-4xl md:text-6xl leading-tight">The workshop is the middle, not the whole intervention.</h2>
          <p className="mt-6 text-body/80 text-lg leading-relaxed">
            Generic AI training starts with features and ends with inspiration. This starts by
            finding where the hours go. The live session then uses examples people recognise, and
            the landing plan gives each team a first action, an owner and a date.
          </p>
        </div>
        <div className="mt-16">
          {steps.map((step) => (
            <article id={`step-${Number(step.n)}`} key={step.n} className="grid md:grid-cols-[5rem_minmax(0,1fr)] gap-4 md:gap-10 border-t border-walnut/15 py-9 scroll-mt-32">
              <span className="font-display text-3xl text-brass">{step.n}</span>
              <div className="max-w-3xl">
                <h3 className="font-display font-semibold text-3xl">{step.title}</h3>
                <p className="mt-3 text-body/80 text-[17px] leading-relaxed">{step.body}</p>
              </div>
            </article>
          ))}
          <div className="border-t border-walnut/15" />
        </div>
      </div>
    </section>

    <section className="relative bg-bark text-cream overflow-hidden" data-no-rule>
      <BarkGrain />
      <div className="relative z-10 container-grain py-20 md:py-28">
        <SectionEyebrow className="mb-8">One method, different work</SectionEyebrow>
        <h2 className="font-display font-semibold max-w-4xl text-4xl md:text-6xl leading-tight">
          AI enablement for operations teams and the functions beside them.
        </h2>
        <p className="mt-6 max-w-3xl text-cream/75 text-lg leading-relaxed">
          The training surface applies across commercial functions. The useful examples do not.
          Each session is rebuilt around the process, constraints and approved tools of the team in
          the room.
        </p>
        <div className="mt-14 grid md:grid-cols-2 gap-px bg-cream/15">
          {teamExamples.map((team) => (
            <article key={team.title} className="bg-bark p-7 md:p-10">
              <h3 className="font-display font-semibold text-cream text-3xl">{team.title}</h3>
              <p className="mt-4 text-cream/70 text-[16px] leading-relaxed">{team.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-linen text-walnut" data-no-rule>
      <div className="container-grain py-20 md:py-28">
        <div className="h-px w-10 bg-brass/40 mb-9" />
        <p className="text-[11px] uppercase text-brass font-semibold" style={{ letterSpacing: "0.16em" }}>Evidence from the work</p>
        <h2 className="font-display font-semibold max-w-4xl text-4xl md:text-6xl leading-tight mt-4">Training counts when a team ships.</h2>
        <div className="mt-12 grid md:grid-cols-2 gap-px bg-walnut/15">
          <article className="bg-linen p-7 md:p-10">
            <p className="font-display text-5xl text-brass">5 tools</p>
            <h3 className="font-display font-semibold text-2xl mt-5">Financial data and analytics</h3>
            <p className="mt-3 text-body/80 leading-relaxed">Fifteen people across two timezones moved from prompt fluency to five production tools in seven weeks. Five squads, one owned solution each.</p>
          </article>
          <article className="bg-linen p-7 md:p-10">
            <p className="font-display text-5xl text-brass">£40k retired</p>
            <h3 className="font-display font-semibold text-2xl mt-5">Transit technology</h3>
            <p className="mt-3 text-body/80 leading-relaxed">Forty people were enabled in the first wave, one production tool shipped, and two internal builders were left able to maintain and extend it.</p>
          </article>
        </div>
        <p className="mt-8 text-sm text-walnut/65">Read the full anonymised before-and-after evidence in <Link to="/work" className="text-brass underline underline-offset-4">Deepgrain's client work</Link>.</p>
      </div>
    </section>

    <section className="bg-linen text-walnut" data-no-rule>
      <div className="container-grain py-20 md:py-28 border-t border-walnut/10">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12 lg:gap-24 items-start">
          <div>
            <div className="h-px w-10 bg-brass/40 mb-9" />
            <h2 className="font-display font-semibold text-4xl md:text-6xl leading-tight">What good looks like after 30 days</h2>
            <p className="mt-6 text-body/80 text-lg leading-relaxed">
              People are using a shared method on real work. A named owner has moved at least one
              item from the audit into practice. The team can show how it reviews quality, where
              human judgement stays and what it will build next.
            </p>
          </div>
          <div className="border-l-4 border-brass pl-7 md:pl-10">
            <p className="font-display italic text-2xl md:text-3xl leading-snug">
              The test is not whether people enjoyed the session. It is whether the work changed.
            </p>
            <p className="mt-6 text-body/75 leading-relaxed">
              For a longer build and champion model, see <Link to="/enablement" className="text-brass underline underline-offset-4">how Deepgrain embeds capability</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>

    <FAQ heading="Questions about AI training for business teams" items={faqItems} />

    <section className="relative bg-green text-cream overflow-hidden" data-no-rule>
      <TopoBackdrop variant="basin" opacity={0.18} />
      <div className="relative z-10 container-grain py-20 md:py-28 text-center">
        <h2 className="font-display font-semibold text-4xl md:text-6xl">Start with the work.</h2>
        <p className="mt-5 mx-auto max-w-2xl text-cream/75 text-lg leading-relaxed">
          Tell us which team is in the room, which tools are approved and where the work keeps getting stuck.
        </p>
        <div className="mt-9 flex justify-center">
          <PillButton
            href="/contact?subject=I'd%20like%20to%20discuss%20AI%20training%20for%20our%20team%3A%20#write"
            variant="filled"
            cta="business_ai_training_footer"
            ctaLocation="business_ai_training_footer"
            className="bg-brass text-walnut hover:bg-brass/90 shadow-none"
          >
            Discuss your team →
          </PillButton>
        </div>
      </div>
    </section>
  </>
);

export default BusinessTeamAITraining;
