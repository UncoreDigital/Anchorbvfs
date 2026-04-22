import { motion } from "framer-motion";

const MarqueeSection = () => {
  const items = [
    { src: "/assets/MarqueeSection/mq1.png" },
    { src: "/assets/MarqueeSection/mq2.png" },
    { src: "/assets/MarqueeSection/mq3.png" },
    { src: "/assets/MarqueeSection/mq4.png" },
    { src: "/assets/MarqueeSection/ea-logo.jpeg" }
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
          {[...items, ...items, ...items, ...items].map((item, index) => (
            <div key={`${item.src}-${index}`} className="flex-shrink-0">
              {item.href ? (
                <a href={item.href} target={item.target} download={item.download} rel={item.target === "_blank" ? "noopener noreferrer" : undefined}>
                  <img
                    src={item.src}
                    alt={`Partner ${index}`}
                    className="h-24 w-auto object-contain cursor-pointer"
                  />
                </a>
              ) : (
                <img
                  src={item.src}
                  alt={`Partner ${index}`}
                  className="h-24 w-auto object-contain"
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarqueeSection;
