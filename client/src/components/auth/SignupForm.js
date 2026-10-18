// FILE: client/src/components/auth/SignupForm.js
"use client";

import { useState } from "react";
import PhoneInput from "@/components/ui/PhoneInput";
import CountrySelect from "@/components/ui/CountrySelect";
import {
  PASSWORD_CHECKS,
  validateName,
  validateEmail,
  validatePhoneLocal,
  validateCompany,
  validateCountry,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/phoneRules";

// Same SANWARIYAS look as the rest of the login page. Inputs use 16px text
// on phones (text-base) so iOS does not zoom the page when a field is
// focused, and 14px (text-sm) from the `sm` breakpoint upwards.
const inp =
  "w-full min-w-0 border border-brand-lightgold/60 px-4 py-3 text-base sm:text-sm bg-white focus:outline-none focus:border-brand-coffee transition-colors";
const lbl =
  "block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2";
const btn =
  "w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const phoneBox =
  "flex items-stretch w-full min-w-0 border border-brand-lightgold/60 bg-white text-base sm:text-sm focus-within:border-brand-coffee transition-colors";

const FIELD_ORDER = [
  "name",
  "phone",
  "email",
  "company",
  "country",
  "password",
  "confirmPassword",
];

// DOM id of the control to focus when a field has an error.
const FIELD_ID = {
  name: "signup-name",
  phone: "signup-phone",
  email: "signup-email",
  company: "signup-company",
  country: "signup-country",
  password: "signup-password",
  confirmPassword: "signup-confirm",
};

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  company: "",
  country: "",
  password: "",
  confirmPassword: "",
};

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 font-sans text-xs leading-snug text-red-700 break-words"
    >
      {message}
    </p>
  );
}

function EyeButton({ shown, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? `Hide ${label}` : `Show ${label}`}
      aria-pressed={shown}
      className="absolute inset-y-0 right-0 px-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-mud hover:text-brand-coffee"
    >
      {shown ? "Hide" : "Show"}
    </button>
  );
}

export default function SignupForm({ onSignup, signingUp }) {
  const [form, setForm] = useState(EMPTY_FORM);
  // Phone parts are tracked separately because dial + local is validated
  // country-wise and cannot always be split back reliably from one string.
  const [phoneParts, setPhoneParts] = useState({ dial: "91", local: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── validation ──
  const validateField = (key, values = form, parts = phoneParts) => {
    switch (key) {
      case "name":
        return validateName(values.name);
      case "phone":
        return validatePhoneLocal(parts.dial, parts.local);
      case "email":
        return validateEmail(values.email);
      case "company":
        return validateCompany(values.company);
      case "country":
        return validateCountry(values.country);
      case "password":
        return validatePassword(values.password);
      case "confirmPassword":
        return validateConfirmPassword(values.password, values.confirmPassword);
      default:
        return "";
    }
  };

  const validateAll = (values = form, parts = phoneParts) => {
    const next = {};
    FIELD_ORDER.forEach((key) => {
      const msg = validateField(key, values, parts);
      if (msg) next[key] = msg;
    });
    return next;
  };

  // Re-validate a field as the user edits it, but only after they have
  // visited it once (so we do not shout at them while they are still
  // typing the very first character).
  const refreshField = (key, values, parts, force = false) => {
    setErrors((prev) => {
      const next = { ...prev };
      const msg = validateField(key, values, parts);
      if (msg && (force || touched[key])) next[key] = msg;
      else delete next[key];
      // Changing the password also changes whether "confirm" matches.
      if (key === "password" && touched.confirmPassword) {
        const c = validateField("confirmPassword", values, parts);
        if (c) next.confirmPassword = c;
        else delete next.confirmPassword;
      }
      return next;
    });
  };

  const markTouched = (key) => {
    setTouched((t) => (t[key] ? t : { ...t, [key]: true }));
    setErrors((prev) => {
      const next = { ...prev };
      const msg = validateField(key);
      if (msg) next[key] = msg;
      else delete next[key];
      return next;
    });
  };

  const set = (key) => (e) => {
    const values = { ...form, [key]: e.target.value };
    setForm(values);
    setFormError("");
    refreshField(key, values, phoneParts);
  };

  const handlePhoneChange = (combined) => {
    setForm((f) => ({ ...f, phone: combined }));
    setFormError("");
  };

  const handlePhoneParts = (parts) => {
    setPhoneParts(parts);
    // The phone box has no blur handler, so treat "the user typed something"
    // as having visited it.
    const visited = touched.phone || parts.local.length > 0;
    if (visited) setTouched((t) => (t.phone ? t : { ...t, phone: true }));
    refreshField("phone", form, parts, visited);
  };

  const handleCountryPick = (name) => {
    const values = { ...form, country: name };
    setForm(values);
    setTouched((t) => ({ ...t, country: true }));
    setFormError("");
    refreshField("country", values, phoneParts, true);
  };

  // Picking a phone country pre-fills the Country field if it is still empty.
  const handlePhoneCountry = (name) => {
    if (form.country) return;
    handleCountryPick(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signingUp) return;
    setFormError("");

    const nextErrors = validateAll();
    setTouched(
      FIELD_ORDER.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    );
    setErrors(nextErrors);

    const firstBad = FIELD_ORDER.find((key) => nextErrors[key]);
    if (firstBad) {
      document.getElementById(FIELD_ID[firstBad])?.focus();
      return;
    }

    const result = await onSignup({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone,
      countryCode: phoneParts.dial,
      company: form.company.trim(),
      country: form.country.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    });

    // Success is handled by the parent (switches to Sign In). On failure the
    // backend's field-wise errors are shown next to each field.
    if (result && result.success === false) {
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        setTouched(
          FIELD_ORDER.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        );
        const firstServerBad = FIELD_ORDER.find((k) => result.fieldErrors[k]);
        if (firstServerBad) {
          document.getElementById(FIELD_ID[firstServerBad])?.focus();
        }
      } else {
        // Parent already shows the message in a toast; keep a copy here so
        // it is also visible next to the button.
        setFormError(result.error || "Signup failed. Please try again.");
      }
    }
  };

  const pwChecks = PASSWORD_CHECKS.map((c) => ({
    ...c,
    ok: c.test(form.password),
  }));
  const showChecklist = form.password.length > 0 || touched.password;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 min-w-0"
      noValidate
      aria-label="B2B Wholesale Buyer Registration Form"
    >
      {/* Full name */}
      <div className="min-w-0">
        <label htmlFor="signup-name" className={lbl}>
          Full Name *
        </label>
        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={set("name")}
          onBlur={() => markTouched("name")}
          placeholder="Your name"
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "signup-name-err" : undefined}
          className={`${inp} ${errors.name ? "!border-red-500" : ""}`}
          maxLength={80}
        />
        <FieldError id="signup-name-err" message={errors.name} />
      </div>

      {/* Phone */}
      <div className="min-w-0">
        <label htmlFor="signup-phone" className={lbl}>
          Phone *
        </label>
        <PhoneInput
          id="signup-phone"
          value={form.phone}
          onChange={handlePhoneChange}
          onPartsChange={handlePhoneParts}
          onCountryChange={handlePhoneCountry}
          error={!!errors.phone}
          className={phoneBox}
          textClassName="text-brand-mud"
          placeholder="Phone number"
        />
        <FieldError id="signup-phone-err" message={errors.phone} />
      </div>

      {/* Email */}
      <div className="min-w-0">
        <label htmlFor="signup-email" className={lbl}>
          Email *
        </label>
        <input
          id="signup-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          onBlur={() => markTouched("email")}
          placeholder="you@example.com"
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "signup-email-err" : undefined}
          className={`${inp} ${errors.email ? "!border-red-500" : ""}`}
          maxLength={150}
        />
        <FieldError id="signup-email-err" message={errors.email} />
      </div>

      {/* Company + Country: side by side from `sm`, stacked on phones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="min-w-0">
          <label htmlFor="signup-company" className={lbl}>
            Company
          </label>
          <input
            id="signup-company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={set("company")}
            onBlur={() => markTouched("company")}
            placeholder="Your company"
            aria-invalid={errors.company ? "true" : undefined}
            aria-describedby={errors.company ? "signup-company-err" : undefined}
            className={`${inp} ${errors.company ? "!border-red-500" : ""}`}
            maxLength={100}
          />
          <FieldError id="signup-company-err" message={errors.company} />
        </div>
        <div className="min-w-0">
          <label htmlFor="signup-country" className={lbl}>
            Country *
          </label>
          <CountrySelect
            id="signup-country"
            value={form.country}
            onChange={handleCountryPick}
            error={!!errors.country}
            className={inp}
            placeholder="Select country"
          />
          <FieldError id="signup-country-err" message={errors.country} />
        </div>
      </div>

      {/* Password */}
      <div className="min-w-0">
        <label htmlFor="signup-password" className={lbl}>
          Password *
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            value={form.password}
            onChange={set("password")}
            onBlur={() => markTouched("password")}
            placeholder="Create a strong password"
            aria-invalid={errors.password ? "true" : undefined}
            aria-describedby="signup-password-rules"
            className={`${inp} pr-16 ${errors.password ? "!border-red-500" : ""}`}
            maxLength={72}
          />
          <EyeButton
            shown={showPw}
            onToggle={() => setShowPw((s) => !s)}
            label="password"
          />
        </div>
        {showChecklist && (
          <ul
            id="signup-password-rules"
            className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1"
          >
            {pwChecks.map((c) => (
              <li
                key={c.key}
                className={`font-sans text-[11px] leading-snug ${
                  c.ok ? "text-green-700" : "text-brand-mud/70"
                }`}
              >
                <span aria-hidden="true">{c.ok ? "✓" : "○"}</span> {c.label}
              </li>
            ))}
          </ul>
        )}
        <FieldError id="signup-password-err" message={errors.password} />
      </div>

      {/* Confirm password */}
      <div className="min-w-0">
        <label htmlFor="signup-confirm" className={lbl}>
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="signup-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            onBlur={() => markTouched("confirmPassword")}
            placeholder="Repeat password"
            aria-invalid={errors.confirmPassword ? "true" : undefined}
            aria-describedby={
              errors.confirmPassword ? "signup-confirm-err" : undefined
            }
            className={`${inp} pr-16 ${
              errors.confirmPassword ? "!border-red-500" : ""
            }`}
            maxLength={72}
          />
          <EyeButton
            shown={showConfirm}
            onToggle={() => setShowConfirm((s) => !s)}
            label="confirm password"
          />
        </div>
        <FieldError id="signup-confirm-err" message={errors.confirmPassword} />
      </div>

      {formError && (
        <p
          className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3 break-words"
          role="alert"
        >
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={signingUp}
        className={btn}
        title="Create Wholesale Account"
      >
        {signingUp ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}