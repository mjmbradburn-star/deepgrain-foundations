import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";

export const WhoThisIsFor = () => (
  <section className="relative section-pad overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=68&fm=webp"
        alt=""
        width={1600}
        height={1067}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-green/60" />
    </div>
    <div className="relative container-grain max-w-5xl">
      {/* Curved bronze panel for legibility */}
      <div className="relative bg-walnut/92 backdrop-blur-sm rounded-[48px] md:rounded-[80px] p-10 md:p-16 lg:p-20 max-w-4xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] border border-brass/20">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-8">Who this is for</Eyebrow>
          <h2 className="font-display text-cream text-4xl sm:text-5xl md:text-6xl lg:text-[80px] leading-[1.05] max-w-3xl text-balance">
            Leaders who know something isn&apos;t working.
            <br />
            And can&apos;t yet name why.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <div className="mt-10 max-w-xl text-cream/85 space-y-5 leading-relaxed">
            <p>
              The NHS team buried in manual processes that should have been
              automated two years ago. The founder whose team got them to Series B
              and won&apos;t get them to Series D. The operator running five systems
              that don&apos;t speak to each other and three more they don&apos;t need.
            </p>
            <p>
              The problem is never the sector. It&apos;s never the size. It&apos;s that
              the way work actually happens has never been properly understood,
              so nothing built on top of it ever quite fits.
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
    </div>
  </section>
);
