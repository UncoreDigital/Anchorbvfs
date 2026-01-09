import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { serviceLinks } from "@/lib/serviceLinks";

const QualityOfEarningsReport = () => {
  const currentSlug = "quality-of-earnings-report";
  const title = "Quality of Earnings Report";

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
                    src="/assets/services_content/quality-of-earnings-report/quality-img.jpg"
                    alt={title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <p className="mb-4">
                  A company’s quality of earnings (“QOE”) can be determined a
                  number of ways, but ultimately it is obtained through analysis
                  of actual operating cash flow. Often this analysis leads to
                  sales, and profit margins differ from internal financial
                  statements and/or company tax returns.
                </p>

                <p className="mb-4">
                  To arrive at a true representation of operating sales and
                  related expenses, we begin analysis with a high-level, key
                  management and accounting staff interview in order to get a
                  sense of day-to-day financial entry logistics, checks and
                  balances in place, and leadership style overall.
                </p>

                <p className="mb-4">
                  In general, earnings that are calculated conservatively are
                  considered more reliable than those calculated by aggressive
                  tax mitigating accounting policies. Quality of earnings can be
                  obscured by accounting practices that hide poor sales or
                  increased business risk.
                </p>

                <p className="mb-4">
                  If a company adheres to generally accepted accounting
                  principles (GAAP) and/or has audited financial records, it is
                  likely that the quality of earnings is better presented and of
                  higher quality when compared to a company that does not as
                  stringently adhere to accounting principles.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Understanding Quality of Earnings
                </h3>
                <p className="mb-4">
                  Some companies manipulate earnings downward to reduce the
                  taxes they owe. Others find ways to artificially inflate
                  earnings to make them look better to analysts and investors.
                  Unveiling the true net income of a company narrows the gap
                  between various manipulation techniques and operating
                  profitability.
                </p>
                <p className="mb-4">
                  Companies that manipulate their earnings are said to have poor
                  or low earnings quality and those that do not manipulate their
                  earnings have a higher quality of earnings. However, many
                  companies with high earnings quality will still adjust their
                  financial information to minimize their tax burden.
                  Identifying this type of manipulation is a key aspect to the
                  work completed in a QOE report. One way in which the numbers
                  are presently through a QOE analysis is through the
                  identification of nonrecurring, non-operating, and/or
                  discretionary sales and/or expenses.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Earnings Manipulation
                </h3>
                <p className="mb-4">
                  As previously noted, there are many ways to gauge the quality
                  of earnings. We often start at the top of the income statement
                  and work our way down. As an example, companies that report a
                  high growth in sales, may also show a corresponding growth in
                  credit sales. Investors are wary of sales that are due only to
                  lose credit terms. Or perhaps the subject company has taken on
                  additional debt to repurchase shares and in doing so the
                  company shares appear to be undervalued, when share value is
                  falsely inflated.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  QOE Value Drivers:
                </h3>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      A company’s quality of earnings can be revealed by
                      spotting and removing any irregularities, accounting
                      manipulation, or one-off accounting entries that skew the
                      numbers.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Questionable fraudulent activity is often identified
                      through a QOE analysis (i.e., a reported increase in net
                      income without the corresponding increase in cash flow).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Tracking activity from the income statement through to the
                      balance sheet and cash flow statement is a good way to
                      gauge quality of earnings (we often do an “audit check” in
                      conjunction with this work using tracing to related bank
                      entries).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      A quality of earnings report is often an invaluable step
                      in the acquisition and/or restructuring process. The
                      expense to obtain this thorough analysis pales in
                      comparison to the value that it provides.
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

export default QualityOfEarningsReport;
