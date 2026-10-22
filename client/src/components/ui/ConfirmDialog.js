// FILE: client/src/components/ui/ConfirmDialog.js
// PURPOSE: Reusable confirm/cancel modal (used for logout confirmation).
"use client";

import { useEffect } from "react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm bg-white border border-[#E8D5A3]/60 shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="font-display text-xl text-brand-african"
        >
          {title}
        </h2>
        {message && (
          <p className="font-sans text-sm text-brand-mud mt-2">{message}</p>
        )}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-brand-lightgold/60 py-2.5 font-sans text-xs tracking-[0.2em] uppercase text-brand-mud hover:text-brand-coffee transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className="flex-1 bg-brand-coffee text-brand-cream py-2.5 font-sans text-xs tracking-[0.2em] uppercase hover:bg-brand-african transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}