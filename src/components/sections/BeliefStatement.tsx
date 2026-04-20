import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const BeliefStatement = () => (
  <section className="relative section-pad overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1597211833712-5e41faa202ea?auto=format&fit=crop&w=1600&q=68&fm=webp"
        alt=""
        width={1600}
        height={1067}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-walnut/85" />
    </div>
    <div className="relative container-grain text-center">
      <ScrollReveal>
        <p className="font-display italic font-light text-cream text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight max-w-4xl mx-auto text-balance">
          &ldquo;Every organisation has a grain.<br />Most have never read it.&rdquo;
        </p>
      </ScrollReveal>
    </div>
  </section>
);
