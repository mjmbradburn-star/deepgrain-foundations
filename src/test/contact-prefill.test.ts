import { describe, expect, it } from "vitest";
import { contactPrefillHref, hasContactPrefill, readContactPrefill } from "@/lib/contactPrefill";

describe("contact prefill links", () => {
  it("builds fragment links, never query links", () => {
    const href = contactPrefillHref("Book a Grain Audit for: ");
    expect(href.startsWith("/contact#write&subject=")).toBe(true);
    expect(href).not.toContain("?");
  });

  it("round-trips the prefill from the fragment", () => {
    const href = contactPrefillHref("I'd like to talk about onboarding & policy");
    const hash = href.slice(href.indexOf("#"));
    expect(hasContactPrefill("", hash)).toBe(true);
    expect(readContactPrefill("", hash)).toBe("I'd like to talk about onboarding & policy");
  });

  it("still reads legacy ?subject= links", () => {
    expect(hasContactPrefill("?subject=Hello", "")).toBe(true);
    expect(readContactPrefill("?subject=Hello", "")).toBe("Hello");
  });

  it("treats a plain #write anchor as no prefill", () => {
    expect(hasContactPrefill("", "#write")).toBe(false);
    expect(readContactPrefill("", "#write")).toBe("");
  });

  it("caps prefill length", () => {
    expect(readContactPrefill("", `#subject=${"a".repeat(900)}`).length).toBe(500);
  });
});
