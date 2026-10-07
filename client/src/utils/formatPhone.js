import { countryCodes } from "@/utils/countryCodes";

const DIAL_CODES = Array.from(
  new Set(countryCodes.map((c) => c.code.replace(/\D/g, ""))),
).sort((a, b) => b.length - a.length);

export function formatPhone(value, { assumeIndia = false } = {}) {
  if (value === null || value === undefined) return "";
  const raw = String(value).trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return raw;

  // No country selector on this field: a short number is a local Indian one.
  if (assumeIndia && digits.length <= 11) {
    return `+91 ${digits.replace(/^0/, "")}`;
  }

  // Bare Indian mobile (10 digits starting 6-9), optionally with trunk "0".
  if (/^[6-9]\d{9}$/.test(digits)) return `+91 ${digits}`;
  if (/^0[6-9]\d{9}$/.test(digits)) return `+91 ${digits.slice(1)}`;

  // Longest dial code first so "+1649" wins over "+1".
  for (const dial of DIAL_CODES) {
    if (digits.startsWith(dial) && digits.length > dial.length) {
      return `+${dial} ${digits.slice(dial.length)}`;
    }
  }
  return raw; // unknown shape: show exactly what is stored
}