import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import {
  ClientFormError,
  clientFormApi,
  type VerifyOtpResult,
} from "@/lib/clientForm/api";

const CODE_LENGTH = 6;

/** Seconds remaining until an ISO timestamp, re-evaluated every second. */
function useCountdown(targetIso: string | null): number {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!targetIso) {
      setRemaining(0);
      return;
    }
    const tick = () => {
      const seconds = Math.ceil(
        (new Date(targetIso).getTime() - Date.now()) / 1000,
      );
      setRemaining(Math.max(seconds, 0));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  return remaining;
}

/** Clock form — only for the code-expiry timer, where "9:58" reads correctly. */
function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Words, not a clock. "13:57" next to "try again later" reads as 1:57pm, which
 * is exactly the wrong thing to tell someone who is already locked out.
 */
function formatWait(seconds: number): string {
  if (seconds < 60) return `${Math.max(seconds, 1)} seconds`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.round(minutes / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

interface Props {
  onVerified: (result: VerifyOtpResult) => void;
  /** Shown when a previously stored session was rejected on load. */
  expiredNotice?: boolean;
}

const ClientFormGate = ({ onVerified, expiredNotice }: Props) => {
  const [step, setStep] = useState<"credentials" | "code">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<{
    maskedEmail: string;
    expiresAt: string;
    resendAvailableAt: string;
  } | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(
    null,
  );
  const [errorRef, setErrorRef] = useState<string | null>(null);
  /** Seconds until a rate limit lifts. Counts down live in the banner. */
  const [retryIn, setRetryIn] = useState<number | null>(null);
  /** Code requests left in the current hour, when the server reports it. */
  const [requestsLeft, setRequestsLeft] = useState<number | null>(null);

  const codeExpiresIn = useCountdown(challenge?.expiresAt ?? null);
  const resendAvailableIn = useCountdown(challenge?.resendAvailableAt ?? null);

  // Guards the OTP auto-submit so one code is never verified twice.
  const submittedCode = useRef<string | null>(null);

  const requestCode = useCallback(
    async (isResend: boolean) => {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed || !password) {
        setError("Enter both your email address and the access password.");
        return;
      }

      setBusy(true);
      setError(null);
      setErrorRef(null);
      try {
        const result = await clientFormApi.requestOtp(trimmed, password);
        setEmail(trimmed);
        setChallenge({
          maskedEmail: result.maskedEmail,
          expiresAt: result.expiresAt,
          resendAvailableAt: result.resendAvailableAt,
        });
        setAttemptsRemaining(null);
        setRetryIn(null);
        setRequestsLeft(result.requestsLeft ?? null);
        setCode("");
        submittedCode.current = null;
        setStep("code");
        toast.success(
          isResend ? "A new code is on its way." : "We've emailed you a code.",
          { description: `Sent to ${result.maskedEmail}` },
        );
      } catch (caught) {
        const failure = caught as ClientFormError;
        if (failure.code === "COOLDOWN" && failure.retryAfter) {
          // Already on the code step — just restart the resend timer.
          setChallenge((current) =>
            current
              ? {
                  ...current,
                  resendAvailableAt: new Date(
                    Date.now() + failure.retryAfter! * 1000,
                  ).toISOString(),
                }
              : current,
          );
        }
        setErrorRef(failure.ref ?? null);
        setError(failure.message);
        setRetryIn(failure.retryAfter ?? null);
      } finally {
        setBusy(false);
      }
    },
    [email, password],
  );

  const verifyCode = useCallback(
    async (value: string) => {
      if (submittedCode.current === value) return;
      submittedCode.current = value;

      setBusy(true);
      setError(null);
      setErrorRef(null);
      try {
        const result = await clientFormApi.verifyOtp(email, value);
        onVerified(result);
      } catch (caught) {
        const failure = caught as ClientFormError;
        setCode("");
        submittedCode.current = null;

        if (
          failure.code === "CODE_EXPIRED" ||
          failure.code === "CODE_LOCKED" ||
          failure.code === "CODE_NOT_FOUND"
        ) {
          // The code is dead — allow an immediate resend rather than making
          // the client wait out a cooldown that no longer protects anything.
          setChallenge((current) =>
            current
              ? { ...current, resendAvailableAt: new Date().toISOString() }
              : current,
          );
          setAttemptsRemaining(null);
        } else if (typeof failure.attemptsRemaining === "number") {
          setAttemptsRemaining(failure.attemptsRemaining);
        }

        setErrorRef(failure.ref ?? null);
        setError(failure.message);
        setRetryIn(failure.retryAfter ?? null);
      } finally {
        setBusy(false);
      }
    },
    [email, onVerified],
  );

  // Tick the lockout down so the banner stays honest instead of freezing on
  // whatever number the server happened to return.
  useEffect(() => {
    if (retryIn === null || retryIn <= 0) return;
    const id = window.setInterval(() => {
      setRetryIn((current) => {
        if (current === null) return null;
        if (current <= 1) return null;
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [retryIn]);

  // Verify as soon as the last digit lands — no extra click needed.
  useEffect(() => {
    if (step === "code" && code.length === CODE_LENGTH && !busy) {
      void verifyCode(code);
    }
  }, [code, step, busy, verifyCode]);

  const backToCredentials = () => {
    setStep("credentials");
    setChallenge(null);
    setCode("");
    setError(null);
    setErrorRef(null);
    setAttemptsRemaining(null);
    submittedCode.current = null;
  };

  const codeExpired = step === "code" && codeExpiresIn <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
          {step === "credentials" ? (
            <Lock className="h-7 w-7 text-gold" />
          ) : (
            <KeyRound className="h-7 w-7 text-gold" />
          )}
        </div>
        <h2 className="font-display text-2xl font-bold text-navy">
          {step === "credentials" ? "Protected questionnaire" : "Enter your code"}
        </h2>
        <p className="mt-2 text-sm text-slate">
          {step === "credentials" ? (
            <>
              This form is available to clients only. Enter your email and the
              access password we shared with you — we'll email you a one-time
              code to confirm it's you.
            </>
          ) : (
            <>
              We sent a {CODE_LENGTH}-digit code to{" "}
              <span className="font-medium text-navy">
                {challenge?.maskedEmail}
              </span>
              .
            </>
          )}
        </p>
      </div>

      {expiredNotice && step === "credentials" && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your previous session has ended. Verify again to pick up where you
          left off — your saved answers are safe.
        </div>
      )}

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
          {retryIn !== null && retryIn > 0 && (
            <span className="mt-1.5 block text-xs text-red-600">
              You can try again in {formatWait(retryIn)}.
            </span>
          )}
          {attemptsRemaining !== null && (
            <span className="mt-1.5 block text-xs text-red-600">
              {attemptsRemaining > 0
                ? `${attemptsRemaining} ${attemptsRemaining === 1 ? "try" : "tries"} left before this code is locked.`
                : "No tries left on this code — request a new one."}
            </span>
          )}
          {errorRef && (
            <span className="mt-1.5 block font-mono text-xs text-red-600/80">
              Reference: {errorRef}
            </span>
          )}
        </div>
      )}

      {step === "credentials" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void requestCode(false);
          }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="cf-email" className="text-navy">
              Email address
            </Label>
            <Input
              id="cf-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
              disabled={busy}
              className="h-12 border-slate/20 bg-white focus:border-gold focus:ring-gold/20"
            />
            <p className="text-xs text-slate">
              The code goes to this address, and your draft is saved against it.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cf-password" className="text-navy">
              Access password
            </Label>
            <div className="relative">
              <Input
                id="cf-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={busy}
                className="h-12 border-slate/20 bg-white pr-11 focus:border-gold focus:ring-gold/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate transition-colors hover:text-navy"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            {busy ? "Sending code…" : "Email me a code"}
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="flex justify-center">
            <InputOTP
              maxLength={CODE_LENGTH}
              value={code}
              onChange={setCode}
              disabled={busy || codeExpired}
              autoFocus
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-11 border-slate/25 text-lg"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <p className="text-center text-sm text-slate" aria-live="polite">
            {codeExpired ? (
              <span className="text-red-600">
                This code has expired. Send a new one to continue.
              </span>
            ) : (
              <>Code expires in {formatClock(codeExpiresIn)}</>
            )}
          </p>

          {/* Warn while there is still something to do about it. */}
          {requestsLeft !== null && requestsLeft <= 2 && (
            <p className="text-center text-xs text-amber-700">
              {requestsLeft === 0
                ? "That was your last code for this hour."
                : `${requestsLeft} more ${requestsLeft === 1 ? "code" : "codes"} can be sent to this address this hour.`}
            </p>
          )}

          {busy && (
            <p className="flex items-center justify-center gap-2 text-sm text-slate">
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={busy || (resendAvailableIn > 0 && !codeExpired)}
              onClick={() => void requestCode(true)}
              className="w-full"
            >
              {resendAvailableIn > 0 && !codeExpired
                ? `Resend code in ${formatClock(resendAvailableIn)}`
                : "Send a new code"}
            </Button>
            <button
              type="button"
              onClick={backToCredentials}
              disabled={busy}
              className="inline-flex items-center justify-center gap-1.5 text-sm text-slate transition-colors hover:text-navy disabled:opacity-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Use a different email address
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 flex items-start gap-2 border-t border-slate-100 pt-5 text-xs leading-relaxed text-slate">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
        Your answers are transmitted over an encrypted connection and are
        readable only by our team. Don't have the access password?{" "}
        <a href="mailto:info@anchorbv.com" className="text-navy underline">
          Ask us for it
        </a>
        .
      </p>
    </motion.div>
  );
};

export default ClientFormGate;
