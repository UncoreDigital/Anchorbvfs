import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { serviceLinks } from "@/lib/serviceLinks";

const MatrimonialValuationLitigationSupport = () => {
  const currentSlug = "matrimonial-valuation-litigation-support";
  const title =
    'Matrimonial Dissolution ("Divorce") Valuation & Litigation Support';

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
                    src="/assets/services_content/matrimonial-valuation-litigation-support/matrimonial-img.jpg"
                    alt="Matrimonial Valuation"
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <p className="mb-4">
                  Anchor Business Valuations & Financial Services, LLC provides
                  valuation, forensic accounting, and advisory services in the
                  matrimonial litigation setting. Through many years and
                  countless cases, we have helped our clients and their counsel
                  resolve complicated matters that exist in the context of
                  marital dissolution. Whether court appointed in a neutral
                  capacity or directly retained by one party in litigation, we
                  can be entrusted to determine financial scenarios in an
                  accurate and independent manner.
                </p>

                <p className="mb-4">
                  In addition to valuation services, Anchor offers a variety of
                  litigation support services. (These services are often in
                  conjunction with a business valuation engagement.) Some of the
                  support services provided include:
                </p>
                <ul className="list-disc pl-6 mb-8 space-y-2">
                  <li>
                    Preparation and review of legal documents (including
                    affidavits, interrogatories, equitable distribution
                    worksheets, motion reviews, deposition reviews, etc)
                  </li>
                  <li>
                    Income determination (pre, during, and post-settlement)
                  </li>
                  <li>Lifestyle analysis (pre, during, and post-settlement)</li>
                  <li>Review of opposing expert’s work products</li>
                </ul>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Valuation Services for Marital Dissolution Matters
                </h3>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Valuation of controlling and minority interests in closely
                      held businesses
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Review and/or quantification of personal and entity
                      goodwill comprised within the subject company
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Valuation of employee stock options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Preparation of expert reports, as necessary</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Forensic Accounting Services – Uncovering Hidden Income or
                  Assets
                </h3>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Preparation of lifestyle analysis to quantify unreported
                      income
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Preparation of the marital balance sheet to identify
                      marital vs. separate property
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Identification of actual income available for child
                      support and alimony
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Asset tracing to confirm or refute the existence of
                      separate property
                    </span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Litigation Support – Expert Witness or Consulting Capacity
                </h3>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>
                      Assist counsel with the deposition of opposing experts
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Assist with the preparation of trial exhibits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Review the reports prepared by opposing experts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                    <span>Expert witness testimony, as necessary</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Expert Standards and Goodwill Valuation
                </h3>
                <p className="mb-4">
                  In litigation, expert testimony admissibility is often
                  governed by the strict standards of <strong>Daubert</strong>{" "}
                  or <strong>Frye</strong>, making defensible valuation
                  methodologies essential. A critical component of these
                  valuations is how goodwill treatment differs by state, since
                  marital goodwill is jurisdiction-dependent.
                </p>

                <h4 className="text-lg font-bold text-navy mb-2">
                  Two Types of Goodwill in Divorce Cases
                </h4>
                <p className="mb-4">
                  Goodwill is one of the most contentious components in divorce
                  valuations. Most valuation disputes revolve around
                  distinguishing these two:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong>Enterprise Goodwill:</strong> Derived from the
                    business itself, transferable, and generally considered
                    marital property.
                  </li>
                  <li>
                    <strong>Personal Goodwill:</strong> Tied to the owner’s
                    reputation, skill, or personal relationships, not
                    transferable, and often considered non-marital.
                  </li>
                </ul>

                <h4 className="text-lg font-bold text-navy mb-2">
                  State-by-State Variation
                </h4>
                <p className="mb-4">
                  States differ dramatically in whether personal goodwill is
                  considered marital property:
                </p>
                <ul className="list-disc pl-6 mb-8 space-y-2">
                  <li>
                    <strong>States that Exclude Personal Goodwill:</strong>{" "}
                    Florida, Ohio, Texas, Virginia, North Carolina. These states
                    view personal goodwill as tied to the individual and thus
                    not divisible. Valuators must separate enterprise (marital)
                    from personal (non-marital) goodwill.
                  </li>
                  <li>
                    <strong>States that Include Personal Goodwill:</strong>{" "}
                    Colorado, Indiana, New Mexico. Some states treat all
                    goodwill—enterprise and personal—as marital property when it
                    is marketable or enhances business value. Experts must be
                    careful when quantifying professional practices, using
                    excess earnings methods, or attributing future earnings to
                    goodwill.
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Collaborative/Cooperative and Neutral Expert Services
                </h3>
                <p className="mb-4">
                  We often work collectively with highly reputable forensic
                  accounting experts in complex asset dissipation matters.
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

export default MatrimonialValuationLitigationSupport;
