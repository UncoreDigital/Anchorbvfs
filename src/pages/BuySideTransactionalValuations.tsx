import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { serviceLinks } from "@/lib/serviceLinks";

const BuySideTransactionalValuations = () => {
  const currentSlug = "buy-side-transactional-valuations";
  const title = "Buy-Side Transactional Valuations";

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
                    src="/assets/services_content/buy-side-transactional-valuations/buyside-img.png"
                    alt={title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <p className="mb-4">
                  Acquiring a business is one of the most significant decisions
                  an investor or company can make—yet many buyers enter
                  transactions without a clear understanding of what the target
                  is truly worth. At Anchor Business Valuations & Financial
                  Services, we provide independent, data-driven buy-side
                  valuations that empower you to negotiate effectively, avoid
                  overpaying, and invest with confidence.
                </p>
                <p className="mb-6">
                  Whether you're evaluating your first acquisition or expanding
                  an existing portfolio, our expertise helps you uncover the
                  real economic value behind the numbers.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Why Buyers Need a Dedicated Buy-Side Valuation
                </h3>
                <p className="mb-4">
                  Traditional financial statements rarely tell the full story. A
                  proper buy-side valuation identifies:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      True earning power (normalized cash flow vs. reported
                      income)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Hidden risks that impact deal value</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Sustainability of revenues & margins</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Quality of customer relationships and key employee
                      reliance
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Working capital requirements post-acquisition</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Fair value range for negotiation</span>
                  </li>
                </ul>
                <p className="mb-6">
                  This gives you a strategic advantage—especially when a
                  seller’s valuation is biased, inflated, or based on
                  assumptions that don’t hold up under scrutiny.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Who We Serve
                </h3>
                <p className="mb-4">
                  Our buy-side valuation services are ideal for:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Private buyers acquiring their first or second business
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Private equity groups evaluating new portfolio companies
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Strategic buyers expanding through acquisition</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Search-fund entrepreneurs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Lenders requiring an independent assessment supporting
                      loan decisions
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Family offices and high-net-worth investors</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Why Clients Choose Us
                </h3>
                <p className="mb-4 font-semibold italic text-navy">
                  Independent. Meticulous. Acquisition-Focused.
                </p>
                <p className="mb-4">Buyers choose Anchor because:</p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>We specialize in transaction-driven valuations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Our work is independent, unbiased, and defensible
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      We understand how much buyers rely on accurate
                      forward-looking value, not just historicals
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      We provide clear communication and a collaborative process
                      with your deal team, CPA, lender, and attorney
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Our turnaround times support real-world transactional
                      deadlines
                    </span>
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

export default BuySideTransactionalValuations;
