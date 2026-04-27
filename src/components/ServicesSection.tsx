import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    icon: TrendingUp,
    number: "01",
    title: "Buy-Side Transactional Valuations",
    slug: "buy-side-transactional-valuations",
    description:
      "Independent, data-driven buy-side valuations for strategic acquisitions.",
  },
  {
    icon: BarChart3,
    number: "02",
    title: "Estate & Gift Tax",
    slug: "estate-gift-tax-valuations",
    description:
      "Valuations for estate planning, gifting, and tax reporting requirements.",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Fair Value Measurement",
    slug: "fair-value-measurement",
    description:
      "Financial and tax reporting often require independent, supportable valuation analyses for IPOs, stock compensation, equity transfers, and M&A transactions.",
  },
  {
    icon: Shield,
    number: "04",
    title: "Healthcare Valuations",
    slug: "healthcare-valuations",
    description:
      "Specialized valuation services for medical practices and healthcare facilities.",
  },
  {
    icon: BarChart3,
    number: "05",
    title: "IRC Section 409A Valuation",
    slug: "irc-section-409a-valuation",
    description:
      "Compliance valuations for stock options and equity-based compensation.",
  },
  {
    icon: BarChart3,
    number: "06",
    title: "Lending Valuations",
    slug: "valuations-for-underwriting-lending-purposes",
    description: "Valuations for underwriting and SBA lending purposes.",
  },
  {
    icon: Shield,
    number: "07",
    title: "Divorce Litigation & Support",
    slug: "matrimonial-valuation-litigation-support",
    description:
      "Expert witness testimony, marital dissolution, economic damages, and lost profits analysis.",
  },
  {
    icon: Target,
    number: "08",
    title: "Mergers & Acquisitions",
    slug: "mergers-acquisitions",
    description:
      "Consulting for buy-side and sell-side transactions to maximize value.",
  },
  {
    icon: TrendingUp,
    number: "09",
    title: "Quality of Earnings",
    slug: "quality-of-earnings-report",
    description:
      "Detailed analysis of earnings quality for potential buyers or lenders.",
  },
  {
    icon: Target,
    number: "10",
    title: "Shareholder Disputes",
    slug: "shareholder-disputes-business-divorce",
    description:
      "Resolution support for business divorce and shareholder disagreement cases.",
  },
  {
    icon: BarChart3,
    number: "11",
    title: "Valuation of Profits Interests",
    slug: "valuation-of-profits-interests-and-tax-elections",
    description:
      "Specialized valuation services for profits interests under Rev. Proc. 93-27 and 83(b) elections.",
  },
]

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      className="pt-20 md:pt-28 lg:pt-32 pb-10 md:pb-14 lg:pb-16 bg-muted"
    >
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold font-inter text-sm font-medium tracking-widest uppercase">
              Our Services
            </span>
            <div className="h-px w-12 bg-gold" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
          >
            What We Offer
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate font-inter"
          >
            Comprehensive financial solutions tailored to your unique needs and
            goals.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={`/services/${service.slug}`}
              className="group bg-card rounded-2xl p-8 card-hover shadow-elegant cursor-pointer flex flex-col"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                    <service.icon className="w-7 h-7 text-gold group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <span className="font-playfair text-4xl font-bold text-muted-foreground/20">
                    {service.number}
                  </span>
                </div>

                <h3 className="font-playfair text-xl font-semibold text-primary mb-3 group-hover:text-gold transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-slate font-inter text-sm leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>

                <span
                  className="inline-flex items-center gap-2 text-gold font-medium text-sm group/link mt-auto"
                >
                  Read More
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
