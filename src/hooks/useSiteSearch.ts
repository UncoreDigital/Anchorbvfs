import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  byRelevance,
  fetchSearchCorpus,
  searchBlogs,
  searchCorpus,
  searchStaticPages,
  tokenize,
  type SearchResult,
} from "@/lib/siteSearch";

/** Holds back a fast-changing value so we don't query on every keystroke. */
export const useDebouncedValue = <T,>(value: T, delay = 250): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

interface UseSiteSearchOptions {
  /** Skip all fetching until the search UI is actually open. */
  enabled?: boolean;
}

export interface UseSiteSearchResult {
  results: SearchResult[];
  tokens: string[];
  isLoading: boolean;
  isError: boolean;
  hasQuery: boolean;
}

export const useSiteSearch = (
  query: string,
  { enabled = true }: UseSiteSearchOptions = {},
): UseSiteSearchResult => {
  const phrase = query.trim().toLowerCase();
  const tokens = useMemo(() => tokenize(query), [query]);
  const hasQuery = tokens.length > 0;
  const active = enabled && hasQuery;

  // Articles and events are fetched once and reused across every keystroke.
  const corpus = useQuery({
    queryKey: ["search-corpus"],
    queryFn: fetchSearchCorpus,
    enabled: active,
    staleTime: 5 * 60 * 1000,
  });

  const blogs = useQuery({
    queryKey: ["search-blogs", phrase],
    queryFn: () => searchBlogs(tokens, phrase),
    enabled: active,
    staleTime: 5 * 60 * 1000,
  });

  const results = useMemo(() => {
    if (!hasQuery) return [];
    return [
      ...(blogs.data || []),
      ...searchCorpus(corpus.data, tokens, phrase),
      ...searchStaticPages(tokens, phrase),
    ].sort(byRelevance);
  }, [blogs.data, corpus.data, tokens, phrase, hasQuery]);

  return {
    results,
    tokens,
    isLoading: active && (blogs.isLoading || corpus.isLoading),
    isError: blogs.isError || corpus.isError,
    hasQuery,
  };
};
