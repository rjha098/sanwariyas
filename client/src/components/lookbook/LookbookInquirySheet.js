// FILE: client/src/components/lookbook/LookbookInquirySheet.js
// Review panel for the selected designs + ONE consolidated WhatsApp inquiry.
//
// The send button is a real <a href="https://wa.me/..."> link: it can never be
// blocked as a popup, and the browser opens the official click-to-chat URL.
// Nothing is "sent" until the customer presses Send inside WhatsApp, and the
// UI says so. Images cannot be attached by click-to-chat; design codes and
// public reference links are included in the message instead.
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getImageUrl } from "@/lib/imageUrl";
import {
  buildInquiryMessage,
  buildWhatsAppUrl,
  normalizeWhatsAppNumber,
  validateInquiryDetails,
} from "@/lib/lookbookWhatsApp";
import { itemCaption } from "@/components/lookbook/LookbookGrid";

const CONTACT_KEY = "sanwariyas_lookbook_contact";

const fallback = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = "/images/placeholder.png";
};

export default function LookbookInquirySheet({
  open,
  items,
  questions,
  answers,
  whatsappNumber,
  onAnswer,
  onRemove,
  onClear,
  onClose,
}) {
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    state: "",
  });
  const [errors, setErrors] = useState({});
  const [stage, setStage] = useState("form"); // "form" | "opened"
  const [confirmClear, setConfirmClear] = useState(false);
  const closeRef = useRef(null);

  // restore remembered contact details (same storage key as before)
  useEffect(() => {
    if (!open) return;
    setStage("form");
    setErrors({});
    setConfirmClear(false);
    try {
      const saved = JSON.parse(localStorage.getItem(CONTACT_KEY) || "{}");
      setForm((f) => ({
        ...f,
        name: saved.name || f.name,
        businessName: saved.companyName || f.businessName,
        phone: saved.whatsapp || f.phone,
        state: saved.state || f.state,
      }));
    } catch {
      // ignore corrupted storage
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const answerList = useMemo(
    () => Object.values(answers || {}).filter((a) => a?.answer?.length),
    [answers],
  );

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const number = normalizeWhatsAppNumber(whatsappNumber);

  const message = useMemo(
    () =>
      buildInquiryMessage({
        details: {
          name: form.name,
          businessName: form.businessName,
          phone: form.phone,
          state: form.state,
        },
        items,
        siteUrl,
        answers: answerList,
      }),
    [
      form.name,
      form.businessName,
      form.phone,
      form.state,
      items,
      siteUrl,
      answerList,
    ],
  );
  const href = number ? buildWhatsAppUrl(number, message.text) : "";

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = validateInquiryDetails(form);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const rememberContact = () => {
    try {
      localStorage.setItem(
        CONTACT_KEY,
        JSON.stringify({
          name: form.name.trim(),
          companyName: form.businessName.trim(),
          whatsapp: form.phone.trim(),
          state: form.state.trim(),
        }),
      );
    } catch {
      // storage blocked - fine
    }
  };

  const onWhatsAppClick = (e) => {
    if (!items.length || !href || !validate()) {
      e.preventDefault();
      return;
    }
    rememberContact();
    setStage("opened");
  };

  const waLabel = `Send Inquiry on WhatsApp (${items.length} Design${items.length === 1 ? "" : "s"})`;

  return (
    <div
      className="lb-root lb-scrim"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        className="lb-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lb-sheet-title"
      >
        <header className="lb-sheet-head">
          <h2 id="lb-sheet-title">Your selection ({items.length})</h2>
          <button
            ref={closeRef}
            type="button"
            className="lb-icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>

        <div className="lb-sheet-body">
          {!items.length ? (
            <p className="lb-note">
              No designs selected. Close this panel and tick the designs you
              like.
            </p>
          ) : (
            <>
              <h3 className="lb-h3">Selected designs</h3>
              <ul className="lb-sel-list">
                {items.map((it) => (
                  <li key={it._id} className="lb-sel-item">
                    <img
                      src={getImageUrl(it.thumb || it.image)}
                      alt=""
                      loading="lazy"
                      onError={fallback}
                    />
                    <div>
                      <p className="lb-code">{it.styleNumber || "-"}</p>
                      <p className="lb-meta">{itemCaption(it)}</p>
                    </div>
                    <button
                      type="button"
                      className="lb-btn lb-btn--sm"
                      onClick={() => onRemove(it._id)}
                      aria-label={`Remove ${it.styleNumber || it.title} from selection`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="lb-actions">
                {confirmClear ? (
                  <>
                    <span className="lb-count">
                      Remove all {items.length} designs?
                    </span>
                    <button
                      type="button"
                      className="lb-btn lb-btn--sm lb-btn--danger"
                      onClick={() => {
                        onClear();
                        setConfirmClear(false);
                      }}
                    >
                      Yes, clear all
                    </button>
                    <button
                      type="button"
                      className="lb-btn lb-btn--sm"
                      onClick={() => setConfirmClear(false)}
                    >
                      Keep
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="lb-btn lb-btn--sm"
                    onClick={() => setConfirmClear(true)}
                  >
                    Clear selection
                  </button>
                )}
              </div>

              {stage === "form" && (
                <>
                  <h3 className="lb-h3">Your details</h3>
                  <div className="lb-field">
                    <label htmlFor="lb-name">Your name *</label>
                    <input
                      id="lb-name"
                      className="lb-input"
                      value={form.name}
                      onChange={set("name")}
                      autoComplete="name"
                      maxLength={80}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className="lb-err">{errors.name}</p>}
                  </div>
                  <div className="lb-field">
                    <label htmlFor="lb-biz">Business / store name *</label>
                    <input
                      id="lb-biz"
                      className="lb-input"
                      value={form.businessName}
                      onChange={set("businessName")}
                      autoComplete="organization"
                      maxLength={120}
                      aria-invalid={!!errors.businessName}
                    />
                    {errors.businessName && (
                      <p className="lb-err">{errors.businessName}</p>
                    )}
                  </div>
                  <div className="lb-field">
                    <label htmlFor="lb-phone">
                      Contact number (with country code) *
                    </label>
                    <input
                      id="lb-phone"
                      type="tel"
                      inputMode="tel"
                      className="lb-input"
                      placeholder="+91 ..."
                      value={form.phone}
                      onChange={set("phone")}
                      autoComplete="tel"
                      maxLength={30}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <p className="lb-err">{errors.phone}</p>}
                  </div>
                  <div className="lb-field">
                    <label htmlFor="lb-state">State *</label>
                    <input
                      id="lb-state"
                      className="lb-input"
                      value={form.state}
                      onChange={set("state")}
                      autoComplete="address-level1"
                      placeholder="e.g. Rajasthan"
                      maxLength={80}
                      aria-invalid={!!errors.state}
                    />
                    {errors.state && <p className="lb-err">{errors.state}</p>}
                  </div>

                  {questions.length > 0 && (
                    <>
                      <h3 className="lb-h3">Quick preferences (optional)</h3>
                      {questions.map((q) => {
                        const picked = answers?.[q._id]?.answer || [];
                        return (
                          <div key={q._id} className="lb-q">
                            <p>{q.text}</p>
                            <div
                              className="lb-opts"
                              role="group"
                              aria-label={q.text}
                            >
                              {q.options.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  className="lb-chip"
                                  aria-pressed={picked.includes(opt)}
                                  onClick={() => onAnswer(q, opt)}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}

                  <p className="lb-note">
                    WhatsApp will open with a ready-made message listing every
                    selected design. WhatsApp links can&apos;t attach pictures
                    automatically, so each design&apos;s code and a link to it
                    are included instead.
                    {message.compact &&
                      " Because you selected many designs, the message uses a compact list plus one link to all of them."}
                  </p>
                </>
              )}

              {stage === "opened" && (
                <>
                  <p className="lb-note" role="status">
                    WhatsApp should have opened with your message pre-filled.
                    Your inquiry is only sent once you press Send inside
                    WhatsApp.
                  </p>
                  <h3 className="lb-h3">Was your inquiry sent?</h3>
                  <div className="lb-actions">
                    <button
                      type="button"
                      className="lb-btn lb-btn--accent"
                      onClick={() => {
                        onClear();
                        setStage("form");
                        onClose();
                      }}
                    >
                      Yes, sent - clear my selection
                    </button>
                    <button
                      type="button"
                      className="lb-btn"
                      onClick={() => setStage("form")}
                    >
                      No, keep my selection
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <footer className="lb-sheet-foot">
          {!number && (
            <p className="lb-err" role="alert">
              WhatsApp inquiries are temporarily unavailable. Please try again
              later.
            </p>
          )}
          {number && items.length > 0 ? (
            <a
              className="lb-btn lb-btn--wa"
              style={{ width: "100%", minHeight: 48 }}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsAppClick}
            >
              {stage === "opened" ? "Open WhatsApp again" : waLabel}
            </a>
          ) : (
            <button
              type="button"
              className="lb-btn lb-btn--wa"
              style={{ width: "100%", minHeight: 48 }}
              disabled
            >
              {waLabel}
            </button>
          )}
          {stage === "opened" && (
            <button
              type="button"
              className="lb-btn"
              style={{ width: "100%", marginTop: 8 }}
              onClick={onClose}
            >
              Back to designs
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
 