import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import ContactForm from "@/components/ContactForm";

const contactInfo = [
  {
    icon: MapPin,
    number: "01",
    title: "Our Address",
    details: ["365 Fifth Avenue", "Naples, FL 34102, United States"],
  },
  {
    icon: Phone,
    number: "02",
    title: "Contact",
    details: ["(239) 919-3092", "Info@AnchorBVFS.com"],
  },
  {
    icon: Clock,
    number: "03",
    title: "Opening Hours",
    details: ["Monday - Friday: 8AM - 5PM", "Weekend: Closed"],
  },
];

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Contact Us"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 group"
              >
                {/* Large number background */}
                <span className="absolute top-4 right-6 text-8xl font-display font-bold text-slate/5 select-none">
                  {info.number}
                </span>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                    <info.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-navy mb-4">
                    {info.title}
                  </h3>
                  <div className="space-y-2">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-slate text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form and Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            {/* Contact Form */}
            <ContactForm />

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-[500px] lg:h-auto min-h-[400px] rounded-2xl overflow-hidden shadow-card"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.526279930722!2d-81.79510968496924!3d26.13884498346696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88db000f6f6f6f6f%3A0x6f6f6f6f6f6f6f6f!2s365%205th%20Ave%20S%2C%20Naples%2C%20FL%2034102%2C%20USA!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
