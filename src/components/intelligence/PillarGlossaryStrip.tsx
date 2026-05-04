import { Link } from "react-router-dom";
import { GLOSSARY, type GlossaryEntry } from "@/data/glossary";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Per-pillar curated set of glossary term slugs. Keeps the strip tight (4-6 terms)
 * and topically relevant to the pillar's cluster, instead of dumping the whole
 * glossary on every page.
 */
const PILLAR_TERMS: Record<string, string[]> = {
  "ai-operating-system": [
    "ai-operating-system",
    "operating-model",
    "ai-infrastructure",
    "ai-operating-ladder",
    "five-pillars-of-ai-readiness",
    "ai-readiness",
  ],
  "ai-workspace-for-people-ops": [
    "ai-workspace",
    "champion-model",
    "ai-agent",
    "ai-governance",
    "ai-workflow",
    "ai-readiness",
  ],
  "operating-leadership": [
    "founder-mode",
    "operator-mode",
    "operating-intervention",
    "operating-debt",
    "operating-cadence",
    "read-craft-scale",
  ],
  "sector-operating-lenses": [
    "operating-consultancy",
    "operating-reality",
    "the-grain",
    "ai-readiness",
  ],
};

interface Props {
  pillarSlug: string;
}

export const PillarGlossaryStrip = ({ pillarSlug }: Props) => {
  const slugs = PILLAR_TERMS[pillarSlug];
  if (!slugs?.length) return null;

  const entries = slugs
    .map((s) => GLOSSARY.find((g) => g.slug === s))
    .filter(Boolean) as GlossaryEntry[];

  if (!entries.length) return null;

  return (
    <section
      aria-labelledby="pillar-glossary-strip"
      className="bg-cream/60 border-y border-walnut/10 py-16 md:py-20"
    >
      <div className="container-grain max-w-5xl">
        <div className="flex items-baseline justify-between gap-6 flex-wrap mb-8">
          <div>
            <Eyebrow>Glossary for this pillar</Eyebrow>
            <h2
              id="pillar-glossary-strip"
              className="font-display text-2xl md:text-3xl text-walnut mt-3"
              style={{ letterSpacing: "-0.01em" }}
            >
              Terms used across these articles.
            </h2>
          </div>
          <Link
            to="/intelligence/glossary"
            className="text-[11px] uppercase text-green hover:text-brass transition-colors"
            style={{ letterSpacing: "0.16em" }}
          >
            Full glossary →
          </Link>
        </div>

        <dl className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          {entries.map((e) => (
            <div key={e.slug} className="border-l-2 border-brass/60 pl-4">
              <dt className="font-display text-lg text-walnut">
                <Link
                  to={`/intelligence/glossary#${e.slug}`}
                  className="hover:text-green transition-colors"
                >
                  {e.term}
                </Link>
              </dt>
              <dd className="text-walnut/80 text-base leading-relaxed mt-1">
                {e.definition}
                {e.link && (
                  <>
                    {" "}
                    <Link
                      to={e.link}
                      className="text-green hover:text-brass underline-offset-4 hover:underline whitespace-nowrap"
                    >
                      Read more →
                    </Link>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
