import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MarqueeSection from '@/components/MarqueeSection';
import ServicesSection from '@/components/ServicesSection';
import AboutAnchorSection from '@/components/AboutAnchorSection';
import StatsSection from '@/components/StatsSection';
import WhyUsSection from '@/components/WhyUsSection';
import TestimonialsSection from '@/components/TestimonialsSection';

import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import FounderSection from '@/components/FounderSection';


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
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
