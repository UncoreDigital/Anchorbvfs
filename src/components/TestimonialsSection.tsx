import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Kimberly Philbin',
    role: 'Founder, Vision 360 Capital Partners',
    content: 'Trisch Garthoeffner is highly knowledgeable and is first to come to mind when I have a client needing business valuation, M&A, or selling consultation services.',
    rating: 5,
    image: 'KP',
  },
  {
    id: 2,
    name: 'Tom Cavanagh',
    role: 'VP, Shareholder, BCC Advisers',
    content: 'Trisch has been an invaluable resource for questions surrounding business valuations and financial modeling. With her continuous professionalism and attention to detail, she is someone I have trusted since we began working together 5+ years ago.',
    rating: 5,
    image: 'TC',
  },
  {
    id: 3,
    name: 'David North',
    role: 'President, Garage Doors by Roy North',
    content: 'Our company has engaged Anchor Business Valuations for 5+ consecutive years to complete a valuation of our company. The price was reasonable, and the turnaround time was excellent. I highly recommend hiring Trisch Garthoeffner and her associates!',
    rating: 5,
    image: 'DN',
  },
  {
    id: 4,
    name: 'Anonymous',
    role: 'Divorce Client, Spring 2024',
    content: 'I really enjoyed working with Trisch and was very impressed with her knowledge, quality of work, and customer service. I will definitely keep Anchor in mind for future needs of myself or friends.',
    rating: 5,
    image: 'AN',
  },
  {
    id: 5,
    name: 'Leathem Stearn',
    role: 'Founder',
    content: 'I have worked extensively with Ms. Garthoeffner and found her to be competent, comprehensive, punctual and insightful in her work. I have and will continue to work with her.',
    rating: 5,
    image: 'LS',
  },
  {
    id: 6,
    name: 'Paul Bosley',
    role: 'President/Founder, Business Finance Depot',
    content: 'Trisch Garthoeffner knows Valuation. Period, full stop.',
    rating: 5,
    image: 'PB',
  },
  {
    id: 7,
    name: 'Larry Amon',
    role: 'President, TAB of SW Florida',
    content: 'Trisch is a high energy, driven to succeed, personality that helps business owners determine the value of their companies.',
    rating: 5,
    image: 'LA',
  },
  {
    id: 8,
    name: 'C. Zachary Meyers',
    role: 'President, C. Zachary Meyers, PLLC',
    content: 'Thanks for completing the valuation. With a lot of considerations, I know this was a complicated and time-consuming review. You did great with what we gave you. I am glad we used your company. Will look forward to use anchor business valuations in the future.',
    rating: 5,
    image: 'ZM',
  },
  {
    id: 9,
    name: 'Dr. William Mills',
    role: 'Founder, Marshall Medical Center',
    content: 'Trisch was instrumental in the sale of our family’s medical practice all the way from valuation to closing. We could not have done it without her. Her professionalism, knowledge, and positive attitude made the process very easy for us. I highly recommend working with Trisch.',
    rating: 5,
    image: 'WM',
  },
  {
    id: 10,
    name: 'Business & Asset Protection Attorney',
    role: 'Spring 2024',
    content: 'Thanks for all of your hard work, Trisch. We could not have done without you.',
    rating: 5,
    image: 'BA',
  }
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section-padding bg-background overflow-hidden">
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
              Testimonials
            </span>
            <div className="h-px w-12 bg-gold" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
          >
            What Our Clients Say
          </motion.h2>
        </div>

        {/* Testimonials Slider */}
        <div ref={ref} className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Quote Icon */}
            <div className="absolute -top-8 left-8 z-10">
              <Quote className="w-16 h-16 text-gold/20" />
            </div>

            {/* Card */}
            <div className="bg-muted rounded-3xl p-8 md:p-12 relative">
              <div className="relative z-10">
                {/* Content */}
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="font-inter text-lg md:text-xl text-foreground leading-relaxed mb-8">
                    "{testimonials[currentIndex].content}"
                  </p>

                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-primary font-semibold">
                      {testimonials[currentIndex].image}
                    </div>

                    <div>
                      <h4 className="font-playfair text-lg font-semibold text-primary">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-slate text-sm">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="ml-auto flex gap-1">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-gold hover:border-gold hover:text-primary transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-gold' : 'bg-border'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-gold hover:border-gold hover:text-primary transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
