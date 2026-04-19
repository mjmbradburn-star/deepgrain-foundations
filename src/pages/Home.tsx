import { Hero } from "@/components/sections/Hero";
import { BeliefStatement } from "@/components/sections/BeliefStatement";
import { OperatingProof } from "@/components/sections/OperatingProof";
import { Method } from "@/components/sections/Method";
import { WhoThisIsFor } from "@/components/sections/WhoThisIsFor";
import { ClientVoice } from "@/components/sections/ClientVoice";
import { LogoCarousel } from "@/components/sections/LogoCarousel";
import { IntelligenceTeaser } from "@/components/sections/IntelligenceTeaser";
import { Invitation } from "@/components/sections/Invitation";

const Home = () => (
  <>
    <Hero />
    <BeliefStatement />
    <LogoCarousel background="green" />
    <OperatingProof />
    <Method />
    <WhoThisIsFor />
    <ClientVoice />
    <IntelligenceTeaser />
    <Invitation />
  </>
);

export default Home;
