// FILE: client/src/components/admin/LookbookInquiriesManager.js
// Admin: inquiries that customers sent from the Lookbook magazine.
// Shows every selected style (style number + name + photo) and the answers.
"use client";

import { useState, useEffect } from "react";
import {
  fetchLookbookInquiries,
  updateLookbookInquiryStatus,
  deleteLookbookInquiry,
} from "@/lib/lookbookApi";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const STATUS = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  closed: "bg-green-100 text-green-800",
};

const waLink = (num) => `https://wa.me/${String(num).replace(/[^\d]/g, "")}`;

export default function LookbookInquiriesManager({ token, showToast }) {
  const [list, setList] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [confirmId, setConfirmId] = useState(null); // 2-step delete (no browser popup)
  const [flash, setFlash] = useState(null); // inline message, always visible

  const say = (text, kind = "success") => {
    setFlash({ text, kind });
    setTimeout(() => setFlash(null), 4000);
    toast(text, kind);
  };

  const toast = (m, k = "success") =>
    typeof showToast === "function" && showToast(m, k);
  const errText = (e, fb) => e.response?.data?.message || e.userMessage || fb;

  const load = async (status = filter) => {
    try {
      const d = await fetchLookbookInquiries(token, status);
      if (d.success) {
        setList(d.inquiries || []);
        setNewCount(d.newCount || 0);
      }
    } catch (e) {
      toast(errText(e, "Failed to load lookbook inquiries"), "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (inq, status) => {
    try {
      await updateLookbookInquiryStatus(token, inq._id, status);
      await load();
      say(`Marked as ${status}`);
    } catch (e) {
      say(errText(e, "Failed to update"), "error");
    }
  };

  const remove = async (inq) => {
    if (confirmId !== inq._id) {
      setConfirmId(inq._id);
      setTimeout(() => setConfirmId((c) => (c === inq._id ? null : c)), 4000);
      return;
    }
    try {
      await deleteLookbookInquiry(token, inq._id);
      setConfirmId(null);
      setOpenId(null);
      await load();
      say(`Inquiry from ${inq.name} deleted`);
    } catch (e) {
      setConfirmId(null);
      say(errText(e, "Failed to delete"), "error");
    }
  };

  const copyStyles = async (inq) => {
    const text = inq.items
      .map((i) => `${i.styleNumber || "—"}  ${i.title}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast("Style list copied");
    } catch {
      toast("Copy not allowed by browser", "error");
    }
  };

  return (
    <div className="mt-10 bg-white border border-brand-lightgold/40 p-6 md:p-8 rounded-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-2xl text-brand-african">
            Lookbook Inquiries
            {newCount > 0 && (
              <span className="ml-3 text-xs align-middle bg-amber-500 text-white px-2 py-0.5 rounded-full">
                {newCount} new
              </span>
            )}
          </h2>
          <p className="font-sans text-sm text-brand-mud">
            One-time bulk inquiries sent from the magazine.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-brand-lightgold/60 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {flash && (
        <p
          role="status"
          className={`mb-4 px-4 py-2 text-sm font-sans border ${
            flash.kind === "error"
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          {flash.kind === "error" ? "✕ " : "✓ "}
          {flash.text}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-brand-mud">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-sm text-brand-mud">No lookbook inquiries yet.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((inq) => {
            const open = openId === inq._id;
            return (
              <li key={inq._id} className="border border-brand-lightgold/40">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : inq._id)}
                  className="w-full text-left p-4 flex flex-wrap items-center gap-x-6 gap-y-1 hover:bg-brand-parchment/50"
                >
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${STATUS[inq.status]}`}
                  >
                    {inq.status}
                  </span>
                  <span className="font-sans text-sm font-semibold text-brand-african">
                    {inq.name}{" "}
                    <span className="font-normal text-brand-mud">
                      · {inq.companyName}
                    </span>
                  </span>
                  <span className="font-sans text-xs text-brand-mud">
                    {inq.items.length} style{inq.items.length === 1 ? "" : "s"}{" "}
                    · {new Date(inq.createdAt).toLocaleString()}
                  </span>
                  <span className="ml-auto text-brand-mud">
                    {open ? "▲" : "▼"}
                  </span>
                </button>

                {open && (
                  <div className="p-4 border-t border-brand-lightgold/40 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-2 font-sans text-sm text-brand-mud">
                      <p>
                        WhatsApp:{" "}
                        <a
                          href={waLink(inq.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-coffee underline"
                        >
                          {inq.whatsapp}
                        </a>
                      </p>
                      <p>
                        Email:{" "}
                        <a
                          href={`mailto:${inq.email}`}
                          className="text-brand-coffee underline"
                        >
                          {inq.email}
                        </a>
                      </p>
                      <p>Country: {inq.country}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {inq.items.map((it, i) => (
                        <div
                          key={i}
                          className="border border-brand-lightgold/40 bg-white"
                        >
                          {it.image && (
                            <img
                              src={`${BACKEND_URL}${it.image}`}
                              alt={it.title}
                              loading="lazy"
                              className="w-full aspect-[3/4] object-cover bg-brand-parchment"
                            />
                          )}
                          <div className="p-2">
                            <p className="font-sans text-[11px] font-bold tracking-wider text-brand-coffee">
                              {it.styleNumber || "—"}
                            </p>
                            <p className="font-sans text-xs text-brand-african line-clamp-2">
                              {it.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {inq.answers.length > 0 && (
                      <div className="bg-brand-parchment border border-brand-lightgold/40 p-3">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-brand-gold mb-1">
                          Preferences
                        </p>
                        <ul className="space-y-0.5">
                          {inq.answers.map((a, i) => (
                            <li
                              key={i}
                              className="font-sans text-sm text-brand-mud"
                            >
                              {a.question}:{" "}
                              <strong className="text-brand-african">
                                {a.answer.join(", ")}
                              </strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {inq.note && (
                      <p className="font-sans text-sm text-brand-mud whitespace-pre-wrap">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-brand-gold block mb-1">
                          Note
                        </span>
                        {inq.note}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {["new", "contacted", "closed"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(inq, s)}
                          disabled={inq.status === s}
                          className="px-3 py-1.5 text-xs uppercase tracking-wider border border-brand-lightgold/60 text-brand-mud hover:bg-brand-parchment disabled:opacity-40"
                        >
                          Mark {s}
                        </button>
                      ))}
                      <button
                        onClick={() => copyStyles(inq)}
                        className="px-3 py-1.5 text-xs uppercase tracking-wider border border-brand-lightgold/60 text-brand-coffee hover:bg-brand-parchment"
                      >
                        Copy style list
                      </button>
                      <button
                        onClick={() => remove(inq)}
                        className={`px-3 py-1.5 text-xs uppercase tracking-wider border ml-auto transition-colors ${
                          confirmId === inq._id
                            ? "bg-red-600 border-red-600 text-white"
                            : "border-red-200 text-red-500 hover:bg-red-50"
                        }`}
                      >
                        {confirmId === inq._id
                          ? "Tap again to confirm"
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
