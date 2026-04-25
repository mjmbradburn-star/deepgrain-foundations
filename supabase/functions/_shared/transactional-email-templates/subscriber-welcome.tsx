/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

const SITE_NAME = "Deepgrain";
const SITE_URL = "https://deepgrain.ai";

// Brand palette (from src/index.css HSL tokens, converted for email inline styles)
const COLOR_WALNUT = "#1C0F0A";
const COLOR_GREEN = "#123524";
const COLOR_BRASS = "#A07840";
const COLOR_CREAM = "#F5EBD3";
const COLOR_BODY = "#42342B";
const COLOR_MUTED = "#6B5D52";

type Source = "footer" | "work" | "article" | "intelligence-hub" | string;

interface SubscriberWelcomeProps {
  source?: Source;
  articleSlug?: string | null;
}

const COPY: Record<string, { eyebrow: string; opener: string }> = {
  footer: {
    eyebrow: "From the workshop",
    opener:
      "Thank you for subscribing from the footer of deepgrain.ai. You'll receive occasional dispatches — never noise.",
  },
  work: {
    eyebrow: "From the work",
    opener:
      "Thank you for subscribing from The Work. You'll receive field notes from our engagements — patterns we keep seeing across operating systems and leadership.",
  },
  article: {
    eyebrow: "From the Intelligence",
    opener:
      "Thank you for subscribing after reading. You'll receive new Intelligence pieces as they're published — and the occasional quieter note in between.",
  },
  "intelligence-hub": {
    eyebrow: "From the Intelligence",
    opener:
      "Thank you for subscribing to the Intelligence. You'll receive new pieces as they're published — and the occasional quieter note in between.",
  },
  unknown: {
    eyebrow: "From the workshop",
    opener:
      "Thank you for subscribing. You'll receive occasional dispatches from Deepgrain — never noise.",
  },
};

const SubscriberWelcomeEmail = ({
  source = "unknown",
  articleSlug,
}: SubscriberWelcomeProps) => {
  const copy = COPY[source] ?? COPY.unknown;
  const articleUrl = articleSlug
    ? `${SITE_URL}/intelligence/${articleSlug}`
    : null;

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're on the list. Welcome to Deepgrain.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandHeader}>
            <Text style={brandMark}>DEEPGRAIN</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={eyebrow}>{copy.eyebrow}</Text>
            <Heading style={h1}>You're on the list.</Heading>

            <Text style={text}>{copy.opener}</Text>

            <Text style={text}>
              We write about the discipline of building organisations that hold
              their shape — operating systems, the craft of leadership, and the
              long arc of work done with the grain.
            </Text>

            {articleUrl && (
              <Text style={text}>
                If you'd like to revisit the piece you were reading,{" "}
                <Link href={articleUrl} style={link}>
                  you can find it here
                </Link>
                .
              </Text>
            )}

            <Hr style={hr} />

            <Text style={signoff}>
              Quietly,
              <br />
              The Deepgrain team
            </Text>

            <Text style={footer}>
              <Link href={SITE_URL} style={footerLink}>
                deepgrain.ai
              </Link>
              {" · "}
              <Link href={`${SITE_URL}/intelligence`} style={footerLink}>
                Intelligence
              </Link>
              {" · "}
              <Link href={`${SITE_URL}/work`} style={footerLink}>
                Work
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: SubscriberWelcomeEmail,
  subject: "You're on the list — welcome to Deepgrain",
  displayName: "Subscriber welcome",
  previewData: {
    source: "article",
    articleSlug: "what-is-organisational-consultancy",
  },
} satisfies TemplateEntry;

// Styles — inline objects for email clients
const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};

const container = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "0",
  backgroundColor: "#ffffff",
};

const brandHeader = {
  padding: "32px 32px 0",
  textAlign: "left" as const,
};

const brandMark = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "20px",
  fontWeight: 600,
  letterSpacing: "0.16em",
  color: COLOR_WALNUT,
  margin: 0,
};

const contentSection = {
  padding: "32px 32px 40px",
};

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
  lineHeight: "1.1",
  fontWeight: 400,
  color: COLOR_GREEN,
  margin: "0 0 28px",
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

const hr = {
  borderTop: `1px solid ${COLOR_CREAM}`,
  borderBottom: "none",
  borderLeft: "none",
  borderRight: "none",
  margin: "36px 0 28px",
};

const signoff = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: "italic" as const,
  fontSize: "17px",
  lineHeight: "1.5",
  color: COLOR_WALNUT,
  margin: "0 0 32px",
};

const footer = {
  fontSize: "12px",
  color: COLOR_MUTED,
  margin: "0",
  letterSpacing: "0.04em",
};

const footerLink = {
  color: COLOR_MUTED,
  textDecoration: "none",
};
