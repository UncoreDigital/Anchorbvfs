import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  TrendingUp,
  Handshake,
  Building2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";

const MergersAcquisitions = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const features = [
    "Buy-side and sell-side representation",
    "Deal structuring and negotiation",
    "Due diligence support",
    "Post-merger integration planning",
    "Valuation for transactions",
    "Fairness opinions",
  ];

  // Placeholder data for Deal Closings (Tombstones)
  const closings = [
    {
      type: "Sell-Side Advisor",
      company: "Healthcare Tech Solutions",
      action: "Acquired by",
      buyer: "Global Medical Systems",
      sector: "Healthcare Technology",
    },
    {
      type: "Valuation Services",
      company: "Regional Logistics Corp",
      action: "Merger with",
      buyer: "National Transport Group",
      sector: "Logistics & Transportation",
    },
    {
      type: "Buy-Side Advisor",
      company: "Private Equity Group",
      action: "Investment in",
      buyer: "Manufacturing Innovators",
      sector: "Industrial Manufacturing",
    },
    {
      type: "Transaction Advisory",
      company: "Software Dev Inc.",
      action: "Strategic Partnership with",
      buyer: "Enterprise Cloud Sol.",
      sector: "SaaS / Technology",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Mergers & Acquisitions"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Mergers & Acquisitions" },
        ]}
      />

      {/* Overview Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-6">
                Strategic M&A Advisory
              </h2>
              <p className="text-muted-foreground font-inter leading-relaxed mb-6">
                Navigate the complexities of mergers and acquisitions with our
                expert advisory services. Whether you are selling your business,
                acquiring a competitor, or planning a strategic merger, we
                provide the financial insight and rigorous analysis needed to
                maximize value and minimize risk.
              </p>
              <p className="text-muted-foreground font-inter leading-relaxed mb-8">
                Our team assists with every stage of the transaction lifecycle,
                from initial target identification and valuation to deal
                structuring, due diligence, and final negotiation. We ensure you
                have the data and strategic support to make informed decisions.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
                  alt="Mergers and Acquisitions"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Detailed Analysis
                    </p>
                    <p className="text-lg font-bold text-primary">
                      Maximize Value
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We verify every detail to ensure you receive the best possible
                  outcome for your transaction.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deal Closings (Tombstones) */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
              Track Record
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-6">
              Select Deal Closings
            </h2>
            <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
              Representative transactions demonstrating our expertise in guiding
              clients through successful mergers, acquisitions, and strategic
              initiatives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {closings.map((deal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-border p-8 text-center hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                  <Handshake className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-playfair font-bold text-lg text-primary mb-2">
                  {deal.company}
                </h4>
                <div className="h-px w-8 bg-gold my-4" />
                <p className="text-sm text-muted-foreground mb-1">
                  {deal.action}
                </p>
                <p className="font-semibold text-foreground mb-6">
                  {deal.buyer}
                </p>
                <span className="mt-auto inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                  {deal.role || deal.type}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-wide max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">
              Discuss Your Transaction
            </h2>
            <p className="text-muted-foreground font-inter">
              Thinking about selling, buying, or merging? Contact us for a
              confidential consultation.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MergersAcquisitions;
