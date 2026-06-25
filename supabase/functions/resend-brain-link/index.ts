// supabase/functions/resend-brain-link/index.ts
//
// "Resend my Brain link" diagnostic endpoint. Unlike send-brain-welcome,
// this endpoint is *intentionally* enumerable: its whole purpose is to
// tell a stuck user *why* they can't get access (unsubscribed / bounced /
// not on file) so they have a clear next step.
//
// Logic:
//   1. Validate + IP rate-limit (3/60s — tighter than signup).
//   2. Lookup brain_subscribers by lowercased email.
//      - no row              -> { status: 'not_found' }
//      - row + unsubscribed  -> { status: 'unsubscribed', since }
//      - row + suppressed    -> { status: 'suppressed', reason }
//      - otherwise           -> revoke active tokens, mint fresh, enqueue,
//                                { status: 'sent' }
//   3. Per-subscriber hourly cooldown via idempotency key
//      `brain-resend-<id>-<yyyymmddhh>` so the same address can't be
//      spammed even from different IPs.
//
// Deployed with verify_jwt = false (public form).

import * as React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { createClient } from "npm:@supabase/supabase-js@2";
import { template as brainWelcomeTemplate } from "../_shared/transactional-email-templates/brain-welcome.tsx";

const SITE_NAME = "deepgrain-foundations";
const SENDER_DOMAIN = "notify.deepgrain.ai";
const FROM_DOMAIN = "notify.deepgrain.ai";
const SUPPORT_EMAIL = "matt@peopleleaders.io";

const BRAIN_OPEN_BASE = `${
  Deno.env.get("SUPABASE_URL") ?? ""
}/functions/v1/open-brain`;
const AIOI_URL = "https://aioi.deepgrain.ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function generateBrainAccessToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateUnsubscribeToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// In-memory IP rate limit. 3/60s — tighter than signup.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const ipHits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const window =
    ipHits.get(ip)?.filter((t) => now - t < RATE_LIMIT_WINDOW_MS) ?? [];
  if (window.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, window);
    return true;
  }
  window.push(now);
  ipHits.set(ip, window);
  return false;
}

function maskIp(ip: string): string {
  if (!ip || ip === "unknown") return "unknown";
  if (ip.includes(":")) return ip.split(":").slice(0, 3).join(":") + ":…";
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.x`;
  return "masked";
}

async function emailFingerprint(email: string | null): Promise<string | null> {
  if (!email) return null;
  const data = new TextEncoder().encode(email.toLowerCase().trim());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type Outcome =
  | "resend_sent"
  | "resend_unsubscribed"
  | "resend_suppressed"
  | "resend_not_found"
  | "resend_rate_limited"
  | "resend_validation_failed"
  | "resend_invalid_json"
  | "resend_method_not_allowed"
  | "resend_config_error"
  | "resend_lookup_failed"
  | "resend_send_failed"
  | "resend_honeypot";

// deno-lint-ignore no-explicit-any
async function logOutcome(
  supabase: any | null,
  outcome: Outcome,
  ctx: { ip: string; email?: string | null; detail?: Record<string, unknown> },
): Promise<void> {
  const fingerprint = await emailFingerprint(ctx.email ?? null);
  const ipMasked = maskIp(ctx.ip);
  const line = {
    metric: "brain_resend_metric",
    outcome,
    email_fp: fingerprint,
    ip_masked: ipMasked,
    ts: new Date().toISOString(),
    ...(ctx.detail ?? {}),
  };
  const negative: Outcome[] = [
    "resend_unsubscribed",
    "resend_suppressed",
    "resend_not_found",
    "resend_rate_limited",
    "resend_validation_failed",
    "resend_invalid_json",
    "resend_method_not_allowed",
    "resend_config_error",
    "resend_lookup_failed",
    "resend_send_failed",
    "resend_honeypot",
  ];
  if (negative.includes(outcome)) console.warn(JSON.stringify(line));
  else console.log(JSON.stringify(line));

  if (!supabase) return;
  // Skip logging the actual `sent` outcome — the real send writes its own
  // pending→sent rows under brain-welcome-<id>. We only want to capture
  // diagnostic / negative outcomes here.
  if (outcome === "resend_sent") return;
  try {
    const status = outcome === "resend_suppressed" ? "suppressed" : "failed";
    await supabase.from("email_send_log").insert({
      message_id: `brain-resend-meta-${crypto.randomUUID()}`,
      template_name: "brain-welcome",
      recipient_email: ctx.email ?? "unknown@brain-resend.meta",
      status,
      error_message: typeof ctx.detail?.reason === "string"
        ? (ctx.detail.reason as string)
        : null,
      metadata: {
        outcome,
        email_fp: fingerprint,
        ip_masked: ipMasked,
        ...(ctx.detail ?? {}),
      },
    });
  } catch (err) {
    console.warn("resend-brain-link: metric persist failed", {
      outcome,
      err: String(err),
    });
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";

  if (req.method !== "POST") {
    await logOutcome(null, "resend_method_not_allowed", {
      ip,
      detail: { method: req.method },
    });
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseServiceKey) {
    await logOutcome(null, "resend_config_error", { ip });
    return jsonResponse({ error: "Server configuration error" }, 500);
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  if (rateLimited(ip)) {
    await logOutcome(supabase, "resend_rate_limited", { ip });
    return jsonResponse(
      {
        status: "rate_limited",
        error: "Too many requests. Please try again in a minute.",
      },
      429,
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    await logOutcome(supabase, "resend_invalid_json", { ip });
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  if (typeof raw !== "object" || raw === null) {
    await logOutcome(supabase, "resend_validation_failed", { ip });
    return jsonResponse({ error: "Invalid payload" }, 400);
  }
  const r = raw as Record<string, unknown>;

  // Honeypot: if the hidden `website` field is filled, silently succeed.
  if (typeof r.website === "string" && r.website.trim().length > 0) {
    await logOutcome(supabase, "resend_honeypot", { ip });
    // Generic success to keep bots in the dark.
    return jsonResponse({ status: "sent" });
  }

  const emailRaw = typeof r.email === "string"
    ? r.email.trim().toLowerCase()
    : "";
  if (!emailRaw || emailRaw.length > 320 || !EMAIL_REGEX.test(emailRaw)) {
    await logOutcome(supabase, "resend_validation_failed", {
      ip,
      detail: { field: "email" },
    });
    return jsonResponse({ error: "Please enter a valid email address." }, 400);
  }
  const email = emailRaw;

  // 1) Lookup subscriber.
  const { data: subscriber, error: lookupError } = await supabase
    .from("brain_subscribers")
    .select("id, first_name, email, unsubscribed_at")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    await logOutcome(supabase, "resend_lookup_failed", {
      ip,
      email,
      detail: { reason: lookupError.message },
    });
    return jsonResponse(
      { error: "Something went wrong. Try again shortly." },
      500,
    );
  }

  if (!subscriber) {
    await logOutcome(supabase, "resend_not_found", { ip, email });
    return jsonResponse({ status: "not_found" });
  }

  if (subscriber.unsubscribed_at) {
    await logOutcome(supabase, "resend_unsubscribed", {
      ip,
      email,
      detail: { since: subscriber.unsubscribed_at },
    });
    return jsonResponse({
      status: "unsubscribed",
      since: subscriber.unsubscribed_at,
      supportEmail: SUPPORT_EMAIL,
    });
  }

  // 2) Check suppression list (bounces / complaints).
  const { data: suppressed, error: suppressedError } = await supabase
    .from("suppressed_emails")
    .select("email, reason")
    .eq("email", email)
    .maybeSingle();

  if (suppressedError) {
    await logOutcome(supabase, "resend_lookup_failed", {
      ip,
      email,
      detail: { reason: suppressedError.message, stage: "suppression" },
    });
    return jsonResponse(
      { error: "Something went wrong. Try again shortly." },
      500,
    );
  }

  if (suppressed) {
    await logOutcome(supabase, "resend_suppressed", {
      ip,
      email,
      detail: { reason: suppressed.reason ?? "unknown" },
    });
    return jsonResponse({
      status: "suppressed",
      reason: suppressed.reason ?? "unknown",
      supportEmail: SUPPORT_EMAIL,
    });
  }

  // 3) Mint a fresh token & enqueue. Hourly idempotency key prevents
  //    repeat sends to the same address.
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const idempotencyKey = `brain-resend-${subscriber.id}-${yyyy}${mm}${dd}${hh}`;
  const messageId = idempotencyKey;

  try {
    // Revoke any still-active tokens for this subscriber — defense in
    // depth so old links don't keep working alongside the new one.
    await supabase
      .from("brain_access_tokens")
      .update({
        revoked_at: new Date().toISOString(),
        revoke_reason: "resend_superseded",
      })
      .eq("subscriber_id", subscriber.id)
      .is("revoked_at", null);

    // Mint new token.
    const brainAccessToken = generateBrainAccessToken();
    const { error: tokenInsertError } = await supabase
      .from("brain_access_tokens")
      .insert({ subscriber_id: subscriber.id, token: brainAccessToken });
    if (tokenInsertError) {
      throw new Error(`token_insert_failed: ${tokenInsertError.message}`);
    }

    const brainUrl = `${BRAIN_OPEN_BASE}?t=${brainAccessToken}`;

    // Get-or-create unsubscribe token (one per email address).
    const { data: existingToken } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token, used_at")
      .eq("email", email)
      .maybeSingle();

    let unsubscribeToken: string;
    if (existingToken && !existingToken.used_at) {
      unsubscribeToken = existingToken.token;
    } else if (!existingToken) {
      unsubscribeToken = generateUnsubscribeToken();
      await supabase
        .from("email_unsubscribe_tokens")
        .upsert(
          { token: unsubscribeToken, email },
          { onConflict: "email", ignoreDuplicates: true },
        );
      const { data: stored } = await supabase
        .from("email_unsubscribe_tokens")
        .select("token")
        .eq("email", email)
        .maybeSingle();
      if (!stored?.token) throw new Error("unsubscribe_token_persist_failed");
      unsubscribeToken = stored.token;
    } else {
      // Token used — recipient previously unsubscribed but isn't on the
      // suppression list. Treat as unsubscribed.
      await logOutcome(supabase, "resend_unsubscribed", {
        ip,
        email,
        detail: { reason: "unsubscribe_token_used" },
      });
      return jsonResponse({
        status: "unsubscribed",
        since: null,
        supportEmail: SUPPORT_EMAIL,
      });
    }

    // Render the brain-welcome template with isResend=true.
    const templateData = {
      firstName: subscriber.first_name,
      brainUrl,
      aioiUrl: AIOI_URL,
      isResend: true as const,
    };
    const html = await renderAsync(
      React.createElement(brainWelcomeTemplate.component, templateData),
    );
    const plainText = await renderAsync(
      React.createElement(brainWelcomeTemplate.component, templateData),
      { plainText: true },
    );
    const subjectField = brainWelcomeTemplate.subject as
      | string
      | ((data: typeof templateData) => string);
    const resolvedSubject = typeof subjectField === "function"
      ? subjectField(templateData)
      : subjectField;

    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "brain-welcome",
      recipient_email: email,
      status: "pending",
      metadata: { outcome: "resend_sent", subscriber_id: subscriber.id },
    });

    const { error: enqueueError } = await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        message_id: messageId,
        to: email,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject: resolvedSubject,
        html,
        text: plainText,
        purpose: "transactional",
        label: "brain-welcome",
        idempotency_key: idempotencyKey,
        unsubscribe_token: unsubscribeToken,
        queued_at: new Date().toISOString(),
      },
    });
    if (enqueueError) {
      throw new Error(`enqueue_failed: ${enqueueError.message}`);
    }

    await supabase
      .from("brain_subscribers")
      .update({
        email_sent_at: new Date().toISOString(),
        email_status: "queued",
        email_provider_id: messageId,
      })
      .eq("id", subscriber.id);

    await logOutcome(supabase, "resend_sent", {
      ip,
      email,
      detail: { subscriber_id: subscriber.id },
    });
    return jsonResponse({ status: "sent" });
  } catch (e) {
    const reason = e instanceof Error ? e.message : "unknown_error";
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "brain-welcome",
      recipient_email: email,
      status: "failed",
      error_message: reason,
      metadata: { outcome: "resend_send_failed" },
    });
    await logOutcome(supabase, "resend_send_failed", {
      ip,
      email,
      detail: { reason, subscriber_id: subscriber.id },
    });
    return jsonResponse({
      error: "Something went wrong while sending. Try again shortly.",
    }, 500);
  }
});
