/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

const COLOR_WALNUT = '#1C0F0A'
const COLOR_GREEN = '#123524'
const COLOR_BRASS = '#A07840'
const COLOR_CREAM = '#F5EBD3'
const COLOR_BODY = '#42342B'
const COLOR_MUTED = '#6B5D52'

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your sign-in link for {siteName}.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandHeader}>
          <Text style={brandMark}>DEEPGRAIN</Text>
        </Section>
        <Section style={contentSection}>
          <Text style={eyebrow}>Sign in</Text>
          <Heading style={h1}>Your sign-in link.</Heading>
          <Text style={text}>
            Use the link below to sign in to {siteName}. It expires shortly,
            so try to use it within the next few minutes.
          </Text>
          <Section style={ctaSection}>
            <Button style={primaryButton} href={confirmationUrl}>
              Sign in →
            </Button>
          </Section>
          <Text style={footer}>
            If you didn&apos;t request this, you can safely ignore this
            email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }
const brandHeader = { padding: '32px 32px 0', textAlign: 'left' as const }
const brandMark = { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '20px', fontWeight: 600, letterSpacing: '0.16em', color: COLOR_WALNUT, margin: 0 }
const contentSection = { padding: '32px 32px 40px' }
const eyebrow = { fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: COLOR_BRASS, fontWeight: 600, margin: '0 0 20px' }
const h1 = { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '36px', lineHeight: '1.05', fontWeight: 400, color: COLOR_GREEN, margin: '0 0 24px', letterSpacing: '-0.01em' }
const text = { fontSize: '16px', lineHeight: '1.65', color: COLOR_BODY, margin: '0 0 20px' }
const ctaSection = { margin: '8px 0 28px', textAlign: 'left' as const }
const primaryButton = { backgroundColor: COLOR_GREEN, color: COLOR_CREAM, fontSize: '14px', fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none', padding: '14px 28px', borderRadius: '999px', display: 'inline-block' }
const footer = { fontSize: '12px', color: COLOR_MUTED, lineHeight: '1.5', margin: '32px 0 0' }
