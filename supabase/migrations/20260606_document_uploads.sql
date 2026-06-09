-- ============================================================================
-- Secure Client Document Upload feature
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- for the project this site points at (VITE_SUPABASE_URL).
--
-- It creates:
--   1. A PRIVATE storage bucket `client-documents` (files are NOT publicly
--      readable; the admin downloads them via short-lived signed URLs).
--   2. A `document_submissions` table holding the client's contact details
--      plus a JSON manifest of the files they uploaded.
--   3. RLS policies so the public can SUBMIT (insert + upload) but only
--      authenticated admins can READ / DELETE.
-- ============================================================================

-- 1. Storage bucket -----------------------------------------------------------
-- 500 MB per-file ceiling. NOTE: a bucket's file_size_limit cannot exceed the
-- project's global upload limit (Dashboard > Storage > Settings). On the free
-- plan that global limit is 50 MB; raise it there (Pro plan) if clients need
-- to send larger scanned PDFs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-documents',
  'client-documents',
  false,
  524288000, -- 500 MB
  array[
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Allow anyone (anonymous site visitors) to upload INTO this bucket only.
drop policy if exists "Public can upload client documents" on storage.objects;
create policy "Public can upload client documents"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'client-documents');

-- Only signed-in admins can read the uploaded files.
drop policy if exists "Authenticated can read client documents" on storage.objects;
create policy "Authenticated can read client documents"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'client-documents');

-- Only signed-in admins can delete uploaded files.
drop policy if exists "Authenticated can delete client documents" on storage.objects;
create policy "Authenticated can delete client documents"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'client-documents');

-- 2. Submissions table --------------------------------------------------------
create table if not exists public.document_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text,
  company     text,
  notes       text,
  -- [{ "name": "...", "path": "...", "size": 123, "type": "..." }, ...]
  files       jsonb not null default '[]'::jsonb,
  total_size  bigint not null default 0
);

-- 3. Table RLS ----------------------------------------------------------------
alter table public.document_submissions enable row level security;

-- The public submits a record (the folder id is generated client-side and the
-- files are uploaded to the bucket above before this insert).
drop policy if exists "Public can create submissions" on public.document_submissions;
create policy "Public can create submissions"
  on public.document_submissions for insert
  to anon, authenticated
  with check (true);

-- Only signed-in admins can list submissions.
drop policy if exists "Authenticated can view submissions" on public.document_submissions;
create policy "Authenticated can view submissions"
  on public.document_submissions for select
  to authenticated
  using (true);

-- Only signed-in admins can delete submissions.
drop policy if exists "Authenticated can delete submissions" on public.document_submissions;
create policy "Authenticated can delete submissions"
  on public.document_submissions for delete
  to authenticated
  using (true);

create index if not exists document_submissions_created_at_idx
  on public.document_submissions (created_at desc);
