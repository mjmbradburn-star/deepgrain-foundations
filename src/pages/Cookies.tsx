import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { PageMeta } from "@/components/seo/PageMeta";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-walnut text-2xl md:text-3xl mt-12 mb-4" style={{ letterSpacing: "-0.01em" }}>
    {children}
  </h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-walnut/80 leading-relaxed mb-4">{children}</p>
);

const Cookies = () => (
  <section className="bg-linen text-walnut min-h-screen pt-40 pb-32">
    <PageMeta
      title="Cookie Policy | Deepgrain"
      description="A short, honest account of the storage this site uses. No advertising or third-party trackers."
      path="/cookies"
    />
    <div className="container-grain max-w-3xl">
      <ScrollReveal>
        <Eyebrow className="text-walnut/60 mb-6">Cookies</Eyebrow>
        <h1 className="font-display text-walnut text-5xl md:text-6xl leading-[1.05] text-balance">
          Cookie policy.
        </h1>
        <p className="mt-6 text-walnut/60 text-sm">Last updated: 20 April 2026</p>
        <BrassRule className="my-10" />

        <P>
          This site is light on storage. We do not run advertising networks,
          social pixels, or session-replay tools.
        </P>

        <H2>What we store</H2>
        <P>
          <strong>Strictly necessary.</strong> A small entry in your browser's
          local storage records your cookie preference so we do not ask again
          on every visit. Our hosting platform may set a session cookie if you
          ever sign in to a future area of the site.
        </P>
        <P>
          <strong>Analytics.</strong> None at the moment. If we ever add a
          privacy-respecting analytics tool, it will be gated on the consent
          choice you make in the banner.
        </P>
        <P>
          <strong>Advertising.</strong> None.
        </P>

        <H2>Your choice</H2>
        <P>
          The banner asks once. You can accept or reject non-essential storage.
          Strictly necessary storage is always set because the site cannot work
          without it.
        </P>
        <P>
          To change your mind, clear this site's storage in your browser
          settings and reload. The banner will return.
        </P>

        <H2>More detail</H2>
        <P>
          Read our{" "}
          <Link to="/privacy" className="text-walnut underline underline-offset-2 hover:text-brass">
            privacy policy
          </Link>{" "}
          for the full picture, or write to{" "}
          <a href="mailto:matt@deepgrain.ai" className="text-walnut underline underline-offset-2 hover:text-brass">
            matt@deepgrain.ai
          </a>{" "}
          with any questions.
        </P>
      </ScrollReveal>
    </div>
  </section>
);

export default Cookies;
