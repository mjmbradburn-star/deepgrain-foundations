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

      {/* Hero image band (16:9, full-width) */}
      {heroImage && (
        <div className="bg-green pt-24 md:pt-28">
          <div className="container-grain max-w-5xl">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-sm shadow-2xl">
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
          </div>
        </div>
      )}

      {/* Header band */}
      <header
        className={`bg-green text-cream pb-20 md:pb-28 ${
          heroImage ? "pt-12 md:pt-16" : "pt-40 md:pt-48"
        }`}
      >
        <div className="container-grain max-w-3xl">
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
          <div className="flex items-center gap-3 mb-8">
            <Link
              to={`/intelligence/category/${f.category}`}
              className="font-sans uppercase text-[11px] text-brass hover:text-cream transition-colors"
              style={{ letterSpacing: "0.16em" }}
            >
              {cat?.name}
            </Link>
            <span className="text-cream/40">·</span>
            <span className="text-[11px] text-cream/60">{f.readTime}</span>
          </div>
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.0] mb-8"
            style={{ letterSpacing: "-0.015em" }}
          >
            {f.title}
          </h1>
          <p className="text-lg md:text-xl text-cream/75 leading-relaxed">
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

      {/* Body — slightly wider measure on lg+, drop-cap on the first paragraph. */}
      <article className="bg-linen py-20 md:py-28">
        <div className="container-grain max-w-2xl lg:max-w-[680px] xl:max-w-[720px] article-prose">
          <MDXProvider components={mdxComponents}>
            <Suspense fallback={<div aria-hidden className="min-h-[60vh]" />}>
              <Component />
            </Suspense>
          </MDXProvider>

          {/* Common questions — only rendered when the article exports `faqs`.
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
          <div className="mt-10">
            <EmailCapture
              source="article"
              articleSlug={f.slug}
              variant="light"
              heading="If this resonated, there's more."
              description="Subscribe to receive new Intelligence pieces as they're published. No noise — just the work."
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
            Take the AI Operating Index — a free 8-pillar diagnostic.
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
