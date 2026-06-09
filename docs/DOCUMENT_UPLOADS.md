# Secure Client Document Upload

Lets clients upload engagement documents (financial statements, tax returns,
corporate docs, scanned PDFs/images) through a simple link on the site. Files
land in a **private** Supabase Storage bucket and are reviewed/downloaded from
the admin panel. No Dropbox account or shared links required.

## What was added

**Public**

- `src/pages/Upload.tsx` — the client-facing page at **`/upload`**.
- `src/components/DocumentUploadForm.tsx` — multi-file drag-and-drop form that
  captures Full Name, Email, Phone, Company, Notes + the files.
- `src/lib/documentUpload.ts` — shared limits, allowed formats, helpers.
- Nav entry **"Upload Documents"** in the header + footer.

**Admin**

- `src/pages/admin/uploads/ManageUploads.tsx` — list of submissions at
  **`/admin/uploads`**, with a detail dialog to download each file (via
  short-lived signed URLs) or delete a submission (files + record).
- New sidebar entry + dashboard stat card.

**Backend**

- `supabase/migrations/20260606_document_uploads.sql` — bucket, table, RLS.

## One-time setup (required before it works)

1. Open the Supabase **SQL Editor** for the project this site uses
   (`VITE_SUPABASE_URL`) and run
   `supabase/migrations/20260606_document_uploads.sql`. This creates the
   `client-documents` bucket, the `document_submissions` table, and the
   row-level-security policies (public can submit; only signed-in admins can
   read/delete).

2. **File size limit.** The bucket is configured for up to **500 MB per file**,
   but a bucket can't exceed the project's *global* upload limit. On the **free
   plan that global cap is 50 MB** — clients sending larger scanned PDFs will be
   rejected. To allow the full 500 MB, raise the global limit under
   **Dashboard → Storage → Settings** (requires the Pro plan).

   The front-end caps are in `src/lib/documentUpload.ts`
   (`MAX_FILE_SIZE`, `MAX_TOTAL_SIZE`, `MAX_FILES`) — keep them in sync with
   whatever the project allows.

## Security model

- Bucket is **private**. Public visitors can only `INSERT` (upload); they can't
  list or read anything back.
- Admin downloads use `createSignedUrl` (60-second links), so files are never
  exposed on a public URL.
- The submission folder name is a random UUID generated per upload, so paths
  aren't guessable.

## How it flows

1. Client fills the form at `/upload`, drops files, agrees to the consent box.
2. A UUID is generated; each file uploads to `client-documents/<uuid>/<file>`.
3. A `document_submissions` row is inserted with the contact details and a JSON
   manifest of the uploaded files.
4. Admin sees it under **Admin → Document Uploads**, downloads or deletes.
