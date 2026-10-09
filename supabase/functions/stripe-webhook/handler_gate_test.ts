import { assertEquals } from "jsr:@std/assert@1";
import { handleEvent, type Deps } from "./handler.ts";

const gateSession = (over: Record<string, unknown> = {}) => ({
  id: "cs_live_a1B2c3D4e5F6g7H8",
  payment_link: null,
  metadata: { source: "deepgrain_gate", plan: "founding", marketing_consent_claimed: "true" },
  client_reference_id: "ph_abc123",
  status: "complete",
  payment_status: "paid",
  created: 1791000000,
  expires_at: 1791086400,
  amount_total: 49500,
  currency: "gbp",
  customer_details: { email: "Buyer@Example.com", name: "Ada Lovelace" },
  customer_email: "buyer@example.com",
  ...over,
});

function deps(session: unknown) {
  const rows: Record<string, unknown>[] = [];
  const sent: { template: string; to: string | null; data: Record<string, unknown> }[] = [];
  const d: Deps = {
    fetchSession: () => Promise.resolve({ status: 200, body: session }),
    upsertSession: (r) => { rows.push(r); return Promise.resolve(null); },
    alreadyEmailed: () => Promise.resolve(false),
    sendEmail: (template, to, _k, data) => { sent.push({ template, to, data }); return Promise.resolve(null); },
    now: () => new Date("2026-10-09T12:00:00Z"),
  };
  return { d, rows, sent };
}
const evt = (id: string) => JSON.stringify({ type: "checkout.session.completed", data: { object: { id } } });

Deno.test("paid gate session is recorded against the founding link with email + source", async () => {
  const { d, rows, sent } = deps(gateSession());
  const out = await handleEvent(evt("cs_live_a1B2c3D4e5F6g7H8"), d);
  assertEquals(out.status, 200);
  assertEquals(rows[0].payment_link_id, "plink_1UIbEZQQIEQm1i6qWCLPgt32");
  assertEquals(rows[0].known_email, "buyer@example.com");
  assertEquals(rows[0].source, "deepgrain_gate");
  assertEquals(rows[0].client_reference_id, "ph_abc123");
  assertEquals(rows[0].consent_promotions, "opt_in");
  assertEquals(sent.map((m) => m.template), ["purchase-notification", "purchase-confirmation"]);
});

Deno.test("unticked box on a paid gate session is opt_out and stores no consented_email", async () => {
  const { d, rows } = deps(gateSession({ metadata: { source: "deepgrain_gate", plan: "standard", marketing_consent_claimed: "false" } }));
  await handleEvent(evt("cs_live_a1B2c3D4e5F6g7H8"), d);
  assertEquals(rows[0].payment_link_id, "plink_1UIbFBQQIEQm1i6qipC7fg1N");
  assertEquals(rows[0].consent_promotions, "opt_out");
  assertEquals(rows[0].consented_email, null);
});

Deno.test("100% promo (no_payment_required) is still tracked", async () => {
  const { d, rows } = deps(gateSession({ payment_status: "no_payment_required", amount_total: 0 }));
  const out = await handleEvent(evt("cs_live_a1B2c3D4e5F6g7H8"), d);
  assertEquals(out.status, 200);
  assertEquals(rows.length, 1);
});

Deno.test("unmappable completed session alerts the owner instead of vanishing", async () => {
  const { d, rows, sent } = deps(gateSession({ metadata: { source: "deepgrain_gate", plan: "mystery" } }));
  const out = await handleEvent(evt("cs_live_a1B2c3D4e5F6g7H8"), d);
  assertEquals(out.body.owner_alerted, true);
  assertEquals(rows.length, 0);
  assertEquals(sent[0].template, "purchase-notification");
});

Deno.test("unpaid session is ignored", async () => {
  const { d, rows } = deps(gateSession({ status: "open", payment_status: "unpaid" }));
  const out = await handleEvent(evt("cs_live_a1B2c3D4e5F6g7H8"), d);
  assertEquals(out.body.ignored, "session not paid yet");
  assertEquals(rows.length, 0);
});

Deno.test("100% promo gate session never counts as consent", async () => {
  const { d, rows } = deps(gateSession({ payment_status: "no_payment_required", amount_total: 0 }));
  await handleEvent(evt("cs_live_a1B2c3D4e5F6g7H8"), d);
  assertEquals(rows[0].consent_promotions, "opt_out");
  assertEquals(rows[0].consented_email, null);
});

Deno.test("redelivered event upserts the same row id (idempotent)", async () => {
  const { d, rows } = deps(gateSession());
  await handleEvent(evt("cs_live_a1B2c3D4e5F6g7H8"), d);
  await handleEvent(evt("cs_live_a1B2c3D4e5F6g7H8"), d);
  assertEquals(rows[0].id, rows[1].id);
});

Deno.test("store failure still notifies the owner, then returns 502", async () => {
  const { d, sent } = deps(gateSession());
  d.upsertSession = () => Promise.resolve("db down");
  const out = await handleEvent(evt("cs_live_a1B2c3D4e5F6g7H8"), d);
  assertEquals(out.status, 502);
  assertEquals(sent[0].template, "purchase-notification");
});
