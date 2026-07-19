import { defineTool } from "@lovable.dev/mcp-js";

/**
 * Return the canonical set of Deepgrain "pillar" pages. These are the
 * cornerstone essays the site is organised around and the best starting
 * points for anyone new to the corpus.
 */
const PILLARS = [
  {
    slug: "what-is-an-ai-operating-system",
    title: "What is an AI operating system",
    url: "https://www.deepgrain.ai/intelligence/what-is-an-ai-operating-system",
  },
  {
    slug: "five-pillars-of-ai-readiness",
    title: "The five pillars of AI readiness",
    url: "https://www.deepgrain.ai/intelligence/five-pillars-of-ai-readiness",
  },
  {
    slug: "ai-operating-ladder-five-tiers",
    title: "The AI operating ladder: five tiers",
    url: "https://www.deepgrain.ai/intelligence/ai-operating-ladder-five-tiers",
  },
  {
    slug: "setting-up-your-ai-workspace",
    title: "Setting up your AI workspace",
    url: "https://www.deepgrain.ai/intelligence/people-ops/setting-up-your-ai-workspace",
  },
];

export default defineTool({
  name: "list_pillars",
  title: "List Deepgrain pillar essays",
  description:
    "List the canonical Deepgrain pillar essays. Use this as the entry point when a caller wants an overview of the Deepgrain point of view before drilling into specific articles.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: PILLARS.map((p, i) => `${i + 1}. ${p.title}\n   ${p.url}`).join("\n\n"),
      },
    ],
    structuredContent: { pillars: PILLARS },
  }),
});
