import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowRight,
  ExternalLink,
  Loader2,
  Search as SearchIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import SearchHighlight from "@/components/SearchHighlight";
import { useDebouncedValue, useSiteSearch } from "@/hooks/useSiteSearch";
import { RESULT_TYPE_LABELS, type SearchResult } from "@/lib/siteSearch";
import { cn } from "@/lib/utils";

const PREVIEW_LIMIT = 6;

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebouncedValue(query, 250);
  const { results, tokens, isLoading, isError, hasQuery } = useSiteSearch(debouncedQuery, {
    enabled: open,
  });

  const preview = useMemo(() => results.slice(0, PREVIEW_LIMIT), [results]);

  // Reset between openings so the panel never shows a stale search.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  const goToResult = (result: SearchResult) => {
    onOpenChange(false);
    if (result.isExternal) {
      window.open(result.href, "_blank", "noopener,noreferrer");
    } else {
      navigate(result.href);
    }
  };

  const goToAllResults = () => {
    if (!query.trim()) return;
    onOpenChange(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, preview.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const selected = preview[activeIndex];
      if (selected) {
        goToResult(selected);
      } else {
        goToAllResults();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl p-0 gap-0 top-[12%] translate-y-0 overflow-hidden"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogTitle className="sr-only">Search the site</DialogTitle>
        <DialogDescription className="sr-only">
          Search blog posts, articles, events, and pages.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <SearchIcon className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search blogs, articles, events and pages…"
            className="flex-1 bg-transparent font-inter text-base outline-none placeholder:text-muted-foreground"
            aria-label="Search the site"
          />
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>

        <div className="max-h-[60vh] overflow-y-auto theme-scrollbar">
          {!hasQuery && (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground font-inter">
              Start typing to search the site — try a topic, an author, or an event name.
            </p>
          )}

          {isError && hasQuery && (
            <p className="px-5 py-8 text-center text-sm text-destructive font-inter">
              Something went wrong while searching. Please try again.
            </p>
          )}

          {hasQuery && !isLoading && !isError && preview.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground font-inter">
              No results for “{debouncedQuery}”.
            </p>
          )}

          {preview.map((result, index) => (
            <button
              key={result.key}
              type="button"
              onClick={() => goToResult(result)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "w-full text-left px-5 py-4 border-b border-border/60 last:border-0 transition-colors",
                index === activeIndex ? "bg-muted" : "hover:bg-muted/60",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-inter font-semibold uppercase tracking-wider text-accent">
                  {RESULT_TYPE_LABELS[result.type]}
                </span>
                {result.date && (
                  <span className="text-[11px] text-muted-foreground font-inter">
                    {format(new Date(result.date), "MMM d, yyyy")}
                  </span>
                )}
                {result.isExternal && (
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
              <p className="font-playfair font-bold text-primary leading-snug">
                <SearchHighlight text={result.title} tokens={tokens} />
              </p>
              {result.snippet && (
                <p className="mt-1 text-sm text-muted-foreground font-inter line-clamp-2">
                  <SearchHighlight text={result.snippet} tokens={tokens} />
                </p>
              )}
            </button>
          ))}
        </div>

        {results.length > 0 && (
          <button
            type="button"
            onClick={goToAllResults}
            className="flex items-center justify-center gap-2 border-t border-border px-5 py-3 text-sm font-inter font-semibold text-accent hover:bg-muted transition-colors"
          >
            View all {results.length} result{results.length === 1 ? "" : "s"}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
