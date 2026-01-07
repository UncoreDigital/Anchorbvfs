
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import FounderSection from '@/components/FounderSection';

const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);





  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Meet The Owner"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Meet The Owner' }
        ]}
      />

      <FounderSection />

      <Footer />
    </div>
  );
};

export default About;
