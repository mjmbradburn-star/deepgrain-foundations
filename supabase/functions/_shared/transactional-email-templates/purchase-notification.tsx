/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

interface Props {
  productLabel?: string;
  amount?: string;
  buyerName?: string;
  buyerEmail?: string;
  sessionId?: string;
  paidAt?: string;
}

const PurchaseNotificationEmail = (
  {
    productLabel = "",
    amount = "",
    buyerName = "",
    buyerEmail = "",
    sessionId = "",
    paidAt = "",
  }: Props,
) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`Paid: ${productLabel} ${amount}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section>
          <Text style={heading}>New payment on deepgrain.ai</Text>
          <Text style={line}>Product: {productLabel}</Text>
          <Text style={line}>Amount: {amount}</Text>
          <Text style={line}>Name: {buyerName}</Text>
          <Text style={line}>Email: {buyerEmail}</Text>
          <Text style={line}>Stripe session: {sessionId}</Text>
          <Text style={line}>Recorded: {paidAt}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: PurchaseNotificationEmail,
  subject: (data: Record<string, unknown>) =>
    `Paid: ${data?.productLabel ?? "checkout"} ${data?.amount ?? ""} from ${
      data?.buyerName ?? "a buyer"
    }`,
  // Fixed owner recipient. The caller cannot redirect this email.
  to: "matt@peopleleaders.io",
  displayName: "Purchase notification (owner)",
  previewData: {
    productLabel: "Founding seat",
    amount: "£495.00",
    buyerName: "Sam Example",
    buyerEmail: "sam@example.com",
    sessionId: "cs_live_example",
    paidAt: "2026-10-05T09:00:00.000Z",
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};
const container = { maxWidth: "560px", margin: "0 auto", padding: "24px" };
const heading = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#123524",
  margin: "0 0 16px",
};
const line = {
  fontSize: "15px",
  lineHeight: "1.5",
  color: "#42342B",
  margin: "0 0 6px",
};
