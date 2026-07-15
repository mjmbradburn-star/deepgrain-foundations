import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title: string;
  description: string;
  /** Path beginning with "/" - combined with the canonical site origin. */
  path: string;
  /** Absolute URL to a 1200×630 OG/Twitter image. Defaults to the site OG. */
  image?: string;
  type?: "website" | "article" | "profile";
  /** JSON-LD object(s) emitted as application/ld+json. Pass an array to emit
   *  multiple blocks (e.g. Article + BreadcrumbList on the same page). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Set true on pages that should not be indexed (e.g. Unsubscribe). */
  noindex?: boolean;
}

const SITE = "https://www.deepgrain.ai";
const DEFAULT_OG = "https://www.deepgrain.ai/og-image.png";

/**
 * Per-page SEO block. Renders title, description, canonical, OG/Twitter tags,
 * and optional Article/Collection JSON-LD via react-helmet-async.
 */
export const PageMeta = ({
  title,
  description,
  path,
  image = DEFAULT_OG,
  type = "website",
  jsonLd,
  noindex = false,
}: PageMetaProps) => {
  const url = `${SITE}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd &&
        (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((block, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(block)}
          </script>
        ))}
    </Helmet>
  );
};
