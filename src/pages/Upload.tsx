import { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileCheck2, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { MetaTags } from "@/components/MetaTags";
import DocumentUploadForm from "@/components/DocumentUploadForm";

const assurances = [
  {
    icon: Lock,
    title: "Private & Secure",
    description:
      "Files are transmitted over an encrypted connection and stored privately — never on a public link.",
  },
  {
    icon: FileCheck2,
    title: "Multiple Documents",
    description:
      "Send your full package at once — financial statements, tax returns, corporate documents and more.",
  },
  {
    icon: Clock,
    title: "No Account Needed",
    description:
      "No Dropbox login or shared-folder invitation. Just fill in your details and upload.",
  },
];

const Upload = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Secure Document Upload | Anchor Business Valuations"
        description="Securely upload your business valuation documents — financial statements, tax returns and corporate records — directly to Anchor Business Valuations & Financial Services."
        url="https://anchorbvfs.com/upload"
      />
      <Header />
      <PageBanner
        title="Secure Document Upload"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Document Upload" },
        ]}
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gold/10 text-gold rounded-full px-4 py-2 text-sm font-medium mb-5"
            >
              <ShieldCheck className="w-4 h-4" />
              Secure Client Portal
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy mb-4">
              Send Us Your Engagement Documents
            </h2>
            <p className="text-slate text-lg">
              Use the form below to securely share the documents needed for your
              valuation engagement. There's no account to create and no shared
              folder to manage — simply add your details, attach your files, and
              submit.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {assurances.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card border border-slate-100"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-lg font-display font-bold text-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <DocumentUploadForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Upload;
