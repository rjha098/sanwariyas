// FILE: client/src/components/admin/ContactLogPanel.js
//
// PRIVATE contact log for one inquiry. Lets the admin write down what was
// discussed with the customer (call / WhatsApp / email / meeting) and set an
// optional follow-up reminder. Only the admin API returns this data - customers
// never receive it.
//
// Styling lives in globals.css (.clog-*), which has its own light AND dark colours.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import api from "@/lib/api";
import { Icon } from "@/components/admin/InquiryIcons";

const CHANNELS = [
  { value: "whatsapp", label: "WhatsApp", icon: "chat" },
  { value: "call", label: "Phone call", icon: "phone" },
  { value: "email", label: "Email", icon: "mail" },
  { value: "meeting", label: "Meeting", icon: "users" },
  { value: "other", label: "Other", icon: "note" },
];
const CHANNEL_MAP = Object.fromEntries(CHANNELS.map((c) => [c.value, c]));
const MAX_NOTE = 3000;
const PENDING_STATUSES = ["pending", "New"];

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDay = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function ContactLogPanel({
  inquiryId,
  token,
  status,
  logs = [],
  nextFollowUpAt = null,
  onChange,
}) {
  const [note, setNote] = useState("");
  const [channel, setChannel] = useState("whatsapp");
  const [followUp, setFollowUp] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const rootRef = useRef(null);
  const textareaRef = useRef(null);

  // Opened from the list's "Contact" button (?log=1): scroll here and focus the box.
  useEffect(() => {
    const wanted =
      new URLSearchParams(window.location.search).get("log") === "1";
    if (!wanted) return;
    const timer = setTimeout(() => {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      textareaRef.current?.focus({ preventScroll: true });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const sortedLogs = useMemo(
    () =>
      [...logs].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [logs],
  );

  const followUpOverdue =
    nextFollowUpAt &&
    new Date(nextFollowUpAt).getTime() <= Date.now() &&
    !["resolved", "Closed"].includes(status);

  const todayStr = new Date().toISOString().slice(0, 10);

  const flash = (type, text) => {
    setFeedback({ type, text });
    window.setTimeout(() => setFeedback({ type: "", text: "" }), 4000);
  };

  const handleSave = async () => {
    const trimmed = note.trim();
    if (!trimmed || saving || !token) return;
    setSaving(true);
    setFeedback({ type: "", text: "" });
    try {
      const res = await api.post(
        `/inquiry/${inquiryId}/contact-logs`,
        {
          note: trimmed,
          channel,
          // 9 AM local time on the chosen day
          followUpAt: followUp
            ? new Date(`${followUp}T09:00`).toISOString()
            : null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const updated = res.data.inquiry;
      const movedToContacted =
        PENDING_STATUSES.includes(status) &&
        !PENDING_STATUSES.includes(updated.status);
      onChange?.(updated);
      setNote("");
      setFollowUp("");
      flash(
        "success",
        movedToContacted
          ? "Saved. Inquiry moved to Contacted."
          : "Contact note saved.",
      );
    } catch (error) {
      flash(
        "error",
        error.userMessage ||
          error.response?.data?.message ||
          "Failed to save the note.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (logId) => {
    if (!window.confirm("Delete this contact note? This cannot be undone."))
      return;
    setDeletingId(logId);
    try {
      const res = await api.delete(
        `/inquiry/${inquiryId}/contact-logs/${logId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onChange?.(res.data.inquiry);
    } catch (error) {
      flash(
        "error",
        error.userMessage ||
          error.response?.data?.message ||
          "Failed to delete the note.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section ref={rootRef} aria-label="Private contact log" className="clog">
      {/* ── Header ── */}
      <div className="clog-head">
        <div>
          <h3 className="clog-title">
            Contact Log
            <span className="clog-count">{sortedLogs.length}</span>
          </h3>
          <p className="clog-sub">
            Write what you discussed with the customer. Customers never see
            these notes.
          </p>
        </div>
        <span className="clog-private">
          <Icon name="lock" size={12} />
          Private - admin only
        </span>
      </div>

      {nextFollowUpAt && (
        <p
          className={`clog-banner ${followUpOverdue ? "clog-banner-due" : "clog-banner-next"}`}
        >
          <Icon name={followUpOverdue ? "clock" : "calendar"} size={14} />
          {followUpOverdue ? "Follow-up overdue since " : "Next follow-up: "}
          <strong>{formatDay(nextFollowUpAt)}</strong>
        </p>
      )}

      {/* ── Add a note ── */}
      <div className="clog-card">
        <div className="clog-chips" role="group" aria-label="Contact channel">
          {CHANNELS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setChannel(c.value)}
              aria-pressed={channel === c.value}
              className="clog-chip"
            >
              <Icon name={c.icon} size={14} />
              {c.label}
            </button>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE))}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSave();
          }}
          rows={4}
          placeholder="e.g. Called at 4 PM. Wants 500 pcs cotton kurtis, asked for sample + price on Friday. Budget around Rs 450/pc..."
          aria-label="What was discussed with the customer"
          className="clog-field clog-textarea"
        />

        <div className="clog-actions">
          <label className="clog-date">
            <span>Follow-up on (optional)</span>
            <input
              type="date"
              value={followUp}
              min={todayStr}
              onChange={(e) => setFollowUp(e.target.value)}
              className="clog-field"
            />
          </label>

          <div className="clog-save-wrap">
            <span
              className={`clog-counter ${note.length > MAX_NOTE - 200 ? "clog-counter-warn" : ""}`}
            >
              {note.length}/{MAX_NOTE} &middot; Ctrl+Enter to save
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !note.trim()}
              className="clog-save"
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>

        {feedback.text && (
          <p
            role="status"
            aria-live="polite"
            className={`clog-feedback ${feedback.type === "error" ? "clog-feedback-error" : "clog-feedback-ok"}`}
          >
            <Icon
              name={feedback.type === "error" ? "alert" : "check"}
              size={14}
            />
            {feedback.text}
          </p>
        )}
      </div>

      {/* ── History ── */}
      {sortedLogs.length === 0 ? (
        <p className="clog-empty">
          No contact notes yet. Your first note will also mark this inquiry as
          Contacted.
        </p>
      ) : (
        <ol className="clog-list">
          {sortedLogs.map((log) => {
            const ch = CHANNEL_MAP[log.channel] || CHANNEL_MAP.other;
            return (
              <li key={log._id} className="clog-item">
                <span className="clog-item-icon">
                  <Icon name={ch.icon} size={16} />
                </span>
                <div className="clog-item-body">
                  <div className="clog-item-top">
                    <p className="clog-item-meta">
                      <strong>{ch.label}</strong>
                      <span>{formatDateTime(log.createdAt)}</span>
                      {log.createdBy && (
                        <span className="clog-item-by">{log.createdBy}</span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDelete(log._id)}
                      disabled={deletingId === log._id}
                      aria-label="Delete this contact note"
                      className="clog-del"
                    >
                      <Icon name="trash" size={13} />
                      {deletingId === log._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                  <p className="clog-item-note">{log.note}</p>
                  {log.followUpAt && (
                    <p className="clog-item-follow">
                      <Icon name="calendar" size={12} />
                      Follow-up planned: {formatDay(log.followUpAt)}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
