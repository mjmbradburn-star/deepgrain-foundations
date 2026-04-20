import { lazy, Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { ICPStrip } from "@/components/sections/ICPStrip";
import { PageMeta } from "@/components/seo/PageMeta";

// Below-the-fold sections — lazy-loaded to shrink the initial JS bundle.
const BeliefStatement = lazy(() =>
  import("@/components/sections/BeliefStatement").then((m) => ({ default: m.BeliefStatement }))
);
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
const WhoThisIsFor = lazy(() =>
  import("@/components/sections/WhoThisIsFor").then((m) => ({ default: m.WhoThisIsFor }))
);
const ClientVoice = lazy(() =>
  import("@/components/sections/ClientVoice").then((m) => ({ default: m.ClientVoice }))
);
const IntelligenceTeaser = lazy(() =>
  import("@/components/sections/IntelligenceTeaser").then((m) => ({ default: m.IntelligenceTeaser }))
);
const Invitation = lazy(() =>
  import("@/components/sections/Invitation").then((m) => ({ default: m.Invitation }))
);

// Minimal placeholder preserves vertical rhythm without shifting the page.
const SectionFallback = () => <div aria-hidden className="min-h-[60vh]" />;

const Home = () => (
  <>
    <PageMeta
      title="Deepgrain — Work with the grain."
      description="Organisational consultancy that reads how your company actually operates — then builds the agents, automations, and team capabilities that hold. Function by function, top to bottom."
      path="/"
    />
    <Hero />
    <ICPStrip />
    <Suspense fallback={<SectionFallback />}>
      <LogoCarousel background="green" />
      <WhatWeDo />
      <BeliefStatement />
      <OperatingProof />
      <Method />
      <WhoThisIsFor />
      <ClientVoice />
      <IntelligenceTeaser />
      <Invitation />
    </Suspense>
  </>
);

export default Home;
