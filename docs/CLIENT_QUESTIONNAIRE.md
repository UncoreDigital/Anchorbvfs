# Client Questionnaire (password + OTP protected)

The **Company Informational Questionnaire** from
`docs/Anchor BVFS_General Sector_Questionnaire_WITH COVID 19 Related Questions.pdf`,
delivered as a web form at **`/questionnaire`**, linked from the site footer.

Access is gated twice: a shared **access password** the firm gives to clients,
plus a **one-time code** emailed to the address the client types in. Because the
form is long, it saves drafts and can be resumed later from any device.

**Two rules govern the lifecycle:**

- **One questionnaire per email address, permanently.** The draft row is flipped
  to `submitted` in place. A client who verifies again after submitting sees
  their answers **read-only**, with a PDF copy to download — there is no way to
  edit or to start a second one.
- **Submitting ends the session.** The token is revoked server-side the moment
  a questionnaire goes in. The answers stay on screen for that visit so the
  client can download their PDF copy, but the session behind them is already
  dead — walking away from a shared computer doesn't leave the questionnaire
  open. Verifying again later shows the read-only copy and revokes that session
  too.
- **Every question must be answered to submit.** All 92 fields are required.
  Where a question doesn't apply, clients are told to write "N/A", which is more
  useful to an analyst than a blank box because it distinguishes "not
  applicable" from "not yet reached". **Drafts are exempt** — partial saves work
  exactly as before, the check only runs on submit.

---

## What was added

**Public**

| File | Purpose |
| --- | --- |
| `src/pages/ClientQuestionnaire.tsx` | The page at `/questionnaire` (`noindex`). |
| `src/components/clientForm/ClientFormGate.tsx` | Email + password step, then the 6-digit code step. |
| `src/components/clientForm/ClientFormWizard.tsx` | Sectioned form, autosave, save-draft, submit. |
| `src/components/clientForm/ClientFormCompleted.tsx` | Read-only receipt + answers + PDF copy, shown once submitted. |
| `src/components/clientForm/ClientFormShell.tsx` | Full-screen chrome for the form: slim identity bar, no site nav or footer. |
| `src/components/clientForm/ClientFormField.tsx` | Renders one question. |
| `src/components/clientForm/AutoGrowTextarea.tsx` | Answer box that grows with the text and is still manually resizable. |
| `src/components/clientForm/ClientFormTable.tsx` | Add/remove-row editor for the questionnaire's tabular questions. |
| `src/lib/clientForm/schema.ts` | **All questions live here.** Also the shared validation. |
| `src/lib/clientForm/api.ts` | Typed client for the Edge Function. |
| `src/lib/clientForm/storage.ts` | Session token + local answer backup. |
| `src/hooks/useClientFormSession.ts` | Restores / drops the access token. |
| Footer entry **"Client Questionnaire"** (with a lock icon). |

**Admin**

- `src/pages/admin/questionnaires/ManageQuestionnaires.tsx` — the
  **Questionnaires** section at **`/admin/questionnaires`**, sitting alongside
  Leads and Document Uploads in the sidebar. It has:
  - **Search** by email and a status filter (All / Submitted / Draft), plus
    sortable columns and pagination.
  - A **list** showing last activity, email, status badge and an
    "answered / total" completion count.
  - An **eye / View** button opening the full response, every answer grouped
    under its section heading, with a "show unanswered questions" toggle.
    Tabular answers keep their grid.
  - A **PDF download** button on each row *and* inside the dialog.
  - Delete.
  - Drafts appear as soon as a client saves one, so you can watch progress
    before they submit.
- `src/lib/clientForm/pdf.ts` — builds the PDF.
- New sidebar entry and dashboard stat card.

### The PDF export

Generated in the browser with jsPDF, laid out to match the firm's original
letterhead document: centred `Anchor Business Valuations & Financial Services,
LLC` block on every page, gold rule, `N | Page` footers, and sections printed as
`A. PERSONAL INFORMATION` … `J. COVID-19 RELATED QUESTIONS`. Tabular questions
are rendered as real bordered tables that break across pages correctly.

- The text is selectable and searchable — it is a real PDF, not a screenshot.
- Filename: `Questionnaire-<Company>-<date>.pdf`, falling back to the email
  local-part when the company name is blank.
- From the **list** the PDF contains answered questions only. From the
  **dialog** it follows the "show unanswered questions" toggle, so the download
  matches what you're looking at.
- jsPDF is ~416 KB, so it is **dynamically imported** — it lands in its own
  chunk and is only fetched the first time someone clicks Download.

**Backend**

- `supabase/migrations/20260815_client_form.sql` — tables, RLS, rate limiting.
- `supabase/functions/client-form/index.ts` — the entire protected API.
- `supabase/functions/client-form/schema.ts` — generated copy of the questions
  (see [Editing the questions](#editing-the-questions)).

---

## One-time setup (required before it works)

### 1. Run the migration

Open the Supabase **SQL Editor** for the project this site uses
(`VITE_SUPABASE_URL`) and run
`supabase/migrations/20260815_client_form.sql`.

### 2. Set the secrets

```bash
supabase secrets set \
  CLIENT_FORM_PASSWORD='the-password-you-give-clients' \
  CLIENT_FORM_OTP_PEPPER="$(openssl rand -hex 32)" \
  SMTP_HOST='smtp.gmail.com' \
  SMTP_PORT='465' \
  SMTP_USER='leadsinfoanchorbvfs@gmail.com' \
  SMTP_PASS='the-gmail-app-password' \
  CLIENT_FORM_NOTIFY_EMAIL='info@anchorbv.com, trisch@anchorbvfs.com' \
  CLIENT_FORM_SITE_URL='https://anchorbvfs.com'
```

| Secret | Required | Notes |
| --- | --- | --- |
| `CLIENT_FORM_PASSWORD` | yes | The single shared password. Change it any time by re-running `supabase secrets set` — no redeploy needed. |
| `CLIENT_FORM_OTP_PEPPER` | yes | Random 32-byte hex. Keys the HMAC that protects stored codes. **Changing it invalidates every code in flight** (harmless — clients just request a new one). |
| `SMTP_*` | yes | Same mailbox the existing `lead-notification` function uses. |
| `CLIENT_FORM_NOTIFY_EMAIL` | no | Where completed questionnaires are emailed. Falls back to `NOTIFICATION_EMAIL`. |
| `CLIENT_FORM_SITE_URL` | no | Used for links in emails. Defaults to `https://anchorbvfs.com`. |
| `CLIENT_FORM_ALLOWED_ORIGINS` | no | Comma-separated CORS allowlist. Defaults to `*`. |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

If `CLIENT_FORM_PASSWORD` or `CLIENT_FORM_OTP_PEPPER` is missing the function
returns a clean "not available right now" rather than failing open.

### 3. Deploy the function

```bash
supabase functions deploy client-form
```

---

## Security model

The questionnaire holds detailed financials, so none of it is reachable with the
public anon key.

- **Every table is RLS-locked.** `client_form_otps`, `client_form_sessions` and
  `client_form_rate_limits` have *no policies at all* — only the service-role
  key inside the Edge Function can touch them. `client_form_submissions` allows
  `select` and `delete` for signed-in admins so the admin panel works, and
  nothing else.
- **The password never reaches the browser.** It lives in a function secret and
  is compared with a length-independent, constant-time hash comparison.
- **Codes are peppered, not just hashed.** A bare SHA-256 of a 6-digit code is
  reversible in a fraction of a second from a table dump, so codes are stored as
  `HMAC-SHA256(email:code)` keyed with `CLIENT_FORM_OTP_PEPPER`.
- **Sessions are opaque bearer tokens.** 32 random bytes; only the SHA-256 hash
  is stored, they expire after 7 days, and they can be revoked.
- **Supabase Auth is deliberately *not* used for the gate.** The existing
  policies on `leads`, `document_submissions` and friends grant broad access to
  the `authenticated` role — minting real auth users for questionnaire clients
  would hand them the entire admin dataset.
- **The server re-validates everything.** `sanitizeValues()` drops unknown keys,
  coerces types and truncates over-long values, so a hand-rolled request can't
  write arbitrary JSON into the `data` column. Required answers are re-checked
  server-side on submit.
- The page is `noindex, nofollow`.

### Rate limits

Enforced atomically in Postgres (fixed windows, per hour):

| Action | Limit |
| --- | --- |
| Request a code, per email | 5 |
| Request a code, per IP | 15 |
| Wrong password, per IP | 10, then paused |

The password is verified **before** the per-email counter is touched. In the
other order, anyone who knew a client's address could burn that client's
five-codes-per-hour budget with junk passwords and lock them out of their own
questionnaire; password guessing is bounded per IP instead.

| Verify a code, per email / per IP | 20 / 40 |
| Wrong code, per code | 5 attempts, then the code is burned |
| Save a draft, per email | 600 |
| Submit, per email | 10 |

IPs are stored as HMACs, never in the clear. Expired codes, dead sessions and
stale counters are swept by `client_form_cleanup()`, which the function calls
opportunistically (~2% of requests); schedule it with `pg_cron` if you prefer.

---

## Edge cases handled

**Access**

- Email normalised (trimmed + lower-cased) everywhere, so `Bob@X.com` and
  `bob@x.com` are the same person and the same draft.
- Requesting a new code invalidates the previous one — only the newest works.
- 60-second resend cooldown with a live countdown; 10-minute code expiry with a
  live countdown, and an expired code offers an immediate resend instead of
  making the client wait out the cooldown.
- Five wrong guesses burns the code and forces a new one.
- Two codes verified in parallel can't share an attempt budget (compare-and-swap
  on the counter).
- If the confirmation email fails to send, the code row is deleted rather than
  leaving a live code nobody received.
- A database fault during session lookup returns 500, not 401, so the browser
  doesn't throw away a valid token over a transient blip.
- Session expiring mid-form doesn't lose answers — see below.

**Drafts and answers**

- Autosave 2.5s after typing stops, on every section change, every 60s as a
  backstop, and immediately when a dropped connection comes back.
- Answers are also mirrored to `localStorage` on every keystroke. If the tab
  crashes, the connection dies, or the session expires, the next visit offers to
  restore them ("Unsaved answers found").
- Anything typed *while* a save request is in flight stays marked unsaved rather
  than being silently dropped.
- Same email open on two devices: the second save is rejected with a conflict
  and the client chooses which version to keep, instead of one silently
  clobbering the other.
- `beforeunload` warns before closing a tab with unsaved work.
- Offline is detected: autosave pauses, a banner explains answers are held on
  the device, and the queued save fires on reconnect.
- Submitting twice is idempotent — the second one returns the first result
  rather than creating a duplicate.
- One-per-email is enforced in three layers, so a race can't slip a second one
  through: a unique index on `lower(email)`, an `ALREADY_SUBMITTED` guard in
  `prepareWrite`, and `23505` recovery on both the draft and submit insert
  paths that reports the winning row instead of erroring.
- Submitting on one device while another tab is still typing: the open tab's
  next save comes back `ALREADY_SUBMITTED` and it switches itself to the
  read-only view rather than silently failing to save.
- Resolving a two-device conflict re-reads the server copy; if that copy turns
  out to be submitted, the tab switches to read-only instead of re-arming a
  draft that can no longer be written.
- Submit flushes any pending edits first, so the submitted copy is the current
  one.
- If the notification email fails, the client is still told the submission
  succeeded (it did — it's in the database); the failure is logged.
- Blank trailing table rows are UI scaffolding and are stripped before storage.
- `localStorage` access is wrapped throughout — Safari private mode and disabled
  storage don't break the form.

**Form UX**

- The form runs **full screen**. The site header, page banner and footer are
  dropped once a client is through the gate — 92 questions is enough to hold on
  screen without navigation competing for attention, and there is nowhere else
  on the site they should be heading mid-form. Only a slim identity bar
  (logo, title, completion %, **Save & exit**) survives. The gate itself keeps
  the normal site chrome, since that page is a landing rather than a workspace.
- **Save & exit** saves first, then signs out, then returns to the home page.
  A failed save keeps the client on the form rather than pressing on — losing
  the last few answers on the way out would be the worst possible outcome.
  It is confirmed through a dialog, and the dialog stays open (with a spinner)
  until the save and sign-out have both finished.
- All 92 answers are required on submit (drafts stay partial). Submit jumps to
  the first missing one and focuses it; the review step lists the first eight
  as jump links and counts the rest.
- Every long answer is an auto-growing textarea that is *also* manually
  resizable; the two mechanisms don't fight (the box stops auto-growing once the
  client drags it).
- The verified email is pre-filled into question A.2.
- Tabular questions stack into labelled rows on mobile instead of scrolling
  sideways.
- Per-section progress counts, an overall completion meter, and a review step
  listing what's still blank.

---

## Editing the questions

All questions live in **`src/lib/clientForm/schema.ts`**. After changing it:

```bash
npm run sync:client-form-schema
supabase functions deploy client-form
```

That copies the file to `supabase/functions/client-form/schema.ts` so the server
validates against the same definition the browser renders. **The copy is
generated — don't edit it directly.**

Notes:

- `key` values are the storage keys inside `client_form_submissions.data`.
  Renaming a key orphans answers already saved under the old name. Add a new
  field instead, and bump `FORM_SCHEMA_VERSION` if the meaning of the form
  changes materially (the version is stored per submission).
- `type: "textarea"` is the resizable long-answer box; `"table"` is the
  add/remove-row grid; `"radio"`, `"text"`, `"email"` and `"tel"` are also
  available.
- `showWhen` hides a question until another one has a given answer (used for
  G.8's follow-up). Hidden questions are never required and are skipped by both
  validators.

---

## How it flows

1. Client clicks **Client Questionnaire** in the footer.
2. They enter their email and the shared access password.
3. The function verifies the password and emails a 6-digit code.
4. They enter the code; the function issues a 7-day session token and the form
   takes over the screen.
5. They fill in sections A–J, saving drafts as they go (automatically and via
   **Save draft**). **Save & exit** parks it and signs them out; verifying again
   later drops them back in where they stopped.
6. **Submit questionnaire** checks every answer is filled, marks the record
   submitted, emails the full answer set to the firm and a confirmation to the
   client.
7. The session is revoked and the client lands on a read-only receipt with their
   answers and a **Download a copy (PDF)** button. Verifying again later returns
   them straight here — and revokes that session too.
8. Staff read it under **Admin → Questionnaires**.

### Reopening a questionnaire for a client

There is deliberately no self-service way back into a submitted questionnaire.
If a client needs to correct something, either amend it from their emailed
follow-up, or delete the record in **Admin → Questionnaires** — which frees the
email address to start fresh. Deleting is permanent, so export the PDF first.

---

## Known limitation

In-app navigation (clicking a footer or header link mid-form) isn't intercepted
with a confirmation prompt — this app uses `BrowserRouter` rather than a data
router, so `useBlocker` isn't available. Nothing is lost when it happens:
autosave plus the local backup cover it, and the draft is restored on return.
Closing or reloading the tab *is* guarded by `beforeunload`.

---

## Unrelated issue worth fixing

`supabase/functions/lead-notification/index.ts` has the Gmail SMTP password
hard-coded on line 11 and committed to the repository. The new function reads
the same credentials from `Deno.env` instead. Consider rotating that app
password and switching `lead-notification` to `Deno.env.get(...)` too.
