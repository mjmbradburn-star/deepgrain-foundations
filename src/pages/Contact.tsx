import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageMeta } from "@/components/seo/PageMeta";
import { AssessmentLadder } from "@/components/sections/AssessmentLadder";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";

const Contact = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <PageMeta
        title="Grab thirty minutes | Deepgrain"
        description="Book thirty minutes with Matt Bradburn. No pitch. We work out live on the call whether a Grain Audit fits."
        path="/contact"
        jsonLd={buildBreadcrumbLd([
          { name: "Home", url: "https://www.deepgrain.ai/" },
          { name: "Contact", url: "https://www.deepgrain.ai/contact" },
        ])}
      />

      {/* Hero - calendar first. The call is the action; nothing sells above it. */}
      <section className="relative bg-green text-cream pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        <TopoBackdrop variant="basin" opacity={0.16} />
        <div className="relative container-grain max-w-4xl">
          <ScrollReveal>
            <SectionEyebrow className="mb-6">Thirty minutes</SectionEyebrow>
            <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[88px] leading-[1.02]">
              Grab thirty minutes.
            </h1>
            <p className="mt-8 max-w-2xl text-cream/80 text-lg leading-relaxed">
              No pitch. We work out if a Grain Audit fits, live on the call.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div
              className="mt-12 rounded-2xl overflow-hidden bg-cream border border-cream/10"
              style={{ boxShadow: "0 30px 60px -40px hsl(var(--bark) / 0.5)" }}
            >
              <div className="px-6 py-4 border-b border-walnut/10 flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-2 font-sans uppercase text-brass"
                  style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 600 }}
                >
                  <Clock aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                  Pick a time
                </span>
                <span className="text-walnut/70 text-xs">Free, no pitch</span>
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
      </section>

      {/* Not ready yet - what the call actually is, the free tools, and the write-in option */}
      <section className="bg-green text-cream py-20 md:py-28 border-t border-cream/10">
        <div className="container-grain max-w-2xl">
          <ScrollReveal>
            <SectionEyebrow className="mb-6">Not ready yet</SectionEyebrow>
            <h2 className="font-display text-cream text-3xl md:text-4xl leading-[1.05] mb-6">
              What happens on the call.
            </h2>
            <p className="text-cream/80 leading-relaxed">
              You talk me through the process that's costing you time. I ask enough questions to
              know whether a Grain Audit would pay off. If it would, we lock a slot before we hang
              up. If it wouldn't, I'll tell you that too, and point you somewhere better.
            </p>
            <p className="mt-10 text-cream/70 text-sm">
              Or skip the call. Email me directly:{" "}
              <a
                href="mailto:matt@deepgrain.ai"
                className="text-brass hover:underline underline-offset-2"
              >
                matt@deepgrain.ai
              </a>
            </p>

            <AssessmentLadder
              variant="inline"
              tone="green"
              tools={["readiness", "exposure"]}
              ctaLocation="contact_sidebar"
              className="mt-8"
            />

            <div className="mt-16 border-t border-cream/15 pt-10">
              {!showForm ? (
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="font-sans text-sm text-cream/70 hover:text-cream underline-offset-4 hover:underline transition-colors"
                >
                  Prefer to write instead? A paragraph is enough.
                </button>
              ) : (
                <div>
                  <p className="font-display italic text-cream/80 text-xl mb-8">
                    Tell me what you're trying to fix.
                  </p>
                  <ContactForm />
                </div>
              )}
            </div>

            <div className="mt-16 border-t border-cream/15 pt-10">
              <Link
                to="/grain-audit"
                className="group inline-flex items-center gap-1.5 font-sans text-sm tracking-wider text-cream/80 hover:text-cream underline-offset-4 hover:underline"
              >
                Already know you want the Grain Audit? Read what's included
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default Contact;
