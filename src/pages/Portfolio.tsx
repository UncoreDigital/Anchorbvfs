import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';

const Portfolio = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['all', 'finance', 'investment', 'consulting', 'strategy'];

  const projects = [
    {
      id: 1,
      title: 'Global Bank Restructuring',
      category: 'finance',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      description: 'Complete financial restructuring for a multinational banking corporation.',
    },
    {
      id: 2,
      title: 'Tech Startup IPO',
      category: 'investment',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      description: 'Successfully managed IPO process for leading tech startup.',
    },
    {
      id: 3,
      title: 'Healthcare M&A Advisory',
      category: 'consulting',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
      description: 'Merger and acquisition advisory for healthcare sector.',
    },
    {
      id: 4,
      title: 'Retail Chain Expansion',
      category: 'strategy',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      description: 'Strategic planning for nationwide retail expansion.',
    },
    {
      id: 5,
      title: 'Real Estate Portfolio',
      category: 'investment',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
      description: 'Investment management for $500M real estate portfolio.',
    },
    {
      id: 6,
      title: 'Manufacturing Optimization',
      category: 'consulting',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
      description: 'Financial optimization for manufacturing operations.',
    },
    {
      id: 7,
      title: 'Energy Sector Investment',
      category: 'finance',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop',
      description: 'Capital raising for renewable energy projects.',
    },
    {
      id: 8,
      title: 'Digital Transformation',
      category: 'strategy',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      description: 'Financial strategy for digital transformation initiative.',
    },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner 
        title="Our Portfolio" 
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Portfolio' }
        ]} 
      />

      {/* Portfolio Section */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
              Our Work
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
              Featured Projects
            </h2>
            <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
              Explore our portfolio of successful projects and see how we've helped 
              businesses achieve their financial goals.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-lg font-inter font-medium capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-accent text-primary'
                    : 'bg-muted text-foreground hover:bg-accent/20'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/portfolio/${project.id}`}>
                    <div className="relative overflow-hidden rounded-xl">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-accent font-inter text-sm uppercase tracking-wider mb-2 block">
                          {project.category}
                        </span>
                        <h3 className="text-xl font-playfair font-bold text-primary-foreground mb-2">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 text-accent">
                          <span className="font-inter text-sm">View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
