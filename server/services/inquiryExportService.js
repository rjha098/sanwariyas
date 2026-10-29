// FILE: server/services/inquiryExportService.js
//
// Builds ONE .xlsx workbook with every inquiry:
//   Summary | All Inquiries | New | Contacted | Resolved | Contact History
// "New" = pending, "Contacted" = contacted, "Resolved" = resolved (old aliases
// such as In Progress / Quoted / Closed are mapped the same way the admin list does).
//
// Admin only (route is behind requireAdmin). Includes the PRIVATE contact log.

import ExcelJS from "exceljs";
import Inquiry from "../models/Inquiry.js";
import { STATUS_ALIASES } from "./inquiryService.js";
import { formatPhone } from "../utils/formatPhone.js";

// Safety cap so one click can never exhaust server memory.
const MAX_EXPORT_ROWS = Number(process.env.INQUIRY_EXPORT_MAX_ROWS) || 20000;
// Excel has no time zones, so dates are shifted to the business time zone
// (default IST = +330 min) and then shown as plain date-times.
const TZ_OFFSET_MIN = Number.isFinite(Number(process.env.EXPORT_TZ_OFFSET_MIN))
  ? Number(process.env.EXPORT_TZ_OFFSET_MIN)
  : 330;

const DATE_FMT = "dd-mmm-yyyy hh:mm";
const BRAND = "FF7A3D2A";
const STATUS_FILL = {
  New: "FFFEF3C7",
  Contacted: "FFDBEAFE",
  Resolved: "FFDCFCE7",
};
const CHANNEL_LABEL = {
  whatsapp: "WhatsApp",
  call: "Phone call",
  email: "Email",
  meeting: "Meeting",
  other: "Other",
};

const badRequest = (message, status = 400) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

export const statusLabel = (status) => {
  if (STATUS_ALIASES.resolved.includes(status)) return "Resolved";
  if (STATUS_ALIASES.contacted.includes(status)) return "Contacted";
  return "New";
};

// Strip characters XML/Excel cannot store and respect Excel's 32,767 char cell limit.
// (exceljs writes strings as real strings, never formulas, so values such as
//  "=1+1" stay plain text and cannot run as formulas.)
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;
const text = (v) => {
  if (v === undefined || v === null) return "";
  return String(v).replace(CONTROL_CHARS, "").slice(0, 32000);
};

const toSheetDate = (d) => {
  if (!d) return null;
  const t = new Date(d).getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t + TZ_OFFSET_MIN * 60 * 1000);
};

const parseDay = (value, endOfDay = false) => {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw badRequest("Dates must be in YYYY-MM-DD format.");
  }
  // Interpret the day in the business time zone, not the server's.
  const base = Date.parse(`${value}T00:00:00.000Z`);
  if (Number.isNaN(base)) throw badRequest("Invalid date.");
  const start = base - TZ_OFFSET_MIN * 60 * 1000;
  return new Date(endOfDay ? start + 24 * 60 * 60 * 1000 - 1 : start);
};

const INQUIRY_COLUMNS = [
  { header: "#", key: "no", width: 6 },
  { header: "Inquiry Date", key: "createdAt", width: 19, date: true },
  { header: "Status", key: "status", width: 12 },
  { header: "Customer Name", key: "name", width: 22 },
  { header: "Company", key: "company", width: 26 },
  { header: "Email", key: "email", width: 30 },
  { header: "WhatsApp", key: "whatsapp", width: 18 },
  { header: "Country", key: "country", width: 14 },
  { header: "State", key: "state", width: 16 },
  { header: "Product Category", key: "category", width: 20 },
  { header: "Product", key: "product", width: 24 },
  { header: "Quantity", key: "quantity", width: 10 },
  { header: "Budget", key: "budget", width: 14 },
  { header: "Customer Message", key: "message", width: 50, wrap: true },
  { header: "Images", key: "images", width: 8 },
  { header: "Chat Replies", key: "replies", width: 10 },
  { header: "Last Contacted", key: "lastContactedAt", width: 19, date: true },
  { header: "Next Follow-up", key: "nextFollowUpAt", width: 19, date: true },
  { header: "Contact Entries", key: "logCount", width: 10 },
  { header: "Latest Contact Note", key: "latestNote", width: 50, wrap: true },
  { header: "Admin Notes", key: "adminNotes", width: 36, wrap: true },
  { header: "Inquiry ID", key: "id", width: 26 },
];

const LOG_COLUMNS = [
  { header: "Inquiry Date", key: "createdAt", width: 19, date: true },
  { header: "Status", key: "status", width: 12 },
  { header: "Customer Name", key: "name", width: 22 },
  { header: "Company", key: "company", width: 26 },
  { header: "WhatsApp", key: "whatsapp", width: 18 },
  { header: "Logged At", key: "loggedAt", width: 19, date: true },
  { header: "Channel", key: "channel", width: 12 },
  { header: "What was discussed", key: "note", width: 70, wrap: true },
  { header: "Follow-up Date", key: "followUpAt", width: 19, date: true },
  { header: "Logged By", key: "by", width: 22 },
  { header: "Inquiry ID", key: "id", width: 26 },
];

const styleSheet = (ws, columns) => {
  ws.columns = columns.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width,
    style: {
      alignment: { vertical: "top", wrapText: !!c.wrap },
      ...(c.date ? { numFmt: DATE_FMT } : {}),
    },
  }));
  const header = ws.getRow(1);
  header.height = 22;
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND } };
    cell.alignment = { vertical: "middle", horizontal: "left" };
  });
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length },
  };
};

const colorStatusCell = (row, label) => {
  const cell = row.getCell("status");
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: STATUS_FILL[label] || "FFF3F4F6" },
  };
  cell.font = { bold: true };
};

export const buildInquiryWorkbook = async ({ from, to } = {}) => {
  const fromDate = parseDay(from, false);
  const toDate = parseDay(to, true);
  if (fromDate && toDate && fromDate > toDate) {
    throw badRequest("'From' date must be before 'To' date.");
  }

  const query = {};
  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) query.createdAt.$gte = fromDate;
    if (toDate) query.createdAt.$lte = toDate;
  }

  const total = await Inquiry.countDocuments(query);
  if (total > MAX_EXPORT_ROWS) {
    throw badRequest(
      `Too many inquiries (${total}) for one file. Please choose a smaller date range (limit ${MAX_EXPORT_ROWS}).`,
      413,
    );
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = "Sanwariyas Admin";
  wb.created = new Date();

  const summary = wb.addWorksheet("Summary");
  const sheets = {
    All: wb.addWorksheet("All Inquiries"),
    New: wb.addWorksheet("New"),
    Contacted: wb.addWorksheet("Contacted"),
    Resolved: wb.addWorksheet("Resolved"),
  };
  const history = wb.addWorksheet("Contact History");

  Object.values(sheets).forEach((ws) => styleSheet(ws, INQUIRY_COLUMNS));
  styleSheet(history, LOG_COLUMNS);

  const counts = { New: 0, Contacted: 0, Resolved: 0 };
  let followUpsDue = 0;
  let totalLogs = 0;
  const now = Date.now();
  const rowNo = { All: 0, New: 0, Contacted: 0, Resolved: 0 };

  const cursor = Inquiry.find(query)
    .select("+adminNotes +contactLogs +lastContactedAt +nextFollowUpAt")
    .populate("product", "name")
    .sort({ createdAt: -1 })
    .lean()
    .cursor();

  for await (const inq of cursor) {
    const label = statusLabel(inq.status);
    counts[label] += 1;

    const logs = Array.isArray(inq.contactLogs) ? inq.contactLogs : [];
    totalLogs += logs.length;
    const newest = [...logs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )[0];

    if (
      label !== "Resolved" &&
      inq.nextFollowUpAt &&
      new Date(inq.nextFollowUpAt).getTime() <= now
    ) {
      followUpsDue += 1;
    }

    const base = {
      createdAt: toSheetDate(inq.createdAt),
      status: label,
      name: text(inq.name),
      company: text(inq.companyName),
      email: text(inq.email),
      whatsapp: text(inq.whatsapp ? formatPhone(inq.whatsapp) : ""),
      country: text(inq.country),
      state: text(inq.state),
      category: text(inq.productCategory),
      product: text(inq.product?.name || inq.productName),
      quantity: inq.quantity ?? "",
      budget: text(inq.budgetRange),
      message: text(inq.message),
      images: Array.isArray(inq.sampleImages) ? inq.sampleImages.length : 0,
      replies: Array.isArray(inq.replies) ? inq.replies.length : 0,
      lastContactedAt: toSheetDate(inq.lastContactedAt),
      nextFollowUpAt: toSheetDate(inq.nextFollowUpAt),
      logCount: logs.length,
      latestNote: text(newest?.note),
      adminNotes: text(inq.adminNotes),
      id: String(inq._id),
    };

    for (const key of ["All", label]) {
      rowNo[key] += 1;
      const row = sheets[key].addRow({ ...base, no: rowNo[key] });
      colorStatusCell(row, label);
    }

    for (const log of logs) {
      history.addRow({
        createdAt: toSheetDate(inq.createdAt),
        status: label,
        name: text(inq.name),
        company: text(inq.companyName),
        whatsapp: text(inq.whatsapp ? formatPhone(inq.whatsapp) : ""),
        loggedAt: toSheetDate(log.createdAt),
        channel: CHANNEL_LABEL[log.channel] || text(log.channel),
        note: text(log.note),
        followUpAt: toSheetDate(log.followUpAt),
        by: text(log.createdBy),
        id: String(inq._id),
      });
    }
  }

  // ── Summary sheet ──
  summary.columns = [
    { key: "k", width: 30 },
    { key: "v", width: 26 },
  ];
  const generated = toSheetDate(new Date());
  const rows = [
    ["Sanwariyas — Inquiry Export", ""],
    ["Generated", generated],
    [
      "Date range",
      fromDate || toDate
        ? `${from || "start"}  to  ${to || "today"}`
        : "All time",
    ],
    ["", ""],
    ["Total inquiries", total],
    ["New", counts.New],
    ["Contacted", counts.Contacted],
    ["Resolved", counts.Resolved],
    ["", ""],
    ["Follow-ups due / overdue", followUpsDue],
    ["Contact entries written", totalLogs],
  ];
  rows.forEach((r) => summary.addRow(r));
  summary.getRow(1).font = { bold: true, size: 14, color: { argb: BRAND } };
  summary.getCell("B2").numFmt = DATE_FMT;
  summary.getCell("B2").alignment = { horizontal: "left" };
  [6, 7, 8].forEach((n, i) => {
    const label = ["New", "Contacted", "Resolved"][i];
    summary.getCell(`A${n}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: STATUS_FILL[label] },
    };
  });
  for (let n = 5; n <= 11; n += 1) {
    summary.getCell(`B${n}`).alignment = { horizontal: "left" };
  }
  summary.getCell("A5").font = { bold: true };

  return { workbook: wb, total };
};

// Streams the finished workbook to an Express response.
export const sendInquiryWorkbook = async (res, params = {}) => {
  const { workbook } = await buildInquiryWorkbook(params);

  const stamp = toSheetDate(new Date()).toISOString().slice(0, 10);
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="sanwariyas-inquiries-${stamp}.xlsx"`,
  );
  res.setHeader("Cache-Control", "no-store");

  await workbook.xlsx.write(res);
  res.end();
};
