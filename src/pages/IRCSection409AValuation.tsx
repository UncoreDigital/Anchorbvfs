import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { serviceLinks } from "@/lib/serviceLinks";

const IRCSection409AValuation = () => {
  const currentSlug = "irc-section-409a-valuation";
  const title = "IRC Section 409A Valuation";

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
                {/* Intro */}
                <p className="mb-6">
                  Anchor Business Valuation, LLC has over a decade of the
                  required experience and expertise to help you with a smooth
                  processing of your 409A valuation. Our team members have
                  performed hundreds of 409A valuations across diverse sectors,
                  right from pre-revenue staged Companies to the pre-IPO.
                  Anchor’s entire execution process is subjected to rigorous,
                  multi-time quality checks to ensure the maintenance of the
                  highest quality standards. Emphasis on methodology documents
                  and auditability ensures that the projects delivered are
                  highly consistent and within a defined time frame.
                </p>

                <div className="my-8 rounded-2xl overflow-hidden">
                  <img
                    src="/assets/services_content/irc-section-409a-valuation/irc02-img.jpg"
                    alt="IRC 409A Valuation Team"
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* 409A Valuation */}
                <h2 className="text-3xl font-display font-bold text-navy mb-4">
                  409A Valuation
                </h2>

                <h3 className="text-xl font-bold text-navy mb-2">
                  Brief Background
                </h3>
                <p className="mb-4">
                  Section 409A was introduced as Internal Revenue Code (“IRC”)
                  by the Internal Revenue Service (“IRS”) through Section 885 of
                  the American Jobs Creation Act of 2004 in October 2004 and
                  took effect on December 31, 2004.
                </p>
                <p className="mb-4">
                  IRC Section 409A was enforced by the IRS in response to the
                  2001 scandal by the Enron Corporation that involved several
                  compensation related accounting frauds. Amongst Enron’s
                  fraudulent activity, was the grant of large stock options
                  awards deferred compensation to Enron’s key executives. Prior
                  to Enron’s bankruptcy in 2001, certain key executives
                  accelerated the vesting of, and exercised, their stock options
                  and sold the underlying stock when Enron’s shares were trading
                  at all-time highs. These actions protected select individual
                  interests while the remaining Enron employees lost a
                  significant portion of their retirement savings. As a result
                  of Enron’s nefarious actions, the IRS on January 1, 2005,
                  added Section 409A to the IRC and changed a number of rules
                  governing deferred compensation plans, including the
                  regulations related to a company’s executives’ ability to
                  choose when to receive such deferred compensation.
                </p>

                <h3 className="text-xl font-bold text-navy mb-2">
                  Deferred Compensation Plans
                </h3>
                <p className="mb-4">
                  Before understanding the applicability of IRC Section 409A on
                  businesses, it is necessary to understand Deferred
                  Compensation Plans.
                </p>
                <p className="mb-4">
                  Companies that are experiencing growth in their operations
                  want to attract and retain key talent to continue growing.
                  Start-up companies often have limited cash flow to grow the
                  business, and thus, look to non-cash compensation alternatives
                  for key employees. As a result, these businesses offer future
                  incentive employee benefits in the form of Deferred
                  Compensation Plans. There are two categories of Deferred
                  Compensation Plans which are detailed below:
                </p>

                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    <strong>
                      Qualified Deferred Compensation Plans(“QDC”)
                    </strong>{" "}
                    such as 401(K), 457 or 403(b) plans, offer tax advantages to
                    employees by deferring a percentage of their compensation
                    for future savings post retirement, disability, death
                    events, and benefits on current income taxes. These plans
                    are strictly governed and have contribution limits, meaning
                    an employee cannot contribute more than a certain amount
                    each year into the plan.
                  </li>
                  <li>
                    <strong>
                      Nonqualified Deferred Compensation Plans (“NQDC”)
                    </strong>{" "}
                    carry additional benefits above that of Qualified Deferred
                    Compensation Plans, including non-IRS-defined compensation
                    deferral limits, which means that there is no limit to how
                    much an employee can contribute with an NQDC plan.
                    Additional benefits of NQDC’s, as compared to QDC’s, include
                    less taxable income for employees when they make a deferral
                    election and no mandatory IRS required minimum distributions
                    (allowing the deferred compensation to continue to grow).
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-navy mb-2">
                  Compliance Scope and Penalties
                </h3>
                <p className="mb-4">
                  As noted above, IRC Section 409A applies to compensation
                  deferred under a “Nonqualified Deferred Compensation Plan”.
                  The IRS regulates the treatment of NQDS plans for federal
                  income tax purposes. All companies that enter a NQDC
                  arrangement with their employees must follow specific rules
                  outlined under IRC Section 409A.
                </p>
                <p className="mb-4">
                  Failure to comply with these rules carries heavy penalties for
                  the employee in the risk of losing the tax-deferred plan
                  status, and subjecting participants to their plan compensation
                  deferrals declared immediately taxable at a participant’s
                  regular tax rate, a 20% additional federal income tax penalty,
                  subject state tax penalties, plus an additional underpayment
                  penalty of 1% above the IRS’s general underpayment penalty (in
                  case the employee fails to pay the tax in a timely manner).
                  For the companies that fail to abide by the Section 409A
                  rules, additional penalties come in the form of payroll taxes
                  on the plans offered, and a decreased value when/if the
                  company decides to file an initial public offering (“IPO”).
                </p>
                <p className="mb-4">
                  As an aside, Section 409A has no effect on the Federal
                  Insurance Contributions Act (“FICA”) (aka Social Security and
                  Medicare) tax.
                </p>

                <div className="my-8 rounded-2xl overflow-hidden">
                  <img
                    src="/assets/services_content/irc-section-409a-valuation/irc03-img.jpg"
                    alt="Compliance"
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Section 409A – Valuation */}
                <h2 className="text-3xl font-display font-bold text-navy mb-4">
                  Section 409A – Valuation
                </h2>

                <h3 className="text-xl font-bold text-navy mb-2">
                  Introduction
                </h3>
                <p className="mb-4">
                  As per IRC Section 409A rules, any private company that grants
                  to its employees, “equity-based compensation” in the form of
                  stock options, stock appreciation rights, warrants, restricted
                  stocks, restricted stock units, performance stock units, and
                  other, must first determine the Fair Market Value (“FMV”) of
                  its stock.
                </p>
                <p className="mb-4">
                  The date of valuation should be as close to the grant date of
                  the equity-based compensation award as possible. Additionally,
                  the valuation must be updated, at a minimum, on an annual
                  basis, or in case of any material event triggered (whichever
                  is earlier). “Material events” can include new equity
                  financings; an acquisition offer by another company; certain
                  instances of secondary sales of common stock; and significant
                  changes (good or bad) to a company’s financial outlook. A
                  company credibly approaching IPO will also conduct 409A
                  valuations more frequently (e.g., quarterly or even monthly).
                </p>

                <h3 className="text-xl font-bold text-navy mb-2">
                  General Guidelines
                </h3>
                <p className="mb-4">
                  Private companies that get an independent valuation done for
                  their stock within 12 months of the date of granting
                  equity-based awards, such as stock options to their employees,
                  are deemed to follow a “Safe Harbor” valuation approach
                  compliant with IRC Section 409A. A “Safe Harbor” approach is
                  beneficial for the company as the reasonableness of the fair
                  market value proof of burden is then on the IRS versus the
                  subject company (i.e., if the IRS challenges the valuation of
                  the stock price of the subject company).
                </p>
                <p className="mb-4">
                  The end goal of a 409A valuation is to determine the FMV of a
                  company’s stock as of the date of grant of the equity-based
                  compensation award. The determined FMV of the stock serves as
                  the predetermined Strike Price of the option which the
                  employee exercises at a future date to purchase the company’s
                  shares. The employee will realize gain of the exercised option
                  if it is “in-the-money”, i.e. the Strike Price is less than
                  the current FMV of the privately held company’s stock. If the
                  option is “out of the money”, meaning the Strike Price is
                  above that of the underlying stock, then the employee loses
                  the cost of the option and does not exercise the security. It
                  is therefore very important that the FMV of the subject
                  company’s stock be valued correctly to maximize gain for its
                  employees and shareholders.
                </p>

                <h3 className="text-xl font-bold text-navy mb-2">
                  Valuation Steps
                </h3>
                <p className="mb-4">
                  Most often a private company has a complex capital structure
                  comprised of multiple classes of securities including common
                  stock, preferred stock, options, and warrants. The valuation
                  process for determining the FMV of the subject company’s
                  common stock is presented in a simplified manner below:
                </p>

                <h4 className="text-lg font-bold text-navy mt-4 mb-2">
                  STEP 1 – Calculate Enterprise Value of the Subject Company
                </h4>
                <p className="mb-4">
                  There are three commonly used approaches to determine the
                  Enterprise Value of the company (detailed below together with
                  methodological examples, not an exhaustive list, of each
                  approach).
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    <strong>Market Approach:</strong>
                    <ul className="list-circle pl-6 mt-2 space-y-1">
                      <li>
                        <em>Guideline Public Companies Method:</em> value is
                        derived using several publicly traded companies that are
                        similar in size, and industry – Comparable Set. The
                        selected multiple, such as, EBITDA, Revenue, Net Income,
                        etc., of this Comparable Set is then used to determine
                        and calculate the Enterprise Value of the subject
                        company.
                      </li>
                      <li>
                        <em>Guideline Transactions Method:</em> the Guideline
                        M&A Transaction Methodology within the Market Approach
                        uses actual prices paid in merger and acquisition
                        transactions for companies similar to the Company. Exit
                        multiples of total purchase price paid to revenues,
                        EBIT, EBITDA, net income and/or book value may be
                        developed for each comparable transaction, if the data
                        is available. These multiples are then applied to the
                        Company’s corresponding latest 12-month and projected
                        financial metrics
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Income Approach:</strong>
                    <p className="mt-1">
                      This approach involves valuing the subject company based
                      on specific benefit streams – Earnings or Cashflows.
                      Commonly used income approach methods in 409A valuations
                      are the Discounted Cash Flow (“DCF”), and the
                      Capitalization of Earnings (“COE”) methods.
                    </p>
                  </li>
                  <li>
                    <strong>Asset/Cost Approach:</strong>
                    <p className="mt-1">
                      This is a less commonly used valuation approach in which
                      the value is determined based on a difference between the
                      FMV of balance sheet assets and liabilities (often
                      including non-balance sheet items in the value
                      determination). The principal method used in the asset
                      approach is the Adjusted Net Asset Value (“NAV”) method.
                      This method is often costly as it necessitates valuations
                      of the individual balance sheet items and, for a going
                      concern business, frequently results in the lowest value
                      determined (over that of the income and market
                      approaches).
                    </p>
                  </li>
                </ul>

                <div className="my-8 rounded-2xl overflow-hidden">
                  <img
                    src="/assets/services_content/irc-section-409a-valuation/irc05-img.jpg"
                    alt="Valuation Methods"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <h4 className="text-lg font-bold text-navy mt-4 mb-2">
                  STEP 2 – Calculate Equity Value of the Subject Company
                </h4>
                <p className="mb-4">
                  After determining the Enterprise Value, the next step is to
                  arrive at the Equity Value of the subject company.
                </p>

                <h4 className="text-lg font-bold text-navy mt-4 mb-2">
                  STEP 3 – Allocate Equity Value to each class of subject
                  company’s capital structure – Equity Allocation
                </h4>
                <p className="mb-4">
                  Often the capital structure of a privately held company is
                  comprised of more than one class of securities, such as,
                  common stock, preferred stock, options, or warrants. This
                  multi-class equity composition makes up what is called a
                  “Complex Capital Structure”. Such complex capital structures
                  require an allocation of equity value to each class within the
                  company’s capital structure.
                </p>
                <p className="mb-4">
                  Commonly used methods for Equity Allocation include:
                </p>
                <ul className="list-decimal pl-6 mb-6 space-y-2">
                  <li>
                    <strong>The Option Pricing Method (OPM):</strong> This
                    method considers common stock and preferred stock as call
                    options (to purchase at a certain price) on the equity
                    value, and base exercise prices on the liquidation
                    preferences of the preferred stock. The base price is needed
                    to construct the incremental value in the breakpoints.
                    Appraisers widely use this method in situations in which
                    future liquidity events are difficult to forecast (such
                    events can be in the form of an IPO, merger and/or
                    acquisition transaction, and entity dissolution). The most
                    used OPM is the Black-Scholes Option Pricing Model.
                  </li>
                  <li>
                    <strong>
                      Probability Weighted Expected Returns Method (PWERM):
                    </strong>{" "}
                    This method of allocation bases share value upon the
                    probability-weighted present value of expected future
                    investment returns, with consideration for each of the
                    probable future outcomes available to the enterprise, as
                    well as the rights of each share class. Commonly applied
                    “future outcomes” include an IPO, a merger and/or
                    acquisition, divestiture, or continuance as a private
                    company. PWERM estimates the range of the future and present
                    value under each future outcome and applies a probability
                    factor to each outcome as of the valuation date.
                  </li>
                  <li>
                    <strong>Current Value Method (CVM):</strong> The CVM method
                    of allocation bases equity value estimates on a controlling
                    basis assuming an immediate sale or liquidation of the
                    enterprise. Allocation is then made on the basis of based on
                    the series’ liquidation preferences or conversion values,
                    whichever is greater.
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

export default IRCSection409AValuation;
