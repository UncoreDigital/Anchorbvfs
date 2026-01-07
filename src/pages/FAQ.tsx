import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';

const FAQ = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What type of report do I need? (i.e., Calculation Valuation Report, Summary Report, Detailed Report)',
      answer: 'The type of report needed can be determined with the assistance of a certified valuation expert and/or counsel. There are several different types of valuation reports, each of which are offered at a different price point and require varying amounts of time to complete. The 2 main types of reports that ABVFS offers include: Calculation Reports (calculation of value or calculated value) and Summary Report (conclusion of value).',
    },
    {
      question: 'When are business valuations used?',
      answer: 'Business valuations are required for many reasons such as mergers & acquisitions, divorce, estate planning, bankruptcy and financial auditing. The valuation appraiser looks at a company’s profitability, risk, location, competition, history, applicable macro/micro economics, customers, assets, services offered, among other factors to determine an entity’s value.',
    },
    {
      question: 'How to determine the selling price and value?',
      answer: 'There is no singular way to determine what a business is worth which is why the retainment of an experienced business valuation expert is imperative when trying to apply a value to an entity. A business owner may believe that their business is worth a lot more or less than the business valuation determined by the appraiser. Frequently, this is due to the fact that the business owner incorporates subjective, non-financial or emotional factors into the valuation that the potential interested party might not recognize as value.',
    },
    {
      question: 'What is the Fair Market Value Versus Fair Value?',
      answer: 'Fair market value (FMV) is the price that property would sell for on the open market. It is the price that would be agreed on between a willing buyer and a willing seller, with neither being required to act, and both having reasonable knowledge of the relevant facts. Fair Value is typically defined or imposed by a third party (e.g., by law, regulation, contract, or financial reporting standard-setting bodies) and is typically defined as the price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date.',
    },
    {
      question: 'What is a "certified" valuation analyst and “accredited” in business Valuations?',
      answer: 'The National Association of Certified Valuators and Analysts (“NACVA”) is one of the most well respected and known business valuation associations. NACVA’s CVA designation is the only valuation credential accredited by the National Commission for Certifying Agencies. The Accredited in Business Valuation (ABV®) credential is granted exclusively by the AICPA to CPAs and qualified valuation professionals who demonstrate considerable expertise in valuation.',
    },
    {
      question: 'What is a Qualified Appraiser?',
      answer: 'A qualified appraiser is an individual with verifiable education and experience in valuing the type of property for which the appraisal is performed. They must earn an appraisal designation from a generally recognized professional appraiser organization or meet minimum education and experience requirements.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBanner
        title="Frequently Asked Questions"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'FAQ' }
        ]}
      />

      {/* FAQ Section */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
              Got Questions?
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
              Find answers to common questions about our services, process, and how we can help
              you achieve your financial goals.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left bg-background hover:bg-muted/50 transition-colors"
                >
                  <span className="font-playfair font-bold text-lg text-primary pr-4">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 text-primary" />
                    ) : (
                      <Plus className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-muted-foreground font-inter leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="section-padding bg-muted">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-playfair font-bold text-primary mb-6">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground font-inter max-w-2xl mx-auto mb-8">
              Can't find the answer you're looking for? Our team is here to help.
              Reach out to us and we'll get back to you as soon as possible.
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-lg font-inter font-semibold hover:bg-accent/90 transition-colors">
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
