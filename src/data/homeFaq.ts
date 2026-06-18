import type { FAQItem } from "@/components/sections/FAQ";

/**
 * Homepage FAQ data — pure data, no React/MDX imports. Kept in its own
 * module so the homepage critical path can read HOME_FAQ_LD for JSON-LD
 * without pulling FAQ.tsx + mdxComponents (TLDR/KeyTakeaways/Takeaway)
 * into the initial bundle. The HomeFAQ component (lazy) re-imports from
 * here for rendering.
 */
export const HOME_FAQ: FAQItem[] = [
  {
    question: "What is an AI operating system?",
    answer:
      "An AI operating system is the connective layer between AI models and the work a company does. It coordinates data, tools, agents, governance, and the operating cadence around them, so AI capability compounds into output rather than living as isolated demos. The model is the engine. The AI OS is the rest of the car.",
  },
  {
    question: "How do you identify efficiency gaps AI can fill?",
    answer:
      "We look at four signals in the existing work: repetition, latency, judgment shape, and contestability. A workflow that runs often, waits hours on a human whose contribution is minutes, has judgment that is pattern-matching rather than novel, and has a clear owner who can sign off changes, is almost always an AI-shaped gap. A 30-minute audit beats a three-month strategy deck for finding the first one.",
  },
  {
    question: "How is Deepgrain different from a management consultancy?",
    answer:
      "A management consultancy delivers a slide deck and a recommendation. Deepgrain reads the grain of how the company actually operates, then builds the strategy, the AI systems, and the people who can keep evolving them after we leave. We ship working software and trained operators, not just frameworks.",
  },
  {
    question: "Who do you work with?",
    answer:
      "Founder-led companies between Series A and Series C in AI-native, defence, financial data, transit, and climate sectors. The common shape is a founder or operating leader who can see the gap between what the team does today and what the operating system needs to do at the next stage.",
  },
  {
    question: "How long does a Deepgrain engagement take?",
    answer:
      "A diagnostic is 30 days. A build engagement is typically 8 to 16 weeks per function, scoped around one or two operating workflows we can take from manual to AI-native end to end. Enablement runs alongside, so the team owns the system by the time we leave.",
  },
];

export const HOME_FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((i) => ({
    "@type": "Question",
    name: i.question,
    acceptedAnswer: { "@type": "Answer", text: i.answer },
  })),
};
