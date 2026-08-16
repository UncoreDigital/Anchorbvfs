// ============================================================================
// client-form — the only way in or out of the Client Questionnaire.
// ----------------------------------------------------------------------------
// The browser holds nothing but an opaque session token. The shared password,
// the passcodes, the SMTP credentials and the service-role key all live here.
//
// Actions (POST { action, ... }):
//   request-otp  { email, password }                -> emails a 6-digit code
//   verify-otp   { email, code }                    -> { token, draft, ... }
//   session      { token }                          -> { draft, lastSubmission }
//   save-draft   { token, data, expectedUpdatedAt } -> { updatedAt }
//   submit       { token, data, expectedUpdatedAt } -> { id, submittedAt }
//   sign-out     { token }                          -> { ok }
//   health       { password }                       -> { healthy, checks }
//
// Deploy:
//   supabase functions deploy client-form
// Secrets (see docs/CLIENT_FORM.md):
//   supabase secrets set CLIENT_FORM_PASSWORD=... CLIENT_FORM_OTP_PEPPER=... \
//     SMTP_HOST=... SMTP_PORT=465 SMTP_USER=... SMTP_PASS=... \
//     CLIENT_FORM_NOTIFY_EMAIL=...
// ============================================================================

import { createClient } from "npm:@supabase/supabase-js@2.89.0";
import nodemailer from "npm:nodemailer@6.9.7";
import {
  FORM_SCHEMA_VERSION,
  FORM_SECTIONS,
  displayValue,
  isBlank,
  isFieldVisible,
  isTableRows,
  rowHasContent,
  sanitizeValues,
  validateAll,
  type FieldDef,
  type FieldValue,
  type FormValues,
} from "./schema.ts";

// --- Tunables ---------------------------------------------------------------

const OTP_LENGTH = 6;
const OTP_TTL_SECONDS = 10 * 60;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

/** A questionnaire this long gets filled in over days, not minutes. */
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

// ~90 long-form answers at 5,000 characters each is the theoretical worst
// case; 2 MB leaves headroom without letting anyone post a novel.
const MAX_BODY_BYTES = 2 * 1024 * 1024;

const LIMITS = {
  otpPerEmail: { limit: 5, window: 3600 },
  otpPerIp: { limit: 15, window: 3600 },
  badPasswordPerIp: { limit: 10, window: 3600 },
  verifyPerEmail: { limit: 20, window: 3600 },
  verifyPerIp: { limit: 40, window: 3600 },
  savePerEmail: { limit: 600, window: 3600 },
  submitPerEmail: { limit: 10, window: 3600 },
};

// --- Environment ------------------------------------------------------------

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ACCESS_PASSWORD = Deno.env.get("CLIENT_FORM_PASSWORD") ?? "";
const OTP_PEPPER = Deno.env.get("CLIENT_FORM_OTP_PEPPER") ?? "";

const SMTP_HOST = Deno.env.get("SMTP_HOST") ?? "smtp.gmail.com";
const SMTP_PORT = Number(Deno.env.get("SMTP_PORT") ?? "465");
const SMTP_USER = Deno.env.get("SMTP_USER") ?? "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") ?? "";
const NOTIFY_EMAIL =
  Deno.env.get("CLIENT_FORM_NOTIFY_EMAIL") ??
  Deno.env.get("NOTIFICATION_EMAIL") ??
  "";
const SITE_URL =
  Deno.env.get("CLIENT_FORM_SITE_URL") ?? "https://anchorbvfs.com";
const ALLOWED_ORIGINS = (Deno.env.get("CLIENT_FORM_ALLOWED_ORIGINS") ?? "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// --- Small helpers ----------------------------------------------------------

function corsHeaders(origin: string | null): Record<string, string> {
  const allowAll = ALLOWED_ORIGINS.includes("*");
  const allowed =
    allowAll || (origin && ALLOWED_ORIGINS.includes(origin))
      ? (origin ?? "*")
      : ALLOWED_ORIGINS[0] ?? "*";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(
  body: unknown,
  status: number,
  origin: string | null,
  extra: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...corsHeaders(origin),
      ...extra,
    },
  });
}

function fail(
  origin: string | null,
  status: number,
  code: string,
  message: string,
  extra: Record<string, unknown> = {},
): Response {
  return json({ ok: false, error: { code, message, ...extra } }, status, origin);
}

/**
 * A 500 with a breadcrumb. `stage` is a coarse label ("otp-insert") and `ref`
 * ties the client's error message to a specific log line, so a production
 * failure can be traced without reproducing it. Neither leaks anything about
 * the data or the secrets; the underlying driver error is logged, not returned.
 */
function serverError(
  origin: string | null,
  stage: string,
  cause: unknown,
  message = "Something went wrong. Please try again.",
): Response {
  const ref = crypto.randomUUID().slice(0, 8);
  let detail: unknown = cause;
  if (cause && typeof cause === "object") {
    const e = cause as Record<string, unknown>;
    // PostgrestError puts the useful part in code/details/hint, none of which
    // survive a plain string coercion.
    detail = {
      code: e.code,
      message: e.message,
      details: e.details,
      hint: e.hint,
    };
  }
  console.error(`[${ref}] stage=${stage}`, JSON.stringify(detail));
  return fail(origin, 500, "SERVER_ERROR", message, { ref, stage });
}

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

async function hmacHex(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(
    await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message)),
  );
}

/**
 * Compare two secrets without leaking their length or first-difference
 * position through timing. Both sides are hashed first so unequal lengths
 * don't short-circuit.
 */
async function secretsMatch(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256Hex(a), sha256Hex(b)]);
  let diff = ha.length ^ hb.length;
  for (let i = 0; i < ha.length && i < hb.length; i++) {
    diff |= ha.charCodeAt(i) ^ hb.charCodeAt(i);
  }
  return diff === 0;
}

/** Uniform 6-digit code — rejection sampling, no modulo bias. */
function randomCode(): string {
  const max = 10 ** OTP_LENGTH;
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return String(value % max).padStart(OTP_LENGTH, "0");
}

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length > 200 || !EMAIL_RE.test(email)) return null;
  return email;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const head = local.slice(0, 1);
  const tail = local.length > 1 ? local.slice(-1) : "";
  return `${head}${"•".repeat(Math.max(local.length - 2, 1))}${tail}@${domain}`;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function rateLimit(
  key: string,
  { limit, window }: { limit: number; window: number },
): Promise<{ allowed: boolean; remaining: number; retryAfter: number }> {
  const { data, error } = await admin.rpc("client_form_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: window,
  });
  if (error) {
    // Never lock legitimate clients out because the counter table hiccuped.
    console.error("rate limit check failed", error);
    return { allowed: true, remaining: limit, retryAfter: 0 };
  }
  const row = Array.isArray(data) ? data[0] : data;
  return {
    allowed: row?.allowed !== false,
    remaining: Number(row?.remaining ?? 0),
    retryAfter: Number(row?.retry_after ?? window),
  };
}

// --- Email ------------------------------------------------------------------

function wrap(title: string, inner: string): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 640px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <div style="background-color: #0b1c3e; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h2 style="color: #c5a47e; margin: 0;">${escapeHtml(title)}</h2>
      </div>
      <div style="padding: 20px; background-color: #ffffff;">${inner}</div>
      <div style="padding: 15px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee;">
        <p>Anchor Business Valuations &amp; Financial Services, LLC</p>
      </div>
    </div>`;
}

async function sendMail(to: string, subject: string, html: string) {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP is not configured (SMTP_USER / SMTP_PASS)");
  }
  await transporter.sendMail({
    from: `"Anchor Business Valuations" <${SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

function otpEmail(code: string): string {
  return wrap(
    "Your access code",
    `
      <p style="font-size:16px;">Use this code to open the Anchor client questionnaire:</p>
      <p style="font-size:34px; letter-spacing:10px; font-weight:bold; color:#0b1c3e; text-align:center; margin:28px 0;">${escapeHtml(code)}</p>
      <p style="font-size:14px; color:#555;">The code expires in ${OTP_TTL_SECONDS / 60} minutes and can be used once.</p>
      <p style="font-size:14px; color:#555;">If you didn't request this, you can ignore this email — no one can reach the questionnaire without both the access password and this code.</p>
    `,
  );
}

/** Tabular answers get a real table rather than a flattened string. */
function answerHtml(field: FieldDef, value: FieldValue): string {
  if (field.type === "table" && isTableRows(value)) {
    const columns = field.columns || [];
    const head = columns
      .map(
        (column) =>
          `<th style="text-align:left; padding:6px 10px; background:#f4f6f9; border:1px solid #e4e8ee; font-size:12px; color:#555;">${escapeHtml(column.label)}</th>`,
      )
      .join("");
    const body = value
      .filter(rowHasContent)
      .map(
        (row) =>
          `<tr>${columns
            .map(
              (column) =>
                `<td style="padding:6px 10px; border:1px solid #e4e8ee; font-size:13px;">${escapeHtml(row[column.key] || "")}</td>`,
            )
            .join("")}</tr>`,
      )
      .join("");
    return `<table style="width:100%; border-collapse:collapse; margin-top:6px;"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }
  return `<div style="white-space:pre-wrap; font-size:14px; color:#111; margin-top:4px;">${escapeHtml(
    displayValue(field, value),
  )}</div>`;
}

/** Full answer set, grouped by section, for the internal notification. */
function submissionEmail(email: string, values: FormValues): string {
  const sections = FORM_SECTIONS.map((section) => {
    const answers = section.fields
      .filter((field) => isFieldVisible(field, values))
      .filter((field) => !isBlank(values[field.key]))
      .map(
        (field) => `
          <div style="margin-bottom:16px;">
            <div style="font-size:13px; color:#555; font-weight:bold;">${escapeHtml(field.label)}</div>
            ${answerHtml(field, values[field.key] ?? null)}
          </div>`,
      )
      .join("");
    if (!answers) return "";
    return `
      <h3 style="color:#0b1c3e; margin:26px 0 10px; font-size:16px; border-left:4px solid #c5a47e; padding-left:10px;">${escapeHtml(
        `${section.letter}. ${section.title}`,
      )}</h3>
      ${answers}`;
  }).join("");

  return wrap(
    "New Client Questionnaire",
    `<p style="font-size:15px;">Submitted by <strong>${escapeHtml(email)}</strong>.</p>
     ${sections || "<p>(no answers recorded)</p>"}
     <p style="font-size:13px; color:#666; margin-top:24px;">The full response is also available under <strong>Admin → Questionnaires</strong>.</p>`,
  );
}

function confirmationEmail(): string {
  return wrap(
    "We've received your questionnaire",
    `<p style="font-size:15px;">Thank you — your completed questionnaire has reached our team and we'll review it shortly.</p>
     <p style="font-size:15px;">If you still need to send supporting documents (financial statements, tax returns, corporate records), you can upload them securely here:</p>
     <p style="margin:20px 0;"><a href="${escapeHtml(SITE_URL)}/upload" style="background:#c5a47e; color:#0b1c3e; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:bold;">Upload documents</a></p>
     <p style="font-size:13px; color:#666;">Questions? Reply to this email or call (239) 919-3092.</p>`,
  );
}

// --- Session handling -------------------------------------------------------

interface SessionRow {
  id: string;
  email: string;
  expires_at: string;
}

async function resolveSession(
  token: unknown,
): Promise<
  { session: SessionRow; error?: undefined } | { session?: undefined; error: string }
> {
  if (typeof token !== "string" || token.length < 20 || token.length > 200) {
    return { error: "SESSION_INVALID" };
  }
  const tokenHash = await sha256Hex(token);
  const { data, error } = await admin
    .from("client_form_sessions")
    .select("id, email, expires_at, revoked_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error) {
    console.error("session lookup failed", error);
    return { error: "SERVER_ERROR" };
  }
  if (!data || data.revoked_at) return { error: "SESSION_INVALID" };
  if (new Date(data.expires_at).getTime() <= Date.now()) {
    return { error: "SESSION_EXPIRED" };
  }

  // Fire-and-forget: a failed heartbeat must not fail the request.
  admin
    .from("client_form_sessions")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", data.id)
    .then(undefined, (e: unknown) => console.error("heartbeat failed", e));

  return { session: { id: data.id, email: data.email, expires_at: data.expires_at } };
}

/**
 * One row per email, for good — a draft becomes the submission in place. The
 * caller decides what to do with it based on `status`: 'draft' reopens the
 * form, 'submitted' means the client can only read their answers back.
 */
async function loadState(email: string) {
  const { data, error } = await admin
    .from("client_form_submissions")
    .select("id, status, data, updated_at, submitted_at, schema_version")
    .eq("email", email)
    .maybeSingle();

  if (error) console.error("submission lookup failed", error);

  return {
    submission: data
      ? {
          id: data.id,
          status: data.status as "draft" | "submitted",
          data: (data.data ?? {}) as FormValues,
          updatedAt: data.updated_at,
          submittedAt: data.submitted_at,
          schemaVersion: data.schema_version,
        }
      : null,
  };
}

// --- Action handlers --------------------------------------------------------

async function handleRequestOtp(
  body: Record<string, unknown>,
  req: Request,
  origin: string | null,
): Promise<Response> {
  const email = normalizeEmail(body.email);
  if (!email) {
    return fail(origin, 400, "INVALID_EMAIL", "Enter a valid email address.");
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (!password || password.length > 200) {
    return fail(origin, 400, "INVALID_PASSWORD", "Enter the access password.");
  }

  const ipHash = await hmacHex(OTP_PEPPER, clientIp(req));

  const ipLimit = await rateLimit(`otp-ip:${ipHash}`, LIMITS.otpPerIp);
  if (!ipLimit.allowed) {
    return fail(
      origin,
      429,
      "RATE_LIMITED",
      "Too many code requests from this connection.",
      { retryAfter: ipLimit.retryAfter },
    );
  }
  // The password is checked BEFORE the per-email counter is touched. If the
  // order were reversed, anyone who knew a client's address could burn that
  // client's 5-codes-per-hour budget with junk passwords and lock them out of
  // their own questionnaire. Password guessing is bounded per IP instead.
  if (!(await secretsMatch(password, ACCESS_PASSWORD))) {
    const guessLimit = await rateLimit(
      `pw-fail:${ipHash}`,
      LIMITS.badPasswordPerIp,
    );
    if (!guessLimit.allowed) {
      return fail(
        origin,
        429,
        "RATE_LIMITED",
        "Too many incorrect passwords. Access from this connection is paused.",
        { retryAfter: guessLimit.retryAfter },
      );
    }
    return fail(
      origin,
      401,
      "BAD_CREDENTIALS",
      "That access password isn't correct.",
    );
  }

  const emailLimit = await rateLimit(`otp-email:${email}`, LIMITS.otpPerEmail);
  if (!emailLimit.allowed) {
    return fail(
      origin,
      429,
      "RATE_LIMITED",
      "You have requested the maximum number of codes for this address.",
      { retryAfter: emailLimit.retryAfter },
    );
  }

  // Resend cooldown, measured from the newest live code for this email.
  const { data: recent } = await admin
    .from("client_form_otps")
    .select("created_at")
    .eq("email", email)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent) {
    const elapsed = (Date.now() - new Date(recent.created_at).getTime()) / 1000;
    if (elapsed < OTP_RESEND_COOLDOWN_SECONDS) {
      return fail(
        origin,
        429,
        "COOLDOWN",
        "A code was just sent to you.",
        { retryAfter: Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsed) },
      );
    }
  }

  // Only the newest code may ever be valid.
  await admin
    .from("client_form_otps")
    .update({ consumed_at: new Date().toISOString() })
    .eq("email", email)
    .is("consumed_at", null);

  const code = randomCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

  const { data: inserted, error: insertError } = await admin
    .from("client_form_otps")
    .insert({
      email,
      code_hash: await hmacHex(OTP_PEPPER, `${email}:${code}`),
      expires_at: expiresAt.toISOString(),
      ip_hash: ipHash,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return serverError(origin, "otp-insert", insertError, "Could not create an access code.");
  }

  try {
    await sendMail(email, "Your Anchor questionnaire access code", otpEmail(code));
  } catch (error) {
    // Don't leave a live code the client never received.
    await admin.from("client_form_otps").delete().eq("id", inserted.id);
    console.error("otp email failed", error);
    return fail(
      origin,
      502,
      "EMAIL_FAILED",
      "We couldn't send the code to that address. Check the address and try again.",
    );
  }

  return json(
    {
      ok: true,
      maskedEmail: maskEmail(email),
      expiresAt: expiresAt.toISOString(),
      resendAvailableAt: new Date(
        Date.now() + OTP_RESEND_COOLDOWN_SECONDS * 1000,
      ).toISOString(),
      attemptsAllowed: OTP_MAX_ATTEMPTS,
      requestsLeft: emailLimit.remaining,
    },
    200,
    origin,
  );
}

async function handleVerifyOtp(
  body: Record<string, unknown>,
  req: Request,
  origin: string | null,
): Promise<Response> {
  const email = normalizeEmail(body.email);
  const code = typeof body.code === "string" ? body.code.trim() : "";

  if (!email) {
    return fail(origin, 400, "INVALID_EMAIL", "Enter a valid email address.");
  }
  if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code)) {
    return fail(
      origin,
      400,
      "INVALID_CODE",
      `Enter the ${OTP_LENGTH}-digit code from your email.`,
    );
  }

  const ipHash = await hmacHex(OTP_PEPPER, clientIp(req));
  const ipLimit = await rateLimit(`verify-ip:${ipHash}`, LIMITS.verifyPerIp);
  if (!ipLimit.allowed) {
    return fail(origin, 429, "RATE_LIMITED", "Too many attempts from this connection.", {
      retryAfter: ipLimit.retryAfter,
    });
  }
  const emailLimit = await rateLimit(
    `verify-email:${email}`,
    LIMITS.verifyPerEmail,
  );
  if (!emailLimit.allowed) {
    return fail(origin, 429, "RATE_LIMITED", "Too many code attempts for this address.", {
      retryAfter: emailLimit.retryAfter,
    });
  }

  const { data: otp, error: otpError } = await admin
    .from("client_form_otps")
    .select("id, code_hash, expires_at, attempts")
    .eq("email", email)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (otpError) {
    return serverError(origin, "otp-lookup", otpError);
  }
  if (!otp) {
    return fail(
      origin,
      400,
      "CODE_NOT_FOUND",
      "That code is no longer valid. Request a new one.",
    );
  }
  if (new Date(otp.expires_at).getTime() <= Date.now()) {
    await admin
      .from("client_form_otps")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", otp.id);
    return fail(origin, 400, "CODE_EXPIRED", "That code has expired. Request a new one.");
  }

  // Compare-and-swap the attempt counter so parallel guesses can't share a budget.
  const { data: bumped, error: bumpError } = await admin
    .from("client_form_otps")
    .update({ attempts: otp.attempts + 1 })
    .eq("id", otp.id)
    .eq("attempts", otp.attempts)
    .select("attempts")
    .maybeSingle();

  if (bumpError || !bumped) {
    return fail(
      origin,
      409,
      "TRY_AGAIN",
      "Another attempt was in flight. Please re-enter the code.",
    );
  }

  if (bumped.attempts > OTP_MAX_ATTEMPTS) {
    await admin
      .from("client_form_otps")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", otp.id);
    return fail(
      origin,
      429,
      "CODE_LOCKED",
      "Too many incorrect codes. Request a new one.",
    );
  }

  const expected = await hmacHex(OTP_PEPPER, `${email}:${code}`);
  if (!(await secretsMatch(expected, otp.code_hash))) {
    return fail(origin, 400, "CODE_INVALID", "That code isn't correct.", {
      attemptsRemaining: Math.max(OTP_MAX_ATTEMPTS - bumped.attempts, 0),
    });
  }

  // Correct — burn the code and open a session.
  await admin
    .from("client_form_otps")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", otp.id);

  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const { error: sessionError } = await admin
    .from("client_form_sessions")
    .insert({
      token_hash: await sha256Hex(token),
      email,
      expires_at: expiresAt.toISOString(),
      ip_hash: ipHash,
      user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
    });

  if (sessionError) {
    return serverError(origin, "session-insert", sessionError, "Could not start your session.");
  }

  const state = await loadState(email);
  return json(
    {
      ok: true,
      token,
      email,
      expiresAt: expiresAt.toISOString(),
      schemaVersion: FORM_SCHEMA_VERSION,
      ...state,
    },
    200,
    origin,
  );
}

/**
 * A database hiccup must not masquerade as an expired session — the browser
 * throws its token away on a 401, so transient faults have to stay 5xx.
 */
function sessionFailure(origin: string | null, code: string): Response {
  if (code === "SERVER_ERROR") {
    return fail(origin, 500, "SERVER_ERROR", "Something went wrong. Please try again.");
  }
  return fail(
    origin,
    401,
    code,
    "Your session has ended. Verify again to keep your answers.",
  );
}

async function handleSession(
  body: Record<string, unknown>,
  origin: string | null,
): Promise<Response> {
  const result = await resolveSession(body.token);
  if (result.error) return sessionFailure(origin, result.error);
  const state = await loadState(result.session.email);
  return json(
    {
      ok: true,
      email: result.session.email,
      expiresAt: result.session.expires_at,
      schemaVersion: FORM_SCHEMA_VERSION,
      ...state,
    },
    200,
    origin,
  );
}

/** Shared by save-draft and submit: resolve session, sanitize, check conflict. */
async function prepareWrite(
  body: Record<string, unknown>,
  origin: string | null,
): Promise<
  | { response: Response }
  | {
      response?: undefined;
      email: string;
      values: FormValues;
      draft: { id: string; updated_at: string } | null;
    }
> {
  const result = await resolveSession(body.token);
  if (result.error) {
    return { response: sessionFailure(origin, result.error) };
  }

  const email = result.session.email;
  const values = sanitizeValues(body.data);

  const { data: existing, error } = await admin
    .from("client_form_submissions")
    .select("id, status, updated_at")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return { response: serverError(origin, "draft-lookup", error, "Could not load your draft.") };
  }

  // One questionnaire per email. Once it is in, it is read-only — no further
  // edits and no second submission from the same address.
  if (existing && existing.status === "submitted") {
    const state = await loadState(email);
    return {
      response: json(
        {
          ok: false,
          error: {
            code: "ALREADY_SUBMITTED",
            message:
              "This questionnaire has already been submitted and can no longer be edited.",
          },
          ...state,
        },
        409,
        origin,
      ),
    };
  }

  const draft = existing ? { id: existing.id, updated_at: existing.updated_at } : null;

  const expected = body.expectedUpdatedAt;
  if (
    draft &&
    typeof expected === "string" &&
    new Date(expected).getTime() !== new Date(draft.updated_at).getTime()
  ) {
    const state = await loadState(email);
    return {
      response: json(
        {
          ok: false,
          error: {
            code: "CONFLICT",
            message:
              "This questionnaire was updated somewhere else — on another device or tab.",
          },
          server: state.submission,
        },
        409,
        origin,
      ),
    };
  }

  return { email, values, draft };
}

async function handleSaveDraft(
  body: Record<string, unknown>,
  origin: string | null,
): Promise<Response> {
  const prepared = await prepareWrite(body, origin);
  if (prepared.response) return prepared.response;
  const { email, values, draft } = prepared;

  const limit = await rateLimit(`save:${email}`, LIMITS.savePerEmail);
  if (!limit.allowed) {
    return fail(origin, 429, "RATE_LIMITED", "Too many saves. Please slow down.", {
      retryAfter: limit.retryAfter,
    });
  }

  const payload = {
    email,
    status: "draft",
    data: values,
    schema_version: FORM_SCHEMA_VERSION,
  };

  if (draft) {
    const { data, error } = await admin
      .from("client_form_submissions")
      .update(payload)
      .eq("id", draft.id)
      .eq("status", "draft")
      .select("id, updated_at")
      .maybeSingle();

    if (error || !data) {
      return serverError(origin, "draft-update", error, "Could not save your draft.");
    }
    return json({ ok: true, id: data.id, updatedAt: data.updated_at }, 200, origin);
  }

  const { data, error } = await admin
    .from("client_form_submissions")
    .insert(payload)
    .select("id, updated_at")
    .maybeSingle();

  if (error) {
    // 23505 = the one-per-email index fired because another tab got here first.
    if ((error as { code?: string }).code === "23505") {
      const { data: existing } = await admin
        .from("client_form_submissions")
        .select("id, status")
        .eq("email", email)
        .maybeSingle();

      // That other tab may have submitted rather than saved — in which case
      // this draft write must not resurrect an editable row.
      if (existing?.status === "submitted") {
        const state = await loadState(email);
        return json(
          {
            ok: false,
            error: {
              code: "ALREADY_SUBMITTED",
              message:
                "This questionnaire has already been submitted and can no longer be edited.",
            },
            ...state,
          },
          409,
          origin,
        );
      }

      if (existing) {
        const { data: updated } = await admin
          .from("client_form_submissions")
          .update(payload)
          .eq("id", existing.id)
          .eq("status", "draft")
          .select("id, updated_at")
          .maybeSingle();
        if (updated) {
          return json(
            { ok: true, id: updated.id, updatedAt: updated.updated_at },
            200,
            origin,
          );
        }
      }
    }
    return serverError(origin, "draft-insert", error, "Could not save your draft.");
  }

  return json({ ok: true, id: data!.id, updatedAt: data!.updated_at }, 200, origin);
}

async function handleSubmit(
  body: Record<string, unknown>,
  origin: string | null,
): Promise<Response> {
  const prepared = await prepareWrite(body, origin);
  if (prepared.response) return prepared.response;
  const { email, values, draft } = prepared;

  const limit = await rateLimit(`submit:${email}`, LIMITS.submitPerEmail);
  if (!limit.allowed) {
    return fail(origin, 429, "RATE_LIMITED", "Too many submissions. Try again later.", {
      retryAfter: limit.retryAfter,
    });
  }

  const fieldErrors = validateAll(values, false);
  if (Object.keys(fieldErrors).length > 0) {
    return json(
      {
        ok: false,
        error: {
          code: "VALIDATION_FAILED",
          message: "Some required answers are still missing.",
        },
        fieldErrors,
      },
      422,
      origin,
    );
  }

  const submittedAt = new Date().toISOString();
  const payload = {
    email,
    status: "submitted",
    data: values,
    schema_version: FORM_SCHEMA_VERSION,
    submitted_at: submittedAt,
  };

  let id: string;
  if (draft) {
    // `.eq("status", "draft")` makes a double-click idempotent rather than
    // creating a second submission.
    const { data, error } = await admin
      .from("client_form_submissions")
      .update(payload)
      .eq("id", draft.id)
      .eq("status", "draft")
      .select("id, submitted_at")
      .maybeSingle();

    if (error) {
      return serverError(origin, "submit-update", error, "Could not submit your questionnaire.");
    }
    if (!data) {
      // Already flipped to submitted by a concurrent request — report success.
      const { data: existing } = await admin
        .from("client_form_submissions")
        .select("id, submitted_at")
        .eq("id", draft.id)
        .maybeSingle();
      return json(
        {
          ok: true,
          id: existing?.id ?? draft.id,
          submittedAt: existing?.submitted_at ?? submittedAt,
          alreadySubmitted: true,
        },
        200,
        origin,
      );
    }
    id = data.id;
  } else {
    const { data, error } = await admin
      .from("client_form_submissions")
      .insert(payload)
      .select("id")
      .maybeSingle();

    if (error) {
      // 23505 = the one-per-email index fired because a concurrent request got
      // there first. Report that one rather than a spurious failure.
      if ((error as { code?: string }).code === "23505") {
        const { data: existing } = await admin
          .from("client_form_submissions")
          .select("id, submitted_at")
          .eq("email", email)
          .maybeSingle();
        if (existing) {
          return json(
            {
              ok: true,
              id: existing.id,
              submittedAt: existing.submitted_at ?? submittedAt,
              alreadySubmitted: true,
            },
            200,
            origin,
          );
        }
      }
      return serverError(origin, "submit-insert", error, "Could not submit your questionnaire.");
    }
    if (!data) {
      return fail(origin, 500, "SERVER_ERROR", "Could not submit your questionnaire.");
    }
    id = data.id;
  }

  // The questionnaire is saved at this point. Email problems are logged but
  // must not tell the client their submission failed.
  try {
    if (NOTIFY_EMAIL) {
      await sendMail(
        NOTIFY_EMAIL,
        `New Client Questionnaire from ${email}`,
        submissionEmail(email, values),
      );
    }
  } catch (error) {
    console.error("notification email failed", error);
  }
  try {
    await sendMail(
      email,
      "We've received your questionnaire — Anchor Business Valuations",
      confirmationEmail(),
    );
  } catch (error) {
    console.error("confirmation email failed", error);
  }

  return json({ ok: true, id, submittedAt }, 200, origin);
}

/**
 * Deployment self-check. Reports which dependency is broken rather than making
 * you correlate dashboard logs by hand. Gated behind the access password so it
 * isn't a public probe of the project's internals.
 *
 *   curl -s -X POST "$SUPABASE_URL/functions/v1/client-form" \
 *     -H "Authorization: Bearer $ANON_KEY" -H "apikey: $ANON_KEY" \
 *     -H "Content-Type: application/json" \
 *     -d '{"action":"health","password":"<access password>"}' | jq
 */
async function handleHealth(
  body: Record<string, unknown>,
  origin: string | null,
): Promise<Response> {
  const password = typeof body.password === "string" ? body.password : "";
  if (!(await secretsMatch(password, ACCESS_PASSWORD))) {
    return fail(origin, 401, "BAD_CREDENTIALS", "That access password isn't correct.");
  }

  const checks: Record<string, string> = {};

  const missing = [
    ["SUPABASE_URL", SUPABASE_URL],
    ["SUPABASE_SERVICE_ROLE_KEY", SERVICE_ROLE_KEY],
    ["CLIENT_FORM_PASSWORD", ACCESS_PASSWORD],
    ["CLIENT_FORM_OTP_PEPPER", OTP_PEPPER],
    ["SMTP_USER", SMTP_USER],
    ["SMTP_PASS", SMTP_PASS],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
  checks.env = missing.length ? `missing: ${missing.join(", ")}` : "ok";
  checks.smtp_target = `${SMTP_HOST}:${SMTP_PORT} secure=${SMTP_PORT === 465}`;
  checks.notify_email = NOTIFY_EMAIL || "(unset — no internal alert on submit)";

  for (const table of [
    "client_form_submissions",
    "client_form_otps",
    "client_form_sessions",
    "client_form_rate_limits",
  ]) {
    const { error } = await admin
      .from(table)
      .select("*", { count: "exact", head: true });
    checks[table] = error ? `${error.code ?? "?"}: ${error.message}` : "ok";
  }

  const { error: rlError } = await admin.rpc("client_form_rate_limit", {
    p_key: "health-check",
    p_limit: 1_000_000,
    p_window_seconds: 60,
  });
  checks.fn_rate_limit = rlError
    ? `${rlError.code ?? "?"}: ${rlError.message}`
    : "ok";

  const { error: cleanupError } = await admin.rpc("client_form_cleanup");
  checks.fn_cleanup = cleanupError
    ? `${cleanupError.code ?? "?"}: ${cleanupError.message}`
    : "ok";

  // The most common production failure: SMTP credentials that don't
  // authenticate. verify() opens a real connection and logs in.
  try {
    await transporter.verify();
    checks.smtp = "ok";
  } catch (error) {
    checks.smtp = (error as Error)?.message ?? String(error);
  }

  const healthy = Object.entries(checks).every(
    ([key, value]) =>
      value === "ok" || key === "smtp_target" || key === "notify_email",
  );

  return json({ ok: true, healthy, checks }, 200, origin);
}

async function handleSignOut(
  body: Record<string, unknown>,
  origin: string | null,
): Promise<Response> {
  if (typeof body.token === "string") {
    await admin
      .from("client_form_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("token_hash", await sha256Hex(body.token));
  }
  return json({ ok: true }, 200, origin);
}

// --- Entry point ------------------------------------------------------------

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return fail(origin, 405, "METHOD_NOT_ALLOWED", "Use POST.");
  }

  if (!SERVICE_ROLE_KEY || !ACCESS_PASSWORD || !OTP_PEPPER) {
    console.error(
      "client-form is missing required secrets: CLIENT_FORM_PASSWORD / CLIENT_FORM_OTP_PEPPER / SUPABASE_SERVICE_ROLE_KEY",
    );
    return fail(
      origin,
      503,
      "NOT_CONFIGURED",
      "The questionnaire isn't available right now. Please contact us directly.",
    );
  }

  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return fail(origin, 413, "PAYLOAD_TOO_LARGE", "That submission is too large.");
  }

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return fail(origin, 413, "PAYLOAD_TOO_LARGE", "That submission is too large.");
    }
    const parsed = JSON.parse(raw || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("body must be an object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(origin, 400, "BAD_REQUEST", "Malformed request.");
  }

  // Opportunistic housekeeping — roughly one request in fifty.
  if (Math.random() < 0.02) {
    admin
      .rpc("client_form_cleanup")
      .then(undefined, (e: unknown) => console.error("cleanup failed", e));
  }

  try {
    switch (body.action) {
      case "request-otp":
        return await handleRequestOtp(body, req, origin);
      case "verify-otp":
        return await handleVerifyOtp(body, req, origin);
      case "session":
        return await handleSession(body, origin);
      case "save-draft":
        return await handleSaveDraft(body, origin);
      case "submit":
        return await handleSubmit(body, origin);
      case "sign-out":
        return await handleSignOut(body, origin);
      case "health":
        return await handleHealth(body, origin);
      default:
        return fail(origin, 400, "UNKNOWN_ACTION", "Unsupported action.");
    }
  } catch (error) {
    return serverError(origin, `action:${String(body.action)}`, error);
  }
});
