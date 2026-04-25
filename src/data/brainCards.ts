/**
 * The nine cards rendered in Section 2 ("What's Inside") of /brain.
 *
 * Hardcoded for v1 per the build brief — content is small, ships with
 * the bundle, and avoids a CMS round-trip on a lead-capture page.
 */
export interface BrainCard {
  number: string;
  title: string;
  blurb: string;
}

export const brainCards: BrainCard[] = [
  {
    number: "01",
    title: "Where AI actually belongs in People Ops",
    blurb:
      "A taxonomy that separates the work AI improves from the work it shouldn't touch.",
  },
  {
    number: "02",
    title: "The hiring loop, rebuilt",
    blurb:
      "From sourcing to scorecards: where models help, where they hurt, and what to keep human.",
  },
  {
    number: "03",
    title: "Onboarding as a system",
    blurb:
      "Designing the first ninety days so AI compounds context instead of erasing it.",
  },
  {
    number: "04",
    title: "Performance without theatre",
    blurb:
      "Calibration, feedback, and reviews when half your team is shipping with copilots.",
  },
  {
    number: "05",
    title: "Levelling and progression",
    blurb:
      "Re-grading craft when the floor of capability has moved this fast.",
  },
  {
    number: "06",
    title: "Comp in an AI-native company",
    blurb:
      "Pay frameworks for teams where leverage per person looks nothing like 2019.",
  },
  {
    number: "07",
    title: "Org design for small, dense teams",
    blurb:
      "Spans, layers, and decision rights when a team of twelve does the work of fifty.",
  },
  {
    number: "08",
    title: "The People Ops AI stack",
    blurb:
      "What we use, what we'd avoid, and the integrations worth the effort.",
  },
  {
    number: "09",
    title: "Operating cadences",
    blurb:
      "Weekly, monthly, quarterly rituals that keep a fast team coherent.",
  },
];
