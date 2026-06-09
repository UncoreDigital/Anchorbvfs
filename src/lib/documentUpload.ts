// Shared constants & helpers for the secure client document upload feature.

export const UPLOAD_BUCKET = "client-documents";

// Per-file and per-submission size ceilings. Keep these in sync with the
// bucket's file_size_limit in supabase/migrations/20260606_document_uploads.sql.
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB per file
export const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500 MB per submission
export const MAX_FILES = 25;

// Allowed formats: PDF, Excel, Word, and scanned images (JPG/PNG).
export const ALLOWED_EXTENSIONS = [
  "pdf",
  "xls",
  "xlsx",
  "doc",
  "docx",
  "jpg",
  "jpeg",
  "png",
] as const;

// Value for the file input's `accept` attribute.
export const ACCEPT_ATTR = ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",");

// Human-readable list shown in the UI.
export const ALLOWED_FORMATS_LABEL = "PDF, Excel, Word, JPG, PNG";

export interface UploadedFile {
  name: string;
  path: string;
  size: number;
  type: string;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function getExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

// Validate by extension — browsers don't reliably report a MIME type for
// Office formats (.docx/.xlsx), so the extension is the dependable signal.
export function isAllowedFile(file: File): boolean {
  return (ALLOWED_EXTENSIONS as readonly string[]).includes(
    getExtension(file.name),
  );
}

// Make a storage-safe object name: strip directories, replace anything that
// isn't a letter/number/dot/dash/underscore with a dash.
export function sanitizeFileName(fileName: string): string {
  const base = fileName.split(/[\\/]/).pop() || "file";
  return base.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}
