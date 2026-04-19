import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";

export const ClientVoice = () => (
  <section className="bg-walnut text-cream section-pad">
    <div className="container-grain max-w-4xl text-center">
      <ScrollReveal>
        <BrassRule className="mx-auto mb-12" />
        <blockquote className="font-display italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug text-cream max-w-3xl mx-auto text-balance">
          “Matt worked alongside our teams — People, Finance, and Legal —
          building real solutions to our challenges as we scaled at pace.
          Two months on, our champions are still building and extending
          automations with only minor support questions.”
        </blockquote>
        <p className="mt-10 text-brass text-xs uppercase tracking-[0.15em]">
          — Chief People Officer, Defence Technology Company
        </p>
        <BrassRule className="mx-auto mt-12" />
      </ScrollReveal>
    </div>
  </section>
);
