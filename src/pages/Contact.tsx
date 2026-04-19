import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { ContactForm } from "@/components/forms/ContactForm";

const Contact = () => (
  <section className="bg-green text-cream min-h-screen pt-40 pb-32">
    <div className="container-grain max-w-3xl text-center">
      <ScrollReveal>
        <Eyebrow className="text-cream/70 mb-6">Contact</Eyebrow>
        <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[80px] leading-[1.05] text-balance">
          Let's talk.
        </h1>
        <p className="mt-8 text-cream/75 max-w-md mx-auto leading-relaxed">
          If you think your organisation is ready to understand itself,
          reach out directly.
        </p>
        <BrassRule className="mx-auto my-12" />
        <a
          href="mailto:matt@deepgrain.ai"
          className="font-display text-cream text-2xl md:text-3xl hover:text-brass transition-colors"
        >
          matt@deepgrain.ai
        </a>
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <div className="mt-20">
          <BrassRule className="mx-auto mb-12" />
          <p className="font-display italic text-cream/70 text-2xl mb-10">
            Or send a note here.
          </p>
          <ContactForm />
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default Contact;
