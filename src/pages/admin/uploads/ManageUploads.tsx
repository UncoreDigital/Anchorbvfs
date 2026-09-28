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
  Phone,
  Calendar,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  DownloadCloud,
  File as FileIcon,
  Paperclip,
} from "lucide-react";
import { DeleteDialog } from "@/components/DeleteDialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { zipSync } from "fflate";
import {
  UPLOAD_BUCKET,
  formatBytes,
  sanitizeFileName,
  type UploadedFile,
} from "@/lib/documentUpload";

interface Submission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  files: UploadedFile[];
  total_size: number;
}

// ZIP entries are keyed by name, so two uploads called "scan.pdf" would
// overwrite each other. Suffix repeats the way a file manager would:
// "scan.pdf", "scan (2).pdf", ... Compared case-insensitively because
// Windows treats "Scan.pdf" and "scan.pdf" as the same file on extract.
function uniqueEntryName(name: string, used: Set<string>) {
  const base = name.split(/[\\/]/).pop() || "file";
  const dot = base.lastIndexOf(".");
  const stem = dot > 0 ? base.slice(0, dot) : base;
  const ext = dot > 0 ? base.slice(dot) : "";
  let candidate = base;
  for (let n = 2; used.has(candidate.toLowerCase()); n++) {
    candidate = `${stem} (${n})${ext}`;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

const ManageUploads = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ name: "", email: "", company: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "created_at", direction: "desc" });
  const [selected, setSelected] = useState<Submission | null>(null);
  const [downloadingPath, setDownloadingPath] = useState<string | null>(null);
  const [downloadingAllId, setDownloadingAllId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["document_submissions", currentPage, filters, sortConfig],
    queryFn: async () => {
      let query = supabase
        .from("document_submissions")
        .select("*", { count: "exact" });

      if (filters.name) query = query.ilike("name", `%${filters.name}%`);
      if (filters.email) query = query.ilike("email", `%${filters.email}%`);
      if (filters.company)
        query = query.ilike("company", `%${filters.company}%`);

      query = query.order(sortConfig.key as any, {
        ascending: sortConfig.direction === "asc",
      });

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;
      return { data: (data as unknown as Submission[]) || [], count };
    },
    placeholderData: (previousData) => previousData,
  });

  const submissions = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSort = (key: string) => {
    setSortConfig((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    return (
      <ArrowUpDown
        className={`w-3 h-3 text-primary transition-transform ${
          sortConfig.direction === "asc" ? "rotate-180" : ""
        }`}
      />
    );
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const fetchFile = async (file: UploadedFile) => {
    const { data, error } = await supabase.storage
      .from(UPLOAD_BUCKET)
      .download(file.path);
    if (error) throw error;
    return data;
  };

  // Files are fetched into memory and saved from a same-origin blob URL. A
  // cross-origin storage URL ignores the anchor's `download` attribute and
  // navigates instead, so the browser may open PDFs in a tab, and each new
  // click cancels any earlier download whose response hasn't arrived yet.
  const saveBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoking straight away can abort the save in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const handleDownload = async (file: UploadedFile) => {
    try {
      setDownloadingPath(file.path);
      saveBlob(await fetchFile(file), file.name);
    } catch (error: any) {
      toast.error("Could not download file: " + error.message);
    } finally {
      setDownloadingPath(null);
    }
  };

  // Bundles every file into one ZIP. Browsers block or drop a burst of
  // separate downloads, which left most of a large submission unsaved.
  const handleDownloadAll = async (submission: Submission) => {
    const files = submission.files || [];
    if (files.length === 0) {
      toast.error("This submission has no files to download.");
      return;
    }

    setDownloadingAllId(submission.id);

    try {
      const results = await Promise.allSettled(files.map(fetchFile));
      const entries: Record<string, Uint8Array> = {};
      const usedNames = new Set<string>();
      const failed: string[] = [];

      for (const [i, result] of results.entries()) {
        const file = files[i];
        if (result.status === "rejected") {
          failed.push(file.name);
          continue;
        }
        entries[uniqueEntryName(file.name, usedNames)] = new Uint8Array(
          await result.value.arrayBuffer(),
        );
      }

      if (failed.length === files.length) {
        toast.error("Could not download the files for this submission.");
        return;
      }

      // Level 0 stores without recompressing: PDFs, Office files and images
      // are already compressed, so deflating them again only costs time.
      const zipped = zipSync(entries, { level: 0 });
      const date = format(new Date(submission.created_at), "yyyy-MM-dd");
      saveBlob(
        new Blob([zipped], { type: "application/zip" }),
        sanitizeFileName(`${submission.name}-documents-${date}.zip`),
      );

      const saved = files.length - failed.length;
      if (failed.length === 0) {
        toast.success(
          `Downloaded ${saved} file${saved === 1 ? "" : "s"} as a ZIP.`,
        );
      } else {
        toast.warning(
          `ZIP contains ${saved} of ${files.length} files. Could not fetch: ${failed.join(", ")}`,
        );
      }
    } catch (error: any) {
      toast.error("Could not create the ZIP: " + error.message);
    } finally {
      setDownloadingAllId(null);
    }
  };

  const handleDelete = async (submission: Submission) => {
    try {
      const paths = (submission.files || []).map((f) => f.path);
      if (paths.length) {
        await supabase.storage.from(UPLOAD_BUCKET).remove(paths);
      }
      const { error } = await supabase
        .from("document_submissions")
        .delete()
        .eq("id", submission.id);
      if (error) throw error;
      toast.success("Submission deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["document_submissions"] });
      setSelected(null);
    } catch (error: any) {
      toast.error("Error deleting submission: " + error.message);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-playfair font-bold text-primary">
          Document Uploads
        </h1>
        <p className="text-gray-500">
          Review and download documents submitted by clients through the secure
          upload form.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">
            Name
          </label>
          <Input
            placeholder="Search name..."
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">
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
          <label className="text-xs font-medium text-gray-500 uppercase">
            Company
          </label>
          <Input
            placeholder="Search company..."
            value={filters.company}
            onChange={(e) => handleFilterChange("company", e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center gap-1">
                  Date {getSortIcon("created_at")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1">
                  Email {getSortIcon("email")}
                </div>
              </TableHead>
              <TableHead>Files</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(
                      new Date(submission.created_at),
                      "MMM d, yyyy h:mm a",
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-primary">
                  {submission.name}
                  {submission.company && (
                    <div className="text-xs text-gray-500 font-normal mt-0.5">
                      {submission.company}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-3 h-3" />
                    {submission.email}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                    <Paperclip className="w-3 h-3" />
                    {submission.files?.length || 0} file
                    {(submission.files?.length || 0) === 1 ? "" : "s"} ·{" "}
                    {formatBytes(submission.total_size)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelected(submission)}
                    className="hover:bg-primary/10 hover:text-primary mr-2"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleDownloadAll(submission)}
                    disabled={
                      downloadingAllId === submission.id ||
                      (submission.files?.length || 0) === 0
                    }
                    title="Download every file in this submission"
                    className="hover:bg-primary/10 hover:text-primary mr-2"
                  >
                    {downloadingAllId === submission.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <DownloadCloud className="w-4 h-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Download All</span>
                  </Button>
                  <DeleteDialog
                    onDelete={() => handleDelete(submission)}
                    title="Delete Submission"
                    description="Are you sure you want to delete this submission? The uploaded files will be permanently removed. This action cannot be undone."
                  />
                </TableCell>
              </TableRow>
            ))}
            {submissions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="w-8 h-8 text-gray-300" />
                    <p>No submissions found matching your filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
              submissions
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair font-bold text-primary">
              Submission Details
            </DialogTitle>
            <DialogDescription>
              Contact details and the documents submitted by this client.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Submission Date
                  </label>
                  <p className="text-gray-900">
                    {format(new Date(selected.created_at), "PPP p")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Company
                  </label>
                  <p className="text-gray-900">{selected.company || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-gray-900 font-medium">{selected.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  {selected.phone ? (
                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center gap-2 text-gray-900 hover:text-primary mt-1"
                    >
                      <Phone className="w-3 h-3" />
                      {selected.phone}
                    </a>
                  ) : (
                    <p className="text-gray-400">-</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 text-primary hover:underline mt-1 w-fit"
                >
                  <Mail className="w-3 h-3" />
                  {selected.email}
                </a>
              </div>

              {selected.notes && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    Notes
                  </label>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selected.notes}
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label className="text-sm font-medium text-gray-500">
                    Documents ({selected.files?.length || 0} ·{" "}
                    {formatBytes(selected.total_size)})
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleDownloadAll(selected)}
                    disabled={
                      downloadingAllId === selected.id ||
                      (selected.files?.length || 0) === 0
                    }
                    title="Download every file in this submission"
                  >
                    {downloadingAllId === selected.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <DownloadCloud className="w-4 h-4" />
                    )}
                    <span className="ml-2">Download All</span>
                  </Button>
                </div>
                <ul className="space-y-2">
                  {(selected.files || []).map((file) => (
                    <li
                      key={file.path}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2"
                    >
                      <FileIcon className="w-4 h-4 text-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm text-gray-900"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatBytes(file.size)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file)}
                        disabled={downloadingPath === file.path}
                      >
                        {downloadingPath === file.path ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span className="ml-2 hidden sm:inline">Download</span>
                      </Button>
                    </li>
                  ))}
                  {(!selected.files || selected.files.length === 0) && (
                    <li className="text-sm text-gray-400">
                      No files recorded for this submission.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUploads;
