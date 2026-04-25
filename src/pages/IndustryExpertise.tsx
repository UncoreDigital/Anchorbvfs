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
        "Specialize in small healthcare practices.",
      items: [
        "Acute Care/Urgent Care",
        "Allergy Specialists",
        "Ambulatory Care",
        "Anesthesia",
        "Cardiovascular & Thoracic",
        "Chiropractor",
        "Compound Pharmacies (503B)",
        "Compounding Pharmacies",
        "Concierge Medicine",
        "Dental Support Organizations (DSOs)",
        "Dental Practices & Specialties",
        "Elder Care Facilities",
        "Emergency Rooms",
        "General Practice",
        "General Surgery Centers",
        "Internal Medicine",
        "Managed Services Organizations (MSOs)",
        "Medical Spa",
        "Neurology",
        "Oncology",
        "Ophthalmology",
        "Optometry",
        "Outpatient Surgery Centers",
        "Pain Management",
        "Pediatrics",
        "Plastic Surgery",
        "Podiatry",
        "Psychiatry",
        "Regenerative Medicine",
        "Weight Loss (Medical)",
      ],
    },
    {
      category: "Construction Services",
      icon: Construction,
      description:
        "Comprehensive valuation services for construction and facility management businesses.",
      items: [
        "Asphalt & Paving",
        "Concrete Plants",
        "Disaster Cleaning",
        "Facilities Services",
        "Garage Closet Installation",
        "Garage Door Installation",
        "Heavy Construction (Governmental, State)",
        "Hospital Linens",
        "HVAC & Plumbing",
        "Irrigation",
        "Janitorial Services",
        "Landscaping Design & Maintenance",
        "Mailboxes",
        "Marble/Tile",
        "Pool Installation & Maintenance",
        "Property Management",
        "Recycling",
        "Roofing",
        "Screen Installation & Repair",
        "Signs",
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
        "Acai Bowl Cafe",
        "Bar/Nightclub",
        "Concession Services (Airports, Public Parks, Venues)",
        "Fast Food (Franchise & Non-Franchise)",
        "Hispanic Groceries",
        "Kava & Kratom Bars",
        "Nutraceutical Product (Manufacturing & Wholesale Distribution)",
        "Sit-Down Restaurants (American, Mexican)",
        "Snack Food Manufacturing & Distribution",
        "Steakhouses",
        "Taquerias",
      ],
    },
    {
      category: "Professional Services",
      icon: Briefcase,
      description: "Valuations for professional service sole providers and firms.",
      items: [
        "Accounting Services (tax & bookkeeping)",
        "Architecture",
        "Aviation (Repair & Charter)",
        "Construction Consulting",
        "Financial Advisory Firms",
        "Insurance Security Product",
        "IT/Software Services (Maintenance & SAAS Creation/Subscription)",
        "Law Firms",
        "Marketing Firms (Content Creation)",
        "Moving Services (Art, Junk, & General)",
        "Pet Grooming",
        "Printing",
        "Professional Coaching",
      ],
    },
    {
      category: "Retail",
      icon: ShoppingBag,
      description: "Valuation services for various retail establishments and manufacturers.",
      items: [
        "Apparel & Accessories",
        "Arts & Antiques",
        "Car Dealership (Used & New)",
        "Crafts Store",
        "Feed Store",
        "Garden Supply Center & Nurseries",
        "Outdoor Sporting Apparel",
        "School/College Apparel",
        "Tobacco & Vape Stores",
      ],
    },
    {
      category: "Franchises",
      icon: Store,
      description: "Specialized valuation for franchise business models.",
      items: [
        "Bakery",
        "Cellular Services (T-Mobile)",
        "Childcare",
        "Dry Cleaner",
        "Health club (HotWorx)",
        "Home Health Care (Right at Home)",
        "Insurance Carriers (State Farm)",
        "Marine Towing (Sea Tow)",
        "Restaurants (Chicken, Taco Bell)",
      ],
    },
    {
      category: "Other Services",
      icon: MoreHorizontal,
      description: "Anchor has an extensive breadth of various industry expertise.",
      items: [
        "Appliance Installation & Repair",
        "Bitcoin Mining & Proprietary Investing",
        "Daycare (Non-Franchise)",
        "Fishing Charters",
        "Hair Salons",
        "Lending Intermediaries (SBA)",
        "Marine Transportation & Maintenance (Non-Franchise)",
        "Pet Boarding & Walking",
        "Sport Surface Installation (Pickle Ball)",
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
