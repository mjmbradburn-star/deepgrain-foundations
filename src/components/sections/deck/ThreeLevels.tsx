import { ScrollReveal } from "@/components/ui/ScrollReveal";

export interface Level {
  n: string;
  label: string;
  title: string;
  question: string;
  failure: string;
  resilient: string;
  move?: string;
}

const DEFAULT_LEVELS: Level[] = [
  {
    n: "01",
    label: "Strategic",
    title: "Where the function is going.",
    question: "What does the function look like in three years if AI keeps moving at this rate?",
    failure: "Strategy that ignores the technology shift, or hands it to a vendor.",
    resilient: "Leadership owns the operating direction. AI is a lens on the plan, not a side track.",
    move: "Write the three-year shape on one page. Show it to the team.",
  },
  {
    n: "02",
    label: "Functional",
    title: "Where the work is done.",
    question: "Which workflows compound, which leak, and which are theatre?",
    failure: "Tools pushed at roles. Pilots that never reach production.",
    resilient: "Workflows mapped at the click level. Agents wired to the friction, not the title.",
    move: "Pick one workflow. Map every click. Atomise it.",
  },
  {
    n: "03",
    label: "Individual",
    title: "Where the craft lives.",
    question: "Which people can build, and what stops them?",
    failure: "Mandatory training. Compliance metrics. No one shipping anything.",
    resilient: "Champions inside the function. Air cover, time, and a small starting brief.",
    move: "Name your three champions. Give them a fifth of the week.",
  },
];

/**
 * Method spine, ported from deck slides 5 and 6. Three altitudes,
 * each with the failure-mode and the resilient-posture sat next to it.
 *
 * Stacked, not a hanging two-column row: the level label sits directly above
 * its own title and question rather than pinned in a left rail, so nothing
 * dangles unattached at small widths. The level numerals are dropped
 * entirely (only the Strategic/Functional/Individual labels render) so they
 * never read as a second, competing "01/02/03" against the page's own
 * Read/Craft/Scale ordinals further down /method.
 */
export const ThreeLevels = ({
  levels = DEFAULT_LEVELS,
  showMoves = true,
}: {
  levels?: Level[];
  showMoves?: boolean;
}) => (
  <section className="bg-linen text-walnut section-pad">
    <div className="container-grain">
      <ScrollReveal>
        <h2 className="font-display text-walnut text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl">
          Three levels. You work at all three at once.
        </h2>
        <p className="mt-6 max-w-2xl text-walnut/75 text-lg leading-relaxed">
          A function only becomes resilient when the strategic, the functional and the individual
          are moving together. Most programmes touch one, lean on another, and ignore the third.
        </p>
        <div className="mt-8 h-px w-full bg-brass/40 max-w-4xl" />
      </ScrollReveal>

      <div className="mt-16 md:mt-20 space-y-16 md:space-y-20">
        {levels.map((lv, i) => (
          <ScrollReveal key={lv.n} delay={i * 80}>
            <div className="max-w-3xl">
              <div className="font-display text-walnut text-3xl md:text-4xl">{lv.label}</div>
              <h3 className="mt-3 font-display text-walnut text-2xl md:text-3xl leading-snug">
                {lv.title}
              </h3>
              <p className="mt-4 font-display italic text-brass text-lg md:text-xl max-w-2xl">
                {lv.question}
              </p>

              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-walnut/15 bg-cream/50 p-6">
                  <div
                    className="font-sans uppercase text-walnut/55 mb-3"
                    style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
                  >
                    ✕ Failure mode
                  </div>
                  <p className="text-walnut/80 leading-relaxed">{lv.failure}</p>
                </div>
                <div className="rounded-2xl border border-brass/40 bg-brass/[0.06] p-6">
                  <div
                    className="font-sans uppercase text-brass mb-3"
                    style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
                  >
                    ✓ Resilient posture
                  </div>
                  <p className="text-walnut/85 leading-relaxed">{lv.resilient}</p>
                </div>
              </div>

              {showMoves && lv.move && (
                <div className="mt-6 flex items-start gap-3 text-walnut/75">
                  <span className="text-brass">→</span>
                  <span className="leading-relaxed">
                    <span
                      className="font-sans uppercase text-walnut/55 mr-2"
                      style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
                    >
                      Do this now
                    </span>
                    {lv.move}
                  </span>
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);
