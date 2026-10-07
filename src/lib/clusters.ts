/**
 * Topic clusters for SEO-ready "related articles" modules.
 *
 * A cluster is a stable, human-curated topic grouping that sits BELOW the
 * Intelligence track + category and ABOVE free-form keywords. Pillar and
 * topic pages use clusters (not raw keywords) to render related modules,
 * so the recommendations stay coherent even as new articles ship.
 *
 * Each article declares:
 *   - `primaryCluster`: the single best home for this piece.
 *   - `clusters`: 1–3 additional clusters it strongly contributes to.
 *
 * Add a new cluster here first, then tag articles. Slugs are stable and
 * appear in URLs (e.g. /intelligence/cluster/measurement-and-roi).
 */

export type ClusterSlug =
  | "readiness-and-diagnosis"
  | "enablement-and-change"
  | "org-design-and-roles"
  | "governance-and-policy"
  | "measurement-and-roi"
  | "workflows-and-automation"
  | "agents-and-systems"
  | "workspace-and-tools"
  | "prompting-and-craft";

export interface Cluster {
  slug: ClusterSlug;
  name: string;
  /** Visible intro under the H1. */
  description: string;
  /** Meta/OG description (120-160 chars). Falls back to description. */
  metaDescription?: string;
  /** Editorial guidance specific to this cluster. */
  guide?: { heading: string; body: string }[];
  /** Short label for chips/eyebrows. */
  short: string;
  /** Slug of the pillar (see src/data/pillars.ts) this cluster sits closest to. */
  parentPillar: string;
}

export const CLUSTERS: Cluster[] = [
  {
    slug: "readiness-and-diagnosis",
    guide: [
      {
        heading: "Establish the starting point",
        body: "Choose a function or workflow and record its current data, tools, skills and review process. A baseline should expose constraints before a pilot starts. The diagnostic articles below help distinguish a missing capability from a process that simply needs clearer ownership.",
      },
    ],
    name: "Readiness and diagnosis",
    short: "Readiness",
    description:
      "Mapping where a People function actually stands before building anything.",
    metaDescription:
      "Mapping where a People function actually stands before building anything: readiness signals, diagnostic toolkits, and honest baselines.",
    parentPillar: "people-ops-ai",
  },
  {
    slug: "enablement-and-change",
    guide: [
      {
        heading: "Turn training into a working routine",
        body: "Choose a real task, let the team practise on it and make time to compare the results. Champions need access to the sources and someone to ask when a workflow fails. The articles below focus on adoption, learning and weekly habits, rather than changing the organisation chart before anyone has built anything.",
      },
      {
        heading: "Look for use after launch",
        body: "Attendance is not adoption. Look at whether the workflow is used, whether people trust the review step and whether the same friction keeps sending them back to manual work. Use those observations to change the training or the process. Role design belongs in the org design cluster; here the question is what makes the new way of working stick.",
      },
    ],
    name: "Enablement and change",
    short: "Enablement",
    description:
      "Operating models, champions, and the change rituals that make AI stick.",
    metaDescription:
      "Operating models, champions, and the change rituals that make AI stick: enablement systems that outlast the launch-week energy.",
    parentPillar: "people-ops-ai",
  },
  {
    slug: "org-design-and-roles",
    guide: [
      {
        heading: "Assign the work before naming the role",
        body: "List who maintains source data, builds workflows, reviews uncertain outputs and decides when a system should stop. Identify which responsibilities are missing and which already fit existing roles. The articles below examine People team structure, champions and ownership. A new job title is useful only when the work and accountability are clear.",
      },
      {
        heading: "Keep adoption and accountability distinct",
        body: "Enablement teaches people how to use a capability. Organisation design decides who owns it when something changes or breaks. Make those responsibilities explicit before changing reporting lines or headcount assumptions. Use the enablement cluster for learning routines, and this cluster for the structure that supports them.",
      },
    ],
    name: "Org design and roles",
    short: "Org design",
    description:
      "New People roles, ratios, and structures when AI is infrastructure.",
    metaDescription:
      "New People roles, ratios, and structures when AI is infrastructure: the HR Architect, the champion model, and team design.",
    parentPillar: "people-ops-ai",
  },
  {
    slug: "governance-and-policy",
    guide: [
      {
        heading: "Define the boundary before deployment",
        body: "Identify what data a workflow may read, which actions it may take and which decisions require a person. Write a stop condition for missing or conflicting information. These articles turn policy into checks operators can use, rather than a document nobody consults during the work.",
      },
      {
        heading: "Make policy maintainable",
        body: "Give each approved source and review rule an owner. Log exceptions and check whether the policy still matches the workflow as it changes. The governance category collects the wider argument; this cluster is a practical route through boundaries, source hygiene and operating checks.",
      },
    ],
    name: "Governance and policy",
    short: "Governance",
    description:
      "Operating posture and policy artifacts that keep AI work safe and fast.",
    metaDescription:
      "Operating posture and policy artifacts that keep AI work safe and fast: blueprints People teams can defend to legal and the board.",
    parentPillar: "people-ops-ai",
  },
  {
    slug: "measurement-and-roi",
    guide: [
      {
        heading: "Measure what changed",
        body: "Record handling time, waiting time, rework and errors before a build. Compare the same measures after a bounded pilot. Separate time released from time actually redeployed, and keep the assumptions visible when presenting value to the board.",
      },
    ],
    name: "Measurement and ROI",
    short: "ROI",
    description:
      "Quantifying AI value, building the board narrative, defending the spend.",
    metaDescription:
      "Quantifying AI value, building the board narrative, and defending the spend: measurement frameworks for People Ops AI work.",
    parentPillar: "people-ops-ai",
  },
  {
    slug: "workflows-and-automation",
    guide: [
      {
        heading: "Start with the handoffs",
        body: "Map one workflow from trigger to completed outcome. Record which systems it crosses, where someone rekeys data and where a decision waits. The workflow assessment and automation audit articles below help you choose a bounded first build, rather than automate a process nobody can explain.",
      },
      {
        heading: "Rules first, judgement where needed",
        body: "Use a fixed rule for a fixed result. Use AI for interpretation, drafting and context, with a defined reviewer. A shared People Ops system supplies the data and permission boundaries; this cluster focuses on the individual workflows inside it. Compare AI OS vs automation before choosing the layer.",
      },
    ],
    name: "Workflows and automation",
    short: "Workflows",
    description:
      "Audit, prioritise, and rebuild People workflows with AI in the loop.",
    metaDescription:
      "Audit, prioritise, and rebuild People workflows with AI in the loop: assessment frameworks and automation patterns that pay off.",
    parentPillar: "people-ops-ai",
  },
  {
    slug: "agents-and-systems",
    guide: [
      {
        heading: "Design beyond a single session",
        body: "An agent needs approved sources, tools, permissions and a way to surface uncertain work. Start with one bounded workflow and define what happens when an input is missing or a tool fails. The articles below focus on connected systems that remain understandable to the people responsible for them.",
      },
    ],
    name: "Agents and systems",
    short: "Agents",
    description:
      "Production agents and connected systems that run between sessions.",
    metaDescription:
      "Production agents and connected systems that run between sessions: from prompts and demos to infrastructure People Ops can rely on.",
    parentPillar: "people-ops-ai",
  },
  {
    slug: "workspace-and-tools",
    guide: [
      {
        heading: "Build the daily work surface",
        body: "Start with where people keep context, find approved information and return to unfinished work. Choose tools against those needs, not a feature list. The workspace articles below cover persistent context, model choice and shared setup. A working workspace should make the next task easier without creating another place to hunt for the source of truth.",
      },
      {
        heading: "Separate the tool from the technique",
        body: "A workspace is the environment. Prompting is the method used inside it. Decide how sources, permissions and reusable material live in the workspace, then use the prompting and craft cluster to improve individual outputs. Test the setup with a real recurring task before rolling it out to the whole team.",
      },
    ],
    name: "Workspace and tools",
    short: "Workspace",
    description:
      "Persistent workspaces, model selection, and the daily tooling layer.",
    metaDescription:
      "Persistent workspaces, model selection, and the daily tooling layer: setting up an AI workspace People teams actually use.",
    parentPillar: "people-ops-ai",
  },
  {
    slug: "prompting-and-craft",
    guide: [
      {
        heading: "Make one output reliable",
        body: "Pick a task whose result someone can check. Give the model the source material, explain the required result and define what it must not infer. Save examples of good and bad outputs so changes can be tested rather than judged by how fluent they sound. This cluster is about the working method, not which workspace to buy.",
      },
      {
        heading: "Check the answer before widening the scope",
        body: "Evaluate factual accuracy, omissions and usefulness on the same small set of examples. Change one part of the instructions at a time and record what improved. When a prompt starts needing persistent data, permissions or several handoffs, move from an isolated prompt to a workflow or system. Better wording alone cannot supply missing ownership.",
      },
    ],
    name: "Prompting and craft",
    short: "Craft",
    description:
      "Prompting patterns, evaluation habits, and the craft underneath the systems.",
    metaDescription:
      "Prompting patterns, evaluation habits, and the craft underneath the systems: how People operators get reliable output from models.",
    parentPillar: "people-ops-ai",
  },
];

export const CLUSTERS_BY_SLUG: Record<ClusterSlug, Cluster> =
  Object.fromEntries(CLUSTERS.map((c) => [c.slug, c])) as Record<
    ClusterSlug,
    Cluster
  >;

export const getCluster = (slug: string): Cluster | undefined =>
  CLUSTERS_BY_SLUG[slug as ClusterSlug];
