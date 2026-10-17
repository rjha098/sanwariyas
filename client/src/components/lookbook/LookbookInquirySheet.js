// FILE: client/src/components/lookbook/LookbookInquirySheet.js
//
// ONE-TIME bulk inquiry from the Lookbook: every selected style (with its
// style number + name) and the answers to the magazine questions go out as a
// single inquiry. Contact details are asked once and remembered on the device.
"use client";

import { useEffect, useState } from "react";
import { submitLookbookInquiry } from "@/lib/lookbookApi";
import PhoneInput from "@/components/ui/PhoneInput";

const CONTACT_KEY = "sanwariyas_lookbook_contact";
const WHATSAPP_NUMBER = "919251171306";

const onImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = "/images/placeholder.png";
};

const inputCls =
  "w-full border border-[#BE6E5B]/30 bg-white px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-[#7A3D2A] text-[#7A3D2A] placeholder-[#a07f61]/70";

export default function LookbookInquirySheet({
  open,
  onClose,
  shortlist,
  answers,
  backendUrl,
  onRemove,
  onClear,
}) {
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    whatsapp: "",
    email: "",
    country: "India",
    note: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // {count, styles}

  // remembered contact details (asked only once) + logged-in profile
  useEffect(() => {
    if (!open) return;
       setDone(null);
    try {
      const saved = JSON.parse(localStorage.getItem(CONTACT_KEY) || "{}");
      setForm((f) => ({
        ...f,
        name: saved.name || f.name,
        companyName: saved.companyName || f.companyName,
        whatsapp: saved.whatsapp || f.whatsapp,
        email: saved.email || f.email,
        country: saved.country || f.country,
      }));
    } catch {
      // ignore corrupted storage
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const answerList = Object.values(answers || {}).filter((a) => a.answer?.length);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (shortlist.length === 0) return setError("Please select at least one style.");
    const { name, companyName, whatsapp, email, country } = form;
    if (!name.trim() || !companyName.trim() || !whatsapp.trim() || !email.trim() || !country.trim()) {
      return setError("Please fill your name, company, WhatsApp, email and country.");
    }

    setSending(true);
    try {
      await submitLookbookInquiry(
        {
          name: name.trim(),
          companyName: companyName.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim(),
          country: country.trim(),
          note: form.note.trim(),
          lookbookIds: shortlist.map((i) => i._id),
          lookbookAnswers: answerList.map((a) => ({
            question: a.question,
            answer: a.answer,
          })),
        },
      );

      try {
        localStorage.setItem(
          CONTACT_KEY,
          JSON.stringify({ name, companyName, whatsapp, email, country }),
        );
      } catch {
        // storage blocked — fine
      }
      setDone({ count: shortlist.length, styles: shortlist });
      onClear();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.userMessage ||
          "Could not send your inquiry. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const whatsappHref = () => {
    const styles = (done?.styles || shortlist)
      .map((i) => `${i.styleNumber || "—"} ${i.title}`)
      .join("\n");
    const msg = `Hi SANWARIYAS, I just sent an inquiry from your Lookbook for:\n\n${styles}\n\nPlease share pricing & MOQ.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease]">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#FDF7F2] h-full shadow-2xl flex flex-col animate-[slideInRight_0.4s_ease-out]">
        <div className="flex items-center justify-between p-5 border-b border-[#E8D5A3]/40 bg-white">
          <div>
            <h2 className="font-display text-2xl text-[#7A3D2A] font-bold">
              {done ? "Inquiry sent" : "Your Inquiry"}
            </h2>
            <p className="font-sans text-xs text-[#a07f61] mt-0.5">
              {done
                ? "We’ll get back to you shortly"
                : `${shortlist.length} style${shortlist.length === 1 ? "" : "s"} · one single inquiry`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#FAF3E8] hover:bg-[#E8D5A3] text-[#7A3D2A] text-xl"
            title="Close"
          >
            &times;
          </button>
        </div>

        {done ? (
          <div className="flex-1 overflow-y-auto p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#4C8C6C] text-white flex items-center justify-center text-3xl">
              ✓
            </div>
            <h3 className="font-display text-xl text-[#7A3D2A] font-bold mb-2">
              {done.count} style{done.count === 1 ? "" : "s"} sent in one inquiry
            </h3>
            <p className="font-sans text-sm text-[#a07f61] mb-6">
              Our team will share pricing & MOQ for every style you selected.
            </p>
            <ul className="text-left space-y-2 mb-6">
              {done.styles.map((i) => (
                <li key={i._id} className="flex gap-3 items-center bg-white p-2 rounded-lg border border-[#BE6E5B]/15">
                  <img src={`${backendUrl}${i.image}`} onError={onImgError} alt="" className="w-10 h-12 object-cover rounded" />
                  <div className="min-w-0">
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#BE6E5B] font-bold">
                      {i.styleNumber || "—"}
                    </p>
                    <p className="font-sans text-sm text-[#7A3D2A] truncate">{i.title}</p>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#25D366] text-white py-3.5 rounded-xl font-sans text-xs tracking-[0.2em] uppercase font-bold mb-3"
            >
              Also message us on WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* selected styles */}
              <section>
                <h3 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold mb-3">
                  Selected styles
                </h3>
                {shortlist.length === 0 ? (
                  <p className="text-sm text-[#a07f61]">No styles selected yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {shortlist.map((item) => (
                      <li key={item._id} className="flex gap-3 items-center bg-white p-2.5 rounded-xl border border-[#BE6E5B]/15 shadow-sm">
                        <img src={`${backendUrl}${item.image}`} onError={onImgError} alt={item.title} className="w-14 h-[72px] object-cover rounded-lg bg-[#FAF3E8]" />
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#BE6E5B] font-bold">
                            Style {item.styleNumber || "—"}
                          </p>
                          <p className="font-display text-sm text-[#7A3D2A] font-bold leading-tight line-clamp-2">
                            {item.title}
                          </p>
                          <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#a07f61] mt-0.5">
                            {item.category}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(item)}
                          className="w-8 h-8 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          title="Remove"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {answerList.length > 0 && (
                <section>
                  <h3 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold mb-3">
                    Your preferences
                  </h3>
                  <ul className="space-y-1.5">
                    {answerList.map((a, i) => (
                      <li key={i} className="font-sans text-xs text-[#7A3D2A]">
                        <span className="text-[#a07f61]">{a.question}: </span>
                        <strong>{a.answer.join(", ")}</strong>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* contact — asked only once */}
              <section className="space-y-3">
                <h3 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold">
                  Your details <span className="normal-case tracking-normal text-[#a07f61]">(saved for next time)</span>
                </h3>
                <input className={inputCls} placeholder="Your name *" value={form.name} onChange={set("name")} maxLength={120} required />
                <input className={inputCls} placeholder="Company / boutique name *" value={form.companyName} onChange={set("companyName")} maxLength={150} required />
                <PhoneInput value={form.whatsapp} onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))} required placeholder="WhatsApp number *" />
                <input className={inputCls} type="email" placeholder="Email *" value={form.email} onChange={set("email")} maxLength={150} required />
                <input className={inputCls} placeholder="Country *" value={form.country} onChange={set("country")} maxLength={80} required />
                <textarea className={inputCls} rows={3} placeholder="Anything else? (quantity, colours, sizes…) — optional" value={form.note} onChange={set("note")} maxLength={1500} />
              </section>
            </div>

            <div className="p-5 bg-white border-t border-[#E8D5A3]/40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
              {error && (
                <p role="alert" className="mb-3 text-xs text-red-600 font-sans">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={sending || shortlist.length === 0}
                className="w-full bg-[#7A3D2A] text-white py-4 rounded-xl font-sans text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#5f2e1f] transition disabled:opacity-50"
              >
                {sending ? "Sending…" : `Send inquiry for ${shortlist.length} style${shortlist.length === 1 ? "" : "s"}`}
              </button>
              <button
                type="button"
                onClick={onClear}
                disabled={shortlist.length === 0}
                className="w-full mt-3 font-sans text-[10px] tracking-[0.2em] uppercase text-[#a07f61] hover:text-red-500 transition-colors disabled:opacity-40"
              >
                Clear all
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}