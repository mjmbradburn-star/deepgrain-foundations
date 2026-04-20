import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";
import { BrassRule } from "@/components/ui/BrassRule";
import { PageMeta } from "@/components/seo/PageMeta";
import { Invitation } from "@/components/sections/Invitation";

const upskilled = [
  {
    title: "Fluency",
    body: "Everyone in the function can brief, run, and judge an agent. The day-to-day stops feeling foreign.",
  },
  {
    title: "Craft",
    body: "Three to four champions can design, ship, and maintain workflows. They become the team's internal builders.",
  },
  {
    title: "Practice",
    body: "The team holds the capability after we leave. New joiners learn the craft from colleagues, not a deck.",
  },
];

const championNeeds = [
  {
    label: "Air cover",
    body: "A named exec sponsor and a defined slice of the week — twenty per cent floor — protected from the next crisis.",
  },
  {
    label: "Tools & budget",
    body: "One workflow tool, an LLM provider with the right terms, a small monthly budget with no procurement friction.",
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
    body: "Diagnosing where agents belong — and where human judgment must stay.",
    duration: "Half day",
  },
  {
    n: "02",
    title: "Briefing agents",
    body: "Prompts as specifications. Writing for a system that has to act, not just answer.",
    duration: "1 week",
  },
  {
    n: "03",
    title: "Wiring workflows",
    body: "Tools, triggers, handoffs. Building the plumbing that makes an agent useful in the team's actual day.",
    duration: "2 weeks",
  },
  {
    n: "04",
    title: "Governance & trust",
    body: "What stays human, what gets reviewed, what gets logged. The patterns that keep the work safe.",
    duration: "1 week",
  },
  {
    n: "05",
    title: "Measuring value",
    body: "Hours reclaimed, judgment freed, capability gained. Telling a real story about what changed.",
    duration: "Half day",
  },
  {
    n: "06",
    title: "Sustaining the practice",
    body: "Running the champion circle after we leave. Reviewing each other's work. Training the next champion.",
    duration: "Ongoing",
  },
];

const outcomes = [
  "A trained champion circle of three to four people inside the function.",
  "Eight to twelve production workflows, owned by the teams that use them.",
  "A governance pattern your team understands, applies, and can defend.",
  "A capability that compounds — extended into corners we never touched.",
];

const Enablement = () => (
  <>
    <PageMeta
      title="Enablement — Coaching, champions, lasting capability | Deepgrain"
      description="What 'people upskilled' actually means inside a Deepgrain engagement. The coaching curriculum, the champion model, and the capability your team holds after we leave."
      path="/enablement"
    />

    {/* Hero */}
    <section className="bg-green text-cream section-pad pt-40">
      <div className="container-grain max-w-4xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-6">Enablement</Eyebrow>
          <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[96px] leading-[1.02] text-balance">
            We don&apos;t replace your team. We grow it.
          </h1>
          <p className="mt-10 max-w-2xl text-cream/80 text-lg leading-relaxed">
            Deepgrain engagements pair agents with people from day one. The agents
            take the repeatable, low-judgment work. The people are coached to design,
            run, and extend those agents — your champions. The capability stays in
            the team, not in a vendor.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* What "people upskilled" means */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain">
        <ScrollReveal>
          <div className="max-w-3xl">
            <Eyebrow className="text-brass mb-4">People upskilled</Eyebrow>
            <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
              What the metric actually means.
            </h2>
            <p className="mt-8 text-body/85 text-lg leading-relaxed">
              When we report &ldquo;people upskilled&rdquo; at the end of an engagement,
              we mean three things at once. Not certificates. Not seat licences.
              A change in what the team can do without us in the room.
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
                You don&apos;t need engineers. You need three or four champions.
              </h2>
              <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
                <p>
                  A champion is someone already inside the team — a senior coordinator,
                  a People Partner, an Ops lead — who has deep tacit knowledge of how
                  the work flows and genuine curiosity about wiring things together.
                  Not engineers. Not new hires. People you already pay, given a
                  different mandate.
                </p>
                <p>
                  This works because of grain. The champion already knows where the
                  friction is — they live in it. They know which approvals are theatre
                  and which handoffs drop information. An engineer would have to
                  discover all of that. The champion starts with it.
                </p>
                <p>
                  Three or four champions, distributed across the function, give you
                  something a single builder can&apos;t: review, shared patterns,
                  cover when one is buried, and the nucleus of a real practice.
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
              Six modules. Delivered alongside the build.
            </h2>
            <p className="mt-8 text-body/85 text-lg leading-relaxed">
              The curriculum runs in parallel with shipping real workflows. No
              classroom phase. People learn the craft on their own systems, with
              their own data, on problems they already wanted to solve.
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
    <section className="bg-walnut text-cream section-pad">
      <div className="container-grain">
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
            Two months after the engagement ends, the champions are still building.
            They have extended the work into places we never touched. That is the
            test. Not what you have on day one — what you still have, and what you
            have added, six months on.
          </p>
          <div className="mt-12">
            <PillButton href="/intelligence/the-champion-model" variant="outline">
              Read the champion model →
            </PillButton>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <Invitation />
  </>
);

export default Enablement;
