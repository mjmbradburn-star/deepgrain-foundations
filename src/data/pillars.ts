/**
 * Pillar hubs: deep-dive landing pages that group related Intelligence
 * articles into clear topic clusters. Each pillar is a single, crawlable
 * URL that consolidates authority for a head term and links out to its
 * supporting articles (the cluster). Standard SEO hub-and-spoke pattern.
 *
 * Slugs map to /intelligence/pillar/:slug. Article slugs reference
 * existing MDX in src/content/intelligence/**.
 */

export interface PillarSection {
  /** Section heading inside the pillar page. */
  heading: string;
  /** Short prose intro for this cluster. */
  intro: string;
  /** Article slugs (must exist in ARTICLES). Order is editorial. */
  articles: string[];
}

export interface Pillar {
  slug: string;
  /** Head term, used as <h1>. */
  title: string;
  /** Visible hero subtitle (also meta description fallback). */
  description: string;
  /** Optional <title> override (visible H1 stays as-is). */
  metaTitle?: string;
  /** Meta/OG description (120-160 chars). Falls back to description. */
  metaDescription?: string;
  /** Page-level keywords for meta. */
  keywords: string[];
  /** One- or two-sentence framing under the H1. */
  lede: string;
  /** Long-form prose intro shown above the cluster sections. */
  intro: string[];
  /** Topic clusters. */
  sections: PillarSection[];
  /** Optional FAQ block, rendered visibly and mirrored in FAQPage JSON-LD. */
  faqs?: { question: string; answer: string }[];
  /** Optional cross-pillar references. */
  related?: { slug: string; label: string }[];
}

export const PILLARS: Pillar[] = [
  {
    slug: "ai-operating-system",
    title: "The AI Operating System",
    description:
      "A complete deep-dive on what an AI operating system is, why it matters, and how to build one. Pillar guide with the full Deepgrain library on AI OS strategy, architecture, and adoption.",
    metaDescription: "A complete deep-dive on what an AI operating system is, why it matters, and how to build one, with the full Deepgrain library on AI OS strategy.",
    keywords: [
      "AI operating system",
      "AI OS",
      "AI infrastructure",
      "AI operating model",
      "AI platform",
      "enterprise AI",
    ],
    lede: "The connective layer between AI models and the work a company actually does.",
    intro: [
      "Most companies have AI demos. Very few have an AI operating system. The model is the engine, the AI OS is the rest of the car: the wiring, the controls, the road rules, the people who drive it. Without that layer, capability stalls at the pilot stage and never compounds into output.",
      "This pillar is the canonical Deepgrain guide. It pulls together every essay we have written on what an AI OS is, how it differs from platforms and operating models, the readiness conditions for building one, and the patterns we use when we install one inside a company. Start with the AI platform vs AI operating system comparison when the buying decision is the source of confusion.",
    ],
    sections: [
      {
        heading: "Definition and first principles",
        intro:
          "Start here. What an AI OS actually is, and the conceptual lines between system, platform, and model.",
        articles: [
          "what-is-an-ai-operating-system",
          "operating-systems-vs-operating-models",
          "from-ai-experiments-to-ai-infrastructure",
        ],
      },
      {
        heading: "Readiness and maturity",
        intro:
          "Before you build, diagnose. Five pillars of readiness, the maturity ladder, and why most pilots stall.",
        articles: [
          "five-pillars-of-ai-readiness",
          "ai-operating-ladder-five-tiers",
          "why-ai-pilots-stall-at-production",
        ],
      },
      {
        heading: "Building inside a real company",
        intro:
          "How an AI OS is installed: through operating consultancy, not a procurement cycle.",
        articles: [
          "operating-consultancy-for-ai-native-companies",
          "the-art-of-the-operating-intervention",
          "read-craft-scale-the-deepgrain-method",
        ],
      },
    ],
    related: [
      { slug: "people-ops-ai", label: "Pillar: People Ops AI" },
      { slug: "operating-leadership", label: "Pillar: Operating Leadership" },
    ],
  },
  {
    slug: "people-ops-ai",
    title: "People Ops AI: the guide for People and HR teams",
    metaTitle: "People Ops AI: a practical guide for HR teams | Deepgrain",
    description:
      "The complete Deepgrain guide to People Ops AI: where AI fits across the People function, the assistants and agents worth building, how to govern them, and where to start.",
    metaDescription:
      "People Ops AI in practice: where AI fits across the People function, the assistants and agents worth building, how to govern them, and where to start.",
    keywords: [
      "People Ops AI",
      "AI for HR teams",
      "AI for People teams",
      "People Ops AI assistant",
      "HR AI agents",
      "AI in HR",
      "AI enablement for People teams",
      "AI workspace for People Ops",
    ],
    lede: "Where AI fits in the People function, what to build first, and how to keep it running after launch week.",
    intro: [
      "People Ops AI is the use of AI models, assistants and agents to run People work: answering policy questions, coordinating onboarding, handling hiring admin, drafting documents from approved templates, and turning HR data into decisions. Done well, it moves the People team from a service desk to the system the rest of the company runs on.",
      "Most People teams start in the wrong place. They buy an assistant, point it at a policy drive nobody has cleaned in years, and wonder why the answers are wrong. The order that works is the one this guide follows: read where the function actually stands, set up a shared workspace, pick one workflow, build it end to end with a person approving the calls that matter, then govern it and measure it.",
      "Across the People estate there are five domains where AI fits differently: talent acquisition, onboarding and lifecycle, performance and development, operations and compliance, and strategy and insight. The People Ops AI domain map covers each one. Everything below is the full Deepgrain library on People Ops AI, in reading order.",
    ],
    faqs: [
      {
        question: "What is People Ops AI?",
        answer:
          "People Ops AI is the use of AI models, assistants and agents to run People work: answering policy questions, coordinating onboarding, handling hiring admin, drafting documents from approved templates, and turning HR data into decisions. It is a system, not a single tool. The model is the easy part. The data it reads, the actions it can take, the rules on what it never decides alone and the person who maintains it are what make it work.",
      },
      {
        question: "What is a People Ops AI assistant?",
        answer:
          "An assistant that answers employee and manager questions from your own policies, handbook and HR data, and hands anything sensitive to a person. The useful ones read from a clean policy library, can raise a ticket or update a record rather than only reply, and log every answer so the People team can check them. Pay, performance ratings and disciplinary matters stay with a person.",
      },
      {
        question: "Where should a People team start with AI?",
        answer:
          "With one workflow, not a platform. Pick a process that is frequent, rule-based and painful, such as onboarding coordination or policy questions, map how it actually runs today, and build the smallest honest version end to end. Once that runs on real data at real volume, the second workflow is cheaper because it reuses the same data access, tools and rules.",
      },
      {
        question: "Do we need engineers to build People Ops AI?",
        answer:
          "No. You need a champion, a workflow tool, and one clean process. A People person who understands the work and is given time to build will get further than an engineer who does not know how onboarding actually runs. Engineering help matters later, for integrations your HRIS does not expose simply.",
      },
      {
        question: "How do you keep People Ops AI safe?",
        answer:
          "Write down what AI never decides alone, keep sensitive data inside tools on the right enterprise terms, log what the AI does, and name one owner who reviews it on a set rhythm. Governance done early is what lets the rest run without a nervous manager checking every call.",
      },
    ],
    sections: [
      {
        heading: "Foundations",
        intro:
          "Diagnose where you stand, set up the workspace, and learn the prompting patterns that scale.",
        articles: [
          "diagnosing-ai-readiness-in-people-ops",
          "setting-up-your-ai-workspace",
          "prompting-patterns-for-people-ops",
          "choosing-ai-models-for-hr-work",
          "from-prompts-to-systems",
          "ai-enablement-operating-model",
        ],
      },
      {
        heading: "Systems and automation",
        intro:
          "Move from one-off prompts to connected workflows, automations, and production agents.",
        articles: [
          "the-people-ops-ai-domain-map",
          "workflow-assessment-framework",
          "automation-patterns-that-pay-off",
          "automation-audit-playbook",
          "production-agents-for-people-ops",
        ],
      },
      {
        heading: "Builders and champions",
        intro:
          "Grow internal capability, not vendor dependency. Roles, models, and how to lead the transformation.",
        articles: [
          "the-champion-model",
          "the-hr-architect-role",
          "designing-the-ai-native-people-team",
          "leading-the-ai-transformation",
        ],
      },
      {
        heading: "Governance and trust",
        intro:
          "Working with AI without trading away judgment, privacy, or accountability.",
        articles: [
          "ai-governance-for-people-teams",
          "ai-policy-blueprint-for-people-teams",
          "measuring-ai-value-in-people-ops",
        ],
      },
    ],
    related: [
      { slug: "ai-operating-system", label: "Pillar: The AI Operating System" },
    ],
  },
  {
    slug: "operating-leadership",
    title: "Operating Leadership and the Craft of Scale",
    metaTitle: "Operating Leadership and the Craft of Scale | Deepgrain",
    description:
      "A pillar deep-dive on operating leadership: reading the grain of an organisation, the disciplines of craft, and how to scale without breaking what works.",
    keywords: [
      "operating leadership",
      "organisational consultancy",
      "scaling startups",
      "operating model",
      "craft of leadership",
    ],
    lede: "The quiet discipline of running real organisations, written down.",
    intro: [
      "Operating leadership is the work that does not show up in the strategy deck: the cadence, the judgment calls, the small interventions that compound into a company that holds together at scale. Most leaders learn it in the wreckage of their own org charts. We think it can be taught.",
      "This pillar gathers Deepgrain's foundational essays on the craft: how to read an organisation, the disciplines of operating leadership, and the principles for scaling without losing the grain.",
    ],
    sections: [
      {
        heading: "Foundations of the craft",
        intro: "First principles. What organisational consultancy is, and what the grain means.",
        articles: [
          "what-is-organisational-consultancy",
          "the-grain-metaphor-reading-your-organisation",
          "founder-mode-vs-operator-mode",
          "strategy-vs-operating-reality",
          "hiring-for-the-grain",
        ],
      },
      {
        heading: "Method and practice",
        intro: "Read · Craft · Scale: how the work is done.",
        articles: [
          "read-craft-scale-the-deepgrain-method",
          "how-to-diagnose-an-organisation-in-30-days",
          "signals-of-operating-health",
          "the-art-of-the-operating-intervention",
          "why-most-change-programmes-fail",
        ],
      },
      {
        heading: "Leadership and craft",
        intro: "The disciplines of operating leadership in practice.",
        articles: [
          "the-quiet-discipline-of-operating-leadership",
          "the-craft-mindset-for-modern-operators",
          "scaling-without-breaking-the-grain",
          "what-ctos-get-wrong-about-scale",
        ],
      },
    ],
    related: [
      { slug: "ai-operating-system", label: "Pillar: The AI Operating System" },
    ],
  },
  {
    slug: "sector-operating-lenses",
    title: "AI enablement by sector",
    description:
      "AI enablement applied to specific industries: AI-native companies, climate ventures, defence tech, financial data, and transit and mobility.",
    keywords: [
      "operating consultancy",
      "sector consulting",
      "AI native",
      "climate tech",
      "defence tech",
      "fintech operating",
    ],
    lede: "The same craft, refracted through the constraints of each sector.",
    intro: [
      "Operating reality is sector-specific. The grain of a defence-tech company is not the grain of a climate venture, and the cadence of a financial-data business looks nothing like a transit operator. The method holds. The lens shifts.",
      "This pillar collects our sector essays: each one a working brief on what changes when operating consultancy meets a particular industry's physics, regulation, and rhythms.",
    ],
    sections: [
      {
        heading: "Sector essays",
        intro: "Five lenses, one method.",
        articles: [
          "operating-consultancy-for-ai-native-companies",
          "operating-consultancy-for-climate-ventures",
          "operating-consultancy-for-defence-tech",
          "operating-consultancy-for-financial-data",
          "operating-consultancy-for-transit-and-mobility",
        ],
      },
    ],
    related: [
      { slug: "operating-leadership", label: "Pillar: Operating Leadership" },
    ],
  },
];

export const getPillar = (slug: string) => PILLARS.find((p) => p.slug === slug);
