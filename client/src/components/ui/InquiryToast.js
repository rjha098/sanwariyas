// FILE: client/src/components/ui/Toast.js
"use client";

import { useEffect } from "react";

export default function Toast({
  isVisible,
  message,
  type,
  onClose,
}) {
  // Auto-hide after 4 seconds
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className="fixed top-20 right-5 z-[9999] bg-white border border-gray-200 p-4 shadow-2xl rounded-md flex items-center gap-4 max-w-sm"
    >
      <p
        className={`flex-1 text-sm font-medium ${
          type === "error" ? "text-red-600" : "text-green-600"
        }`}
      >
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="text-gray-500 hover:text-black transition-colors font-bold text-lg leading-none"
      >
        ✕
      </button>
    </div>
  );
}