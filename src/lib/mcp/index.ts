import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchIntelligence from "./tools/search-intelligence";
import fetchArticle from "./tools/fetch-article";
import listPillars from "./tools/list-pillars";

// Direct Supabase issuer (never the .lovable.cloud proxy). Vite inlines
// VITE_SUPABASE_PROJECT_ID as a literal at build time so this stays import-safe.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "deepgrain-mcp",
  title: "Deepgrain Intelligence",
  version: "0.1.0",
  instructions:
    "Tools for searching and reading the Deepgrain Intelligence library at deepgrain.ai. Sign in with your Deepgrain account to connect. Use `list_pillars` for orientation, `search_intelligence` to find articles by keyword, and `fetch_article` to read a specific page.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchIntelligence, fetchArticle, listPillars],
});
