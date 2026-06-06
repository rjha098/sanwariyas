// FILE: client/src/app/login/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Toast from '@/components/ui/Toast';

const inp    = 'w-full border border-brand-lightgold/60 px-4 py-3 text-sm bg-white focus:outline-none focus:border-brand-coffee transition-colors';
const lbl    = 'block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2';
const btn    = 'w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

// ── OTP Screen ────────────────────────────────────────────────────────────────
function OtpScreen({ emailHint, verifyingOtp, onSubmit, onBack }) {
  const [otp, setOtp] = useState('');
  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-brand-lightgold/30">
        <h2 className="font-display text-2xl text-brand-african">Verify OTP</h2>
        <p className="font-sans text-xs text-brand-mud mt-1">
          A 6-digit code was sent to <strong>{emailHint}</strong>. Valid for 10 minutes.
        </p>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); if (otp.length === 6) onSubmit(otp); }}
        className="space-y-5"
        noValidate
      >
        <div>
          <label className={lbl}>One-Time Password</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="• • • • • •"
            className={`${inp} text-center text-2xl tracking-[0.6em] font-mono`}
            autoFocus
          />
        </div>
        <button type="submit" disabled={verifyingOtp || otp.length !== 6} className={btn}>
          {verifyingOtp ? 'Verifying...' : 'Verify & Sign In'}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center font-sans text-xs text-brand-mud underline hover:text-brand-coffee transition-colors"
        >
          ← Back
        </button>
      </form>
    </div>
  );
}

// ── Sign In Form ──────────────────────────────────────────────────────────────
function SignInForm({ onLogin, loggingIn }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onLogin(identifier.trim(), password); }}
      className="space-y-5"
      noValidate
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
          required
        />
      </div>
      <div>
        <label className={lbl}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inp}
          autoComplete="current-password"
          required
        />
      </div>
      <button type="submit" disabled={loggingIn || !identifier || !password} className={btn}>
        {loggingIn ? 'Please wait...' : 'Sign In'}
      </button>
    </form>
  );
}

// ── Signup Form ───────────────────────────────────────────────────────────────
function SignupForm({ onSignup, signingUp }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '', company: '', country: '',
  });
  const [localErr, setLocalErr] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalErr('');
    if (form.password !== form.confirm) { setLocalErr('Passwords do not match.'); return; }
    if (form.password.length < 8)       { setLocalErr('Password must be at least 8 characters.'); return; }
    const { confirm, ...payload } = form;
    onSignup(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Full Name *</label>
          <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" className={inp} required />
        </div>
        <div>
          <label className={lbl}>Phone *</label>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className={inp} required />
        </div>
      </div>
      <div>
        <label className={lbl}>Email *</label>
        <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={inp} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Company</label>
          <input type="text" value={form.company} onChange={set('company')} placeholder="Your company" className={inp} />
        </div>
        <div>
          <label className={lbl}>Country</label>
          <input type="text" value={form.country} onChange={set('country')} placeholder="India" className={inp} />
        </div>
      </div>
      <div>
        <label className={lbl}>Password *</label>
        <input type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 characters" className={inp} required />
      </div>
      <div>
        <label className={lbl}>Confirm Password *</label>
        <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" className={inp} required />
      </div>
      {localErr && (
        <p className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
          {localErr}
        </p>
      )}
      <button type="submit" disabled={signingUp} className={btn}>
        {signingUp ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode]           = useState('signin');
  const [toast, setToast]         = useState({ isVisible: false, message: '', type: 'success' });
  // KEY FIX: track when we manually triggered redirect so useEffect doesn't fire early
  const [redirecting, setRedirecting] = useState(false);

  const showToast = (message, type = 'success') =>
    setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  const {
    login, loginError, setLoginError, loggingIn,
    otpPending, emailHint, otpError, verifyingOtp, submitOtp, cancelOtp,
    signup, signupError, setSignupError, signingUp, signupDone,
    isAuthenticated, isAdmin, isStaff, authChecking,
  } = useAuth();

  // Login error → Toast
  useEffect(() => {
    if (loginError) {
      showToast(loginError, 'error');
      setLoginError('');
    }
  }, [loginError]);

  // OTP error → Toast
  useEffect(() => {
    if (otpError) showToast(otpError, 'error');
  }, [otpError]);

  // Signup error → Toast
  useEffect(() => {
    if (signupError) {
      showToast(signupError, 'error');
      setSignupError('');
    }
  }, [signupError]);

  // Signup success → Toast + switch to signin
  useEffect(() => {
    if (signupDone) {
      showToast('Account created! Check your email to verify.', 'success');
      setMode('signin');
    }
  }, [signupDone]);

  // Already logged in on page load (session restore) → redirect immediately, no toast
  useEffect(() => {
    if (!authChecking && isAuthenticated && !redirecting) {
      router.replace(isAdmin || isStaff ? '/operations-center' : '/');
    }
  }, [authChecking, isAuthenticated, isAdmin, isStaff, redirecting]);

  const switchMode = (m) => {
    setMode(m);
    setLoginError?.('');
    setSignupError?.('');
  };

  const handleLogin = async (identifier, password) => {
    const result = await login(identifier, password);
    if (result?.requires2FA) {
      showToast('OTP sent to your registered email.', 'success');
    }
  };

  const handleOtp = async (otp) => {
    const result = await submitOtp(otp);
    if (result?.success) {
      // Mark redirecting so useEffect above doesn't fire immediately
      setRedirecting(true);
      showToast('Login successful. Welcome!', 'success');
      setTimeout(() => {
        router.push(result.role === 'admin' || result.role === 'staff' ? '/operations-center' : '/');
      }, 2000);
    }
  };

  const handleCancelOtp = () => {
    cancelOtp();
    showToast('OTP cancelled. Please login again.', 'error');
  };

  if (authChecking) {
    return (
      <main className="min-h-screen bg-[#f5efe4] flex items-center justify-center">
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-mud/50">Loading...</p>
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
        className="min-h-screen bg-[#f5efe4] text-brand-african flex items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-md bg-white border border-brand-lightgold/60 shadow-xl">

          {/* Brand header */}
          <div className="px-8 pt-8 pb-5 border-b border-brand-lightgold/30">
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-brand-gold">Sanwariyas</p>
            <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-mud/40 mt-0.5">
              A True Story of Elegance
            </p>
            {!otpPending && (
              <>
                <h1 className="font-display text-2xl text-brand-african mt-3">
                  {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="font-sans text-xs text-brand-mud mt-1">
                  {mode === 'signin' ? 'Sign in to your account.' : 'Register for B2B wholesale access.'}
                </p>
              </>
            )}
          </div>

          {/* Tabs — hidden during OTP */}
          {!otpPending && (
            <div className="flex border-b border-brand-lightgold/30">
              {[
                { key: 'signin', label: 'Sign In' },
                { key: 'signup', label: 'New Account' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => switchMode(key)}
                  className={`flex-1 py-3 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors border-b-2 -mb-px ${
                    mode === key
                      ? 'border-brand-coffee text-brand-coffee'
                      : 'border-transparent text-brand-mud hover:text-brand-coffee'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="px-8 py-7">
            {otpPending ? (
              <OtpScreen
                emailHint={emailHint}
                verifyingOtp={verifyingOtp}
                onSubmit={handleOtp}
                onBack={handleCancelOtp}
              />
            ) : mode === 'signin' ? (
              <SignInForm onLogin={handleLogin} loggingIn={loggingIn} />
            ) : (
              <SignupForm onSignup={signup} signingUp={signingUp} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}