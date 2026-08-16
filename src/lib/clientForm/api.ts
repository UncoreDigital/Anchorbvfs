// Typed browser client for the `client-form` Edge Function.
//
// Deliberately plain `fetch` rather than `supabase.functions.invoke`: invoke
// throws away the response body on non-2xx statuses, and every meaningful
// outcome here (wrong code, rate limited, draft conflict, validation errors)
// arrives as a structured body with a non-2xx status.

import type { FormErrors, FormValues } from "./schema";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const ENDPOINT = `${(SUPABASE_URL || "").replace(/\/$/, "")}/functions/v1/client-form`;

/** Requests hang forever on a flaky mobile connection without this. */
const REQUEST_TIMEOUT_MS = 25_000;

/**
 * There is exactly one record per email. While `status` is "draft" the client
 * can edit it; once "submitted" it is theirs to read back and nothing more.
 */
export interface SubmissionState {
  id: string;
  status: "draft" | "submitted";
  data: FormValues;
  updatedAt: string;
  submittedAt: string | null;
  schemaVersion: number;
}

export interface SessionState {
  email: string;
  expiresAt: string;
  schemaVersion: number;
  submission: SubmissionState | null;
}

export interface RequestOtpResult {
  maskedEmail: string;
  expiresAt: string;
  resendAvailableAt: string;
  attemptsAllowed: number;
}

export interface VerifyOtpResult extends SessionState {
  token: string;
}

export interface SaveDraftResult {
  id: string;
  updatedAt: string;
}

export interface SubmitResult {
  id: string;
  submittedAt: string;
  alreadySubmitted?: boolean;
}

/**
 * Every failure the UI can act on differently is a distinct `code`.
 * `NETWORK` and `TIMEOUT` are synthesised client-side.
 */
export class ClientFormError extends Error {
  code: string;
  status: number;
  retryAfter?: number;
  attemptsRemaining?: number;
  fieldErrors?: FormErrors;
  serverDraft?: SubmissionState | null;

  constructor(
    code: string,
    message: string,
    status = 0,
    extra: Partial<ClientFormError> = {},
  ) {
    super(message);
    this.name = "ClientFormError";
    this.code = code;
    this.status = status;
    Object.assign(this, extra);
  }

  /** True when retrying the same call unchanged could plausibly succeed. */
  get isTransient(): boolean {
    return (
      this.code === "NETWORK" ||
      this.code === "TIMEOUT" ||
      this.status === 500 ||
      this.status === 502 ||
      this.status === 503 ||
      this.status === 504
    );
  }

  get isSessionGone(): boolean {
    return this.code === "SESSION_INVALID" || this.code === "SESSION_EXPIRED";
  }

  /** The one questionnaire for this email is already in and is now read-only. */
  get isAlreadySubmitted(): boolean {
    return this.code === "ALREADY_SUBMITTED";
  }
}

/** The shape every response from the function shares, success or failure. */
interface ApiEnvelope {
  ok?: boolean;
  error?: {
    code?: string;
    message?: string;
    retryAfter?: number;
    attemptsRemaining?: number;
  };
  fieldErrors?: FormErrors;
  server?: SubmissionState | null;
  /** Present on ALREADY_SUBMITTED so the UI can swap straight to read-only. */
  submission?: SubmissionState | null;
}

async function call<T>(
  action: string,
  payload: Record<string, unknown>,
): Promise<T> {
  if (!SUPABASE_URL || !ANON_KEY) {
    throw new ClientFormError(
      "NOT_CONFIGURED",
      "The questionnaire isn't configured. Please contact us directly.",
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ action, ...payload }),
      signal: controller.signal,
    });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") {
      throw new ClientFormError(
        "TIMEOUT",
        "That took too long. Check your connection and try again.",
      );
    }
    throw new ClientFormError(
      "NETWORK",
      "We couldn't reach the server. Check your connection and try again.",
    );
  } finally {
    clearTimeout(timer);
  }

  let body: ApiEnvelope | null = null;
  try {
    body = (await response.json()) as ApiEnvelope;
  } catch {
    // Fall through — a non-JSON body is handled as a generic failure below.
  }

  if (!response.ok || !body?.ok) {
    const error = body?.error ?? {};
    throw new ClientFormError(
      error.code ?? "SERVER_ERROR",
      error.message ?? "Something went wrong. Please try again.",
      response.status,
      {
        retryAfter: error.retryAfter,
        attemptsRemaining: error.attemptsRemaining,
        fieldErrors: body?.fieldErrors,
        serverDraft: body?.server ?? body?.submission ?? null,
      },
    );
  }

  return body as unknown as T;
}

export const clientFormApi = {
  requestOtp: (email: string, password: string) =>
    call<RequestOtpResult>("request-otp", { email, password }),

  verifyOtp: (email: string, code: string) =>
    call<VerifyOtpResult>("verify-otp", { email, code }),

  session: (token: string) => call<SessionState>("session", { token }),

  saveDraft: (token: string, data: FormValues, expectedUpdatedAt?: string) =>
    call<SaveDraftResult>("save-draft", { token, data, expectedUpdatedAt }),

  submit: (token: string, data: FormValues, expectedUpdatedAt?: string) =>
    call<SubmitResult>("submit", { token, data, expectedUpdatedAt }),

  signOut: (token: string) => call<{ ok: true }>("sign-out", { token }),
};
