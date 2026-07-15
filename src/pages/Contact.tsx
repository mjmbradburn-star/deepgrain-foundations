import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageMeta } from "@/components/seo/PageMeta";
import { PillButton } from "@/components/ui/PillButton";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";

const steps = [
  {
    n: "01",
    title: "Pick a workflow",
    body: "The one you'd want inside the Audit. Onboarding, case triage, a leaver process.",
  },
  {
    n: "02",
    title: "Check it's a fit",
    body: "Two weeks of mapping only pays off on a process with real volume behind it. We check that on the call, before anyone books.",
  },
  {
    n: "03",
    title: "Lock a slot",
    body: "Three Audit slots a month. If it fits, we book one before the call ends.",
  },
];

const Contact = () => (
  <>
    <PageMeta
      title="Book a Grain Audit | Deepgrain"
      description="Two weeks. One People Ops process mapped end to end, the highest-return automations ranked, and a 90-day plan you keep. GBP 2,000, credited in full against a programme."
      path="/contact"
      jsonLd={buildBreadcrumbLd([
        { name: "Home", url: "https://www.deepgrain.ai/" },
        { name: "Contact", url: "https://www.deepgrain.ai/contact" },
      ])}
    />

    {/* Hero - green, deck-style */}
    <section className="relative bg-green text-cream pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <TopoBackdrop variant="basin" opacity={0.16} />
      <div className="relative container-grain max-w-4xl">
        <ScrollReveal>
          <SectionEyebrow className="mb-6">Three slots a month</SectionEyebrow>
          <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[88px] leading-[1.02]">
            Book a Grain Audit.
          </h1>
          <p className="mt-8 max-w-2xl text-cream/80 text-lg leading-relaxed">
            One People Ops process, mapped end to end. The highest-return automations ranked. A
            90-day plan you keep, whether or not we work together after.
          </p>
          <p className="mt-4 max-w-2xl text-cream/60 text-base">
            Two weeks. GBP 2,000, credited in full against a programme.
          </p>
          <div className="mt-10">
            <PillButton
              href="/grain-audit"
              variant="filled"
              cta="grain_audit_hero"
              ctaLocation="contact_hero"
            >
              Book a Grain Audit
            </PillButton>
          </div>
          <p className="mt-6 text-cream/50 text-sm">
            Want to talk it through first? Thirty minutes, below.
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
              Not ready yet
            </SectionEyebrow>
            <h2 className="font-display text-walnut text-3xl md:text-4xl leading-[1.05] mb-10 max-w-md">
              Thirty minutes. No pitch. We work out if it fits.
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
              Or skip the call. Email me directly:{" "}
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
                  ◷  Grab 30 minutes
                </span>
                <span className="text-walnut/50 text-xs">Free, no pitch</span>
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

    {/* Form fallback - green */}
    <section className="bg-green text-cream py-20 md:py-28">
      <div className="container-grain max-w-3xl text-center">
        <ScrollReveal>
          <p className="font-display italic text-cream/70 text-2xl mb-3">
            Prefer to write first? A paragraph is enough.
          </p>
          <p className="text-cream/60 max-w-md mx-auto text-sm mb-12">
            Tell me what you're trying to fix. If the Grain Audit is the right first move, I'll
            say so. If it isn't, I'll say that too.
          </p>
          <ContactForm />
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default Contact;
