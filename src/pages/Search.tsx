import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ExternalLink, Loader2, Search as SearchIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { MetaTags } from "@/components/MetaTags";
import SearchHighlight from "@/components/SearchHighlight";
import { useDebouncedValue, useSiteSearch } from "@/hooks/useSiteSearch";
import {
  RESULT_TYPE_LABELS,
  type SearchResult,
  type SearchResultType,
} from "@/lib/siteSearch";
import { cn } from "@/lib/utils";

const TYPE_ORDER: SearchResultType[] = ["blog", "article", "event", "page"];
const ALL_YEARS = "all";

const resultYear = (result: SearchResult) =>
  result.date ? String(new Date(result.date).getFullYear()) : null;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<SearchResultType | "all">("all");
  const [activeYear, setActiveYear] = useState<string>(ALL_YEARS);

  const debouncedQuery = useDebouncedValue(query, 250);
  const { results, tokens, isLoading, isError, hasQuery } = useSiteSearch(debouncedQuery);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Keep the URL shareable without pushing a history entry per keystroke.
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed === (searchParams.get("q") || "")) return;
    setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
  }, [debouncedQuery, searchParams, setSearchParams]);

  const years = useMemo(() => {
    const found = new Set<string>();
    results.forEach((result) => {
      const year = resultYear(result);
      if (year) found.add(year);
    });
    return Array.from(found).sort((a, b) => Number(b) - Number(a));
  }, [results]);

  // Year only applies to dated content, so pages drop out once one is chosen.
  const yearFiltered = useMemo(
    () =>
      activeYear === ALL_YEARS
        ? results
        : results.filter((result) => resultYear(result) === activeYear),
    [results, activeYear],
  );

  const counts = useMemo(() => {
    const tally: Record<string, number> = { all: yearFiltered.length };
    TYPE_ORDER.forEach((type) => {
      tally[type] = yearFiltered.filter((result) => result.type === type).length;
    });
    return tally;
  }, [yearFiltered]);

  const visible = useMemo(
    () =>
      activeType === "all"
        ? yearFiltered
        : yearFiltered.filter((result) => result.type === activeType),
    [yearFiltered, activeType],
  );

  const renderResult = (result: SearchResult, index: number) => {
    const body = (
      <>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-[11px] font-inter font-semibold uppercase tracking-wider text-accent">
            {RESULT_TYPE_LABELS[result.type]}
          </span>
          {result.date && (
            <span className="text-xs text-muted-foreground font-inter">
              {format(new Date(result.date), "MMM d, yyyy")}
            </span>
          )}
          {result.meta && (
            <span className="text-xs text-muted-foreground font-inter">{result.meta}</span>
          )}
          {result.isExternal && <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>
        <h2 className="text-xl md:text-2xl font-playfair font-bold text-primary group-hover:text-accent transition-colors">
          <SearchHighlight text={result.title} tokens={tokens} />
        </h2>
        {result.snippet && (
          <p className="mt-2 text-muted-foreground font-inter text-sm leading-relaxed">
            <SearchHighlight text={result.snippet} tokens={tokens} />
          </p>
        )}
      </>
    );

    return (
      <motion.article
        key={result.key}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.04, 0.3) }}
        className="group border-b border-border pb-6 last:border-0"
      >
        {result.isExternal ? (
          <a href={result.href} target="_blank" rel="noopener noreferrer" className="block">
            {body}
          </a>
        ) : (
          <Link to={result.href} className="block">
            {body}
          </Link>
        )}
      </motion.article>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Search | Anchor Business Valuations"
        description="Search blog posts, articles, podcasts, events, and services from Anchor Business Valuations & Financial Services."
      />
      <Header />
      <PageBanner
        title="Search"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />

      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          <div className="flex items-center gap-3 border border-border rounded-xl px-5 py-4 focus-within:border-accent transition-colors">
            <SearchIcon className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search blogs, articles, events and pages…"
              autoFocus
              className="flex-1 bg-transparent font-inter text-base outline-none placeholder:text-muted-foreground"
              aria-label="Search the site"
            />
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </div>

          {hasQuery && results.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {(["all", ...TYPE_ORDER] as const).map((type) => {
                const count = counts[type] || 0;
                if (type !== "all" && count === 0) return null;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveType(type)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-inter font-medium border transition-colors",
                      activeType === type
                        ? "bg-accent text-white border-accent"
                        : "border-border text-muted-foreground hover:border-accent hover:text-accent",
                    )}
                  >
                    {type === "all" ? "All" : RESULT_TYPE_LABELS[type]} ({count})
                  </button>
                );
              })}

              {years.length > 1 && (
                <select
                  value={activeYear}
                  onChange={(event) => setActiveYear(event.target.value)}
                  aria-label="Filter results by year"
                  className="ml-auto px-4 py-1.5 rounded-full text-sm font-inter font-medium border border-border bg-background text-muted-foreground hover:border-accent hover:text-accent transition-colors outline-none"
                >
                  <option value={ALL_YEARS}>Any year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="mt-10">
            {!hasQuery && (
              <p className="text-center text-muted-foreground font-inter py-12">
                Enter a search term to look through blog posts, articles, podcasts, events,
                and pages.
              </p>
            )}

            {hasQuery && isLoading && (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            )}

            {hasQuery && isError && (
              <p className="text-center text-destructive font-inter py-12">
                Something went wrong while searching. Please try again.
              </p>
            )}

            {hasQuery && !isLoading && !isError && visible.length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-playfair font-bold text-primary">
                  No results for “{debouncedQuery.trim()}”
                </h2>
                <p className="text-muted-foreground font-inter mt-2">
                  Try a different word or a broader term.
                </p>
              </div>
            )}

            {visible.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground font-inter mb-6">
                  {visible.length} result{visible.length === 1 ? "" : "s"} for “
                  {debouncedQuery.trim()}”
                </p>
                <div className="flex flex-col gap-6">{visible.map(renderResult)}</div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Search;
