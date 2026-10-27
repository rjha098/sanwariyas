
// // FILE: client/src/utils/phoneRules.js
// //
// // usage ----->>>>>  Country-wise phone number rules + password rules used by
// // the signup form (and later reset-password). The backend has the SAME rules
// // in server/utils/validators.js — the backend is the real gatekeeper, this
// // file only gives the user instant feedback. If you change one, change both.
// //
// // Every validator returns an error STRING when invalid, "" when valid.

// import { countryCodes } from "@/utils/countryCodes";

// // ── Phone ───────────────────────────────────────────────────────────────
// // Key = dial code (digits only). min/max = length of the LOCAL number
// // (without dial code). `start` = optional regex the local number must match.
// export const PHONE_RULES = {
//   "91": { min: 10, max: 10, start: /^[6-9]/, hint: "10-digit Indian mobile number (starts with 6-9)" },
//   "1": { min: 10, max: 10, start: /^[2-9]/, hint: "10-digit number (area code + number)" },
//   "44": { min: 10, max: 10, start: /^[1-9]/, hint: "10-digit UK number (without the leading 0)" },
//   "971": { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit UAE number (without the leading 0)" },
//   "966": { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit Saudi number (without the leading 0)" },
//   "974": { min: 8, max: 8, hint: "8-digit Qatar number" },
//   "968": { min: 8, max: 8, hint: "8-digit Oman number" },
//   "965": { min: 8, max: 8, hint: "8-digit Kuwait number" },
//   "973": { min: 8, max: 8, hint: "8-digit Bahrain number" },
//   "61": { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit Australian number (without the leading 0)" },
//   "64": { min: 8, max: 10, hint: "8 to 10-digit New Zealand number" },
//   "65": { min: 8, max: 8, hint: "8-digit Singapore number" },
//   "60": { min: 9, max: 10, start: /^[1-9]/, hint: "9 or 10-digit Malaysian number (without the leading 0)" },
//   "62": { min: 9, max: 12, hint: "9 to 12-digit Indonesian number" },
//   "86": { min: 11, max: 11, hint: "11-digit Chinese mobile number" },
//   "81": { min: 10, max: 10, start: /^[1-9]/, hint: "10-digit Japanese number (without the leading 0)" },
//   "82": { min: 9, max: 10, hint: "9 or 10-digit Korean number" },
//   "49": { min: 10, max: 11, hint: "10 or 11-digit German number" },
//   "33": { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit French number (without the leading 0)" },
//   "39": { min: 9, max: 11, hint: "9 to 11-digit Italian number" },
//   "34": { min: 9, max: 9, hint: "9-digit Spanish number" },
//   "31": { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit Dutch number (without the leading 0)" },
//   "92": { min: 10, max: 10, start: /^[1-9]/, hint: "10-digit Pakistani number (without the leading 0)" },
//   "880": { min: 10, max: 10, start: /^[1-9]/, hint: "10-digit Bangladeshi number (without the leading 0)" },
//   "94": { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit Sri Lankan number (without the leading 0)" },
//   "977": { min: 10, max: 10, hint: "10-digit Nepali number" },
//   "27": { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit South African number (without the leading 0)" },
//   "234": { min: 10, max: 10, start: /^[1-9]/, hint: "10-digit Nigerian number (without the leading 0)" },
//   "254": { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit Kenyan number (without the leading 0)" },
//   "20": { min: 10, max: 10, start: /^[1-9]/, hint: "10-digit Egyptian number (without the leading 0)" },
//   "90": { min: 10, max: 10, start: /^[1-9]/, hint: "10-digit Turkish number (without the leading 0)" },
//   "7": { min: 10, max: 10, hint: "10-digit Russian/Kazakh number" },
//   "55": { min: 10, max: 11, hint: "10 or 11-digit Brazilian number" },
//   "52": { min: 10, max: 10, hint: "10-digit Mexican number" },
// };

// const DEFAULT_LOCAL_MIN = 5;
// const DEFAULT_LOCAL_MAX = 12;
// const TOTAL_MAX = 15; // E.164: dial code + number <= 15 digits

// // Longest local number we let the user type for a given dial code.
// export const maxLocalLength = (dial) => {
//   const rule = PHONE_RULES[String(dial)];
//   const ruleMax = rule ? rule.max : DEFAULT_LOCAL_MAX;
//   return Math.min(ruleMax, TOTAL_MAX - String(dial).length);
// };

// // `dial` = dial code digits, `local` = number typed by the user.
// export const validatePhoneLocal = (dial, local) => {
//   const d = String(dial || "").replace(/\D/g, "");
//   const l = String(local || "").replace(/\D/g, "");

//   if (!d) return "Please select a country code.";
//   if (!l) return "Phone number is required.";
//   // Same total-length cap the server applies (E.164 = 15 digits).
//   if (d.length + l.length > TOTAL_MAX) return "Phone number is too long.";

//   const rule = PHONE_RULES[d];
//   if (rule) {
//     if (l.length < rule.min || l.length > rule.max) {
//       return `Enter a valid ${rule.hint}.`;
//     }
//     if (rule.start && !rule.start.test(l)) {
//       return `Enter a valid ${rule.hint}.`;
//     }
//     return "";
//   }

//   if (l.length < DEFAULT_LOCAL_MIN || l.length > DEFAULT_LOCAL_MAX) {
//     return `Phone number must be ${DEFAULT_LOCAL_MIN} to ${DEFAULT_LOCAL_MAX} digits for the selected country.`;
//   }
//   return "";
// };

// // ── Password ────────────────────────────────────────────────────────────
// export const PASSWORD_MIN = 8;
// export const PASSWORD_MAX = 72;

// // Individual checks — the signup form shows these as a live checklist.
// export const PASSWORD_CHECKS = [
//   { key: "length", label: "At least 8 characters", test: (p) => p.length >= PASSWORD_MIN },
//   { key: "upper", label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
//   { key: "lower", label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
//   { key: "number", label: "One number (0-9)", test: (p) => /[0-9]/.test(p) },
//   { key: "special", label: "One special character (@ # $ % !)", test: (p) => /[^A-Za-z0-9\s]/.test(p) },
// ];

// export const validatePassword = (password) => {
//   if (!password) return "Password is required.";
//   if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
//   if (password.length > PASSWORD_MAX) return `Password must be at most ${PASSWORD_MAX} characters.`;
//   if (/\s/.test(password)) return "Password must not contain spaces.";
//   if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
//   if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
//   if (!/[0-9]/.test(password)) return "Password must include at least one number.";
//   if (!/[^A-Za-z0-9\s]/.test(password)) return "Password must include at least one special character (e.g. @ # $ % !).";
//   return "";
// };

// export const validateConfirmPassword = (password, confirm) => {
//   if (!confirm) return "Please confirm your password.";
//   if (password !== confirm) return "Passwords do not match.";
//   return "";
// };

// // ── Name / Email / Company / Country ────────────────────────────────────
// const NAME_REGEX = /^[\p{L}][\p{L}\s.'-]*$/u;
// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// const COMPANY_REGEX = /^[\p{L}\p{N}][\p{L}\p{N}\s.,&'()/+-]*$/u;

// export const validateName = (name) => {
//   const v = String(name || "").trim();
//   if (!v) return "Full name is required.";
//   if (v.length < 3) return "Full name must be at least 3 characters.";
//   if (v.length > 80) return "Full name must be at most 80 characters.";
//   if (!NAME_REGEX.test(v)) return "Full name can contain only letters, spaces and . ' -";
//   return "";
// };

// export const validateEmail = (email) => {
//   const v = String(email || "").trim();
//   if (!v) return "Email is required.";
//   if (v.length > 150) return "Email must be at most 150 characters.";
//   if (!EMAIL_REGEX.test(v)) return "Please enter a valid email address (e.g. you@example.com).";
//   return "";
// };

// export const validateCompany = (company) => {
//   const v = String(company || "").trim();
//   if (!v) return ""; // optional
//   if (v.length < 2) return "Company name must be at least 2 characters.";
//   if (v.length > 100) return "Company name must be at most 100 characters.";
//   if (!COMPANY_REGEX.test(v)) return "Company name contains invalid characters.";
//   return "";
// };

// export const validateCountry = (country) => {
//   const v = String(country || "").trim();
//   if (!v) return "Please select your country.";
//   return "";
// };

// // ── Country <-> phone code ──────────────────────────────────────────────
// // Same rule as the backend (server/utils/validators.js): the country the user
// // picked must own the phone code they used. +1, +7 and +599 are shared.
// const COUNTRY_BY_NAME = {};
// const COUNTRIES_BY_DIAL = {};
// countryCodes.forEach((c) => {
//   const dial = c.code.replace("+", "");
//   COUNTRY_BY_NAME[c.name.toLowerCase()] = { name: c.name, dial };
//   (COUNTRIES_BY_DIAL[dial] = COUNTRIES_BY_DIAL[dial] || []).push(c.name);
// });

// export const validateCountryMatchesDial = (country, dial) => {
//   const key = String(country || "").trim().toLowerCase();
//   const d = String(dial || "").replace(/\D/g, "");
//   if (!key) return "";
//   const entry = COUNTRY_BY_NAME[key];
//   if (!entry) return "Please select a valid country from the list.";
//   if (entry.dial !== d) {
//     return `The selected country (${entry.name}) uses +${entry.dial}, but the phone number uses +${d}. Please select the matching country or phone code.`;
//   }
//   return "";
// };

// const DIALS_LONGEST_FIRST = Object.keys(COUNTRIES_BY_DIAL).sort(
//   (a, b) => b.length - a.length,
// );

// // Detects the country from a number the user typed/pasted in INTERNATIONAL
// // form ("+60 12 345 6789" or "0060..."). Only an explicit "+" or "00" prefix
// // is trusted — a plain "9123456789" is a local number and is never guessed.
// // Returns null when it is not international or the code is unknown, otherwise
// //   { dial, local, countries: [names], ambiguous }
// // `ambiguous` = several countries share the code (+1, +7, +599), so the user
// // must pick the country themselves.
// export const parseInternationalNumber = (raw) => {
//   const text = String(raw || "").trim();
//   if (!/^(\+|00)/.test(text)) return null;
//   let all = text.replace(/\D/g, "");
//   if (!text.startsWith("+")) all = all.slice(2); // drop the "00" prefix
//   for (const dial of DIALS_LONGEST_FIRST) {
//     if (all.startsWith(dial)) {
//       const countries = COUNTRIES_BY_DIAL[dial];
//       return {
//         dial,
//         local: all.slice(dial.length),
//         countries,
//         ambiguous: countries.length > 1,
//         // true while the user may still be typing a LONGER code that starts
//         // with these digits (+1 ... could become +1242 Bahamas), so callers
//         // should wait before converting the text into dial + local.
//         pending: DIALS_LONGEST_FIRST.some(
//           (e) => e !== dial && e.length > all.length && e.startsWith(all),
//         ),
//       };
//     }
//   }
//   return null;
// };





// FILE: client/src/utils/phoneRules.js
//
// usage ----->>>>>  Country-wise phone number rules + password rules used by
// the signup form (and later reset-password). The backend has the SAME rules
// in server/utils/validators.js — the backend is the real gatekeeper, this
// file only gives the user instant feedback. If you change one, change both.
//
// Every validator returns an error STRING when invalid, "" when valid.

import { countryCodes } from "@/utils/countryCodes";

// Precompute dial-code lookup tables ONCE at module load.
const DIAL_TO_COUNTRIES = new Map();
for (const c of countryCodes) {
  const digits = String(c.code || "").replace(/\D/g, "");
  if (!digits) continue;
  if (!DIAL_TO_COUNTRIES.has(digits)) DIAL_TO_COUNTRIES.set(digits, []);
  DIAL_TO_COUNTRIES.get(digits).push(c.name);
}

// Sorted longest-first so "+1649" (Turks & Caicos) matches before "+1".
const SORTED_DIALS_DESC = Array.from(DIAL_TO_COUNTRIES.keys()).sort(
  (a, b) => b.length - a.length,
);

// Returns all country names that own a given dial code (e.g. "91" -> ["India"]).
export const countriesForDial = (dial) => {
  const d = String(dial || "").replace(/\D/g, "");
  return DIAL_TO_COUNTRIES.get(d) || [];
};

/**
 * Parses a number typed or pasted in international form ("+60 12 345 6789" or "0060...").
 * Returns:
 *  - null if the string doesn't start with "+" / "00" or has no matching dial code
 *  - { dial, local, countries, ambiguous, pending } when matched:
 *      `pending: true` while the user is still typing the dial code (no local digits yet,
 *      or a longer dial code could still be completed, e.g. "+1" vs "+1242").
 */
export const parseInternationalNumber = (raw = "") => {
  const str = String(raw || "").trimStart();
  if (!/^(\+|00)/.test(str)) return null;

  const afterPrefix = str.replace(/^(\+|00)/, "");
  const digits = afterPrefix.replace(/\D/g, "");

  // Just "+" or "00" typed so far — wait for more digits.
  if (!digits) {
    return { dial: "", local: "", countries: [], ambiguous: false, pending: true };
  }

  // Find the longest known dial code that matches the start of `digits`.
  let matchedDial = null;
  for (const dial of SORTED_DIALS_DESC) {
    if (digits.startsWith(dial)) {
      matchedDial = dial;
      break;
    }
  }

  if (!matchedDial) {
    // Could still be a prefix of a valid dial code (e.g. user typed "+9" on the way to "+91").
    const couldBecomeDial = SORTED_DIALS_DESC.some((d) => d.startsWith(digits));
    if (couldBecomeDial && digits.length < 4) {
      return { dial: "", local: "", countries: [], ambiguous: false, pending: true };
    }
    return null;
  }

  const local = digits.slice(matchedDial.length);
  const countries = DIAL_TO_COUNTRIES.get(matchedDial) || [];
  const ambiguous = countries.length > 1;

  // Check if a LONGER dial code starts with the exact digits typed so far
  // (e.g. user typed "+1" or "+12" which could become "+1242" Bahamas).
  // Until they type enough digits to disambiguate (4+ total digits or a space after the code),
  // keep `pending: true` so PhoneInput doesn't prematurely lock in "+1".
  const hasExplicitSeparator = /^(\+|00)\d+[\s-]/.test(str);
  const longerDialPossible = SORTED_DIALS_DESC.some(
    (d) => d.length > matchedDial.length && d.startsWith(digits),
  );

  const pending =
    local.length === 0 || (longerDialPossible && !hasExplicitSeparator && digits.length < 4);

  return {
    dial: matchedDial,
    local,
    countries,
    ambiguous,
    pending,
  };
};

// ── Phone ───────────────────────────────────────────────────────────────
// Key = dial code (digits only). min/max = length of the LOCAL number
// (without dial code). `start` = optional regex the local number must match.
export const PHONE_RULES = {
  91: {
    min: 10,
    max: 10,
    start: /^[6-9]/,
    hint: "Enter a valid 10-digit Indian mobile number.",
  },
  1: {
    min: 10,
    max: 10,
    start: /^[2-9]/,
    hint: "10-digit number (area code + number)",
  },
  44: { min: 10, max: 10, start: /^[1-9]/, hint: "10-digit UK number (without the leading 0)" },
  971: { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit UAE number (without the leading 0)" },
  966: { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit Saudi number (without the leading 0)" },
  974: { min: 8, max: 8, hint: "8-digit Qatar number" },
  968: { min: 8, max: 8, hint: "8-digit Oman number" },
  965: { min: 8, max: 8, hint: "8-digit Kuwait number" },
  973: { min: 8, max: 8, hint: "8-digit Bahrain number" },
  61: {
    min: 9,
    max: 9,
    start: /^[1-9]/,
    hint: "9-digit Australian number (without the leading 0)",
  },
  64: { min: 8, max: 10, hint: "8 to 10-digit New Zealand number" },
  65: { min: 8, max: 8, hint: "8-digit Singapore number" },
  60: { min: 9, max: 10, start: /^[1-9]/, hint: "9 or 10-digit Malaysian number" },
  62: { min: 9, max: 12, hint: "9 to 12-digit Indonesian number" },
  86: { min: 11, max: 11, hint: "11-digit Chinese mobile number" },
  81: {
    min: 10,
    max: 10,
    start: /^[1-9]/,
    hint: "10-digit Japanese number (without the leading 0)",
  },
  82: { min: 9, max: 10, hint: "9 or 10-digit Korean number" },
  49: { min: 10, max: 11, hint: "10 or 11-digit German number" },
  33: { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit French number (without the leading 0)" },
  39: { min: 9, max: 11, hint: "9 to 11-digit Italian number" },
  34: { min: 9, max: 9, hint: "9-digit Spanish number" },
  31: { min: 9, max: 9, start: /^[1-9]/, hint: "9-digit Dutch number (without the leading 0)" },
  92: {
    min: 10,
    max: 10,
    start: /^[1-9]/,
    hint: "10-digit Pakistani number (without the leading 0)",
  },
  880: {
    min: 10,
    max: 10,
    start: /^[1-9]/,
    hint: "10-digit Bangladeshi number (without the leading 0)",
  },
  94: {
    min: 9,
    max: 9,
    start: /^[1-9]/,
    hint: "9-digit Sri Lankan number (without the leading 0)",
  },
  977: { min: 10, max: 10, hint: "10-digit Nepali number" },
  27: {
    min: 9,
    max: 9,
    start: /^[1-9]/,
    hint: "9-digit South African number (without the leading 0)",
  },
  234: {
    min: 10,
    max: 10,
    start: /^[1-9]/,
    hint: "10-digit Nigerian number (without the leading 0)",
  },
  254: {
    min: 9,
    max: 9,
    start: /^[1-9]/,
    hint: "9-digit Kenyan number (without the leading 0)",
  },
  20: {
    min: 10,
    max: 10,
    start: /^[1-9]/,
    hint: "10-digit Egyptian number (without the leading 0)",
  },
  90: {
    min: 10,
    max: 10,
    start: /^[1-9]/,
    hint: "10-digit Turkish number (without the leading 0)",
  },
  7: { min: 10, max: 10, hint: "10-digit Russian/Kazakh number" },
  55: { min: 10, max: 11, hint: "10 or 11-digit Brazilian number" },
  52: { min: 10, max: 10, hint: "10-digit Mexican number" },
};

const DEFAULT_LOCAL_MIN = 5;
const DEFAULT_LOCAL_MAX = 12;
const TOTAL_MAX = 15; // E.164: dial code + number <= 15 digits

// Longest local number we let the user type for a given dial code.
export const maxLocalLength = (dial) => {
  const rule = PHONE_RULES[String(dial)];
  const ruleMax = rule ? rule.max : DEFAULT_LOCAL_MAX;
  return Math.min(ruleMax, TOTAL_MAX - String(dial).length);
};

// Hints that already read as a full sentence are shown as-is.
const phoneHintMessage = (hint) =>
  hint.startsWith("Enter ") ? hint : `Enter a valid ${hint}.`;

// `dial` = dial code digits, `local` = number typed by the user.
export const validatePhoneLocal = (dial, local) => {
  const d = String(dial || "").replace(/\D/g, "");
  const l = String(local || "").replace(/\D/g, "");

  if (!d) return "Please select a country code.";
  if (!l) return "Phone number is required.";

  const rule = PHONE_RULES[d];
  if (rule) {
    if (l.length < rule.min || l.length > rule.max) {
      return phoneHintMessage(rule.hint);
    }
    if (rule.start && !rule.start.test(l)) {
      return phoneHintMessage(rule.hint);
    }
    return "";
  }

  if (l.length < DEFAULT_LOCAL_MIN || l.length > DEFAULT_LOCAL_MAX) {
    return `Phone number must be ${DEFAULT_LOCAL_MIN} to ${DEFAULT_LOCAL_MAX} digits for the selected country.`;
  }
  return "";
};

// ── Password ────────────────────────────────────────────────────────────
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

// Individual checks — the signup form shows these as a live checklist.
export const PASSWORD_CHECKS = [
  {
    key: "length",
    label: "At least 8 characters",
    test: (p) => p.length >= PASSWORD_MIN,
  },
  {
    key: "upper",
    label: "One uppercase letter (A-Z)",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    key: "lower",
    label: "One lowercase letter (a-z)",
    test: (p) => /[a-z]/.test(p),
  },
  { key: "number", label: "One number (0-9)", test: (p) => /[0-9]/.test(p) },
  {
    key: "special",
    label: "One special character (@ # $ % !)",
    test: (p) => /[^A-Za-z0-9\s]/.test(p),
  },
];

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < PASSWORD_MIN)
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (password.length > PASSWORD_MAX)
    return `Password must be at most ${PASSWORD_MAX} characters.`;
  if (/\s/.test(password)) return "Password must not contain spaces.";
  if (!/[A-Z]/.test(password))
    return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must include at least one lowercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must include at least one number.";
  if (!/[^A-Za-z0-9\s]/.test(password))
    return "Password must include at least one special character (e.g. @ # $ % !).";
  return "";
};

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return "";
};

// ── Name / Email / Company / Country ────────────────────────────────────
const NAME_REGEX = /^[\p{L}][\p{L}\s.'-]*$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COMPANY_REGEX = /^[\p{L}\p{N}][\p{L}\p{N}\s.,&'()/+-]*$/u;

export const validateName = (name) => {
  const v = String(name || "").trim();
  if (!v) return "Full name is required.";
  if (v.length < 3) return "Full name must be at least 3 characters.";
  if (v.length > 80) return "Full name must be at most 80 characters.";
  if (!NAME_REGEX.test(v))
    return "Full name can contain only letters, spaces and . ' -";
  return "";
};

export const validateEmail = (email) => {
  const v = String(email || "").trim();
  if (!v) return "Email is required.";
  if (v.length > 150) return "Email must be at most 150 characters.";
  if (!EMAIL_REGEX.test(v))
    return "Please enter a valid email address (e.g. you@example.com).";
  return "";
};

export const validateCompany = (company) => {
  const v = String(company || "").trim();
  if (!v) return ""; // optional
  if (v.length < 2) return "Company name must be at least 2 characters.";
  if (v.length > 100) return "Company name must be at most 100 characters.";
  if (!COMPANY_REGEX.test(v))
    return "Company name contains invalid characters.";
  return "";
};

export const validateCountry = (country) => {
  const v = String(country || "").trim();
  if (!v) return "Please select your country.";
  return "";
};

// Ensures the selected Country actually owns the selected phone dial code
// (e.g. blocks Country = "India" with dial code "+60").
export const validateCountryMatchesDial = (country, dial) => {
  const c = String(country || "").trim().toLowerCase();
  const d = String(dial || "").replace(/\D/g, "");
  if (!c || !d) return "";

  const allowed = DIAL_TO_COUNTRIES.get(d);
  if (!allowed || allowed.length === 0) return "";

  const matches = allowed.some((name) => name.trim().toLowerCase() === c);
  if (!matches) {
    return `Selected country does not match dial code +${d} (${allowed.join(" / ")}).`;
  }
  return "";
};