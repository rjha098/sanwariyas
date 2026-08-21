// // FILE: server/utils/normalize.js

// // Removes spaces, dashes, and leading "+" so the same phone number
// // entered in different formats (e.g. "+91 5489657895", "3697-468-579",
// // "4596874535") always compares equal.
// export const normalizePhone = (phone) => {
//   if (!phone) return "";
//   return String(phone).trim().replace(/[\s\-+]/g, "");
// };

// export const normalizeEmail = (email) => {
//   if (!email) return "";
//   return String(email).trim().toLowerCase();
// };


// FILE: server/utils/normalize.js

// Plain digit cleanup — used everywhere a phone is WRITTEN (signup,
// profile update, inquiry submission). All of these now go through the
// <PhoneInput> component on the frontend, which combines the selected
// country's dial code + local number into one clean digit string before
// it ever reaches the API (e.g. India "+91" + "6203290195" -> the request
// already sends "916203290195"). So this function no longer needs to
// GUESS at stripping a country code — it just strips any stray
// non-digit characters as a defensive measure.
export const normalizePhone = (phone) => {
  if (!phone) return "";
  return String(phone).replace(/\D/g, "");
};

export const normalizeEmail = (email) => {
  if (!email) return "";
  return String(email).trim().toLowerCase();
};

// LOGIN is still a single free-text "Email or Phone" field, so someone
// might type their number with or without the country code (e.g.
// "6203290195" vs "916203290195" vs "+91 6203290195") even though it's
// stored combined. This returns every plausible normalized form so the
// login lookup can match any of them — it does NOT touch how numbers are
// stored, only how a typed-in login identifier is interpreted.
export const phoneMatchCandidates = (identifier) => {
  const digits = normalizePhone(identifier);
  if (!digits) return [];

  const candidates = new Set([digits]);

  // Typed without a country code (bare 10-digit local number) — also try
  // it with India's dial code, since that's this business's default.
  if (digits.length === 10) {
    candidates.add(`91${digits}`);
  }

  // Typed with the "91" dial code included — also try the bare local part.
  if (digits.length === 12 && digits.startsWith("91")) {
    candidates.add(digits.slice(2));
  }

  // Typed with a leading domestic trunk "0" — also try without it, and
  // with the dial code in place of it.
  if (digits.length === 11 && digits.startsWith("0")) {
    const withoutZero = digits.slice(1);
    candidates.add(withoutZero);
    candidates.add(`91${withoutZero}`);
  }

  return Array.from(candidates);
};