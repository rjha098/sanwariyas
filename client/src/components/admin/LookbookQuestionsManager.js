// FILE: client/src/components/admin/LookbookQuestionsManager.js
//
// Admin: add / edit / hide / remove the questions that pop up between pages of
// the Lookbook magazine. Customers' answers are attached to their inquiry.
"use client";

import { useState, useEffect } from "react";
import {
  fetchAllLookbookQuestions,
  createLookbookQuestion,
  updateLookbookQuestion,
  deleteLookbookQuestion,
} from "@/lib/lookbookApi";

const fieldCls =
  "w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee";

const SUGGESTIONS = [
  {
    text: "What kind of buyer are you?",
    options: ["Boutique owner", "Retailer", "Reseller", "Exporter"],
    type: "single",
  },
  {
    text: "How many pieces per style are you planning?",
    options: ["50–100", "100–300", "300–500", "500+"],
    type: "single",
  },
  {
    text: "Which fabrics do you prefer?",
    options: ["Cotton", "Rayon", "Muslin", "Silk blend"],
    type: "multiple",
  },
];

export default function LookbookQuestionsManager({ token, showToast }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [text, setText] = useState("");
  const [type, setType] = useState("single");
  const [optionsText, setOptionsText] = useState("");
  const [afterPhoto, setAfterPhoto] = useState(6);
  const [isActive, setIsActive] = useState(true);

  const toast = (msg, kind = "success") =>
    typeof showToast === "function" && showToast(msg, kind);
  const errText = (e, fb) => e.response?.data?.message || e.userMessage || fb;

  const load = async () => {
    try {
      const d = await fetchAllLookbookQuestions(token);
      if (d.success) setQuestions(d.questions || []);
    } catch (e) {
      toast(errText(e, "Failed to load questions"), "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setEditingId(null);
    setText("");
    setType("single");
    setOptionsText("");
    setAfterPhoto(6);
    setIsActive(true);
  };

  const startEdit = (q) => {
    setEditingId(q._id);
    setText(q.text);
    setType(q.type);
    setOptionsText((q.options || []).join("\n"));
    setAfterPhoto(q.afterPhoto);
    setIsActive(q.isActive);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const parseOptions = () =>
    Array.from(
      new Set(
        optionsText
          .split("\n")
          .map((o) => o.trim())
          .filter(Boolean),
      ),
    );

  const submit = async (e) => {
    e.preventDefault();
    const options = parseOptions();
    if (!text.trim()) return toast("Please type the question", "error");
    if (options.length < 2 || options.length > 8)
      return toast("Add 2 to 8 options (one per line)", "error");

    setSaving(true);
    const body = {
      text: text.trim(),
      type,
      options,
      afterPhoto: Number(afterPhoto) || 1,
      isActive,
    };
    try {
      if (editingId) {
        await updateLookbookQuestion(token, editingId, body);
        toast("Question updated");
      } else {
        await createLookbookQuestion(token, body);
        toast("Question added to the magazine");
      }
      reset();
      await load();
    } catch (err) {
      toast(errText(err, "Failed to save question"), "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (q) => {
    try {
      await updateLookbookQuestion(token, q._id, { isActive: !q.isActive });
      await load();
    } catch (err) {
      toast(errText(err, "Failed to update"), "error");
    }
  };

  const remove = async (q) => {
    if (!window.confirm("Remove this question from the magazine?")) return;
    try {
      await deleteLookbookQuestion(token, q._id);
      if (editingId === q._id) reset();
      toast("Question removed");
      await load();
    } catch (err) {
      toast(errText(err, "Failed to delete"), "error");
    }
  };

  return (
    <div className="mt-10 bg-white border border-brand-lightgold/40 p-6 md:p-8 rounded-sm">
      <h2 className="font-display text-2xl text-brand-african mb-1">
        Magazine Questions
      </h2>
      <p className="font-sans text-sm text-brand-mud mb-6">
        These appear as a page between photos in the Lookbook magazine. The
        customer&apos;s answers are added to their inquiry automatically.
      </p>

      <form onSubmit={submit} className="space-y-4 max-w-xl">
        <input
          className={fieldCls}
          placeholder="Question (e.g., How many pieces per style do you need?)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          required
        />
        <textarea
          className={fieldCls}
          rows={5}
          placeholder={"Options — one per line (2 to 8)\n50–100\n100–300\n300+"}
          value={optionsText}
          onChange={(e) => setOptionsText(e.target.value)}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block font-sans text-xs text-brand-mud">
            Answer type
            <select
              className={`${fieldCls} mt-1`}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="single">Pick one</option>
              <option value="multiple">Pick many</option>
            </select>
          </label>
          <label className="block font-sans text-xs text-brand-mud">
            Show after photo #
            <input
              type="number"
              min={1}
              max={500}
              className={`${fieldCls} mt-1`}
              value={afterPhoto}
              onChange={(e) => setAfterPhoto(e.target.value)}
            />
          </label>
        </div>
        <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Visible in the magazine
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-coffee text-brand-cream px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-brand-african transition disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Add question"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="px-6 py-3 text-xs tracking-[0.2em] uppercase border border-brand-lightgold/60 text-brand-mud"
            >
              Cancel
            </button>
          )}
        </div>

        {!editingId && questions.length === 0 && !loading && (
          <div className="pt-2">
            <p className="font-sans text-xs text-brand-mud mb-2">
              Quick start — click to fill:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  type="button"
                  onClick={() => {
                    setText(s.text);
                    setType(s.type);
                    setOptionsText(s.options.join("\n"));
                  }}
                  className="px-3 py-1.5 text-xs border border-brand-lightgold/60 rounded-full text-brand-mud hover:bg-brand-parchment"
                >
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-brand-mud">Loading…</p>
        ) : questions.length === 0 ? (
          <p className="text-sm text-brand-mud">
            No questions yet — the magazine will show only photos.
          </p>
        ) : (
          <ul className="divide-y divide-brand-lightgold/30 border border-brand-lightgold/30">
            {questions.map((q) => (
              <li
                key={q._id}
                className="p-4 flex flex-wrap items-start gap-4 justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-brand-african">
                    {q.text}
                    {!q.isActive && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Hidden
                      </span>
                    )}
                  </p>
                  <p className="font-sans text-xs text-brand-mud mt-1">
                    After photo #{q.afterPhoto} ·{" "}
                    {q.type === "multiple" ? "Pick many" : "Pick one"} ·{" "}
                    {(q.options || []).join(" / ")}
                  </p>
                </div>
                <div className="flex gap-2 whitespace-nowrap">
                  <button
                    onClick={() => toggleActive(q)}
                    className="px-3 py-1.5 text-xs border border-brand-lightgold/60 text-brand-mud hover:bg-brand-parchment"
                  >
                    {q.isActive ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => startEdit(q)}
                    className="px-3 py-1.5 text-xs border border-brand-lightgold/60 text-brand-coffee hover:bg-brand-parchment"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(q)}
                    className="px-3 py-1.5 text-xs border border-red-200 text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
