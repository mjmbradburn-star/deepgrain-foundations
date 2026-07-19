import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { ChipFlow } from "@/components/sections/deck/ChipFlow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";

/**
 * Home section, ported from deck slide 4. The single most conversion-loaded
 * argument in the deck: stop arguing about which roles AI replaces, start
 * mapping which clicks it absorbs.
 */
export const TheShift = () => (
  <section className="relative bg-green text-cream section-pad overflow-hidden">
    <Parallax speed={0.14} max={90} className="absolute inset-0">
      <TopoBackdrop variant="basin" opacity={0.18} className="scale-110" />
    </Parallax>
    <div className="relative container-grain">
      <Reveal>
        <h2 className="font-display text-cream text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl">
          Stop auditing roles. Start auditing clicks.
        </h2>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-14 md:mt-20">
          <ChipFlow
            tone="green"
            items={[
              { label: "Board altitude", title: "Value map", icon: "◎" },
              { label: "The question", title: "Role", icon: "◉" },
              { label: "The work", title: "Workflow", icon: "⌥" },
              { label: "The answer", title: "Atomic clicks", icon: "▦" },
            ]}
          />
        </div>
      </Reveal>

      <Reveal delay={200}>
        <p className="mt-14 md:mt-16 text-cream/80 max-w-2xl text-lg md:text-xl leading-relaxed">
          The board asks which roles AI replaces. That has no honest answer, because a role is forty
          workflows in a coat.
        </p>
        <p className="mt-4 font-display italic text-brass text-xl md:text-2xl max-w-2xl">
          Your map asks the question. The atomic layer answers it.
        </p>
      </Reveal>
    </div>
  </section>
);
