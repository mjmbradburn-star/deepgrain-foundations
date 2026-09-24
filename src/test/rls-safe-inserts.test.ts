import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

/**
 * Signup-path regression guard.
 *
 * The public write tables (subscribers, enquiries, assessment_results) allow
 * anon INSERTs via RLS, but SELECT is service-role-only. PostgREST enforces
 * SELECT RLS on RETURNING read-backs, so any insert that asks for the row
 * back (.select(), or a client default of return=representation) fails the
 * WHOLE insert with 42501: no row, no trigger, no welcome email. Verified
 * live on 2026-09-24: return=representation -> 42501, return=minimal -> 201.
 */

const CALL_SITES: Array<{ file: string; table: string }> = [
  { file: "src/components/forms/EmailCapture.tsx", table: "subscribers" },
  { file: "src/components/forms/ContactForm.tsx", table: "enquiries" },
  { file: "src/pages/ExposureMap.tsx", table: "enquiries" },
  { file: "src/pages/Readiness.tsx", table: "enquiries" },
  { file: "src/lib/assessmentCapture.ts", table: "assessment_results" },
];

describe("RLS-safe public inserts", () => {
  it("keeps every anon-write insert free of RETURNING read-backs", () => {
    for (const { file, table } of CALL_SITES) {
      const src = readFileSync(file, "utf8");
      const insertIdx = src.indexOf(`.from("${table}").insert(`);
      expect(insertIdx, `${file} must insert into ${table}`).toBeGreaterThan(-1);
      const rest = src.slice(insertIdx);
      const insertEnd = rest.indexOf(");");
      const insertExpr = rest.slice(0, insertEnd + 2);
      expect(
        insertExpr.includes(".select("),
        `${file}: never chain .select() on the ${table} insert - anon has no SELECT, the read-back would fail the whole insert with 42501`,
      ).toBe(false);
    }
  });

  it("keeps the RLS-SAFE INSERT note on every call site", () => {
    for (const { file } of CALL_SITES) {
      const src = readFileSync(file, "utf8");
      expect(
        src.includes("RLS-SAFE INSERT"),
        `${file}: the RLS-SAFE INSERT comment must stay so the constraint is visible to the next editor`,
      ).toBe(true);
    }
  });

  it("fails loudly if postgrest-js ever defaults inserts to return=representation", () => {
    const pkg = "node_modules/@supabase/postgrest-js/dist/index.cjs";
    if (!existsSync(pkg)) return; // fresh CI checkout without install: nothing to check
    const lib = readFileSync(pkg, "utf8");
    const insertIdx = lib.indexOf("insert(values");
    expect(insertIdx).toBeGreaterThan(-1);
    const insertBody = lib.slice(insertIdx, insertIdx + 4000);
    expect(
      insertBody.includes("return=representation"),
      "postgrest-js upgrade flipped insert() to request representation - anon inserts into RLS tables will 42501. Pin the old version or keep return=minimal.",
    ).toBe(false);
  });
});
