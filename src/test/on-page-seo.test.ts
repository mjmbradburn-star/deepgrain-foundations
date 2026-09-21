import { describe, expect, it } from "vitest";
import { ARTICLES } from "@/lib/intelligence";
import { ANSWERS } from "@/data/answers";
import { COMPARES } from "@/data/compares";
import { readFileSync } from "node:fs";

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
    expect(ANSWERS.some((answer) => answer.slug === "ai-os-vs-ai-platform")).toBe(false);
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
});
