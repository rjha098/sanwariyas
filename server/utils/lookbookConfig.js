// // FILE: server/utils/lookbookConfig.js
// // Central, validated configuration for the PDF catalogue feature.
// // Values are read lazily (on every call) because ES-module imports are
// // evaluated before dotenv.config() runs in index.js.

// const intEnv = (name, fallback, min, max) => {
//   const raw = process.env[name];
//   if (raw === undefined || raw === "") return fallback;
//   const n = Number.parseInt(raw, 10);
//   if (!Number.isFinite(n)) return fallback;
//   return Math.min(Math.max(n, min), max);
// };

// const stringEnv = (name, fallback) => {
//   const raw = String(process.env[name] ?? "").trim();
//   return raw || fallback;
// };

// // Digits only, international format without "+" (e.g. 919876543210).
// // Returns "" when the value is missing or not a plausible E.164 number.
// export const normalizeWhatsAppNumber = (value) => {
//   const digits = String(value ?? "").replace(/[\s\-().+]/g, "");
//   return /^[1-9]\d{7,14}$/.test(digits) ? digits : "";
// };

// export const getLookbookConfig = () => ({
//   maxPdfBytes: intEnv("LOOKBOOK_PDF_MAX_MB", 200, 1, 500) * 1024 * 1024,
//   maxCatalogues: intEnv("LOOKBOOK_MAX_CATALOGUES", 7, 1, 50),
//   maxPages: intEnv("LOOKBOOK_PDF_MAX_PAGES", 500, 1, 1000),
//   fullMaxPx: intEnv("LOOKBOOK_IMAGE_FULL_MAX_PX", 2400, 800, 6000),
//   displayMaxPx: intEnv("LOOKBOOK_IMAGE_DISPLAY_MAX_PX", 1400, 600, 4000),
//   thumbMaxPx: intEnv("LOOKBOOK_IMAGE_THUMB_MAX_PX", 560, 200, 1200),
//   webpQuality: intEnv("LOOKBOOK_WEBP_QUALITY", 84, 40, 95),
//   maxInputPixels: intEnv("LOOKBOOK_MAX_INPUT_MEGAPIXELS", 80, 4, 400) * 1e6,
//   maxEmbeddedPerPage: intEnv("LOOKBOOK_MAX_EMBEDDED_PER_PAGE", 0, 0, 50),
//   minEmbeddedPx: intEnv("LOOKBOOK_MIN_EMBEDDED_PX", 500, 100, 4000),
//   toolTimeoutMs: intEnv("LOOKBOOK_TOOL_TIMEOUT_SEC", 120, 10, 900) * 1000,
//   pdftoppm: stringEnv("PDFTOPPM_PATH", "pdftoppm"),
//   pdfimages: stringEnv("PDFIMAGES_PATH", "pdfimages"),
//   pdfinfo: stringEnv("PDFINFO_PATH", "pdfinfo"),
//   whatsappNumber: normalizeWhatsAppNumber(process.env.LOOKBOOK_WHATSAPP_NUMBER),
// });

// FILE: server/utils/lookbookConfig.js
// Central, validated configuration for the PDF catalogue feature.
// Values are read lazily (on every call) because ES-module imports are
// evaluated before dotenv.config() runs in index.js.

const intEnv = (name, fallback, min, max) => {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
};

const stringEnv = (name, fallback) => {
  const raw = String(process.env[name] ?? "").trim();
  return raw || fallback;
};

// Digits only, international format without "+" (e.g. 919876543210).
// Returns "" when the value is missing or not a plausible E.164 number.
export const normalizeWhatsAppNumber = (value) => {
  const digits = String(value ?? "").replace(/[\s\-().+]/g, "");
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : "";
};

export const getLookbookConfig = () => ({
  maxPdfBytes: intEnv("LOOKBOOK_PDF_MAX_MB", 200, 1, 500) * 1024 * 1024,
  maxCatalogues: intEnv("LOOKBOOK_MAX_CATALOGUES", 7, 1, 50),
  maxPages: intEnv("LOOKBOOK_PDF_MAX_PAGES", 500, 1, 1000),
  fullMaxPx: intEnv("LOOKBOOK_IMAGE_FULL_MAX_PX", 2400, 800, 6000),
  displayMaxPx: intEnv("LOOKBOOK_IMAGE_DISPLAY_MAX_PX", 1400, 600, 4000),
  thumbMaxPx: intEnv("LOOKBOOK_IMAGE_THUMB_MAX_PX", 560, 200, 1200),
  webpQuality: intEnv("LOOKBOOK_WEBP_QUALITY", 84, 40, 95),
  maxInputPixels: intEnv("LOOKBOOK_MAX_INPUT_MEGAPIXELS", 80, 4, 400) * 1e6,
  maxEmbeddedPerPage: intEnv("LOOKBOOK_MAX_EMBEDDED_PER_PAGE", 0, 0, 50),
  minEmbeddedPx: intEnv("LOOKBOOK_MIN_EMBEDDED_PX", 500, 100, 4000),
  toolTimeoutMs: intEnv("LOOKBOOK_TOOL_TIMEOUT_SEC", 120, 10, 900) * 1000,
  pdftoppm: stringEnv("PDFTOPPM_PATH", "pdftoppm"),
  pdfimages: stringEnv("PDFIMAGES_PATH", "pdfimages"),
  pdfinfo: stringEnv("PDFINFO_PATH", "pdfinfo"),
  // Design code / details printed on each page (pdftotext ships with poppler;
  // Tesseract is optional - without it only real PDF text is used).
  pdftotext: stringEnv("PDFTOTEXT_PATH", "pdftotext"),
  tesseract: stringEnv("TESSERACT_PATH", "tesseract"),
  ocrMode:
    stringEnv("LOOKBOOK_OCR", "auto").toLowerCase() === "off" ? "off" : "auto",
  ocrTimeoutMs: intEnv("LOOKBOOK_OCR_TIMEOUT_SEC", 60, 10, 300) * 1000,
  whatsappNumber: normalizeWhatsAppNumber(process.env.LOOKBOOK_WHATSAPP_NUMBER),
});
