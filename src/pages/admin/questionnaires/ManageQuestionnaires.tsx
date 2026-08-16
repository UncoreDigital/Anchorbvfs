import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Mail,
  Calendar,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  CheckCircle2,
  PencilLine,
  Download,
} from "lucide-react";
import { DeleteDialog } from "@/components/DeleteDialog";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  FORM_SECTIONS,
  displayValue,
  isBlank,
  isFieldVisible,
  isTableRows,
  rowHasContent,
  sectionStats,
  type FieldDef,
  type FieldValue,
  type FormValues,
} from "@/lib/clientForm/schema";
import { downloadQuestionnairePdf } from "@/lib/clientForm/pdf";

interface Questionnaire {
  id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  email: string;
  status: "draft" | "submitted";
  data: FormValues;
  schema_version: number;
}

/** Tabular answers keep their shape; everything else is plain text. */
const AnswerView = ({
  field,
  value,
}: {
  field: FieldDef;
  value: FieldValue;
}) => {
  if (field.type === "table" && isTableRows(value)) {
    const columns = field.columns || [];
    const rows = value.filter(rowHasContent);
    return (
      <div className="mt-1 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border border-gray-200 bg-gray-50 px-3 py-1.5 text-left text-xs font-medium text-gray-500"
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
                    className="border border-gray-200 px-3 py-1.5 text-gray-900"
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
    <p className="mt-1 whitespace-pre-wrap leading-relaxed text-gray-900">
      {displayValue(field, value)}
    </p>
  );
};

type SortKey = "updated_at" | "created_at" | "submitted_at" | "email" | "status";

const ManageQuestionnaires = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ email: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({ key: "updated_at", direction: "desc" });
  const [selected, setSelected] = useState<Questionnaire | null>(null);
  const [showBlanks, setShowBlanks] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const itemsPerPage = 10;

  // `includeBlanks` mirrors whatever the dialog is showing, so the PDF matches
  // what the reviewer is looking at. From the list it defaults to answers only.
  const handleDownload = async (
    row: Questionnaire,
    includeBlanks: boolean,
  ) => {
    try {
      setDownloadingId(row.id);
      await downloadQuestionnairePdf(row, { includeBlanks });
    } catch (error) {
      toast.error(
        "Could not build the PDF: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["client_form_submissions", currentPage, filters, sortConfig],
    queryFn: async () => {
      let query = supabase
        .from("client_form_submissions")
        .select("*", { count: "exact" });

      if (filters.email) query = query.ilike("email", `%${filters.email}%`);
      if (filters.status) query = query.eq("status", filters.status);

      query = query.order(sortConfig.key, {
        ascending: sortConfig.direction === "asc",
      });

      const from = (currentPage - 1) * itemsPerPage;
      query = query.range(from, from + itemsPerPage - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { data: (data as unknown as Questionnaire[]) || [], count };
    },
    placeholderData: (previousData) => previousData,
  });

  const rows = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSort = (key: SortKey) => {
    setSortConfig((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" },
    );
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    return (
      <ArrowUpDown
        className={`h-3 w-3 text-primary transition-transform ${
          sortConfig.direction === "asc" ? "rotate-180" : ""
        }`}
      />
    );
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDelete = async (row: Questionnaire) => {
    try {
      const { error } = await supabase
        .from("client_form_submissions")
        .delete()
        .eq("id", row.id);
      if (error) throw error;
      toast.success("Questionnaire deleted");
      queryClient.invalidateQueries({ queryKey: ["client_form_submissions"] });
      setSelected(null);
    } catch (error) {
      toast.error(
        "Error deleting questionnaire: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  };

  if (isLoading && !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const values = selected?.data ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-playfair text-3xl font-bold text-primary">
          Questionnaires
        </h1>
        <p className="text-gray-500">
          Company Informational Questionnaires submitted through the protected
          client form. Drafts appear here as soon as a client saves one.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase text-gray-500">
            Email
          </label>
          <Input
            placeholder="Search email..."
            value={filters.email}
            onChange={(e) => handleFilterChange("email", e.target.value)}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase text-gray-500">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All</option>
            <option value="submitted">Submitted</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none transition-colors hover:bg-gray-50"
                onClick={() => handleSort("updated_at")}
              >
                <div className="flex items-center gap-1">
                  Last activity {getSortIcon("updated_at")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none transition-colors hover:bg-gray-50"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1">
                  Email {getSortIcon("email")}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const answered = FORM_SECTIONS.reduce(
                (sum, section) =>
                  sum + sectionStats(section, row.data ?? {}).answered,
                0,
              );
              const total = FORM_SECTIONS.reduce(
                (sum, section) =>
                  sum + sectionStats(section, row.data ?? {}).total,
                0,
              );
              return (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(row.updated_at), "MMM d, yyyy h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-primary">
                      <Mail className="h-3 w-3" />
                      {row.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.status === "submitted" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        <PencilLine className="h-3 w-3" />
                        Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {answered}/{total} answered
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelected(row)}
                      className="mr-1 hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleDownload(row, false)}
                      disabled={downloadingId === row.id}
                      title="Download the answered form as a PDF"
                      className="mr-1 hover:bg-primary/10 hover:text-primary"
                    >
                      {downloadingId === row.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">PDF</span>
                    </Button>
                    <DeleteDialog
                      onDelete={() => handleDelete(row)}
                      title="Delete Questionnaire"
                      description="Are you sure you want to delete this questionnaire? All answers will be permanently removed. This action cannot be undone."
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="h-8 w-8 text-gray-300" />
                    <p>No questionnaires found matching your filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl font-bold text-primary">
              Company Informational Questionnaire
            </DialogTitle>
            <DialogDescription>
              {selected?.email} ·{" "}
              {selected?.status === "submitted" && selected.submitted_at
                ? `Submitted ${format(new Date(selected.submitted_at), "PPP p")}`
                : `Draft, last updated ${
                    selected ? format(new Date(selected.updated_at), "PPP p") : ""
                  }`}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-8 py-2">
              <div className="sticky top-0 z-10 -mx-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-white px-6 pb-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showBlanks}
                    onChange={(e) => setShowBlanks(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Show unanswered questions
                </label>
                <Button
                  size="sm"
                  onClick={() => void handleDownload(selected, showBlanks)}
                  disabled={downloadingId === selected.id}
                >
                  {downloadingId === selected.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Download PDF
                </Button>
              </div>

              {FORM_SECTIONS.map((section) => {
                const fields = section.fields
                  .filter((field) => isFieldVisible(field, values))
                  .filter(
                    (field) => showBlanks || !isBlank(values[field.key]),
                  );
                if (fields.length === 0) return null;

                return (
                  <div key={section.id}>
                    <h3 className="mb-3 border-l-4 border-primary pl-3 font-playfair text-lg font-bold text-primary">
                      {section.letter}. {section.title}
                    </h3>
                    <div className="space-y-4">
                      {fields.map((field) => (
                        <div
                          key={field.key}
                          className="rounded-lg border border-gray-100 bg-gray-50/60 p-4"
                        >
                          <p className="text-sm font-medium leading-relaxed text-gray-500">
                            {field.label}
                          </p>
                          <AnswerView
                            field={field}
                            value={values[field.key] ?? null}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
                <FileText className="h-3 w-3" />
                Schema version {selected.schema_version} · Record {selected.id}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageQuestionnaires;
