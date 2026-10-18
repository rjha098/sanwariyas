// // FILE: client/src/components/ui/PhoneInput.js
// "use client";

// import { useState, useEffect } from "react";
// import { countryCodes } from "@/utils/countryCodes";

// // Codes sorted longest-first ONCE, at module load — not on every render —
// // so a value like "1649xxxxxxx" matches Turks & Caicos ("+1649") instead
// // of being shadowed by the shorter, more generic "+1".
// const CODES_BY_LENGTH_DESC = [...countryCodes].sort(
//   (a, b) => b.code.length - a.code.length,
// );

// // Splits a stored combined number (e.g. "916203290195") back into
// // { dial: "91", local: "6203290195" }. Falls back to India if nothing
// // matches (this business's default market).
// export function splitPhone(fullNumber) {
//   if (!fullNumber) return { dial: "91", local: "" };

//   const cleanNumber = String(fullNumber).replace(/\D/g, "");

//   for (const country of CODES_BY_LENGTH_DESC) {
//     const dial = country.code.replace("+", "");
//     if (cleanNumber.startsWith(dial)) {
//       return { dial, local: cleanNumber.slice(dial.length) };
//     }
//   }

//   return { dial: "91", local: cleanNumber };
// }

// /**
//  * A single visual box (like any normal input) with a country-code segment
//  * on the left and the number on the right, separated by one thin divider
//  * — not two separately-bordered boxes. The whole box's border/background
//  * is controlled by ONE `className` prop, so it always renders as one
//  * cohesive control no matter which form it's dropped into.
//  *
//  * Props:
//  *  - value / onChange: combined dial+local digit string, e.g. "916203290195"
//  *  - className: styles the OUTER box — border, background, rounded corners,
//  *    focus ring. Pass only container-level classes here (no padding/text).
//  *  - textClassName: text color/size shared by the code label and the
//  *    number input. Defaults to a sensible neutral.
//  */
// export default function PhoneInput({
//   value = "",
//   onChange,
//   readOnly = false,
//   required = false,
//  placeholder = "Number",
//   className = "",
//   textClassName = "",
//   verticalPadding = "py-3",
// }) {
//   const [dial, setDial] = useState("91"); // digits only, no "+"
//   const [local, setLocal] = useState("");

//   // Keep local state in sync whenever the parent resets/prefills `value`.
//   useEffect(() => {
//     const parsed = splitPhone(value);
//     setDial(parsed.dial || "91");
//     setLocal(parsed.local || "");
//   }, [value]);

//   const emit = (nextDial, nextLocal) => onChange(`${nextDial}${nextLocal}`);

//   const handleDialChange = (e) => {
//     const nextDial = e.target.value.replace("+", "");
//     setDial(nextDial);
//     emit(nextDial, local);
//   };

//   const handleLocalChange = (e) => {
//     // Digits only, capped at 10 — a realistic local-number length that
//     // also keeps (dial + local) safely under the backend's total limit
//     // even for longer 4-digit dial codes.
//     const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
//     setLocal(digitsOnly);
//     emit(dial, digitsOnly);
//   };

//   return (
//     <div
//       className={
//         className ||
//         "flex items-stretch w-full border border-[#a07f61]/30 bg-[#f8f4ec] rounded-md overflow-hidden focus-within:border-[#BE6E5B] transition-colors"
//       }
//     >
//       {/* ── Country code segment ── */}
//       <div className={`relative flex items-center gap-1.5 pl-4 pr-2 border-r border-current/10 flex-shrink-0 ${verticalPadding}`}>
//         <span className={`text-sm font-medium whitespace-nowrap ${textClassName}`}>
//           +{dial}
//         </span>
//         <svg
//           className={`w-3 h-3 opacity-50 flex-shrink-0 ${textClassName}`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>

//         {/* ── Invisible Select Hack ──
//             The real <select> sits fully transparent on top of the visual
//             code+arrow above. Clicking anywhere on it opens the native
//             dropdown (which shows the full "code - country" text) without
//             the native control ever rendering its own closed-state text. */}
//         <select
//           value={
//             countryCodes.some((c) => c.code === `+${dial}`) ? `+${dial}` : "+91"
//           }
//           onChange={handleDialChange}
//           disabled={readOnly}
//           aria-label="Country code"
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
//         >
//           {countryCodes.map((country) => (
//             <option key={`${country.code}-${country.name}`} value={country.code}>
//               {country.code} - {country.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* ── Number segment ── */}
//       <input
//         type="tel"
//         inputMode="numeric"
//         value={local}
//         onChange={handleLocalChange}
//         readOnly={readOnly}
//         required={required}
//         placeholder={placeholder}
//         aria-label="Phone number"
//         className={`flex-1 min-w-0 px-4 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 appearance-none text-sm ${verticalPadding} ${textClassName} ${
//           readOnly ? "opacity-70 cursor-not-allowed" : ""
//         }`}
//       />
//     </div>
//   );
// }

// FILE: client/src/components/ui/PhoneInput.js
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { countryCodes } from "@/utils/countryCodes";
import { maxLocalLength } from "@/utils/phoneRules";

// Codes sorted longest-first ONCE, at module load — not on every render —
// so a value like "1649xxxxxxx" matches Turks & Caicos ("+1649") instead
// of being shadowed by the shorter, more generic "+1".
const CODES_BY_LENGTH_DESC = [...countryCodes].sort(
  (a, b) => b.code.length - a.code.length,
);

// Several countries share one dial code (+1 = Canada/USA, +599 = Curaçao/
// Bonaire). Each entry therefore gets its own unique id.
const COUNTRY_LIST = countryCodes.map((c) => ({
  ...c,
  digits: c.code.replace("+", ""),
  id: `${c.code}|${c.name}`,
}));

const findDefaultCountry = (dial) =>
  COUNTRY_LIST.find((c) => c.digits === dial) ||
  COUNTRY_LIST.find((c) => c.digits === "91");

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
 * One visual box with a country-code button (opens a SEARCHABLE country
 * list) on the left and the phone number on the right.
 *
 * Props (all the old ones still work exactly as before):
 *  - value / onChange: combined dial+local digit string, e.g. "916203290195"
 *  - className: styles the OUTER box (border, background, focus ring).
 *  - textClassName: text colour/size shared by the code label and number.
 *  - verticalPadding: vertical padding of both segments.
 *  - error: when true the box gets a red border (field-level error state).
 *  - onCountryChange(name): called ONLY when the user picks a country from
 *    the list, so a form can pre-fill its own "Country" field.
 *  - onPartsChange({ dial, local }): called on every change with the dial
 *    code and the local number SEPARATELY (the combined string alone cannot
 *    always be split back reliably, e.g. +1 vs +1242), so a form can run
 *    country-wise validation on the exact parts the user chose.
 *  - id: id for the number <input> (so a <label htmlFor> can point to it).
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
  error = false,
  onCountryChange,
  onPartsChange,
  id,
}) {
  const initial = splitPhone(value);
  const [countryId, setCountryId] = useState(
    () => findDefaultCountry(initial.dial)?.id,
  );
  const [local, setLocal] = useState(initial.local || "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  // Remembers the last value WE sent to the parent, so the sync effect
  // below does not re-parse (and possibly mis-split) our own output.
  const lastEmitted = useRef(value);

  const country = COUNTRY_LIST.find((c) => c.id === countryId);
  const dial = country?.digits || "91";

  // Keep state in sync only when the PARENT changes the value (prefill /
  // reset) — not when the change came from this component.
  useEffect(() => {
    if (value === lastEmitted.current) return;
    lastEmitted.current = value;
    const parsed = splitPhone(value);
    setCountryId((prev) => {
      const current = COUNTRY_LIST.find((c) => c.id === prev);
      // Keep the user's chosen country if it already has this dial code
      // (important for +1 = Canada vs USA).
      if (current && current.digits === parsed.dial) return prev;
      return findDefaultCountry(parsed.dial)?.id;
    });
    setLocal(parsed.local || "");
  }, [value]);

  const emit = useCallback(
    (nextDial, nextLocal) => {
      const combined = `${nextDial}${nextLocal}`;
      lastEmitted.current = combined;
      onChange?.(combined);
      onPartsChange?.({ dial: nextDial, local: nextLocal });
    },
    [onChange, onPartsChange],
  );

  // ── Search filtering ──
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_LIST;
    const qDigits = q.replace(/\D/g, "");
    return COUNTRY_LIST.filter((c) => {
      if (c.name.toLowerCase().includes(q)) return true;
      if (qDigits && c.digits.startsWith(qDigits)) return true;
      return false;
    });
  }, [query]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  // Focus the search box when the list opens; reset the search when closed.
  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      const t = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    setQuery("");
    return undefined;
  }, [open]);

  // Keep the highlighted row visible while using the arrow keys.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, open]);

  const selectCountry = (c) => {
    setCountryId(c.id);
    const cap = maxLocalLength(c.digits);
    const nextLocal = local.slice(0, cap);
    setLocal(nextLocal);
    emit(c.digits, nextLocal);
    onCountryChange?.(c.name);
    setOpen(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[activeIndex];
      if (c) selectCountry(c);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const handleLocalChange = (e) => {
    // Digits only, capped by the selected country's longest valid number.
    const digitsOnly = e.target.value
      .replace(/\D/g, "")
      .slice(0, maxLocalLength(dial));
    setLocal(digitsOnly);
    emit(dial, digitsOnly);
  };

  const boxClass =
    className ||
    "flex items-stretch w-full border border-[#a07f61]/30 bg-[#f8f4ec] rounded-md focus-within:border-[#BE6E5B] transition-colors";

  return (
    <div ref={wrapperRef} className="relative w-full min-w-0">
      <div
        className={`${boxClass} ${
          error ? "!border-red-500 focus-within:!border-red-600" : ""
        }`}
      >
        {/* ── Country code button ── */}
        <button
          type="button"
          onClick={() => !readOnly && setOpen((o) => !o)}
          disabled={readOnly}
          aria-label={`Country code +${dial}${country ? `, ${country.name}` : ""}. Change country`}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex items-center gap-1.5 pl-3 pr-2 border-r border-current/10 flex-shrink-0 bg-transparent disabled:cursor-not-allowed ${verticalPadding}`}
        >
          <span
            className={`text-sm font-medium whitespace-nowrap ${textClassName}`}
          >
            +{dial}
          </span>
          <svg
            className={`w-3 h-3 opacity-50 flex-shrink-0 transition-transform ${
              open ? "rotate-180" : ""
            } ${textClassName}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* ── Number input ── */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={local}
          onChange={handleLocalChange}
          readOnly={readOnly}
          required={required}
          placeholder={placeholder}
          aria-label="Phone number"
          aria-invalid={error ? "true" : undefined}
          className={`flex-1 min-w-0 px-3 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 appearance-none text-sm ${verticalPadding} ${textClassName} ${
            readOnly ? "opacity-70 cursor-not-allowed" : ""
          }`}
        />
      </div>

      {/* ── Searchable country list ── */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[min(20rem,calc(100vw-2rem))] border border-brand-lightgold/60 bg-white shadow-lg">
          <div className="p-2 border-b border-brand-lightgold/40">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search country or code"
              aria-label="Search country or code"
              autoComplete="off"
              className="w-full border border-brand-lightgold/60 px-3 py-2 text-sm text-brand-african bg-white focus:outline-none focus:border-brand-coffee"
            />
          </div>
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Countries"
            className="max-h-56 overflow-y-auto overscroll-contain"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-xs text-brand-mud">
                No country found
              </li>
            ) : (
              filtered.map((c, i) => (
                <li
                  key={c.id}
                  data-index={i}
                  role="option"
                  aria-selected={c.id === countryId}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectCountry(c)}
                  className={`flex items-center justify-between gap-3 px-3 py-2 text-sm cursor-pointer ${
                    i === activeIndex ? "bg-brand-lightgold/30" : ""
                  } ${c.id === countryId ? "font-semibold" : ""} text-brand-african`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="flex-shrink-0 text-brand-mud">{c.code}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
