/**
 * Glossary entries for /intelligence/glossary.
 *
 * Each entry becomes a DefinedTerm in JSON-LD and an anchor on the page.
 * Definitions are kept short (1-2 sentences) so LLMs can lift them verbatim.
 * `link` points to the canonical pillar where the term is explored in depth.
 */
export interface GlossaryEntry {
  term: string;
  /** URL-safe slug used as the on-page anchor id, e.g. `#ai-operating-system`. */
  slug: string;
  /** 1-2 sentence definition. Mirrored in JSON-LD `description`. */
  definition: string;
  /** Optional internal link to the pillar article. */
  link?: string;
  /** Optional alternate names, surfaced in body and emitted as `alternateName`. */
  aliases?: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "AI operating system",
    slug: "ai-operating-system",
    aliases: ["AI OS", "AI based operating system", "AI powered operating system"],
    definition:
      "The connective layer between AI models and the work a company does. An AI OS coordinates data, tools, agents, governance, and the operating cadence around them so AI capability turns into compounding output rather than isolated demos.",
    link: "/intelligence/what-is-an-ai-operating-system",
  },
  {
    term: "Operating model",
    slug: "operating-model",
    definition:
      "A documented description of how a company is organised: structure, roles, decision rights, and key flows. An operating model is intent. An operating system is what actually runs.",
    link: "/intelligence/operating-systems-vs-operating-models",
  },
  {
    term: "Operating intervention",
    slug: "operating-intervention",
    definition:
      "The smallest deliberate change to an operating system that produces the largest second-order effect. Craft is in choosing the smallness, not the scope.",
    link: "/intelligence/the-art-of-the-operating-intervention",
  },
  {
    term: "Read · Craft · Scale",
    slug: "read-craft-scale",
    definition:
      "Deepgrain's three-movement method. Read the grain of the existing operating system. Craft the smallest intervention that fits it. Scale the intervention into a repeatable pattern without breaking what works.",
    link: "/intelligence/read-craft-scale-the-deepgrain-method",
  },
  {
    term: "The grain",
    slug: "the-grain",
    definition:
      "The pre-existing direction of how an organisation actually operates: who decides, what compounds, what gets ignored. Cut with it and the work compounds. Cut against it and you spend the rest of the year sanding.",
    link: "/intelligence/the-grain-metaphor-reading-your-organisation",
  },
  {
    term: "Five pillars of AI readiness",
    slug: "five-pillars-of-ai-readiness",
    definition:
      "Data, tools, agents, governance, and operating cadence. The five surfaces that determine whether a company can absorb AI as capability rather than as demo.",
    link: "/intelligence/five-pillars-of-ai-readiness",
  },
  {
    term: "AI operating ladder",
    slug: "ai-operating-ladder",
    definition:
      "Five tiers of AI operating maturity: ad-hoc, assisted, augmented, autonomous, and (rare) fully self-operating. Each rung is a different shape of AI operating system underneath.",
    link: "/intelligence/ai-operating-ladder-five-tiers",
  },
  {
    term: "Operating cadence",
    slug: "operating-cadence",
    definition:
      "The rhythm at which an operating system is reviewed, maintained, and adjusted. Without cadence, even a well-designed AI OS rots in place.",
    link: "/intelligence/signals-of-operating-health",
  },
  {
    term: "AI workspace",
    slug: "ai-workspace",
    definition:
      "The structured layer of custom instructions, projects, reference documents, and shared prompts that turns a generic AI tool into a function-specific colleague. The first artefact most People teams should build.",
    link: "/intelligence/setting-up-your-ai-workspace",
  },
  {
    term: "Champion model",
    slug: "champion-model",
    definition:
      "A staffing pattern for building AI capability inside a function without engineers. Three or four operators given air cover, time, and a build-first remit, supported by a coaching cadence.",
    link: "/intelligence/the-champion-model",
  },
  {
    term: "AI agent",
    slug: "ai-agent",
    definition:
      "A model plus a goal plus the ability to take steps. Most companies need three or four agents doing the work that previously clogged three or four roles, not a fleet.",
    link: "/intelligence/the-people-ops-ai-domain-map",
  },
  {
    term: "AI governance",
    slug: "ai-governance",
    definition:
      "The set of rules, escalation paths, audit trails, and human-in-the-loop checkpoints that decide what an AI system is allowed to do. Governance is not the brake. It is the steering.",
    link: "/intelligence/ai-governance-for-people-teams",
  },
  {
    term: "AI pilot",
    slug: "ai-pilot",
    definition:
      "A time-boxed proof that a model can perform a task in a specific context. Pilots prove capability. Production proves an organisation can absorb the consequences.",
    link: "/intelligence/why-ai-pilots-stall-at-production",
  },
  {
    term: "AI infrastructure",
    slug: "ai-infrastructure",
    definition:
      "The persistent, owned layer of data pipelines, tool integrations, governance, and runtime that turns one-off AI experiments into compounding capability. The point at which an AI programme becomes an AI operating system.",
    link: "/intelligence/from-ai-experiments-to-ai-infrastructure",
  },
  {
    term: "AI workflow",
    slug: "ai-workflow",
    definition:
      "An end-to-end sequence of work where AI handles one or more steps that previously required judgment. The unit of value most People functions should build against.",
    link: "/intelligence/automation-patterns-that-pay-off",
  },
  {
    term: "AI readiness",
    slug: "ai-readiness",
    definition:
      "The condition of an organisation's data, tools, agents, governance, and cadence such that it can absorb AI as capability. Readiness is not a model selection problem. It is an operating problem.",
    link: "/intelligence/diagnosing-ai-readiness-in-people-ops",
  },
  {
    term: "Operating consultancy",
    slug: "operating-consultancy",
    definition:
      "Consultancy that intervenes in how a company actually runs, not how it presents. Diagnostic depth, craft-level intervention, scaled by the cadence the operating system can sustain.",
    link: "/intelligence/what-is-organisational-consultancy",
  },
  {
    term: "Operating reality",
    slug: "operating-reality",
    definition:
      "The actual present-tense state of how an organisation runs, separate from the strategy that describes its intended future. Most leadership teams confuse the two.",
    link: "/intelligence/strategy-vs-operating-reality",
  },
  {
    term: "AI Operating Index (AIOI)",
    slug: "ai-operating-index",
    definition:
      "Deepgrain's free 8-pillar diagnostic that scores an organisation's AI operating maturity across data, tools, agents, governance, cadence, leadership, talent, and intervention readiness.",
    link: "https://aioi.deepgrain.ai",
  },
  {
    term: "Founder mode",
    slug: "founder-mode",
    definition:
      "The leadership posture of operating with founder-level authority across the system: re-deciding from first principles, ignoring formal handoffs. A muscle, not an identity.",
    link: "/intelligence/founder-mode-vs-operator-mode",
  },
  {
    term: "Operator mode",
    slug: "operator-mode",
    definition:
      "The leadership posture of compounding within a system: protecting interfaces, paying down operating debt, scaling what works. The companion muscle to founder mode.",
    link: "/intelligence/founder-mode-vs-operator-mode",
  },
  {
    term: "Operating debt",
    slug: "operating-debt",
    definition:
      "The accumulated cost of decisions deferred at the operating-system layer: stale data ownership, unmaintained workflows, governance gaps. Compounds quietly until the system can't absorb a new initiative.",
    link: "/intelligence/signals-of-operating-health",
  },
  {
    term: "AI native",
    slug: "ai-native",
    definition:
      "An organisation designed around the assumption that agents, not just employees, perform work. Different roles, different ratios, different leverage from AI-bolted-on functions.",
    link: "/intelligence/designing-the-ai-native-people-team",
  },
  {
    term: "People Ops AI Brain",
    slug: "people-ops-ai-brain",
    definition:
      "Deepgrain's working library of nine notes on running a People function with AI: domain map, workflow framework, champion model, governance, value measurement, and more.",
    link: "/brain",
  },
];
