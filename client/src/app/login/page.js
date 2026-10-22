// FILE: client/src/app/login/page.js

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Toast from "@/components/ui/Toast";
import api from "@/lib/api";
import SignupForm from "@/components/auth/SignupForm";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import GoogleProfileForm from "@/components/auth/GoogleProfileForm";
import GoogleLinkForm from "@/components/auth/GoogleLinkForm";
import {
  PASSWORD_CHECKS,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/phoneRules";

const inp =
  "w-full min-w-0 border border-brand-lightgold/60 px-4 py-3 text-base sm:text-sm bg-white focus:outline-none focus:border-brand-coffee transition-colors";
const lbl =
  "block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2";
const btn =
  "w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

// ── OTP Screen (Used for Admin login) ─────────────────────────────────────────
function OtpScreen({ emailHint, devOtp, verifyingOtp, onSubmit, onBack }) {
  const [otp, setOtp] = useState("");
  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-brand-lightgold/30">
        <h2 className="font-display text-2xl text-brand-african">Verify OTP</h2>
        <p className="font-sans text-xs text-brand-mud mt-1">
          A 6-digit code was sent to <strong>{emailHint}</strong>. Valid for 10
          minutes.
        </p>
      </div>
      {devOtp && (
        <p className="font-sans text-xs text-brand-coffee bg-brand-lightgold/20 border border-brand-lightgold/50 px-4 py-3">
          Local dev OTP: <strong>{devOtp}</strong>
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (otp.length === 6) onSubmit(otp);
        }}
        className="space-y-5"
        noValidate
        aria-label="OTP Verification Form"
      >
        <div>
          <label className={lbl}>One-Time Password</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="• • • • • •"
            aria-label="Enter 6-digit OTP"
            className={`${inp} text-center text-2xl tracking-[0.6em] font-mono`}
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={verifyingOtp || otp.length !== 6}
          className={btn}
          title="Verify OTP and Sign In"
        >
          {verifyingOtp ? "Verifying..." : "Verify & Sign In"}
        </button>
        <button
          type="button"
          onClick={onBack}
          title="Go back to login screen"
          className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee transition-colors"
        >
          ← Back
        </button>
      </form>
    </div>
  );
}

// ── Forgot Password Screen

const RESET_FLOW_KEY = "sw_reset_flow";
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function ForgotPasswordScreen({ onBack, onResetSuccess, onSwitchToSignup }) {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localErr, setLocalErr] = useState("");
  const [lockSeconds, setLockSeconds] = useState(0);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(null);

  const email = identifier.trim().toLowerCase();
  const locked = lockSeconds > 0;
  const opts = { skipRateLimitRetry: true };

  const syncFromBackend = (d) => {
    if (!d) return;
    setLockSeconds(d.locked ? d.retryAfterSeconds || 0 : 0);
    setResendSeconds(d.resendAfterSeconds || 0);
    setAttemptsLeft(d.locked ? null : (d.attemptsLeft ?? null));
  };

  const saveFlow = (e) => {
    try {
      sessionStorage.setItem(
        RESET_FLOW_KEY,
        JSON.stringify({ email: e, step: 2 }),
      );
    } catch {
      // storage blocked: the backend still enforces everything
    }
  };
  const clearFlow = () => {
    try {
      sessionStorage.removeItem(RESET_FLOW_KEY);
    } catch {
      // ignore
    }
  };

  const fetchStatus = async (e) => {
    try {
      const res = await api.post("/auth/reset-status", { email: e }, opts);
      syncFromBackend(res.data);
    } catch {
      // keep whatever the screen already shows
    }
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(RESET_FLOW_KEY) || "null");
      if (saved?.email && saved.step === 2) {
        setIdentifier(saved.email);
        setStep(2);
        fetchStatus(saved.email);
      }
    } catch {
      // ignore malformed storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lockSeconds <= 0 && resendSeconds <= 0) return undefined;
    const t = setTimeout(() => {
      setResendSeconds((s) => (s > 0 ? s - 1 : 0));
      setLockSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearTimeout(t);
  }, [lockSeconds, resendSeconds]);

  const wasLocked = useRef(false);
  useEffect(() => {
    if (lockSeconds > 0) {
      wasLocked.current = true;
      return;
    }
    if (wasLocked.current) {
      wasLocked.current = false;
      if (email) fetchStatus(email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockSeconds]);

  const handleApiError = (err, fallback) => {
    const d = err.response?.data || {};
    if (err.response?.status === 429) {
      if (d.code === "OTP_LOCKED") {
        setLockSeconds(d.retryAfterSeconds || 60);
        setResendSeconds(d.retryAfterSeconds || 60);
        setAttemptsLeft(null);
        setLocalErr("");
        return;
      }
      if (d.resendAfterSeconds) {
        setResendSeconds(d.resendAfterSeconds);
        setLocalErr(d.message || "Please wait before requesting another code.");
        return;
      }
      const ra = parseInt(err.response?.headers?.["retry-after"], 10);
      setLockSeconds(Number.isFinite(ra) && ra > 0 ? ra : 60);
      setLocalErr("");
      return;
    }
    if (d.attemptsLeft != null) setAttemptsLeft(d.attemptsLeft);
    setLocalErr(d.message || fallback);
  };

  const requestCode = async () => {
    setLoading(true);
    setLocalErr("");
    try {
      const res = await api.post(
        "/auth/forgot-password",
        { identifier: email },
        opts,
      );
      if (res.data.success) {
        setOtp("");
        setStep(2);
        setResendSeconds(res.data.resendAfterSeconds || 60);
        saveFlow(email);
        fetchStatus(email);
      }
    } catch (err) {
      handleApiError(err, "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email || locked || resendSeconds > 0) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalErr("Please enter a valid email address.");
      return;
    }
    await requestCode();
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || locked) return;
    setLoading(true);
    setLocalErr("");
    try {
      const res = await api.post(
        "/auth/verify-reset-code",
        { email, otp },
        opts,
      );
      if (res.data.success && res.data.resetToken) {
        setResetToken(res.data.resetToken);
        setStep(3);
      }
    } catch (err) {
      setOtp("");
      handleApiError(err, "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  const pwChecks = PASSWORD_CHECKS.map((c) => ({
    ...c,
    ok: c.test(newPassword),
  }));

  const handleReset = async (e) => {
    e.preventDefault();
    const pwErr = validatePassword(newPassword);
    const confirmErr = validateConfirmPassword(newPassword, confirmPassword);
    if (pwErr || confirmErr) {
      setLocalErr(pwErr || confirmErr);
      return;
    }
    setLoading(true);
    setLocalErr("");
    try {
      const res = await api.post(
        "/auth/reset-password",
        { email, resetToken, newPassword, confirmPassword },
        opts,
      );
      if (res.data.success) {
        setResetToken("");
        clearFlow();
        onResetSuccess(res.data.message);
      }
    } catch (err) {
      handleApiError(err, "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const errBox = localErr && (
    <p className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
      {localErr}
    </p>
  );

  const lockBox = locked && (
    <p
      className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3"
      role="alert"
    >
      Too many incorrect attempts. Please try again in{" "}
      <strong>{mmss(lockSeconds)}</strong>. Requesting a new code is not
      possible until then.
    </p>
  );

  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-brand-lightgold/30">
        <h2 className="font-display text-2xl text-brand-african">
          Reset Password
        </h2>
        <p className="font-sans text-xs text-brand-mud mt-1">
          {step === 1
            ? "Enter your registered email to receive a reset code."
            : step === 2
              ? `If an account exists for ${email}, a 6-digit code has been emailed to it. It is valid for 10 minutes.`
              : "Code verified. Choose a new password."}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div>
            <label className={lbl}>Email</label>
            <input
              type="email"
              autoComplete="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com"
              className={inp}
              required
            />
          </div>
          {lockBox}
          {errBox}
          <button
            type="submit"
            disabled={loading || !identifier.trim() || locked || resendSeconds > 0}
            className={btn}
          >
            {loading
              ? "Sending..."
              : resendSeconds > 0 && !locked
                ? `Wait ${resendSeconds}s`
                : "Send Reset Code"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee"
          >
            ← Back to Login
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode} className="space-y-5">
          <div>
            <label className={lbl}>Enter 6-digit code</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
              className={`${inp} text-center tracking-[0.4em] font-mono`}
              disabled={locked}
              required
            />
          </div>
          {lockBox}
          {!locked && attemptsLeft != null && attemptsLeft < 5 && (
            <p className="font-sans text-[11px] text-brand-mud">
              {attemptsLeft} attempt{attemptsLeft === 1 ? "" : "s"} left.
            </p>
          )}
          {errBox}
          <button
            type="submit"
            disabled={loading || otp.length !== 6 || locked}
            className={btn}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                clearFlow();
                setLocalErr("");
                setStep(1);
              }}
              className="font-sans text-xs text-brand-mud underline hover:text-brand-coffee"
            >
              ← Change email
            </button>
            {!locked && (
              <button
                type="button"
                onClick={requestCode}
                disabled={loading || resendSeconds > 0}
                className="font-sans text-xs text-brand-mud underline hover:text-brand-coffee disabled:opacity-50 disabled:no-underline"
              >
                {resendSeconds > 0
                  ? `Resend code in ${resendSeconds}s`
                  : "Resend code"}
              </button>
            )}
          </div>

          <p className="text-center font-sans text-[11px] text-brand-mud pt-1">
            Didn&apos;t get a code, or wrong email?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="underline hover:text-brand-coffee"
            >
              Create a new account
            </button>
          </p>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleReset} className="space-y-5" noValidate>
          <div>
            <label className={lbl}>New Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a strong password"
                className={`${inp} pr-16`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-sans text-[10px] uppercase tracking-wider text-brand-mud hover:text-brand-coffee"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            {newPassword.length > 0 && (
              <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                {pwChecks.map((c) => (
                  <li
                    key={c.key}
                    className={`font-sans text-[11px] leading-snug ${
                      c.ok ? "text-green-700" : "text-brand-mud/70"
                    }`}
                  >
                    <span aria-hidden="true">{c.ok ? "✓" : "○"}</span>{" "}
                    {c.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className={lbl}>Confirm Password</label>
            <input
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={inp}
              required
            />
          </div>
          {errBox}
          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className={btn}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}

// ── Sign In Form ──────────────────────────────────────────────────────────────
function SignInForm({ onLogin, loggingIn, onForgot, onSwitchToSignup }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin(identifier.trim(), password);
      }}
      className="space-y-5"
      noValidate
      aria-label="B2B Wholesale Portal Sign In Form"
    >
      <div>
        <label className={lbl}>Email or Phone</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="you@example.com or +91..."
          className={inp}
          autoComplete="username"
          aria-label="Email or Phone Number for B2B Login"
          required
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className={`${lbl} !mb-0`}>Password</label>
          <button
            type="button"
            onClick={onForgot}
            className="font-sans text-[10px] text-brand-coffee hover:underline uppercase tracking-wider transition-colors"
          >
            Forgot Password?
          </button>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inp}
          autoComplete="current-password"
          aria-label="Password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loggingIn || !identifier.trim() || !password.trim()}
        className={btn}
        title="Sign In to Wholesale Dashboard"
      >
        {loggingIn ? "Please wait..." : "Sign In"}
      </button>

      <p className="text-center font-sans text-[11px] text-brand-mud/80">
        Signed up with Google? Use &ldquo;Forgot Password&rdquo; once to add a
        password, then you can use either way to sign in.
      </p>
      <p className="text-center font-sans text-[11px] text-brand-mud pt-1">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="underline hover:text-brand-coffee"
        >
          Create one
        </button>
      </p>
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [redirecting, setRedirecting] = useState(false);
  const [googleSignup, setGoogleSignup] = useState(null);
  const [googleLink, setGoogleLink] = useState(null);
  const [returnTo, setReturnTo] = useState("/");
  const redirectTimeoutRef = useRef(null);

  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  const {
    login,
    loginError,
    setLoginError,
    loggingIn,
    otpPending,
    emailHint,
    devOtp,
    otpError,
    verifyingOtp,
    submitOtp,
    cancelOtp,
    signup,
    signupError,
    setSignupError,
    signingUp,
    signupDone,
    googleLogin,
    googleComplete,
    googleLinkExisting,
    googleBusy,
    isAuthenticated,
    isAdmin,
    isStaff,
    authChecking,
  } = useAuth();

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);

      const queryMode = urlParams.get("mode");
      if (
        queryMode === "signup" ||
        queryMode === "signin" ||
        queryMode === "forgot"
      ) {
        setMode(queryMode);
      }

      const redirectParam = urlParams.get("redirect");
      if (redirectParam && redirectParam.startsWith("/")) {
        setReturnTo(redirectParam);
      }

      try {
        const pending = sessionStorage.getItem("pending_toast");
        if (pending) {
          sessionStorage.removeItem("pending_toast");
          const { message, type } = JSON.parse(pending);
          if (message) showToast(message, type === "success" ? "success" : "error");
        }
      } catch {
        // malformed/blocked storage: ignore
      }

      if (urlParams.get("session_expired") === "true") {
        const reason = urlParams.get("reason");
        showToast(
          reason
            ? decodeURIComponent(reason)
            : "Session expired. Please log in again.",
          "error",
        );
        const newUrl = queryMode ? `/login?mode=${queryMode}` : "/login";
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  useEffect(() => {
    if (loginError) {
      showToast(loginError, "error");
      setLoginError("");
    }
  }, [loginError, setLoginError]);

  useEffect(() => {
    if (otpError) showToast(otpError, "error");
  }, [otpError]);

  useEffect(() => {
    if (signupError) {
      showToast(signupError, "error");
      setSignupError("");
    }
  }, [signupError, setSignupError]);

  useEffect(() => {
    if (signupDone) {
      showToast(
        "Account created! Sign in to access your dashboard.",
        "success",
      );
      setMode("signin");
    }
  }, [signupDone]);

  useEffect(() => {
    if (!authChecking && isAuthenticated && !redirecting) {
      router.replace(isAdmin || isStaff ? "/operations-center" : returnTo);
    }
  }, [
    authChecking,
    isAuthenticated,
    isAdmin,
    isStaff,
    redirecting,
    router,
    returnTo,
  ]);

  const switchMode = (m) => {
    setMode(m);
    setLoginError?.("");
    setSignupError?.("");
  };

  const REDIRECT_DELAY_MS = 700;

  const redirectAfterLogin = (role) => {
    const target =
      role === "admin" || role === "staff" ? "/operations-center" : returnTo;
    if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    redirectTimeoutRef.current = setTimeout(
      () => router.replace(target),
      REDIRECT_DELAY_MS,
    );
  };

  const handleLogin = async (identifier, password) => {
    if (!identifier.trim()) {
      showToast("Please enter your email, phone, or username.", "error");
      return;
    }

    const result = await login(identifier, password);

    if (result?.requires2FA) {
      showToast("OTP sent to your registered email.", "success");
    } else if (result?.success && !result?.requires2FA) {
      setRedirecting(true);
      showToast("Login successful. Welcome!", "success");
      redirectAfterLogin(result.role);
    }
  };

  const handleOtp = async (otp) => {
    const result = await submitOtp(otp);
    if (result?.success) {
      setRedirecting(true);
      showToast("Login successful. Welcome!", "success");
      redirectAfterLogin(result.role);
    }
  };

  const handleGoogleCredential = async (credential) => {
    const result = await googleLogin(credential);
    if (result?.needsProfile) {
      setGoogleSignup({
        signupToken: result.signupToken,
        profile: result.profile,
      });
    } else if (result?.needsLink) {
      setGoogleLink({ linkToken: result.linkToken });
    } else if (result?.success) {
      setRedirecting(true);
      showToast("Login successful. Welcome!", "success");
      redirectAfterLogin(result.role);
    }
  };

  const handleGoogleLink = async (password) => {
    const result = await googleLinkExisting(googleLink.linkToken, password);
    if (result?.success) {
      setRedirecting(true);
      showToast("Google connected. Welcome back!", "success");
      redirectAfterLogin(result.role);
    }
    return result;
  };

  const handleGoogleComplete = async (details) => {
    const result = await googleComplete({
      signupToken: googleSignup.signupToken,
      ...details,
    });
    if (result?.success) {
      setRedirecting(true);
      showToast("Account created. Welcome!", "success");
      redirectAfterLogin(result.role);
    }
    return result;
  };

  const handleCancelOtp = () => {
    cancelOtp();
    showToast("OTP cancelled. Please login again.", "error");
  };

  if (authChecking) {
    return (
      <main className="min-h-screen bg-[#f5efe4] flex items-center justify-center">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-mud/50">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <main
        id="main-content"
        className="min-h-[100dvh] bg-[#f5efe4] text-brand-african flex items-start sm:items-center justify-center px-3 sm:px-4 py-6 sm:py-12"
      >
        <div
          className={`w-full min-w-0 bg-white border border-brand-lightgold/60 shadow-xl ${
            mode === "signup" && !otpPending ? "max-w-xl" : "max-w-md"
          }`}
        >
          <div className="px-5 sm:px-8 pt-7 sm:pt-8 pb-5 border-b border-brand-lightgold/30">
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-brand-gold">
              Sanwariyas
            </p>
            <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-mud/40 mt-0.5">
              A True Story of Elegance
            </p>
            {!otpPending && !googleSignup && !googleLink && (
              <>
                <h1 className="font-display text-2xl text-brand-african mt-3">
                  {mode === "signin"
                    ? "Welcome Back"
                    : mode === "signup"
                      ? "Create Account"
                      : "Password Reset"}
                </h1>
                <p className="font-sans text-xs text-brand-mud mt-1">
                  {mode === "signin"
                    ? "Sign in to your wholesale account."
                    : mode === "signup"
                      ? "Register for B2B wholesale access."
                      : "Securely regain access to your account."}
                </p>
              </>
            )}
          </div>

          {!otpPending && !googleSignup && !googleLink && (
            <div className="flex border-b border-brand-lightgold/30">
              {[
                { key: "signin", label: "Sign In" },
                { key: "signup", label: "New Account" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => switchMode(key)}
                  title={`Switch to ${label}`}
                  className={`flex-1 py-3 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors border-b-2 -mb-px ${
                    mode === key || (mode === "forgot" && key === "signin")
                      ? "border-brand-coffee text-brand-coffee"
                      : "border-transparent text-brand-mud hover:text-brand-coffee"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="px-5 sm:px-8 py-6 sm:py-7">
            {googleLink && !otpPending ? (
              <GoogleLinkForm
                submitting={googleBusy}
                onSubmit={handleGoogleLink}
                onCancel={() => setGoogleLink(null)}
              />
            ) : googleSignup && !otpPending ? (
              <GoogleProfileForm
                profile={googleSignup.profile}
                submitting={googleBusy}
                onSubmit={handleGoogleComplete}
                onCancel={() => setGoogleSignup(null)}
              />
            ) : otpPending ? (
              <OtpScreen
                emailHint={emailHint}
                devOtp={devOtp}
                verifyingOtp={verifyingOtp}
                onSubmit={handleOtp}
                onBack={handleCancelOtp}
              />
            ) : mode === "signin" ? (
              <div className="space-y-5">
                <SignInForm
                  onLogin={handleLogin}
                  loggingIn={loggingIn}
                  onForgot={() => switchMode("forgot")}
                  onSwitchToSignup={() => switchMode("signup")}
                />
                <GoogleSignInButton
                  onCredential={handleGoogleCredential}
                  disabled={googleBusy || loggingIn}
                />
              </div>
            ) : mode === "signup" ? (
              <div className="space-y-5">
                <SignupForm onSignup={signup} signingUp={signingUp} />
                <GoogleSignInButton
                  onCredential={handleGoogleCredential}
                  disabled={googleBusy || signingUp}
                />
              </div>
            ) : (
              <ForgotPasswordScreen
                onBack={() => switchMode("signin")}
                onSwitchToSignup={() => switchMode("signup")}
                onResetSuccess={(msg) => {
                  showToast(msg, "success");
                  switchMode("signin");
                }}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}