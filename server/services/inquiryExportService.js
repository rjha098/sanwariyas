// FILE: server/services/inquiryExportService.js
//
// Builds ONE .xlsx workbook with every inquiry:
//   Summary | All Inquiries | New | Contacted | Resolved | Contact History
//
//  - Summary: coloured KPI cards + "Needs attention" list + top categories/countries
//  - Inquiry sheets: KEY DETAILS first (status, customer, WhatsApp, requirement,
//    message), then CONTACT TRACKING (private notes / follow-up), then OTHER DETAILS
//  - Contact History: one row per note written in the private contact log
//
// "New" = pending, "Contacted" = contacted, "Resolved" = resolved (old aliases such as
// In Progress / Quoted / Closed are mapped the same way the admin list does).
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
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const BRAND = "FF7A3D2A";
const WHITE = "FFFFFFFF";
const MAX_ATTENTION_ROWS = 15;

const STATUS_STYLE = {
  New: { fill: "FFFDE68A", text: "FF78350F" },
  Contacted: { fill: "FFBFDBFE", text: "FF1E3A8A" },
  Resolved: { fill: "FFBBF7D0", text: "FF14532D" },
};
const CHANNEL_LABEL = {
  whatsapp: "WhatsApp",
  call: "Phone call",
  email: "Email",
  meeting: "Meeting",
  other: "Other",
};

// Column groups (colour-coded bands on top of every sheet)
const GROUPS = {
  key: {
    label: "KEY DETAILS",
    band: "FF7A3D2A",
    head: "FFF3E3C3",
    headText: "FF4A2A1C",
    cell: "FFFFFBEF",
  },
  track: {
    label: "CONTACT TRACKING (PRIVATE - ADMIN ONLY)",
    band: "FF1D4ED8",
    head: "FFDBEAFE",
    headText: "FF1E3A8A",
    cell: null,
  },
  more: {
    label: "OTHER DETAILS",
    band: "FF6B7280",
    head: "FFE5E7EB",
    headText: "FF374151",
    cell: null,
  },
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

// "29 Oct 2026" (in the business time zone)
const fmtDay = (d) => {
  const s = toSheetDate(d);
  if (!s) return "";
  return `${s.getUTCDate()} ${MONTHS[s.getUTCMonth()]} ${s.getUTCFullYear()}`;
};
// "2026-10-29" -> "29 Oct 2026"
const fmtDayString = (value) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!m) return "";
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
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

const solid = (argb) => ({
  type: "pattern",
  pattern: "solid",
  fgColor: { argb },
});

// ── Column layouts ────────────────────────────────────────────────────────
const INQUIRY_COLUMNS = [
  { header: "#", key: "no", width: 6, group: "key", center: true },
  {
    header: "Inquiry Date",
    key: "createdAt",
    width: 18,
    group: "key",
    date: true,
  },
  { header: "Status", key: "status", width: 13, group: "key", center: true },
  {
    header: "Customer",
    key: "name",
    width: 22,
    group: "key",
    bold: true,
    wrap: true,
  },
  { header: "Company", key: "company", width: 24, group: "key", wrap: true },
  { header: "WhatsApp", key: "whatsapp", width: 17, group: "key" },
  {
    header: "Requirement (Category / Product)",
    key: "requirement",
    width: 28,
    group: "key",
    wrap: true,
  },
  { header: "Qty", key: "quantity", width: 8, group: "key", center: true },
  { header: "Budget", key: "budget", width: 14, group: "key", wrap: true },
  {
    header: "Customer Message",
    key: "message",
    width: 62,
    group: "key",
    wrap: true,
  },

  {
    header: "Last Contacted",
    key: "lastContactedAt",
    width: 18,
    group: "track",
    date: true,
  },
  {
    header: "Next Follow-up",
    key: "nextFollowUpAt",
    width: 18,
    group: "track",
    date: true,
  },
  {
    header: "Contact Notes",
    key: "logCount",
    width: 9,
    group: "track",
    center: true,
  },
  {
    header: "Latest Contact Note",
    key: "latestNote",
    width: 48,
    group: "track",
    wrap: true,
  },

  { header: "Email", key: "email", width: 28, group: "more" },
  { header: "Country", key: "country", width: 14, group: "more" },
  { header: "State", key: "state", width: 16, group: "more" },
  { header: "Images", key: "images", width: 8, group: "more", center: true },
  {
    header: "Chat Replies",
    key: "replies",
    width: 10,
    group: "more",
    center: true,
  },
  {
    header: "Admin Notes",
    key: "adminNotes",
    width: 34,
    group: "more",
    wrap: true,
  },
  { header: "Inquiry ID", key: "id", width: 26, group: "more" },
];
const INQUIRY_FREEZE_COLS = 4; // # | date | status | customer stay visible while scrolling

const LOG_COLUMNS = [
  { header: "Logged At", key: "loggedAt", width: 18, group: "key", date: true },
  {
    header: "Customer",
    key: "name",
    width: 22,
    group: "key",
    bold: true,
    wrap: true,
  },
  { header: "Company", key: "company", width: 24, group: "key", wrap: true },
  { header: "WhatsApp", key: "whatsapp", width: 17, group: "key" },
  { header: "Channel", key: "channel", width: 13, group: "key", center: true },
  {
    header: "What was discussed",
    key: "note",
    width: 72,
    group: "key",
    wrap: true,
  },
  {
    header: "Follow-up Date",
    key: "followUpAt",
    width: 18,
    group: "key",
    date: true,
  },

  {
    header: "Inquiry Status",
    key: "status",
    width: 14,
    group: "more",
    center: true,
  },
  {
    header: "Inquiry Date",
    key: "createdAt",
    width: 18,
    group: "more",
    date: true,
  },
  { header: "Logged By", key: "by", width: 26, group: "more" },
  { header: "Inquiry ID", key: "id", width: 26, group: "more" },
];
const LOG_FREEZE_COLS = 2;

// ── Layout helpers ────────────────────────────────────────────────────────
// Rough number of wrapped lines a text needs in a column of `width` characters.
const estimateLines = (value, width) => {
  const s = text(value);
  if (!s) return 1;
  const perLine = Math.max(8, Math.floor(width * 1.05));
  return s
    .split(/\r?\n/)
    .reduce((n, line) => n + Math.max(1, Math.ceil(line.length / perLine)), 0);
};

// Explicit row height so long messages are fully visible in every viewer.
const rowHeightFor = (values, columns) => {
  let lines = 1;
  for (const c of columns) {
    if (c.wrap) lines = Math.max(lines, estimateLines(values[c.key], c.width));
  }
  return Math.min(400, Math.max(24, lines * 15 + 8));
};

// Row 1 = coloured group bands, row 2 = headers, data starts at row 3.
const setupSheet = (ws, columns, freezeCols = 0) => {
  ws.columns = columns.map((c) => ({ key: c.key, width: c.width }));
  ws.properties.defaultRowHeight = 18;
  ws.getRow(1).height = 22;
  ws.getRow(2).height = 34;

  let i = 0;
  while (i < columns.length) {
    let j = i;
    while (j + 1 < columns.length && columns[j + 1].group === columns[i].group)
      j += 1;
    const g = GROUPS[columns[i].group];
    ws.getCell(1, i + 1).value = g.label;
    if (j > i) ws.mergeCells(1, i + 1, 1, j + 1);
    for (let k = i; k <= j; k += 1) {
      const cell = ws.getCell(1, k + 1);
      cell.fill = solid(g.band);
      cell.font = { bold: true, size: 10, color: { argb: WHITE } };
      cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    }
    i = j + 1;
  }

  columns.forEach((c, idx) => {
    const g = GROUPS[c.group];
    const cell = ws.getCell(2, idx + 1);
    cell.value = c.header;
    cell.fill = solid(g.head);
    cell.font = { bold: true, size: 11, color: { argb: g.headText } };
    cell.alignment = {
      vertical: "middle",
      horizontal: c.center ? "center" : "left",
      wrapText: true,
    };
    cell.border = { bottom: { style: "medium", color: { argb: g.band } } };
  });

  ws.views = [
    freezeCols > 0
      ? { state: "frozen", xSplit: freezeCols, ySplit: 2 }
      : { state: "frozen", ySplit: 2 },
  ];
  ws.autoFilter = {
    from: { row: 2, column: 1 },
    to: { row: 2, column: columns.length },
  };
  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };
};

const addDataRow = (ws, columns, values, index) => {
  const row = ws.addRow(values);
  columns.forEach((c, i) => {
    const cell = row.getCell(i + 1);
    cell.alignment = {
      vertical: "top",
      horizontal: c.center ? "center" : "left",
      wrapText: !!c.wrap,
    };
    if (c.date) cell.numFmt = DATE_FMT;
    if (c.bold) cell.font = { bold: true };
    cell.border = { bottom: { style: "thin", color: { argb: "FFE5E7EB" } } };
    const tint =
      c.group === "key" ? GROUPS.key.cell : index % 2 === 1 ? "FFF9FAFB" : null;
    if (tint) cell.fill = solid(tint);
  });
  row.height = rowHeightFor(values, columns);
  return row;
};

const colorStatusCell = (row, label) => {
  const st = STATUS_STYLE[label];
  const cell = row.getCell("status");
  cell.fill = solid(st.fill);
  cell.font = { bold: true, color: { argb: st.text } };
};

const markFollowUp = (row, overdue) => {
  const cell = row.getCell("nextFollowUpAt");
  if (overdue) {
    cell.fill = solid("FFFECACA");
    cell.font = { bold: true, color: { argb: "FF991B1B" } };
  } else {
    cell.font = { color: { argb: "FF1D4ED8" } };
  }
};

const addEmptyNotice = (ws, span, message) => {
  const rowNo = 3;
  ws.mergeCells(rowNo, 1, rowNo, span);
  const cell = ws.getCell(rowNo, 1);
  cell.value = message;
  cell.font = { italic: true, color: { argb: "FF6B7280" } };
  cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(rowNo).height = 30;
};

// ── Summary sheet ─────────────────────────────────────────────────────────
const buildSummarySheet = (ws, data) => {
  const {
    total,
    counts,
    followUpsDue,
    totalLogs,
    from,
    to,
    attention,
    categories,
    countries,
  } = data;

  ws.columns = [
    { width: 26 },
    { width: 26 },
    { width: 22 },
    { width: 16 },
    { width: 38 },
    { width: 70 },
  ];
  ws.views = [{ showGridLines: false }];
  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  // Title banner
  ws.mergeCells("A1:F1");
  const title = ws.getCell("A1");
  title.value = "Sanwariyas  |  Inquiry Report";
  title.font = { bold: true, size: 20, color: { argb: WHITE } };
  title.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  for (let c = 1; c <= 6; c += 1) ws.getCell(1, c).fill = solid(BRAND);
  ws.getRow(1).height = 40;

  ws.mergeCells("A2:F2");
  const range =
    from || to
      ? `${fmtDayString(from) || "Start"}  to  ${fmtDayString(to) || "Today"}`
      : "All time";
  const sub = ws.getCell("A2");
  sub.value = `Generated: ${fmtDay(new Date())}      Date range: ${range}`;
  sub.font = { italic: true, size: 10, color: { argb: "FF6B7280" } };
  sub.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  for (let c = 1; c <= 6; c += 1) ws.getCell(2, c).fill = solid("FFFBF5EC");
  ws.getRow(2).height = 22;
  ws.getRow(3).height = 10;

  // KPI cards (rows 4-6)
  const pct = (n) =>
    total ? `${Math.round((n / total) * 100)}% of total` : "-";
  const cards = [
    {
      label: "TOTAL INQUIRIES",
      value: total,
      note: `${totalLogs} contact notes written`,
      fill: "FFF3E3C3",
      color: "FF4A2A1C",
    },
    {
      label: "NEW",
      value: counts.New,
      note: pct(counts.New),
      fill: STATUS_STYLE.New.fill,
      color: STATUS_STYLE.New.text,
    },
    {
      label: "CONTACTED",
      value: counts.Contacted,
      note: pct(counts.Contacted),
      fill: STATUS_STYLE.Contacted.fill,
      color: STATUS_STYLE.Contacted.text,
    },
    {
      label: "RESOLVED",
      value: counts.Resolved,
      note: pct(counts.Resolved),
      fill: STATUS_STYLE.Resolved.fill,
      color: STATUS_STYLE.Resolved.text,
    },
    {
      label: "FOLLOW-UPS DUE",
      value: followUpsDue,
      note: followUpsDue
        ? "Call these customers today"
        : "No follow-up pending",
      fill: followUpsDue ? "FFFECACA" : "FFF3F4F6",
      color: followUpsDue ? "FF991B1B" : "FF4B5563",
    },
  ];
  const gap = { style: "medium", color: { argb: WHITE } };
  cards.forEach((card, i) => {
    const col = i + 1;
    const rows = [
      {
        r: 4,
        v: card.label,
        font: { bold: true, size: 10, color: { argb: card.color } },
      },
      {
        r: 5,
        v: card.value,
        font: { bold: true, size: 28, color: { argb: card.color } },
      },
      { r: 6, v: card.note, font: { size: 10, color: { argb: card.color } } },
    ];
    rows.forEach(({ r, v, font }) => {
      const cell = ws.getCell(r, col);
      cell.value = v;
      cell.font = font;
      cell.fill = solid(card.fill);
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = { left: gap, right: gap };
    });
  });
  ws.getRow(4).height = 24;
  ws.getRow(5).height = 48;
  ws.getRow(6).height = 24;
  ws.getRow(7).height = 14;

  // Section header helper
  let r = 8;
  const section = (label, fillArgb = BRAND) => {
    ws.mergeCells(r, 1, r, 6);
    const cell = ws.getCell(r, 1);
    cell.value = label;
    cell.font = { bold: true, size: 12, color: { argb: WHITE } };
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    for (let c = 1; c <= 6; c += 1) ws.getCell(r, c).fill = solid(fillArgb);
    ws.getRow(r).height = 26;
    r += 1;
  };
  const tableHead = (labels) => {
    labels.forEach((label, i) => {
      const cell = ws.getCell(r, i + 1);
      cell.value = label;
      cell.font = { bold: true, color: { argb: "FF4A2A1C" } };
      cell.fill = solid("FFF3E3C3");
      cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
      cell.border = { bottom: { style: "medium", color: { argb: BRAND } } };
    });
    ws.getRow(r).height = 24;
    r += 1;
  };

  // Needs attention
  section("NEEDS ATTENTION  -  contact these customers first");
  tableHead([
    "Customer",
    "Company",
    "WhatsApp",
    "Status",
    "Why it needs attention",
    "Message (preview)",
  ]);
  if (attention.length === 0) {
    ws.mergeCells(r, 1, r, 6);
    const cell = ws.getCell(r, 1);
    cell.value =
      "All clear. No new inquiries waiting and no follow-ups overdue.";
    cell.font = { bold: true, color: { argb: "FF14532D" } };
    cell.fill = solid("FFDCFCE7");
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    ws.getRow(r).height = 30;
    r += 1;
  } else {
    attention.slice(0, MAX_ATTENTION_ROWS).forEach((a, idx) => {
      const vals = [
        a.name,
        a.company,
        a.whatsapp,
        a.label,
        a.reason,
        a.preview,
      ];
      vals.forEach((v, i) => {
        const cell = ws.getCell(r, i + 1);
        cell.value = v;
        cell.alignment = {
          vertical: "top",
          horizontal: "left",
          wrapText: true,
          indent: 1,
        };
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        };
        if (idx % 2 === 1) cell.fill = solid("FFF9FAFB");
      });
      ws.getCell(r, 1).font = { bold: true };
      const st = STATUS_STYLE[a.label];
      const statusCell = ws.getCell(r, 4);
      statusCell.fill = solid(st.fill);
      statusCell.font = { bold: true, color: { argb: st.text } };
      statusCell.alignment = { vertical: "top", horizontal: "center" };
      const why = ws.getCell(r, 5);
      why.font = {
        bold: true,
        color: { argb: a.overdue ? "FF991B1B" : "FF92400E" },
      };
      ws.getRow(r).height = Math.min(
        120,
        Math.max(24, estimateLines(a.preview, 70) * 15 + 8),
      );
      r += 1;
    });
    if (attention.length > MAX_ATTENTION_ROWS) {
      ws.mergeCells(r, 1, r, 6);
      const cell = ws.getCell(r, 1);
      cell.value = `+ ${attention.length - MAX_ATTENTION_ROWS} more. See the "New" and "Contacted" sheets for the full list.`;
      cell.font = { italic: true, color: { argb: "FF6B7280" } };
      cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
      ws.getRow(r).height = 22;
      r += 1;
    }
  }
  r += 1;

  // Top categories / countries with a small text bar
  const rankTable = (label, map) => {
    section(label, "FF6B7280");
    tableHead(["Name", "Inquiries", "Share"]);
    const entries = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    const max = entries.length ? entries[0][1] : 1;
    if (entries.length === 0) {
      ws.getCell(r, 1).value = "No data";
      ws.getCell(r, 1).font = { italic: true, color: { argb: "FF6B7280" } };
      r += 1;
    }
    entries.forEach(([name, count]) => {
      ws.getCell(r, 1).value = name;
      ws.getCell(r, 1).alignment = {
        vertical: "middle",
        horizontal: "left",
        indent: 1,
      };
      ws.getCell(r, 2).value = count;
      ws.getCell(r, 2).font = { bold: true };
      ws.getCell(r, 2).alignment = {
        vertical: "middle",
        horizontal: "left",
        indent: 1,
      };
      const bar = ws.getCell(r, 3);
      bar.value = "\u2588".repeat(Math.max(1, Math.round((count / max) * 14)));
      bar.font = { color: { argb: "FFC9A84C" } };
      ws.getRow(r).height = 20;
      r += 1;
    });
    r += 1;
  };
  rankTable("TOP PRODUCT CATEGORIES", categories);
  rankTable("TOP COUNTRIES", countries);
};

// ── Workbook ──────────────────────────────────────────────────────────────
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

  const tab = (argb) => ({ properties: { tabColor: { argb } } });
  const summary = wb.addWorksheet("Summary", tab(BRAND));
  const sheets = {
    All: wb.addWorksheet("All Inquiries", tab("FFC9A84C")),
    New: wb.addWorksheet("New", tab("FFFBBF24")),
    Contacted: wb.addWorksheet("Contacted", tab("FF3B82F6")),
    Resolved: wb.addWorksheet("Resolved", tab("FF22C55E")),
  };
  const history = wb.addWorksheet("Contact History", tab("FF6B7280"));

  Object.values(sheets).forEach((ws) =>
    setupSheet(ws, INQUIRY_COLUMNS, INQUIRY_FREEZE_COLS),
  );
  setupSheet(history, LOG_COLUMNS, LOG_FREEZE_COLS);

  const counts = { New: 0, Contacted: 0, Resolved: 0 };
  const rowNo = { All: 0, New: 0, Contacted: 0, Resolved: 0 };
  const attention = [];
  const categories = new Map();
  const countries = new Map();
  const logRows = [];
  let followUpsDue = 0;
  let totalLogs = 0;
  const now = Date.now();

  const bump = (map, key) => {
    const k = text(key).trim() || "Not specified";
    map.set(k, (map.get(k) || 0) + 1);
  };

  const cursor = Inquiry.find(query)
    .select("+adminNotes +contactLogs +lastContactedAt +nextFollowUpAt")
    .populate("product", "name")
    .sort({ createdAt: -1 })
    .lean()
    .cursor();

  for await (const inq of cursor) {
    const label = statusLabel(inq.status);
    counts[label] += 1;
    bump(categories, inq.productCategory);
    bump(countries, inq.country);

    const logs = Array.isArray(inq.contactLogs) ? inq.contactLogs : [];
    totalLogs += logs.length;
    const newest = [...logs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )[0];

    const overdue =
      label !== "Resolved" &&
      !!inq.nextFollowUpAt &&
      new Date(inq.nextFollowUpAt).getTime() <= now;
    if (overdue) followUpsDue += 1;

    const phone = inq.whatsapp ? formatPhone(inq.whatsapp) : "";
    const productName = text(inq.product?.name || inq.productName);
    const category = text(inq.productCategory);
    const requirement =
      [category, productName].filter(Boolean).join("  /  ") ||
      "General inquiry";

    const base = {
      createdAt: toSheetDate(inq.createdAt),
      status: label,
      name: text(inq.name),
      company: text(inq.companyName),
      whatsapp: text(phone),
      requirement,
      quantity: inq.quantity ?? "",
      budget: text(inq.budgetRange),
      message: text(inq.message),
      lastContactedAt: toSheetDate(inq.lastContactedAt),
      nextFollowUpAt: toSheetDate(inq.nextFollowUpAt),
      logCount: logs.length,
      latestNote: text(newest?.note),
      email: text(inq.email),
      country: text(inq.country),
      state: text(inq.state),
      images: Array.isArray(inq.sampleImages) ? inq.sampleImages.length : 0,
      replies: Array.isArray(inq.replies) ? inq.replies.length : 0,
      adminNotes: text(inq.adminNotes),
      id: String(inq._id),
    };

    for (const key of ["All", label]) {
      rowNo[key] += 1;
      const row = addDataRow(
        sheets[key],
        INQUIRY_COLUMNS,
        { ...base, no: rowNo[key] },
        rowNo[key] - 1,
      );
      colorStatusCell(row, label);
      if (base.nextFollowUpAt && label !== "Resolved")
        markFollowUp(row, overdue);
    }

    // "Needs attention" candidates for the Summary sheet
    const preview = text(inq.message).replace(/\s+/g, " ").trim();
    const short =
      preview.length > 140 ? `${preview.slice(0, 137)}...` : preview;
    if (overdue) {
      attention.push({
        priority: 0,
        sortKey: new Date(inq.nextFollowUpAt).getTime(),
        name: base.name,
        company: base.company,
        whatsapp: base.whatsapp,
        label,
        overdue: true,
        reason: `Follow-up overdue since ${fmtDay(inq.nextFollowUpAt)}`,
        preview: short,
      });
    } else if (label === "New") {
      const days = Math.floor(
        (now - new Date(inq.createdAt).getTime()) / (24 * 60 * 60 * 1000),
      );
      attention.push({
        priority: 1,
        sortKey: new Date(inq.createdAt).getTime(),
        name: base.name,
        company: base.company,
        whatsapp: base.whatsapp,
        label,
        overdue: false,
        reason:
          days <= 0
            ? "New today - not contacted yet"
            : `New - waiting ${days} day${days === 1 ? "" : "s"}, not contacted`,
        preview: short,
      });
    }

    for (const log of logs) {
      logRows.push({
        sortKey: new Date(log.createdAt).getTime() || 0,
        values: {
          loggedAt: toSheetDate(log.createdAt),
          name: text(inq.name),
          company: text(inq.companyName),
          whatsapp: text(phone),
          channel: CHANNEL_LABEL[log.channel] || text(log.channel),
          note: text(log.note),
          followUpAt: toSheetDate(log.followUpAt),
          status: label,
          createdAt: toSheetDate(inq.createdAt),
          by: text(log.createdBy),
          id: String(inq._id),
        },
      });
    }
  }

  // Contact History: newest note first
  logRows.sort((a, b) => b.sortKey - a.sortKey);
  logRows.forEach((entry, idx) => {
    const row = addDataRow(history, LOG_COLUMNS, entry.values, idx);
    const st = STATUS_STYLE[entry.values.status];
    const cell = row.getCell("status");
    cell.fill = solid(st.fill);
    cell.font = { bold: true, color: { argb: st.text } };
  });

  // Friendly message on empty sheets
  const span = INQUIRY_COLUMNS.length;
  if (rowNo.All === 0) {
    addEmptyNotice(sheets.All, span, "No inquiries found for this date range.");
  }
  if (rowNo.New === 0) addEmptyNotice(sheets.New, span, "No new inquiries.");
  if (rowNo.Contacted === 0)
    addEmptyNotice(sheets.Contacted, span, "No inquiries in Contacted.");
  if (rowNo.Resolved === 0)
    addEmptyNotice(sheets.Resolved, span, "No resolved inquiries.");
  if (logRows.length === 0) {
    addEmptyNotice(
      history,
      LOG_COLUMNS.length,
      "No contact notes written yet. Add notes from the inquiry page (Contact Log).",
    );
  }

  attention.sort((a, b) => a.priority - b.priority || a.sortKey - b.sortKey);

  buildSummarySheet(summary, {
    total,
    counts,
    followUpsDue,
    totalLogs,
    from,
    to,
    attention,
    categories,
    countries,
  });

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
