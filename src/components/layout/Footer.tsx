import { Link } from "react-router-dom";

const links = [
  { to: "/method", label: "Method" },
  { to: "/work", label: "Work" },
  { to: "/intelligence", label: "Intelligence" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Footer = () => (
  <footer className="bg-walnut text-cream/80 py-20">
    <div className="container-grain grid gap-12 md:grid-cols-3">
      <div>
        <div
          className="font-display uppercase font-semibold text-2xl md:text-3xl text-cream mb-4"
          style={{ letterSpacing: "0.14em" }}
        >
          Deepgrain
        </div>
        <p className="text-sm text-cream/60 max-w-xs leading-relaxed">
          Organisational consultancy. Work with the grain.
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
    <div className="container-grain mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row gap-2 justify-between text-xs text-cream/40">
      <p>© 2026 Deepgrain Ltd</p>
      <p>Work with the grain.</p>
    </div>
  </footer>
);
