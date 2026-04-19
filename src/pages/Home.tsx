import { Hero } from "@/components/sections/Hero";
import { BeliefStatement } from "@/components/sections/BeliefStatement";
import { OperatingProof } from "@/components/sections/OperatingProof";
import { Method } from "@/components/sections/Method";
import { WhoThisIsFor } from "@/components/sections/WhoThisIsFor";
import { ClientVoice } from "@/components/sections/ClientVoice";
import { LogoCarousel } from "@/components/sections/LogoCarousel";
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
    <Invitation />
  </>
);

export default Home;
