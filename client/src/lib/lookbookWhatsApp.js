// // FILE: client/src/lib/lookbookWhatsApp.js
// // Pure helpers for the consolidated WhatsApp click-to-chat inquiry.
// // No React, no network – so the behaviour is easy to unit test.
// //
// // NOTE: click-to-chat can only PRE-FILL TEXT. It cannot attach images, so the
// // message carries design codes and public reference links instead.

// export const MAX_SELECTION = 40;
// // Keep the final URL comfortably below what browsers / WhatsApp accept.
// const MAX_ENCODED_MESSAGE = 4500;

// // International number, digits only (no "+"). Returns "" when invalid.
// export const normalizeWhatsAppNumber = (value) => {
//   const digits = String(value ?? "").replace(/[\s\-().+]/g, "");
//   return /^[1-9]\d{7,14}$/.test(digits) ? digits : "";
// };

// const clean = (v, max) =>
//   String(v ?? "")
//     .replace(/[\u0000-\u001F\u007F]/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .slice(0, max);

// export const validateInquiryDetails = ({
//   name,
//   businessName,
//   phone,
//   state,
// }) => {
//   const errors = {};
//   if (clean(name, 80).length < 2) errors.name = "Please enter your name.";
//   if (clean(businessName, 120).length < 2)
//     errors.businessName = "Please enter your business / store name.";
//   const stateText = clean(state, 80);
//   if (
//     stateText.length < 2 ||
//     !/^[\p{L}\p{M}][\p{L}\p{M}\s.'&-]*$/u.test(stateText)
//   )
//     errors.state = "Please enter your state.";
//   const digits = String(phone ?? "").replace(/\D/g, "");
//   if (digits.length < 7 || digits.length > 15)
//     errors.phone = "Enter a valid contact number (7–15 digits).";
//   return errors;
// };

// const catalogueParam = (item) =>
//   item?.catalogueId ? `catalogue=${item.catalogueId}&` : "";

// // Link opens the right catalogue and then that exact page.
// const referenceUrl = (siteUrl, item) =>
//   `${String(siteUrl || "").replace(/\/+$/, "")}/lookbook?${catalogueParam(item)}item=${item._id}`;

// const bundleUrl = (siteUrl, items) =>
//   `${String(siteUrl || "").replace(/\/+$/, "")}/lookbook?${catalogueParam(items[0])}items=${items
//     .map((i) => i._id)
//     .join(",")}`;

// const header = ({ name, businessName, phone, state }) =>
//   [
//     "Hello SANWARIYAS Team,",
//     "",
//     "I would like to enquire about the following catalogue designs.",
//     "",
//     `Customer Name: ${clean(name, 80)}`,
//     `Business Name: ${clean(businessName, 120)}`,
//     `State: ${clean(state, 80)}`,
//     `Contact Number: ${clean(phone, 30)}`,
//     "",
//   ].join("\n");

// const footerText = [
//   "Please share the wholesale prices, minimum order quantity and availability for these designs.",
//   "",
//   "Thank you.",
// ].join("\n");

// // Optional quick-preference answers ({ question, answer: [] }).
// const preferencesBlock = (answers) => {
//   const lines = (Array.isArray(answers) ? answers : [])
//     .map((a) => ({
//       q: clean(a?.question, 120),
//       a: (Array.isArray(a?.answer) ? a.answer : [a?.answer])
//         .map((x) => clean(x, 60))
//         .filter(Boolean)
//         .join(", "),
//     }))
//     .filter((x) => x.q && x.a)
//     .slice(0, 8)
//     .map((x) => `- ${x.q}: ${x.a}`);
//   return lines.length ? `\nPreferences:\n${lines.join("\n")}\n` : "";
// };

// const designBlock = (item, index, siteUrl) =>
//   [
//     `${index + 1}. Design Code: ${clean(item.styleNumber, 40) || "—"}`,
//     `   Catalogue: ${clean(item.catalogueTitle || item.category, 80) || "Lookbook"}${
//       item.pageNumber ? ` (Page ${item.pageNumber})` : ""
//     }`,
//     `   Image/Page: ${referenceUrl(siteUrl, item)}`,
//   ].join("\n");

// // Returns { text, compact }. Falls back to a compact layout (codes + one
// // link to all designs) when the full layout would make the URL too long.
// export const buildInquiryMessage = ({ details, items, siteUrl, answers }) => {
//   const prefs = preferencesBlock(answers);
//   const full = `${header(details)}\nSelected Designs (${items.length}):\n${items
//     .map((it, i) => designBlock(it, i, siteUrl))
//     .join("\n\n")}\n${prefs}\n${footerText}`;
//   if (encodeURIComponent(full).length <= MAX_ENCODED_MESSAGE) {
//     return { text: full, compact: false };
//   }
//   const compact = `${header(details)}\nSelected Designs (${items.length}):\n${items
//     .map(
//       (it, i) =>
//         `${i + 1}. ${clean(it.styleNumber, 40) || "—"} – ${
//           clean(it.catalogueTitle || it.category, 40) || "Lookbook"
//         }${it.pageNumber ? ` p.${it.pageNumber}` : ""}`,
//     )
//     .join(
//       "\n",
//     )}\n\nView all selected designs: ${bundleUrl(siteUrl, items)}\n${prefs}\n${footerText}`;
//   return { text: compact, compact: true };
// };

// // Official click-to-chat URL. Returns "" if the number is invalid.
// export const buildWhatsAppUrl = (number, text) => {
//   const n = normalizeWhatsAppNumber(number);
//   if (!n) return "";
//   return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
// };

// FILE: client/src/lib/lookbookWhatsApp.js
// Pure helpers for the consolidated WhatsApp click-to-chat inquiry.
// No React, no network – so the behaviour is easy to unit test.
//
// NOTE: click-to-chat can only PRE-FILL TEXT. It cannot attach images, so the
// message carries design codes and public reference links instead.

export const MAX_SELECTION = 40;
// Keep the final URL comfortably below what browsers / WhatsApp accept.
const MAX_ENCODED_MESSAGE = 4500;

// International number, digits only (no "+"). Returns "" when invalid.
export const normalizeWhatsAppNumber = (value) => {
  const digits = String(value ?? "").replace(/[\s\-().+]/g, "");
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : "";
};

const clean = (v, max) =>
  String(v ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export const validateInquiryDetails = ({
  name,
  businessName,
  phone,
  state,
}) => {
  const errors = {};
  if (clean(name, 80).length < 2) errors.name = "Please enter your name.";
  if (clean(businessName, 120).length < 2)
    errors.businessName = "Please enter your business / store name.";
  const stateText = clean(state, 80);
  if (
    stateText.length < 2 ||
    !/^[\p{L}\p{M}][\p{L}\p{M}\s.'&-]*$/u.test(stateText)
  )
    errors.state = "Please enter your state.";
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15)
    errors.phone = "Enter a valid contact number (7–15 digits).";
  return errors;
};

const catalogueParam = (item) =>
  item?.catalogueId ? `catalogue=${item.catalogueId}&` : "";

// Link opens the right catalogue and then that exact page.
const referenceUrl = (siteUrl, item) =>
  `${String(siteUrl || "").replace(/\/+$/, "")}/lookbook?${catalogueParam(item)}item=${item._id}`;

const bundleUrl = (siteUrl, items) =>
  `${String(siteUrl || "").replace(/\/+$/, "")}/lookbook?${catalogueParam(items[0])}items=${items
    .map((i) => i._id)
    .join(",")}`;

const header = ({ name, businessName, phone, state }) =>
  [
    "Hello SANWARIYAS Team,",
    "",
    "I would like to enquire about the following catalogue designs.",
    "",
    `Customer Name: ${clean(name, 80)}`,
    `Business Name: ${clean(businessName, 120)}`,
    `State: ${clean(state, 80)}`,
    `Contact Number: ${clean(phone, 30)}`,
    "",
  ].join("\n");

const footerText = [
  "Please share the wholesale prices, minimum order quantity and availability for these designs.",
  "",
  "Thank you.",
].join("\n");

// Optional quick-preference answers ({ question, answer: [] }).
const preferencesBlock = (answers) => {
  const lines = (Array.isArray(answers) ? answers : [])
    .map((a) => ({
      q: clean(a?.question, 120),
      a: (Array.isArray(a?.answer) ? a.answer : [a?.answer])
        .map((x) => clean(x, 60))
        .filter(Boolean)
        .join(", "),
    }))
    .filter((x) => x.q && x.a)
    .slice(0, 8)
    .map((x) => `- ${x.q}: ${x.a}`);
  return lines.length ? `\nPreferences:\n${lines.join("\n")}\n` : "";
};

const designBlock = (item, index, siteUrl) =>
  [
    `${index + 1}. Design Code: ${clean(item.styleNumber, 40) || "Cover / info page"}`,
    ...(item.detailText ? [`   Details: ${clean(item.detailText, 200)}`] : []),
    `   Catalogue: ${clean(item.catalogueTitle || item.category, 80) || "Lookbook"}${
      item.pageNumber ? ` (Page ${item.pageNumber})` : ""
    }`,
    `   Image/Page: ${referenceUrl(siteUrl, item)}`,
  ].join("\n");

// Returns { text, compact }. Falls back to a compact layout (codes + one
// link to all designs) when the full layout would make the URL too long.
export const buildInquiryMessage = ({ details, items, siteUrl, answers }) => {
  const prefs = preferencesBlock(answers);
  const full = `${header(details)}\nSelected Designs (${items.length}):\n${items
    .map((it, i) => designBlock(it, i, siteUrl))
    .join("\n\n")}\n${prefs}\n${footerText}`;
  if (encodeURIComponent(full).length <= MAX_ENCODED_MESSAGE) {
    return { text: full, compact: false };
  }
  const compact = `${header(details)}\nSelected Designs (${items.length}):\n${items
    .map(
      (it, i) =>
        `${i + 1}. ${clean(it.styleNumber, 40) || "—"} – ${
          clean(it.catalogueTitle || it.category, 40) || "Lookbook"
        }${it.pageNumber ? ` p.${it.pageNumber}` : ""}`,
    )
    .join(
      "\n",
    )}\n\nView all selected designs: ${bundleUrl(siteUrl, items)}\n${prefs}\n${footerText}`;
  return { text: compact, compact: true };
};

// Official click-to-chat URL. Returns "" if the number is invalid.
export const buildWhatsAppUrl = (number, text) => {
  const n = normalizeWhatsAppNumber(number);
  if (!n) return "";
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
};
