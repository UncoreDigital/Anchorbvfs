import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Lock, Save, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { MetaTags } from "@/components/MetaTags";
import ClientFormGate from "@/components/clientForm/ClientFormGate";
import ClientFormWizard from "@/components/clientForm/ClientFormWizard";
import ClientFormCompleted from "@/components/clientForm/ClientFormCompleted";
import { useClientFormSession } from "@/hooks/useClientFormSession";
import type { SubmissionState } from "@/lib/clientForm/api";

const assurances = [
  {
    icon: Lock,
    title: "Password + code protected",
    description:
      "Two things are needed to open it: the access password we share with you, and a one-time code emailed to your address.",
  },
  {
    icon: Save,
    title: "Save and come back",
    description:
      "It's a long questionnaire. Save and exit at any point, then verify again to pick up exactly where you left off, on any device.",
  },
  {
    icon: ShieldCheck,
    title: "Private to our team",
    description:
      "Answers travel over an encrypted connection and are readable only by Anchor staff — never published or indexed.",
  },
];

const ClientQuestionnaire = () => {
  const { status, token, session, expiredNotice, startSession, invalidate, signOut } =
    useClientFormSession();

  // Holds the finished questionnaire independently of the session, because the
  // session is deliberately destroyed the moment one is submitted.
  const [finished, setFinished] = useState<{
    email: string;
    submission: SubmissionState;
  } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * A submitted questionnaire ends the session — on submit, and again if the
   * client verifies later to read it back. The answers stay on screen for this
   * visit only; the token behind them is already revoked, so walking away from
   * a shared computer doesn't leave the questionnaire open behind you.
   */
  const finish = useCallback(
    (email: string, submission: SubmissionState) => {
      setFinished({ email, submission });
      void signOut();
    },
    [signOut],
  );

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.submission?.status === "submitted"
    ) {
      finish(session.email, session.submission);
    }
  }, [status, session, finish]);

  // --- Full-screen views: no site header, banner or footer -----------------

  if (finished) {
    return (
      <>
        <Helmet>
          <title>Questionnaire submitted | Anchor Business Valuations</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <ClientFormCompleted
          email={finished.email}
          submission={finished.submission}
        />
      </>
    );
  }

  if (status === "authenticated" && token && session) {
    return (
      <>
        <Helmet>
          <title>Company Informational Questionnaire | Anchor</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <ClientFormWizard
          token={token}
          session={session}
          onSessionLost={invalidate}
          onSubmitted={(submission) => finish(session.email, submission)}
          onSignOut={signOut}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Company Informational Questionnaire | Anchor Business Valuations"
        description="Secure client questionnaire for Anchor Business Valuations & Financial Services engagements."
        url="https://anchorbvfs.com/questionnaire"
      />
      {/* Private client area — keep it out of search results entirely. */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />
      <PageBanner
        title="Company Informational Questionnaire"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Questionnaire" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {status === "checking" && (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-slate">
                <Loader2 className="h-7 w-7 animate-spin text-gold" />
                <p className="text-sm">Checking your access…</p>
              </div>
            </div>
          )}

          {status === "anonymous" && (
            <>
              <div className="mx-auto mb-10 max-w-2xl text-center">
                <h2 className="mb-3 font-display text-2xl font-bold text-navy md:text-3xl">
                  Client questionnaire
                </h2>
                <p className="text-slate">
                  This questionnaire gathers the background our analysts need to
                  value your business. It's detailed by design — you can save
                  your progress and return to it as often as you like.
                </p>
              </div>

              <div className="mx-auto mb-10 grid max-w-4xl gap-5 md:grid-cols-3">
                {assurances.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                      <item.icon className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="mb-1.5 font-display text-base font-bold text-navy">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <ClientFormGate
                onVerified={startSession}
                expiredNotice={expiredNotice}
              />
            </>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClientQuestionnaire;
