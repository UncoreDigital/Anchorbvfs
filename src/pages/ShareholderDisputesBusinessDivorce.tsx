import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { serviceLinks } from "@/lib/serviceLinks";

const ShareholderDisputesBusinessDivorce = () => {
  const currentSlug = "shareholder-disputes-business-divorce";
  const title = "Shareholder Disputes (“Business Divorce”)";

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
                    src="/assets/services_content/shareholder-disputes-business-divorce/shareholder-img.jpg"
                    alt={title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <p className="mb-4">
                  Shareholder disputes can be contentious and complex. We
                  provide objective valuation and financial analysis to help
                  resolve disputes regarding buyouts, dissenters' rights, and
                  oppression claims.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Per Florida Statute Chapter 607 (definition of “fair value”):
                </h3>
                <p className="mb-4">
                  “Fair value” means the value of the corporation’s shares is
                  determined:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    Immediately before the effectiveness of the corporate action
                    to which the shareholder objects.
                  </li>
                  <li>
                    Using customary and current valuation concepts and
                    techniques generally employed for similar businesses in the
                    context of the transaction requiring appraisal, excluding
                    any appreciation or depreciation in anticipation of the
                    corporate action unless exclusion would be inequitable to
                    the corporation and its remaining shareholders.
                  </li>
                  <li>
                    In most instances, without discounting for lack of
                    marketability or minority status.
                  </li>
                </ul>

                <p className="mb-4">
                  Florida statute mandates that shareholders are entitled to
                  certain operations and financial information and that such
                  rights cannot be waived through the terms of a company created
                  operating agreement.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Per Florida Statute Chapter 605 (limitations of operating
                  agreement allowances):
                </h3>
                <p className="mb-4">
                  Contractual agreements (i.e., operating agreement) within
                  entities cannot unreasonably restrict the duties and rights
                  stated in Florida Statute 605.0410, but the operating
                  agreement may impose reasonable restrictions on the
                  availability and use of information obtained under that
                  section and may define appropriate remedies, including
                  liquidated damages, for a breach of a reasonable restriction
                  on use.
                </p>

                <p className="mb-4">
                  Dissenters’ rights provide shareholders the opportunity to
                  dissent from unusual corporate actions that will negatively
                  impact their holding. Shareholder rights are governed by state
                  statutes and case law can be triggered by a multitude of
                  actions of which the non-controlling shareholder objects
                  (i.e., merger, sale of assets other than in the ordinary
                  course of business, sale of shareholding, amendment to
                  articles of incorporation, etc.).
                </p>

                <p className="mb-4">
                  A valuation may also be required in a variety of other
                  disputes among shareholders, including the terms of a
                  buy-sell, operating agreement, or involving transactions
                  between new or departing shareholders or partners. These
                  matters are directed by contractual agreements or other
                  governing corporate documents between the owners of a
                  business.
                </p>

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

export default ShareholderDisputesBusinessDivorce;
