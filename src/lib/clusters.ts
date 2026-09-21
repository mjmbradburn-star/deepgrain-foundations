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
  /** Short label for chips/eyebrows. */
  short: string;
  /** Slug of the pillar (see src/data/pillars.ts) this cluster sits closest to. */
  parentPillar: string;
}

export const CLUSTERS: Cluster[] = [
  {
    slug: "readiness-and-diagnosis",
    name: "Readiness and diagnosis",
    short: "Readiness",
    description: "Mapping where a People function actually stands before building anything.",
    metaDescription: "Mapping where a People function actually stands before building anything: readiness signals, diagnostic toolkits, and honest baselines.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "enablement-and-change",
    name: "Enablement and change",
    short: "Enablement",
    description: "Operating models, champions, and the change rituals that make AI stick.",
    metaDescription: "Operating models, champions, and the change rituals that make AI stick: enablement systems that outlast the launch-week energy.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "org-design-and-roles",
    name: "Org design and roles",
    short: "Org design",
    description: "New People roles, ratios, and structures when AI is infrastructure.",
    metaDescription: "New People roles, ratios, and structures when AI is infrastructure: the HR Architect, the champion model, and team design.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "governance-and-policy",
    name: "Governance and policy",
    short: "Governance",
    description: "Operating posture and policy artifacts that keep AI work safe and fast.",
    metaDescription: "Operating posture and policy artifacts that keep AI work safe and fast: blueprints People teams can defend to legal and the board.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "measurement-and-roi",
    name: "Measurement and ROI",
    short: "ROI",
    description: "Quantifying AI value, building the board narrative, defending the spend.",
    metaDescription: "Quantifying AI value, building the board narrative, and defending the spend: measurement frameworks for People Ops AI work.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "workflows-and-automation",
    name: "Workflows and automation",
    short: "Workflows",
    description: "Audit, prioritise, and rebuild People workflows with AI in the loop.",
    metaDescription: "Audit, prioritise, and rebuild People workflows with AI in the loop: assessment frameworks and automation patterns that pay off.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "agents-and-systems",
    name: "Agents and systems",
    short: "Agents",
    description: "Production agents and connected systems that run between sessions.",
    metaDescription: "Production agents and connected systems that run between sessions: from prompts and demos to infrastructure People Ops can rely on.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "workspace-and-tools",
    name: "Workspace and tools",
    short: "Workspace",
    description: "Persistent workspaces, model selection, and the daily tooling layer.",
    metaDescription: "Persistent workspaces, model selection, and the daily tooling layer: setting up an AI workspace People teams actually use.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "prompting-and-craft",
    name: "Prompting and craft",
    short: "Craft",
    description: "Prompting patterns, evaluation habits, and the craft underneath the systems.",
    metaDescription: "Prompting patterns, evaluation habits, and the craft underneath the systems: how People operators get reliable output from models.",
    parentPillar: "ai-workspace-for-people-ops",
  },
];

export const CLUSTERS_BY_SLUG: Record<ClusterSlug, Cluster> = Object.fromEntries(
  CLUSTERS.map((c) => [c.slug, c])
) as Record<ClusterSlug, Cluster>;

export const getCluster = (slug: string): Cluster | undefined =>
  CLUSTERS_BY_SLUG[slug as ClusterSlug];
