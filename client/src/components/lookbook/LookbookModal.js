// FILE: client/src/components/lookbook/LookbookModal.js
"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function LookbookModal({
  item,
  backendUrl,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  currentIndex,
  totalCount,
  shortlist,
  toggleShortlist,
}) {
  useEffect(() => {
    if (!item) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [item, hasNext, hasPrev, onNext, onPrev, onClose]);

  if (!item) return null;

  const whatsappMsg = encodeURIComponent(
    `Hi SANWARIYAS, I'm interested in your "${item.title}" (${item.category}) collection. Please share wholesale pricing & MOQ.`
  );

  const isShortlisted = shortlist?.some((i) => i._id === item._id);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} quick view`}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-[fadeIn_0.25s_ease]"
        onClick={onClose}
      />

      {totalCount > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 w-full max-w-md px-6">
          {Array.from({ length: Math.min(totalCount, 20) }).map((_, i) => (
            <div
              key={i}
              className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                i === currentIndex % 20 ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {hasPrev && (
        <button
          onClick={onPrev}
          aria-label="Previous piece"
          className="hidden md:flex absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white hover:scale-110 text-[#7A3D2A] items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      
      {hasNext && (
        <button
          onClick={onNext}
          aria-label="Next piece"
          className="hidden md:flex absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white hover:scale-110 text-[#7A3D2A] items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      <div
        key={item._id}
        className="relative bg-[#FDF7F2] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 animate-[popIn_0.3s_ease] z-10"
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#7A3D2A] flex items-center justify-center text-xl font-bold shadow-md hover:scale-105 transition-transform"
        >
          ×
        </button>

        <div className="relative aspect-[3/4] md:aspect-auto bg-[#E0BFA2]/30 h-full">
          <img
            src={`${backendUrl}${item.image}`}
            alt={`${item.title} - Wholesale Ethnic Wear`}
            className="w-full h-full object-cover animate-[imageIn_0.4s_ease]"
          />
          {item.badge && item.badge !== "None" && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#BE6E5B] text-white shadow">
              {item.badge}
            </span>
          )}

          {totalCount > 1 && (
            <div className="md:hidden absolute inset-0 flex">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                aria-label="Previous piece"
                className="w-1/2 h-full disabled:opacity-0"
              />
              <button
                onClick={onNext}
                disabled={!hasNext}
                aria-label="Next piece"
                className="w-1/2 h-full disabled:opacity-0"
              />
            </div>
          )}

          {totalCount > 1 && (
            <span className="absolute bottom-4 right-4 font-sans text-[10px] tracking-[0.2em] uppercase text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              {currentIndex + 1} / {totalCount}
            </span>
          )}
        </div>

        <div className="p-8 md:p-10 flex flex-col justify-center h-full">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-2">
            {item.category}
          </p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-[#7A3D2A] font-bold mb-4 leading-tight">
            {item.title}
          </h2>
          <p className="font-serif italic text-[#a07f61] text-sm md:text-base mb-8 leading-relaxed">
            Manufactured in Jaipur, available for wholesale bulk orders.
            MOQ and pricing details available on inquiry.
          </p>

          <div className="flex flex-col gap-3 mt-auto">
            {shortlist && toggleShortlist && (
              <button
                type="button"
                onClick={() => toggleShortlist(item)}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full font-sans text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 ${
                  isShortlisted
                    ? "bg-[#7A3D2A] text-white shadow-md border-2 border-[#7A3D2A]"
                    : "bg-transparent text-[#7A3D2A] border-2 border-[#7A3D2A] hover:bg-[#7A3D2A] hover:text-white"
                }`}
              >
                {isShortlisted ? "✓ Remove from Box" : "+ Add to Inquiry Box"}
              </button>
            )}

            <a
              href={`https://wa.me/919251171306?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] text-white rounded-full font-sans text-xs tracking-[0.2em] uppercase font-bold hover:brightness-105 shadow-md transition-all"
            >
              Inquire on WhatsApp
            </a>

            {totalCount > 1 && (
              <p className="text-center font-sans text-[9px] tracking-[0.2em] uppercase text-[#a07f61] mt-3 hidden md:block">
                Use ← → keys to browse
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes imageIn {
          from { opacity: 0; transform: scale(1.03); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}