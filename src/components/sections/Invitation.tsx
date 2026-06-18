import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionEyebrow } from "@/components/sections/deck/SectionEyebrow";
import { AuditPrompt } from "@/components/sections/deck/AuditPrompt";
import { TopoBackdrop } from "@/components/sections/deck/TopoBackdrop";

/**
 * Page-close invitation. Deck-style green panel with topographic backdrop
 * and the same single CTA used everywhere on the site.
 */
export const Invitation = ({
  ctaLocation = "invitation",
  prefill = "I'd like a 30-minute audit. The workflow I'd most like to fix is:",
  headline = "Map one workflow with me.",
  sub = "Thirty minutes. Twenty mapping, ten agreeing the first move.",
}: {
  ctaLocation?: string;
  prefill?: string;
  headline?: string;
  sub?: string;
} = {}) => (
  <section className="relative bg-green text-cream section-pad overflow-hidden">
    <TopoBackdrop variant="basin" opacity={0.16} />
    <div className="relative container-grain max-w-3xl">
      <ScrollReveal>
        <SectionEyebrow className="mb-6">The first move</SectionEyebrow>
        <AuditPrompt
          tone="green"
          ctaId={`audit_${ctaLocation}`}
          ctaLocation={ctaLocation}
          headline={headline}
          sub={sub}
          prefill={prefill}
        />
      </ScrollReveal>
    </div>
  </section>
);
