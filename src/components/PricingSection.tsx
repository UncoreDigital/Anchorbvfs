import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Starter',
    price: '299',
    description: 'Perfect for individuals starting their financial journey.',
    features: [
      'Personal Financial Assessment',
      'Basic Investment Portfolio',
      'Monthly Consultation Call',
      'Email Support',
      'Quarterly Reports',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '599',
    description: 'Ideal for professionals seeking comprehensive planning.',
    features: [
      'Everything in Starter',
      'Advanced Portfolio Management',
      'Weekly Strategy Sessions',
      'Priority Support',
      'Tax Optimization',
      'Retirement Planning',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '999',
    description: 'Tailored solutions for businesses and high-net-worth individuals.',
    features: [
      'Everything in Professional',
      'Dedicated Account Manager',
      'Custom Investment Strategies',
      '24/7 Premium Support',
      'Estate Planning',
      'International Investments',
    ],
    popular: false,
  },
];

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold font-inter text-sm font-medium tracking-widest uppercase">
              Pricing Plans
            </span>
            <div className="h-px w-12 bg-gold" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
          >
            Choose Your Plan
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate font-inter"
          >
            Flexible pricing options to match your financial needs and goals.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div ref={ref} className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-primary text-primary-foreground shadow-elegant-lg scale-105'
                  : 'bg-muted'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gold text-primary text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`font-playfair text-2xl font-semibold mb-2 ${
                  plan.popular ? 'text-primary-foreground' : 'text-primary'
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${
                  plan.popular ? 'text-primary-foreground/70' : 'text-slate'
                }`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-sm ${plan.popular ? 'text-primary-foreground/70' : 'text-slate'}`}>$</span>
                  <span className={`font-playfair text-5xl font-bold ${
                    plan.popular ? 'text-gold' : 'text-primary'
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-primary-foreground/70' : 'text-slate'}`}>/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.popular ? 'bg-gold/20' : 'bg-gold/10'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-gold' : 'text-gold'}`} />
                    </div>
                    <span className={`text-sm ${
                      plan.popular ? 'text-primary-foreground/80' : 'text-foreground'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'gold' : 'outline'}
                size="lg"
                className="w-full"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
