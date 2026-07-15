export interface CaseStudy {
  id: string;
  eyebrow: string;
  headline: string;
  body: string[];
  metrics: { value: string; label: string; sub?: string }[];
  testimonial?: { quote: string; attribution: string };
  outcomes?: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "defence-tech",
    eyebrow: "Defence Technology · Series B · ~200 employees · 12 week engagement",
    headline: "83 hours reclaimed.\nEvery week.",
    body: [
      "A defence technology company scaling fast had hit the post Series B bottleneck. Manual processes couldn't keep pace with growth. Finance was buried in AP and AR admin. People Ops was fielding the same policy questions every day.",
      "The effort was there. What had never been done was a proper read of how the work actually happened, so nothing built on top of it ever quite fit.",
    ],
    metrics: [
      { value: "60%", label: "Finance time reduction" },
      { value: "70%", label: "People Ops queries eliminated" },
      { value: "2.6 to 4.0", label: "AI confidence per participant" },
    ],
    testimonial: {
      quote:
        "The coaching approach meant we built exactly what we needed, using the tools we already had. Two months on, our champions are still building and extending automations independently.",
      attribution: "Chief People Officer",
    },
    outcomes: [
      "0 critical issues in 2 months post engagement",
      "5 new agents built independently by champions",
      "6 team members onboarded via the workspace alone",
    ],
  },
  {
    id: "financial-data",
    eyebrow: "Financial Data and Analytics · ~600 employees · Multi cohort programme",
    headline: "15 people. 5 squads.\n5 deployed solutions.",
    body: [
      "A financial data business needed its People function to operate differently. Not just to use AI, but to build with it. The capability was there. The work was to move the whole team up the maturity curve together, building real tools rather than running generic training.",
      "Five cross functional workstreams. Each squad owned a specific problem and shipped a live solution. Discovery to delivery in seven weeks.",
    ],
    metrics: [
      { value: "15", label: "Participants across 2 timezones" },
      { value: "5", label: "Production tools deployed" },
      { value: "7", label: "Weeks from discovery to live solutions" },
    ],
    outcomes: [
      "AI confidence survey: pre and post delta across all participants",
      "Custom AI Playbook delivered for permanent internal use",
      "Champions continuing to build independently post programme",
    ],
  },
  {
    id: "transit-tech",
    eyebrow: "Transit Technology · PE backed · 260 employees",
    headline: "A doing problem.\nNot a training problem.",
    body: [
      "Engineering had strong AI adoption. Mandated, tracked, effective. The rest of the business had licences and a champions programme that produced no outputs. The gap was time, focus, and someone to build alongside until the tools were live and the skills sat in house.",
      "40 people across two timezone windows. One named production tool. Two internal builders who can now maintain and extend everything without external support.",
    ],
    metrics: [
      { value: "40", label: "People enabled in wave one" },
      { value: "2", label: "Internal builders trained" },
      { value: "£40k", label: "First year licence cost eliminated" },
    ],
  },
  {
    id: "climate",
    eyebrow: "Climate Consultancy · Growth stage · ~60 employees",
    headline: "The right systems\nfor the next phase.",
    body: [
      "A specialist climate consultancy scaling fast needed its Associate Lifecycle redesigned from scratch. Onboarding through to offboarding, with AI woven through every stage.",
      "A new operating model rather than a new tool. Built to compound as the organisation continued to grow.",
    ],
    metrics: [],
  },
];
