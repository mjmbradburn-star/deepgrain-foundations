import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";

export const Invitation = () => (
  <section className="bg-green text-cream section-pad">
    <div className="container-grain max-w-3xl text-center">
      <ScrollReveal>
        <h2 className="font-display text-5xl md:text-7xl lg:text-[96px] leading-[1.05] text-cream text-balance">
          Ready to read the grain?
        </h2>
        <p className="mt-8 text-cream/75 max-w-md mx-auto leading-relaxed">
          Tell me what you are trying to fix. A paragraph is enough to
          start.
        </p>
        <div className="mt-12">
          <PillButton href="/contact" variant="filled">
            Get in touch →
          </PillButton>
        </div>
      </ScrollReveal>
    </div>
  </section>
);
