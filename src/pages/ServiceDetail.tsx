import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Phone, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import { Button } from '@/components/ui/button';

const servicesData: Record<string, {
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  image: string;
}> = {
  '409a-valuation': {
    title: 'IRC Section 409A Valuation',
    description: 'Compliance valuations for stock options and equity-based compensation.',
    longDescription: 'Section 409A was introduced as Internal Revenue Code (“IRC”) by the Internal Revenue Service (“IRS”) through Section 885 of the American Jobs Creation Act of 2004. We provide defensible outcomes ensuring your stock option plans are compliant and your employees are protected. Our reports are designed to withstand scrutiny from auditors and the IRS.',
    features: [
      'Enterprise Value Calculation',
      'Equity Value Allocation',
      'Option Pricing Method (OPM)',
      'PWERM Analysis',
    ],
    benefits: [
      'Safe Harbor Compliance',
      'IRS Audit Readiness',
      'Maximize Employee Gain',
      'Defensible Outcomes',
    ],
    image: '/assets/services/01-irc-section-409a-valuation/content/irc02-img.jpg',
  },
  'business-valuation': {
    title: 'Fair Value Measurement',
    description: 'Valuations for financial and tax reporting requirements.',
    longDescription: 'Often financial and tax reporting circumstances require qualified, independent valuation reports. For example, when a company plans to have an initial public offering, issues stock options, or transfers or sells equity interests, a valuation is required. We offer services for purchase price allocations in accordance with GAAP and tax regulations.',
    features: [
      'Purchase Price Allocation',
      'FASB ASC Topic 805',
      'Impairment Testing',
      'Intangible Asset Valuation',
    ],
    benefits: [
      'GAAP Compliance',
      'Independent Analysis',
      'Financial Reporting Support',
      'Audit Defense',
    ],
    image: '/assets/services/06-fair-value-measurement/content/fairvalue-img.jpg',
  },
  'healthcare-valuations': {
    title: 'Healthcare Valuations',
    description: 'Specialized valuation services for medical practices and healthcare facilities.',
    longDescription: 'Anchor Business Valuations & Financial Services, LLC has extensive experience serving healthcare providers. We understand the regulatory environment (Stark Laws, Anti-Kickback), reimbursement models, and operational complexities that drive value in the healthcare sector. We are regularly retained to value medical practices, dental practices, and hospitals.',
    features: [
      'Merger & Acquisition Consulting',
      'Buy/Sell Agreements',
      'Shareholder Dispute Litigation',
      'Matrimonial Litigation Support',
    ],
    benefits: [
      'Industry Expertise',
      'Regulatory Compliance',
      'Fair Market Value Opinions',
      'Transaction Structuring',
    ],
    image: '/assets/services/02-healthcare-valuations/content/health-img.jpg',
  },
  'mergers-acquisitions': {
    title: 'Mergers & Acquisitions',
    description: 'Consulting for buy-side and sell-side transactions to maximize value.',
    longDescription: 'We assist business owners and investors through the complex M&A process. From deal structuring and due diligence to valuation and negotiation support, we help you achieve your transaction goals. Our expertise in Fair Value and Quality of Earnings ensures a smooth transaction.',
    features: [
      'Deal Structuring',
      'Due Diligence',
      'Valuation Analysis',
      'Negotiation Support',
    ],
    benefits: [
      'Maximized Value',
      'Reduced Risk',
      'Smooth Transaction Process',
      'Expert Guidance',
    ],
    image: '/assets/services/08-quality-of-earnings-report/content/quality-img.jpg',
  },
  'litigation-support': {
    title: 'Matrimonial & Litigation Support',
    description: 'Expert witness testimony, marital dissolution, and forensic accounting.',
    longDescription: 'Anchor Business Valuations provides valuation, forensic accounting, and advisory services in the matrimonial litigation setting. Whether court appointed or directly retained, we determine financial scenarios in an accurate and independent manner. We also support economic damage calculations and lost profit claims.',
    features: [
      'Legal Document Review',
      'Income Determination',
      'Lifestyle Analysis',
      'Forensic Accounting',
    ],
    benefits: [
      'Uncovering Hidden Assets',
      'Marital Balance Sheet',
      'Child Support Analysis',
      'Expert Witness Testimony',
    ],
    image: '/assets/services/04-matrimonial-valuation-litigation-support/content/matrimonial-img.jpg',
  },
  'estate-gift-tax': {
    title: 'Estate & Gift Tax Valuations',
    description: 'Valuations for estate planning, gifting, and tax reporting requirements.',
    longDescription: 'We work closely with estate planning attorneys and tax professionals to provide valuations for estate and gift tax purposes. Our reports are prepared in accordance with IRS guidelines to minimize audit risk.',
    features: [
      'Estate Tax Valuation',
      'Gift Tax Valuation',
      'Discount Studies',
      'IRS Audit Support',
    ],
    benefits: [
      'Tax Compliance',
      'Audit Protection',
      'Wealth Preservation',
      'Peace of Mind',
    ],
    image: '/assets/services/03-estate-gift-tax-valuations/content/estate-img-1.jpg',
  },
  'shareholder-disputes': {
    title: 'Shareholder Disputes',
    description: 'Resolution support for business divorce and shareholder disagreement cases.',
    longDescription: 'Shareholder disputes can be contentious and complex. We provide objective valuation and financial analysis to help resolve disputes regarding buyouts, dissenters\' rights, and oppression claims.',
    features: [
      'Business Divorce',
      'Dissenting Shareholder Actions',
      'Buyout Valuation',
      'Mediation Support',
    ],
    benefits: [
      'Objective Assesment',
      'Dispute Resolution',
      'Fair Outcomes',
      'Litigation Readiness',
    ],
    image: '/assets/services/07-shareholder-disputes-business-divorce/content/shareholder-img.jpg',
  },
  'quality-of-earnings': {
    title: 'Quality of Earnings Report',
    description: 'Detailed analysis of earnings quality for potential buyers or lenders.',
    longDescription: 'A company’s quality of earnings (“QOE”) is determined through analysis of actual operating cash flow. We analyze the sustainability and accuracy of earnings to support investment decisions and unveil the true net income, narrowing the gap between manipulation and specific operating profitability.',
    features: [
      'Operating Cash Flow Analysis',
      'Earnings Manipulation Detection',
      'Balance Sheet Verification',
      'Financial Statement Analysis',
    ],
    benefits: [
      'Informed Decision Making',
      'Risk Identification',
      'Deal Confidence',
      'Fraud Detection',
    ],
    image: '/assets/services/08-quality-of-earnings-report/content/quality-img.jpg',
  },
  'lending-valuations': {
    title: 'Valuations for Lending',
    description: 'Valuations for underwriting and SBA lending purposes.',
    longDescription: 'Anchor works with many regional and local banks by supplying abbreviated valuations to ensure that the lender is lending at rates and amounts that can be supported by the subject company’s operational cash flow. We act as a liaison between the client and the lender.',
    features: [
      'SBA 7(a) Valuations',
      'Seller Note Structuring',
      'Cash Flow Analysis',
      'Lender Liaison',
    ],
    benefits: [
      'Lender Confidence',
      'Secure Underwriting',
      'Fast Turnaround',
      'Accurate Growth Projections',
    ],
    image: '/assets/services/09-valuations-for-underwriting-lending-purposes/content/valuations-img.jpg',
  },
};

const allServices = Object.entries(servicesData).map(([slug, data]) => ({
  slug,
  title: data.title,
}));

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? servicesData[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <PageBanner
          title="Service Not Found"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/' },
            { label: 'Not Found' },
          ]}
        />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-slate mb-8">The service you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="default">Return Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title={service.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/#services' },
          { label: service.title },
        ]}
      />

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              {/* Services List */}
              <div className="bg-muted/30 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-display font-bold text-navy mb-6">Our Services</h3>
                <ul className="space-y-3">
                  {allServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/services/${s.slug}`}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${s.slug === slug
                          ? 'bg-gold text-navy font-semibold'
                          : 'bg-white hover:bg-gold/10 text-slate hover:text-navy'
                          }`}
                      >
                        <span>{s.title}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Card */}
              <div className="bg-navy rounded-2xl p-6 text-white">
                <h3 className="text-xl font-display font-bold mb-4">Need Help?</h3>
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
              >
                {/* Featured Image */}
                <div className="rounded-2xl overflow-hidden mb-8">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <h2 className="text-3xl md:text-4xl font-display font-bold text-navy mb-6">
                  {service.title}
                </h2>

                <p className="text-slate leading-relaxed mb-8">{service.longDescription}</p>

                {/* Features */}
                <div className="mb-12">
                  <h3 className="text-2xl font-display font-bold text-navy mb-6">What We Offer</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl"
                      >
                        <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-gold" />
                        </div>
                        <span className="text-navy font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-navy rounded-2xl p-8">
                  <h3 className="text-2xl font-display font-bold text-white mb-6">Key Benefits</h3>
                  <ul className="space-y-4">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-navy" />
                        </div>
                        <span className="text-white/90">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-12 flex flex-wrap gap-4">
                  <Link to="/contact">
                    <Button className="btn-cta">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <a href="tel:+12399193092">
                    <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
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

export default ServiceDetail;
