// FILE: client/src/components/lookbook/LookbookModal.js
"use client";
import Link from "next/link";

export default function LookbookModal({ item, backendUrl, onClose }) {
  if (!item) return null;

  const whatsappMsg = encodeURIComponent(
    `Hi SANWARIYAS, I'm interested in your "${item.title}" (${item.category}) collection. Please share wholesale pricing & MOQ.`
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} quick view`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.25s_ease]"
        onClick={onClose}
      />

      <div className="relative bg-[#FDF7F2] w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 animate-[popIn_0.3s_ease]">
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#7A3D2A] flex items-center justify-center text-lg font-bold shadow-md"
        >
          ×
        </button>

        <div className="relative aspect-[4/5] md:aspect-auto bg-[#E0BFA2]/30">
          <img
            src={`${backendUrl}${item.image}`}
            alt={`${item.title} - Wholesale Ethnic Wear`}
            className="w-full h-full object-cover"
          />
          {item.badge && item.badge !== "None" && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#BE6E5B] text-white shadow">
              {item.badge}
            </span>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-center">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-2">
            {item.category}
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-[#7A3D2A] font-bold mb-4">
            {item.title}
          </h2>
          <p className="font-serif italic text-[#a07f61] text-sm mb-6 leading-relaxed">
            Manufactured in Jaipur, available for wholesale bulk orders.
            MOQ and pricing details available on inquiry.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/919251171306?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-white rounded-full font-sans text-xs tracking-[0.2em] uppercase font-bold hover:opacity-90 transition"
            >
              Inquire on WhatsApp
            </a>
            <Link
              href={`/contact?inquiry=${encodeURIComponent(item.title)}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-[#7A3D2A] text-[#7A3D2A] rounded-full font-sans text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#7A3D2A] hover:text-white transition"
            >
              Send Bulk Inquiry Form
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}