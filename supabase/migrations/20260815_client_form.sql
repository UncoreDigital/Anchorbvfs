-- ============================================================================
-- Password + OTP protected Client Questionnaire
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query) for
-- the project this site points at (VITE_SUPABASE_URL).
--
-- Security model, in one line: NONE of these tables are reachable with the
-- public anon key. Every read and write goes through the `client-form` Edge
-- Function using the service-role key, which bypasses RLS. The only exception
-- is the submissions table, which signed-in admins may read and delete so the
-- admin panel can list responses.
--
-- Deliberately NOT using Supabase Auth for the questionnaire gate: the existing
-- policies on `leads`, `document_submissions` and friends grant broad access to
-- the `authenticated` role, so minting real auth users for questionnaire
-- clients would hand them the entire admin dataset.
-- ============================================================================

-- 1. Submissions (drafts and final) -------------------------------------------
create table if not exists public.client_form_submissions (
  id             uuid primary key default gen_random_uuid(),
  email          text not null,
  status         text not null default 'draft'
                   check (status in ('draft', 'submitted')),
  -- Answers keyed by FieldDef.key from src/lib/clientForm/schema.ts.
  data           jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  submitted_at   timestamptz,
  last_ip_hash   text
);

-- ONE questionnaire per email, for good. The draft row is flipped to
-- 'submitted' in place, so a returning client sees their submitted answers
-- read-only rather than starting a second one.
--
-- If you are re-running this over an earlier version of the migration that had
-- a `where status = 'draft'` predicate, drop the old index first:
--   drop index if exists client_form_submissions_one_draft_per_email;
create unique index if not exists client_form_submissions_one_per_email
  on public.client_form_submissions (lower(email));

create index if not exists client_form_submissions_created_at_idx
  on public.client_form_submissions (created_at desc);

create index if not exists client_form_submissions_status_idx
  on public.client_form_submissions (status);

-- Lookups query `email = $1` with an already-normalised (lower-cased) address,
-- so the lookup index is on the plain column; the unique index above stays on
-- lower(email) as a belt-and-braces guard against a mixed-case row.
create index if not exists client_form_submissions_email_idx
  on public.client_form_submissions (email);

-- Keep updated_at honest — the optimistic-concurrency check compares against it.
create or replace function public.client_form_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists client_form_submissions_touch on public.client_form_submissions;
create trigger client_form_submissions_touch
  before update on public.client_form_submissions
  for each row execute function public.client_form_touch_updated_at();

-- 2. One-time passcodes -------------------------------------------------------
create table if not exists public.client_form_otps (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  -- HMAC-SHA256(email:code) keyed with CLIENT_FORM_OTP_PEPPER. Peppered rather
  -- than plain-hashed because a bare SHA-256 of a 6-digit code is trivially
  -- reversible from a table dump.
  code_hash   text not null,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  consumed_at timestamptz,
  attempts    integer not null default 0,
  ip_hash     text
);

create index if not exists client_form_otps_lookup_idx
  on public.client_form_otps (email, created_at desc);

create index if not exists client_form_otps_expiry_idx
  on public.client_form_otps (expires_at);

-- 3. Sessions -----------------------------------------------------------------
create table if not exists public.client_form_sessions (
  id           uuid primary key default gen_random_uuid(),
  -- SHA-256 of the opaque bearer token. The token itself is never stored.
  token_hash   text not null unique,
  email        text not null,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null,
  last_seen_at timestamptz not null default now(),
  revoked_at   timestamptz,
  ip_hash      text,
  user_agent   text
);

create index if not exists client_form_sessions_email_idx
  on public.client_form_sessions (email);

create index if not exists client_form_sessions_expiry_idx
  on public.client_form_sessions (expires_at);

-- 4. Fixed-window rate limiting ------------------------------------------------
create table if not exists public.client_form_rate_limits (
  key          text not null,
  window_start timestamptz not null,
  count        integer not null default 0,
  primary key (key, window_start)
);

create index if not exists client_form_rate_limits_window_idx
  on public.client_form_rate_limits (window_start);

-- Atomically bump a counter and report whether the caller is still under the
-- limit. Doing this in SQL (rather than read-then-write from the function)
-- keeps concurrent requests from slipping past the cap.
create or replace function public.client_form_rate_limit(
  p_key            text,
  p_limit          integer,
  p_window_seconds integer
)
returns table (allowed boolean, remaining integer, retry_after integer)
language plpgsql
as $$
declare
  v_window_start timestamptz;
  v_count        integer;
begin
  v_window_start := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into public.client_form_rate_limits as rl (key, window_start, count)
  values (p_key, v_window_start, 1)
  on conflict (key, window_start)
    do update set count = rl.count + 1
  returning rl.count into v_count;

  allowed     := v_count <= p_limit;
  remaining   := greatest(p_limit - v_count, 0);
  retry_after := greatest(
    ceil(extract(epoch from (
      v_window_start + make_interval(secs => p_window_seconds) - now()
    )))::integer,
    1
  );
  return next;
end;
$$;

-- 5. Housekeeping --------------------------------------------------------------
-- Expired passcodes, dead sessions and stale counters are pure noise. The Edge
-- Function calls this opportunistically; schedule it with pg_cron if preferred.
create or replace function public.client_form_cleanup()
returns void
language sql
as $$
  delete from public.client_form_otps
    where expires_at < now() - interval '1 day';
  delete from public.client_form_sessions
    where expires_at < now() - interval '7 days';
  delete from public.client_form_rate_limits
    where window_start < now() - interval '1 day';
$$;

-- 6. Row level security --------------------------------------------------------
alter table public.client_form_submissions  enable row level security;
alter table public.client_form_otps         enable row level security;
alter table public.client_form_sessions     enable row level security;
alter table public.client_form_rate_limits  enable row level security;

-- Passcodes, sessions and counters have NO policies at all, so no API role can
-- touch them. Only the service-role key (which bypasses RLS) can.

-- Signed-in admins read submissions in the admin panel.
drop policy if exists "Authenticated can view client form submissions"
  on public.client_form_submissions;
create policy "Authenticated can view client form submissions"
  on public.client_form_submissions for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can delete client form submissions"
  on public.client_form_submissions;
create policy "Authenticated can delete client form submissions"
  on public.client_form_submissions for delete
  to authenticated
  using (true);

-- Note there is no insert/update policy for anon or authenticated: clients
-- write exclusively through the Edge Function.

-- 7. Lock down the helper functions --------------------------------------------
-- Postgres grants EXECUTE to PUBLIC by default; these must not be callable
-- with the anon key.
revoke all on function public.client_form_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.client_form_rate_limit(text, integer, integer)
  to service_role;

revoke all on function public.client_form_cleanup() from public, anon, authenticated;
grant execute on function public.client_form_cleanup() to service_role;

revoke all on function public.client_form_touch_updated_at()
  from public, anon, authenticated;
