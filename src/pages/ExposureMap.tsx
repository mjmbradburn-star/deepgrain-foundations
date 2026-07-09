import { useState } from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/seo/PageMeta";
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
      <section className="bg-cream text-walnut" data-no-rule>
        <div className="container-grain py-16 md:py-24">
          <span
            className="font-sans uppercase text-walnut/50"
            style={{ fontSize: "11px", letterSpacing: "0.25em" }}
          >
            Interactive reference
          </span>
          <h1 className="font-display font-medium leading-[1.02] mt-4 text-[2.2rem] sm:text-5xl md:text-[3.6rem] max-w-3xl">
            The People Ops AI Exposure Map
          </h1>
          <p className="font-display italic text-walnut/75 mt-5 max-w-2xl text-lg md:text-xl leading-snug">
            Every chart you have seen scores whole jobs. Jobs are the wrong unit. Exposure
            lives at task level: every People role splits into work that automates and
            judgment that compounds. Select a role to see its tasks.
          </p>

          <div
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans uppercase text-walnut/50"
            style={{ fontSize: "10px", letterSpacing: "0.15em" }}
          >
            <span className="inline-flex items-center gap-2">
              0 · judgment
              <span
                aria-hidden
                className="inline-block h-2.5 w-32 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, hsl(140 20% 62%), hsl(85 30% 66%), hsl(42 55% 52%), hsl(28 60% 40%))",
                }}
              />
              10 · automates
            </span>
            <span>Tile shows the role's average · width reflects share of team hours</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {EXPOSURE_ROLES.map((r, i) => {
              const avg = roleAverage(r);
              const active = i === selected;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => selectRole(i)}
                  className={`grow rounded-md border px-4 py-3 text-left transition-all ${
                    active
                      ? "border-walnut bg-walnut text-cream"
                      : "border-walnut/20 bg-white/60 hover:border-walnut/50"
                  }`}
                  style={{ flexBasis: `${r.hours * 22}px` }}
                >
                  <span className="font-display block text-lg leading-tight">{r.role}</span>
                  <span
                    className={`font-sans block mt-0.5 ${active ? "text-cream/60" : "text-walnut/50"}`}
                    style={{ fontSize: "10px", letterSpacing: "0.1em" }}
                  >
                    {r.tasks.length} TASKS · ~{Math.round((r.hours / TOTAL_HOURS) * 100)}% OF HOURS
                  </span>
                  <span
                    className="mt-2 inline-block rounded px-2 py-0.5 font-sans text-xs font-semibold text-white"
                    style={{ background: scoreColour(avg) }}
                  >
                    {avg.toFixed(1)} / 10
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 border-t-2 border-walnut/80 pt-6">
            <h2 className="font-display font-medium text-3xl md:text-4xl">{role.role}</h2>
            <p className="text-walnut/60 mt-1 text-sm">
              {automates} task{automates === 1 ? "" : "s"} ready to automate · {judgment} where
              human judgment compounds · tags show which capability layer unlocks each
            </p>
            <div className="mt-4">
              {sortedTasks.map((t) => (
                <div
                  key={t.name}
                  className="grid grid-cols-1 md:grid-cols-[minmax(14rem,20rem)_1fr_4.5rem] items-center gap-x-4 gap-y-1 border-b border-walnut/15 py-3"
                >
                  <div>
                    <span className="font-medium text-[0.94rem]">{t.name}</span>
                    <span
                      className="ml-2 inline-block rounded-full border border-walnut/30 px-2 py-px font-sans align-[1px] text-walnut/55"
                      style={{ fontSize: "9px", letterSpacing: "0.08em" }}
                    >
                      {LAYER_LABELS[t.layer].toUpperCase()}
                    </span>
                    <p className="text-walnut/55 text-[0.82rem] leading-snug mt-0.5">{t.note}</p>
                  </div>
                  <div className="h-2 rounded-full bg-walnut/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${t.score * 10}%`, background: scoreColour(t.score) }}
                    />
                  </div>
                  <span className="font-sans text-walnut/70 text-xs md:text-right">
                    {t.score} / 10
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-md bg-white/70 border border-walnut/15 p-5">
              <h3 className="font-medium text-[0.98rem]">Read the low scores first</h3>
              <p className="text-walnut/65 mt-1.5 text-sm leading-relaxed">
                Tasks scoring 0 to 3 are where the human value concentrates: judgment calls,
                trust, hard conversations. These grow in value as everything around them speeds
                up.
              </p>
            </div>
            <div className="rounded-md bg-white/70 border border-walnut/15 p-5">
              <h3 className="font-medium text-[0.98rem]">The high scores are capacity</h3>
              <p className="text-walnut/65 mt-1.5 text-sm leading-relaxed">
                Tasks scoring 7 and above are not headcount cuts. They are the hours a team
                gets back to spend on the low-scoring column. Cutting the people who hold the
                judgment is how AI adoption fails.
              </p>
            </div>
            <div className="rounded-md bg-white/70 border border-walnut/15 p-5">
              <h3 className="font-medium text-[0.98rem]">Exposure is not adoption</h3>
              <p className="text-walnut/65 mt-1.5 text-sm leading-relaxed">
                These scores are what current tooling can reliably do with proper setup and
                verification, not what your team does today. Most teams capture a fraction of
                this. That gap is the readiness question.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bark text-cream" data-no-rule>
        <div className="container-grain py-14 md:py-20">
          <h2 className="font-display font-medium text-3xl md:text-4xl max-w-2xl">
            Where is your team on this map?
          </h2>
          <p className="text-cream/70 mt-3 max-w-xl text-[0.95rem] leading-relaxed">
            The readiness assessment scores your function in eight minutes: one honest number,
            the gaps, and what to do about each. Built to be forwarded to your CEO.
          </p>
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
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-cream text-green px-7 py-3.5 font-sans text-sm tracking-wider hover:bg-cream/90 transition-all"
          >
            Take the readiness assessment
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <p
            className="mt-10 font-sans uppercase text-cream/35"
            style={{ fontSize: "10px", letterSpacing: "0.2em" }}
          >
            Methodology: task inventories from twenty years inside People functions across
            seven sectors. Scores rate what frontier models plus workflow tooling reliably
            produce with proper context and verification, judged per task. Argue with them,
            that is what they are for.
          </p>
        </div>
      </section>
    </>
  );
};

export default ExposureMap;
