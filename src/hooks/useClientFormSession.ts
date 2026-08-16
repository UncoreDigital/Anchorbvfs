import { useCallback, useEffect, useRef, useState } from "react";
import {
  ClientFormError,
  clientFormApi,
  type SessionState,
  type VerifyOtpResult,
} from "@/lib/clientForm/api";
import { tokenStore } from "@/lib/clientForm/storage";

export type SessionStatus = "checking" | "anonymous" | "authenticated";

interface State {
  status: SessionStatus;
  token: string | null;
  session: SessionState | null;
  /** Set when a stored token existed but the server rejected it. */
  expiredNotice: boolean;
}

/**
 * Owns the questionnaire's access token: restores it on load, hands it to the
 * form, and drops it the moment the server says it is no longer good.
 */
export function useClientFormSession() {
  const [state, setState] = useState<State>({
    status: "checking",
    token: null,
    session: null,
    expiredNotice: false,
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Restore a stored token exactly once on mount.
  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setState((s) => ({ ...s, status: "anonymous" }));
      return;
    }

    let cancelled = false;
    clientFormApi
      .session(token)
      .then((session) => {
        if (cancelled || !mounted.current) return;
        setState({
          status: "authenticated",
          token,
          session,
          expiredNotice: false,
        });
      })
      .catch((error: unknown) => {
        if (cancelled || !mounted.current) return;
        const failure = error as ClientFormError;

        // A network blip on a cold load must not throw away a valid token —
        // keep it and let the user retry rather than forcing re-verification.
        if (failure instanceof ClientFormError && failure.isTransient) {
          setState({
            status: "anonymous",
            token: null,
            session: null,
            expiredNotice: false,
          });
          return;
        }

        tokenStore.clear();
        setState({
          status: "anonymous",
          token: null,
          session: null,
          expiredNotice: true,
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const startSession = useCallback((result: VerifyOtpResult) => {
    const { token, ...session } = result;
    tokenStore.set(token);
    setState({
      status: "authenticated",
      token,
      session,
      expiredNotice: false,
    });
  }, []);

  /** Called when the server reports the token is gone mid-session. */
  const invalidate = useCallback(() => {
    tokenStore.clear();
    setState({
      status: "anonymous",
      token: null,
      session: null,
      expiredNotice: true,
    });
  }, []);

  const signOut = useCallback(async () => {
    const token = state.token;
    tokenStore.clear();
    setState({
      status: "anonymous",
      token: null,
      session: null,
      expiredNotice: false,
    });
    if (token) {
      // Best effort — the local token is already gone either way.
      try {
        await clientFormApi.signOut(token);
      } catch {
        /* no-op */
      }
    }
  }, [state.token]);

  return {
    status: state.status,
    token: state.token,
    session: state.session,
    expiredNotice: state.expiredNotice,
    startSession,
    invalidate,
    signOut,
  };
}
