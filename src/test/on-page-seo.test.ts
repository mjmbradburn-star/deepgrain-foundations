import { describe, expect, it } from "vitest";
import { ARTICLES } from "@/lib/intelligence";
import { ANSWERS } from "@/data/answers";
import { COMPARES } from "@/data/compares";
import { existsSync, readFileSync } from "node:fs";

const titleFor = (title: string) => {
  const suffix = " | Deepgrain";
  if (title.length + suffix.length <= 60) return title + suffix;
  if (title.length <= 60) return title;
  return title.slice(0, 57).trimEnd() + "…";
};

describe("on-page SEO guardrails", () => {
  it("keeps every article title within the visible search-result band", () => {
    for (const { frontmatter } of ARTICLES) {
      expect(titleFor(frontmatter.title).length, frontmatter.slug).toBeGreaterThanOrEqual(30);
      expect(titleFor(frontmatter.title).length, frontmatter.slug).toBeLessThanOrEqual(60);
    }
  });

  it("keeps every article description between 120 and 160 characters", () => {
    for (const { frontmatter } of ARTICLES) {
      expect(frontmatter.description.length, frontmatter.slug).toBeGreaterThanOrEqual(120);
      expect(frontmatter.description.length, frontmatter.slug).toBeLessThanOrEqual(160);
    }
  });

  it("does not re-create the merged AI platform answer URL", () => {
    const retiredAnswers = [
      "ai-os-vs-ai-platform",
      "how-to-identify-efficiency-gaps-ai-can-fill",
      "how-does-ai-improve-business-efficiency",
      "what-is-an-ai-operating-system",
      "what-is-an-ai-os",
      "what-is-an-ai-based-operating-system",
      "what-is-an-ai-powered-operating-system",
      "ai-os-vs-operating-model",
      "how-to-build-an-ai-operating-system",
      "five-pillars-of-ai-readiness",
      "why-ai-pilots-stall-at-production",
      "ai-operating-ladder",
      "what-is-an-ai-workspace",
      "ai-os-vs-automation",
    ];
    for (const slug of retiredAnswers) {
      expect(ANSWERS.some((answer) => answer.slug === slug), slug).toBe(false);
    }
  });

  it("keeps the raw SPA shell noindex until a crawlable route overrides it", () => {
    const shell = readFileSync("index.html", "utf8");
    expect(shell).toContain('name="robots" content="noindex, follow"');
    expect(shell).toContain('name="googlebot" content="noindex, follow"');
    const pageMeta = readFileSync("src/components/seo/PageMeta.tsx", "utf8");
    expect(pageMeta).toContain("index,follow,max-image-preview:large,max-snippet:-1");
    const prerender = readFileSync("scripts/prerender-intelligence.mjs", "utf8");
    expect(prerender).toContain('["name", "googlebot"]');
  });

  it("uses the canonical www origin in static discovery files", () => {
    for (const file of ["index.html", "public/humans.txt", "public/ai.txt"]) {
      const text = readFileSync(file, "utf8");
      expect(text, file).not.toContain("https://deepgrain.ai");
    }
  });

  it("keeps comparison metadata inside title and description bands", () => {
    for (const page of COMPARES) {
      expect((page.metaTitle ?? titleFor(page.title)).length, page.slug).toBeLessThanOrEqual(60);
      expect(page.description.length, page.slug).toBeGreaterThanOrEqual(120);
      expect(page.description.length, page.slug).toBeLessThanOrEqual(160);
    }
  });

  it("emits article:tag metadata from article keywords", () => {
    const page = readFileSync("src/pages/IntelligenceArticle.tsx", "utf8");
    expect(page).toContain('property="article:tag"');
    expect(page).toContain("f.keywords?.map");
  });


  it("keeps the business training method and HowTo schema in lockstep", () => {
    const page = readFileSync("src/pages/BusinessTeamAITraining.tsx", "utf8");
    expect(page).toContain('"@type": "HowTo"');
    expect(page).toContain('"@type": "HowToStep"');
    expect(page).toContain("step: steps.map");
    expect(page).toContain("id={`step-${Number(step.n)}`}");
  });


  it("maps the target-five queries into the training page metadata", () => {
    const page = readFileSync("src/pages/BusinessTeamAITraining.tsx", "utf8");
    for (const query of [
      "AI training for commercial teams",
      "AI enablement for operations teams",
      "Claude training for business teams",
      "ChatGPT and Claude training for companies",
      "AI audit and training workshop for companies",
    ]) expect(page).toContain(query);
    expect(page).toContain("keywords={TRAINING_KEYWORDS}");
    expect(page).toContain('keywords: TRAINING_KEYWORDS.join');
  });


  it("includes the expanded training offer in the sitewide service entity", () => {
    const entity = readFileSync("src/components/seo/SiteEntityLd.tsx", "utf8");
    expect(entity).toContain('"AI training for business teams"');
    expect(entity).toContain('"ChatGPT and Claude training for companies"');
    expect(entity).toContain("operations, sales, customer, marketing, finance and People");
  });


  it("does not retain the retired Answers hub component", () => {
    expect(existsSync("src/pages/IntelligenceAnswers.tsx")).toBe(false);
    const app = readFileSync("src/App.tsx", "utf8");
    expect(app).not.toContain('import("./pages/IntelligenceAnswers")');
  });


  it("keeps AI crawler preferences on live canonical discovery pages", () => {
    const ai = readFileSync("public/ai.txt", "utf8");
    expect(ai).toContain("https://www.deepgrain.ai/ai-training-for-business-teams");
    expect(ai).not.toContain("https://www.deepgrain.ai/intelligence/answers");
  });


  it("links every comparison page from the Intelligence hub", () => {
    const hub = readFileSync("src/pages/Intelligence.tsx", "utf8");
    expect(hub).toContain("COMPARES.map");
    expect(hub).toContain("`/intelligence/${page.slug}`");
  });


  it("keeps outcome receipts on the business training page", () => {
    const page = readFileSync("src/pages/BusinessTeamAITraining.tsx", "utf8");
    expect(page).toContain("5 tools");
    expect(page).toContain("£40k retired");
    expect(page).toContain('to="/work"');
  });


  it("emits the homepage VideoObject only through the route component", () => {
    const shell = readFileSync("index.html", "utf8");
    const home = readFileSync("src/pages/Home.tsx", "utf8");
    expect(shell).not.toContain('"@type": "VideoObject"');
    expect(shell).not.toContain('"@graph"');
    expect(home).toContain('"@type": "VideoObject"');
  });


  it("owns site entities in SiteEntityLd rather than duplicating them in the shell", () => {
    const shell = readFileSync("index.html", "utf8");
    const entities = readFileSync("src/components/seo/SiteEntityLd.tsx", "utf8");
    expect(shell).not.toContain('"@type": "Organization"');
    expect(shell).not.toContain('"@type": "WebSite"');
    expect(entities).toContain('"@type": "Organization"');
    expect(entities).toContain('"@type": "WebSite"');
  });


  it("falls back when an article has no generated OG image", () => {
    const page = readFileSync("src/pages/IntelligenceArticle.tsx", "utf8");
    expect(page).toContain("const ogImage = heroImage");
    expect(page).toContain('"https://www.deepgrain.ai/og-intelligence.png"');
  });

});
