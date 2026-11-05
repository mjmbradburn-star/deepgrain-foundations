/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

const SITE_URL = "https://deepgrain.ai";

interface Props {
  kind?: "course" | "diagnostic" | string;
  productLabel?: string;
  firstName?: string;
  cohortStart?: string;
}

// Session metadata carries the cohort's first session (YYYY-MM-DD). Monday starts are the
// Americas time, Thursday starts the UK time; anything else or missing gets generic wording
// so no buyer ever reads dates for the wrong cohort.
const cohortSchedule = (cohortStart?: string): string | null => {
  if (!cohortStart || !/^\d{4}-\d{2}-\d{2}$/.test(cohortStart)) return null;
  const d = new Date(`${cohortStart}T12:00:00Z`);
  if (isNaN(d.getTime())) return null;
  const weekday = d.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  if (weekday === "Monday") return `Mondays at 9am Pacific, starting ${date}`;
  if (weekday === "Thursday") return `Thursdays at 2pm UK, starting ${date}`;
  return null;
};

const PurchaseConfirmationEmail = (
  { kind = "course", productLabel = "seat", firstName = "there", cohortStart }: Props,
) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      {kind === "course"
        ? "Your Deepgrain cohort seat is confirmed."
        : "Your payment for the AI Ladder Diagnostic is received."}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={content}>
          <Text style={brand}>DEEPGRAIN</Text>
          <Heading style={h1}>
            {kind === "course" ? "You're in." : "Payment received."}
          </Heading>
          <Text style={text}>Thank you, {firstName}.</Text>
          {kind === "course"
            ? (
              <>
                <Text style={text}>
                  Your {productLabel} for the Deepgrain AI Cohort is confirmed.
                </Text>
                <Text style={text}>
                  {cohortSchedule(cohortStart)
                    ? `Your cohort meets ${cohortSchedule(cohortStart)}. Five weekly sessions of 75 minutes each.`
                    : "The cohort meets at two live times: Mondays at 9am Pacific or Thursdays at 2pm UK, for five weekly sessions of 75 minutes each. Your cohort's dates are the ones shown when you checked out."}
                </Text>
                <Text style={text}>
                  I will email your joining details before your first session.
                </Text>
              </>
            )
            : (
              <>
                <Text style={text}>
                  Your payment for the AI Ladder Diagnostic is received.
                </Text>
                <Text style={text}>
                  Next I will email you to agree the team, the three workflows
                  you want to bring and a date for the 90-minute working
                  session.
                </Text>
              </>
            )}
          <Text style={text}>
            Stripe sends your payment receipt separately.
          </Text>
          <Text style={text}>Matt</Text>
          <Text style={footer}>
            <Link href={SITE_URL} style={footerLink}>deepgrain.ai</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: PurchaseConfirmationEmail,
  subject: (data: Record<string, unknown>) =>
    data?.kind === "diagnostic"
      ? "Your AI Ladder Diagnostic payment is received"
      : "You're in: your Deepgrain cohort seat is confirmed",
  displayName: "Purchase confirmation",
  previewData: {
    kind: "course",
    productLabel: "Founding seat",
    firstName: "Sam",
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};
const container = { maxWidth: "560px", margin: "0 auto", padding: "0" };
const content = { padding: "32px 32px 40px" };
const brand = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "20px",
  fontWeight: 600,
  letterSpacing: "0.16em",
  color: "#1C0F0A",
  margin: "0 0 28px",
};
const h1 = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "34px",
  lineHeight: "1.1",
  fontWeight: 400,
  color: "#123524",
  margin: "0 0 24px",
};
const text = {
  fontSize: "16px",
  lineHeight: "1.65",
  color: "#42342B",
  margin: "0 0 18px",
};
const footer = { fontSize: "13px", color: "#6B5D52", margin: "24px 0 0" };
const footerLink = { color: "#6B5D52", textDecoration: "underline" };
