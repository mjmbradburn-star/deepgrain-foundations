import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";

const Contact = () => (
  <>
    <PageMeta
      title="Contact | Deepgrain"
      description="Start a conversation with Deepgrain. If you have an organisation worth getting right, write to Matthew Bradburn directly."
      path="/contact"
      jsonLd={buildBreadcrumbLd([
        { name: "Home", url: "https://deepgrain.ai/" },
        { name: "Contact", url: "https://deepgrain.ai/contact" },
      ])}
    />

    {/* Hero — green */}
    <section className="bg-green text-cream pt-40 pb-24 md:pb-32">
      <div className="container-grain max-w-3xl text-center">
        <ScrollReveal>
          <Eyebrow className="text-cream/70 mb-6">Contact</Eyebrow>
          <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[80px] leading-[1.05] text-balance">
            Let's talk.
          </h1>
          <p className="mt-8 text-cream/75 max-w-md mx-auto leading-relaxed">
            Tell me what you are trying to fix. A paragraph is enough to start.
          </p>
          <BrassRule className="mx-auto my-12" />
          <a
            href="mailto:matt@deepgrain.ai"
            className="font-display text-cream text-2xl md:text-3xl hover:text-brass transition-colors"
          >
            matt@deepgrain.ai
          </a>
        </ScrollReveal>
      </div>
    </section>

    {/* Booking — cream/linen panel */}
    <section className="bg-linen text-body py-20 md:py-28">
      <div className="container-grain">
        <div className="grid gap-12 md:grid-cols-[5fr_7fr] md:gap-16 items-start">
          <ScrollReveal>
            <Eyebrow withRule className="text-walnut/70 mb-6">
              Booking
            </Eyebrow>
            <h2 className="font-display text-walnut text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-balance">
              Find a time.
            </h2>
            <p className="mt-6 text-body/80 leading-relaxed max-w-md">
              Pick a slot that works. Thirty minutes, no agenda required —
              tell me what you're trying to fix and we'll go from there.
            </p>
            <BrassRule className="my-8" />
            <ul className="space-y-3 text-body/75 text-sm">
              <li className="flex items-baseline gap-3">
                <span className="text-brass font-display text-base leading-none">—</span>
                <span>Thirty minutes</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-brass font-display text-base leading-none">—</span>
                <span>No agenda required</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-brass font-display text-base leading-none">—</span>
                <span>Video or phone</span>
              </li>
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div
              className="rounded-2xl overflow-hidden bg-white border border-linen-dark"
              style={{ boxShadow: "0 20px 60px -30px hsl(var(--green) / 0.25)" }}
            >
              <iframe
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1RAkNriqYTtoBEaOJM92B07HFwq_4dSvaiwERC1mO3XJVbPEf_3dNFAgYI4XxvXomrLtBa2TAW?gv=true"
                title="Book a call with Matthew Bradburn"
                className="w-full h-[680px] md:h-[720px] block"
                style={{ border: 0, colorScheme: "light" }}
                frameBorder={0}
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* Form — green */}
    <section className="bg-green text-cream py-20 md:py-28">
      <div className="container-grain max-w-3xl text-center">
        <ScrollReveal>
          <p className="font-display italic text-cream/70 text-2xl mb-10">
            Or send a note here.
          </p>
          <BrassRule className="mx-auto mb-12" />
          <ContactForm />
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default Contact;
