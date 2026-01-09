import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { serviceLinks } from "@/lib/serviceLinks";

const EstateGiftTaxValuations = () => {
  const currentSlug = "estate-gift-tax-valuations";
  const title = "Estate & Gift Tax Valuations";

  const services = [
    "Control or Non-Control Ownership Interests in investment holding companies",
    "Control or Non-Control Ownership Interests in closely held businesses",
    "Estate Tax Determination",
    "Litigation/Negotiation Support",
    "Value for Gifting Purpose",
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
                    src="/assets/services_content/estate-gift-tax-valuations/estate-img-1.jpg"
                    alt={title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <p className="mb-4">
                  Business interests must be valued when transferred as a gift
                  or reported for estate tax purposes. The IRS mandates that
                  businesses be valued based upon a “fair market value” standard
                  of value.
                </p>

                <p className="mb-4">
                  Discounts (lack of marketability, lack of control, etc.) are
                  considered for the determination of fair market value. These
                  discounts, however, are regularly challenged by the IRS, which
                  is why it is imperative that valuations needed for gift and
                  estate purposes are prepared by certified valuation analysts.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Estate and Gifting Valuation services we offer include (for/of
                  the following):
                </h3>
                <ul className="space-y-2 mb-6">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>

                <p className="mb-6">
                  When gifting interests in a company or reporting values for
                  estate tax, a comprehensive, well-supported business valuation
                  is crucial. At Anchor Business Valuations & Financial
                  Services, LLC, our professionals work closely with each
                  client’s advisors (attorneys, tax professionals, etc.) to
                  provide thoroughly documented and supportable valuation
                  analyses.
                </p>

                <div className="bg-muted/30 p-4 rounded-xl text-sm italic border-l-4 border-gold">
                  <p>
                    <strong>Note:</strong> IRS Revenue Ruling 59-60 determines
                    the basis of fair market value and states that the fair
                    market value is, “The amount at which the property would
                    change hands between a willing buyer and willing seller,
                    when the former is not under any compulsion to buy, and the
                    latter is not under any compulsion to sell, both parties
                    having reasonable knowledge of relevant facts.”
                  </p>
                </div>

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

export default EstateGiftTaxValuations;
