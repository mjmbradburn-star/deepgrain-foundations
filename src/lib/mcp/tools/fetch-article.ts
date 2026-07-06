import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Fetch a single Deepgrain Intelligence article (or any deepgrain.ai page)
 * as HTML text. Callers pass either a full deepgrain.ai URL or an
 * article slug, which is resolved against /intelligence/<slug>.
 */
export default defineTool({
  name: "fetch_article",
  title: "Fetch a Deepgrain article",
  description:
    "Fetch a Deepgrain page by URL or an Intelligence article by slug. Returns the raw HTML so the caller can parse or cite it.",
  inputSchema: {
    urlOrSlug: z
      .string()
      .min(1)
      .describe(
        "A full https://deepgrain.ai URL, or an Intelligence article slug like 'ai-operating-ladder-five-tiers'.",
      ),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ urlOrSlug }) => {
    let target: string;
    if (/^https?:\/\//i.test(urlOrSlug)) {
      const parsed = new URL(urlOrSlug);
      if (!/(^|\.)deepgrain\.ai$/i.test(parsed.hostname)) {
        return {
          content: [
            { type: "text", text: "Only deepgrain.ai URLs are allowed." },
          ],
          isError: true,
        };
      }
      target = parsed.toString();
    } else {
      const slug = urlOrSlug.replace(/^\/+/, "").replace(/\/+$/, "");
      target = `https://deepgrain.ai/intelligence/${slug}`;
    }

    const res = await fetch(target, {
      headers: { "user-agent": "deepgrain-mcp/0.1" },
      redirect: "follow",
    });
    if (!res.ok) {
      return {
        content: [{ type: "text", text: `Failed to fetch ${target}: ${res.status}` }],
        isError: true,
      };
    }
    const html = await res.text();
    return {
      content: [{ type: "text", text: html.slice(0, 200_000) }],
      structuredContent: { url: target, status: res.status },
    };
  },
});
