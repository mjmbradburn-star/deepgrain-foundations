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
  description: string;
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
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "enablement-and-change",
    name: "Enablement and change",
    short: "Enablement",
    description: "Operating models, champions, and the change rituals that make AI stick.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "org-design-and-roles",
    name: "Org design and roles",
    short: "Org design",
    description: "New People roles, ratios, and structures when AI is infrastructure.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "governance-and-policy",
    name: "Governance and policy",
    short: "Governance",
    description: "Operating posture and policy artifacts that keep AI work safe and fast.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "measurement-and-roi",
    name: "Measurement and ROI",
    short: "ROI",
    description: "Quantifying AI value, building the board narrative, defending the spend.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "workflows-and-automation",
    name: "Workflows and automation",
    short: "Workflows",
    description: "Audit, prioritise, and rebuild People workflows with AI in the loop.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "agents-and-systems",
    name: "Agents and systems",
    short: "Agents",
    description: "Production agents and connected systems that run between sessions.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "workspace-and-tools",
    name: "Workspace and tools",
    short: "Workspace",
    description: "Persistent workspaces, model selection, and the daily tooling layer.",
    parentPillar: "ai-workspace-for-people-ops",
  },
  {
    slug: "prompting-and-craft",
    name: "Prompting and craft",
    short: "Craft",
    description: "Prompting patterns, evaluation habits, and the craft underneath the systems.",
    parentPillar: "ai-workspace-for-people-ops",
  },
];

export const CLUSTERS_BY_SLUG: Record<ClusterSlug, Cluster> = Object.fromEntries(
  CLUSTERS.map((c) => [c.slug, c])
) as Record<ClusterSlug, Cluster>;

export const getCluster = (slug: string): Cluster | undefined =>
  CLUSTERS_BY_SLUG[slug as ClusterSlug];
