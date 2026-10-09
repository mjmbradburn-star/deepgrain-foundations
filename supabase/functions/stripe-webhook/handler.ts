// Stripe webhook for Deepgrain checkout. Records paid sessions and notifies.
//
// Trust model: the event body is only a hint naming a session id. Every paid
// session is re-fetched from Stripe with the existing read-only key, so a
// forged request can at most make us re-read a real session. Nothing is
// created or charged here, and no marketing or recovery mail is sent.

export type Kind = "course" | "diagnostic" | "other";

export const PRODUCTS: Record<string, { label: string; kind: Kind }> = {
  plink_1UIbEZQQIEQm1i6qWCLPgt32: { label: "Founding seat", kind: "course" },
  plink_1UIbFBQQIEQm1i6qipC7fg1N: { label: "Standard seat", kind: "course" },
  plink_1UMzRQQQIEQm1i6qBJxPZs12: {
    label: "AI Ladder Diagnostic",
    kind: "diagnostic",
  },
  plink_1UKyd2QQIEQm1i6qTDJqmtjb: { label: "Ardoq payment", kind: "other" },
};

// Sessions created by api/api/checkout-session.mjs have no payment_link. They carry
// metadata.source = "deepgrain_gate" and metadata.plan, and are mapped onto the same
// product rows so records, notifications and the Money Pipe keep working unchanged.
export const GATE_PLANS: Record<string, string> = {
  founding: "plink_1UIbEZQQIEQm1i6qWCLPgt32",
  standard: "plink_1UIbFBQQIEQm1i6qipC7fg1N",
};

export function resolveLink(s: {
  payment_link: string | null;
  metadata?: Record<string, string> | null;
}): string | null {
  if (s.payment_link) return s.payment_link;
  if (s.metadata?.source === "deepgrain_gate") {
    return GATE_PLANS[s.metadata.plan ?? ""] ?? null;
  }
  return null;
}

// Consent for gate sessions is the on-page tick recorded in metadata.
export function resolveConsent(s: {
  payment_status?: string;
  amount_total?: number | null;
  consent?: { promotions?: string | null } | null;
  metadata?: Record<string, string> | null;
}): string | null {
  // Only called for PAID sessions. The tick is a claim made through a public endpoint, so
  // it is honoured only because the buyer went on to pay.
  if (s.metadata?.source === "deepgrain_gate") {
    // A 100% promo code (no_payment_required / £0) is not proof of the cardholder: no consent.
    if (s.payment_status !== "paid" || !(s.amount_total && s.amount_total > 0)) return "opt_out";
    return s.metadata.marketing_consent_claimed === "true" ? "opt_in" : "opt_out";
  }
  return s.consent?.promotions ?? null;
}

export const HANDLED_EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
];

export type Session = {
  id: string;
  payment_link: string | null;
  metadata?: Record<string, string> | null;
  client_reference_id?: string | null;
  status: string | null;
  payment_status: string;
  created: number;
  expires_at: number;
  amount_total: number | null;
  currency: string | null;
  consent?: { promotions?: string | null } | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  customer_email?: string | null;
};

export type Deps = {
  fetchSession: (id: string) => Promise<{ status: number; body: unknown }>;
  upsertSession: (row: Record<string, unknown>) => Promise<string | null>;
  alreadyEmailed: (
    template: string,
    to: string,
    sinceIso: string,
  ) => Promise<boolean>;
  sendEmail: (
    templateName: string,
    to: string | null,
    idempotencyKey: string,
    templateData: Record<string, unknown>,
  ) => Promise<string | null>;
  now: () => Date;
};

export type Outcome = { status: number; body: Record<string, unknown> };

const SESSION_ID = /^cs_live_[A-Za-z0-9]{10,}$/;

export function money(amount: number | null, currency: string | null): string {
  if (amount === null) return "unknown amount";
  const code = (currency ?? "gbp").toUpperCase();
  const value = (amount / 100).toFixed(2);
  return code === "GBP" ? `£${value}` : `${value} ${code}`;
}

export function firstName(full: string | null | undefined): string {
  const first = (full ?? "").trim().split(/\s+/)[0] ?? "";
  return first.length > 0 && first.length <= 40 ? first : "there";
}

export async function handleEvent(raw: string, deps: Deps): Promise<Outcome> {
  let event: { type?: unknown; data?: { object?: { id?: unknown } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return { status: 400, body: { error: "Invalid JSON" } };
  }
  if (typeof event.type !== "string" || !HANDLED_EVENTS.includes(event.type)) {
    return { status: 200, body: { ignored: "event type" } };
  }
  const id = event.data?.object?.id;
  if (typeof id !== "string" || !SESSION_ID.test(id)) {
    return { status: 200, body: { ignored: "not a live checkout session" } };
  }

  const fetched = await deps.fetchSession(id);
  if (fetched.status === 404) {
    return { status: 200, body: { ignored: "session not found in Stripe" } };
  }
  if (fetched.status !== 200 || typeof fetched.body !== "object") {
    return { status: 502, body: { error: "Stripe session lookup failed" } };
  }
  const s = fetched.body as Session;
  if (s.id !== id) {
    return {
      status: 502,
      body: { error: "Stripe returned a different session" },
    };
  }
  // no_payment_required = 100% promo code. Still a real enrolment, so track it.
  if (s.status !== "complete" || !["paid", "no_payment_required"].includes(s.payment_status)) {
    return { status: 200, body: { ignored: "session not paid yet" } };
  }
  const link = resolveLink(s);
  const product = link ? PRODUCTS[link] : undefined;
  if (!product) {
    // A completed paid session we cannot map must never vanish silently: tell the owner.
    const err = await deps.sendEmail("purchase-notification", null, `untracked-${s.id}`, {
      productLabel: "UNTRACKED paid session (check Stripe)",
      amount: money(s.amount_total, s.currency),
      buyerName: s.customer_details?.name?.trim() || "(no name given)",
      buyerEmail: s.customer_details?.email ?? s.customer_email ?? "(no email given)",
      sessionId: s.id,
      paidAt: deps.now().toISOString(),
    });
    if (err) return { status: 502, body: { error: `Untracked notify failed: ${err}` } };
    return { status: 200, body: { ignored: "payment link not tracked", owner_alerted: true } };
  }

  const seenAt = deps.now().toISOString();
  const consent = resolveConsent(s);
  const buyerEmail = (s.customer_details?.email ?? s.customer_email ?? "")
    .trim().toLowerCase();
  const buyerName = s.customer_details?.name?.trim() ?? "";
  const createdIso = new Date(s.created * 1000).toISOString();

  // 1. Durable record first, in the existing checkout store.
  const storeError = await deps.upsertSession({
    id: s.id,
    payment_link_id: link,
    status: s.status,
    payment_status: s.payment_status,
    created_at: createdIso,
    expires_at: new Date(s.expires_at * 1000).toISOString(),
    amount_total: s.amount_total,
    currency: s.currency,
    consent_promotions: consent,
    consented_email: consent === "opt_in" ? buyerEmail || null : null,
    known_email: buyerEmail || null,
    client_reference_id: s.client_reference_id ?? null,
    source: s.metadata?.source === "deepgrain_gate" ? "deepgrain_gate" : "payment_link",
    last_seen_at: seenAt,
  });
  // A store failure must not hide a real sale from the owner: notify first, then fail.

  // 2. Owner notification (fixed recipient set by the template).
  const notifyError = await deps.sendEmail(
    "purchase-notification",
    null,
    `purchase-notify-${s.id}`,
    {
      productLabel: product.label,
      amount: money(s.amount_total, s.currency),
      buyerName: buyerName || "(no name given)",
      buyerEmail: buyerEmail || "(no email given)",
      sessionId: s.id,
      paidAt: seenAt,
    },
  );
  if (notifyError) {
    return { status: 502, body: { error: `Notify failed: ${notifyError}` } };
  }

  // 3. Plain receipt-style confirmation to the buyer. Not for "other" links.
  let buyerSent = false;
  if (product.kind !== "other" && buyerEmail.includes("@")) {
    const skip = await deps.alreadyEmailed(
      "purchase-confirmation",
      buyerEmail,
      createdIso,
    );
    if (!skip) {
      const buyerError = await deps.sendEmail(
        "purchase-confirmation",
        buyerEmail,
        `purchase-confirm-${s.id}`,
        {
          kind: product.kind,
          productLabel: product.label,
          firstName: firstName(buyerName),
        },
      );
      if (buyerError) {
        return {
          status: 502,
          body: { error: `Confirm failed: ${buyerError}` },
        };
      }
      buyerSent = true;
    }
  }
  if (storeError) {
    return { status: 502, body: { error: `Store failed: ${storeError}`, notified: true } };
  }
  return {
    status: 200,
    body: {
      ok: true,
      recorded: true,
      notified: true,
      buyer_confirmation: buyerSent,
    },
  };
}
