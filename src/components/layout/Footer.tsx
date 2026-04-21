import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { BarkSection } from "@/components/ui/BarkSection";

// Lazy: pulls in supabase + zod, ~250KB. Footer is below the fold on every page.
const EmailCapture = lazy(() =>
  import("@/components/forms/EmailCapture").then((m) => ({ default: m.EmailCapture }))
);

const links = [
  { to: "/method", label: "Method" },
  { to: "/enablement", label: "Enablement" },
  { to: "/work", label: "Work" },
  { to: "/intelligence", label: "Intelligence" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Footer = () => (
  <BarkSection as="footer" className="text-cream/80 py-20">
    <div className="container-grain">
      <div className="grid gap-12 md:grid-cols-3 mb-16">
        <div>
          <div
            className="font-display uppercase font-semibold text-2xl md:text-3xl text-cream mb-4"
            style={{ letterSpacing: "0.14em" }}
          >
            Deepgrain
          </div>
          <p className="text-sm text-cream/60 max-w-xs leading-relaxed">
            Organisational consultancy for companies that want to last.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://aioi.deepgrain.ai"
                className="text-sm text-cream/70 hover:text-cream transition-colors"
              >
                AI Operating Index ↗
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <a
            href="mailto:matt@deepgrain.ai"
            className="font-display text-2xl text-brass hover:text-brass/80 transition-colors"
          >
            matt@deepgrain.ai
          </a>
        </div>
      </div>

      <div className="pt-12 border-t border-cream/10">
        <Suspense fallback={<div aria-hidden className="min-h-[120px]" />}>
          <EmailCapture
            source="footer"
            variant="dark"
            heading="Intelligence in your inbox."
            description="Occasional notes on running real organisations. No newsletter rhythm. Nothing to scroll past."
          />
        </Suspense>
      </div>
    </div>
    <div className="container-grain mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row gap-2 justify-between text-xs text-cream/40">
      <p>© 2026 Deepgrain Ltd</p>
      <nav aria-label="Legal" className="flex gap-4">
        <Link to="/privacy" className="hover:text-cream/70 transition-colors">Privacy</Link>
        <Link to="/cookies" className="hover:text-cream/70 transition-colors">Cookies</Link>
        <Link to="/terms" className="hover:text-cream/70 transition-colors">Terms</Link>
      </nav>
      <p>Work with the grain.</p>
    </div>
  </BarkSection>
);
