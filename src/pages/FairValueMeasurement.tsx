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
    "FASB ASC Topic 805 / IFRS 3 – Business Combinations",
    "FASB ASC Topic 820 / IFRS 13 – Fair Value Measurement",
    "FASB ASC Topic 350 – Goodwill and Other Intangible Assets",
    "FASB ASC Topic 360 – Impairment or Disposal of Long-Lived Assets",
    "FASB ASC Topic 718 – Stock Compensation",
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
                    href="mailto:info@anchorbv.com"
                    className="flex items-center gap-3 text-gold hover:text-gold/80 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>info@anchorbv.com</span>
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
                  Financial and tax reporting often require <strong>independent, supportable valuation analyses</strong>. Valuations are commonly needed when a company:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Plans an initial public offering</li>
                  <li>Issues stock-based compensation</li>
                  <li>Transfers or sells equity interests</li>
                  <li>Completes a merger or acquisition</li>
                </ul>
                <p className="mb-6">
                  In these situations, valuation conclusions must comply with applicable accounting and tax standards.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Fair Value Measurement for Business Combinations (Purchase Price Allocation)
                </h3>
                <p className="mb-4">
                  Financial reporting for acquisitions requires the identification and measurement of acquired assets and assumed liabilities at <strong>fair value</strong>. This process—commonly referred to as a <strong>purchase price allocation (PPA)</strong>—requires specialized knowledge and professional judgment.
                </p>
                <p className="mb-6">
                  <strong>Anchor Business Valuations</strong> provides independent valuation services to support purchase price allocations for financial reporting and tax purposes.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Applicable Reporting Guidance
                </h3>
                <p className="mb-4">
                  Purchase price allocations are performed in accordance with relevant accounting standards, including:
                </p>
                <div className="bg-muted/30 p-4 rounded-xl text-sm italic border-l-4 border-gold mb-6">
                  <p>
                    <strong>Fair Value Definition (ASC 820 / IFRS 13):</strong> &ldquo;The price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date.&rdquo;
                  </p>
                </div>
                <ul className="space-y-2 mb-6">
                  {standards.map((standard, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                      <span>{standard}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Common Intangible Assets Valued
                </h3>
                <p className="mb-4">In connection with business combinations, commonly identified intangible assets include:</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Customer relationships</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Trade names and trademarks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Developed technology</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Non-compete agreements</span>
                  </li>
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
