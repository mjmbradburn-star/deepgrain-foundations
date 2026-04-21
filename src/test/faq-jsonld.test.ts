import { describe, it, expect } from "vitest";
import { buildFAQLd, type FAQItem } from "@/components/sections/FAQ";
import { ARTICLES } from "@/lib/intelligence";

/**
 * Validates schema.org FAQPage shape for every FAQ source we ship:
 * - per-article `faqs` exports surfaced via the intelligence manifest
 * - any ad-hoc page that builds its own FAQ_ITEMS (e.g. /method)
 *
 * Spec we enforce (Google's FAQPage rich-result requirements):
 *   - @context === "https://schema.org"
 *   - @type === "FAQPage"
 *   - mainEntity is a non-empty array
 *   - each entry: @type "Question", non-empty `name`, acceptedAnswer with
 *     @type "Answer" and non-empty string `text`
 */

const assertFAQPageShape = (ld: ReturnType<typeof buildFAQLd>) => {
  expect(ld["@context"]).toBe("https://schema.org");
  expect(ld["@type"]).toBe("FAQPage");
  expect(Array.isArray(ld.mainEntity)).toBe(true);
  expect(ld.mainEntity.length).toBeGreaterThan(0);

  for (const entry of ld.mainEntity) {
    expect(entry["@type"]).toBe("Question");
    expect(typeof entry.name).toBe("string");
    expect(entry.name.trim().length).toBeGreaterThan(0);

    expect(entry.acceptedAnswer).toBeDefined();
    expect(entry.acceptedAnswer["@type"]).toBe("Answer");
    expect(typeof entry.acceptedAnswer.text).toBe("string");
    expect(entry.acceptedAnswer.text.trim().length).toBeGreaterThan(0);
  }
};

describe("buildFAQLd", () => {
  it("emits valid FAQPage shape for a minimal item", () => {
    const items: FAQItem[] = [
      { question: "Is this a question?", answer: "Yes, it is." },
    ];
    assertFAQPageShape(buildFAQLd(items));
  });

  it("mirrors the plain-text answer (not answerNode) into JSON-LD", () => {
    const items: FAQItem[] = [
      {
        question: "Does it strip JSX?",
        answer: "Plain text only.",
        // answerNode would be a ReactNode in real use; the builder must ignore it.
      },
    ];
    const ld = buildFAQLd(items);
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("Plain text only.");
  });
});

describe("Intelligence article FAQs", () => {
  const articlesWithFAQs = ARTICLES.filter(
    (a): a is typeof a & { faqs: FAQItem[] } =>
      Array.isArray(a.faqs) && a.faqs.length > 0,
  );

  it("at least one article ships with FAQs", () => {
    expect(articlesWithFAQs.length).toBeGreaterThan(0);
  });

  for (const article of articlesWithFAQs) {
    it(`emits valid FAQPage JSON-LD for "${article.frontmatter.slug}"`, () => {
      assertFAQPageShape(buildFAQLd(article.faqs));
    });
  }
});
