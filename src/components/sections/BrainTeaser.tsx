import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";

/**
 * Homepage Brain teaser. Sells The People Ops AI Brain and drives subscriptions.
 * Replaces the old WhoThisIsFor slot - same green/walnut treatment so the page
 * rhythm holds, but a far more useful piece of real estate.
 */
const layers = [
  {
    number: "01",
    name: "Foundations",
    detail: "workspace, prompts, the setup most people skip",
  },
  {
    number: "02",
    name: "Skills",
    detail: "the daily craft. Writing, thinking, deciding with AI",
  },
  {
    number: "03",
    name: "Systems",
    detail: "orchestration, agents, the work that runs itself",
  },
  {
    number: "04",
    name: "Human Layer",
    detail: "leading change, bringing the team with you",
  },
];

export const BrainTeaser = () => (
  <section className="relative section-pad overflow-hidden bg-green">


    <div className="relative container-grain max-w-6xl">
      <div className="relative bg-walnut/92 backdrop-blur-sm rounded-[48px] md:rounded-[80px] p-8 sm:p-12 md:p-16 lg:p-20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] border border-brass/20">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          {/* LEFT: copy + CTAs */}
          <div>
            <ScrollReveal>
              <Eyebrow className="text-brass mb-8">
                The People Ops AI Brain
              </Eyebrow>
              <h2 className="font-display text-cream text-[2rem] sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.05] text-pretty">
                <span className="block">The AI brain we wish</span>
                <span className="block">we&apos;d had.</span>
                <span className="block mt-2 text-brass/90">
                  Free. Yours in a click.
                </span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="mt-8 max-w-xl text-cream/85 space-y-5 leading-relaxed">
                <p>
                  Nine worked examples. Twenty-seven practical guides. Four
                  layers, from setting up your workspace to leading the team
                  through the change.
                </p>
                <p>
                  The thing you&apos;d build yourself if you had six months. We
                  built it. You can have it.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="mt-10 flex flex-wrap items-center gap-3 md:gap-4">
                <PillButton
                  href="/brain"
                  variant="filled"
                  cta="get_brain"
                  ctaLocation="home_brain_teaser"
                >
                  Get the Brain, free →
                </PillButton>
                <PillButton
                  href="/brain#whats-inside"
                  variant="outline"
                  cta="see_brain_inside"
                  ctaLocation="home_brain_teaser"
                >
                  See what&apos;s inside →
                </PillButton>
              </div>
              <p className="mt-5 text-xs tracking-wider uppercase text-cream/55">
                One email. No drip. Unsubscribe in one click.
              </p>
            </ScrollReveal>
          </div>

          {/* RIGHT: four-layer diagram */}
          <ScrollReveal delay={200}>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 sm:-inset-6 rounded-[32px] bg-brass/5 blur-2xl"
              />
              <div className="relative rounded-[28px] border border-brass/30 bg-walnut/60 p-6 sm:p-8">
                {/* Header row */}
                <div className="flex items-baseline justify-between border-b border-brass/20 pb-4 mb-5">
                  <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-brass">
                    Four layers
                  </span>
                  <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-cream/55">
                    36 pieces
                  </span>
                </div>

                {/* Layers */}
                <ul className="relative">
                  {/* Vertical spine */}
                  <span
                    aria-hidden
                    className="absolute left-[14px] sm:left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-brass/10 via-brass/40 to-brass/10"
                  />
                  {layers.map((layer, i) => (
                    <li
                      key={layer.number}
                      className="relative pl-9 sm:pl-12 py-4 border-b border-cream/5 last:border-b-0 group"
                    >
                      {/* Node dot */}
                      <span
                        aria-hidden
                        className="absolute left-[10px] sm:left-[14px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-brass shadow-[0_0_0_4px_hsl(var(--walnut))] brain-pulse"
                        style={{ animationDelay: `${i * 0.9}s` }}
                      />
                      <div className="flex items-baseline gap-3 sm:gap-4">
                        <span className="font-display text-brass/80 text-sm sm:text-base tabular-nums">
                          {layer.number}
                        </span>
                        <span className="font-display text-cream text-lg sm:text-xl tracking-tight">
                          {layer.name}
                        </span>
                      </div>
                      <p className="mt-1 ml-9 sm:ml-10 text-cream/65 text-sm leading-snug">
                        {layer.detail}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Footer summary */}
                <div className="mt-6 pt-5 border-t border-brass/20 flex items-baseline justify-between">
                  <span className="font-display text-cream text-base sm:text-lg">
                    9 examples · 27 guides
                  </span>
                  <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-cream/55">
                    Free
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  </section>
);
