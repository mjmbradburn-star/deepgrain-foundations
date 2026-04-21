import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

const Contact = () => (
  <section className="bg-green text-cream min-h-screen pt-40 pb-32">
    <PageMeta
      title="Contact | Deepgrain"
      description="Start a conversation with Deepgrain. If you have an organisation worth getting right, write to Matthew Bradburn directly."
      path="/contact"
      jsonLd={buildBreadcrumbLd([
        { name: "Home", url: "https://deepgrain.ai/" },
        { name: "Contact", url: "https://deepgrain.ai/contact" },
      ])}
    />
    <div className="container-grain max-w-3xl text-center">
      <ScrollReveal>
        <Eyebrow className="text-cream/70 mb-6">Contact</Eyebrow>
        <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[80px] leading-[1.05] text-balance">
          Let's talk.
        </h1>
        <p className="mt-8 text-cream/75 max-w-md mx-auto leading-relaxed">
          Tell me what you are trying to fix. A paragraph is enough to
          start.
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
          <p className="font-display italic text-cream/70 text-2xl mb-6">
            Or book a time directly.
          </p>
          <p className="text-cream/60 text-sm max-w-md mx-auto mb-10 leading-relaxed">
            Find a slot that works. Thirty minutes, no agenda required —
            tell me what you're trying to fix and we'll go from there.
          </p>
          <div className="rounded-2xl overflow-hidden bg-cream/5 border border-cream/10 shadow-2xl">
            <iframe
              src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1RAkNriqYTtoBEaOJM92B07HFwq_4dSvaiwERC1mO3XJVbPEf_3dNFAgYI4XxvXomrLtBa2TAW?gv=true"
              title="Book a call with Matthew Bradburn"
              className="w-full h-[700px] md:h-[750px] block"
              style={{ border: 0, colorScheme: "light" }}
              frameBorder={0}
              loading="lazy"
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={250}>
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
