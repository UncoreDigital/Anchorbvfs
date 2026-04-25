import { format } from "date-fns";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Link as LinkIcon,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { MetaTags } from "@/components/MetaTags";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingScreen from "@/components/LoadingScreen";

const Articles = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      // Map published_at to date for compatibility if needed, but we use same semantics
      return data.map((item) => ({
        ...item,
        date: item.published_at, // Map for UI compatibility
      }));
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Articles & Podcasts | Anchor Business Valuations"
        description="Explore our library of articles, podcasts, and resources on business valuation, litigation support, and financial analysis."
      />
      <Header />
      <PageBanner
        title="Articles & Podcasts"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "#" },
          { label: "Articles & Podcasts" },
        ]}
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">

            {/* QuickRead Banner */}
            <div className="mb-10 bg-navy rounded-2xl p-8 text-white">
              <h3 className="text-xl font-playfair font-bold text-gold mb-3">
                Anchor Publications on QuickRead
              </h3>
              <p className="text-white/80 font-inter mb-4">
                For examples of Anchor publications, click the following link and search herein{" "}
                <span className="text-gold font-semibold">"Garthoeffner"</span>.{" "}
                Trisch is a long-time, regular contributor to the QuickRead valuation publication.
              </p>
              <a
                href="https://quickreadbuzz.com/?s=garthoeffner"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors"
              >
                Visit QuickRead
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-white/60 text-sm mt-4 italic">
                Search here via keyword "Garthoeffner" for examples of recent articles written by Anchor's founder.
              </p>
            </div>

            {/* Archived Articles Notice */}
            <div className="mb-8 border-2 border-border rounded-xl p-5 bg-muted/20 text-center">
              <p className="font-inter font-semibold text-primary text-base">
                For examples of archived articles please see below
              </p>
            </div>

            <div className="grid gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-xl border border-border hover:shadow-elegant transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-accent" />
                          {format(new Date(article.date), "MMM d, yyyy")}
                        </span>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span className="text-accent font-medium uppercase text-xs tracking-wider">
                          {article.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-playfair font-bold text-primary group-hover:text-gold transition-colors">
                        {article.title}
                      </h3>
                    </div>

                    <div className="flex-shrink-0">
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 hover:bg-gold hover:text-primary rounded-lg transition-all duration-300 font-medium text-sm"
                      >
                        Read More
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Articles;
