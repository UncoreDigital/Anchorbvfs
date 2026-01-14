import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, User, Clock, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Events = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        // Order by created_at desc or handle date sorting manually if date is free text
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Events & Speaking"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
              Join Us
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
              Upcoming & Past Events
            </h2>
            <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
              Stay updated with our latest speaking engagements, conferences,
              and presentations.
            </p>
          </div>

          <div className="grid gap-8 max-w-5xl mx-auto">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 md:p-8 border border-border hover:shadow-elegant transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Date Badge */}
                  <div className="flex-shrink-0">
                    <div className="bg-accent/10 rounded-lg p-4 text-center min-w-[100px]">
                      <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
                      <span className="block text-sm font-bold text-primary/80">
                        {event.date}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-3">
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-primary">
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-inter">
                      {event.time && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-accent" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                      <User className="w-4 h-4 text-accent" />
                      <span>{event.presenters.join(", ")}</span>
                    </div>

                    <div
                      className="prose prose-lg max-w-none font-inter text-foreground space-y-4 pt-2"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />

                    {event.link && (
                      <div className="pt-2">
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                        >
                          View Event Details{" "}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
