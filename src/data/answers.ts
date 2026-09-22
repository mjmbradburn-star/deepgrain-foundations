/**
 * Question/answer pairs for /intelligence/answers.
 *
 * Sourced from real GSC query strings and adjacent long-tail. Each answer is
 * 40-80 words: short enough to be quoted by Perplexity/Claude, long enough
 * to be a complete reply. Page emits QAPage JSON-LD with these.
 */
export interface AnswerEntry {
  question: string;
  /** Slug used as anchor id and JSON-LD identifier. */
  slug: string;
  /** Plain-text answer. Mirrored exactly in JSON-LD acceptedAnswer.text. */
  answer: string;
  /** Optional internal follow-up link. */
  link?: string;
  linkLabel?: string;
  /** Optional <title> override; the visible H1 stays the full question. */
  metaTitle?: string;
}

export const ANSWERS: AnswerEntry[] = [
  {
    question: "How does agentic AI improve operational efficiency in businesses?",
    slug: "how-does-agentic-ai-improve-operational-efficiency",
    metaTitle: "How agentic AI improves operational efficiency | Deepgrain",
    answer:
      "Agents handle the multi-step work that automation alone cannot, because the path changes based on what the agent finds. They earn their keep on workflows where a human used to coordinate across three or four systems. Most companies do not need many agents. Three or four, well-bounded, with logged steps and a human checkpoint, covers the bulk of the value.",
    link: "/intelligence/identifying-efficiency-gaps-ai-can-fill#what-to-do-once-you-have-found-one",
  },
];
