// FILE: server/controllers/lookbookInquiryController.js
// One-time bulk inquiry from the Lookbook magazine (separate from /api/inquiries).
import { Resend } from "resend";
import Lookbook from "../models/Lookbook.js";
import LookbookInquiry from "../models/LookbookInquiry.js";
import Notification from "../models/Notification.js";
import { escapeHtml } from "../utils/escapeHtml.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hrsanwariyas@gmail.com";
const str = (v, max) =>
  String(v ?? "")
    .trim()
    .slice(0, max);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const notifyAdmin = async (inq) => {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const rows = inq.items
      .map(
        (i) =>
          `<li><strong>${escapeHtml(i.styleNumber || "—")}</strong> — ${escapeHtml(i.title)} (${escapeHtml(i.category)})</li>`,
      )
      .join("");
    const ans = inq.answers
      .map(
        (a) =>
          `<li>${escapeHtml(a.question)}: <strong>${escapeHtml(a.answer.join(", "))}</strong></li>`,
      )
      .join("");
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: ADMIN_EMAIL,
      subject: `Lookbook inquiry — ${inq.items.length} style(s) from ${inq.name}`,
      html: `<h2>New Lookbook Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(inq.name)}<br/>
        <strong>Company:</strong> ${escapeHtml(inq.companyName)}<br/>
        <strong>WhatsApp:</strong> ${escapeHtml(inq.whatsapp)}<br/>
        <strong>Email:</strong> ${escapeHtml(inq.email)}<br/>
        <strong>Country:</strong> ${escapeHtml(inq.country)}</p>
        <h3>Styles</h3><ul>${rows}</ul>
        ${ans ? `<h3>Preferences</h3><ul>${ans}</ul>` : ""}
        ${inq.note ? `<h3>Note</h3><p>${escapeHtml(inq.note)}</p>` : ""}`,
    });
  } catch (err) {
    console.error("Lookbook inquiry email failed:", err.message);
  }
};

// PUBLIC
export const createLookbookInquiry = async (req, res) => {
  try {
    const b = req.body || {};
    const name = str(b.name, 120);
    const companyName = str(b.companyName, 150);
    const email = str(b.email, 150).toLowerCase();
    const whatsapp = str(b.whatsapp, 30);
    const country = str(b.country, 80);
    if (
      !name ||
      !companyName ||
      !whatsapp ||
      !country ||
      !EMAIL_RE.test(email)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill name, company, WhatsApp, a valid email and country.",
      });
    }

    const ids = Array.from(
      new Set(
        (Array.isArray(b.lookbookIds) ? b.lookbookIds : []).filter(
          (id) => typeof id === "string" && /^[a-f\d]{24}$/i.test(id),
        ),
      ),
    ).slice(0, 40);
    if (!ids.length) {
      return res
        .status(400)
        .json({ success: false, message: "Please select at least one style." });
    }

    // style number / name / photo always come from the database, never the browser
    const docs = await Lookbook.find({ _id: { $in: ids } }).lean();
    const byId = new Map(docs.map((d) => [String(d._id), d]));
    const items = ids
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((d) => ({
        lookbookId: d._id,
        styleNumber: d.styleNumber || "",
        title: d.title || "",
        category: d.category || "",
        image: d.image || "",
      }));
    if (!items.length) {
      return res
        .status(400)
        .json({ success: false, message: "Selected styles no longer exist." });
    }

    const answers = (Array.isArray(b.lookbookAnswers) ? b.lookbookAnswers : [])
      .slice(0, 12)
      .map((a) => ({
        question: str(a?.question, 200),
        answer: (Array.isArray(a?.answer) ? a.answer : [a?.answer])
          .map((x) => str(x, 80))
          .filter(Boolean)
          .slice(0, 8),
      }))
      .filter((a) => a.question && a.answer.length);

    const inquiry = await LookbookInquiry.create({
      name,
      companyName,
      email,
      whatsapp,
      country,
      note: str(b.note, 1500),
      items,
      answers,
    });

    // Admin bell (same system as normal inquiries: red dot + sound + list)
    try {
      const first = items[0];
      await Notification.create({
        isGlobalAdmin: true,
        type: "new_inquiry",
        title: "New Lookbook Inquiry",
        message: `${companyName || name} selected ${items.length} style${items.length === 1 ? "" : "s"}${
          first?.styleNumber
            ? ` (${first.styleNumber}${items.length > 1 ? " +" + (items.length - 1) : ""})`
            : ""
        }.`,
        link: "/operations-center/lookbook",
      });
    } catch (err) {
      console.error("Lookbook notification failed:", err.message);
    }

    notifyAdmin(inquiry); // fire and forget
    res
      .status(201)
      .json({ success: true, id: inquiry._id, count: items.length });
  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

// ADMIN
export const getLookbookInquiries = async (req, res) => {
  try {
    const q = {};
    if (["new", "contacted", "closed"].includes(req.query.status))
      q.status = req.query.status;
    const inquiries = await LookbookInquiry.find(q)
      .sort({ createdAt: -1 })
      .limit(300)
      .lean();
    const newCount = await LookbookInquiry.countDocuments({ status: "new" });
    res.json({ success: true, inquiries, newCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLookbookInquiry = async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!["new", "contacted", "closed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const inq = await LookbookInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!inq)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, inquiry: inq });
  } catch (error) {
    res
      .status(error.name === "CastError" ? 400 : 500)
      .json({ success: false, message: error.message });
  }
};

export const deleteLookbookInquiry = async (req, res) => {
  try {
    const inq = await LookbookInquiry.findByIdAndDelete(req.params.id);
    if (!inq)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true });
  } catch (error) {
    res
      .status(error.name === "CastError" ? 400 : 500)
      .json({ success: false, message: error.message });
  }
};
