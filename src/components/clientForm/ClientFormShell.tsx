import type { ReactNode } from "react";

interface Props {
  /** Top-right control — "Save & exit" while filling, "Return" once done. */
  action?: ReactNode;
  children: ReactNode;
}

/**
 * Distraction-free chrome for the questionnaire itself.
 *
 * Once a client is through the gate the site header, page banner and footer are
 * gone: 92 questions is enough to hold on screen without navigation competing
 * for attention, and there is nowhere else on the site they should be heading
 * mid-form. All that survives is a slim identity bar and the exit.
 */
const ClientFormShell = ({ action, children }: Props) => (
  <div className="min-h-screen bg-slate-50">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="Anchor Business Valuations"
            className="h-8 w-auto shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-navy">
              Company Informational Questionnaire
            </p>
            <p className="hidden truncate text-xs leading-tight text-slate sm:block">
              Anchor Business Valuations &amp; Financial Services, LLC
            </p>
          </div>
        </div>
        {action}
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">{children}</main>
  </div>
);

export default ClientFormShell;
