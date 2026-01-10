import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";

const BlogPost = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ["related-blogs", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .neq("id", id)
        .limit(3);
      return data || [];
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-center py-20">
        <Header />
        <div className="mt-20">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <Link to="/blog" className="text-blue-500 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title={post.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Post" },
        ]}
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-xl mb-8"
                />
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-inter mb-8">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : ""}
                </span>
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {post.category}
                </span>
              </div>

              <div
                className="prose prose-lg max-w-none font-inter text-foreground space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </motion.article>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
