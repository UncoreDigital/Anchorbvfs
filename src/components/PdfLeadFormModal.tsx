import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PdfLeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAsset: {
    label: string;
    filename: string;
    path: string;
  } | null;
}

const PdfLeadFormModal = ({
  isOpen,
  onClose,
  selectedAsset,
}: PdfLeadFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const { toast } = useToast();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("pdf_downloads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        downloaded_asset: selectedAsset.filename,
      });

      if (error) throw error;

      // Trigger download
      const link = document.createElement("a");
      link.href = selectedAsset.path;
      link.download = selectedAsset.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Your download has started.",
      });

      // Reset & Close
      setFormData({ name: "", email: "", phone: "", company: "" });
      onClose();
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center isolate">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm mx-4 bg-card border border-border p-6 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
              Download Standards
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Please fill in your details to download the{" "}
              <span className="font-medium text-primary">
                {selectedAsset?.label}
              </span>
              .
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#D35400] hover:bg-[#A04000] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Download PDF"
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PdfLeadFormModal;
