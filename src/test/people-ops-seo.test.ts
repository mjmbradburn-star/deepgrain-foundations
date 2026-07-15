import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ARTICLES, getCategory } from "@/lib/intelligence";
import { buildFAQLd } from "@/components/sections/FAQ";

/**
 * SEO checklist for the People Ops cluster.
 *
 * For every article on the people-ops track we validate:
 *   1. Unique <title> and <meta description> across the cluster.
 *   2. Exactly one H1 per page (rendered by IntelligenceArticle from the
 *      frontmatter title; the MDX body must NOT contain its own `# Heading`).
 *   3. Consistent heading hierarchy (starts at H2, never skips a level).
 *   4. At least one internal /intelligence/ link in the body.
 *   5. Article schema.org JSON-LD has the required fields, and FAQPage
 *      JSON-LD (when faqs are exported) passes the FAQPage shape contract.
 */

const PEOPLE_OPS_DIR = join(
  process.cwd(),
  "src/content/intelligence/people-ops"
);

const peopleOps = ARTICLES.filter((a) => a.frontmatter.track === "people-ops");

const readBody = (slug: string) =>
  readFileSync(join(PEOPLE_OPS_DIR, `${slug}.mdx`), "utf8");

describe("People Ops SEO checklist", () => {
  it("ships at least one People Ops article (sanity)", () => {
    expect(peopleOps.length).toBeGreaterThan(0);
    // And every MDX file on disk is wired through the manifest.
    const onDisk = readdirSync(PEOPLE_OPS_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
    const wired = new Set(peopleOps.map((a) => a.frontmatter.slug));
    for (const slug of onDisk) {
      expect(wired.has(slug), `MDX ${slug} not wired into manifest`).toBe(true);
    }
  });

  it("has unique titles across the cluster", () => {
    const seen = new Map<string, string>();
    for (const a of peopleOps) {
      const key = a.frontmatter.title.trim().toLowerCase();
      const prev = seen.get(key);
      expect(
        prev,
        `Duplicate title "${a.frontmatter.title}" on ${a.frontmatter.slug} and ${prev}`
      ).toBeUndefined();
      seen.set(key, a.frontmatter.slug);
    }
  });

  it("has unique meta descriptions across the cluster", () => {
    const seen = new Map<string, string>();
    for (const a of peopleOps) {
      const desc = (a.frontmatter.description ?? "").trim();
      expect(desc.length, `${a.frontmatter.slug} missing description`).toBeGreaterThan(20);
      const key = desc.toLowerCase();
      const prev = seen.get(key);
      expect(
        prev,
        `Duplicate description on ${a.frontmatter.slug} and ${prev}`
      ).toBeUndefined();
      seen.set(key, a.frontmatter.slug);
    }
  });

  it("declares a valid primaryCluster + clusters taxonomy", async () => {
    const { CLUSTERS_BY_SLUG } = await import("@/lib/clusters");
    for (const a of peopleOps) {
      const f = a.frontmatter;
      expect(f.primaryCluster, `${f.slug} missing primaryCluster`).toBeTruthy();
      expect(
        CLUSTERS_BY_SLUG[f.primaryCluster!],
        `${f.slug} primaryCluster "${f.primaryCluster}" not in CLUSTERS registry`
      ).toBeDefined();
      for (const c of f.clusters ?? []) {
        expect(
          CLUSTERS_BY_SLUG[c],
          `${f.slug} cluster "${c}" not in CLUSTERS registry`
        ).toBeDefined();
        expect(c, `${f.slug} clusters[] should not repeat primaryCluster`).not.toBe(
          f.primaryCluster
        );
      }
    }
  });

  describe.each(peopleOps.map((a) => [a.frontmatter.slug, a] as const))(
    "%s",
    (slug, article) => {
      const body = readBody(slug);
      // Strip frontmatter `export const` blocks - only validate prose.
      const proseStart = body.indexOf("\n## ");
      const prose = proseStart === -1 ? body : body.slice(proseStart);

      it("has exactly one H1 (rendered from frontmatter, none in MDX body)", () => {
        // The page-level H1 comes from <h1>{f.title}</h1> in IntelligenceArticle.
        expect(article.frontmatter.title.trim().length).toBeGreaterThan(0);
        // MDX body must not introduce a second H1.
        const h1InBody = /^# [^#\n]/m.test(prose);
        expect(h1InBody, `${slug} has a "# heading" in MDX body - would create a second H1`).toBe(false);
      });

      it("uses a consistent heading hierarchy (starts at H2, never skips a level)", () => {
        const levels = Array.from(prose.matchAll(/^(#{2,6}) +\S/gm)).map(
          (m) => m[1].length
        );
        expect(levels.length, `${slug} has no headings`).toBeGreaterThan(0);
        expect(levels[0], `${slug} first heading must be H2`).toBe(2);
        let prev = 2;
        for (const lvl of levels) {
          expect(
            lvl - prev,
            `${slug} heading jump from H${prev} to H${lvl} skips a level`
          ).toBeLessThanOrEqual(1);
          prev = lvl;
        }
      });

      it("contains at least one internal /intelligence/ link", () => {
        const hasInternal = /\]\((\/intelligence\/[^)\s]+)\)/.test(prose);
        expect(hasInternal, `${slug} has no internal /intelligence/ link`).toBe(true);
      });

      it("produces valid Article + (optional) FAQPage JSON-LD", () => {
        const f = article.frontmatter;
        const url = `https://deepgrain.ai/intelligence/${f.slug}`;
        const cat = getCategory(f.category);
        expect(cat, `${slug} references unknown category ${f.category}`).toBeDefined();

        const articleLd = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: f.title,
          description: f.description,
          datePublished: f.publishedAt,
          author: { "@type": "Person", name: f.author },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
        };

        expect(articleLd["@context"]).toBe("https://schema.org");
        expect(articleLd["@type"]).toBe("Article");
        expect(typeof articleLd.headline).toBe("string");
        expect(articleLd.headline.length).toBeGreaterThan(0);
        expect(typeof articleLd.description).toBe("string");
        expect(articleLd.description.length).toBeGreaterThan(0);
        expect(/^\d{4}-\d{2}-\d{2}$/.test(articleLd.datePublished)).toBe(true);
        expect(articleLd.author.name.length).toBeGreaterThan(0);

        if (article.faqs && article.faqs.length > 0) {
          const ld = buildFAQLd(article.faqs);
          expect(ld["@context"]).toBe("https://schema.org");
          expect(ld["@type"]).toBe("FAQPage");
          expect(Array.isArray(ld.mainEntity)).toBe(true);
          expect(ld.mainEntity.length).toBeGreaterThan(0);
          for (const entry of ld.mainEntity) {
            expect(entry["@type"]).toBe("Question");
            expect(entry.name.trim().length).toBeGreaterThan(0);
            expect(entry.acceptedAnswer["@type"]).toBe("Answer");
            expect(entry.acceptedAnswer.text.trim().length).toBeGreaterThan(0);
          }
        }
      });
    }
  );
});
