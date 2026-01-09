import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { serviceLinks } from "@/lib/serviceLinks";

const HealthcareValuations = () => {
  const currentSlug = "healthcare-valuations";
  const title = "Healthcare Valuations";

  const medicalPractices = [
    "Care/Urgent Care",
    "Neurology",
    "Allergy Specialists",
    "Oncology",
    "Anesthesia",
    "Ophthalmology",
    "Cardiovascular & Thoracic",
    "Outpatient Surgery Center",
    "Chiropractor (adult, expectant mothers, and children)",
    "Pain Management (chronic and interventional)",
    "Concierge Medicine",
    "Pediatrics",
    "Dental Practices (group and solo practitioner)",
    "Psychiatry",
    "Dental Specialties (implants, porcelain crowns, etc.)",
    "Plastic Surgery",
    "Emergency Rooms (attached to hospitals)",
    "Podiatry",
    "General Practice",
    "Radiology/Ultrasound",
    "Internal Medicine",
    "Spinal Specialists",
    "Medical Spa",
    "Vaccination Services/Specialty Inoculation",
    "Weight Loss (medical)",
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
                    src="/assets/services_content/healthcare-valuations/health-img.jpg"
                    alt={title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <p className="mb-4">
                  Anchor Business Valuations & Financial Services, LLC (“ABVFS”
                  or “ABV”) has extensive experience serving healthcare (medical
                  and dental) providers in valuation services. Having valued
                  healthcare practices for approximately 10 years (including
                  medical practices, dental practices, hospitals, and ancillary
                  facilities), we are regularly retained to value medical
                  practices and healthcare businesses and provide the highest
                  levels of proficiency and insight.
                </p>

                <p className="mb-6 font-bold text-navy text-xl">
                  On average, 50% of our annual valuation workflow is comprised
                  of healthcare businesses.
                </p>

                <p className="mb-4">
                  With the delivery of healthcare services in the United States
                  ever-changing, providers of medical and dental services are
                  faced with a multitude of challenges and opportunities.
                  Escalating costs and reductions in reimbursements have created
                  pressures throughout healthcare sectors. Healthcare providers
                  often seek new opportunities through mergers, acquisitions of
                  ancillary service operations, acquisitions of real estate, and
                  other monetizing arrangements that enable them to improve
                  financial margins and practice their specialty without working
                  capital concern. Physicians need to be keenly aware of
                  applicable government regulation within the industry (Federal
                  Medicare Anti-Kickback Statute, the Stark Laws, and state
                  regulatory requirements).
                </p>

                <p className="mb-6">
                  Anchor Business Valuations & Financial Services, LLC offers a
                  wide array of valuation and merger & acquisition consulting
                  services for the healthcare industry. Services we provide
                  include structuring and pricing transactions, fair market
                  value determination for gifting, quality of earnings for
                  acquisitions, and litigation support in various dispute
                  matters (divorce, shareholder dispute, shareholder buyout
                  determination).
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Valuation Services for Medical and Dental Practices:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {[
                    "Merger & Acquisition consulting/pricing assistance",
                    "Buy/Sell Agreements",
                    "Shareholder Dispute Litigation",
                    "Matrimonial Litigation",
                  ].map((service, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-gold flex-shrink-0" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>

                <p className="mb-6">
                  Healthcare valuation work is unique from other sectors due to
                  the industry’s nuanced characteristics that are distinctive to
                  the specialty and/or sub-specialty. Therefore, it is important
                  to utilize a valuation consultant who is well-versed in the
                  industry with many years of expertise. Anchor Business
                  Valuations & Financial Services, LLC possesses the experience
                  necessary to recognize and apply the healthcare industry’s
                  impact on the valuation considerations related to our client’s
                  practices and/or transactions.
                </p>

                <h3 className="text-xl font-bold text-navy mb-4">
                  Types of Healthcare Practices ABV has Valued
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {medicalPractices.map((practice, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0"></div>
                      <span>{practice}</span>
                    </div>
                  ))}
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

export default HealthcareValuations;
