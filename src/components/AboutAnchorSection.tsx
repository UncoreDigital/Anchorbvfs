import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';


const AboutAnchorSection = () => {
    return (
        <section id="about" className="section-padding bg-background">
            <div className="container-wide">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-primary mb-6">
                            About Anchor
                        </h2>
                        <div className="prose prose-lg text-muted-foreground font-inter mb-8">
                            <p>
                                Anchor Business Valuations & Financial Services, LLC is a business valuation, litigation support and merger & acquisition transaction consulting firm. Anchor assists their clients through a broad capacity of services spanning from the determination of the value of a business to consultation on the financial implications and due diligence process of the sale, acquisition or investment in a company.
                            </p>
                        </div>

                        <Link to="/about">
                            <Button variant="default" size="lg" className="bg-[#D35400] hover:bg-[#A04000] text-white border-none">
                                Learn More
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Right Column: Video */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-2xl overflow-hidden shadow-elegant"
                    >
                        <video
                            className="w-full h-full object-cover"
                            controls
                            preload="metadata"
                            poster="https://anchorbvfs.com/wp-content/uploads/2023/01/about-right.jpg"
                        >
                            <source src="https://anchorbvfs.com/wp-content/uploads/2023/01/v1.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutAnchorSection;
