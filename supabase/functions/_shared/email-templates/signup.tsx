/// <reference types="npm:@types/react@18.3.1" />

import * as React from "npm:react@18.3.1";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "npm:@react-email/components@0.0.22";

interface SignupEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
}

// Brand palette — mirrors src/index.css HSL tokens.
const COLOR_WALNUT = "#1C0F0A";
const COLOR_GREEN = "#123524";
const COLOR_BRASS = "#A07840";
const COLOR_CREAM = "#F5EBD3";
const COLOR_BODY = "#42342B";
const COLOR_MUTED = "#6B5D52";

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email to finish signing in to {siteName}.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandHeader}>
          <Text style={brandMark}>DEEPGRAIN</Text>
        </Section>
        <Section style={contentSection}>
          <Text style={eyebrow}>Confirm email</Text>
          <Heading style={h1}>One quick confirmation.</Heading>
          <Text style={text}>
            Thanks for signing up for{" "}
            <Link href={siteUrl} style={link}>
              {siteName}
            </Link>
            . Please confirm{" "}
            <Link href={`mailto:${recipient}`} style={link}>
              {recipient}
            </Link>{" "}
            so we know it&apos;s you.
          </Text>
          <Section style={ctaSection}>
            <Button style={primaryButton} href={confirmationUrl}>
              Confirm email →
            </Button>
          </Section>
          <Text style={footer}>
            If you didn&apos;t create an account, you can safely ignore this
            email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default SignupEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};
const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};
const brandHeader = { padding: "32px 32px 0", textAlign: "left" as const };
const brandMark = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "20px",
  fontWeight: 600,
  letterSpacing: "0.16em",
  color: COLOR_WALNUT,
  margin: 0,
};
const contentSection = { padding: "32px 32px 40px" };
const eyebrow = {
  fontSize: "11px",
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: COLOR_BRASS,
  fontWeight: 600,
  margin: "0 0 20px",
};
const h1 = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "36px",
  lineHeight: "1.05",
  fontWeight: 400,
  color: COLOR_GREEN,
  margin: "0 0 24px",
  letterSpacing: "-0.01em",
};
const text = {
  fontSize: "16px",
  lineHeight: "1.65",
  color: COLOR_BODY,
  margin: "0 0 20px",
};
const link = {
  color: COLOR_GREEN,
  textDecoration: "underline",
  textDecorationColor: COLOR_BRASS,
};
const ctaSection = { margin: "8px 0 28px", textAlign: "left" as const };
const primaryButton = {
  backgroundColor: COLOR_GREEN,
  color: COLOR_CREAM,
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textDecoration: "none",
  padding: "14px 28px",
  borderRadius: "999px",
  display: "inline-block",
};
const footer = {
  fontSize: "12px",
  color: COLOR_MUTED,
  lineHeight: "1.5",
  margin: "32px 0 0",
};
