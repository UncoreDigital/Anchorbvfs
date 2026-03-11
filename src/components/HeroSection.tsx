import PdfLeadFormModal from "./PdfLeadFormModal";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "/assets/home/hero01.png",
    subtitle: "Business Valuation Experts",
    title:
      "Certified Business Valuation Services and Merger & Acquisition Consulting",
    mobileClassName:
      "object-cover object-[70%_center] md:object-[80%_center] lg:object-[85%_center]",
  },
  {
    image: "/assets/irs-testimony-final.png",
    subtitle: "IRS Testimony",
    title:
      "Trisch Garthoeffner at the Podium - IRS Department of Treasury Testimony",
    imageClassName: "object-cover object-center",
    mobileClassName: "object-right",
    downloadAsset: {
      label: "IRS Testimony",
      filename: "IRS_Dept_of_Treasury_Testimony_03062025.docx",
      path: "/assets/irs-testimony-wording.docx",
    },
  },
  {
    image: "/assets/anchor-ma-logo.png",
    subtitle: "Press Release",
    title: "Vilas Partners Acquisition of Creative Tile Concepts",
    imageClassName:
      "object-contain object-right p-12 md:pr-24 lg:pr-32 bg-white",
    mobileClassName: "object-right",
    downloadAsset: {
      label: "Press Release",
      filename: "Creative-Tile-Concepts-Acquisition-Press-Release.pdf",
      path: "/assets/creative-tile-press-release.pdf",
    },
  },
  {
    image: "/assets/home/hero-owner-v2.png",
    subtitle: "Industry Leadership",
    title:
      "Trisch Garthoeffner Nominated as Chairman of the NACVA Standards Board",
    mobileClassName:
      "object-cover object-[65%_15%] md:object-[75%_20%] lg:object-[80%_20%]",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{
    label: string;
    filename: string;
    path: string;
  } | null>(null);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleDownloadClick = (asset: {
    label: string;
    filename: string;
    path: string;
  }) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-105px)] md:min-h-[calc(100vh-190px)] lg:min-h-[calc(100vh-200px)] flex items-center overflow-hidden mt-[105px] md:mt-[190px] lg:mt-[200px]"
    >
      <PdfLeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedAsset={selectedAsset}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={slides[currentSlide].image}
            alt="Slide background"
            className={cn(
              "w-full h-full transition-transform duration-700",
              (slides[currentSlide] as any).imageClassName || "object-cover",
              slides[currentSlide].mobileClassName,
            )}
          />
          {/* Enhanced overlay for better text readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/50 md:via-primary/60 md:to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container-wide relative z-10 py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 md:w-12 bg-gold" />
                <span className="text-gold font-inter text-xs md:text-sm font-medium tracking-widest uppercase">
                  {slides[currentSlide].subtitle}
                </span>
              </div>

              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground leading-tight mb-8 drop-shadow-sm break-words max-w-full">
                {slides[currentSlide].title}
              </h2>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-4">
                <Button
                  variant="gold"
                  className="h-auto py-3 px-6 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg hover:shadow-gold/20 transition-all"
                  onClick={() =>
                    handleDownloadClick({
                      label: "Domestic Standards",
                      filename: "BV-Standards-Comparison-Chart-Domestic.pdf",
                      path: "/assets/BV-Standards-Comparison-Chart-Domestic.pdf",
                    })
                  }
                >
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-[10px] opacity-80 mb-0.5">
                      BV Standards (Domestic)
                    </span>
                    <span>FREE DOWNLOAD</span>
                  </div>
                </Button>

                <Button
                  variant="gold"
                  className="h-auto py-3 px-6 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg hover:shadow-gold/20 transition-all"
                  onClick={() =>
                    handleDownloadClick({
                      label: "International Standards",
                      filename:
                        "BV-Standards-Comparison-Chart-International.pdf",
                      path: "/assets/BV-Standards-Comparison-Chart-International.pdf",
                    })
                  }
                >
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-[10px] opacity-80 mb-0.5">
                      BV Standards (Intl)
                    </span>
                    <span>FREE DOWNLOAD</span>
                  </div>
                </Button>

                {slides[currentSlide].downloadAsset && (
                  <Button
                    variant="gold"
                    className="h-auto py-3 px-6 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg hover:shadow-gold/20 transition-all"
                    onClick={() =>
                      handleDownloadClick(slides[currentSlide].downloadAsset)
                    }
                  >
                    <div className="flex flex-col items-center leading-tight">
                      <span className="text-[10px] opacity-80 mb-0.5">
                        {slides[currentSlide].downloadAsset.label}
                      </span>
                      <span>FREE DOWNLOAD</span>
                    </div>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Slide Controls */}
          <div className="hidden lg:flex lg:col-span-4 flex-col items-end justify-center space-y-6">
            <div className="flex gap-4">
              <button
                onClick={prevSlide}
                className="p-2 border border-white/20 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 border border-white/20 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        {/* Dots Navigation */}
        <div className="flex items-center gap-3 mb-4">
          {slides.map((slide, index) => (
            <button
              key={`${slide.subtitle}-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-3 h-3 bg-gold scale-125"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <span className="text-primary-foreground/60 text-sm font-inter tracking-wider">
          scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
