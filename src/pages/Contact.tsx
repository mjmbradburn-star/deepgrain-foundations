import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageMeta } from "@/components/seo/PageMeta";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";

const steps = [
  {
    n: "01",
    title: "Pick a workflow",
    body: "One you own and wish you never had to touch. Onboarding, case triage, a leaver process.",
  },
  {
    n: "02",
    title: "Atomise it to the click",
    body: "We map the first eight steps together. Click, handoff, decision, wait. Honest about the dull ones.",
  },
  {
    n: "03",
    title: "Agree the first move",
    body: "One step to redesign. One step that must stay human. Something you can act on by Monday.",
  },
];

const Contact = () => (
  <>
    <PageMeta
      title="Book a 30-minute audit | Deepgrain"
      description="Map one workflow with Matthew Bradburn. Thirty minutes, twenty minutes mapping and ten agreeing the first move. Leave with a plan, not a pitch."
      path="/contact"
      jsonLd={buildBreadcrumbLd([
        { name: "Home", url: "https://www.deepgrain.ai/" },
        { name: "Contact", url: "https://www.deepgrain.ai/contact" },
      ])}
    />

    {/* Hero — green, deck-style */}
    <section className="relative bg-green text-cream pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <TopoBackdrop variant="basin" opacity={0.16} />
      <div className="relative container-grain max-w-4xl">
        <ScrollReveal>
          <SectionEyebrow className="mb-6">The first move</SectionEyebrow>
          <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[88px] leading-[1.02]">
            Map one workflow with me.
          </h1>
          <p className="font-display italic text-cream/80 mt-6 text-xl md:text-2xl max-w-2xl">
            Twenty minutes mapping. Ten agreeing the first move. You leave with one thing to do on
            Monday, not a deck.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* The three steps, then the calendar */}
    <section className="bg-linen text-walnut py-20 md:py-28">
      <div className="container-grain">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-start">
          <ScrollReveal>
            <SectionEyebrow tone="linen" className="mb-6">
              What we will cover
            </SectionEyebrow>
            <h2 className="font-display text-walnut text-3xl md:text-4xl leading-[1.05] mb-10 max-w-md">
              Thirty minutes. A workflow. A move.
            </h2>
            <ol className="space-y-8">
              {steps.map((s) => (
                <li key={s.n} className="border-t border-walnut/15 pt-5">
                  <div
                    className="font-sans uppercase text-brass mb-2"
                    style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
                  >
                    {s.n}
                  </div>
                  <h3 className="font-display text-walnut text-2xl mb-2">{s.title}</h3>
                  <p className="text-walnut/75 leading-relaxed">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 text-walnut/60 text-sm">
              Or write directly:{" "}
              <a
                href="mailto:matt@deepgrain.ai"
                className="text-brass hover:underline underline-offset-2"
              >
                matt@deepgrain.ai
              </a>
            </p>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div
              className="rounded-2xl overflow-hidden bg-cream border border-walnut/10"
              style={{ boxShadow: "0 30px 60px -40px hsl(var(--green) / 0.4)" }}
            >
              <div className="px-6 py-4 border-b border-walnut/10 flex items-center justify-between">
                <span
                  className="font-sans uppercase text-brass"
                  style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
                >
                  ◷  Find a slot
                </span>
                <span className="text-walnut/50 text-xs">30 minutes</span>
              </div>
              <iframe
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1RAkNriqYTtoBEaOJM92B07HFwq_4dSvaiwERC1mO3XJVbPEf_3dNFAgYI4XxvXomrLtBa2TAW?gv=true"
                title="Book a call with Matthew Bradburn"
                className="w-full h-[680px] md:h-[820px] block"
                style={{ border: 0, colorScheme: "light" }}
                frameBorder={0}
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* Form fallback — green */}
    <section className="bg-green text-cream py-20 md:py-28">
      <div className="container-grain max-w-3xl text-center">
        <ScrollReveal>
          <p className="font-display italic text-cream/70 text-2xl mb-3">
            Or send a note. A paragraph is enough.
          </p>
          <p className="text-cream/60 max-w-md mx-auto text-sm mb-12">
            If a calendar slot does not fit, tell me roughly what you are trying to fix and I will
            come back with a time.
          </p>
          <ContactForm />
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default Contact;
