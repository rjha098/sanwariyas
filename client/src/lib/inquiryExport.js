// FILE: client/src/lib/inquiryExport.js
// Downloads the admin Excel export (.xlsx) through the authenticated api client.

import api from "@/lib/api";

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// range: { from?: "YYYY-MM-DD", to?: "YYYY-MM-DD" } (both optional = everything)
export async function downloadInquiryExcel(token, { from, to } = {}) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;

  try {
    const res = await api.get("/inquiry/export", {
      params,
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
      timeout: 120000,
    });

    const blob = new Blob([res.data], {
      type: res.headers?.["content-type"] || XLSX_MIME,
    });
    const stamp = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sanwariyas-inquiries-${stamp}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (error) {
    // Error bodies arrive as a Blob because of responseType: "blob".
    let message = error.userMessage;
    const data = error.response?.data;
    if (typeof Blob !== "undefined" && data instanceof Blob) {
      try {
        message = JSON.parse(await data.text()).message || message;
      } catch {
        // keep fallback
      }
    }
    throw new Error(message || "Could not download the Excel file.");
  }
}
