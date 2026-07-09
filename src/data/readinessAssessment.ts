/**
 * The People Ops AI Readiness Assessment.
 *
 * Sixteen questions, four per capability layer (Audit, Human Enablement,
 * Tooling Enablement, Embed). Each answer carries 0-3 points; layer scores
 * normalise to 0-100 and the headline score is the equal-weight mean.
 * One honest number, no vanity scoring: the copy is deliberately blunt.
 */

export const LAYERS = [
  "Audit",
  "Human Enablement",
  "Tooling Enablement",
  "Embed",
] as const;

export type LayerIndex = 0 | 1 | 2 | 3;

export interface AssessmentQuestion {
  layer: LayerIndex;
  question: string;
  options: { label: string; points: 0 | 1 | 2 | 3 }[];
}

export const QUESTIONS: AssessmentQuestion[] = [
  // Layer 1: Audit
  {
    layer: 0,
    question:
      "Could you name, today, the ten workflows where your People team loses the most hours?",
    options: [
      { label: "We have them documented with hours attached", points: 3 },
      { label: "We could name them but have never measured", points: 2 },
      { label: "We have a rough sense", points: 1 },
      { label: "No, and nobody has asked", points: 0 },
    ],
  },
  {
    layer: 0,
    question: "When did you last map a People process end to end, handoffs and all?",
    options: [
      { label: "In the last six months", points: 3 },
      { label: "In the last two years", points: 2 },
      { label: "Only when something broke", points: 1 },
      { label: "We do not map processes", points: 0 },
    ],
  },
  {
    layer: 0,
    question: "Do you know what your team's manual work actually costs per year?",
    options: [
      { label: "Yes, in pounds, and the ELT has seen it", points: 3 },
      { label: "We have an internal estimate", points: 2 },
      { label: "We talk about it but have no number", points: 1 },
      { label: "No idea", points: 0 },
    ],
  },
  {
    layer: 0,
    question:
      "If a task that costs £100 of team time dropped to £1, do you know which work you would do more of?",
    options: [
      { label: "Yes, we keep a list of exactly that work", points: 3 },
      { label: "We have discussed it informally", points: 2 },
      { label: "Interesting question, no answer", points: 1 },
      { label: "We are too busy to think about it", points: 0 },
    ],
  },
  // Layer 2: Human Enablement
  {
    layer: 1,
    question: "How many people on your team use AI beyond drafting the odd email?",
    options: [
      { label: "Most, with real workflows of their own", points: 3 },
      { label: "A handful of quiet power users", points: 2 },
      { label: "One or two experimenters", points: 1 },
      { label: "Effectively none", points: 0 },
    ],
  },
  {
    layer: 1,
    question:
      "Could you name the two or three people on your team whose AI output is a multiple of everyone else's?",
    options: [
      { label: "Yes, and they have budget and aircover", points: 3 },
      { label: "Yes, but we treat them like everyone else", points: 2 },
      { label: "I suspect who they are", points: 1 },
      { label: "We do not think in those terms", points: 0 },
    ],
  },
  {
    layer: 1,
    question:
      "Has anyone taught your team to challenge AI output rather than accept it when it looks polished?",
    options: [
      { label: "Yes, verification is part of our training", points: 3 },
      { label: "We tell people to double-check, informally", points: 2 },
      { label: "We assume seniors will catch errors", points: 1 },
      { label: "We have not thought about it", points: 0 },
    ],
  },
  {
    layer: 1,
    question: "What happens to the hours AI saves someone on your team?",
    options: [
      { label: "Redeployed deliberately to judgment work", points: 3 },
      { label: "Absorbed into more of the same", points: 2 },
      { label: "Unclear, we do not track it", points: 1 },
      { label: "AI is not saving us hours yet", points: 0 },
    ],
  },
  // Layer 3: Tooling Enablement
  {
    layer: 2,
    question:
      "Does your People team have any workflow where AI runs a process, not just answers questions?",
    options: [
      { label: "Several, in production, with owners", points: 3 },
      { label: "One or two pilots", points: 2 },
      { label: "Demos that never went live", points: 1 },
      { label: "None", points: 0 },
    ],
  },
  {
    layer: 2,
    question:
      "When AI drafts something consequential (a letter, a comp pack, a case chronology), what checks it?",
    options: [
      {
        label: "A defined verification step that does not rely on someone staying alert",
        points: 3,
      },
      { label: "A named human reviews it", points: 2 },
      { label: "Whoever generated it re-reads it", points: 1 },
      { label: "Nothing formal", points: 0 },
    ],
  },
  {
    layer: 2,
    question:
      "Can your team's AI tools see your actual policies, precedents and data, or do they answer from thin air?",
    options: [
      { label: "Grounded in our own sources, with citations", points: 3 },
      { label: "Partially, for some tools", points: 2 },
      { label: "No, people paste things in ad hoc", points: 1 },
      { label: "Not applicable, no real tools", points: 0 },
    ],
  },
  {
    layer: 2,
    question: "Who builds automation for the People team?",
    options: [
      { label: "We build and own it ourselves, with support", points: 3 },
      { label: "IT or an external partner builds it for us", points: 2 },
      { label: "Whatever the HRIS vendor ships", points: 1 },
      { label: "Nobody", points: 0 },
    ],
  },
  // Layer 4: Embed
  {
    layer: 3,
    question:
      "If your best AI-fluent person left tomorrow, what happens to the workflows they built?",
    options: [
      { label: "Documented, owned, they survive", points: 3 },
      { label: "Someone could probably pick them up", points: 2 },
      { label: "They leave with the person", points: 1 },
      { label: "There is nothing to lose", points: 0 },
    ],
  },
  {
    layer: 3,
    question:
      "Is there a written standard for where AI may and may not touch People decisions (hiring, comp, ER)?",
    options: [
      { label: "Yes, with verification requirements per risk level", points: 3 },
      { label: "A draft or informal norms", points: 2 },
      { label: "We rely on individual judgment", points: 1 },
      { label: "No, and AI is already touching them", points: 0 },
    ],
  },
  {
    layer: 3,
    question:
      "Does AI capability show up in your People team's roles, goals or development plans?",
    options: [
      { label: "Yes, it is in the operating model", points: 3 },
      { label: "In some job ads and appraisals", points: 2 },
      { label: "We mention it in team meetings", points: 1 },
      { label: "No", points: 0 },
    ],
  },
  {
    layer: 3,
    question:
      "When a new AI capability ships, how does your team find out what it means for them?",
    options: [
      { label: "A named owner assesses and briefs us", points: 3 },
      { label: "Enthusiasts share things around", points: 2 },
      { label: "We hear about it from vendors", points: 1 },
      { label: "We do not", points: 0 },
    ],
  },
];

export interface Stage {
  min: number;
  name: string;
  read: string;
}

export const STAGES: Stage[] = [
  {
    min: 0,
    name: "Pre-audit",
    read: "You are not behind because you lack tools. You are behind because nobody has measured where the time goes. Start with the map, not the software.",
  },
  {
    min: 30,
    name: "Aware",
    read: "Pockets of use, no system. The good news: the next twenty points are the cheapest you will ever buy, because they come from an audit and a handful of power users, not a platform.",
  },
  {
    min: 55,
    name: "Building",
    read: "Real capability forming, unevenly. The risk now is silent quality drift: adoption is outrunning verification. Governance is the unlock, not more tools.",
  },
  {
    min: 75,
    name: "Operating",
    read: "You run AI-native workflows with owners and checks. The frontier is embedding: making it survive personnel change and putting judgment gates in writing.",
  },
  {
    min: 90,
    name: "Compounding",
    read: "Rare air. Your constraint is no longer capability, it is how fast the rest of the business can absorb what your People function can now do.",
  },
];

export interface GapCopy {
  title: string;
  detail: string;
  fix: string;
}

export const GAPS: Record<LayerIndex, GapCopy> = {
  0: {
    title: "The Audit gap",
    detail:
      "You cannot prioritise what you have not measured. A two-week teardown of where the hours go turns AI from a vendor conversation into a costed plan.",
    fix: "Fix: the audit",
  },
  1: {
    title: "The Human gap",
    detail:
      "Tools without fluency produce polished, unverified output. Finding and backing your strongest operators beats training everyone to a baseline, and verification discipline beats enthusiasm.",
    fix: "Fix: enablement",
  },
  2: {
    title: "The Tooling gap",
    detail:
      "Chat is not a workflow. The value is in systems that run a process with your data, your policies, and a check that does not depend on a tired reviewer.",
    fix: "Fix: tooling build",
  },
  3: {
    title: "The Embed gap",
    detail:
      "Capability that lives in one person's head is a resignation letter away from zero. Written standards, owners and judgment gates make it permanent.",
    fix: "Fix: embed",
  },
};

export interface AssessmentResult {
  score: number;
  layerScores: number[];
  stage: Stage;
  weakestLayers: LayerIndex[];
}

export function scoreAssessment(answers: number[]): AssessmentResult {
  const layerScores = ([0, 1, 2, 3] as LayerIndex[]).map((layer) => {
    const idxs = QUESTIONS.map((q, i) => ({ q, i })).filter((x) => x.q.layer === layer);
    const got = idxs.reduce((sum, x) => sum + (answers[x.i] ?? 0), 0);
    return Math.round((got / (idxs.length * 3)) * 100);
  });
  const score = Math.round(layerScores.reduce((a, b) => a + b, 0) / layerScores.length);
  let stage = STAGES[0];
  for (const s of STAGES) if (score >= s.min) stage = s;
  const weakestLayers = ([0, 1, 2, 3] as LayerIndex[])
    .slice()
    .sort((a, b) => layerScores[a] - layerScores[b])
    .slice(0, 2);
  return { score, layerScores, stage, weakestLayers };
}
