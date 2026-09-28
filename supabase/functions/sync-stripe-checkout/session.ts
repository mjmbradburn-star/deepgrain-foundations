// Only these two links appear in the live Deepgrain course page.
export const LINKS = {
  plink_1UIbEZQQIEQm1i6qWCLPgt32: "founding",
  plink_1UIbFBQQIEQm1i6qipC7fg1N: "standard",
} as const;

export type CheckoutSession = {
  id: string;
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
  if (
    !s.payment_link || !(s.payment_link in LINKS) ||
    !s.id.startsWith("cs_") ||
    !["open", "complete", "expired"].includes(s.status ?? "")
  ) {
    throw new Error("Unexpected checkout session in Stripe response");
  }
  // Stripe's abandonment guide: an email entered on hosted Checkout is not
  // reliably supplied on expiry without promotional consent. Never store an
  // unconsented email as a lead or treat it as permission to contact.
  const consent = s.consent?.promotions ?? null;
  return {
    id: s.id,
    payment_link_id: s.payment_link,
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
    recovered_from: s.recovered_from ?? null,
    last_seen_at: seenAt,
  };
}
