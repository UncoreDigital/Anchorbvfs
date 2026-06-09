import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  File as FileIcon,
  X,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import {
  UPLOAD_BUCKET,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  MAX_FILES,
  ACCEPT_ATTR,
  ALLOWED_FORMATS_LABEL,
  formatBytes,
  isAllowedFile,
  sanitizeFileName,
  type UploadedFile,
} from "@/lib/documentUpload";

const initialDetails = {
  name: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

const DocumentUploadForm = () => {
  const [details, setDetails] = useState(initialDetails);
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  const handleDetailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = (incoming: FileList | File[]) => {
    const candidates = Array.from(incoming);
    const accepted: File[] = [];
    const rejected: string[] = [];

    let runningTotal = totalSize;

    for (const file of candidates) {
      // Skip duplicates (same name + size already selected).
      const isDuplicate = files.some(
        (f) => f.name === file.name && f.size === file.size,
      );
      if (isDuplicate) continue;

      if (!isAllowedFile(file)) {
        rejected.push(`${file.name} (unsupported format)`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name} (over ${formatBytes(MAX_FILE_SIZE)})`);
        continue;
      }
      if (files.length + accepted.length >= MAX_FILES) {
        rejected.push(`${file.name} (max ${MAX_FILES} files)`);
        continue;
      }
      if (runningTotal + file.size > MAX_TOTAL_SIZE) {
        rejected.push(`${file.name} (total over ${formatBytes(MAX_TOTAL_SIZE)})`);
        continue;
      }

      accepted.push(file);
      runningTotal += file.size;
    }

    if (accepted.length) {
      setFiles((prev) => [...prev, ...accepted]);
    }
    if (rejected.length) {
      toast.error(
        `Couldn't add ${rejected.length} file${rejected.length > 1 ? "s" : ""}`,
        { description: rejected.join(", ") },
      );
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    // Reset so selecting the same file again re-triggers onChange.
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setDetails(initialDetails);
    setFiles([]);
    setConsent(false);
    setProgress(0);
    setIsDone(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please add at least one document to upload.");
      return;
    }
    if (!consent) {
      toast.error("Please confirm the consent checkbox to proceed.");
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    const submissionId = crypto.randomUUID();
    const uploaded: UploadedFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `${submissionId}/${i}-${sanitizeFileName(file.name)}`;

        const { error: uploadError } = await supabase.storage
          .from(UPLOAD_BUCKET)
          .upload(path, file, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        uploaded.push({
          name: file.name,
          path,
          size: file.size,
          type: file.type,
        });
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const { error: insertError } = await supabase
        .from("document_submissions")
        .insert({
          id: submissionId,
          name: details.name,
          email: details.email,
          phone: details.phone || null,
          company: details.company || null,
          notes: details.notes || null,
          files: uploaded as unknown as Json,
          total_size: totalSize,
        });

      if (insertError) throw insertError;

      setIsDone(true);
      toast.success("Documents uploaded successfully.");
    } catch (error: any) {
      // Best-effort cleanup of any files uploaded before the failure.
      if (uploaded.length) {
        await supabase.storage
          .from(UPLOAD_BUCKET)
          .remove(uploaded.map((f) => f.path));
      }
      console.error("Error uploading documents:", error);
      toast.error("Upload failed", {
        description:
          error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-navy mb-3">
          Thank you — your documents were received
        </h2>
        <p className="text-slate mb-8 max-w-md mx-auto">
          Your files have been securely uploaded and our team has been notified.
          We'll reach out if anything further is needed.
        </p>
        <Button className="btn-cta" onClick={resetForm}>
          Upload more documents
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100"
    >
      <h2 className="text-2xl md:text-3xl font-display font-bold text-navy mb-2">
        Upload Your Documents
      </h2>
      <p className="text-slate mb-6 flex items-center gap-2 text-sm">
        <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
        Your files are transmitted over a secure connection and are only
        accessible to our team.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            name="name"
            placeholder="Full Name *"
            value={details.name}
            onChange={handleDetailChange}
            required
            disabled={isSubmitting}
            className="h-14 bg-white border-slate/20 focus:border-gold focus:ring-gold/20"
          />
          <Input
            name="email"
            type="email"
            placeholder="Email Address *"
            value={details.email}
            onChange={handleDetailChange}
            required
            disabled={isSubmitting}
            className="h-14 bg-white border-slate/20 focus:border-gold focus:ring-gold/20"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            name="phone"
            type="tel"
            placeholder="Phone Number *"
            value={details.phone}
            onChange={handleDetailChange}
            required
            disabled={isSubmitting}
            className="h-14 bg-white border-slate/20 focus:border-gold focus:ring-gold/20"
          />
          <Input
            name="company"
            placeholder="Company Name"
            value={details.company}
            onChange={handleDetailChange}
            disabled={isSubmitting}
            className="h-14 bg-white border-slate/20 focus:border-gold focus:ring-gold/20"
          />
        </div>
        <Textarea
          name="notes"
          placeholder="Notes — briefly describe the purpose of this submission or any special instructions"
          value={details.notes}
          onChange={handleDetailChange}
          rows={4}
          disabled={isSubmitting}
          className="bg-white border-slate/20 focus:border-gold focus:ring-gold/20 resize-none"
        />

        {/* Dropzone */}
        <div
          onClick={() => !isSubmitting && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!isSubmitting) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => !isSubmitting && handleDrop(e)}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            isSubmitting
              ? "cursor-not-allowed opacity-60 border-slate/20"
              : "cursor-pointer"
          } ${
            isDragging
              ? "border-gold bg-gold/5"
              : "border-slate/25 hover:border-gold/60 hover:bg-slate-50"
          }`}
        >
          <UploadCloud className="w-10 h-10 text-gold mb-3" />
          <p className="text-navy font-medium">
            <span className="text-gold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate mt-2">
            {ALLOWED_FORMATS_LABEL} · up to {formatBytes(MAX_FILE_SIZE)} per file
            · max {MAX_FILES} files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPT_ATTR}
            className="hidden"
            onChange={handleFileInput}
            disabled={isSubmitting}
          />
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate">
              <span className="font-medium text-navy">
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </span>
              <span>{formatBytes(totalSize)} total</span>
            </div>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <FileIcon className="w-4 h-4 text-gold shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-navy" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-slate">{formatBytes(file.size)}</p>
                  </div>
                  {!isSubmitting && (
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-slate hover:text-red-500 transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {isSubmitting && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-slate text-center">
              Uploading… {progress}%
            </p>
          </div>
        )}

        <div className="flex items-start space-x-3">
          <Checkbox
            id="upload-consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            disabled={isSubmitting}
            className="mt-1"
          />
          <label
            htmlFor="upload-consent"
            className="text-sm text-muted-foreground leading-tight cursor-pointer"
          >
            I confirm I am authorized to share these documents and consent to
            Anchor Business Valuations & Financial Services, LLC securely storing
            them for the purpose of my engagement.
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
            <UploadCloud className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? "Uploading…" : "Submit Documents"}
        </Button>
      </form>
    </motion.div>
  );
};

export default DocumentUploadForm;
