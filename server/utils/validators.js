// FILE: server/utils/validators.js
//
// usage ----->>>>>  Shared input-validation rules (password policy, name,
// email, company, country, phone-by-country). Used by the signup
// middleware today, and meant to be reused by reset-password and profile
// update so that EVERY place enforces the same rules.
//
// Every validator returns an error STRING when the value is invalid, or
// an empty string "" when it is valid. That keeps usage simple:
//
//     const err = validatePassword(pw);
//     if (err) errors.password = err;

// ─────────────────────────────────────────────────────────────────────────
// PASSWORD
// ─────────────────────────────────────────────────────────────────────────
// bcrypt only looks at the first 72 bytes of a password, so anything longer
// would silently be truncated. We cap at 72 to keep behaviour honest.
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

export const validatePassword = (password) => {
  if (typeof password !== "string" || password.length === 0) {
    return "Password is required.";
  }
  if (password.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  }
  if (password.length > PASSWORD_MAX) {
    return `Password must be at most ${PASSWORD_MAX} characters.`;
  }
  if (/\s/.test(password)) {
    return "Password must not contain spaces.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must include at least one number.";
  }
  // Special character = anything that is not a letter, digit or whitespace.
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    return "Password must include at least one special character (e.g. @ # $ % !).";
  }
  return "";
};

export const validateConfirmPassword = (password, confirm) => {
  if (typeof confirm !== "string" || confirm.length === 0) {
    return "Please confirm your password.";
  }
  if (password !== confirm) {
    return "Passwords do not match.";
  }
  return "";
};

// ─────────────────────────────────────────────────────────────────────────
// NAME / EMAIL / COMPANY / COUNTRY
// ─────────────────────────────────────────────────────────────────────────
// Letters from any language, spaces, dot, apostrophe, hyphen.
const NAME_REGEX = /^[\p{L}][\p{L}\s.'-]*$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COMPANY_REGEX = /^[\p{L}\p{N}][\p{L}\p{N}\s.,&'()/+-]*$/u;
const COUNTRY_REGEX = /^[\p{L}][\p{L}\s.,'()-]*$/u;

export const validateName = (name) => {
  if (typeof name !== "string" || !name.trim()) return "Full name is required.";
  const v = name.trim();
  if (v.length < 3) return "Full name must be at least 3 characters.";
  if (v.length > 80) return "Full name must be at most 80 characters.";
  if (!NAME_REGEX.test(v)) {
    return "Full name can contain only letters, spaces and . ' -";
  }
  return "";
};

export const validateEmail = (email) => {
  if (typeof email !== "string" || !email.trim()) return "Email is required.";
  const v = email.trim();
  if (v.length > 150) return "Email must be at most 150 characters.";
  if (!EMAIL_REGEX.test(v)) {
    return "Please enter a valid email address (e.g. you@example.com).";
  }
  return "";
};

// Company is optional, but when it is filled in it must look sensible.
export const validateCompany = (company) => {
  if (company === undefined || company === null || company === "") return "";
  if (typeof company !== "string") return "Company name is invalid.";
  const v = company.trim();
  if (v === "") return "";
  if (v.length < 2) return "Company name must be at least 2 characters.";
  if (v.length > 100) return "Company name must be at most 100 characters.";
  if (!COMPANY_REGEX.test(v)) return "Company name contains invalid characters.";
  return "";
};

export const validateCountry = (country) => {
  if (typeof country !== "string" || !country.trim()) {
    return "Please select your country.";
  }
  const v = country.trim();
  if (v.length < 2 || v.length > 80) return "Please select a valid country.";
  if (!COUNTRY_REGEX.test(v)) return "Please select a valid country.";
  return "";
};

// ─────────────────────────────────────────────────────────────────────────
// PHONE (country-wise)
// ─────────────────────────────────────────────────────────────────────────
// The frontend sends the phone as ONE digit string = dial code + local
// number (for example India: "91" + "9876543210" = "919876543210") and the
// dial code separately as `countryCode`.
//
// RULES maps a dial code -> allowed LOCAL number rule.
//   min / max : allowed length of the local number (without dial code)
//   start     : optional regex the local number must start with
//   hint      : text used in the error message
//
// IMPORTANT: this table is mirrored in client/src/utils/phoneRules.js.
// If you change one, change the other (the server cannot import from client/).
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

// Fallback for countries that are not in PHONE_RULES.
const DEFAULT_LOCAL_MIN = 5;
const DEFAULT_LOCAL_MAX = 12;
// International standard (E.164): dial code + number is at most 15 digits.
const TOTAL_MAX = 15;

export const validateCountryCode = (countryCode) => {
  if (typeof countryCode !== "string" && typeof countryCode !== "number") {
    return "Please select a country code.";
  }
  if (!/^[0-9]{1,4}$/.test(String(countryCode).trim())) {
    return "Please select a valid country code.";
  }
  return "";
};

// `phone` = dial code + local digits. `countryCode` = dial code digits.
export const validatePhone = (phone, countryCode) => {
  const codeErr = validateCountryCode(countryCode);
  if (codeErr) return codeErr;

  if (typeof phone !== "string" && typeof phone !== "number") {
    return "Phone number is required.";
  }
  const digits = String(phone).replace(/\D/g, "");
  const dial = String(countryCode).trim();

  if (!digits) return "Phone number is required.";
  if (!digits.startsWith(dial)) {
    return "Phone number does not match the selected country code.";
  }

  const local = digits.slice(dial.length);
  if (!local) return "Phone number is required.";
  if (digits.length > TOTAL_MAX) return "Phone number is too long.";

  const rule = PHONE_RULES[dial];
  if (rule) {
    if (local.length < rule.min || local.length > rule.max) {
      return `Enter a valid ${rule.hint}.`;
    }
    if (rule.start && !rule.start.test(local)) {
      return `Enter a valid ${rule.hint}.`;
    }
    return "";
  }

  if (local.length < DEFAULT_LOCAL_MIN || local.length > DEFAULT_LOCAL_MAX) {
    return `Phone number must be ${DEFAULT_LOCAL_MIN} to ${DEFAULT_LOCAL_MAX} digits for the selected country.`;
  }
  return "";
};