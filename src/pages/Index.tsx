import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MarqueeSection from "@/components/MarqueeSection";
import ServicesSection from "@/components/ServicesSection";
import AboutAnchorSection from "@/components/AboutAnchorSection";
import StatsSection from "@/components/StatsSection";
import WhyUsSection from "@/components/WhyUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";

import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import FounderSection from "@/components/FounderSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />
      <HeroSection />
      <MarqueeSection />
      <ServicesSection />
      <StatsSection />
      <WhyUsSection />
      <FounderSection />
      <AboutAnchorSection />
      <TestimonialsSection />

      {/* Contact Form Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">
                Get In Touch
              </h2>
              <p className="text-muted-foreground font-inter">
                Ready to discuss your valuation needs? Fill out the form below.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
