// FILE: client/src/utils/phoneRules.js
//
// usage ----->>>>>  Country-wise phone number rules + password rules used by
// the signup form (and later reset-password). The backend has the SAME rules
// in server/utils/validators.js — the backend is the real gatekeeper, this
// file only gives the user instant feedback. If you change one, change both.
//
// Every validator returns an error STRING when invalid, "" when valid.

// ── Phone ───────────────────────────────────────────────────────────────
// Key = dial code (digits only). min/max = length of the LOCAL number
// (without dial code). `start` = optional regex the local number must match.
export const PHONE_RULES = {
  "91": { min: 10, max: 10, start: /^[6-9]/, hint: "10-digit Indian mobile number (starts with 6-9)" },
  "1": { min: 10, max: 10, start: /^[2-9]/, hint: "10-digit number (area code + number)" },
  "44": { min: 10, max: 10, hint: "10-digit UK number (without the leading 0)" },
  "971": { min: 9, max: 9, hint: "9-digit UAE number (without the leading 0)" },
  "966": { min: 9, max: 9, hint: "9-digit Saudi number (without the leading 0)" },
  "974": { min: 8, max: 8, hint: "8-digit Qatar number" },
  "968": { min: 8, max: 8, hint: "8-digit Oman number" },
  "965": { min: 8, max: 8, hint: "8-digit Kuwait number" },
  "973": { min: 8, max: 8, hint: "8-digit Bahrain number" },
  "61": { min: 9, max: 9, hint: "9-digit Australian number (without the leading 0)" },
  "64": { min: 8, max: 10, hint: "8 to 10-digit New Zealand number" },
  "65": { min: 8, max: 8, hint: "8-digit Singapore number" },
  "60": { min: 9, max: 10, hint: "9 or 10-digit Malaysian number" },
  "62": { min: 9, max: 12, hint: "9 to 12-digit Indonesian number" },
  "86": { min: 11, max: 11, hint: "11-digit Chinese mobile number" },
  "81": { min: 10, max: 10, hint: "10-digit Japanese number (without the leading 0)" },
  "82": { min: 9, max: 10, hint: "9 or 10-digit Korean number" },
  "49": { min: 10, max: 11, hint: "10 or 11-digit German number" },
  "33": { min: 9, max: 9, hint: "9-digit French number (without the leading 0)" },
  "39": { min: 9, max: 11, hint: "9 to 11-digit Italian number" },
  "34": { min: 9, max: 9, hint: "9-digit Spanish number" },
  "31": { min: 9, max: 9, hint: "9-digit Dutch number (without the leading 0)" },
  "92": { min: 10, max: 10, hint: "10-digit Pakistani number (without the leading 0)" },
  "880": { min: 10, max: 10, hint: "10-digit Bangladeshi number (without the leading 0)" },
  "94": { min: 9, max: 9, hint: "9-digit Sri Lankan number (without the leading 0)" },
  "977": { min: 10, max: 10, hint: "10-digit Nepali number" },
  "27": { min: 9, max: 9, hint: "9-digit South African number (without the leading 0)" },
  "234": { min: 10, max: 10, hint: "10-digit Nigerian number (without the leading 0)" },
  "254": { min: 9, max: 9, hint: "9-digit Kenyan number (without the leading 0)" },
  "20": { min: 10, max: 10, hint: "10-digit Egyptian number (without the leading 0)" },
  "90": { min: 10, max: 10, hint: "10-digit Turkish number (without the leading 0)" },
  "7": { min: 10, max: 10, hint: "10-digit Russian/Kazakh number" },
  "55": { min: 10, max: 11, hint: "10 or 11-digit Brazilian number" },
  "52": { min: 10, max: 10, hint: "10-digit Mexican number" },
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

// `dial` = dial code digits, `local` = number typed by the user.
export const validatePhoneLocal = (dial, local) => {
  const d = String(dial || "").replace(/\D/g, "");
  const l = String(local || "").replace(/\D/g, "");

  if (!d) return "Please select a country code.";
  if (!l) return "Phone number is required.";

  const rule = PHONE_RULES[d];
  if (rule) {
    if (l.length < rule.min || l.length > rule.max) {
      return `Enter a valid ${rule.hint}.`;
    }
    if (rule.start && !rule.start.test(l)) {
      return `Enter a valid ${rule.hint}.`;
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
  { key: "length", label: "At least 8 characters", test: (p) => p.length >= PASSWORD_MIN },
  { key: "upper", label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "One number (0-9)", test: (p) => /[0-9]/.test(p) },
  { key: "special", label: "One special character (@ # $ % !)", test: (p) => /[^A-Za-z0-9\s]/.test(p) },
];

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (password.length > PASSWORD_MAX) return `Password must be at most ${PASSWORD_MAX} characters.`;
  if (/\s/.test(password)) return "Password must not contain spaces.";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include at least one number.";
  if (!/[^A-Za-z0-9\s]/.test(password)) return "Password must include at least one special character (e.g. @ # $ % !).";
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
  if (!NAME_REGEX.test(v)) return "Full name can contain only letters, spaces and . ' -";
  return "";
};

export const validateEmail = (email) => {
  const v = String(email || "").trim();
  if (!v) return "Email is required.";
  if (v.length > 150) return "Email must be at most 150 characters.";
  if (!EMAIL_REGEX.test(v)) return "Please enter a valid email address (e.g. you@example.com).";
  return "";
};

export const validateCompany = (company) => {
  const v = String(company || "").trim();
  if (!v) return ""; // optional
  if (v.length < 2) return "Company name must be at least 2 characters.";
  if (v.length > 100) return "Company name must be at most 100 characters.";
  if (!COMPANY_REGEX.test(v)) return "Company name contains invalid characters.";
  return "";
};

export const validateCountry = (country) => {
  const v = String(country || "").trim();
  if (!v) return "Please select your country.";
  return "";
};