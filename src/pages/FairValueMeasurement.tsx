import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { serviceLinks } from "@/lib/serviceLinks";

const FairValueMeasurement = () => {
  const currentSlug = "fair-value-measurement";
  const title = "Fair Value Measurement";

  const standards = [
    "FASB ASC Topic 805 / IFRS 3R, Business Combinations",
    "FASB ASC Topic 820 / IFRS 13, Fair Value Measurements",
    "FASB ASC Topic 350 / Impairment: Goodwill and Other",
    "FASB ASC Topic 360 / Impairment or Disposal of Long-Lived Assets",
    "FASB ASC Topic 718 [FAS 123(R)]",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title={title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/#services" },
          { label: title },
        ]}
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-muted/30 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-display font-bold text-navy mb-6">
                  Our Services
                </h3>
                <ul className="space-y-3">
                  {serviceLinks.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/services/${s.slug}`}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                          s.slug === currentSlug
                            ? "bg-gold text-navy font-semibold"
                            : "bg-white hover:bg-gold/10 text-slate hover:text-navy"
                        }`}
                      >
                        <span>{s.title}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-navy rounded-2xl p-6 text-white">
                <h3 className="text-xl font-display font-bold mb-4">
                  Need Help?
                </h3>
                <p className="text-white/70 text-sm mb-6">
                  Contact us for a free consultation about our services.
                </p>
                <div className="space-y-4">
                  <a
                    href="tel:+12399193092"
                    className="flex items-center gap-3 text-gold hover:text-gold/80 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>239.919.3092</span>
                  </a>
                  <a
                    href="mailto:Info@AnchorBVFS.com"
                    className="flex items-center gap-3 text-gold hover:text-gold/80 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Info@AnchorBVFS.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="prose prose-lg max-w-none text-slate"
              >
                {/* Featured Image */}
                <div className="rounded-2xl overflow-hidden mb-8">
                  <img
                    src="/assets/services_content/fair-value-measurement/fairvalue-img.jpg"
                    alt={title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <p className="mb-4">
                  Often financial and tax reporting circumstances require
                  qualified, independent valuation reports/analysis. For
                  example, when a company plans to have an initial public
                  offering, issues stock options, or transfers or sells equity
                  interests, a valuation is required for financial reporting
                  purposes.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Fair Value Measurement for Business Combinations (Purchase
                  Price Allocation)
                </h3>
                <p className="mb-4">
                  Financial reporting rules regarding the recognition and
                  measurement of acquired assets and liabilities require skill,
                  expertise, and experience for interpretation and application.
                  ABV offers services for purchase price allocations for
                  financial reporting and/or tax reporting purposes.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Reporting Requirements
                </h3>
                <p className="mb-4">
                  Financial reporting for business combinations requires a
                  purchase price allocation in accordance with the following
                  generally accepted accounting principles (GAAP) and tax
                  regulations:
                </p>
                <ul className="space-y-2 mb-6">
                  {standards.map((standard, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                      <span>{standard}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-12 flex flex-wrap gap-4">
                  <Link to="/contact">
                    <Button className="btn-cta">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <a href="tel:+12399193092">
                    <Button
                      variant="outline"
                      className="border-navy text-navy hover:bg-navy hover:text-white"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Us Now
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FairValueMeasurement;
