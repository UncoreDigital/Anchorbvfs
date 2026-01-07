import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const aboutImage = '/assets/owner.jpg';

const FounderSection = () => {
  const credentials = [
    'Accredited Business Valuator (ABV) through AICPA',
    'Certified Valuation Analyst (CVA) through NACVA',
    'Master Analyst in Financial Forensics (MAFF) through NACVA',
    'IRS Representative (Enrolled Agent/EA)',
    'Court Certified Expert Witness',
    'Master’s in Accounting (MAcc)',
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={aboutImage}
                alt="Trisch Garthoeffner"
                className="w-full h-[450px] lg:h-[600px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>

            {/* Experience Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 right-4 lg:-right-6 bg-accent text-primary px-8 py-6 rounded-xl shadow-gold"
            >
              <div className="text-4xl font-playfair font-bold">20+</div>
              <div className="text-sm font-inter">Years Experience</div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
              Meet The Founder
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2">
              Trisch Garthoeffner
            </h2>
            <p className="text-lg text-gold font-playfair mb-6">
              ABV, CVA, MAFF, EA, MAcc
            </p>

            <div className="prose prose-slate mb-8 text-muted-foreground font-inter leading-relaxed">
              <p className="mb-4">
                Trisch is the founder and managing member of Anchor Business Valuations & Financial Services, LLC (ABVFS). With over 20 years of experience, she provides premier business valuation and financial consulting services.
              </p>
              <p className="mb-4">
                Her background includes 10 years on Wall Street in investment banking and private equity, giving her deep insight into M&A consulting. She previously held FINRA Series 7, 62, 63, and 72 licenses.
              </p>
              <p>
                Trisch is highly active in the valuation community, serving as Chair of the NACVA Standards Board (2022) and receiving the Outstanding Membership Award (2023). She is also an avid speaker and author on valuation topics.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {credentials.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="font-inter text-sm text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button variant="default" size="lg">
                  Contact Trisch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" size="lg">
                  Speaking Events
                  <BookOpen className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
