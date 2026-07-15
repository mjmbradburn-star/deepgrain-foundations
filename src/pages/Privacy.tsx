import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BrassRule } from "@/components/ui/BrassRule";
import { PageMeta } from "@/components/seo/PageMeta";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-walnut text-2xl md:text-3xl mt-12 mb-4" style={{ letterSpacing: "-0.01em" }}>
    {children}
  </h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-walnut/80 leading-relaxed mb-4">{children}</p>
);

const Privacy = () => (
  <section className="bg-linen text-walnut min-h-screen pt-40 pb-32">
    <PageMeta
      title="Privacy Policy | Deepgrain"
      description="How Deepgrain collects, uses, and protects your personal data under UK and EU GDPR."
      path="/privacy"
    />
    <div className="container-grain max-w-3xl">
      <ScrollReveal>
        <Eyebrow className="text-walnut/60 mb-6">Privacy</Eyebrow>
        <h1 className="font-display text-walnut text-5xl md:text-6xl leading-[1.05] text-balance">
          Privacy policy.
        </h1>
        <p className="mt-6 text-walnut/60 text-sm">Last updated: 20 April 2026</p>
        <BrassRule className="my-10" />

        <P>
          This policy explains what personal data Deepgrain Ltd collects through
          this website, why we collect it, and what your rights are. Plain
          language. No surprises.
        </P>

        <H2>Who we are</H2>
        <P>
          Deepgrain Ltd is the data controller. Registered in England and Wales.
          You can reach us at{" "}
          <a href="mailto:matt@deepgrain.ai" className="text-walnut underline underline-offset-2 hover:text-brass">
            matt@deepgrain.ai
          </a>
          .
        </P>

        <H2>What we collect</H2>
        <P>
          <strong>Subscribers.</strong> If you join the mailing list, we store
          your email address, the page you subscribed from, and the date.
        </P>
        <P>
          <strong>The Brain.</strong> If you request the People Ops AI Brain
          at{" "}
          <Link to="/brain" className="text-walnut underline underline-offset-2 hover:text-brass">
            /brain
          </Link>
          , we store your first name (optional), email address, the timestamp
          you gave consent, your IP address, and the user agent of the browser
          you submitted from. The IP and user agent are kept as a light audit
          trail for the consent record.
        </P>
        <P>
          <strong>Brain link resends.</strong> If you ask us to resend your
          Brain link at{" "}
          <Link to="/brain/resend" className="text-walnut underline underline-offset-2 hover:text-brass">
            /brain/resend
          </Link>
          , we'll tell you whether your address is on file, has unsubscribed,
          or has been blocked due to bounces or spam complaints - so you know
          why access isn't working. This is a deliberate, scoped exception to
          our usual practice of not disclosing whether an email is on file.
        </P>
        <P>
          <strong>Enquiries.</strong> If you use the contact form, we store the
          name, email, organisation, team size, and message you give us.
        </P>
        <P>
          <strong>Server logs.</strong> Our hosting providers keep short-term
          logs of IP address and request metadata to keep the site secure and
          working. These are not used for marketing.
        </P>

        <H2>Why we use it</H2>
        <P>
          <strong>Mailing list.</strong> Lawful basis: your consent. We send
          occasional notes on operating systems and leadership. You can
          unsubscribe from any email or by writing to us.
        </P>
        <P>
          <strong>Enquiries.</strong> Lawful basis: legitimate interest in
          replying to people who contact us about working together.
        </P>
        <P>
          <strong>Site security and uptime.</strong> Lawful basis: legitimate
          interest in keeping the site available and free from abuse.
        </P>

        <H2>How long we keep it</H2>
        <P>
          Subscriber records are kept until you unsubscribe. Brain subscribers
          are kept for up to 24 months after your last engagement, then deleted
          unless you ask us to keep you on the list. Enquiries are kept for up
          to three years so we can pick up a conversation later, then deleted.
          Server logs are short-lived and managed by our hosting providers.
        </P>

        <H2>Who processes it</H2>
        <P>
          We use a small set of trusted providers to run the site and send
          email. Brain subscriber data and the welcome email are handled by
          Lovable Cloud (EU-region storage), which uses Supabase as the
          underlying platform. These providers act as processors on our
          instructions and are bound by data processing terms.
        </P>

        <H2>International transfers</H2>
        <P>
          Some of our providers process data outside the UK and EEA. Where they
          do, transfers are covered by standard contractual clauses or an
          equivalent safeguard.
        </P>

        <H2>Your rights</H2>
        <P>
          Under UK and EU GDPR you can ask us to access, correct, delete, or
          restrict the personal data we hold on you. You can also object to
          processing and ask for portability. Write to{" "}
          <a href="mailto:matt@deepgrain.ai" className="text-walnut underline underline-offset-2 hover:text-brass">
            matt@deepgrain.ai
          </a>{" "}
          and we will respond within one month.
        </P>
        <P>
          If you are not happy with how we have handled your data, you can
          complain to the UK Information Commissioner's Office at{" "}
          <a href="https://ico.org.uk" className="text-walnut underline underline-offset-2 hover:text-brass" rel="noopener">
            ico.org.uk
          </a>
          , or to your local data protection authority in the EU.
        </P>

        <H2>Cookies</H2>
        <P>
          See our{" "}
          <Link to="/cookies" className="text-walnut underline underline-offset-2 hover:text-brass">
            cookie policy
          </Link>{" "}
          for details on the small amount of storage this site uses.
        </P>

        <H2>Changes</H2>
        <P>
          If we change this policy, we will update the date above. Material
          changes will be flagged on the site.
        </P>
      </ScrollReveal>
    </div>
  </section>
);

export default Privacy;
