import { defineMcp } from "@lovable.dev/mcp-js";
import searchIntelligence from "./tools/search-intelligence";
import fetchArticle from "./tools/fetch-article";
import listPillars from "./tools/list-pillars";

export default defineMcp({
  name: "deepgrain-mcp",
  title: "Deepgrain Intelligence",
  version: "0.1.0",
  instructions:
    "Tools for searching and reading the Deepgrain Intelligence library at deepgrain.ai. Use `list_pillars` for orientation, `search_intelligence` to find articles by keyword, and `fetch_article` to read a specific page.",
  tools: [searchIntelligence, fetchArticle, listPillars],
});
