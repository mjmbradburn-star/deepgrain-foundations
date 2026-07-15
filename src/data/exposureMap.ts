/**
 * The AI Exposure Map: the whole operating stack, not one function.
 *
 * Deepgrain's thesis is "from the role to the click": jobs are the wrong unit,
 * exposure lives at task level, and it applies to every general-and-
 * administrative function, not just People. Each function below carries the
 * key tasks its teams actually spend hours on, scored 0-10 for what current
 * frontier models plus workflow tooling can reliably produce with proper
 * context and a verification step. 0 is judgement that compounds; 10 is work
 * that automates. Task inventories drawn from operating engagements across
 * seven sectors.
 */

export type CapabilityLayer = "Audit" | "Human" | "Tooling" | "Embed";

export const LAYER_LABELS: Record<CapabilityLayer, string> = {
  Audit: "Audit",
  Human: "Human Enablement",
  Tooling: "Tooling Enablement",
  Embed: "Embed",
};

export interface ExposureTask {
  name: string;
  score: number; // 0 (judgment) to 10 (automates)
  layer: CapabilityLayer;
  note: string;
}

export interface ExposureRole {
  /** Operating function name. */
  role: string;
  /** Typical share of general-and-administrative effort, used for tile weighting. */
  hours: number;
  tasks: ExposureTask[];
}

export const EXPOSURE_ROLES: ExposureRole[] = [
  {
    role: "People & HR",
    hours: 14,
    tasks: [
      { name: "Employee queries and first-line advice", score: 9, layer: "Embed", note: "Grounded self-serve from your own policies, with citations" },
      { name: "Onboarding and offboarding admin", score: 9, layer: "Tooling", note: "The classic monthly manual grind, run end to end" },
      { name: "Comp benchmarking and cycle modelling", score: 8, layer: "Tooling", note: "Collection and modelling automate; the pay call does not" },
      { name: "ER case documentation and chronology", score: 8, layer: "Tooling", note: "Timelines and letter drafts. Verification is non-negotiable" },
      { name: "Difficult conversations and coaching", score: 2, layer: "Human", note: "AI preps the brief; the room is yours" },
      { name: "Org design and workforce strategy", score: 2, layer: "Audit", note: "AI widens the option set; the bet is yours" },
    ],
  },
  {
    role: "Finance & Accounting",
    hours: 14,
    tasks: [
      { name: "Invoice processing, AP and AR", score: 10, layer: "Tooling", note: "High-volume, rules-heavy, should already be automated" },
      { name: "Expense management and policy checks", score: 9, layer: "Tooling", note: "Read the receipt, apply the policy, flag the exception" },
      { name: "Reconciliations and close prep", score: 8, layer: "Tooling", note: "Matching automates; the judgement calls at close do not" },
      { name: "Management reporting and variance narratives", score: 7, layer: "Tooling", note: "Numbers and first-draft commentary; the story is reviewed" },
      { name: "Budgeting and scenario modelling", score: 6, layer: "Tooling", note: "More scenarios, faster; the trade-offs stay human" },
      { name: "Capital allocation and strategic finance", score: 2, layer: "Human", note: "The highest-stakes judgement in the function" },
    ],
  },
  {
    role: "Legal & Compliance",
    hours: 9,
    tasks: [
      { name: "Standard agreement and NDA generation", score: 9, layer: "Tooling", note: "Template plus playbook plus a human check" },
      { name: "Contract review and first-pass redlining", score: 7, layer: "Tooling", note: "High exposure, highest verification burden in the function" },
      { name: "Policy and regulatory research", score: 7, layer: "Embed", note: "Grounded retrieval across your own precedent" },
      { name: "Compliance monitoring and evidence", score: 8, layer: "Tooling", note: "Continuous evidence gathering beats the annual scramble" },
      { name: "Negotiation and counterparty relationships", score: 3, layer: "Human", note: "Trust work; the other side can tell" },
      { name: "Legal risk and strategy calls", score: 1, layer: "Human", note: "Liability lives here. Review must be active, not assumed" },
    ],
  },
  {
    role: "Revenue & Sales Ops",
    hours: 13,
    tasks: [
      { name: "CRM hygiene and data entry", score: 10, layer: "Tooling", note: "Zero reason a human does this in 2026" },
      { name: "Lead enrichment and scoring", score: 9, layer: "Tooling", note: "Enrich, rank, route against a real ICP" },
      { name: "Proposal and quote drafting", score: 8, layer: "Tooling", note: "From notes to on-brand document in minutes" },
      { name: "Pipeline reporting and forecast inputs", score: 8, layer: "Tooling", note: "The report builds itself; the commit call is human" },
      { name: "Deal desk and approvals routing", score: 7, layer: "Tooling", note: "Read, categorise, route, with sensitive deals escalated" },
      { name: "Forecast judgement and commit", score: 3, layer: "Human", note: "The number is a call, informed by the model" },
    ],
  },
  {
    role: "IT & Security",
    hours: 11,
    tasks: [
      { name: "Tier-1 helpdesk and access requests", score: 9, layer: "Embed", note: "Grounded self-serve with escalation" },
      { name: "Ticket triage and routing", score: 9, layer: "Tooling", note: "Read each one, work out what it is, route it in seconds" },
      { name: "Provisioning and de-provisioning", score: 8, layer: "Tooling", note: "Joiners and leavers, handled without a relay" },
      { name: "Log analysis and anomaly triage", score: 7, layer: "Tooling", note: "First-pass detection; the call is reviewed" },
      { name: "Documentation and runbooks", score: 8, layer: "Tooling", note: "Kept current instead of six months stale" },
      { name: "Incident response and architecture", score: 2, layer: "Audit", note: "The decisions under pressure stay human" },
    ],
  },
  {
    role: "Customer Support & Success",
    hours: 13,
    tasks: [
      { name: "Tier-1 support responses", score: 9, layer: "Embed", note: "Grounded in your docs, with a clear handoff" },
      { name: "Ticket categorisation and routing", score: 9, layer: "Tooling", note: "Messy inbound, sorted and prioritised instantly" },
      { name: "Knowledge base drafting and upkeep", score: 8, layer: "Tooling", note: "The backlog of articles nobody had time for" },
      { name: "Churn signals and account summaries", score: 7, layer: "Tooling", note: "Sentiment and usage patterns surfaced early" },
      { name: "QBR prep and account reviews", score: 8, layer: "Tooling", note: "The pack assembles; the conversation is yours" },
      { name: "Escalation and retention conversations", score: 2, layer: "Human", note: "Relationship and trust; irreplaceable" },
    ],
  },
  {
    role: "Procurement & Vendor",
    hours: 8,
    tasks: [
      { name: "PO processing and three-way match", score: 9, layer: "Tooling", note: "Reconciliation automates; relationships do not" },
      { name: "Spend analysis and vendor data", score: 8, layer: "Tooling", note: "Where the money goes, surfaced without a data pull" },
      { name: "RFP drafting and response scoring", score: 7, layer: "Tooling", note: "Draft, distribute, score against real criteria" },
      { name: "Renewal tracking and alerts", score: 8, layer: "Tooling", note: "No more auto-renew surprises" },
      { name: "Supplier negotiation", score: 3, layer: "Human", note: "AI preps the position; the deal is human" },
      { name: "Sourcing strategy and risk", score: 2, layer: "Audit", note: "Concentration and resilience are judgement calls" },
    ],
  },
  {
    role: "Executive & Chief of Staff",
    hours: 8,
    tasks: [
      { name: "Board and ELT pack preparation", score: 8, layer: "Tooling", note: "Two hundred pages to a memo is a solved problem" },
      { name: "Meeting notes to tracked actions", score: 9, layer: "Tooling", note: "Transcript to owned actions without a relay" },
      { name: "Research and competitive briefs", score: 8, layer: "Tooling", note: "The reading, done overnight" },
      { name: "Metrics dashboards and narratives", score: 7, layer: "Tooling", note: "The what automates; the so-what is human" },
      { name: "Strategy and capital-allocation bets", score: 2, layer: "Audit", note: "AI widens the options; the bet is yours" },
      { name: "Stakeholder and board relationships", score: 1, layer: "Human", note: "The moat" },
    ],
  },
];

export const TOTAL_HOURS = EXPOSURE_ROLES.reduce((s, r) => s + r.hours, 0);

export function roleAverage(role: ExposureRole): number {
  return role.tasks.reduce((s, t) => s + t.score, 0) / role.tasks.length;
}

/** Interpolated HSL colour for a 0-10 exposure score: sage → gold → deep amber. */
export function scoreColour(score: number): string {
  const stops: [number, [number, number, number]][] = [
    [0, [140, 20, 62]],
    [3, [85, 30, 66]],
    [6, [42, 55, 52]],
    [10, [28, 60, 40]],
  ];
  let a = stops[0];
  let b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (score >= stops[i][0] && score <= stops[i + 1][0]) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }
  const t = (score - a[0]) / (b[0] - a[0] || 1);
  const mix = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `hsl(${mix(a[1][0], b[1][0])} ${mix(a[1][1], b[1][1])}% ${mix(a[1][2], b[1][2])}%)`;
}
