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
    <OperatingProof />
    <Method />
    <WhoThisIsFor />
    <ClientVoice />
    <LogoCarousel background="green" />
    <Invitation />
  </>
);

export default Home;
