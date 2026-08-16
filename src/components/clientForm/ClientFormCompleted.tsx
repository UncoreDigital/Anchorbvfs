import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Loader2,
  Lock,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ClientFormShell from "./ClientFormShell";
import { toast } from "sonner";
import {
  FORM_SECTIONS,
  displayValue,
  isBlank,
  isFieldVisible,
  isTableRows,
  rowHasContent,
  type FieldDef,
  type FieldValue,
  type FormValues,
} from "@/lib/clientForm/schema";
import { downloadQuestionnairePdf } from "@/lib/clientForm/pdf";
import type { SubmissionState } from "@/lib/clientForm/api";

interface Props {
  email: string;
  submission: SubmissionState;
}

const ReadOnlyAnswer = ({
  field,
  value,
}: {
  field: FieldDef;
  value: FieldValue;
}) => {
  if (field.type === "table" && isTableRows(value)) {
    const columns = field.columns || [];
    const rows = value.filter(rowHasContent);
    if (rows.length === 0) {
      return <p className="mt-1 text-slate">—</p>;
    }
    return (
      <div className="mt-2 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs font-semibold text-slate"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="border border-slate-200 px-3 py-1.5 text-navy"
                  >
                    {row[column.key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <p className="mt-1 whitespace-pre-wrap leading-relaxed text-navy">
      {displayValue(field, value)}
    </p>
  );
};

/**
 * What a client sees once their questionnaire is in: a receipt, a copy they can
 * keep, and their answers read-only. There is exactly one questionnaire per
 * email, so there is nothing here to edit or start again.
 */
const ClientFormCompleted = ({ email, submission }: Props) => {
  const [downloading, setDownloading] = useState(false);
  const values: FormValues = submission.data ?? {};

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadQuestionnairePdf({
        id: submission.id,
        email,
        status: submission.status,
        data: values,
        updated_at: submission.updatedAt,
        submitted_at: submission.submittedAt,
        schema_version: submission.schemaVersion,
      });
    } catch (error) {
      toast.error(
        "Could not build the PDF: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ClientFormShell
      action={
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            Return to website
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      }
    >
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl"
    >
      {/* Receipt */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm md:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-9 w-9 text-green-600" />
        </div>
        <h2 className="mb-3 font-display text-2xl font-bold text-navy md:text-3xl">
          Your questionnaire is with us
        </h2>
        <p className="mx-auto mb-2 max-w-lg text-slate">
          {submission.submittedAt
            ? `Received on ${new Date(submission.submittedAt).toLocaleString()}.`
            : "Received."}{" "}
          We've emailed a confirmation to {email}.
        </p>
        <p className="mx-auto mb-8 max-w-lg text-sm text-slate">
          Our analysts will review your answers and come back to you if anything
          needs clarifying. Your responses are shown below for your records.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => void handleDownload()} disabled={downloading}>
            {downloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download a copy (PDF)
          </Button>
          <Button variant="outline" asChild>
            <Link to="/upload">
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload documents
            </Link>
          </Button>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-gold" />
          You've been signed out automatically. Download your copy now if you
          want one — reopening this page will ask you to verify again.
        </p>
      </div>

      {/* Answers, read-only */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-8">
        <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Lock className="h-4 w-4 shrink-0 text-gold" />
          <p className="text-sm text-slate">
            These answers are final and can no longer be edited. If something
            needs correcting, email{" "}
            <a
              href="mailto:info@anchorbv.com"
              className="text-navy underline underline-offset-2"
            >
              info@anchorbv.com
            </a>
            .
          </p>
        </div>

        <div className="space-y-8">
          {FORM_SECTIONS.map((section) => {
            const fields = section.fields.filter((field) =>
              isFieldVisible(field, values),
            );
            if (fields.length === 0) return null;

            return (
              <section key={section.id}>
                <h3 className="mb-4 border-l-4 border-gold pl-3 font-display text-lg font-bold text-navy">
                  {section.letter}. {section.title}
                </h3>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className="rounded-lg border border-slate-100 bg-slate-50/60 p-4"
                    >
                      <p className="text-sm font-medium leading-relaxed text-slate">
                        {field.label}
                      </p>
                      {isBlank(values[field.key]) ? (
                        <p className="mt-1 text-slate">—</p>
                      ) : (
                        <ReadOnlyAnswer
                          field={field}
                          value={values[field.key] ?? null}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </motion.div>
    </ClientFormShell>
  );
};

export default ClientFormCompleted;
