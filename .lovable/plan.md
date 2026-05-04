# Plan: Mine the Notion Knowledge Vault into Intelligence content

I can see your public Notion vault. It has ~30 deep pieces across 6 themes (AI prompting, enablement & operating models, frameworks/diagnostics, leadership, culture/values, research reports). This is a goldmine for the Intelligence section. Here's how I'll turn it into ranking, citation-worthy articles without burning credits.

## Approach (2 rings)

### Ring 1: Ingest the vault (one-time scrape)

1. Use a small Node script (server-side, no credit-heavy LLM calls) to:
   - Hit each Notion subpage URL via the public `notion.site` HTML endpoint
   - Extract title, body markdown, headings, and outbound links
   - Save raw markdown to `/tmp/vault/<id>-<slug>.md` for inspection
   - Save a manifest at `docs/vault/manifest.json` (id, title, theme, source URL, word count)
2. If `notion.site` blocks plain fetch (it often hydrates client-side), fall back to the Firecrawl connector (already noted as available). One scrape per page = ~30 credits, well within budget.

I will NOT commit the raw scrapes to the repo. They live in `/tmp` and a small `docs/vault/manifest.json` index.

### Ring 2: Distil into Intelligence articles

Map vault content to the existing Intelligence taxonomy, then produce/refresh articles. Proposed mapping:

| Vault source | Target Intelligence article | Status |
|---|---|---|
| Ultimate Guide to Effective Prompts (439) + Prompt Engineering, Chaining (493) + GPT-4.1 prompting (570) | NEW `prompting-patterns-for-people-ops.mdx` | create |
| Best AI for HR Tasks (453) | NEW `choosing-ai-models-for-hr-work.mdx` | create |
| AI Maturity Assessment (535) + Building an AI-Ready People Function (612) | refresh `diagnosing-ai-readiness-in-people-ops.mdx` (currently thin) | rewrite |
| Systems & Orchestration deep guide (626) + Workflows, Automations & Agents (682) | refresh `from-prompts-to-systems.mdx` | rewrite |
| Enabling AI - Head to CHRO (598) + AI Enablement That Actually Scales (668) | NEW `ai-enablement-operating-model.mdx` | create |
| AI-Driven HR Automation with n8n (584) + 100x business with production agents (654) | NEW `production-agents-for-people-ops.mdx` | create |
| One stop shop AI policy (640) | NEW `ai-policy-blueprint-for-people-teams.mdx` | create |
| Strategic Automation Audit Workshop (738) | NEW `automation-audit-playbook.mdx` | create |
| Underperformance Early Warning (759) + People as a Product (787) + 90-Day Roadmap (773) | NEW `people-ops-diagnostic-toolkit.mdx` (toolkit hub) | create |
| Untouchable HR Architect (696) + AI Isn't Taking Jobs Yet (724) | NEW `the-hr-architect-role.mdx` | create |
| Engineering Manager Action Guide (808) + Engineering Feedback (822) | NEW `coaching-and-feedback-systems.mdx` | create |
| 10x Values Development (843) + Why values projects fail (857) | NEW `designing-values-that-stick.mdx` | create |
| FinEdge AI Roadmap Report (892) + Equity report (878) | NEW `ai-roadmap-case-study-finedge.mdx` (case study format) | create |
| Leveraging GenAI for People Debt (556) | NEW `people-debt-and-genai.mdx` | create |

That's 4 rewrites + 11 new long-form articles = 15 pieces.

### Article production rules

- 1,200 to 1,800 words each, in Matt's voice (short, direct, no em dashes).
- Each draft uses the vault source as raw material, paraphrased and restructured. No verbatim copy.
- Every article includes:
  - `Article` JSON-LD with the central Person `@id` (already wired in `IntelligenceArticle.tsx`)
  - 2-4 internal links into the existing cluster (AI OS pillar, AI workspace, glossary, answers)
  - 1-2 outbound contextual links to the original Notion page as "deeper reference" (helps reciprocal authority signals when you cross-link from Notion back)
  - FAQ block (3-5 Qs) reused into `data/answers.ts` where appropriate
- Add each new slug to `sitemap.xml`, `llms.txt`, and the Intelligence index.

### Credit budget

- Scraping: ~30 Firecrawl calls (cheap, one-shot)
- Drafting: I'll write articles directly using vault material as source, no AI generation calls needed. Zero LLM credits.
- Total: minimal Firecrawl spend, no Lovable AI spend.

## Technical detail

- New script: `scripts/scrape-vault.ts` (run once, gitignored output to `/tmp/vault/`)
- New committed file: `docs/vault/manifest.json` (small, human-readable index)
- New MDX files in `src/content/intelligence/` and `src/content/intelligence/people-ops/`
- Updates to: `public/sitemap.xml`, `public/llms.txt`, `public/llms-full.txt`, `src/data/answers.ts` (FAQ reuse)
- No DB / no edge functions / no schema changes

## Execution order once approved

1. Run scraper, build manifest (1 step)
2. Show you the manifest + proposed slug list for a final tweak (optional)
3. Produce 4 rewrites first (highest SEO leverage on existing thin pages)
4. Produce 11 new articles in batches of 3-4
5. Update sitemap, llms.txt, internal link rails, FAQ data
6. Trigger IndexNow re-ping (already automated)

If you want, I can skip step 2 and go straight through. Approve and I'll start with the scrape + the 4 rewrites in the next session.
