import { useEffect } from "react";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";

const Team = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const teamMembers = [
    {
      name: "Trisch Garthoeffner",
      role: "Founder & Managing Member",
      image: "/assets/trisch.jpg",
      bio: "20+ years of experience in business valuation and financial consulting. ABV, CVA, MAFF, EA, MAcc.",
    },
    {
      name: "Michael A. Dorman",
      role: "JD, LLM, CVA, CPA/ABV",
      image: "/assets/footer/Logo.png", // Using logo as placeholder
      bio: "Mr. Dorman is a business valuator, consultant, attorney and a certified public accountant. He concentrates his practice area in the valuation of closely held businesses and professional practices.",
    },
    {
      name: "Deborah M. Adasiak",
      role: "CVA",
      image: "/assets/footer/Logo.png",
      bio: "Deborah Adasiak is a business valuator. She holds a CVA, Certified Valuation Analyst, issued by the National Association of Certified Valuators & Analysts. She concentrates her practice area in the valuation of closely held businesses and professional practices, and has been intimately involved with these types of entities for over 20 years.",
    },
    {
      name: "Prashasti Agrawal",
      role: "Senior Financial Analyst",
      image: "/assets/footer/Logo.png", // Using logo as placeholder until headshot is provided
      bio: "Prashasti Agrawal is a Senior Financial Analyst at Anchor. She oversees employee logistics and ensures proper operations.",
    },
    {
      name: "Grayce",
      role: "Junior Analyst",
      image: "/assets/footer/Logo.png", // Using logo as placeholder
      bio: "Grayce serves as a Junior Analyst at Anchor Business Valuations & Financial Services, where she contributes to both analytical and written components of the firm’s work. In her role, she supports valuation engagements through detailed research of private and public companies, helping to develop relevant comparative data used in report preparation. She is also actively involved in the drafting and review of valuation reports, ensuring clarity, consistency, and accuracy in written deliverables. In addition to report work, Grayce contributes to thought leadership efforts at Anchor by assisting with the drafting and editing of articles on technical valuation topics, further supporting the firm’s external communications and professional presence. Grayce’s strong research and writing capabilities make her a valuable part of the team, particularly in synthesizing complex information into clear, well-supported narratives. She has worked with Anchor for approximately three years, balancing her responsibilities with her academic commitments, and continues to contribute on a part-time basis during the school year. Her familiarity with the firm’s processes and standards allows her to operate efficiently and add value across multiple aspects of engagement and content development. Grayce is currently a student at Cornell University, pursuing a Bachelor of Science in Environment and Sustainability.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Our Team"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Our Team" }]}
      />

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
              Our team consists of certified valuation experts and financial
              consulting professionals with expertise in a wide variety of
              specialties and sectors. We have nationwide expertise and
              significant court experience, often serving as neutral experts in
              marital dissolution matters. Our main objective is to serve the
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
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl mb-6 h-80 w-full flex items-center justify-center bg-secondary/10">
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

                <div className="text-center">
                  <h3 className="text-xl font-playfair font-bold text-primary mb-1">
                    {member.name}
                  </h3>
                  <span className="text-accent font-inter text-sm font-medium mb-3 block">
                    {member.role}
                  </span>
                  <p className="text-muted-foreground font-inter text-sm">
                    {member.bio}
                  </p>
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
              View Open Positions
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
