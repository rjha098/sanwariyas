// FILE: client/src/components/ui/PhoneInput.js
"use client";

import { useState, useEffect } from "react";
import { countryCodes } from "@/utils/countryCodes";

// Codes sorted longest-first ONCE, at module load — not on every render —
// so a value like "1649xxxxxxx" matches Turks & Caicos ("+1649") instead
// of being shadowed by the shorter, more generic "+1".
const CODES_BY_LENGTH_DESC = [...countryCodes].sort(
  (a, b) => b.code.length - a.code.length,
);

// Splits a stored combined number (e.g. "916203290195") back into
// { dial: "91", local: "6203290195" }. Falls back to India if nothing
// matches (this business's default market).
export function splitPhone(fullNumber) {
  if (!fullNumber) return { dial: "91", local: "" };

  const cleanNumber = String(fullNumber).replace(/\D/g, "");

  for (const country of CODES_BY_LENGTH_DESC) {
    const dial = country.code.replace("+", "");
    if (cleanNumber.startsWith(dial)) {
      return { dial, local: cleanNumber.slice(dial.length) };
    }
  }

  return { dial: "91", local: cleanNumber };
}

/**
 * A single visual box (like any normal input) with a country-code segment
 * on the left and the number on the right, separated by one thin divider
 * — not two separately-bordered boxes. The whole box's border/background
 * is controlled by ONE `className` prop, so it always renders as one
 * cohesive control no matter which form it's dropped into.
 *
 * Props:
 *  - value / onChange: combined dial+local digit string, e.g. "916203290195"
 *  - className: styles the OUTER box — border, background, rounded corners,
 *    focus ring. Pass only container-level classes here (no padding/text).
 *  - textClassName: text color/size shared by the code label and the
 *    number input. Defaults to a sensible neutral.
 */
export default function PhoneInput({
  value = "",
  onChange,
  readOnly = false,
  required = false,
 placeholder = "Number",
  className = "",
  textClassName = "",
  verticalPadding = "py-3",
}) {
  const [dial, setDial] = useState("91"); // digits only, no "+"
  const [local, setLocal] = useState("");

  // Keep local state in sync whenever the parent resets/prefills `value`.
  useEffect(() => {
    const parsed = splitPhone(value);
    setDial(parsed.dial || "91");
    setLocal(parsed.local || "");
  }, [value]);

  const emit = (nextDial, nextLocal) => onChange(`${nextDial}${nextLocal}`);

  const handleDialChange = (e) => {
    const nextDial = e.target.value.replace("+", "");
    setDial(nextDial);
    emit(nextDial, local);
  };

  const handleLocalChange = (e) => {
    // Digits only, capped at 10 — a realistic local-number length that
    // also keeps (dial + local) safely under the backend's total limit
    // even for longer 4-digit dial codes.
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setLocal(digitsOnly);
    emit(dial, digitsOnly);
  };

  return (
    <div
      className={
        className ||
        "flex items-stretch w-full border border-[#a07f61]/30 bg-[#f8f4ec] rounded-md overflow-hidden focus-within:border-[#BE6E5B] transition-colors"
      }
    >
      {/* ── Country code segment ── */}
      <div className={`relative flex items-center gap-1.5 pl-4 pr-2 border-r border-current/10 flex-shrink-0 ${verticalPadding}`}>
        <span className={`text-sm font-medium whitespace-nowrap ${textClassName}`}>
          +{dial}
        </span>
        <svg
          className={`w-3 h-3 opacity-50 flex-shrink-0 ${textClassName}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>

        {/* ── Invisible Select Hack ──
            The real <select> sits fully transparent on top of the visual
            code+arrow above. Clicking anywhere on it opens the native
            dropdown (which shows the full "code - country" text) without
            the native control ever rendering its own closed-state text. */}
        <select
          value={
            countryCodes.some((c) => c.code === `+${dial}`) ? `+${dial}` : "+91"
          }
          onChange={handleDialChange}
          disabled={readOnly}
          aria-label="Country code"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        >
          {countryCodes.map((country) => (
            <option key={`${country.code}-${country.name}`} value={country.code}>
              {country.code} - {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* ── Number segment ── */}
      <input
        type="tel"
        inputMode="numeric"
        value={local}
        onChange={handleLocalChange}
        readOnly={readOnly}
        required={required}
        placeholder={placeholder}
        aria-label="Phone number"
        className={`flex-1 min-w-0 px-4 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 appearance-none text-sm ${verticalPadding} ${textClassName} ${
          readOnly ? "opacity-70 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}