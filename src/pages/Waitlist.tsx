import { PageMeta } from "@/components/seo/PageMeta";
import { EmailCapture } from "@/components/forms/EmailCapture";
import { FAQ, buildFAQLd, type FAQItem } from "@/components/sections/FAQ";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { GrainFlow } from "@/components/ui/GrainFlow";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";

const COURSE_LD = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "The Deepgrain AI Cohort for People Teams",
  description:
    "Four weeks, live, for People and HR operators in scaling companies. Map your function, learn to prompt like an operator, ship three working automations on your own processes, and leave with a one-page 90-day rollout plan. Successor to AI Powered People Ops, taught by Matt Bradburn.",
  provider: {
    "@type": "Organization",
    name: "Deepgrain",
    sameAs: "https://www.deepgrain.ai",
  },
  offers: {
    "@type": "Offer",
    price: "495",
    priceCurrency: "GBP",
    category: "Waitlist",
    availability: "https://schema.org/PreOrder",
  },
};

const PAINS = [
  {
    quote: "We bought the licences. Nobody uses them.",
    body: "Seats rolled out to the whole function, a launch email, a training video. Three months later the only thing that changed is the invoice. Capability without context does not survive a busy week.",
  },
  {
    quote: "The pilot worked. The rollout didn't.",
    body: "One keen person built something clever in a sandbox. It never touched a real process, it had no owner, and it died the week they went on leave. Built for demo, not production.",
  },
  {
    quote: "Everyone is dabbling. Nobody is building.",
    body: "Your team uses AI in private, unevenly, with no shared standard and no governance. The gap between your best prompter and everyone else widens every month, and nothing compounds.",
  },
];

const WEEKS = [
  {
    numeral: "1.0 MAP",
    title: "Score your own function",
    body: "Map your core People processes end to end, score every automation candidate on impact against effort, and leave week one with a ranked automation map of your function. No theory: your processes, your hours, your map.",
  },
  {
    numeral: "2.0 PROMPT",
    title: "Prompt like an operator",
    body: "Briefs, context packs, and evaluation habits that turn a model into a reliable colleague. Reps on your real work, not toy examples, until the output is something you would sign your name to.",
  },
  {
    numeral: "3.0 BUILD",
    title: "Ship three working automations",
    body: "Built live in the sessions, on your own processes, in your own stack. Each one tested against real volume before the week ends. If it does not run, it does not count.",
  },
  {
    numeral: "4.0 PROVE",
    title: "Prove it, then plan the rollout",
    body: "Measure the hours returned, write your one-page 90-day rollout plan, and take both to your leadership. You leave with evidence, not intentions.",
  },
];

const TAKEAWAYS = [
  {
    title: "Three working automations",
    body: "Live on your own processes, built by you, tested against real volume. Not prototypes. Running.",
  },
  {
    title: "A scored automation map",
    body: "Every core process in your function, mapped and ranked on impact against effort. Your build order for the next year.",
  },
  {
    title: "Prompt-and-build skills",
    body: "Briefs, context packs, and evaluation habits that stay with your team long after the cohort ends.",
  },
  {
    title: "A one-page 90-day plan",
    body: "The rollout, written down: what ships first, second, third, and what each one returns. Ready to put in front of leadership.",
  },
];

const faqItems: FAQItem[] = [
  {
    question: "Who is the cohort for?",
    answer:
      "People and HR operators in scaling companies: Heads of People, People Ops leads, HRBPs, and People team generalists who own processes and want to automate them. No technical background needed. If you can describe a process, you can build on it.",
  },
  {
    question: "How much time does it take each week?",
    answer:
      "One live session a week plus build time on your own processes, roughly three to four hours in total. The build time is the course: you ship real automations on real work, so the hours come back.",
  },
  {
    question: "What tools do we use?",
    answer:
      "The current generation of AI tools for operators, chosen to fit what scaling companies already run. If your company has approved tools, we build inside them.",
  },
  {
    question: "What if I miss a session?",
    answer:
      "Every session is recorded and you keep the materials. The build work carries across weeks, so you can catch up without losing the thread.",
  },
  {
    question: "What does joining the waitlist commit me to?",
    answer:
      "Nothing. It means you hear first when seats open, and waitlist members pay £495 instead of the full £695. Alumni of the original course get 48 hours at the waitlist price before public launch.",
  },
  {
    question: "When does it start, and how many seats are there?",
    answer:
      "Monday 12 October, live, four weeks. Twenty seats, because the build work is reviewed by hand.",
  },
];

const PROOF = ["Rimes", "Systemiq", "Masabi", "Skylo"];

const Waitlist = () => {
  return (
    <>
      <PageMeta
        title="Deepgrain AI Cohort for Commercial Functions"
        description="Four weeks live for operators across Finance, Sales, Marketing, Operations, Customer and People. Ship three working AI workflows and a 90-day plan."
        path="/waitlist"
        jsonLd={[COURSE_LD, buildFAQLd(faqItems)]}
      />

      {/* ------------------------------------------------ hero ----------- */}
      <section className="relative bg-green text-cream overflow-hidden" data-no-rule>
        <div className="relative container-grain pt-24 pb-16 md:pt-36 md:pb-24">
          <div className="fade-in-up">
            <SectionEyebrow className="mb-10">
              The Deepgrain AI Cohort for People Teams
            </SectionEyebrow>
            <h1
              className="font-display font-semibold max-w-4xl"
              style={{
                fontSize: "clamp(34px, 5vw, 64px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              Everyone told your People team to use AI. Nobody showed them how.
            </h1>
          </div>
          <div className="fade-in-up fade-in-up-2 mt-10 max-w-2xl">
            <p className="text-cream/85 text-lg md:text-xl leading-relaxed">
              Four weeks, live, for People and HR operators in scaling companies. Successor to AI
              Powered People Ops, rebuilt for this year's tools, taught by Matt Bradburn. The
              waitlist hears first, and pays less.
            </p>
            <p
              className="mt-6 font-sans font-semibold uppercase text-brass"
              style={{ fontSize: "11px", letterSpacing: "0.22em" }}
            >
              Starts Monday 12 October · 20 seats · £495 waitlist price (full £695)
            </p>
          </div>
          <div id="join" className="fade-in-up fade-in-up-3 mt-12 max-w-2xl scroll-mt-28">
            <EmailCapture
              source="course-waitlist"
              variant="dark"
              heading="Join the waitlist"
              description="Waitlist members hear first when seats open. Alumni get 48 hours at £495 before public launch."
            />
          </div>
        </div>
        <GrainFlow className="absolute inset-x-0 -bottom-4 h-36" tone="walnut" opacity={0.12} />
      </section>

      {/* ------------------------------------------------ pain ----------- */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain py-20 md:py-28">
          <div className="h-px w-10 bg-brass/30 mb-10" />
          <h2
            className="font-display font-semibold max-w-3xl"
            style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
          >
            Sound familiar?
          </h2>
          <div className="mt-14 grid gap-px md:grid-cols-3 bg-walnut/15">
            {PAINS.map((p) => (
              <div key={p.quote} className="bg-linen px-2 py-8 md:px-8 md:py-10">
                <p className="font-display font-semibold text-walnut text-2xl md:text-[28px] leading-snug">
                  &ldquo;{p.quote}&rdquo;
                </p>
                <p className="text-body/80 text-[16px] leading-relaxed mt-4">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-body/80 text-lg leading-relaxed">
            None of these are tool problems. They are capability problems, and capability is
            teachable. That is what the four weeks are for.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ curriculum ----- */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain pb-24 md:pb-36">
          <div className="h-px w-10 bg-brass/30 mb-10" />
          <h2
            className="font-display font-semibold max-w-3xl"
            style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
          >
            Four weeks. Built on your own work.
          </h2>
          <p className="text-body/80 text-lg leading-relaxed max-w-2xl mt-6">
            One live session a week. Everything you build runs on your own processes, so the course
            pays for itself before it ends.
          </p>

          <div className="mt-14">
            {WEEKS.map((w) => (
              <div key={w.numeral} className="border-t-4 border-walnut py-10 md:py-12">
                <div className="max-w-3xl">
                  <h3 className="font-mono text-sm tracking-wider text-walnut/60 mb-4">
                    {w.numeral}
                  </h3>
                  <p className="font-display font-semibold text-walnut text-3xl md:text-4xl leading-tight">
                    {w.title}
                  </p>
                  <p className="text-body/80 text-[17px] leading-relaxed mt-4">{w.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ takeaways ------ */}
      <section className="relative bg-bark text-cream overflow-hidden" data-no-rule>
        <BarkGrain />
        <div className="relative z-10 container-grain section-pad">
          <p
            className="font-sans font-semibold uppercase text-brass/80"
            style={{ fontSize: "11px", letterSpacing: "0.22em" }}
          >
            What you leave with
          </p>
          <div className="mt-12 grid gap-px md:grid-cols-2 bg-cream/15">
            {TAKEAWAYS.map((t) => (
              <div key={t.title} className="bg-bark px-2 py-8 md:px-10 md:py-12">
                <h3 className="font-display font-semibold text-cream text-2xl md:text-3xl leading-tight">
                  {t.title}
                </h3>
                <p className="text-cream/75 text-[16px] leading-relaxed mt-3 max-w-md">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ pricing -------- */}
      <section className="relative bg-green text-cream overflow-hidden" data-no-rule>
        <GrainFlow className="absolute inset-x-0 -top-6 h-40 z-[2]" opacity={0.14} />
        <div className="relative z-10 container-grain section-pad">
          <p
            className="font-sans font-semibold uppercase text-brass"
            style={{ fontSize: "11px", letterSpacing: "0.22em" }}
          >
            The waitlist price
          </p>
          <div className="mt-10 flex flex-wrap items-end gap-x-8 gap-y-4">
            <p
              className="font-display font-semibold text-brass leading-none"
              style={{ fontSize: "clamp(64px, 8vw, 110px)" }}
            >
              £495
            </p>
            <p className="font-display text-cream/60 text-3xl md:text-4xl leading-none pb-3 line-through">
              £695
            </p>
          </div>
          <p className="mt-6 max-w-xl text-cream/80 text-lg leading-relaxed">
            Twenty seats, starting Monday 12 October. Waitlist members pay £495 instead of the full
            £695. Alumni of the original course get 48 hours at this price before public launch.
          </p>
          <a
            href="#join"
            className="mt-10 inline-flex items-center justify-center rounded-full font-sans font-medium tracking-wider text-sm bg-cream text-green px-10 py-4 hover:bg-cream/90 transition-colors"
          >
            Join the waitlist →
          </a>
        </div>
      </section>

      {/* ------------------------------------------------ about ---------- */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain py-20 md:py-28">
          <div className="h-px w-10 bg-brass/30 mb-10" />
          <h2
            className="font-display font-semibold max-w-3xl"
            style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
          >
            Built and taught by Matt Bradburn
          </h2>
          <div className="mt-8 max-w-2xl">
            <p className="text-body/85 text-lg leading-relaxed">
              Matt was VP People at Peakon, built and sold People Collective and the DBR community,
              and now runs Deepgrain. The original course, AI Powered People Ops, was rated 4.3 out
              of 5 across 13 reviews. This cohort is its successor, rebuilt for this year's tools.
            </p>
            <p className="mt-6 text-body/80 text-lg leading-relaxed">
              The same operating work, run for:
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-14 gap-y-6">
            {PROOF.map((name) => (
              <span
                key={name}
                className="font-display font-semibold text-walnut/85"
                style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ faq ------------ */}
      <FAQ eyebrow="" heading="Questions, answered" items={faqItems} />

      {/* ------------------------------------------------ final ---------- */}
      <section className="relative bg-bark text-cream overflow-hidden" data-no-rule>
        <BarkGrain />
        <div className="relative z-10 container-grain section-pad">
          <div className="max-w-2xl">
            <h2
              className="font-display font-semibold"
              style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              Twenty seats. The waitlist hears first.
            </h2>
            <p className="mt-6 text-cream/80 text-lg leading-relaxed">
              Joining commits you to nothing. It means you get the date, the seats, and the £495
              price before anyone else.
            </p>
            <div className="mt-10">
              <EmailCapture
                source="course-waitlist"
                variant="dark"
                heading=""
                description=""
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Waitlist;
