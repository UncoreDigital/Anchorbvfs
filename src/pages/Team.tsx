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
      name: "Rakshit Verma",
      role: "Senior Financial Analyst",
      image: "/assets/rakshit.jpg",
      bio: "Rakshit Verma, ASA, ABV, specializes in business valuation and investment banking with nearly a decade of experience, primarily in the technology and healthcare sectors. He performs valuation and consulting services for various entities including acquisition accounting, goodwill impairment, and stock-based compensation.",
    },
    {
      name: "Prashasti Agrawal",
      role: "Senior Financial Analyst",
      image: "/assets/logo.png", // Using logo as placeholder until headshot is provided
      bio: "Prashasti Agrawal is a Senior Financial Analyst at Anchor. She oversees employee logistics and ensures proper operations.",
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
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
