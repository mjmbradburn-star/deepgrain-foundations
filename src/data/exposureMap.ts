/**
 * The People Ops AI Exposure Map.
 *
 * Task inventories drawn from twenty years inside People functions and
 * engagements across seven sectors. Scores rate what current frontier models
 * plus workflow tooling can reliably produce with proper context and a
 * verification step, 0-10, judged per task rather than per role. Hours
 * weights are typical for a People team serving 100 to 2,000 employees.
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
  role: string;
  hours: number; // typical share of team hours, used for tile weighting
  tasks: ExposureTask[];
}

export const EXPOSURE_ROLES: ExposureRole[] = [
  {
    role: "HR Business Partner",
    hours: 14,
    tasks: [
      { name: "Meeting prep and briefing packs", score: 9, layer: "Tooling", note: "Agenda, history, talking points assembled from systems" },
      { name: "Policy questions and first-line advice", score: 8, layer: "Embed", note: "Grounded answers from your own policy base, with citations" },
      { name: "Notes, follow-ups and action tracking", score: 9, layer: "Tooling", note: "Transcription to tracked actions without a human relay" },
      { name: "Stakeholder trust and influence", score: 1, layer: "Human", note: "The actual job. Compounds as the admin falls away" },
      { name: "Difficult conversations and coaching", score: 2, layer: "Human", note: "AI preps the brief; the room is yours" },
      { name: "Org sensing and reading the politics", score: 2, layer: "Human", note: "Pattern-spotting helps; judgment does not delegate" },
      { name: "Restructure and change execution", score: 4, layer: "Audit", note: "Scenario modelling automates; the calls do not" },
    ],
  },
  {
    role: "Talent Acquisition",
    hours: 16,
    tasks: [
      { name: "Sourcing and longlist building", score: 8, layer: "Tooling", note: "Search, enrich, rank against a real success profile" },
      { name: "Screening and shortlist rationale", score: 6, layer: "Embed", note: "High exposure, highest verification burden in the function" },
      { name: "Scheduling and candidate comms", score: 10, layer: "Tooling", note: "Zero reason a human does this in 2026" },
      { name: "JD and advert drafting", score: 9, layer: "Tooling", note: "From intake notes to on-brand post in minutes" },
      { name: "Interviewing and assessment", score: 3, layer: "Human", note: "Structured support, human judgment" },
      { name: "Offer negotiation and closing", score: 2, layer: "Human", note: "Trust work. Candidates can tell" },
      { name: "Hiring manager management", score: 3, layer: "Human", note: "The politics of the req is people work" },
    ],
  },
  {
    role: "Learning & Development",
    hours: 11,
    tasks: [
      { name: "Content drafting and curriculum builds", score: 8, layer: "Tooling", note: "First drafts, exercises, variants per audience" },
      { name: "Personalised learning pathways", score: 7, layer: "Embed", note: "Per-person sequencing from capability data" },
      { name: "Facilitation and live delivery", score: 2, layer: "Human", note: "Presence is the product" },
      { name: "Learning needs analysis", score: 5, layer: "Audit", note: "Signal-gathering automates; prioritisation is judgment" },
      { name: "Programme admin and logistics", score: 9, layer: "Tooling", note: "Enrolment, reminders, completion chasing" },
      { name: "Coaching and capability feedback", score: 2, layer: "Human", note: "Augmented, not replaced" },
    ],
  },
  {
    role: "People Operations",
    hours: 15,
    tasks: [
      { name: "Employee queries (tier 1)", score: 9, layer: "Embed", note: "Grounded self-serve with escalation" },
      { name: "Onboarding and offboarding admin", score: 9, layer: "Tooling", note: "The classic forty-a-month manual grind" },
      { name: "Letters, contracts and documents", score: 9, layer: "Tooling", note: "Template plus data plus check" },
      { name: "Data entry and system hygiene", score: 10, layer: "Tooling", note: "Should already be gone" },
      { name: "Process exceptions and edge cases", score: 3, layer: "Human", note: "The residue that defines the role after automation" },
      { name: "Vendor and payroll coordination", score: 6, layer: "Tooling", note: "Reconciliation automates; relationships do not" },
    ],
  },
  {
    role: "Reward, Comp & Benefits",
    hours: 9,
    tasks: [
      { name: "Benchmarking and market data pulls", score: 8, layer: "Tooling", note: "Collection and matching automate; positioning is a call" },
      { name: "Cycle modelling and scenarios", score: 7, layer: "Tooling", note: "Faster iterations, more scenarios, same owner" },
      { name: "Comp review packs and letters", score: 9, layer: "Tooling", note: "Generated, checked, personalised" },
      { name: "Pay decisions and exceptions", score: 1, layer: "Human", note: "Highest-stakes judgment in the function. Verify everything AI touches here" },
      { name: "Benefits admin and queries", score: 8, layer: "Embed", note: "Grounded answers beat the intranet PDF" },
      { name: "Equity and exec comp design", score: 2, layer: "Human", note: "Board work" },
    ],
  },
  {
    role: "Employee Relations",
    hours: 8,
    tasks: [
      { name: "Case documentation and chronology", score: 8, layer: "Tooling", note: "Timelines, evidence packs, letter drafts. Verification is non-negotiable" },
      { name: "Policy and precedent research", score: 7, layer: "Embed", note: "Grounded retrieval across your case history" },
      { name: "Investigation interviews", score: 1, layer: "Human", note: "Never delegate" },
      { name: "Case strategy and risk calls", score: 1, layer: "Human", note: "Legal exposure lives here. Review must be active, not assumed" },
      { name: "Outcome letters and comms", score: 6, layer: "Tooling", note: "Drafted, then genuinely reviewed" },
    ],
  },
  {
    role: "People Analytics",
    hours: 7,
    tasks: [
      { name: "Dashboard builds and reporting", score: 9, layer: "Tooling", note: "Question to chart without a ticket queue" },
      { name: "Survey analysis and theming", score: 8, layer: "Tooling", note: "Verbatims themed in minutes, at scale" },
      { name: "Data storytelling to the ELT", score: 3, layer: "Human", note: "The narrative is the influence" },
      { name: "Metric design and what to measure", score: 3, layer: "Audit", note: "Choosing what matters is strategy" },
      { name: "Ad-hoc data requests", score: 9, layer: "Embed", note: "Self-serve kills the backlog" },
    ],
  },
  {
    role: "Internal Comms",
    hours: 6,
    tasks: [
      { name: "Announcement and update drafting", score: 8, layer: "Tooling", note: "On-voice drafts from bullet points" },
      { name: "Channel management and scheduling", score: 9, layer: "Tooling", note: "Calendars, sends, reminders" },
      { name: "Change narrative and framing", score: 3, layer: "Human", note: "What to say and when is judgment" },
      { name: "Exec ghostwriting", score: 5, layer: "Human", note: "Drafts automate; the exec's voice needs an ear" },
      { name: "Sensitive comms (redundancy, incidents)", score: 2, layer: "Human", note: "Slow is smooth here" },
    ],
  },
  {
    role: "People Leadership",
    hours: 9,
    tasks: [
      { name: "Board and ELT pack preparation", score: 8, layer: "Tooling", note: "Two hundred pages to a memo is a solved problem" },
      { name: "People strategy and org design", score: 2, layer: "Audit", note: "AI widens the option set; the bet is yours" },
      { name: "Budget and workforce planning", score: 6, layer: "Tooling", note: "Modelling automates; trade-offs do not" },
      { name: "ELT influence and relationships", score: 1, layer: "Human", note: "The moat" },
      { name: "AI governance for People processes", score: 3, layer: "Audit", note: "The new core skill: owning the check, not just buying the tools" },
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
