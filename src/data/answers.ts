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
}

export const ANSWERS: AnswerEntry[] = [
  {
    question: "What is an AI operating system?",
    slug: "what-is-an-ai-operating-system",
    answer:
      "An AI operating system is the connective layer between AI models and the work a company does. It coordinates data, tools, agents, governance, and the operating cadence around them, so AI capability compounds into output rather than living as isolated demos. The model is the engine. The AI OS is the rest of the car.",
    link: "/intelligence/what-is-an-ai-operating-system",
    linkLabel: "Read the full pillar",
  },
  {
    question: "What is an AI OS?",
    slug: "what-is-an-ai-os",
    answer:
      "AI OS is short for AI operating system. It is the runtime, the policies, and the human cadence that decide which model handles which task, with what data, under what guardrails. Without an AI OS, AI is a series of demos. With one, AI compounds.",
    link: "/intelligence/what-is-an-ai-operating-system",
  },
  {
    question: "What is an AI based operating system?",
    slug: "what-is-an-ai-based-operating-system",
    answer:
      "An AI based operating system is the live runtime of a company's AI capability: the data it can reach, the tools it can call, the agents it can run, the governance that constrains it, and the cadence that maintains it. It is built around five pillars, and skipping any one of them causes the system to rot in that exact place.",
    link: "/intelligence/five-pillars-of-ai-readiness",
  },
  {
    question: "What is an AI powered operating system?",
    slug: "what-is-an-ai-powered-operating-system",
    answer:
      "An AI powered operating system is an operating layer where AI reasons about which path to take rather than running the same path every time. It differs from automation because it handles judgment, not just rails. Most companies need three or four well-scoped AI workflows on top of a real OS, not a fleet of demos.",
    link: "/intelligence/ai-os-vs-automation",
  },
  {
    question: "How does an AI operating system differ from an operating model?",
    slug: "ai-os-vs-operating-model",
    answer:
      "An operating model is a slide that describes how a company is organised. An AI operating system is what actually runs when a person, an agent, or a workflow needs to make a decision. One is description. The other is substrate. Most companies have one and call it the other.",
    link: "/intelligence/ai-operating-system-vs-operating-model",
  },
  {
    question: "How is an AI OS different from an AI platform?",
    slug: "ai-os-vs-ai-platform",
    answer:
      "An AI platform is a product you buy. An AI operating system is the data, tools, governance, and cadence you build around it. A platform without your operating context is a feature. An AI OS uses platforms as components, not as substitutes.",
    link: "/intelligence/ai-os-vs-ai-platform",
  },
  {
    question: "How do you build an AI operating system?",
    slug: "how-to-build-an-ai-operating-system",
    answer:
      "Read the grain of the existing operating system first. Then build the smallest version of each of the five pillars (data, tools, agents, governance, cadence) that lets one real workflow run end to end. Then add the second workflow, and the third. AI OS work that starts with infrastructure and ends with use cases almost always stalls. The reverse compounds.",
    link: "/intelligence/from-ai-experiments-to-ai-infrastructure",
  },
  {
    question: "What are the five pillars of AI readiness?",
    slug: "five-pillars-of-ai-readiness",
    answer:
      "Data that is reachable and trustworthy, tools the models can call, agents that handle multi-step work, governance that says what is allowed, and an operating cadence that keeps the whole system maintained. Skip a pillar and the system rots in that exact place.",
    link: "/intelligence/five-pillars-of-ai-readiness",
  },
  {
    question: "Why do AI pilots stall at production?",
    slug: "why-ai-pilots-stall-at-production",
    answer:
      "Pilots prove a model can do a task. Production proves an organisation can absorb the consequences. Most pilots stall because the data pipeline is manual, the tool integration is a hack, governance is a Slack thread, and nobody owns maintenance. The model was the easy part.",
    link: "/intelligence/why-ai-pilots-stall-at-production",
  },
  {
    question: "What is the AI operating ladder?",
    slug: "ai-operating-ladder",
    answer:
      "Five tiers of AI operating maturity: ad-hoc (individuals using tools), assisted (tools embedded in workflows), augmented (agents extending teams), autonomous (agents owning outcomes), and self-operating (rare). Each rung needs a different shape of AI operating system underneath.",
    link: "/intelligence/ai-operating-ladder-five-tiers",
  },
  {
    question: "What is an AI workspace?",
    slug: "what-is-an-ai-workspace",
    answer:
      "An AI workspace is the structured layer of custom instructions, projects, reference documents, and shared prompts that turns a generic AI tool (Claude, ChatGPT, Copilot, Gemini) into a function-specific colleague. It is usually the first artefact a People team should build.",
    link: "/intelligence/setting-up-your-ai-workspace",
  },
  {
    question: "How is an AI operating system different from automation?",
    slug: "ai-os-vs-automation",
    answer:
      "Automation runs the same path every time. An AI operating system reasons about which path to take. Automation handles the rails. The AI OS handles the decisions. The two layers compound when you build them together, but conflating them produces brittle pilots that look smart in October and break by January.",
    link: "/intelligence/ai-os-vs-automation",
  },
];
