// Only these two links appear in the live Deepgrain course page.
export const LINKS = {
  plink_1UIbEZQQIEQm1i6qWCLPgt32: "founding",
  plink_1UIbFBQQIEQm1i6qipC7fg1N: "standard",
  plink_1UKyd2QQIEQm1i6qTDJqmtjb: "Ardoq £1,500",
} as const;

export const GATE_LINKS: Record<string, string> = {
  founding: "plink_1UIbEZQQIEQm1i6qWCLPgt32",
  standard: "plink_1UIbFBQQIEQm1i6qipC7fg1N",
};

export type CheckoutSession = {
  id: string;
  metadata?: Record<string, string> | null;
  client_reference_id?: string | null;
  payment_link: string | null;
  status: "open" | "complete" | "expired" | null;
  payment_status: string;
  created: number;
  expires_at: number;
  amount_total: number | null;
  currency: string | null;
  consent?: { promotions?: string | null } | null;
  customer_details?: { email?: string | null } | null;
  customer_email?: string | null;
  recovered_from?: string | null;
};

export function toRow(s: CheckoutSession, seenAt: string) {
  const row = buildRow(s, seenAt);
  if (!row) console.warn("skipping unexpected checkout session", s.id);
  return row;
}

function buildRow(s: CheckoutSession, seenAt: string) {
  // Sessions made by api/api/checkout-session.mjs have no payment_link; map by plan.
  const gate = s.metadata?.source === "deepgrain_gate";
  const link = s.payment_link ??
    (gate ? GATE_LINKS[s.metadata?.plan ?? ""] : null);
  if (
    !link ||
    !(link in LINKS) ||
    !s.id.startsWith("cs_") ||
    !["open", "complete", "expired"].includes(s.status ?? "")
  ) {
    // Skip and log (never throw): one odd session must not block the whole sync.
    return null;
  }
  // Stripe's abandonment guide: an email entered on hosted Checkout is not
  // reliably supplied on expiry without promotional consent. Never store an
  // unconsented email as a lead or treat it as permission to contact.
  // Gate sessions: consent is the unticked-by-default on-page box recorded in metadata.
  // The gate tick is only a CLAIM (public endpoint, spoofable). It counts as consent only
  // once the session is paid; unpaid gate sessions never get consented_email.
  // paid AND a real charge: a 100% promo code must not be able to consent any email.
  const paid = s.status === "complete" && s.payment_status === "paid" &&
    (s.amount_total ?? 0) > 0;
  const claimed = gate && s.metadata?.marketing_consent_claimed === "true";
  const consent = gate
    ? (paid ? (claimed ? "opt_in" : "opt_out") : null)
    : (s.consent?.promotions ?? null);
  // known_email: the address the buyer gave the gate (or Stripe has). It makes the row
  // NAMED in the Money Pipe. It is NOT permission to contact: only consented_email is.
  const knownEmail = s.customer_email ?? s.customer_details?.email ?? null;
  return {
    id: s.id,
    payment_link_id: link,
    status: s.status!,
    payment_status: s.payment_status,
    created_at: new Date(s.created * 1000).toISOString(),
    expires_at: new Date(s.expires_at * 1000).toISOString(),
    amount_total: s.amount_total,
    currency: s.currency,
    consent_promotions: consent,
    consented_email: consent === "opt_in"
      ? (s.customer_details?.email ?? s.customer_email ?? null)
      : null,
    known_email: knownEmail,
    consent_claimed: gate ? claimed : null,
    client_reference_id: s.client_reference_id ?? null,
    source: gate ? "deepgrain_gate" : "payment_link",
    recovered_from: s.recovered_from ?? null,
    last_seen_at: seenAt,
  };
}
