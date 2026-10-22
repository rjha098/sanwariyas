// FILE: client/src/components/auth/GoogleLinkForm.js
// PURPOSE: Shown when someone signs in with Google but a PASSWORD account with
// the same email already exists. Google is connected to that account only
// after the account password is entered (proof of ownership).
"use client";

import { useEffect, useState } from "react";

const inp =
  "w-full min-w-0 border border-brand-lightgold/60 px-4 py-3 text-base sm:text-sm bg-white focus:outline-none focus:border-brand-coffee transition-colors";
const lbl =
  "block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2";
const btn =
  "w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const mmss = (s) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function GoogleLinkForm({ submitting, onSubmit, onCancel }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lockSeconds, setLockSeconds] = useState(0);

  useEffect(() => {
    if (lockSeconds <= 0) return undefined;
    const t = setTimeout(() => setLockSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [lockSeconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || lockSeconds > 0 || !password) return;
    setError("");
    const result = await onSubmit(password);
    if (result && result.success === false) {
      if (result.retryAfterSeconds) setLockSeconds(result.retryAfterSeconds);
      setError(
        result.attemptsLeft != null
          ? `${result.error} ${result.attemptsLeft} attempt(s) left.`
          : result.error,
      );
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="pb-4 border-b border-brand-lightgold/30">
        <h2 className="font-display text-2xl text-brand-african">
          Connect Google
        </h2>
        <p className="font-sans text-xs text-brand-mud mt-1">
          An account with your Google email already exists. Enter that
          account&apos;s password once to connect Google to it. Your inquiries
          and orders stay exactly as they are.
        </p>
      </div>

      <div>
        <label className={lbl}>Account password</label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inp}
          disabled={lockSeconds > 0}
          autoFocus
        />
      </div>

      {lockSeconds > 0 ? (
        <p className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
          Too many incorrect attempts. Try again in {mmss(lockSeconds)}.
        </p>
      ) : (
        error && (
          <p className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
            {error}
          </p>
        )
      )}

      <button
        type="submit"
        disabled={submitting || lockSeconds > 0 || !password}
        className={btn}
      >
        {submitting ? "Connecting..." : "Connect & Sign In"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee"
      >
        ← Cancel
      </button>
    </form>
  );
}