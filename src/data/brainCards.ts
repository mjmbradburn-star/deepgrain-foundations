/**
 * The nine articles surfaced in Section 2 ("What's Inside") of /brain.
 *
 * These are real subpages of "The Deepgrain People Ops AI Brain" Notion
 * workspace, chosen to span all four layers of the resource:
 *   - Layer 1: Foundations
 *   - Layer 2: Skills & Capabilities
 *   - Layer 3: Systems, Orchestration & Scale
 *   - Layer 4: The Human Layer & Leading Change
 *
 * Subheaders are paraphrased from each subpage's intro line so the cards
 * read in Matt's voice without quoting verbatim.
 */
export interface BrainCard {
  number: string;
  layer: "Foundations" | "Skills" | "Systems" | "Human Layer";
  title: string;
  blurb: string;
}

export const brainCards: BrainCard[] = [
  {
    number: "01",
    layer: "Foundations",
    title: "Setting up your AI workspace",
    blurb:
      "Projects architecture, the three-tier document strategy, and custom instructions that actually shape output. The step most people skip, and the reason their AI feels generic.",
  },
  {
    number: "02",
    layer: "Foundations",
    title: "From prompts to skills files",
    blurb:
      "Move past throwaway prompts to reusable skills. Chain them without context drift, and build conductor skills that orchestrate whole workflows across Claude, ChatGPT, Copilot and Gemini.",
  },
  {
    number: "03",
    layer: "Skills",
    title: "Getting better output",
    blurb:
      "Critical thinking applied to AI output. Devil's advocate prompting, perspective shifting, and the critique-and-refinement loop that turns mediocre drafts into useful work.",
  },
  {
    number: "04",
    layer: "Skills",
    title: "The People Ops domain map",
    blurb:
      "Seven domains, sixty-plus AI capabilities mapped across TA, EX, performance, comp, L&D, ER and analytics. Find exactly where AI helps in your patch.",
  },
  {
    number: "05",
    layer: "Skills",
    title: "Workflow assessment framework",
    blurb:
      "The Workflow Canvas, the AI Opportunity Score formula, and a ninety-day integration roadmap. Audit systematically; find the highest-value places to start.",
  },
  {
    number: "06",
    layer: "Systems",
    title: "Claude Cowork for People teams",
    blurb:
      "The desktop agent that runs multi-step work across files and tools. Four People Ops playbooks: weekly digest, offboarding orchestrator, survey synthesis, vendor review pack.",
  },
  {
    number: "07",
    layer: "Systems",
    title: "Building your first automation",
    blurb:
      "End-to-end build: a New Hire Welcome automation with n8n + Claude. The five-component anatomy, testing, and deployment, all in one sitting.",
  },
  {
    number: "08",
    layer: "Human Layer",
    title: "Designing the AI-native People team",
    blurb:
      "AI-Enabled → AI-Augmented → AI-Native. Maturity definitions, role evolution, the AI Champion model, team structures by company size, and the governance underneath.",
  },
  {
    number: "09",
    layer: "Human Layer",
    title: "Leading the AI transformation",
    blurb:
      "Understanding fear, yours and theirs. The five-phase transformation sequence, resistance patterns, building champions, and the ninety-day organisational plan.",
  },
];
