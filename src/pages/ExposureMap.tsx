import { useState } from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/seo/PageMeta";
import { BarkGrain } from "@/components/ui/BarkGrain";
import { GrainFlow } from "@/components/ui/GrainFlow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { track } from "@/lib/analytics";
import {
  EXPOSURE_ROLES,
  LAYER_LABELS,
  TOTAL_HOURS,
  roleAverage,
  scoreColour,
} from "@/data/exposureMap";

const EXPOSURE_LD = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "The People Ops AI Exposure Map",
  description:
    "People Ops roles and their component tasks scored 0-10 for AI exposure. Exposure is judged at task level: every role splits into work that automates and judgment that compounds.",
  creator: { "@id": "https://deepgrain.ai/#organization" },
  license: "https://deepgrain.ai/terms",
};

const INSIGHTS = [
  {
    title: "Read the low scores first",
    body: "Tasks scoring 0 to 3 are where the human value concentrates: judgment calls, trust, hard conversations. These grow in value as everything around them speeds up.",
  },
  {
    title: "The high scores are capacity",
    body: "Tasks scoring 7 and above are not headcount cuts. They are the hours a team gets back to spend on the low-scoring column. Cutting the people who hold the judgment is how AI adoption fails.",
  },
  {
    title: "Exposure is not adoption",
    body: "These scores are what current tooling can reliably do with proper setup and verification, not what your team does today. Most teams capture a fraction of this. That gap is the readiness question.",
  },
];

const ExposureMap = () => {
  const [selected, setSelected] = useState(0);
  const role = EXPOSURE_ROLES[selected];
  const sortedTasks = [...role.tasks].sort((a, b) => b.score - a.score);
  const automates = role.tasks.filter((t) => t.score >= 7).length;
  const judgment = role.tasks.filter((t) => t.score <= 3).length;

  const selectRole = (i: number) => {
    setSelected(i);
    track("exposure_map_role", { role: EXPOSURE_ROLES[i].role });
  };

  return (
    <>
      <PageMeta
        title="The People Ops AI Exposure Map | Deepgrain"
        description="Every People role scored for AI exposure at task level, not job level. See which work automates, which judgment compounds, and which capability layer unlocks each."
        path="/exposure-map"
        jsonLd={EXPOSURE_LD}
      />

      {/* ------------------------------------------------ intro ---------- */}
      <section className="relative bg-linen text-walnut overflow-hidden" data-no-rule>
        <TopoBackdrop variant="ridge" opacity={0.14} />
        <div className="relative container-grain pt-24 pb-16 md:pt-36 md:pb-24">
          <div className="fade-in-up">
            <SectionEyebrow tone="linen" className="mb-10">
              Interactive reference
            </SectionEyebrow>
            <h1
              className="font-display font-semibold max-w-4xl"
              style={{
                fontSize: "clamp(40px, 6vw, 84px)",
                lineHeight: 1.03,
                letterSpacing: "-0.01em",
              }}
            >
              The People Ops AI Exposure Map
            </h1>
          </div>
          <div className="fade-in-up fade-in-up-2 grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 lg:gap-24 items-end mt-10">
            <p
              className="font-display italic text-walnut/75"
              style={{ fontSize: "clamp(22px, 2.8vw, 32px)", lineHeight: 1.3 }}
            >
              Every chart you have seen scores whole jobs. Jobs are the wrong unit.
            </p>
            <p className="text-body text-lg leading-relaxed">
              Exposure lives at task level: every People role splits into work that automates
              and judgment that compounds. Select a role to see its tasks.
            </p>
          </div>
        </div>
        <GrainFlow className="absolute inset-x-0 -bottom-4 h-36" tone="walnut" opacity={0.12} />
      </section>

      {/* ------------------------------------------------ map ------------ */}
      <section className="bg-linen text-walnut" data-no-rule>
        <div className="container-grain pt-10 pb-24 md:pb-36">
          <ScrollReveal>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-9">
              {EXPOSURE_ROLES.map((r, i) => {
                const avg = roleAverage(r);
                const active = i === selected;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => selectRole(i)}
                    aria-pressed={active}
                    className={`rounded-2xl px-5 py-6 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                      active
                        ? "bg-green text-cream ring-1 ring-brass/30 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)]"
                        : "bg-linen ring-1 ring-walnut/15 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]"
                    }`}
                    style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)" }}
                  >
                    <span
                      className={`font-display font-semibold text-3xl block leading-none ${
                        active ? "text-brass" : "text-walnut"
                      }`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {avg.toFixed(1)}
                    </span>
                    <span
                      className={`font-sans font-semibold uppercase block mt-3.5 leading-snug ${
                        active ? "text-cream" : "text-walnut/75"
                      }`}
                      style={{ fontSize: "11px", letterSpacing: "0.14em" }}
                    >
                      {r.role}
                    </span>
                    <span
                      className={`font-sans block mt-1.5 ${active ? "text-cream/50" : "text-walnut/45"}`}
                      style={{ fontSize: "10px", letterSpacing: "0.1em" }}
                    >
                      ~{Math.round((r.hours / TOTAL_HOURS) * 100)}% OF HOURS
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          <div className="mt-20 md:mt-28">
            <div className="h-px w-10 bg-brass/30 mb-10" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <h2
                className="font-display font-semibold"
                style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-0.01em" }}
              >
                {role.role}
              </h2>
              <p
                className="font-sans font-semibold uppercase text-walnut/55"
                style={{ fontSize: "12px", letterSpacing: "0.2em" }}
              >
                {automates} automate · {judgment} compound
              </p>
            </div>

            <div className="mt-10">
              {sortedTasks.map((t) => (
                <div
                  key={t.name}
                  className="grid grid-cols-1 md:grid-cols-[minmax(0,2.2fr)_minmax(0,2fr)_5rem] items-center gap-x-12 gap-y-2 border-b border-walnut/15 py-6"
                >
                  <div>
                    <p className="text-walnut font-medium text-[17px] leading-snug">
                      {t.name}
                      <span
                        className="ml-3 inline-block rounded-full border border-walnut/25 px-2.5 py-0.5 font-sans font-semibold uppercase text-walnut/55 align-[2px]"
                        style={{ fontSize: "9px", letterSpacing: "0.12em" }}
                      >
                        {LAYER_LABELS[t.layer]}
                      </span>
                    </p>
                    <p className="text-body/70 text-[15px] leading-snug mt-1.5">{t.note}</p>
                  </div>
                  <div className="h-px bg-walnut/15 relative" aria-hidden>
                    <div
                      className="absolute left-0 -top-px h-[3px]"
                      style={{ width: `${t.score * 10}%`, background: scoreColour(t.score) }}
                    />
                  </div>
                  <p
                    className="font-display font-semibold text-walnut text-xl md:text-right"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {t.score}
                    <span className="text-walnut/40 text-sm"> /10</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ScrollReveal delay={100}>
            <div className="relative mt-24 md:mt-32 bg-walnut/92 backdrop-blur-sm rounded-[48px] md:rounded-[80px] p-10 md:p-16 lg:p-20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] border border-brass/20 overflow-hidden">
              <GrainFlow className="absolute inset-x-0 -top-8 h-44" opacity={0.1} />
              <div className="relative grid gap-12 md:grid-cols-3 md:gap-14">
                {INSIGHTS.map((card, i) => (
                  <div key={card.title}>
                    <span
                      className="font-display font-semibold text-brass/60 text-2xl block"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      0{i + 1}
                    </span>
                    <h3 className="font-display font-semibold text-cream text-2xl leading-tight mt-4">
                      {card.title}
                    </h3>
                    <p className="text-cream/70 mt-4 text-[15px] leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <p className="mt-20 text-walnut/50 text-sm max-w-3xl leading-relaxed">
            Methodology: task inventories from twenty years inside People functions across seven
            sectors. Scores rate what frontier models plus workflow tooling reliably produce
            with proper context and a verification step, judged per task rather than per role.
            Argue with them, that is what they are for.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ cta ------------ */}
      <section className="relative bg-bark text-cream overflow-hidden" data-no-rule>
        <BarkGrain />
        <TopoBackdrop variant="ridge" opacity={0.18} className="z-[1]" />
        <GrainFlow className="absolute inset-x-0 -top-6 h-40 z-[2]" opacity={0.14} />
        <div className="relative z-10 container-grain section-pad">
          <ScrollReveal>
            <SectionEyebrow className="mb-10">The next question</SectionEyebrow>
            <h2
              className="font-display font-semibold max-w-3xl"
              style={{
                fontSize: "clamp(32px, 4.5vw, 64px)",
                letterSpacing: "-0.01em",
                lineHeight: 1.05,
              }}
            >
              Where is your team on this map?
            </h2>
            <p className="text-cream/75 mt-8 max-w-xl text-lg leading-relaxed">
              The readiness assessment scores your function in eight minutes: one honest number,
              the gaps, and what to do about each. Built to be forwarded to your CEO.
            </p>
            <div className="mt-12">
              <Link
                to="/readiness"
                onClick={() =>
                  track("cta_click", {
                    cta_id: "readiness_from_exposure_map",
                    cta_location: "exposure_map_footer",
                    cta_label: "Take the readiness assessment",
                    link_url: "/readiness",
                  })
                }
                className="group inline-flex items-center gap-2 rounded-full bg-cream text-green px-8 py-4 font-sans text-sm tracking-wider transition-all duration-300 hover:bg-cream/90"
              >
                Take the readiness assessment
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default ExposureMap;
