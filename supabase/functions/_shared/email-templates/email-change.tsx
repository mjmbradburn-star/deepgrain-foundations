/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

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
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

const COLOR_WALNUT = '#1C0F0A'
const COLOR_GREEN = '#123524'
const COLOR_BRASS = '#A07840'
const COLOR_CREAM = '#F5EBD3'
const COLOR_BODY = '#42342B'
const COLOR_MUTED = '#6B5D52'

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your new email address for {siteName}.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandHeader}>
          <Text style={brandMark}>DEEPGRAIN</Text>
        </Section>
        <Section style={contentSection}>
          <Text style={eyebrow}>Confirm change</Text>
          <Heading style={h1}>Confirm your new email.</Heading>
          <Text style={text}>
            You asked to change the email address on your {siteName} account
            from{' '}
            <Link href={`mailto:${email}`} style={link}>
              {email}
            </Link>{' '}
            to{' '}
            <Link href={`mailto:${newEmail}`} style={link}>
              {newEmail}
            </Link>
            .
          </Text>
          <Section style={ctaSection}>
            <Button style={primaryButton} href={confirmationUrl}>
              Confirm change →
            </Button>
          </Section>
          <Text style={footer}>
            If you didn&apos;t request this, please secure your account
            right away.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }
const brandHeader = { padding: '32px 32px 0', textAlign: 'left' as const }
const brandMark = { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '20px', fontWeight: 600, letterSpacing: '0.16em', color: COLOR_WALNUT, margin: 0 }
const contentSection = { padding: '32px 32px 40px' }
const eyebrow = { fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: COLOR_BRASS, fontWeight: 600, margin: '0 0 20px' }
const h1 = { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '36px', lineHeight: '1.05', fontWeight: 400, color: COLOR_GREEN, margin: '0 0 24px', letterSpacing: '-0.01em' }
const text = { fontSize: '16px', lineHeight: '1.65', color: COLOR_BODY, margin: '0 0 20px' }
const link = { color: COLOR_GREEN, textDecoration: 'underline', textDecorationColor: COLOR_BRASS }
const ctaSection = { margin: '8px 0 28px', textAlign: 'left' as const }
const primaryButton = { backgroundColor: COLOR_GREEN, color: COLOR_CREAM, fontSize: '14px', fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none', padding: '14px 28px', borderRadius: '999px', display: 'inline-block' }
const footer = { fontSize: '12px', color: COLOR_MUTED, lineHeight: '1.5', margin: '32px 0 0' }
