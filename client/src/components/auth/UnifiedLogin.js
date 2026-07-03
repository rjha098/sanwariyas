// FILE: client/src/components/auth/UnifiedLogin.js
"use client";

import { useState } from "react";

/**
 * UNIFIED LOGIN COMPONENT
 * Supports email OR phone number as identifier.
 * Used by Admin, Staff, and Customer login flows.
 * The 'role' prop controls the heading and description text.
 */
export default function UnifiedLogin({
  onSubmit,
  loginError,
  loggingIn,
  role = "admin", // 'admin' | 'staff' | 'customer'
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const headings = {
    admin: { title: "Admin Login", subtitle: "Access the operations center." },
    staff: { title: "Staff Login", subtitle: "Access your staff dashboard." },
    customer: { title: "Welcome Back", subtitle: "Sign in to your account." },
  };

  const { title, subtitle } = headings[role] || headings.admin;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;
    onSubmit(identifier.trim(), password);
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#f5efe4] text-brand-african flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md bg-white border border-brand-lightgold/60 shadow-xl p-8">
        <p
          className="font-sans text-[11px] tracking-[0.4em] uppercase text-brand-gold mb-3"
          aria-hidden="true"
        >
          Sanwariyas
        </p>
        <h1 className="font-display text-3xl mb-2">{title}</h1>
        <p className="font-sans text-sm text-brand-mud mb-8">{subtitle}</p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-label={`${title} Form`}
          noValidate
        >
          {/* Identifier: accepts email or phone */}
          <div>
            <label
              htmlFor="auth-identifier"
              className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
            >
              Email or Phone
            </label>
            <input
              id="auth-identifier"
                type="text"
              inputMode="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              placeholder="you@example.com or +91..."
              className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee transition-colors"
              aria-required="true"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="auth-password"
              className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee transition-colors"
              aria-required="true"
            />
          </div>

          {/* Error message */}
          {loginError && (
            <p
              aria-live="assertive"
              role="alert"
              className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3"
            >
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loggingIn || !identifier.trim() || !password.trim()}
            className="w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-60"
            aria-busy={loggingIn}
          >
            {loggingIn ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
