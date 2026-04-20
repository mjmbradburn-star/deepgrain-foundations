import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";
import { BrassRule } from "@/components/ui/BrassRule";
import { PageMeta } from "@/components/seo/PageMeta";

const MethodPage = () => (
  <>
    <PageMeta
      title="Method — Read · Craft · Scale | Deepgrain"
      description="The Deepgrain method, explained in full. Read the operating reality, craft the smallest interventions that compound, then scale without breaking the grain."
      path="/method"
    />
    {/* Intro */}
    <section className="relative min-h-[80vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=55&fm=webp"
          srcSet="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=640&q=55&fm=webp 640w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=55&fm=webp 1200w, https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=60&fm=webp 1600w"
          sizes="100vw"
          alt=""
          width={1600}
          height={1067}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green/60" />
      </div>
      <div className="relative container-grain pb-20 md:pb-32 pt-40">
        <div className="relative max-w-4xl bg-walnut/88 backdrop-blur-sm rounded-[48px] md:rounded-[72px] p-10 md:p-16 border border-brass/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
          <ScrollReveal>
            <Eyebrow className="text-brass mb-6">The Method</Eyebrow>
            <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-[96px] leading-[1.02] text-balance">
              Read the grain. Build with it. Leave something that lasts.
            </h1>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* Read */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">01 Read</Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
            Before we touch a thing, we understand.
          </h2>
          <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
            <p>
              Most consulting starts with the org chart. We start somewhere else.
              The org chart isn&apos;t how decisions get made. The process documentation
              isn&apos;t how work flows. The strategy deck isn&apos;t what drives outcomes.
            </p>
            <p>
              Underneath all of it is a grain. The real pattern of how this
              organisation thinks, moves, decides, and delivers. We read it first.
              We talk to the people doing the work. We watch where energy flows
              and where it stalls. We find the fractures forming before anyone
              has named them. And only then do we build.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Craft */}
    <section className="bg-walnut text-cream section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">02 Craft</Eyebrow>
          <h2 className="font-display text-cream text-4xl md:text-6xl leading-tight">
            We build with the grain, not against it.
          </h2>
          <div className="mt-10 space-y-6 text-cream/80 leading-relaxed text-lg">
            <p>
              Human judgment and machine precision, working together from day one.
              Agents that remove friction without removing thought. Systems
              designed around how this specific place actually works, not
              borrowed from a playbook that worked somewhere else.
            </p>
            <p>
              The carpenter knows the wood will split if you cut against the
              grain. So do we. We build alongside your people, in your tools,
              with your context. Then we hand it over.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Scale */}
    <section className="bg-linen text-body section-pad">
      <div className="container-grain max-w-3xl">
        <ScrollReveal>
          <Eyebrow className="text-brass mb-4">03 Scale</Eyebrow>
          <h2 className="font-display text-walnut text-4xl md:text-6xl leading-tight">
            We leave something that compounds.
          </h2>
          <div className="mt-10 space-y-6 text-body/85 leading-relaxed text-lg">
            <p>
              Not a deck. Not a framework. A genuine capability. Teams who think
              well with AI. Structures that hold as you grow. The clarity to
              make hard decisions without losing what makes the place good.
            </p>
            <p>
              Two months after the engagement ends, our champions are still
              building. They have extended the work into places we never touched.
              That&apos;s the test. Not what you have on day one, but what you still
              have, and what you have added, six months on.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* CTA */}
    <section className="bg-green text-cream section-pad">
      <div className="container-grain max-w-3xl text-center">
        <ScrollReveal>
          <BrassRule className="mx-auto mb-10" />
          <h2 className="font-display text-cream text-4xl md:text-6xl lg:text-7xl leading-tight text-balance">
            Want to see what reading your grain might surface?
          </h2>
          <div className="mt-12">
            <PillButton href="/contact" variant="filled">Start the conversation →</PillButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default MethodPage;
