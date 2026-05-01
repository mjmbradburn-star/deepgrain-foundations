import { useEffect, useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";

type Bullet = { lead: string; rest: string };

const bullets: Bullet[] = [
  {
    lead: "Plain English.",
    rest: " LLMs, agents, MCP, RAG, harness, CLI — what the words actually mean.",
  },
  {
    lead: "Built for G&A.",
    rest: " The context People, Finance and Ops leaders need — not just the engineers.",
  },
  {
    lead: "Ninety seconds.",
    rest: " The plumbing in one watch. The leverage is in what you build with it.",
  },
];

export const SimpleAIPrimer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-linen pt-16 pb-10 md:pt-24 md:pb-12" aria-labelledby="simple-ai-heading">
      <div className="container-grain">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left — video */}
          <ScrollReveal>
            <figure className="relative overflow-hidden rounded-2xl ring-1 ring-walnut/15 bg-bark shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]">
              <video
                ref={videoRef}
                src="/simple-ai.mp4"
                poster="/simple-ai-poster.jpg"
                muted
                playsInline
                preload="metadata"
                controls
                aria-label="Simple AI: a 90-second primer on the seventeen AI terms every People leader keeps hearing."
                className="block w-full h-auto aspect-video"
              />
              <figcaption className="sr-only">
                Simple AI — a 90-second primer for People leaders.
              </figcaption>
            </figure>
          </ScrollReveal>

          {/* Right — copy */}
          <ScrollReveal delay={120}>
            <Eyebrow withRule className="text-walnut/70 mb-4 md:mb-6">
              Watch · 90 seconds
            </Eyebrow>
            <h2
              id="simple-ai-heading"
              className="font-display text-walnut text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] text-balance"
              style={{ letterSpacing: "-0.01em" }}
            >
              The jargon is just plumbing.
            </h2>
            <p className="mt-5 md:mt-6 text-walnut/75 leading-relaxed text-base md:text-lg max-w-xl">
              Seventeen of the terms cluttering every AI conversation,
              explained for G&A leaders — not engineers.
            </p>

            <ul className="mt-6 md:mt-8 space-y-4 md:space-y-5 max-w-xl">
              {bullets.map((b) => (
                <li key={b.lead}>
                  <p className="text-walnut/85 leading-relaxed">
                    <span className="text-brass font-medium">{b.lead}</span>
                    {b.rest}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <PillButton href="/brain" variant="outline">
                Go deeper · The People Ops AI Brain →
              </PillButton>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
