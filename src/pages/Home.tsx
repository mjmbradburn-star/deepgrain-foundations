import { lazy, Suspense } from "react";
import { HeroDeck } from "@/components/sections/deck/HeroDeck";
import { TheShift } from "@/components/sections/deck/TheShift";
import { WorkedExample } from "@/components/sections/deck/WorkedExample";
import { StickyBookingPill } from "@/components/layout/StickyBookingPill";
import { PageMeta } from "@/components/seo/PageMeta";
import { HOME_FAQ_LD } from "@/data/homeFaq";

// Below-the-fold: lazy-loaded to keep the initial JS bundle small.
const AgentArchitecture = lazy(() =>
  import("@/components/sections/deck/AgentArchitecture").then((m) => ({
    default: m.AgentArchitecture,
  })),
);
const TheBridge = lazy(() =>
  import("@/components/sections/deck/TheBridge").then((m) => ({ default: m.TheBridge })),
);
const TheCounterweight = lazy(() =>
  import("@/components/sections/deck/TheCounterweight").then((m) => ({
    default: m.TheCounterweight,
  })),
);
const LogoCarousel = lazy(() =>
  import("@/components/sections/LogoCarousel").then((m) => ({ default: m.LogoCarousel })),
);
const SimpleAIPrimer = lazy(() =>
  import("@/components/sections/SimpleAIPrimer").then((m) => ({ default: m.SimpleAIPrimer })),
);
const IntelligenceTeaser = lazy(() =>
  import("@/components/sections/IntelligenceTeaser").then((m) => ({
    default: m.IntelligenceTeaser,
  })),
);
const HomeFAQ = lazy(() =>
  import("@/components/sections/HomeFAQ").then((m) => ({ default: m.HomeFAQ })),
);
const ClosingInvitation = lazy(() =>
  import("@/components/sections/deck/ClosingInvitation").then((m) => ({
    default: m.ClosingInvitation,
  })),
);

const SectionFallback = () => <div aria-hidden className="min-h-[60vh]" />;

// Film-grain: a fixed, pointer-events-none SVG-noise plate for a physical-paper
// feel. Static (no animation), GPU-composited, and scoped to Home so it never
// bleeds onto other routes. Very low opacity so it reads as texture, not noise.
const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

const FilmGrain = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-multiply motion-reduce:opacity-[0.025]"
    style={{ backgroundImage: NOISE_URL, backgroundSize: "140px 140px" }}
  />
);

const Home = () => (
  <>
    <FilmGrain />
    <PageMeta
      title="Deepgrain | From the role to the click."
      description="Organisational consultancy for the AI era. We audit how your function actually operates, then build the agentic systems and team capability to evolve it."
      path="/"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: "Simple AI, a 90-second primer for G&A leaders",
          description:
            "Seventeen of the terms cluttering every AI conversation, in plain English. Made for G&A leaders, not engineers.",
          thumbnailUrl: ["https://deepgrain.ai/simple-ai-poster.jpg"],
          uploadDate: "2026-05-01T00:00:00+00:00",
          duration: "PT1M30S",
          contentUrl: "https://deepgrain.ai/simple-ai.mp4",
          embedUrl: "https://deepgrain.ai/simple-ai.mp4",
          publisher: { "@id": "https://deepgrain.ai/#organization" },
        },
        HOME_FAQ_LD,
      ]}
    />
    <HeroDeck />
    <TheShift />
    <WorkedExample />
    <Suspense fallback={<SectionFallback />}>
      <div className="cv-auto">
        <LogoCarousel background="green" />
      </div>
      <div className="cv-auto">
        <AgentArchitecture />
      </div>
      <div className="cv-auto">
        <TheBridge />
      </div>
      <div className="cv-auto">
        <SimpleAIPrimer />
      </div>
      <div className="cv-auto">
        <TheCounterweight />
      </div>
      <div className="cv-auto">
        <IntelligenceTeaser />
      </div>
      <div className="cv-auto">
        <HomeFAQ />
      </div>
      <div className="cv-auto">
        <ClosingInvitation />
      </div>
    </Suspense>
    <StickyBookingPill />
  </>
);

export default Home;
