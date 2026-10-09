import { assertEquals } from "jsr:@std/assert@1";
import { toRow } from "./session.ts";

const base = {
  id: "cs_live_a1B2c3D4e5F6g7H8",
  payment_link: null,
  metadata: { source: "deepgrain_gate", plan: "founding", marketing_consent_claimed: "true" },
  client_reference_id: "ph_abc123",
  status: "open" as const,
  payment_status: "unpaid",
  created: 1791000000,
  expires_at: 1791086400,
  amount_total: 49500,
  currency: "gbp",
  customer_email: "victim@example.com",
};

Deno.test("unpaid gate session: claim recorded, never consent", () => {
  const r = toRow(base, "2026-10-09T12:00:00Z")!;
  assertEquals(r.consent_promotions, null);
  assertEquals(r.consented_email, null);
  assertEquals(r.consent_claimed, true);
  assertEquals(r.known_email, "victim@example.com");
  assertEquals(r.source, "deepgrain_gate");
});

Deno.test("paid gate session with claim becomes opt_in", () => {
  const r = toRow({ ...base, status: "complete", payment_status: "paid" }, "x")!;
  assertEquals(r.consent_promotions, "opt_in");
  assertEquals(r.consented_email, "victim@example.com");
});

Deno.test("100% promo gate session is not consent", () => {
  const r = toRow({ ...base, status: "complete", payment_status: "no_payment_required", amount_total: 0 }, "x")!;
  assertEquals(r.consented_email, null);
});

Deno.test("unknown plan is skipped, not thrown", () => {
  assertEquals(toRow({ ...base, metadata: { source: "deepgrain_gate", plan: "nope" } }, "x"), null);
});
