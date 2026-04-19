import { useState } from "react";
import { clients } from "@/data/clients";
import { LogoFallback } from "@/components/ui/LogoFallback";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

interface LogoCarouselProps {
  background?: "green" | "walnut";
  showHeadline?: boolean;
  headline?: string;
  eyebrow?: string;
}

const LogoItem = ({ name, domain }: { name: string; domain: string }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <LogoFallback name={name} />;
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      onError={() => setFailed(true)}
      loading="lazy"
      className="h-7 w-auto opacity-40 hover:opacity-75 transition-opacity duration-300"
      style={{ filter: "brightness(0) invert(1)" }}
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
      className={cn("py-20 md:py-24 overflow-hidden", bgClass)}
      aria-label="Client logos"
    >
      {showHeadline && (
        <div className="container-grain text-center mb-14">
          <Eyebrow className="text-cream/60 mb-6">{eyebrow}</Eyebrow>
          <p className="font-display italic text-2xl md:text-[32px] leading-snug text-cream/90 max-w-3xl mx-auto">
            {headline}
          </p>
        </div>
      )}
      <div className="relative w-full">
        <div className="flex w-max logo-track" role="marquee">
          {doubled.map((c, i) => (
            <div
              key={`${c.domain}-${i}`}
              className="flex items-center justify-center px-8 md:px-12 min-w-[160px]"
            >
              <LogoItem name={c.name} domain={c.domain} />
            </div>
          ))}
        </div>
        {/* Fade edges */}
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r",
            background === "green" ? "from-green to-transparent" : "from-walnut to-transparent",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l",
            background === "green" ? "from-green to-transparent" : "from-walnut to-transparent",
          )}
        />
      </div>
    </section>
  );
};
