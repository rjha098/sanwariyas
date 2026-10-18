// FILE: client/src/components/ui/CountrySelect.js
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { countryCodes } from "@/utils/countryCodes";

// One row per country NAME (a few names share a dial code, and one dial
// code can have several names — we list by name here).
const COUNTRIES = Array.from(
  new Map(countryCodes.map((c) => [c.name, c])).values(),
).sort((a, b) => a.name.localeCompare(b.name));

/**
 * Searchable country dropdown. The user can type a country NAME ("ind") or a
 * dial CODE ("+91" / "91") to find a country.
 *
 * Props:
 *  - value: the selected country name (string, "" when nothing selected)
 *  - onChange(name, dialDigits): called when a country is picked
 *  - className: classes for the visible button (border, padding, ...)
 *  - error: when true the button gets a red border
 *  - id: id for the button (so a <label htmlFor> can point to it)
 *  - placeholder: text shown when nothing is selected
 */
export default function CountrySelect({
  value = "",
  onChange,
  className = "",
  error = false,
  id,
  placeholder = "Select country",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    const qDigits = q.replace(/\D/g, "");
    return COUNTRIES.filter((c) => {
      if (c.name.toLowerCase().includes(q)) return true;
      if (qDigits && c.code.replace("+", "").startsWith(qDigits)) return true;
      return false;
    });
  }, [query]);

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

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      const t = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    setQuery("");
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, open]);

  const pick = (c) => {
    onChange?.(c.name, c.code.replace("+", ""));
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[activeIndex];
      if (c) pick(c);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full min-w-0">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error ? "true" : undefined}
        className={`${className} flex items-center justify-between gap-2 text-left ${
          error ? "!border-red-500" : ""
        }`}
      >
        <span
          className={`truncate ${value ? "text-brand-african" : "text-brand-mud/60"}`}
        >
          {value || placeholder}
        </span>
        <svg
          className={`w-3 h-3 opacity-50 flex-shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
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

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full min-w-[14rem] max-w-[calc(100vw-2rem)] border border-brand-lightgold/60 bg-white shadow-lg">
          <div className="p-2 border-b border-brand-lightgold/40">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
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
                  key={c.name}
                  data-index={i}
                  role="option"
                  aria-selected={c.name === value}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(c)}
                  className={`flex items-center justify-between gap-3 px-3 py-2 text-sm cursor-pointer text-brand-african ${
                    i === activeIndex ? "bg-brand-lightgold/30" : ""
                  } ${c.name === value ? "font-semibold" : ""}`}
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