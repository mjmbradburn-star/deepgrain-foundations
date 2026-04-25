/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Deepgrain'
const SITE_URL = 'https://deepgrain.ai'

// Brand palette mirrored from src/index.css HSL tokens.
const COLOR_WALNUT = '#1C0F0A'
const COLOR_GREEN = '#123524'
const COLOR_BRASS = '#A07840'
const COLOR_CREAM = '#F5EBD3'
const COLOR_BODY = '#42342B'
const COLOR_MUTED = '#6B5D52'

interface BrainWelcomeProps {
  firstName?: string | null
  brainUrl: string
  aioiUrl: string
}

const BrainWelcomeEmail = ({
  firstName,
  brainUrl,
  aioiUrl,
}: BrainWelcomeProps) => {
  const greeting = firstName ? `Hello ${firstName},` : 'Hello,'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>The People Ops AI Brain — one link, yours to keep.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Brand mark */}
          <Section style={brandHeader}>
            <Text style={brandMark}>DEEPGRAIN</Text>
          </Section>

          {/* Primary content */}
          <Section style={contentSection}>
            <Text style={eyebrow}>The Brain</Text>
            <Heading style={h1}>
              The People Ops AI Brain.
            </Heading>

            <Text style={text}>{greeting}</Text>

            <Text style={text}>
              Thanks for asking for the Brain. The link below is yours to
              keep — no expiry, no drip, no follow-up unless you want one.
            </Text>

            <Section style={ctaSection}>
              <Button href={brainUrl} style={primaryButton}>
                Open the Brain →
              </Button>
            </Section>

            <Text style={text}>
              If you&apos;re not sure where to start, the{' '}
              <Link href={brainUrl} style={link}>
                Find Your Starting Point
              </Link>{' '}
              section near the top is the fastest route in. From there
              you can drop into Foundations, Skills, Systems, or the Human
              Layer depending on what you need this week.
            </Text>

            <Hr style={hr} />

            {/* AIOI cross-sell — kept light */}
            <Section style={secondaryCard}>
              <Text style={secondaryEyebrow}>While you&apos;re here</Text>
              <Heading as="h2" style={h2}>
                See how your function actually scores.
              </Heading>
              <Text style={secondaryText}>
                The AI Operating Index is a short diagnostic — twelve
                questions, one honest score across the dimensions that
                separate AI-native People teams from the rest.
              </Text>
              <Section style={ctaSection}>
                <Button href={aioiUrl} style={outlineButton}>
                  Take the AIOI →
                </Button>
              </Section>
            </Section>

            <Hr style={hr} />

            <Text style={signoff}>
              Quietly,
              <br />
              Matt
            </Text>

            <Text style={footer}>
              <Link href={SITE_URL} style={footerLink}>
                deepgrain.ai
              </Link>
              {' · '}
              <Link href={`${SITE_URL}/brain`} style={footerLink}>
                The Brain
              </Link>
              {' · '}
              <Link href={`${SITE_URL}/privacy`} style={footerLink}>
                Privacy
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: BrainWelcomeEmail,
  subject: 'The People Ops AI Brain — your link inside',
  displayName: 'Brain — welcome',
  previewData: {
    firstName: 'Sam',
    brainUrl: 'https://deepgrain.ai/brain/open?t=preview',
    aioiUrl: 'https://aioi.deepgrain.ai',
  },
} satisfies TemplateEntry

// ─── Styles ───────────────────────────────────────────────────────────
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: 0,
  backgroundColor: '#ffffff',
}

const brandHeader = {
  padding: '32px 32px 0',
  textAlign: 'left' as const,
}

const brandMark = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '20px',
  fontWeight: 600,
  letterSpacing: '0.16em',
  color: COLOR_WALNUT,
  margin: 0,
}

const contentSection = {
  padding: '32px 32px 40px',
}

const eyebrow = {
  fontSize: '11px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: COLOR_BRASS,
  fontWeight: 600,
  margin: '0 0 20px',
}

const h1 = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '40px',
  lineHeight: '1.05',
  fontWeight: 400,
  color: COLOR_GREEN,
  margin: '0 0 28px',
  letterSpacing: '-0.01em',
}

const h2 = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '24px',
  lineHeight: '1.15',
  fontWeight: 400,
  color: COLOR_CREAM,
  margin: '0 0 16px',
  letterSpacing: '-0.005em',
}

const text = {
  fontSize: '16px',
  lineHeight: '1.65',
  color: COLOR_BODY,
  margin: '0 0 20px',
}

const link = {
  color: COLOR_GREEN,
  textDecoration: 'underline',
  textDecorationColor: COLOR_BRASS,
}

const ctaSection = {
  margin: '8px 0 28px',
  textAlign: 'left' as const,
}

const primaryButton = {
  backgroundColor: COLOR_GREEN,
  color: COLOR_CREAM,
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textDecoration: 'none',
  padding: '14px 28px',
  borderRadius: '999px',
  display: 'inline-block',
}

const outlineButton = {
  backgroundColor: 'transparent',
  color: COLOR_CREAM,
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '999px',
  display: 'inline-block',
  border: `1px solid ${COLOR_BRASS}`,
}

const secondaryCard = {
  backgroundColor: COLOR_WALNUT,
  borderRadius: '16px',
  padding: '28px 28px 8px',
  margin: '8px 0 0',
}

const secondaryEyebrow = {
  fontSize: '11px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: COLOR_BRASS,
  fontWeight: 600,
  margin: '0 0 12px',
}

const secondaryText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#D9CDB6',
  margin: '0 0 18px',
}

const hr = {
  borderTop: `1px solid ${COLOR_CREAM}`,
  borderBottom: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  margin: '36px 0 28px',
}

const signoff = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'italic' as const,
  fontSize: '17px',
  lineHeight: '1.5',
  color: COLOR_WALNUT,
  margin: '0 0 32px',
}

const footer = {
  fontSize: '12px',
  color: COLOR_MUTED,
  margin: '0',
  letterSpacing: '0.04em',
}

const footerLink = {
  color: COLOR_MUTED,
  textDecoration: 'none',
}
