// FILE: client/src/components/ui/PhoneInput.js
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { countryCodes } from "@/utils/countryCodes";
import { maxLocalLength, parseInternationalNumber } from "@/utils/phoneRules";

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
 *
 *  *  - onDetect({ dial, countries, ambiguous }): called when the user types or
 *    pastes the number in international form ("+60 12…" / "0060…"). The dial
 *    code is switched automatically; `countries` lists the country (or the
 *    countries, for shared codes like +1) that own it so a form can pre-fill
 *    its Country field. Plain local numbers are never guessed.
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
  onDetect,
  id,
}) {
  const initial = splitPhone(value);
  const [countryId, setCountryId] = useState(
    () => findDefaultCountry(initial.dial)?.id,
  );
  const [local, setLocal] = useState(initial.local || "");
  // Text typed in international form that is not yet complete ("+6", "+1 2").
  const [intlDraft, setIntlDraft] = useState("");
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

  // Applies a parsed international number: switches the dial code and keeps
  // only the local part in the box.
  const applyInternational = (intl) => {
    const nextLocal = intl.local.slice(0, maxLocalLength(intl.dial));
    setIntlDraft("");
    setCountryId((prev) => {
      const current = COUNTRY_LIST.find((c) => c.id === prev);
      // Keep the chosen country if it already owns this code (+1 Canada/USA).
      if (current && current.digits === intl.dial) return prev;
      return COUNTRY_LIST.find((c) => c.digits === intl.dial)?.id;
    });
    setLocal(nextLocal);
    emit(intl.dial, nextLocal);
    onDetect?.({
      dial: intl.dial,
      countries: intl.countries,
      ambiguous: intl.ambiguous,
    });
  };

  const handleLocalChange = (e) => {
    const raw = e.target.value;

    // International form: "+60 12 345 6789" or "0060…". Only an explicit
    // "+" / "00" prefix is trusted; plain digits are always a local number.
    if (/^\s*(\+|00)/.test(raw)) {
      const intl = parseInternationalNumber(raw);
      if (intl && !intl.pending) {
        applyInternational(intl);
      } else {
        setIntlDraft(raw.slice(0, 24)); // wait for more digits
      }
      return;
    }

    setIntlDraft("");
    // Digits only, capped by the selected country's longest valid number.
    const digitsOnly = raw.replace(/\D/g, "").slice(0, maxLocalLength(dial));
    setLocal(digitsOnly);
    emit(dial, digitsOnly);
  };

  // Leaving the box with an unfinished "+1 2…": use what we have.
  const handleLocalBlur = () => {
    if (!intlDraft) return;
    const intl = parseInternationalNumber(intlDraft);
    if (intl) applyInternational(intl);
    else setIntlDraft("");
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
          value={intlDraft || local}
          onChange={handleLocalChange}
          onBlur={handleLocalBlur}
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
