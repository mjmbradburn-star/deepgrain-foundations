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
  /** Supporting copy that makes the retained answer a useful standalone page. */
  sections?: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
}

export const ANSWERS: AnswerEntry[] = [
  {
    question: "How does agentic AI improve operational efficiency in businesses?",
    slug: "how-does-agentic-ai-improve-operational-efficiency",
    metaTitle: "How agentic AI improves operational efficiency | Deepgrain",
    answer:
      "Agents handle the multi-step work that automation alone cannot, because the path changes based on what the agent finds. They earn their keep on workflows where a human used to coordinate across three or four systems. Most companies do not need many agents. Three or four, well-bounded, with logged steps and a human checkpoint, covers the bulk of the value.",
    sections: [
      {
        heading: "Where agentic AI creates operational value",
        paragraphs: [
          "The useful signal is branching. In a fixed workflow, every step is known in advance: read a form, copy the fields, update a record and send a message. Ordinary automation is cheaper and easier to audit. An agent becomes useful when what it should do next depends on what it has just read. It might inspect an account, decide which evidence is missing, choose the next system to check and then prepare the case for a person to approve.",
          "That shape appears in internal query triage, supplier onboarding, sales research, finance exception handling and customer-support escalation. The agent is not replacing the owner of the process. It is clearing the coordination work between systems so the owner sees a prepared decision rather than a queue of raw inputs.",
        ],
        bullets: [
          "High frequency: the workflow runs daily or weekly, so the build can pay back.",
          "High latency: work waits for hours even though the human contribution takes minutes.",
          "Branching judgement: the next step changes according to what the agent finds.",
          "Clear ownership: one operating leader can approve the workflow and its boundaries.",
        ],
      },
      {
        heading: "How to introduce agents without adding operational risk",
        paragraphs: [
          "Start with one bounded workflow and write down what the agent may read, what it may draft and what it may never decide. Put a human checkpoint before anything reaches a customer, employee or supplier. Log the source, action and approval for every run. This is less dramatic than launching a fleet of agents, but it produces a system the team can inspect and improve.",
          "A good first agent returns a prepared work item: the relevant records, a proposed classification, the missing information and a recommended next action. A person still owns the decision. Once the team has several weeks of clean logs, it can widen the boundary deliberately rather than trusting a demo.",
        ],
      },
      {
        heading: "What to measure",
        paragraphs: [
          "Measure queue time, completed volume, rework and exception rate before and after the change. Headcount is usually the wrong measure. The practical gain is that the same team clears more work, responds sooner and spends less time moving information between tools. If queue time falls but rework rises, the agent has only moved the cost downstream.",
          "The first review should happen after a week, then again after 30 days. Keep the workflow only if the logs show faster handling without a rise in errors or unowned exceptions. Operational efficiency is a measured change in the work, not the presence of an agent in the process map.",
        ],
      },
    ],
    link: "/intelligence/identifying-efficiency-gaps-ai-can-fill#what-to-do-once-you-have-found-one",
  },
];
