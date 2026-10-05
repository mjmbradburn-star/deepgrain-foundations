import { createClient } from "npm:@supabase/supabase-js@2";
import { type Deps, handleEvent } from "./handler.ts";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey = Deno.env.get("STRIPE_CHECKOUT_READ_KEY");
  if (!supabaseUrl || !serviceKey || !stripeKey) {
    return Response.json(
      { error: "Required server configuration is missing" },
      { status: 503 },
    );
  }
  const db = createClient(supabaseUrl, serviceKey);

  const deps: Deps = {
    fetchSession: async (id) => {
      const res = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`,
        { headers: { Authorization: `Bearer ${stripeKey}` } },
      );
      // Never log the body: it can hold customer details.
      return { status: res.status, body: res.ok ? await res.json() : null };
    },
    upsertSession: async (row) => {
      const { error } = await db.from("stripe_checkout_sessions").upsert(
        row,
        { onConflict: "id" },
      );
      return error ? (error.code ?? "unknown") : null;
    },
    alreadyEmailed: async (template, to, sinceIso) => {
      const { data, error } = await db.from("email_send_log")
        .select("id")
        .eq("template_name", template)
        .eq("recipient_email", to)
        .gte("created_at", sinceIso)
        .neq("status", "failed")
        .limit(1);
      return !error && (data?.length ?? 0) > 0;
    },
    sendEmail: async (templateName, to, idempotencyKey, templateData) => {
      const res = await fetch(
        `${supabaseUrl}/functions/v1/send-transactional-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            templateName,
            recipientEmail: to,
            idempotencyKey,
            templateData,
          }),
        },
      );
      return res.ok ? null : `HTTP ${res.status}`;
    },
    now: () => new Date(),
  };

  const outcome = await handleEvent(await req.text(), deps);
  return Response.json(outcome.body, { status: outcome.status });
});
