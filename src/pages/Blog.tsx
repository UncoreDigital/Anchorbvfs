import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 10;

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  const { data, isLoading } = useQuery({
    queryKey: ["blogs", currentPage],
    queryFn: async () => {
      // Strategy:
      // 1. Fetch featured post separately (latest one with is_featured=true).
      // 2. Fetch paginated list (ordered by created_at).

      // Let's fetch the featured post first (latest one with is_featured=true, or just latest)
      const { data: featuredData } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(1);

      const featured =
        featuredData && featuredData.length > 0 ? featuredData[0] : null; // We'll fetch another fallback if needed

      // Calculate range
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Fetch posts for list
      let query = supabase
        .from("blogs")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      // If we have a specific featured post, we might want to exclude it?
      // But standard pagination usually just lists everything by date.
      // Let's just list everything by date in the list below.

      const { data: posts, count, error } = await query;

      if (error) throw error;

      return {
        posts: posts || [],
        total: count || 0,
        featured,
      };
    },
  });

  const blogs = data?.posts || [];
  const totalPages = data?.total ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  // Only use the explicitly featured post found in the query.
  // If no post is featured, null is returned and the section is skipped.
  const featuredPost = data?.featured;

  // If we rely on the first page's first item being featured, we should probably remove it from the list view on page 1?
  // Let's filter it out ONLY if we are on page 1 and it matches.
  const listPosts = blogs.filter((b) =>
    currentPage === 1 && featuredPost ? b.id !== featuredPost.id : true
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!data?.posts.length && !featuredPost) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <PageBanner
          title="Blog & Insights"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        />
        <div className="container-wide py-20 text-center">
          <h2 className="text-2xl font-bold text-primary">No posts found</h2>
          <p className="text-muted-foreground mt-2">
            Check back later for new content.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Blog & Insights"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          {/* Featured Post - Only show on Page 1? Or always? Usually always or just page 1. Let's show on Page 1 only. */}
          {currentPage === 1 && featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <Link to={`/blog/${featuredPost.id}`} className="group">
                <div className="grid lg:grid-cols-2 gap-8 items-center bg-muted rounded-2xl overflow-hidden">
                  <div className="relative overflow-hidden h-full bg-gray-100 flex items-center justify-center">
                    {featuredPost.image_url ? (
                      <img
                        src={featuredPost.image_url}
                        alt={featuredPost.title}
                        className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-80 lg:h-96 flex items-center justify-center text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <span className="inline-block bg-accent text-primary px-4 py-1 rounded-full text-sm font-inter font-medium mb-4">
                      Featured
                    </span>
                    <h2 className="text-3xl font-playfair font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground font-inter leading-relaxed mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground font-inter">
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {featuredPost.author || "Admin"}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(
                          new Date(featuredPost.published_at),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Blog List - Changed from Grid to Flex Column */}
          <div className="flex flex-col gap-8">
            {listPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group border-b border-border pb-8 last:border-0"
              >
                <Link
                  to={`/blog/${post.id}`}
                  className="grid md:grid-cols-3 gap-8 items-start"
                >
                  <div className="relative overflow-hidden rounded-xl md:col-span-1 h-56 md:h-64 bg-gray-100 flex items-center justify-center">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">No image</div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-primary px-3 py-1 rounded-full text-xs font-inter font-medium">
                        {post.is_featured ? "Featured" : post.category}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-inter mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author || "Admin"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-2xl font-playfair font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground font-inter text-sm leading-relaxed mb-4 line-clamp-4">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-accent font-inter font-medium text-sm mt-auto">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage((p) => p - 1);
                      }}
                      isActive={currentPage === 1 ? false : undefined}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    // Simple logic: show first, last, and around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage((p) => p + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
