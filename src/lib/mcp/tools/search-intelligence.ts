import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Full-text search over the Deepgrain Intelligence corpus using the public
 * llms-full.txt bundle (which contains the plain-text body of every article,
 * separated by clearly delimited sections). Runs entirely against the
 * published site so no build-time data is needed inside the function.
 */
export default defineTool({
  name: "search_intelligence",
  title: "Search Deepgrain Intelligence",
  description:
    "Search the Deepgrain Intelligence library (essays, guides, glossary, answers) for a keyword or phrase. Returns matching article slugs with a short snippet around the first hit.",
  inputSchema: {
    query: z.string().min(2).describe("Keyword or short phrase to search for."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .describe("Maximum number of matching articles to return. Default 8."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ query, limit }) => {
    const max = limit ?? 8;
    const res = await fetch("https://deepgrain.ai/llms-full.txt", {
      headers: { "user-agent": "deepgrain-mcp/0.1" },
    });
    if (!res.ok) {
      return {
        content: [{ type: "text", text: `Failed to fetch corpus: ${res.status}` }],
        isError: true,
      };
    }
    const text = await res.text();
    // Sections in llms-full.txt are delimited by lines that start with "# " and
    // include the article URL on the next line. Split on the URL marker to be
    // resilient to headings that also start with "#".
    const sections = text.split(/(?=\nURL: https?:\/\/[^\n]+)/g);
    const q = query.toLowerCase();
    const hits: Array<{ url: string; title: string; snippet: string }> = [];
    for (const section of sections) {
      const idx = section.toLowerCase().indexOf(q);
      if (idx === -1) continue;
      const urlMatch = section.match(/URL:\s*(\S+)/);
      const titleMatch = section.match(/^#\s+(.+)$/m);
      const start = Math.max(0, idx - 120);
      const end = Math.min(section.length, idx + q.length + 180);
      hits.push({
        url: urlMatch?.[1] ?? "(unknown)",
        title: titleMatch?.[1]?.trim() ?? "(untitled)",
        snippet: section.slice(start, end).replace(/\s+/g, " ").trim(),
      });
      if (hits.length >= max) break;
    }
    if (hits.length === 0) {
      return { content: [{ type: "text", text: `No matches for "${query}".` }] };
    }
    const rendered = hits
      .map((h, i) => `${i + 1}. ${h.title}\n   ${h.url}\n   …${h.snippet}…`)
      .join("\n\n");
    return {
      content: [{ type: "text", text: rendered }],
      structuredContent: { hits },
    };
  },
});
