import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please agree to the terms to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          consent: formData.consent,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We will get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        consent: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, consent: checked }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100"
    >
      <h2 className="text-3xl md:text-4xl font-display font-bold text-navy mb-2">
        Send us a Message
      </h2>
      <p className="text-slate mb-8">
        We'd love to hear from you. Fill out the form below and we'll be in
        touch.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Input
              name="name"
              placeholder="Name *"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-14 bg-white border-slate/20 focus:border-gold focus:ring-gold/20"
            />
          </div>
          <div>
            <Input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="h-14 bg-white border-slate/20 focus:border-gold focus:ring-gold/20"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-14 bg-white border-slate/20 focus:border-gold focus:ring-gold/20"
            />
          </div>
          <div>
            <Input
              name="subject"
              placeholder="Subject *"
              value={formData.subject}
              onChange={handleChange}
              required
              className="h-14 bg-white border-slate/20 focus:border-gold focus:ring-gold/20"
            />
          </div>
        </div>
        <Textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="bg-white border-slate/20 focus:border-gold focus:ring-gold/20 resize-none"
        />

        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent"
            checked={formData.consent}
            onCheckedChange={handleCheckboxChange}
            className="mt-1"
          />
          <label
            htmlFor="consent"
            className="text-sm text-muted-foreground leading-tight cursor-pointer"
          >
            I agree to receive informational and promotional email communication
            from Anchor Business Valuations & Financial Services, LLC.
          </label>
        </div>

        <Button
          type="submit"
          className="btn-cta w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
