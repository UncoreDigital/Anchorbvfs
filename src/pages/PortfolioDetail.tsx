import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Calendar, User, Tag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import { Button } from '@/components/ui/button';

const projects = [
  {
    id: '1',
    title: 'Global Bank Restructuring',
    category: 'finance',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
    description: 'Complete financial restructuring for a multinational banking corporation.',
    client: 'Global Banking Corp',
    date: 'January 2024',
    duration: '8 months',
    challenge: 'The client faced significant operational inefficiencies and regulatory compliance issues that were impacting profitability and growth potential.',
    solution: 'We implemented a comprehensive restructuring plan that included operational streamlining, regulatory compliance frameworks, and strategic realignment of business units.',
    results: ['35% improvement in operational efficiency', 'Full regulatory compliance achieved', '$50M annual cost savings', 'Improved credit rating by 2 levels'],
  },
  {
    id: '2',
    title: 'Tech Startup IPO',
    category: 'investment',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    description: 'Successfully managed IPO process for leading tech startup.',
    client: 'TechVenture Inc.',
    date: 'March 2024',
    duration: '12 months',
    challenge: 'Preparing a high-growth tech startup for public markets while maintaining operational momentum and investor confidence.',
    solution: 'End-to-end IPO management including financial audits, regulatory filings, investor roadshows, and pricing strategy optimization.',
    results: ['Successful IPO raising $200M', 'Stock price up 40% on first day', 'Oversubscribed by 3x', 'Strong institutional investor interest'],
  },
  {
    id: '3',
    title: 'Healthcare M&A Advisory',
    category: 'consulting',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop',
    description: 'Merger and acquisition advisory for healthcare sector.',
    client: 'HealthCare Partners',
    date: 'February 2024',
    duration: '6 months',
    challenge: 'Identifying suitable acquisition targets and navigating complex healthcare regulations during the M&A process.',
    solution: 'Comprehensive due diligence, valuation analysis, and deal structuring that maximized synergies while ensuring regulatory compliance.',
    results: ['Successful acquisition of 3 clinics', '25% market share increase', 'Seamless integration completed', '$30M in synergy benefits'],
  },
];

const PortfolioDetail = () => {
  const { id } = useParams();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const project = projects.find(p => p.id === id) || projects[0];
  const currentIndex = projects.findIndex(p => p.id === id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner 
        title={project.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Portfolio', href: '/portfolio' },
          { label: project.title }
        ]} 
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-96 object-cover rounded-xl mb-8"
                />

                <h2 className="text-3xl font-playfair font-bold text-primary mb-4">The Challenge</h2>
                <p className="text-muted-foreground font-inter leading-relaxed mb-8">
                  {project.challenge}
                </p>

                <h2 className="text-3xl font-playfair font-bold text-primary mb-4">Our Solution</h2>
                <p className="text-muted-foreground font-inter leading-relaxed mb-8">
                  {project.solution}
                </p>

                <h2 className="text-3xl font-playfair font-bold text-primary mb-4">Results Achieved</h2>
                <div className="space-y-3 mb-8">
                  {project.results.map((result, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="font-inter text-foreground">{result}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-8 border-t border-border">
                {prevProject ? (
                  <Link to={`/portfolio/${prevProject.id}`} className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-inter">Previous Project</span>
                  </Link>
                ) : <div />}
                {nextProject && (
                  <Link to={`/portfolio/${nextProject.id}`} className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
                    <span className="font-inter">Next Project</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-muted p-8 rounded-xl sticky top-32">
                <h3 className="text-xl font-playfair font-bold text-primary mb-6">Project Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-accent" />
                    <div>
                      <span className="text-muted-foreground text-sm font-inter block">Client</span>
                      <span className="font-inter text-foreground">{project.client}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-accent" />
                    <div>
                      <span className="text-muted-foreground text-sm font-inter block">Date</span>
                      <span className="font-inter text-foreground">{project.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-accent" />
                    <div>
                      <span className="text-muted-foreground text-sm font-inter block">Category</span>
                      <span className="font-inter text-foreground capitalize">{project.category}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link to="/contact">
                    <Button variant="cta" className="w-full">
                      Start Your Project
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PortfolioDetail;
