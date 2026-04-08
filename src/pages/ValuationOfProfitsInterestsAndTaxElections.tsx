import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { serviceLinks } from "@/lib/serviceLinks";

const ValuationOfProfitsInterestsAndTaxElections = () => {
  const currentSlug = "valuation-of-profits-interests-and-tax-elections";
  const title = "Valuation of Profits Interests and Tax Elections";

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
                {/* Featured Image - Using placeholder */}
                <div className="rounded-2xl overflow-hidden mb-8">
                  <img
                    src="/assets/services_content/buy-side-transactional-valuations/buyside-img.png"
                    alt={title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Profits Interests under Rev. Proc. 93-27
                </h3>
                <p className="mb-4">
                  Profits interests are a unique class of equity in partnerships (Form 1065 entities) that allow recipients to share in future appreciation without immediate tax consequences. Under Revenue Procedure 93-27, the grant of a profits interest is generally not taxable at issuance, provided it is not a capital interest and does not represent a predictable stream of income.
                </p>
                <p className="mb-6">
                  This safe harbor applies only to partnerships and LLCs taxed as partnerships. It does not extend to corporations filing Form 1120 or 1120S.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  83(b) Election at Receipt
                </h3>
                <p className="mb-4">
                  Recipients of profits interests may file an 83(b) election within 30 days of receipt. This election:
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Locks in zero ordinary income recognition at grant (since liquidation value is zero).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Ensures that future appreciation is taxed at capital gains rates rather than ordinary income.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Provides long-term tax efficiency for holders as the interest vests and appreciates.</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Vesting and Derivative-Like Features
                </h3>
                <p className="mb-4">
                  Profits interests often include vesting schedules or payout triggers that resemble call options or derivative securities. This structure requires specialized valuation techniques:
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Option Pricing Model (OPM) or Black-Scholes framework to capture contingent value.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Inputs such as volatility, risk-free rate, expected term, and strike price.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Adjustments for discounts related to lack of marketability (DLOM), minority interest, and vesting risk.</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Valuation Methodology
                </h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span><strong>Waterfall Analysis</strong> – Map distribution priorities and thresholds.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span><strong>Option Modeling</strong> – Treat profits interest as a contingent claim on residual equity.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span><strong>Discount Application</strong> – Apply DLOM, minority, and contingency discounts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span><strong>Reporting</strong> – Deliver valuation that withstands IRS and investor scrutiny.</span>
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

export default ValuationOfProfitsInterestsAndTaxElections;
