import { useEffect } from "react";
import { motion } from "framer-motion";
import { Laptop, Map, Landmark, Scale, DollarSign, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";

const Team = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const staffTimeline = [
    {
      icon: Laptop,
      text: "We have certified valuation experts and financial consulting professionals with expertise in a wide variety of specialties and sectors.",
    },
    {
      icon: Map,
      text: "Experts have nationwide & international expertise.",
    },
    {
      icon: Landmark,
      text: "Experts with court experience, with a preference to work with both parties (neutral expert) whenever possible.",
    },
    {
      icon: Scale,
      text: "Collaboratively trained to work as neutral expert with both parties.",
    },
    {
      icon: DollarSign,
      text: "Our main objective is to serve the client in the most hands-on, cost-effective, personalized manner.",
    },
  ];

  const teamMembers = [
    {
      name: "Trisch Garthoeffner",
      role: "Founder & Managing Member",
      image: "/assets/trisch.jpg",
      bio: "20+ years of experience in business valuation and financial consulting. ABV, CVA, MAFF, EA, MAcc.",
      pdf: "/assets/bios/Trisch Garthoeffner_BIO_2026.pdf",
    },
    {
      name: "Michael A. Dorman",
      role: "JD, LLM, CVA, CPA/ABV",
      image: "/assets/footer/Logo.png", // Using logo as placeholder
      bio: "Michael Dorman is a business valuator, consultant, attorney and a certified public accountant. He concentrates his practice area in the valuation of closely held businesses and professional practices.",
      pdf: "/assets/bios/Professional Qualifications of Michael A Dorman.pdf",
    },
    {
      name: "Prashasti Agrawal",
      role: "Senior Financial Analyst",
      image: "/assets/headhsot.jpg",
      bio: "Prashasti is integral to the financial analysis and research application for the initial stages of modeling. Her diverse background and level of expertise in valuation modeling is a key value driver for Anchor's clients.",
      pdf: "/assets/bios/Professional Qualifications of Prashasti Agrawal.pdf",
    },
    {
      name: "Deborah M. Adasiak",
      role: "CVA",
      image: "/assets/footer/Logo.png",
      bio: "Deborah Adasiak is a business valuator. She holds a CVA, Certified Valuation Analyst, issued by the National Association of Certified Valuators & Analysts. She concentrates on the valuation of closely held businesses and professional practices, and has been intimately involved with these types of entities for 20+ years.",
      pdf: "/assets/bios/Deborah Bio 2026.pdf",
    },
    {
      name: "Grayce Garthoeffner",
      role: "Junior Analyst",
      image: "/assets/Grayce%20Garthoeffner_Headshot_2026.png", // Using logo as placeholder
      bio: "Grayce is a Junior Analyst who supports valuation engagements through detailed research and comparative data analysis. She ensures the clarity and accuracy of valuation reports and contributes to the firm's thought leadership. She has worked with Anchor for three years and is currently pursuing a Bachelor of Science in Environment and Sustainability at Cornell University.",
      pdf: "/assets/bios/Grayce 2026 Bio for ABVFS Website.pdf",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Meet the Team"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Meet the Team" }]}
      />

      {/* Staff Capabilities Section */}
      <section className="section-padding bg-background pb-8 overflow-hidden">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
              Our Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary">
              Staff Capabilities
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 -translate-x-1/2 hidden md:block" />

            {/* Timeline Items */}
            <div className="space-y-12 md:space-y-24">
              {staffTimeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-0 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                >
                  {/* Content Side (Text) */}
                  <div
                    className={`w-full md:w-1/2 flex ${index % 2 === 0
                      ? "md:justify-start md:pl-16"
                      : "md:justify-end md:pr-16"
                      }`}
                  >
                    <div
                      className={`text-center ${index % 2 === 0 ? "md:text-left" : "md:text-right"
                        }`}
                    >
                      <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary z-10 hidden md:block" />

                  {/* Icon Side */}
                  <div
                    className={`w-full md:w-1/2 flex justify-center ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                      }`}
                  >
                    <div className="w-32 h-32 rounded-full border border-border bg-background flex items-center justify-center shadow-lg relative z-10 group hover:border-accent hover:shadow-elegant transition-all duration-500">
                      <item.icon className="w-12 h-12 text-primary group-hover:text-accent transition-colors duration-500 stroke-[1.5]" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
              Meet Our Experts
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
              Professional Team Members
            </h2>
            <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
              Our team consists of certified valuation experts and financial analysis
              consulting professionals with expertise in a wide variety of
              specialties and sectors. With nationwide and international experience in all services offered, including, buy/sell-side transactional representation and analysis. Combined with our many years in litigation, Anchor is a one-stop practice for all direct and indirect valuation engagements. Main objective is to serve the
              client in the most hands-on, cost-effective, personalized manner.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col h-full"
              >
                <div className="relative overflow-hidden shrink-0 rounded-xl mb-6 h-80 w-full flex items-center justify-center bg-secondary/10">
                  <img
                    src={member.image}
                    alt={member.name}
                    className={
                      member.image.includes("Logo.png")
                        ? "w-80 h-auto object-contain"
                        : "absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    }
                  />
                  {!member.image.includes("Logo.png") && (
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </div>

                <div className="text-center flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-xl font-playfair font-bold text-primary mb-1">
                      {member.name}
                    </h3>
                    <span className="text-accent font-inter text-sm font-medium mb-3 block">
                      {member.role}
                    </span>
                    <p className="text-muted-foreground font-inter text-sm mb-6">
                      {member.bio}
                    </p>
                  </div>
                  <a
                    href={member.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-primary hover:text-accent font-inter font-semibold transition-colors mt-auto pt-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span>View PDF Bio</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="section-padding bg-primary">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary-foreground mb-6">
              Join Our Growing Team
            </h2>
            <p className="text-primary-foreground/80 font-inter max-w-2xl mx-auto mb-8">
              We're always looking for talented individuals to join our team. If
              you're passionate about finance and want to make a difference,
              we'd love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-lg font-inter font-semibold hover:bg-accent/90 transition-colors"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
