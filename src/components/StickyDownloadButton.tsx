import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PdfLeadFormModal from "./PdfLeadFormModal";

const StickyDownloadButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSdk, setSelectedSdk] = useState<{
    label: string;
    filename: string;
    path: string;
  } | null>(null);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Hide on admin routes
      if (location.pathname.startsWith("/admin")) {
        setIsVisible(false);
        return;
      }

      // If we are on the home page ('/'), show only if scrolled past hero
      if (location.pathname === "/") {
        if (window.scrollY > window.innerHeight * 0.8) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          setIsOptionsOpen(false);
          setIsFormOpen(false);
        }
      } else {
        // On other pages, always show
        setIsVisible(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleDownloadClick = (sdk: {
    label: string;
    filename: string;
    path: string;
  }) => {
    setSelectedSdk(sdk);
    setIsOptionsOpen(false);
    setIsFormOpen(true);
  };

  return (
    <>
      <PdfLeadFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        selectedAsset={selectedSdk}
      />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
          >
            {/* Download Options */}
            <AnimatePresence>
              {isOptionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="bg-card border border-border p-4 rounded-xl shadow-xl flex flex-col gap-3 min-w-[200px] mb-2"
                >
                  <p className="text-sm font-semibold text-foreground">
                    Download Standards
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 h-auto py-2"
                    onClick={() =>
                      handleDownloadClick({
                        label: "Domestic Standards",
                        filename: "BV-Standards-Comparison-Chart-Domestic.pdf",
                        path: "/assets/BV-Standards-Comparison-Chart-Domestic.pdf",
                      })
                    }
                  >
                    <FileText className="w-4 h-4 text-gold shrink-0 mt-1" />
                    <div className="flex flex-col items-start text-xs text-left">
                      <span>BV Standards Comparison Chart</span>
                      <span>(Domestic) FREE DOWNLOAD</span>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 h-auto py-2"
                    onClick={() =>
                      handleDownloadClick({
                        label: "International Standards",
                        filename:
                          "BV-Standards-Comparison-Chart-International.pdf",
                        path: "/assets/BV-Standards-Comparison-Chart-International.pdf",
                      })
                    }
                  >
                    <FileText className="w-4 h-4 text-gold shrink-0 mt-1" />
                    <div className="flex flex-col items-start text-xs text-left">
                      <span>BV Standards Comparison Chart</span>
                      <span>(International) FREE DOWNLOAD</span>
                    </div>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trigger Button */}
            {!isFormOpen && (
              <Button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                variant="gold"
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                {isOptionsOpen ? (
                  <X className="w-5 h-5 text-primary" />
                ) : (
                  <Download className="w-5 h-5 text-primary" />
                )}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StickyDownloadButton;
