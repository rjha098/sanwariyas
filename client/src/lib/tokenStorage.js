// FILE: client/src/lib/tokenStorage.js
// PURPOSE: Single source of truth for where the auth token lives in the browser.
//
// WHY THIS FILE EXISTS:
//   sessionStorage clears per-tab — opening a new tab logs the user out even
//   though their session is still valid server-side. localStorage persists
//   across tabs AND across browser restarts, which is what "stay logged in
//   for 7 days on this browser" requires.
//
//   Centralizing the storage key/logic here means if you ever need to change
//   strategy again (e.g. move to httpOnly cookies for better XSS protection),
//   you only touch ONE file instead of hunting through every component.

const TOKEN_KEY = 'sanwariyas_token';
const TOKEN_TIMESTAMP_KEY = 'sanwariyas_token_issued_at';

// Matches the server's AUTH_TOKEN_EXPIRY (default 7d). Used for a CLIENT-SIDE
// safety net only — the server JWT itself is the real source of truth for
// expiry. This just avoids sending an obviously-stale token on app load.
// const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_AGE_MS = 1 * 24 * 60 * 60 * 1000; // 1 day

export const tokenStorage = {
  get() {
    if (typeof window === 'undefined') return null;
    try {
      const token = window.localStorage.getItem(TOKEN_KEY);
      const issuedAt = window.localStorage.getItem(TOKEN_TIMESTAMP_KEY);

      if (!token) return null;

      // Client-side staleness check — if it's obviously older than 7 days,
      // don't even bother sending it to the server. Saves a wasted request.
      if (issuedAt) {
        const age = Date.now() - parseInt(issuedAt, 10);
        if (age > MAX_AGE_MS) {
          tokenStorage.clear();
          return null;
        }
      }

      return token;
    } catch {
      // localStorage can throw in some privacy modes (Safari private browsing,
      // browser storage disabled by policy) — fail safe, treat as logged out.
      return null;
    }
  },

  set(token) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem(TOKEN_TIMESTAMP_KEY, String(Date.now()));
    } catch {
      // Storage full or disabled — silently ignore, user will just need to
      // log in again next time, no crash.
    }
  },

  clear() {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    } catch {
      // ignore
    }
  },
};