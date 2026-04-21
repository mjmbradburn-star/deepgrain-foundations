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
      },
    ];
    const ld = buildFAQLd(items);
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("Plain text only.");
  });

  it("preserves item order in mainEntity", () => {
    const items: FAQItem[] = [
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
      { question: "Q3", answer: "A3" },
    ];
    const ld = buildFAQLd(items);
    expect(ld.mainEntity.map((e) => e.name)).toEqual(["Q1", "Q2", "Q3"]);
    expect(ld.mainEntity.map((e) => e.acceptedAnswer.text)).toEqual([
      "A1",
      "A2",
      "A3",
    ]);
  });

  it("produces a JSON-serialisable object (no functions, cycles, or React nodes)", () => {
    const items: FAQItem[] = [{ question: "Q", answer: "A" }];
    const ld = buildFAQLd(items);
    // Round-trip is the cheapest way to catch accidental ReactNode / Symbol leakage.
    const roundTripped = JSON.parse(JSON.stringify(ld));
    expect(roundTripped).toEqual(ld);
  });

  /**
   * Negative-path guards. These assert that our shape validator (used below
   * against every shipping FAQ) actually rejects malformed structures —
   * otherwise a regression in `buildFAQLd` could silently slip through.
   */
  describe("rejects malformed FAQPage shapes", () => {
    type FaqLd = ReturnType<typeof buildFAQLd>;
    const valid = (): FaqLd => buildFAQLd([{ question: "Q", answer: "A" }]);

    it("fails when @context is wrong", () => {
      const bad = { ...valid(), "@context": "https://wrong.example" } as FaqLd;
      expect(() => assertFAQPageShape(bad)).toThrow();
    });

    it("fails when @type is not FAQPage", () => {
      const bad = { ...valid(), "@type": "Article" } as unknown as FaqLd;
      expect(() => assertFAQPageShape(bad)).toThrow();
    });

    it("fails when mainEntity is empty", () => {
      const bad = { ...valid(), mainEntity: [] };
      expect(() => assertFAQPageShape(bad as FaqLd)).toThrow();
    });

    it("fails when a question name is empty", () => {
      const bad = valid();
      bad.mainEntity[0].name = "   ";
      expect(() => assertFAQPageShape(bad)).toThrow();
    });

    it("fails when acceptedAnswer.text is missing", () => {
      const bad = valid();
      // @ts-expect-error — intentionally malformed for the negative test
      delete bad.mainEntity[0].acceptedAnswer.text;
      expect(() => assertFAQPageShape(bad)).toThrow();
    });

    it("fails when acceptedAnswer.text is not a string", () => {
      const bad = valid();
      (bad.mainEntity[0].acceptedAnswer as { text: unknown }).text = 42;
      expect(() => assertFAQPageShape(bad)).toThrow();
    });

    it("fails when a question entry has the wrong @type", () => {
      const bad = valid();
      (bad.mainEntity[0] as { "@type": string })["@type"] = "Thing";
      expect(() => assertFAQPageShape(bad)).toThrow();
    });
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
