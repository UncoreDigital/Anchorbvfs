import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  UtensilsCrossed,
  ShoppingBag,
  Briefcase,
  Store,
  Stethoscope,
  MoreHorizontal,
  Construction,
  Gavel,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";

const IndustryExpertise = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const industries = [
    {
      category: "Healthcare",
      icon: Stethoscope,
      description:
        "We specialize in healthcare valuations, comprising 50% of our work.",
      items: [
        "Acute Care/Urgent Care",
        "Ambulatory Care",
        "Anesthesia",
        "Cardiovascular & Thoracic",
        "Chiropractor",
        "Dental Support Organizations (DSOs)",
        "Emergency Rooms",
        "General Practice",
        "General Surgery Centers",
        "Managed Services Organizations (MSOs)",
        "Neurology",
        "Optometry",
        "Pain Management",
        "Plastic Surgery",
        "Podiatry",
        "Vaccination Services",
        "Dental Practices",
        "Elder Care Facilities",
      ],
    },
    {
      category: "Construction & Facilities",
      icon: Construction,
      description:
        "Comprehensive valuation services for construction and facility management businesses.",
      items: [
        "Construction & Manufacturing Building",
        "Facilities Services",
        "Asphalt/Paving",
        "Concrete",
        "HVAC",
        "Janitorial Services & Linens",
        "Rental & Maintenance",
        "Landscaping Design & Maintenance",
        "Marble/Tile Manufacturing",
        "Plumbing",
        "Recycling",
        "Garage/Closet Installation",
        "Kitchen Buildouts",
        "Mailbox Installation",
        "Signs Installation",
        "Water Detection & Treatment",
        "Window Service/Installation",
      ],
    },
    {
      category: "Food & Beverage",
      icon: UtensilsCrossed,
      description:
        "Expertise in various food service and production businesses.",
      items: [
        "Bar/Nightclub",
        "Concession Services (Airports, Gov, Parks)",
        "Hispanic Food Markets",
        "Meat Sticks/Snacks",
        "Restaurants",
        "Fast-food",
        "Mexican Cuisine",
        "Steakhouses",
      ],
    },
    {
      category: "Professional Services",
      icon: Briefcase,
      description: "Valuations for professional service providers and firms.",
      items: [
        "Accounting Services",
        "Architecture",
        "Financial Advisory",
        "Portfolio Management",
        "Insurance Security Products",
        "IT/Software Services",
        "Law Firms",
        "Moving Services",
        "Professional Coaching",
        "Marketing Firms",
      ],
    },
    {
      category: "Retail",
      icon: ShoppingBag,
      description: "Valuation services for various retail establishments.",
      items: [
        "Apparel & Accessories",
        "Outdoor Sporting Apparel",
        "School/College Apparel",
        "Arts & Antiques",
        "Crafts Store",
        "Garden Supply Center",
        "Print Store",
        "Tobacco & Vape Stores",
        "Feed Store",
      ],
    },
    {
      category: "Franchises",
      icon: Store,
      description: "Specialized valuation for franchise business models.",
      items: [
        "Cellular Phone Store Chain",
        "Dry Cleaners",
        "Insurance Franchises",
      ],
    },
    {
      category: "Other Services",
      icon: MoreHorizontal,
      description: "We serve a diverse range of other industries.",
      items: [
        "Appliance Installation & Repair",
        "Daycare",
        "Marine Transportation & Maintenance",
        "Dog Walking",
        "Automotive Services",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Industry Expertise"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industry Expertise" },
        ]}
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
              Sectors We Serve
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
              Our Industry Experience
            </h2>
            <p className="text-muted-foreground font-inter max-w-3xl mx-auto leading-relaxed">
              At Anchor Business Valuations & Financial Services, clients feel
              confident because of the qualifications and expanse of services we
              offer. Our professional expertise is comprised of an array of
              industries, allowing us to provide tailored insights for your
              specific business needs.
            </p>
          </div>

          <div className="grid gap-12">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-elegant transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                      <industry.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-primary mb-3">
                      {industry.category}
                    </h3>
                    <p className="text-muted-foreground font-inter mb-6">
                      {industry.description}
                    </p>
                  </div>

                  <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
                    <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                      {industry.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm font-inter text-foreground/80"
                        >
                          <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IndustryExpertise;
