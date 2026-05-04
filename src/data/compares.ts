/**
 * Comparison pages: short, structured, long-tail SEO bait.
 *
 * Each entry powers a `/intelligence/<slug>` route via IntelligenceCompare.
 * Comparison rows are deliberately tight — these pages exist to rank for
 * "X vs Y" queries and funnel readers into the pillar.
 */
export interface CompareEntry {
  slug: string;
  title: string;
  description: string;
  /** Short intro paragraph shown above the table. */
  intro: string;
  /** The two things being compared, used for the H1 and table headers. */
  left: string;
  right: string;
  /** Comparison rows. Keep ~5-7 rows. */
  rows: { axis: string; left: string; right: string }[];
  /** A 60-100 word "in one paragraph" summary directly below the table.
   *  This is what LLMs tend to lift, so write it as a complete answer. */
  summary: string;
  /** Optional FAQ items, emitted as FAQPage JSON-LD. */
  faqs?: { question: string; answer: string }[];
  /** Internal links surfaced as a "Read deeper" rail. */
  related: { href: string; label: string }[];
}

export const COMPARES: CompareEntry[] = [
  {
    slug: "ai-operating-system-vs-operating-model",
    title: "AI operating system vs operating model: what's the difference?",
    description:
      "An operating model is intent on a slide. An AI operating system is what runs when nobody's looking. Here is the practical difference, in a table.",
    intro:
      "These two terms get used interchangeably in board decks, then confuse everyone the moment a real decision needs to be made. They are not the same thing, and which one you actually have determines whether AI compounds in your company or stalls.",
    left: "Operating model",
    right: "AI operating system",
    rows: [
      { axis: "Form", left: "Document or diagram", right: "Live runtime" },
      { axis: "Owner", left: "COO, Chief of Staff", right: "Operating leader plus champions" },
      { axis: "Updated", left: "Annually", right: "Weekly" },
      { axis: "Question it answers", left: "How are we structured?", right: "What happens next?" },
      { axis: "Failure mode", left: "Out of date on day one", right: "Bit-rot in the gaps" },
      { axis: "Audience", left: "Board, investors, new hires", right: "Operators, agents, workflows" },
      { axis: "Made of", left: "Roles, RACIs, flows", right: "Data, tools, agents, governance, cadence" },
    ],
    summary:
      "An operating model describes intent. An AI operating system describes what actually runs. Companies with only an operating model have a story about how AI fits. Companies with an AI operating system have AI fitting. The first is necessary, the second is sufficient. You need both, in that order, and you should never confuse the deck with the substrate.",
    faqs: [
      {
        question: "Is an operating model the same as an AI operating system?",
        answer:
          "No. An operating model is a documented description of how a company is organised. An AI operating system is the live runtime that decides which model handles which task, with what data, under what guardrails. One is intent. The other is substrate.",
      },
      {
        question: "Do I need both?",
        answer:
          "Yes, in that order. Build the operating model first so the company knows what it is supposed to do, then build the AI operating system so it can actually do it. Skipping either produces a familiar failure: a strategy nobody can execute, or capability with no direction.",
      },
    ],
    related: [
      { href: "/intelligence/what-is-an-ai-operating-system", label: "What is an AI operating system?" },
      { href: "/intelligence/operating-systems-vs-operating-models", label: "Operating systems vs operating models" },
      { href: "/intelligence/five-pillars-of-ai-readiness", label: "The five pillars of AI readiness" },
    ],
  },
  {
    slug: "ai-os-vs-ai-platform",
    title: "AI OS vs AI platform: stop confusing the chassis and the engine",
    description:
      "An AI platform is something you buy. An AI operating system is something you build around it. Here is the line, in a table.",
    intro:
      "Vendors will sell you something called an AI platform and label it an AI OS. It is not. A platform without your data, your tools, your governance, and your cadence is a feature with marketing.",
    left: "AI platform",
    right: "AI operating system",
    rows: [
      { axis: "Origin", left: "Bought from a vendor", right: "Built around your operations" },
      { axis: "Boundary", left: "Product surface", right: "Whole-company runtime" },
      { axis: "Owns the data?", left: "No, you wire data in", right: "Yes, that is half the point" },
      { axis: "Owns governance?", left: "Provides hooks", right: "Defines what is allowed" },
      { axis: "Cadence", left: "Vendor release cycle", right: "Your weekly operating rhythm" },
      { axis: "Replaceable?", left: "Swap the vendor", right: "Swap nothing without a migration" },
    ],
    summary:
      "An AI platform is a component. An AI operating system is the full chassis: the data it reads, the tools it calls, the agents it runs, the governance that constrains it, and the cadence that maintains it. Treating a platform purchase as an AI OS is the most expensive way to discover the difference.",
    faqs: [
      {
        question: "Is buying an AI platform enough?",
        answer:
          "No. A platform is a powerful component, but without your data, tools, governance, and operating cadence wrapped around it, you have an engine without a chassis. Most stalled AI programmes are platform-rich and OS-poor.",
      },
    ],
    related: [
      { href: "/intelligence/what-is-an-ai-operating-system", label: "What is an AI operating system?" },
      { href: "/intelligence/from-ai-experiments-to-ai-infrastructure", label: "From AI experiments to AI infrastructure" },
    ],
  },
  {
    slug: "ai-os-vs-automation",
    title: "AI OS vs automation: where one ends and the other begins",
    description:
      "Automation runs the same path every time. An AI operating system reasons about which path to take. Both matter. Conflating them produces brittle pilots.",
    intro:
      "Automation and AI overlap in conversation and diverge in production. Knowing which layer a piece of work belongs to is the difference between a system that compounds and a system that needs a person watching it.",
    left: "Automation",
    right: "AI operating system",
    rows: [
      { axis: "Behaviour", left: "Same path every time", right: "Reasons about the path" },
      { axis: "Best for", left: "Rails, hand-offs, deterministic flows", right: "Triage, drafting, analysis, judgment" },
      { axis: "Failure mode", left: "Breaks loudly when inputs shift", right: "Drifts quietly without governance" },
      { axis: "Maintenance", left: "Update the rule", right: "Update the data, the prompt, and the cadence" },
      { axis: "Right tool", left: "n8n, Zapier, workflow engines", right: "Models plus your AI OS pillars" },
    ],
    summary:
      "Use automation for the rails. Use an AI operating system for the decisions. The two compound when you build them together: automation handles the deterministic plumbing while the AI OS handles the judgment, with governance and cadence sitting across both. Companies that conflate the two end up with brittle pilots and unhappy operators.",
    faqs: [
      {
        question: "Should I use automation or AI?",
        answer:
          "Both, on different parts of the workflow. Use automation for the deterministic rails and hand-offs. Use an AI operating system for the steps that previously required judgment. The boundary is the question worth designing.",
      },
    ],
    related: [
      { href: "/intelligence/what-is-an-ai-operating-system", label: "What is an AI operating system?" },
      { href: "/intelligence/automation-patterns-that-pay-off", label: "Automation patterns that pay off" },
    ],
  },
];
