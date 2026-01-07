import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';

const Testimonials = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const testimonials = [
    {
      name: 'Robert Johnson',
      role: 'CEO, Tech Solutions Inc.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      text: 'Finxpert transformed our financial operations completely. Their strategic advice helped us increase profitability by 40% within the first year. Highly recommended for any growing business.',
    },
    {
      name: 'Sarah Williams',
      role: 'Founder, Green Energy Co.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 5,
      text: 'The team at Finxpert provided exceptional wealth management services. Their personalized approach and deep expertise made all the difference in securing my financial future.',
    },
    {
      name: 'Michael Chen',
      role: 'CFO, Global Logistics',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      rating: 5,
      text: 'Working with Finxpert on our corporate restructuring was a game-changer. Their attention to detail and innovative solutions exceeded our expectations.',
    },
    {
      name: 'Emily Davis',
      role: 'Director, Healthcare Plus',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
      rating: 5,
      text: 'The tax consulting services from Finxpert saved our company significant amounts. Their proactive approach to tax planning is truly remarkable.',
    },
    {
      name: 'James Anderson',
      role: 'Owner, Anderson & Sons',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      rating: 5,
      text: 'As a family business, we needed advisors who understood our unique challenges. Finxpert delivered beyond our expectations with their comprehensive financial planning.',
    },
    {
      name: 'Lisa Thompson',
      role: 'VP Finance, Retail Corp',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      rating: 5,
      text: 'The investment banking team at Finxpert helped us navigate a complex merger successfully. Their expertise and guidance were invaluable throughout the process.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Client Testimonials"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Testimonials' }
        ]}
      />

      {/* Testimonials Grid */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
              Client Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our valued clients have to say about
              their experience working with Finxpert.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted p-8 rounded-xl relative"
              >
                <Quote className="w-12 h-12 text-accent/20 absolute top-6 right-6" />

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>

                <p className="text-foreground font-inter leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-playfair font-bold text-primary">{testimonial.name}</h4>
                    <span className="text-muted-foreground font-inter text-sm">{testimonial.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary">
        <div className="container-wide">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '98%', label: 'Client Satisfaction' },
              { number: '500+', label: 'Happy Clients' },
              { number: '4.9', label: 'Average Rating' },
              { number: '100%', label: 'Success Rate' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-5xl font-playfair font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-primary-foreground/80 font-inter">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
