import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";

const NotFound = () => (
  <section className="bg-green text-cream min-h-screen flex items-center justify-center">
    <div className="container-grain max-w-2xl text-center">
      <Eyebrow className="text-cream/60 mb-6">404</Eyebrow>
      <h1 className="font-display text-5xl md:text-7xl leading-tight text-cream">
        Off the grain.
      </h1>
      <p className="mt-6 text-cream/75">
        The page you're looking for isn't here.
      </p>
      <div className="mt-10">
        <PillButton href="/" variant="outline">Back to start →</PillButton>
      </div>
    </div>
  </section>
);

export default NotFound;
