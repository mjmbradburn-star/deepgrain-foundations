import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { PageMeta } from "@/components/seo/PageMeta";
import { ARTICLES, getFeaturedArticles } from "@/lib/intelligence";

/**
 * A useful 404. Instead of a dead-end, we offer:
 *   - a search box that routes to /intelligence?q=...
 *   - three recommended reads (featured if available, otherwise the most
 *     recent published intelligence pieces)
 *
 * Keeps the noindex tag — we don't want this page in the index.
 */
const NotFound = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const recommended = useMemo(() => {
    const featured = getFeaturedArticles(3);
    if (featured.length >= 3) return featured;
    // Top up with most recent published pieces, dedup against featured.
    const have = new Set(featured.map((a) => a.frontmatter.slug));
    const rest = [...ARTICLES]
      .filter((a) => !have.has(a.frontmatter.slug))
      .sort(
        (a, b) =>
          new Date(b.frontmatter.publishedAt).getTime() -
          new Date(a.frontmatter.publishedAt).getTime(),
      )
      .slice(0, 3 - featured.length);
    return [...featured, ...rest];
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) {
      navigate("/intelligence");
      return;
    }
    navigate(`/intelligence?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="bg-green text-cream min-h-screen flex items-center py-32">
      <PageMeta
        title="Page not found | Deepgrain"
        description="The page you're looking for isn't here. Search the Intelligence library or pick up one of our most-read pieces."
        path="/404"
        noindex
      />
      <div className="container-grain max-w-4xl">
        <div className="text-center">
          <Eyebrow className="text-brass mb-6">404</Eyebrow>
          <h1 className="font-display text-5xl md:text-7xl leading-tight text-cream">
            Off the grain.
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-cream/75 leading-relaxed">
            The page you&apos;re looking for isn&apos;t here. Try searching the
            Intelligence library, or pick up one of the pieces below.
          </p>

          <form
            onSubmit={onSearch}
            className="mt-10 flex items-center gap-2 max-w-xl mx-auto bg-cream/5 border border-cream/20 rounded-full pl-5 pr-2 py-2 focus-within:border-brass/60 transition-colors"
            role="search"
          >
            <Search size={18} className="text-cream/60 shrink-0" aria-hidden />
            <label htmlFor="not-found-search" className="sr-only">
              Search Intelligence
            </label>
            <input
              id="not-found-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Intelligence…"
              className="flex-1 bg-transparent text-cream placeholder:text-cream/45 text-base focus:outline-none py-2 min-w-0"
            />
            <button
              type="submit"
              className="rounded-full bg-brass text-walnut font-sans uppercase text-[11px] px-5 py-2.5 hover:bg-brass/90 transition-colors"
              style={{ letterSpacing: "0.14em" }}
            >
              Search
            </button>
          </form>
        </div>

        {recommended.length > 0 && (
          <div className="mt-20">
            <Eyebrow className="text-brass/80 mb-6 justify-center inline-flex w-full">
              Recommended reads
            </Eyebrow>
            <ul className="grid gap-5 md:grid-cols-3">
              {recommended.map((a) => {
                const f = a.frontmatter;
                return (
                  <li key={f.slug}>
                    <a
                      href={`/intelligence/${f.slug}`}
                      className="block h-full bg-cream/5 border border-cream/15 hover:border-brass/60 rounded-2xl p-6 transition-colors"
                    >
                      <p
                        className="font-sans uppercase text-[10px] text-brass mb-3"
                        style={{ letterSpacing: "0.16em" }}
                      >
                        {f.readTime}
                      </p>
                      <h2 className="font-display text-cream text-xl leading-snug text-balance">
                        {f.title}
                      </h2>
                      <p className="mt-3 text-cream/65 text-sm leading-relaxed line-clamp-3">
                        {f.description}
                      </p>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <PillButton href="/" variant="outline">
            Back to start →
          </PillButton>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
