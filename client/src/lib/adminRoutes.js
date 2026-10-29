// // FILE: client/src/lib/adminRoutes.js

// export const ADMIN_ROUTES = {
//   overview: "/operations-center",
//   products: "/operations-center/products",
//   inquiries: "/operations-center/inquiries",
//   orders: "/operations-center/orders",
//   blogs: "/operations-center/blogs",
//   lookbook: "/operations-center/lookbook",
// };

// export const INQUIRY_STATUSES = ["pending", "contacted", "resolved"];

// // "" means "All". Anything unknown in the URL falls back to "All".
// export const parseInquiryStatus = (value) =>
//   INQUIRY_STATUSES.includes(value) ? value : "";

// export const parseListPage = (value) => {
//   const n = parseInt(value, 10);
//   return Number.isInteger(n) && n > 1 ? n : 1;
// };

// // Builds a list URL from filter state. Default values are omitted so URLs stay clean.
// export function buildInquiryListHref({ status = "", page = 1, id } = {}) {
//   const qs = new URLSearchParams();
//   const s = parseInquiryStatus(status);
//   const p = parseListPage(page);
//   if (s) qs.set("status", s);
//   if (p > 1) qs.set("page", String(p));
//   if (id) qs.set("id", String(id));
//   const str = qs.toString();
//   return str ? `${ADMIN_ROUTES.inquiries}?${str}` : ADMIN_ROUTES.inquiries;
// }

// // Detail pages receive the list's filter/page in their own query string and use this to
// // return to the exact list state. Only whitelisted params are read, so a crafted URL
// // can never redirect anywhere except the inquiries list.
// export function inquiryListHrefFromSearch(search = "") {
//   const src = new URLSearchParams(search);
//   return buildInquiryListHref({
//     status: src.get("status"),
//     page: src.get("page"),
//   });
// }

// export function buildInquiryDetailHref(inquiryId, { status = "", page = 1 } = {}) {
//   const qs = new URLSearchParams();
//   const s = parseInquiryStatus(status);
//   const p = parseListPage(page);
//   if (s) qs.set("status", s);
//   if (p > 1) qs.set("page", String(p));
//   const str = qs.toString();
//   return `${ADMIN_ROUTES.inquiries}/${inquiryId}${str ? `?${str}` : ""}`;
// }

// FILE: client/src/lib/adminRoutes.js

export const ADMIN_ROUTES = {
  overview: "/operations-center",
  products: "/operations-center/products",
  inquiries: "/operations-center/inquiries",
  orders: "/operations-center/orders",
  blogs: "/operations-center/blogs",
  lookbook: "/operations-center/lookbook",
};

export const INQUIRY_STATUSES = ["pending", "contacted", "resolved"];

// "" means "All". Anything unknown in the URL falls back to "All".
export const parseInquiryStatus = (value) =>
  INQUIRY_STATUSES.includes(value) ? value : "";

export const parseListPage = (value) => {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 1 ? n : 1;
};

// Builds a list URL from filter state. Default values are omitted so URLs stay clean.
export function buildInquiryListHref({ status = "", page = 1, id } = {}) {
  const qs = new URLSearchParams();
  const s = parseInquiryStatus(status);
  const p = parseListPage(page);
  if (s) qs.set("status", s);
  if (p > 1) qs.set("page", String(p));
  if (id) qs.set("id", String(id));
  const str = qs.toString();
  return str ? `${ADMIN_ROUTES.inquiries}?${str}` : ADMIN_ROUTES.inquiries;
}

// Detail pages receive the list's filter/page in their own query string and use this to
// return to the exact list state. Only whitelisted params are read, so a crafted URL
// can never redirect anywhere except the inquiries list.
export function inquiryListHrefFromSearch(search = "") {
  const src = new URLSearchParams(search);
  return buildInquiryListHref({
    status: src.get("status"),
    page: src.get("page"),
  });
}

export function buildInquiryDetailHref(
  inquiryId,
  { status = "", page = 1, focusLog = false } = {},
) {
  const qs = new URLSearchParams();
  const s = parseInquiryStatus(status);
  const p = parseListPage(page);
  if (s) qs.set("status", s);
  if (p > 1) qs.set("page", String(p));
  if (focusLog) qs.set("log", "1");
  const str = qs.toString();
  return `${ADMIN_ROUTES.inquiries}/${inquiryId}${str ? `?${str}` : ""}`;
}
