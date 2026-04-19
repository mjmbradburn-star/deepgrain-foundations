import { Helmet } from "react-helmet-async";
import { Navigate, useParams, Link } from "react-router-dom";
import { getArticlesByCategory, getCategory } from "@/lib/intelligence";
import { ArticleCard } from "@/components/intelligence/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";

const IntelligenceCategory = () => {
  const { name = "" } = useParams();
  const cat = getCategory(name);
  if (!cat) return <Navigate to="/intelligence" replace />;

  const items = getArticlesByCategory(cat.slug);
  const url = `https://deepgrain.ai/intelligence/category/${cat.slug}`;

  return (
    <>
      <Helmet>
        <title>{cat.name} — Deepgrain Intelligence</title>
        <meta name="description" content={cat.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${cat.name} — Deepgrain Intelligence`} />
        <meta property="og:description" content={cat.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="bg-green text-cream pt-40 md:pt-48 pb-20 md:pb-28">
        <div className="container-grain max-w-3xl">
          <Link
            to="/intelligence"
            className="text-[11px] uppercase text-brass hover:text-cream transition-colors"
            style={{ letterSpacing: "0.16em" }}
          >
            ← All intelligence
          </Link>
          <Eyebrow className="text-brass mt-8">{cat.name}</Eyebrow>
          <h1
            className="font-display text-5xl md:text-7xl leading-[1.0] mt-4 mb-8"
            style={{ letterSpacing: "-0.015em" }}
          >
            {cat.description}
          </h1>
          <p className="text-cream/65 text-sm">
            {items.length} {items.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </section>

      <section className="bg-linen py-20 md:py-28">
        <div className="container-grain">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((a) => (
              <ArticleCard key={a.frontmatter.slug} article={a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default IntelligenceCategory;
