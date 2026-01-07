import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Laptop, Map, Landmark, Scale, DollarSign
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';

const Staff = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const staffTimeline = [
        {
            icon: Laptop,
            text: "We have certified valuation experts and financial consulting professionals with expertise in a wide variety of specialties and sectors."
        },
        {
            icon: Map,
            text: "Our experts have nationwide expertise."
        },
        {
            icon: Landmark,
            text: "Experts with court experience, with a preference to work with both parties (neutral expert) whenever possible."
        },
        {
            icon: Scale,
            text: "Collaboratively trained to work as neutral expert with both parties in marital dissolution matters (settle outside of litigation)."
        },
        {
            icon: DollarSign,
            text: "Our main objective is to serve the client in the most hands-on, cost-effective, personalized manner."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <PageBanner
                title="Our Staff"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Staff' }
                ]}
            />

            {/* Staff Section - Timeline Layout */}
            <section className="section-padding bg-background overflow-hidden">
                <div className="container-wide">
                    <div className="text-center mb-16">
                        <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
                            Our Expertise
                        </span>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary">
                            Staff Capabilities
                        </h2>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        {/* Center Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 -translate-x-1/2 hidden md:block" />

                        {/* Timeline Items */}
                        <div className="space-y-12 md:space-y-24">
                            {staffTimeline.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                        }`}
                                >
                                    {/* Content Side (Text) */}
                                    <div className={`w-full md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-start md:pl-16' : 'md:justify-end md:pr-16'}`}>
                                        <div className={`text-center ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                            <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Center Dot */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary z-10 hidden md:block" />

                                    {/* Icon Side */}
                                    <div className={`w-full md:w-1/2 flex justify-center ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                                        <div className="w-32 h-32 rounded-full border border-border bg-background flex items-center justify-center shadow-lg relative z-10 group hover:border-accent hover:shadow-elegant transition-all duration-500">
                                            <item.icon className="w-12 h-12 text-primary group-hover:text-accent transition-colors duration-500 stroke-[1.5]" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Staff;
