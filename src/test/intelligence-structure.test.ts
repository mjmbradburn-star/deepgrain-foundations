import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Build-time guarantee: every Intelligence article ships with a <TLDR> block
 * (LLM retriever chunk) and a <KeyTakeaways> block (high-level actionable
 * insights). These structures are core to our SEO + LLM discovery strategy,
 * so a missing block should fail the build, not just a review.
 *
 * Runs in `prebuild` via the existing vitest invocation in package.json.
 */
const DIR = join(process.cwd(), "src", "content", "intelligence");

// Recurse so People Ops articles in subdirectories are validated too.
function listMdx(dir: string): string[] {
  const out: string[] = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...listMdx(full));
    else if (ent.isFile() && ent.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}
const files = listMdx(DIR).map((f) => f.slice(DIR.length + 1));

describe("intelligence article structure", () => {
  it("has at least one article", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    describe(file, () => {
      const src = readFileSync(join(DIR, file), "utf8");

      it("includes a <TLDR> block", () => {
        expect(src, `${file}: missing <TLDR>`).toMatch(/<TLDR>[\s\S]*?<\/TLDR>/);
      });

      it("<TLDR> block is non-empty", () => {
        const m = src.match(/<TLDR>([\s\S]*?)<\/TLDR>/);
        expect(m, `${file}: missing <TLDR>`).not.toBeNull();
        const body = (m?.[1] ?? "").trim();
        expect(body.length, `${file}: <TLDR> is empty`).toBeGreaterThan(0);
        // Expect bullet-formatted summary so LLMs can chunk cleanly.
        expect(body, `${file}: <TLDR> should contain bullet points`).toMatch(
          /^[-*]\s+/m,
        );
      });

      it("includes a <KeyTakeaways> section", () => {
        expect(src, `${file}: missing <KeyTakeaways>`).toMatch(
          /<KeyTakeaways>[\s\S]*?<\/KeyTakeaways>/,
        );
      });

      it("<KeyTakeaways> block is non-empty", () => {
        const m = src.match(/<KeyTakeaways>([\s\S]*?)<\/KeyTakeaways>/);
        expect(m, `${file}: missing <KeyTakeaways>`).not.toBeNull();
        const body = (m?.[1] ?? "").trim();
        expect(body.length, `${file}: <KeyTakeaways> is empty`).toBeGreaterThan(
          0,
        );
        expect(
          body,
          `${file}: <KeyTakeaways> should contain bullet points`,
        ).toMatch(/^[-*]\s+/m);
      });
    });
  }
});
