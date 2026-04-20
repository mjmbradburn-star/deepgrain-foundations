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

const Terms = () => (
  <section className="bg-linen text-walnut min-h-screen pt-40 pb-32">
    <PageMeta
      title="Terms of Use | Deepgrain"
      description="Terms governing use of the Deepgrain website."
      path="/terms"
    />
    <div className="container-grain max-w-3xl">
      <ScrollReveal>
        <Eyebrow className="text-walnut/60 mb-6">Terms</Eyebrow>
        <h1 className="font-display text-walnut text-5xl md:text-6xl leading-[1.05] text-balance">
          Terms of use.
        </h1>
        <p className="mt-6 text-walnut/60 text-sm">Last updated: 20 April 2026</p>
        <BrassRule className="my-10" />

        <H2>Using this site</H2>
        <P>
          You can read the writing here and contact us. Please do not abuse the
          forms, scrape the site at scale, or attempt to disrupt its operation.
        </P>

        <H2>Intellectual property</H2>
        <P>
          The writing, design, and code on this site are the property of
          Deepgrain Ltd unless stated otherwise. You are welcome to quote short
          passages with attribution and a link back. Do not republish full
          articles without written permission.
        </P>

        <H2>No warranty</H2>
        <P>
          The content is provided as is. It reflects our views at the time of
          writing and is not professional advice for any specific situation. If
          you want advice on your organisation, get in touch.
        </P>

        <H2>Liability</H2>
        <P>
          To the extent permitted by law, Deepgrain Ltd is not liable for any
          loss arising from use of this site or reliance on its content.
        </P>

        <H2>Governing law</H2>
        <P>
          These terms are governed by the laws of England and Wales. Any
          dispute will be subject to the exclusive jurisdiction of the English
          courts.
        </P>
      </ScrollReveal>
    </div>
  </section>
);

export default Terms;
