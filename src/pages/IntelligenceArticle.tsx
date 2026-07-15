import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, Navigate } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import {
  getArticleBySlug,
  getCategory,
  getRelatedArticles,
  getHeroImage,
} from "@/lib/intelligence";
import { mdxComponents } from "@/components/intelligence/mdxComponents";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { EmailCapture } from "@/components/forms/EmailCapture";
import { AIOI_URL } from "@/lib/aioi";
import { buildBreadcrumbLd } from "@/lib/breadcrumbs";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FAQ, buildFAQLd } from "@/components/sections/FAQ";
import { BarkSection } from "@/components/ui/BarkSection";
import { ClusterChips } from "@/components/intelligence/ClusterChips";
import { SaveLink } from "@/components/intelligence/SaveLink";
import { track } from "@/lib/analytics";
import { ArrowUpRight } from "lucide-react";

const IntelligenceArticle = () => {
  const { slug = "" } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) return <Navigate to="/intelligence" replace />;

  const { frontmatter: f, Component, faqs } = article;
  const cat = getCategory(f.category);
  const related = getRelatedArticles(slug, 3);
  const url = `https://www.deepgrain.ai/intelligence/${f.slug}`;
  const heroImage = getHeroImage(f.slug);
  const ogImage = `https://www.deepgrain.ai/og/intelligence/${f.slug}.jpg`;
  const dateModified = f.updatedAt || f.publishedAt;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: f.title,
    description: f.description,
    keywords: f.keywords?.join(", "),
    author: {
      "@type": "Person",
      "@id": "https://www.deepgrain.ai/about#matthew-bradburn",
      name: f.author,
      url: "https://www.deepgrain.ai/about",
    },
    datePublished: f.publishedAt,
    dateModified,
    publisher: {
      "@type": "Organization",
      name: "Deepgrain",
      url: "https://www.deepgrain.ai",
      logo: {
        "@type": "ImageObject",
        url: "https://www.deepgrain.ai/og-image.png",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: ogImage,
  };

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "Home", url: "https://www.deepgrain.ai/" },
    { name: "Intelligence", url: "https://www.deepgrain.ai/intelligence" },
    ...(cat
      ? [{ name: cat.name, url: `https://www.deepgrain.ai/intelligence/category/${cat.slug}` }]
      : []),
    { name: f.title, url },
  ]);

  return (
    <>
      <Helmet>
        <title>{
          (() => {
            const suffix = " | Deepgrain";
            if (f.title.length + suffix.length <= 60) return f.title + suffix;
            if (f.title.length <= 60) return f.title;
            return f.title.slice(0, 57).trimEnd() + "…";
          })()
        }</title>
        <meta name="description" content={f.description} />
        <meta name="keywords" content={f.keywords?.join(", ")} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={f.title} />
        <meta property="og:description" content={f.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
        <meta property="article:published_time" content={f.publishedAt} />
        <meta property="article:modified_time" content={dateModified} />
        <meta property="article:author" content={f.author} />
        <meta property="article:section" content={cat?.name} />
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        {faqs && faqs.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(buildFAQLd(faqs))}</script>
        )}
      </Helmet>

      {/* Masthead: one continuous dark surface. Full-bleed hero image melts
          into the headline block below it: no card, no shadow, no seam. */}
      <div className="bg-green text-cream">
        {heroImage && (
          <div className="relative w-full">
            <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
              <picture>
                {heroImage.avif && <source srcSet={heroImage.avif} type="image/avif" />}
                {heroImage.webp && <source srcSet={heroImage.webp} type="image/webp" />}
                <img
                  src={heroImage.src}
                  alt=""
                  width={1600}
                  height={900}
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>
            {/* Top scrim keeps the fixed nav legible; bottom scrim dissolves the
                image into the green headline block for one continuous surface. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-green/75 via-green/10 to-green"
            />
          </div>
        )}

        {/* Headline block: eyebrow rail, headline, italic Cormorant sub-line */}
        <header
          className={`pb-16 md:pb-24 ${
            heroImage ? "pt-8 md:pt-10" : "pt-40 md:pt-48"
          }`}
        >
          <div className="container-grain max-w-[720px]">
          <Breadcrumbs
            variant="dark"
            className="mb-6"
            items={[
              { name: "Home", href: "/" },
              { name: "Intelligence", href: "/intelligence" },
              ...(cat
                ? [{ name: cat.name, href: `/intelligence/category/${cat.slug}` }]
                : []),
              { name: f.title },
            ]}
          />
          {/* Deck-style eyebrow rail: brass hairline + tracked-caps category */}
          <div className="flex items-center gap-3 mb-8">
            <span aria-hidden className="inline-block h-px w-8 bg-brass/80" />
            <Link
              to={`/intelligence/category/${f.category}`}
              className="font-sans uppercase text-[11px] text-brass hover:text-cream transition-colors"
              style={{ letterSpacing: "0.22em", fontWeight: 600 }}
            >
              {cat?.name}
            </Link>
            <span className="text-cream/30">·</span>
            <span
              className="font-sans uppercase text-[11px] text-cream/55"
              style={{ letterSpacing: "0.18em" }}
            >
              {f.readTime}
            </span>
          </div>
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.0] mb-8"
            style={{ letterSpacing: "-0.015em" }}
          >
            {f.title}
          </h1>
          {/* Italic Cormorant sub-line, deck slide-1 pattern */}
          <p className="font-display italic text-cream/85 text-xl md:text-2xl leading-snug max-w-2xl">
            {f.description}
          </p>
          {(f.primaryCluster || (f.clusters && f.clusters.length > 0)) && (
            <div className="mt-8">
              <ClusterChips
                primary={f.primaryCluster}
                secondary={f.clusters}
                className="opacity-95"
              />
            </div>
          )}
          <div className="mt-10 pt-6 border-t border-cream/15 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-cream/60">
            <Link
              to="/about"
              className="hover:text-cream transition-colors"
            >
              {f.author}
            </Link>
            <span className="text-cream/30">·</span>
            <time dateTime={f.publishedAt}>
              Published {new Date(f.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {f.updatedAt && f.updatedAt !== f.publishedAt && (
              <>
                <span className="text-cream/30">·</span>
                <time dateTime={f.updatedAt}>
                  Updated {new Date(f.updatedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
            <span className="text-cream/30 hidden sm:inline">·</span>
            <SaveLink className="ml-auto sm:ml-0" />
          </div>
          </div>
        </header>
      </div>

      {/* Body , one continuous linen reading surface, a single considered measure */}
      <article className="bg-linen pt-14 md:pt-20 pb-20 md:pb-28">
        <div className="container-grain max-w-[680px] article-prose">
          <MDXProvider components={mdxComponents}>
            <Suspense fallback={<div aria-hidden className="min-h-[60vh]" />}>
              <Component />
            </Suspense>
          </MDXProvider>

          {/* Common questions , only rendered when the article exports `faqs`.
              Inline variant: no own container, inherits article body's measure. */}
          {faqs && faqs.length > 0 && (
            <FAQ
              eyebrow="Common questions"
              heading="Common questions"
              items={faqs}
              variant="inline"
            />
          )}

          <div className="mt-16 pt-12 border-t border-walnut/15 flex items-center justify-between flex-wrap gap-4">
            <SaveLink className="text-walnut/70 hover:text-walnut" />
            <span className="text-walnut/50 text-xs uppercase" style={{ letterSpacing: "0.14em" }}>
              {f.readTime}
            </span>
          </div>

          {/* Warm CTA: reader finished the piece. Point at the paid bridge offer. */}
          <div className="mt-14">
            <p className="font-display italic text-walnut/55 text-lg mb-3">
              When reading turns into doing
            </p>
            <p className="font-display text-walnut text-2xl md:text-[28px] leading-snug mb-5 max-w-xl">
              The Grain Audit maps one People Ops process end to end, ranks the highest-return automations, and hands you a 90-day plan you keep whether or not we work together.
            </p>
            <p className="font-sans text-walnut/70 leading-relaxed mb-7 max-w-xl">
              Two weeks. GBP 2,000, credited in full against a programme. Three slots a month.
            </p>
            <Link
              to="/grain-audit"
              onClick={() =>
                track("cta_click", {
                  cta_id: "audit_article_footer",
                  cta_location: "article_footer",
                  cta_label: "Book a Grain Audit",
                  link_url: "/grain-audit",
                })
              }
              className="group inline-flex items-center gap-2 rounded-full bg-green px-7 py-3.5 font-sans text-sm tracking-wider text-cream transition-all duration-300 hover:bg-green/90"
            >
              Book a Grain Audit
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </Link>
          </div>

          <div className="mt-14 pt-12 border-t border-walnut/15">
            <EmailCapture
              source="article"
              articleSlug={f.slug}
              variant="light"
              heading="If this resonated, there's more."
              description="Subscribe to receive new Intelligence pieces as they're published. No noise, just the work."
            />
          </div>
        </div>
      </article>

      {/* AIOI CTA */}
      <section className="bg-green text-cream py-20 md:py-28">
        <div className="container-grain max-w-3xl text-center">
          <Eyebrow className="text-brass">Diagnostic</Eyebrow>
          <h2
            className="font-display text-3xl md:text-5xl mt-4 mb-6 leading-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            Where does your operating system stand?
          </h2>
          <p className="text-cream/75 max-w-xl mx-auto mb-10 leading-relaxed">
            Take the AI Operating Index, a free 8-pillar diagnostic.
          </p>
          <PillButton href={AIOI_URL} variant="filled" external cta="aioi" ctaLocation="article_footer">
            Begin the index →
          </PillButton>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <BarkSection
          className="py-20 md:py-28"
          contentClassName="container-grain"
        >
            <Eyebrow className="text-brass">Keep reading</Eyebrow>
            <h2 className="font-display text-3xl md:text-4xl text-cream mt-3 mb-12">
              Related pieces
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.frontmatter.slug} article={a} variant="green" />
              ))}
            </div>
        </BarkSection>
      )}
    </>
  );
};

export default IntelligenceArticle;
