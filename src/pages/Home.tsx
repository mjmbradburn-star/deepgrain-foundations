import { lazy, Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { ICPStrip } from "@/components/sections/ICPStrip";
import { PageMeta } from "@/components/seo/PageMeta";
import { HOME_FAQ_LD } from "@/components/sections/HomeFAQ";

// Below-the-fold sections — lazy-loaded to shrink the initial JS bundle.
const LogoCarousel = lazy(() =>
  import("@/components/sections/LogoCarousel").then((m) => ({ default: m.LogoCarousel }))
);
const WhatWeDo = lazy(() =>
  import("@/components/sections/WhatWeDo").then((m) => ({ default: m.WhatWeDo }))
);
const OperatingProof = lazy(() =>
  import("@/components/sections/OperatingProof").then((m) => ({ default: m.OperatingProof }))
);
const Method = lazy(() =>
  import("@/components/sections/Method").then((m) => ({ default: m.Method }))
);
const SimpleAIPrimer = lazy(() =>
  import("@/components/sections/SimpleAIPrimer").then((m) => ({ default: m.SimpleAIPrimer }))
);
const WhoThisIsFor = lazy(() =>
  import("@/components/sections/WhoThisIsFor").then((m) => ({ default: m.WhoThisIsFor }))
);
const ClientVoice = lazy(() =>
  import("@/components/sections/ClientVoice").then((m) => ({ default: m.ClientVoice }))
);
const MobileProofVoice = lazy(() =>
  import("@/components/sections/MobileProofVoice").then((m) => ({ default: m.MobileProofVoice }))
);
const IntelligenceTeaser = lazy(() =>
  import("@/components/sections/IntelligenceTeaser").then((m) => ({ default: m.IntelligenceTeaser }))
);
const Invitation = lazy(() =>
  import("@/components/sections/Invitation").then((m) => ({ default: m.Invitation }))
);
const HomeFAQ = lazy(() =>
  import("@/components/sections/HomeFAQ").then((m) => ({ default: m.HomeFAQ }))
);

// Minimal placeholder preserves vertical rhythm without shifting the page.
const SectionFallback = () => <div aria-hidden className="min-h-[60vh]" />;

const Home = () => (
  <>
    <PageMeta
      title="Deepgrain | Work with the grain."
      description="Organisational consultancy that reads how your company actually operates, then builds the strategy, agentic systems and people to evolve it."
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
    <Hero />
    <ICPStrip />
    <Suspense fallback={<SectionFallback />}>
      <div className="cv-auto"><LogoCarousel background="green" /></div>
      <div className="cv-auto"><WhatWeDo /></div>
      {/* Desktop: full OperatingProof + ClientVoice. Mobile: condensed merge. */}
      <div className="hidden md:contents">
        <div className="cv-auto"><OperatingProof /></div>
      </div>
      <div className="cv-auto"><MobileProofVoice /></div>
      <div className="cv-auto"><Method /></div>
      <div className="cv-auto"><SimpleAIPrimer /></div>
      <div className="cv-auto"><WhoThisIsFor /></div>
      <div className="hidden md:contents">
        <div className="cv-auto"><ClientVoice /></div>
      </div>
      <div className="cv-auto"><IntelligenceTeaser /></div>
      <div className="cv-auto"><HomeFAQ /></div>
      <div className="cv-auto"><Invitation /></div>
    </Suspense>
  </>
);

export default Home;
