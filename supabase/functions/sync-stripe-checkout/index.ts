// Server-only daily reconciliation for the two live Deepgrain Payment Links.
// No customer emails are sent. Manual invocation first; enable pg_cron after validation.
import { createClient } from "npm:@supabase/supabase-js@2";
import { type CheckoutSession, LINKS, toRow } from "./session.ts";

const API = "https://api.stripe.com/v1/checkout/sessions";
const MAX_PAGES = 50;
const SIX_DAYS = 6 * 86400; // covers normal 24h expiry and delayed reconciliation
const LAUNCH_EPOCH = 1790035200; // 22 Sep 2026 UTC, start of these payment links

type Page = { data: CheckoutSession[]; has_more: boolean };

async function fetchPage(
  key: string,
  link: string, // a payment link id, or "gate" for API-created sessions
  after: string | undefined,
  createdGte: number,
): Promise<Page> {
  const url = new URL(API);
  if (link !== "gate") url.searchParams.set("payment_link", link);
  url.searchParams.set("created[gte]", String(createdGte));
  url.searchParams.set("limit", "100");
  if (after) url.searchParams.set("starting_after", after);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) {
    // Never log the response body: it may contain request details. Status is enough.
    throw new Error(
      `Stripe Checkout Sessions list returned HTTP ${res.status}`,
    );
  }
  const page = await res.json();
  if (!Array.isArray(page.data) || typeof page.has_more !== "boolean") {
    throw new Error("Stripe returned an unexpected list response");
  }
  return page as Page;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey = Deno.env.get("STRIPE_CHECKOUT_READ_KEY");
  const dispatchToken = Deno.env.get("STRIPE_MONITOR_DISPATCH_TOKEN");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!serviceKey || !supabaseUrl || !stripeKey || !dispatchToken) {
    return Response.json(
      { error: "Required server configuration is missing" },
      { status: 503 },
    );
  }
  // Dedicated dispatch token, separate from the database service-role key.
  // This check remains mandatory even if the hosting gateway does not verify JWTs.
  if (req.headers.get("Authorization") !== `Bearer ${dispatchToken}`) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  const db = createClient(supabaseUrl, serviceKey);
  const seenAt = new Date().toISOString();
  let total = 0;
  let skipped = 0;
  try {
    // Initial backfill covers all live-link history. Subsequent runs rescan
    // six days, or from the last success minus a two-day overlap if offline.
    const { data: state, error: stateError } = await db.from(
      "stripe_checkout_sync_state",
    )
      .select("last_success_at").eq("singleton", true).maybeSingle();
    if (stateError) {
      throw new Error(
        `Sync state read failed: ${stateError.code ?? "unknown"}`,
      );
    }
    const lastSuccess = state?.last_success_at
      ? Math.floor(Date.parse(state.last_success_at) / 1000)
      : 0;
    const createdGte = lastSuccess
      ? Math.max(
        LAUNCH_EPOCH,
        Math.min(
          Math.floor(Date.now() / 1000) - SIX_DAYS,
          lastSuccess - 2 * 86400,
        ),
      )
      : LAUNCH_EPOCH;
    for (const link of [...Object.keys(LINKS), "gate"]) {
      let after: string | undefined;
      let completed = false;
      for (let pageNo = 0; pageNo < MAX_PAGES; pageNo++) {
        const page = await fetchPage(stripeKey, link, after, createdGte);
        if (page.data.length) {
          const candidates = page.data
            .filter((session) =>
              link !== "gate" || session.metadata?.source === "deepgrain_gate"
            );
          const rows = candidates
            .map((session) => toRow(session, seenAt))
            .filter((r) => r !== null);
          skipped += candidates.length - rows.length;
          const { error } = rows.length
            ? await db.from("stripe_checkout_sessions").upsert(rows, {
              onConflict: "id",
            })
            : { error: null };
          if (error) {
            throw new Error(
              `Checkout session storage failed: ${error.code ?? "unknown"}`,
            );
          }
          total += rows.length;
          after = page.data.at(-1)?.id;
        }
        if (!page.has_more) {
          completed = true;
          break;
        }
        if (!after) throw new Error("Stripe pagination ended without a cursor");
      }
      if (!completed) {
        throw new Error(`Stripe pagination hit ${MAX_PAGES}-page safety limit`);
      }
    }
    const { error } = await db.from("stripe_checkout_sync_state").upsert({
      singleton: true,
      last_success_at: seenAt,
      // Systematic drops must not be silent: surface skipped sessions as a soft error.
      last_error: skipped
        ? `Skipped ${skipped} unexpected checkout sessions`
        : null,
      last_error_at: skipped ? seenAt : null,
      sessions_seen: total,
    }, { onConflict: "singleton" });
    if (error) {
      throw new Error(`Sync state storage failed: ${error.code ?? "unknown"}`);
    }
    // Deliberately return aggregate only, never individual email or secret.
    return Response.json({ ok: true, sessions_seen: total, as_of: seenAt });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Unknown checkout sync failure";
    await db.from("stripe_checkout_sync_state").upsert({
      singleton: true,
      last_error: message,
      last_error_at: seenAt,
    }, { onConflict: "singleton" });
    return Response.json({ error: message }, { status: 502 });
  }
});
