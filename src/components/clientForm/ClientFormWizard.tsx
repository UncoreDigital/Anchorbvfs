import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  CloudOff,
  FileSearch,
  Loader2,
  LogOut,
  Save,
  Send,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ClientFormField from "./ClientFormField";
import ClientFormShell from "./ClientFormShell";
import AnswerList from "./AnswerList";
import {
  ClientFormError,
  clientFormApi,
  type SessionState,
  type SubmissionState,
} from "@/lib/clientForm/api";
import { backupStore, type LocalBackup } from "@/lib/clientForm/storage";
import {
  FORM_SECTIONS,
  REQUIRED_HINT,
  completionStats,
  firstSectionWithError,
  isBlank,
  isFieldVisible,
  sectionStats,
  validateAll,
  type FieldValue,
  type FormErrors,
  type FormValues,
} from "@/lib/clientForm/schema";

/** Quiet period after the last keystroke before a background save fires. */
const AUTOSAVE_DEBOUNCE_MS = 2500;
/** Backstop so a long uninterrupted typing session still reaches the server. */
const AUTOSAVE_INTERVAL_MS = 60_000;

const REVIEW_STEP = FORM_SECTIONS.length;

type SaveState = "idle" | "saving" | "saved" | "error";

interface Props {
  token: string;
  session: SessionState;
  /** The server rejected our token — hand control back to the gate. */
  onSessionLost: () => void;
  /** Submitted (or found already submitted) — swap to the read-only view. */
  onSubmitted: (submission: SubmissionState) => void;
  /** Revokes the session server-side; awaited so Exit can't outrun it. */
  onSignOut: () => Promise<void>;
}

const sameValues = (a: FormValues, b: FormValues) =>
  JSON.stringify(a) === JSON.stringify(b);

const ClientFormWizard = ({
  token,
  session,
  onSessionLost,
  onSubmitted,
  onSignOut,
}: Props) => {
  const [values, setValues] = useState<FormValues>(() => {
    const initial = (session.submission?.data as FormValues) ?? {};
    // The verified address is already known — don't make them type it twice.
    if (isBlank(initial.a_email)) {
      return { ...initial, a_email: session.email };
    }
    return initial;
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(
    session.submission ? new Date(session.submission.updatedAt) : null,
  );
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  /** Latches once submitted so autosave and the unload guard stand down. */
  const [submitted, setSubmitted] = useState(false);
  const [conflict, setConflict] = useState<FormValues | null>(null);
  const [restorePrompt, setRestorePrompt] = useState<LocalBackup | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBlanks, setPreviewBlanks] = useState(false);
  const [exitPrompt, setExitPrompt] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  // Refs mirror state that async callbacks need to read at call time rather
  // than at the time their closure was created.
  const navigate = useNavigate();
  const valuesRef = useRef(values);
  const dirtyRef = useRef(dirty);
  const serverUpdatedAt = useRef<string | null>(
    session.submission?.updatedAt ?? null,
  );
  const debounceTimer = useRef<number | null>(null);
  const inFlight = useRef(false);

  valuesRef.current = values;
  dirtyRef.current = dirty;

  const stats = useMemo(() => completionStats(values), [values]);
  // 92 fields re-validated on every keystroke otherwise.
  const missingRequired = useMemo(
    () => Object.keys(validateAll(values, false)),
    [values],
  );

  // --- Local backup --------------------------------------------------------
  // Written on every change so a crashed tab, a dead connection or an expired
  // session can never destroy typing that hadn't reached the server yet.

  useEffect(() => {
    backupStore.write(session.email, {
      data: values,
      savedAt: new Date().toISOString(),
      baseUpdatedAt: serverUpdatedAt.current,
      dirty,
    });
  }, [values, dirty, session.email]);

  // Offer to restore a newer local copy exactly once, on mount.
  useEffect(() => {
    const backup = backupStore.read(session.email);
    if (!backup || !backup.dirty) return;
    if (sameValues(backup.data, valuesRef.current)) return;

    const serverTime = session.submission
      ? new Date(session.submission.updatedAt).getTime()
      : 0;
    if (new Date(backup.savedAt).getTime() > serverTime) {
      setRestorePrompt(backup);
    }
    // Mount-only: a later re-run would fight the user's own edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Connectivity --------------------------------------------------------

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // --- Saving --------------------------------------------------------------

  const persist = useCallback(
    async (options: { force?: boolean; announce?: boolean } = {}) => {
      if (inFlight.current || submitted) return false;
      if (!options.force && !dirtyRef.current) return true;
      if (!navigator.onLine) {
        setSaveState("error");
        return false;
      }

      const snapshot = valuesRef.current;
      inFlight.current = true;
      setSaveState("saving");

      try {
        const result = await clientFormApi.saveDraft(
          token,
          snapshot,
          serverUpdatedAt.current ?? undefined,
        );
        serverUpdatedAt.current = result.updatedAt;
        setLastSavedAt(new Date(result.updatedAt));
        setSaveState("saved");
        // Anything typed while the request was in flight is still unsaved.
        if (sameValues(valuesRef.current, snapshot)) setDirty(false);
        if (options.announce) toast.success("Draft saved.");
        return true;
      } catch (caught) {
        const failure = caught as ClientFormError;

        if (failure.isSessionGone) {
          setSaveState("error");
          toast.error("Your session has ended.", {
            description:
              "Verify again to keep going — your answers are safe on this device.",
          });
          onSessionLost();
          return false;
        }

        if (failure.isAlreadySubmitted) {
          // Submitted from another device while this tab was still editing.
          setSubmitted(true);
          backupStore.clear(session.email);
          if (failure.serverDraft) onSubmitted(failure.serverDraft);
          return false;
        }

        if (failure.code === "CONFLICT") {
          setSaveState("error");
          setConflict((failure.serverDraft?.data as FormValues) ?? {});
          return false;
        }

        setSaveState("error");
        if (options.announce) {
          toast.error("Couldn't save your draft", {
            description: failure.message,
          });
        }
        return false;
      } finally {
        inFlight.current = false;
      }
    },
    [token, submitted, onSessionLost, onSubmitted, session.email],
  );

  // Debounced autosave.
  useEffect(() => {
    if (!dirty || submitted || conflict || !online) return;
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      void persist();
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    };
  }, [values, dirty, submitted, conflict, online, persist]);

  // Periodic backstop.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (dirtyRef.current && !conflict && navigator.onLine) void persist();
    }, AUTOSAVE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [persist, conflict]);

  // Push whatever is pending as soon as the connection comes back.
  useEffect(() => {
    if (online && dirty && !conflict && !submitted) void persist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  // Last line of defence for a closing tab.
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current || submitted) return;
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [submitted]);

  // --- Editing -------------------------------------------------------------

  const setField = useCallback((key: string, value: FieldValue) => {
    setValues((current) => ({ ...current, [key]: value }));
    setDirty(true);
    // Clear the error as soon as the client starts fixing it.
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const goToStep = useCallback(
    (next: number) => {
      setStep(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Checkpoint on every section change — the natural place to save.
      if (dirtyRef.current && !conflict && navigator.onLine) void persist();
    },
    [persist, conflict],
  );

  const focusField = useCallback((key: string) => {
    const container = document.querySelector(`[data-field="${key}"]`);
    if (!container) return;
    container.scrollIntoView({ behavior: "smooth", block: "center" });
    const control = container.querySelector<HTMLElement>(
      "input, textarea, [role='radiogroup']",
    );
    control?.focus({ preventScroll: true });
  }, []);

  // --- Submitting ----------------------------------------------------------

  const handleSubmit = useCallback(async () => {
    if (submitting) return;

    const found = validateAll(values, false);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const badSection = firstSectionWithError(found);
      if (badSection >= 0) {
        setStep(badSection);
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.setTimeout(() => focusField(Object.keys(found)[0]), 400);
      }
      toast.error("Some required answers are missing", {
        description: "We've highlighted what still needs an answer.",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Flush pending edits first so the submitted copy is the current one.
      if (dirtyRef.current) {
        const saved = await persist({ force: true });
        if (!saved) {
          setSubmitting(false);
          return;
        }
      }

      const result = await clientFormApi.submit(
        token,
        valuesRef.current,
        serverUpdatedAt.current ?? undefined,
      );

      backupStore.clear(session.email);
      setDirty(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      onSubmitted({
        id: result.id,
        status: "submitted",
        data: valuesRef.current,
        updatedAt: result.submittedAt,
        submittedAt: result.submittedAt,
        schemaVersion: session.schemaVersion,
      });
    } catch (caught) {
      const failure = caught as ClientFormError;

      if (failure.isSessionGone) {
        toast.error("Your session has ended.", {
          description: "Verify again to submit — your answers are safe.",
        });
        onSessionLost();
        return;
      }
      if (failure.isAlreadySubmitted) {
        setSubmitted(true);
        backupStore.clear(session.email);
        if (failure.serverDraft) onSubmitted(failure.serverDraft);
        return;
      }
      if (failure.code === "CONFLICT") {
        setConflict((failure.serverDraft?.data as FormValues) ?? {});
        return;
      }
      if (failure.fieldErrors) {
        setErrors(failure.fieldErrors);
        const badSection = firstSectionWithError(failure.fieldErrors);
        if (badSection >= 0) setStep(badSection);
      }
      toast.error("Couldn't submit the questionnaire", {
        description: failure.message,
      });
    } finally {
      setSubmitting(false);
    }
  }, [
    submitting,
    values,
    persist,
    token,
    session.email,
    session.schemaVersion,
    onSessionLost,
    onSubmitted,
    focusField,
  ]);

  // --- Leaving --------------------------------------------------------------

  /**
   * Exit always tries to save first. Signing a client out of a half-finished
   * questionnaire and losing the last few answers would be the worst possible
   * outcome, so a failed save keeps them here rather than pressing on.
   */
  const confirmExit = useCallback(async () => {
    setExiting(true);
    try {
      if (dirtyRef.current) {
        const saved = await persist({ force: true });
        if (!saved) {
          setExiting(false);
          setExitPrompt(false);
          toast.error("Couldn't save before exiting", {
            description:
              "Your answers are still here — check your connection and try again.",
          });
          return;
        }
      }
      await onSignOut();
      navigate("/");
    } finally {
      setExiting(false);
    }
  }, [persist, onSignOut, navigate]);

  // --- Conflict resolution -------------------------------------------------

  const keepMine = async () => {
    // Drop the version check so this write wins outright.
    serverUpdatedAt.current = null;
    setConflict(null);
    setDirty(true);
    await persist({ force: true, announce: true });
  };

  const takeTheirs = () => {
    if (conflict) {
      setValues(conflict);
      valuesRef.current = conflict;
    }
    serverUpdatedAt.current = null;
    setConflict(null);
    setDirty(false);
    setSaveState("idle");
    toast.success("Loaded the other version.");
    // Re-read the authoritative copy so the version check is armed again.
    void clientFormApi
      .session(token)
      .then((fresh) => {
        if (!fresh.submission) return;
        // The other device may have submitted rather than just saved.
        if (fresh.submission.status === "submitted") {
          setSubmitted(true);
          backupStore.clear(session.email);
          onSubmitted(fresh.submission);
          return;
        }
        serverUpdatedAt.current = fresh.submission.updatedAt;
        setLastSavedAt(new Date(fresh.submission.updatedAt));
      })
      .catch(() => undefined);
  };

  // --- Sub-views -----------------------------------------------------------

  // Once submitted the page swaps to the read-only view; render nothing here
  // rather than flashing the form again during that handover.
  if (submitted) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-gold" />
      </div>
    );
  }

  const currentSection = step < REVIEW_STEP ? FORM_SECTIONS[step] : null;

  const saveIndicator = () => {
    if (!online) {
      return (
        <span className="flex items-center gap-1.5 text-amber-600">
          <WifiOff className="h-3.5 w-3.5" />
          Offline — saved on this device
        </span>
      );
    }
    if (saveState === "saving") {
      return (
        <span className="flex items-center gap-1.5 text-slate">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving…
        </span>
      );
    }
    if (saveState === "error") {
      return (
        <span className="flex items-center gap-1.5 text-red-600">
          <CloudOff className="h-3.5 w-3.5" />
          Not saved — we'll keep trying
        </span>
      );
    }
    if (dirty) {
      return <span className="text-slate">Unsaved changes</span>;
    }
    if (lastSavedAt) {
      return (
        <span className="flex items-center gap-1.5 text-green-700">
          <Check className="h-3.5 w-3.5" />
          Saved {lastSavedAt.toLocaleTimeString()}
        </span>
      );
    }
    return <span className="text-slate">Not saved yet</span>;
  };

  return (
    <ClientFormShell
      action={
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-xs text-slate lg:inline">
            {stats.percent}% complete
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            disabled={submitting || exiting}
          >
            <FileSearch className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            size="sm"
            onClick={() => void handleSubmit()}
            disabled={submitting || exiting || !online}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
            ) : (
              <Send className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">
              {submitting ? "Submitting…" : "Submit"}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExitPrompt(true)}
            disabled={exiting || submitting}
            title="Save your progress and exit"
            aria-label="Save your progress and exit"
          >
            {exiting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </Button>
        </div>
      }
    >
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Section navigation */}
      {/* top-20 clears the shell's sticky h-16 bar. */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate">
                Progress
              </span>
              <span className="text-sm font-semibold text-navy">
                {stats.percent}%
              </span>
            </div>
            <Progress value={stats.percent} className="h-2" />
            <p className="mt-1.5 text-xs text-slate">
              {stats.answered} of {stats.total} answered
            </p>
          </div>

          <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:pb-0">
            {FORM_SECTIONS.map((section, index) => {
              const sectionCount = sectionStats(section, values);
              const complete =
                sectionCount.total > 0 &&
                sectionCount.answered === sectionCount.total;
              const hasError = section.fields.some((f) => errors[f.key]);
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => goToStep(index)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors lg:w-full",
                    step === index
                      ? "bg-navy text-white"
                      : "text-slate hover:bg-slate-50 hover:text-navy",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold",
                      step === index
                        ? "bg-white/20 text-white"
                        : hasError
                          ? "bg-red-100 text-red-600"
                          : complete
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate",
                    )}
                  >
                    {section.letter}
                  </span>
                  <span className="truncate lg:flex-1">{section.title}</span>
                  <span
                    className={cn(
                      "hidden text-[11px] lg:inline",
                      step === index ? "text-white/70" : "text-slate",
                    )}
                  >
                    {sectionCount.answered}/{sectionCount.total}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => goToStep(REVIEW_STEP)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors lg:mt-1 lg:w-full lg:border-t lg:border-slate-100 lg:pt-3",
                step === REVIEW_STEP
                  ? "bg-navy text-white"
                  : "text-slate hover:bg-slate-50 hover:text-navy",
              )}
            >
              <Send className="h-4 w-4 shrink-0" />
              Review &amp; submit
            </button>
          </nav>
        </div>

        <p className="mt-3 hidden px-1 text-xs text-slate lg:block">
          Signed in as{" "}
          <span className="font-medium text-navy">{session.email}</span>
        </p>
      </aside>

      {/* Form body */}
      <div className="min-w-0">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-8">
          {currentSection ? (
            <motion.div
              key={currentSection.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6 border-b border-slate-100 pb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Section {currentSection.letter} of J
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-navy">
                  {currentSection.title}
                </h2>
                {currentSection.description && (
                  <p className="mt-2 text-sm text-slate">
                    {currentSection.description}
                  </p>
                )}
                <p className="mt-3 rounded-md bg-gold/10 px-3 py-2 text-xs text-navy">
                  {REQUIRED_HINT}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {currentSection.fields
                  .filter((field) => isFieldVisible(field, values))
                  .map((field) => (
                    <ClientFormField
                      key={field.key}
                      field={field}
                      value={values[field.key]}
                      error={errors[field.key]}
                      disabled={submitting}
                      onChange={(value) => setField(field.key, value)}
                    />
                  ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6 border-b border-slate-100 pb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Final step
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-navy">
                  Review &amp; submit
                </h2>
                <p className="mt-2 text-sm text-slate">{REQUIRED_HINT}</p>
              </div>

              <ul className="mb-6 space-y-2">
                {FORM_SECTIONS.map((section, index) => {
                  const count = sectionStats(section, values);
                  const complete = count.answered === count.total;
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => goToStep(index)}
                        className="flex w-full items-center gap-3 rounded-lg border border-slate-100 px-4 py-3 text-left transition-colors hover:border-gold/40 hover:bg-slate-50"
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                            complete
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate",
                          )}
                        >
                          {section.letter}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-navy">
                          {section.title}
                        </span>
                        <span className="shrink-0 text-xs text-slate">
                          {count.answered}/{count.total}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {missingRequired.length > 0 && (
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-amber-900">
                    <AlertTriangle className="h-4 w-4" />
                    {missingRequired.length} required answer
                    {missingRequired.length === 1 ? "" : "s"} still needed
                  </p>
                  <ul className="mt-2 space-y-1">
                    {missingRequired.slice(0, 8).map((key) => (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => {
                            const index = FORM_SECTIONS.findIndex((s) =>
                              s.fields.some((f) => f.key === key),
                            );
                            if (index >= 0) {
                              setStep(index);
                              window.setTimeout(() => focusField(key), 300);
                            }
                          }}
                          className="text-left text-xs text-amber-800 underline underline-offset-2 hover:text-amber-900"
                        >
                          {
                            FORM_SECTIONS.flatMap((s) => s.fields).find(
                              (f) => f.key === key,
                            )?.label
                          }
                        </button>
                      </li>
                    ))}
                  </ul>
                  {missingRequired.length > 8 && (
                    <p className="mt-2 text-xs text-amber-800">
                      …and {missingRequired.length - 8} more. Sections with an
                      incomplete count in the list above still need answers.
                    </p>
                  )}
                </div>
              )}

              <Button
                onClick={() => void handleSubmit()}
                disabled={submitting || !online}
                size="lg"
                className="w-full"
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {submitting ? "Submitting…" : "Submit questionnaire"}
              </Button>
              <p className="mt-3 text-center text-xs text-slate">
                You won't be able to edit your answers after submitting.
              </p>
            </motion.div>
          )}
        </div>

        {/* Action bar */}
        <div className="sticky bottom-0 z-10 mt-4 rounded-2xl border border-slate-100 bg-white/95 p-3 shadow-lg backdrop-blur md:p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="order-3 w-full text-xs md:order-1 md:w-auto md:flex-1">
              {saveIndicator()}
            </div>

            <div className="order-1 flex flex-1 gap-2 md:order-2 md:flex-none">
              <Button
                variant="outline"
                onClick={() => goToStep(Math.max(step - 1, 0))}
                disabled={step === 0 || submitting}
                className="flex-1 md:flex-none"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => goToStep(Math.min(step + 1, REVIEW_STEP))}
                disabled={step === REVIEW_STEP || submitting}
                className="flex-1 md:flex-none"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={() => void persist({ force: true, announce: true })}
              disabled={saveState === "saving" || submitting || !online}
              className="order-2 md:order-3"
            >
              {saveState === "saving" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save draft
            </Button>
          </div>
        </div>

        <p className="mt-4 px-1 text-center text-xs text-slate lg:hidden">
          Signed in as {session.email} ·{" "}
          <button
            type="button"
            onClick={() => setExitPrompt(true)}
            disabled={exiting || submitting}
            className="underline underline-offset-2"
          >
            Save &amp; exit
          </button>
        </p>
      </div>

      {/* Restore-from-this-device prompt */}
      <AlertDialog
        open={!!restorePrompt}
        onOpenChange={(open) => !open && setRestorePrompt(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved answers found</AlertDialogTitle>
            <AlertDialogDescription>
              This device has answers from{" "}
              {restorePrompt
                ? new Date(restorePrompt.savedAt).toLocaleString()
                : ""}{" "}
              that never reached the server — most likely the connection dropped.
              Would you like to restore them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                backupStore.clear(session.email);
                setRestorePrompt(null);
              }}
            >
              Discard them
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (restorePrompt) {
                  setValues(restorePrompt.data);
                  setDirty(true);
                }
                setRestorePrompt(null);
              }}
            >
              Restore answers
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Two-device conflict */}
      <AlertDialog open={!!conflict}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>This questionnaire changed elsewhere</AlertDialogTitle>
            <AlertDialogDescription>
              Someone using this email updated the questionnaire on another
              device or tab. Keep the answers on this screen, or load the other
              version instead? Whichever you don't keep will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={takeTheirs}>
              Load the other version
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => void keepMine()}>
              Keep what's on this screen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview — read back exactly what will be sent */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold text-navy">
              Preview your answers
            </DialogTitle>
            <DialogDescription>
              {stats.answered} of {stats.total} questions answered. Unanswered
              questions are hidden here — tick the box below to see the gaps.
            </DialogDescription>
          </DialogHeader>

          <label className="flex cursor-pointer items-center gap-2 border-b border-slate-100 pb-3 text-sm text-slate">
            <input
              type="checkbox"
              checked={previewBlanks}
              onChange={(e) => setPreviewBlanks(e.target.checked)}
              className="rounded border-slate-300"
            />
            Show unanswered questions
          </label>

          <AnswerList values={values} includeBlanks={previewBlanks} />

          <div className="sticky bottom-0 -mx-6 flex flex-col gap-2 border-t border-slate-100 bg-white px-6 pt-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Keep editing
            </Button>
            <Button
              onClick={() => {
                setPreviewOpen(false);
                void handleSubmit();
              }}
              disabled={submitting || !online}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit questionnaire
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save & exit */}
      <AlertDialog
        open={exitPrompt}
        onOpenChange={(open) => !open && !exiting && setExitPrompt(false)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Save your progress and exit?</AlertDialogTitle>
            <AlertDialogDescription>
              We'll save everything you've entered, then sign you out of this
              device. To carry on later, open the questionnaire again and verify
              with your email — your answers will be waiting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={exiting}>
              Keep working
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={exiting}
              onClick={(event) => {
                // Hold the dialog open until the save and sign-out finish.
                event.preventDefault();
                void confirmExit();
              }}
            >
              {exiting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {exiting ? "Saving…" : "Save & exit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </ClientFormShell>
  );
};

export default ClientFormWizard;
