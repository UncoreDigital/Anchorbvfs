import { motion } from 'framer-motion';

const MarqueeSection = () => {
    const images = [
        "/assets/MarqueeSection/mq1.png",
        "/assets/MarqueeSection/mq2.png",
        "/assets/MarqueeSection/mq3.png",
        "/assets/MarqueeSection/mq4.png",
    ];

    return (
        <div className="bg-white py-10 overflow-hidden border-y border-gray-100 z-20 relative">
            <div className="flex overflow-hidden group">
                <motion.div
                    className="flex gap-12 md:gap-36 whitespace-nowrap items-center"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear",
                    }}
                >
                    {/* Duplicate the content multiple times to ensure smooth scrolling */}
                    {[...images, ...images, ...images, ...images].map((src, index) => (
                        <div key={index} className="flex-shrink-0">
                            <img
                                src={src}
                                alt={`Partner ${index}`}
                                className="h-24 w-auto object-contain"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default MarqueeSection;
