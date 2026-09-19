/**
 * Serves /blog/:id with the post's Open Graph tags baked into the HTML.
 *
 * The site is a client-rendered SPA, so crawlers that don't run JavaScript
 * (LinkedIn, Facebook, Slack, WhatsApp…) would otherwise only see the generic
 * tags in index.html. This returns the normal SPA shell with the title,
 * description, image and URL of the requested post injected into <head>,
 * which is what LinkedIn uses to build the share preview card.
 *
 * Wired up via the "/blog/:id" rewrite in vercel.json.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

interface BlogMeta {
  title: string;
  excerpt: string | null;
  image_url: string | null;
}

const SITE_NAME = "Anchor Business Valuations & Financial Services";
const FALLBACK_IMAGE = "/assets/logo.png";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const absolute = (url: string, origin: string) => new URL(url, origin).toString();

const loadShell = async (origin: string): Promise<string> => {
  try {
    return await readFile(path.join(process.cwd(), "dist", "index.html"), "utf8");
  } catch {
    // Static files take precedence over rewrites, so this never loops back here.
    const res = await fetch(`${origin}/index.html`);
    return res.text();
  }
};

const fetchPost = async (id: string): Promise<BlogMeta | null> => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  const res = await fetch(
    `${supabaseUrl}/rest/v1/blogs?id=eq.${encodeURIComponent(id)}&select=title,excerpt,image_url&limit=1`,
    { headers: { apikey: supabaseKey, Accept: "application/json" } }
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as BlogMeta[];
  return rows[0] ?? null;
};

const injectMeta = (html: string, post: BlogMeta, pageUrl: string, origin: string) => {
  const title = escapeHtml(post.title);
  const description = escapeHtml((post.excerpt ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300));
  const image = escapeHtml(absolute(post.image_url || FALLBACK_IMAGE, origin));
  const url = escapeHtml(pageUrl);

  const tags = [
    `<title>${title} | Anchor Business Valuations</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join("\n  ");

  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+(?:name|property)="(?:description|og:[^"]*|twitter:[^"]*)"[\s\S]*?\/?>\s*/gi, "")
    .replace(/<\/head>/i, `  ${tags}\n</head>`);
};

export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const id = requestUrl.searchParams.get("id") ?? "";

  const shell = await loadShell(origin);
  let html = shell;

  if (id) {
    try {
      const post = await fetchPost(id);
      if (post) html = injectMeta(shell, post, `${origin}/blog/${encodeURIComponent(id)}`, origin);
    } catch (error) {
      // Never break the page over missing preview tags — serve the plain shell.
      console.error("blog-og: failed to load post", id, error);
    }
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Cache at the edge briefly so edits to a post show up in previews soon after.
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
