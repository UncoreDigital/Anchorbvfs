// localStorage helpers for the questionnaire.
//
// Two separate concerns live here:
//   1. the session token — the only credential the browser holds
//   2. a local answer backup — so a dropped connection or a closed tab can
//      never lose typing that hadn't reached the server yet
//
// Every access is wrapped: Safari in private mode and browsers with storage
// disabled throw on both read and write, and the form must still work.

import type { FormValues } from "./schema";

const TOKEN_KEY = "abvfs.clientForm.token";
const BACKUP_PREFIX = "abvfs.clientForm.backup.";

/** Backups older than this are stale enough to be worth discarding. */
const BACKUP_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Quota exceeded or storage disabled — the server copy is authoritative.
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* no-op */
  }
}

export const tokenStore = {
  get: () => safeGet(TOKEN_KEY),
  set: (token: string) => safeSet(TOKEN_KEY, token),
  clear: () => safeRemove(TOKEN_KEY),
};

export interface LocalBackup {
  data: FormValues;
  /** When this snapshot was taken in the browser. */
  savedAt: string;
  /** The server `updated_at` this snapshot was based on, if any. */
  baseUpdatedAt: string | null;
  /** False once the same content has been confirmed saved server-side. */
  dirty: boolean;
}

function backupKey(email: string): string {
  return `${BACKUP_PREFIX}${email.toLowerCase()}`;
}

export const backupStore = {
  read(email: string): LocalBackup | null {
    const raw = safeGet(backupKey(email));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as LocalBackup;
      if (!parsed || typeof parsed !== "object" || !parsed.data) return null;
      if (Date.now() - new Date(parsed.savedAt).getTime() > BACKUP_TTL_MS) {
        safeRemove(backupKey(email));
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  write(email: string, backup: LocalBackup): void {
    safeSet(backupKey(email), JSON.stringify(backup));
  },

  clear(email: string): void {
    safeRemove(backupKey(email));
  },
};
