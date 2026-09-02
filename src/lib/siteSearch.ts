import { supabase } from "@/integrations/supabase/client";
import { serviceLinks } from "@/lib/serviceLinks";

export type SearchResultType = "blog" | "article" | "event" | "page";

export interface SearchResult {
  key: string;
  type: SearchResultType;
  title: string;
  snippet: string;
  href: string;
  isExternal: boolean;
  date: string | null;
  meta?: string;
  score: number;
}

export const RESULT_TYPE_LABELS: Record<SearchResultType, string> = {
  blog: "Blog",
  article: "Article & Podcast",
  event: "Event",
  page: "Page",
};

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "had",
  "has", "have", "he", "her", "his", "in", "into", "is", "it", "its", "of",
  "on", "or", "our", "she", "that", "the", "their", "them", "there", "they",
  "this", "to", "was", "we", "were", "what", "when", "where", "which", "who",
  "will", "with", "you", "your",
]);

const MAX_TOKENS = 6;

/** Splits a raw query into the meaningful lowercase words we match on. */
export const tokenize = (query: string): string[] => {
  const words = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}'&-]+/u)
    .map((word) => word.replace(/^['-]+|['-]+$/g, ""))
    .filter(Boolean);

  const kept = words.filter((word) => word.length >= 2 && !STOP_WORDS.has(word));
  // If the query was nothing but stop words ("who we are"), search those instead.
  const tokens = kept.length > 0 ? kept : words;

  return Array.from(new Set(tokens)).slice(0, MAX_TOKENS);
};

/** Strips characters that would break out of a PostgREST `or=(...)` filter value. */
const sanitizeForFilter = (token: string) => token.replace(/[%_*"\\(),:&]/g, "");

const buildOrFilter = (tokens: string[], columns: string[]) => {
  const parts: string[] = [];
  tokens.forEach((token) => {
    const safe = sanitizeForFilter(token);
    if (!safe) return;
    columns.forEach((column) => parts.push(`${column}.ilike."%${safe}%"`));
  });
  return parts.join(",");
};

export const stripHtml = (html?: string | null): string => {
  if (!html) return "";
  const parsed = new DOMParser().parseFromString(html, "text/html");
  return (parsed.body.textContent || "").replace(/\s+/g, " ").trim();
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface ScoredField {
  text: string;
  weight: number;
}

/**
 * Ranks one entry against the query. Returns 0 when nothing matched, so the
 * caller can drop it — this is also what filters out database rows that only
 * matched inside an HTML tag rather than in the visible text.
 */
const scoreFields = (fields: ScoredField[], tokens: string[], phrase: string): number => {
  const haystacks = fields
    .filter((field) => field.text)
    .map((field) => ({ weight: field.weight, lower: field.text.toLowerCase() }));

  let score = 0;
  let matchedTokens = 0;

  tokens.forEach((token) => {
    let matched = false;
    haystacks.forEach((haystack) => {
      if (!haystack.lower.includes(token)) return;
      matched = true;
      score += haystack.weight;
      // Whole-word hits outrank mid-word ones ("tax" over "taxonomy").
      if (new RegExp(`\\b${escapeRegExp(token)}\\b`).test(haystack.lower)) {
        score += haystack.weight * 0.5;
      }
    });
    if (matched) matchedTokens += 1;
  });

  if (matchedTokens === 0) return 0;
  // Matching every word beats matching one of them.
  if (tokens.length > 1 && matchedTokens === tokens.length) score += 25 * tokens.length;
  // An exact phrase hit beats scattered words.
  if (phrase.includes(" ") && haystacks.some((h) => h.lower.includes(phrase))) score += 80;

  return score;
};

const SNIPPET_LENGTH = 220;

/** Pulls the slice of `text` around the first token hit, so the match is visible. */
export const buildSnippet = (text: string, tokens: string[]): string => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= SNIPPET_LENGTH) return clean;

  const lower = clean.toLowerCase();
  const hit = tokens
    .map((token) => lower.indexOf(token))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (hit === undefined) return `${clean.slice(0, SNIPPET_LENGTH).trimEnd()}…`;

  const start = Math.max(0, hit - 70);
  const end = Math.min(clean.length, start + SNIPPET_LENGTH);
  return `${start > 0 ? "…" : ""}${clean.slice(start, end).trim()}${end < clean.length ? "…" : ""}`;
};

interface StaticPage {
  title: string;
  href: string;
  summary: string;
  keywords: string;
}

/**
 * Hand-maintained index of pages whose copy lives in the codebase rather than
 * in Supabase. Add a row here whenever a new static page ships.
 */
export const staticPages: StaticPage[] = [
  {
    title: "Home",
    href: "/",
    summary:
      "Certified business valuation services and merger & acquisition consulting from Anchor Business Valuations & Financial Services.",
    keywords: "home anchor business valuations financial services certified valuation",
  },
  {
    title: "Meet the Founder",
    href: "/about",
    summary:
      "About Trisch Garthoeffner and the founding of Anchor Business Valuations & Financial Services.",
    keywords:
      "about founder trisch garthoeffner biography credentials experience testimony expert witness",
  },
  {
    title: "Meet the Team",
    href: "/team",
    summary: "The valuation analysts and financial professionals behind Anchor.",
    keywords: "team staff analysts people employees",
  },
  {
    title: "Industry Expertise",
    href: "/industry-expertise",
    summary: "Industries we serve, from healthcare and construction to professional services.",
    keywords:
      "industry expertise sectors specialties healthcare construction manufacturing professional services",
  },
  {
    title: "Events & Speaking",
    href: "/events",
    summary: "Speaking engagements, conferences, presentations, and webinars.",
    keywords: "events speaking conferences presentations webinars seminars testimony",
  },
  {
    title: "Blog & Insights",
    href: "/blog",
    summary: "Insights, updates, and expert analysis from the Anchor team.",
    keywords: "blog posts insights news updates",
  },
  {
    title: "Articles & Podcasts",
    href: "/articles",
    summary: "Published articles, podcast appearances, and QuickRead contributions.",
    keywords: "articles podcasts publications quickread press media interviews",
  },
  {
    title: "FAQs",
    href: "/faqs",
    summary:
      "Answers to common questions about business valuation, fair market value, qualified appraisers, and valuation reports.",
    keywords:
      "faq faqs questions answers fair market value fair value qualified appraiser calculation of value valuation report standards discount",
  },
  {
    title: "Contact Us",
    href: "/contact",
    summary: "Phone, email, and office details, plus a form to reach the Anchor team.",
    keywords: "contact phone email address office location get in touch enquiry inquiry",
  },
  {
    title: "Upload Documents",
    href: "/upload",
    summary: "Securely send financial documents to Anchor for an engagement.",
    keywords: "upload documents secure file transfer send financials",
  },
  {
    title: "Client Questionnaire",
    href: "/questionnaire",
    summary: "The intake questionnaire clients complete at the start of an engagement.",
    keywords: "questionnaire intake client form general sector covid",
  },
  ...serviceLinks.map((service) => ({
    title: service.title,
    href: `/services/${service.slug}`,
    summary: `${service.title} — a valuation service offered by Anchor Business Valuations.`,
    keywords: `service valuation ${service.title} ${service.slug.replace(/-/g, " ")}`,
  })),
];

export const searchStaticPages = (tokens: string[], phrase: string): SearchResult[] =>
  staticPages
    .map((page) => ({
      key: `page:${page.href}`,
      type: "page" as const,
      title: page.title,
      snippet: buildSnippet(page.summary, tokens),
      href: page.href,
      isExternal: false,
      date: null,
      score: scoreFields(
        [
          { text: page.title, weight: 30 },
          { text: page.summary, weight: 10 },
          { text: page.keywords, weight: 8 },
        ],
        tokens,
        phrase,
      ),
    }))
    .filter((result) => result.score > 0);

/**
 * Blog posts are the only content queried per-search: the `content` column
 * holds full post bodies, so it is filtered in Postgres rather than shipped
 * to the browser.
 */
export const searchBlogs = async (
  tokens: string[],
  phrase: string,
): Promise<SearchResult[]> => {
  const filter = buildOrFilter(tokens, ["title", "excerpt", "content", "category", "author"]);
  if (!filter) return [];

  const { data, error } = await supabase
    .from("blogs")
    .select("id,title,excerpt,content,category,author,published_at,created_at")
    .or(filter)
    .order("published_at", { ascending: false })
    .limit(40);

  if (error) throw error;

  return (data || [])
    .map((post) => {
      const body = stripHtml(post.content);
      const excerpt = post.excerpt || "";
      const excerptHasHit = tokens.some((token) => excerpt.toLowerCase().includes(token));
      const category = post.category || "";

      return {
        key: `blog:${post.id}`,
        type: "blog" as const,
        title: post.title,
        snippet: buildSnippet(excerptHasHit || !body ? excerpt : body, tokens),
        href: `/blog/${post.id}`,
        isExternal: false,
        date: post.published_at || post.created_at,
        meta: category && category.toLowerCase() !== "uncategorized" ? category : undefined,
        score: scoreFields(
          [
            { text: post.title, weight: 30 },
            { text: excerpt, weight: 12 },
            { text: category, weight: 8 },
            { text: post.author || "", weight: 8 },
            { text: body, weight: 4 },
          ],
          tokens,
          phrase,
        ),
      };
    })
    .filter((result) => result.score > 0);
};

export interface SearchCorpus {
  articles: {
    id: string;
    title: string;
    type: string | null;
    link: string;
    published_at: string | null;
    created_at: string;
  }[];
  events: {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    presenters: string[] | null;
    date: string | null;
    created_at: string;
  }[];
}

/**
 * Articles and events are small enough to match in the browser — both list
 * pages already fetch every row — which also makes the `presenters` array
 * column searchable without a migration.
 */
export const fetchSearchCorpus = async (): Promise<SearchCorpus> => {
  const [articles, events] = await Promise.all([
    supabase
      .from("articles")
      .select("id,title,type,link,published_at,created_at")
      .order("published_at", { ascending: false }),
    supabase
      .from("events")
      .select("id,title,description,location,presenters,date,created_at")
      .order("date", { ascending: false }),
  ]);

  if (articles.error) throw articles.error;
  if (events.error) throw events.error;

  return { articles: articles.data || [], events: events.data || [] };
};

export const searchCorpus = (
  corpus: SearchCorpus | undefined,
  tokens: string[],
  phrase: string,
): SearchResult[] => {
  if (!corpus) return [];

  const articles = corpus.articles
    .map((article) => ({
      key: `article:${article.id}`,
      type: "article" as const,
      title: article.title,
      snippet: article.type
        ? `${article.type} — opens on the publisher's site.`
        : "Opens on the publisher's site.",
      href: article.link,
      isExternal: true,
      date: article.published_at || article.created_at,
      meta: article.type || undefined,
      score: scoreFields(
        [
          { text: article.title, weight: 30 },
          { text: article.type || "", weight: 10 },
        ],
        tokens,
        phrase,
      ),
    }))
    .filter((result) => result.score > 0);

  const events = corpus.events
    .map((event) => {
      const body = stripHtml(event.description);
      const presenters = (event.presenters || []).join(", ");

      return {
        key: `event:${event.id}`,
        type: "event" as const,
        title: event.title,
        snippet: buildSnippet(body, tokens),
        // Events have no detail route, so deep-link to the card on the list page.
        href: `/events#event-${event.id}`,
        isExternal: false,
        date: event.date || event.created_at,
        meta: [presenters, event.location].filter(Boolean).join(" · ") || undefined,
        score: scoreFields(
          [
            { text: event.title, weight: 30 },
            { text: presenters, weight: 12 },
            { text: event.location || "", weight: 8 },
            { text: body, weight: 5 },
          ],
          tokens,
          phrase,
        ),
      };
    })
    .filter((result) => result.score > 0);

  return [...articles, ...events];
};

export const byRelevance = (a: SearchResult, b: SearchResult) => {
  if (b.score !== a.score) return b.score - a.score;
  const aTime = a.date ? new Date(a.date).getTime() : 0;
  const bTime = b.date ? new Date(b.date).getTime() : 0;
  return bTime - aTime;
};
