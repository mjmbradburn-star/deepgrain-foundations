import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";

export const WhoThisIsFor = () => (
  <section className="relative section-pad overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-green/82" />
    </div>
    <div className="relative container-grain max-w-5xl">
      <ScrollReveal>
        <Eyebrow className="text-cream/70 mb-8">Who this is for</Eyebrow>
        <h2 className="font-display text-cream text-4xl sm:text-5xl md:text-6xl lg:text-[80px] leading-[1.05] max-w-3xl text-balance">
          Leaders who know something isn't working. And can't yet name why.
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <div className="mt-10 max-w-xl text-cream/85 space-y-5 leading-relaxed">
          <p>
            The NHS team buried in manual processes that should have been
            automated two years ago. The founder whose team got them to Series B
            and won't get them to Series D. The operator running five systems
            that don't speak to each other and three more they don't need.
          </p>
          <p>
            The problem is never the sector. It's never the size. It's that the
            way work actually happens has never been properly understood — so
            nothing built on top of it ever quite fits.
          </p>
          <p>
            Deepgrain reads the organisation before it touches it. Then builds
            what lasts.
          </p>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={300}>
        <div className="mt-12">
          <PillButton href="/work" variant="outline">
            See the work →
          </PillButton>
        </div>
      </ScrollReveal>
    </div>
  </section>
);
