import { Helmet } from "react-helmet-async";

/**
 * Site-wide entity graph: Organization + Person + WebSite.
 *
 * Mounted once in SiteShell so every route ships these signals. They build
 * the knowledge-graph entities Google uses to:
 *   - associate articles with a recognised author (Person, sameAs links)
 *   - associate the brand with a recognised organisation (Organization, logo)
 *   - enable sitelinks search box for branded queries (WebSite)
 *
 * Data here is canonical, not page-specific. Per-article Article/QAPage/
 * BreadcrumbList JSON-LD continues to live on the relevant page components.
 */
export const SiteEntityLd = () => {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://deepgrain.ai/#organization",
    name: "Deepgrain",
    url: "https://deepgrain.ai",
    logo: {
      "@type": "ImageObject",
      url: "https://deepgrain.ai/og-image.png",
    },
    founder: { "@id": "https://deepgrain.ai/about#matthew-bradburn" },
    description:
      "Organisational consultancy that reads the grain of how a company actually operates, then changes it without breaking what works.",
    sameAs: [
      "https://www.linkedin.com/company/deepgrain",
    ],
  };

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://deepgrain.ai/about#matthew-bradburn",
    name: "Matthew Bradburn",
    url: "https://deepgrain.ai/about",
    jobTitle: "Operating consultant",
    worksFor: { "@id": "https://deepgrain.ai/#organization" },
    description:
      "Operating consultant working with founders and operating leaders building AI-native, defence, financial data, transit, and climate companies.",
    sameAs: [
      "https://www.linkedin.com/in/matthewbradburn",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://deepgrain.ai/#website",
    url: "https://deepgrain.ai",
    name: "Deepgrain",
    publisher: { "@id": "https://deepgrain.ai/#organization" },
    inLanguage: "en-GB",
  };

  // ProfessionalService describes the consultancy as a discoverable
  // entity. Sitewide because it's an entity descriptor, not page state.
  const service = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://deepgrain.ai/#service",
    name: "Deepgrain",
    url: "https://deepgrain.ai",
    parentOrganization: { "@id": "https://deepgrain.ai/#organization" },
    founder: { "@id": "https://deepgrain.ai/about#matthew-bradburn" },
    serviceType: [
      "Organisational consultancy",
      "AI operating systems",
      "AI enablement",
      "Operating diagnostics",
    ],
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Place", name: "Europe" },
      { "@type": "Place", name: "North America" },
    ],
    audience: {
      "@type": "BusinessAudience",
      audienceType:
        "Founder-led companies in AI-native, defence, financial data, transit and climate sectors",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(org)}</script>
      <script type="application/ld+json">{JSON.stringify(person)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
      <script type="application/ld+json">{JSON.stringify(service)}</script>
    </Helmet>
  );
};
