import { useState } from "react";
import { clients, type Client } from "@/data/clients";
import { LogoFallback } from "@/components/ui/LogoFallback";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

interface LogoCarouselProps {
  background?: "green" | "walnut";
  showHeadline?: boolean;
  headline?: string;
  eyebrow?: string;
}

const LOGO_SOURCES = [
  (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  (domain: string) => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  (domain: string) => `https://logo.clearbit.com/${domain}?size=64`,
];

const Wordmark = ({ name }: { name: string }) => (
  <span
    className="font-display text-cream/90 group-hover:text-cream transition-colors duration-500 text-2xl md:text-[26px] leading-none whitespace-nowrap"
    style={{ letterSpacing: "0.02em" }}
  >
    {name}
  </span>
);

const LogoItem = ({ client }: { client: Client }) => {
  const { name, domain, override } = client;
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  // Curated override: refined wordmark in the site's display face.
  if (override?.kind === "wordmark") {
    return <Wordmark name={name} />;
  }

  // Curated override: hand-picked asset, tinted to cream so it sits with the palette.
  if (override?.kind === "image") {
    return (
      <img
        src={override.src}
        alt={`${name} logo`}
        width={48}
        height={48}
        loading="lazy"
        decoding="async"
        className="max-h-12 max-w-[120px] w-auto h-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        style={{ filter: "brightness(0) saturate(100%) invert(94%) sepia(8%) saturate(420%) hue-rotate(2deg) brightness(102%)" }}
      />
    );
  }

  if (failed) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <LogoFallback name={name} />
      </div>
    );
  }

  return (
    <img
      src={LOGO_SOURCES[sourceIndex](domain)}
      alt={`${name} logo`}
      width={48}
      height={48}
      onError={() => {
        if (sourceIndex < LOGO_SOURCES.length - 1) {
          setSourceIndex(sourceIndex + 1);
        } else {
          setFailed(true);
        }
      }}
      loading="lazy"
      decoding="async"
      className="max-h-12 max-w-[120px] w-auto h-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500"
    />
  );
};

export const LogoCarousel = ({
  background = "green",
  showHeadline = true,
  headline = "Organisations that chose to understand themselves first.",
  eyebrow = "Trusted by",
}: LogoCarouselProps) => {
  const bgClass = background === "green" ? "bg-green" : "bg-walnut";
  const doubled = [...clients, ...clients];

  return (
    <section
      className={cn("py-24 md:py-32 overflow-hidden", bgClass)}
      aria-label="Client logos"
    >
      {showHeadline && (
        <div className="container-grain text-center mb-16">
          <Eyebrow className="text-brass mb-6">{eyebrow}</Eyebrow>
          <p className="font-display italic text-2xl md:text-[32px] leading-snug text-cream/90 max-w-3xl mx-auto">
            {headline}
          </p>
        </div>
      )}
      <div className="relative w-full">
        <div className="flex w-max logo-track gap-6 md:gap-8">
          {doubled.map((c, i) => (
            <div
              key={`${c.domain}-${i}`}
              className={cn(
                "group flex flex-col items-center justify-center gap-3",
                "h-32 w-44 md:h-36 md:w-52 shrink-0",
                "rounded-2xl border border-cream/10 bg-cream/[0.04] backdrop-blur-sm",
                "px-6 py-4 transition-all duration-500",
                "hover:bg-cream/[0.08] hover:border-brass/30 hover:-translate-y-0.5",
              )}
              title={c.name}
            >
              <div className="flex-1 flex items-center justify-center w-full">
                <LogoItem client={c} />
              </div>
              <span className="font-sans text-[11px] tracking-[0.18em] uppercase text-brass/90 whitespace-nowrap">
                {c.name}
              </span>
            </div>
          ))}
        </div>
        {/* Fade edges */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r z-10",
            background === "green" ? "from-green to-transparent" : "from-walnut to-transparent",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l z-10",
            background === "green" ? "from-green to-transparent" : "from-walnut to-transparent",
          )}
        />
      </div>
    </section>
  );
};
