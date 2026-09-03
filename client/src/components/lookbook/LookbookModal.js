// // FILE: client/src/components/lookbook/LookbookModal.js
// // purpose:  modal pop up  shows firward backward button add  to cart  bulk order 
// "use client";
// import { useEffect } from "react";
// import Link from "next/link";

// export default function LookbookModal({
//   item,
//   backendUrl,
//   onClose,
//   onNext,
//   onPrev,
//   hasNext,
//   hasPrev,
//   currentIndex,
//   totalCount,
//   shortlist,
//   toggleShortlist,
// }) {
//   useEffect(() => {
//     if (!item) return;
//     const handleKey = (e) => {
//       if (e.key === "Escape") onClose();
//       if (e.key === "ArrowRight" && hasNext) onNext();
//       if (e.key === "ArrowLeft" && hasPrev) onPrev();
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [item, hasNext, hasPrev, onNext, onPrev, onClose]);

//   if (!item) return null;

//   const whatsappMsg = encodeURIComponent(
//     `Hi SANWARIYAS, I'm interested in your "${item.title}" (${item.category}) collection. Please share wholesale pricing & MOQ.`
//   );

//   const isShortlisted = shortlist?.some((i) => i._id === item._id);

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
//       role="dialog"
//       aria-modal="true"
//       aria-label={`${item.title} quick view`}
//     >
//       <div
//         className="absolute inset-0 bg-black/80 backdrop-blur-md animate-[fadeIn_0.25s_ease]"
//         onClick={onClose}
//       />

//       {totalCount > 1 && (
//         <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 w-full max-w-md px-6">
//           {Array.from({ length: Math.min(totalCount, 20) }).map((_, i) => (
//             <div
//               key={i}
//               className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
//                 i === currentIndex % 20 ? "bg-white" : "bg-white/30"
//               }`}
//             />
//           ))}
//         </div>
//       )}

//       {hasPrev && (
//         <button
//           onClick={onPrev}
//           aria-label="Previous piece"
//           className="hidden md:flex absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white hover:scale-110 text-[#7A3D2A] items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M15 18l-6-6 6-6" />
//           </svg>
//         </button>
//       )}
      
//       {hasNext && (
//         <button
//           onClick={onNext}
//           aria-label="Next piece"
//           className="hidden md:flex absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white hover:scale-110 text-[#7A3D2A] items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M9 18l6-6-6-6" />
//           </svg>
//         </button>
//       )}

//       <div
//         key={item._id}
//         className="relative bg-[#FDF7F2] w-full max-w-4xl max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-2xl shadow-2xl flex flex-col md:grid md:grid-cols-2 animate-[popIn_0.3s_ease] z-10"
//       >
//         <button
//           onClick={onClose}
//           aria-label="Close quick view"
//           className="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-[#7A3D2A] flex items-center justify-center text-xl font-bold shadow-lg hover:scale-105 transition-transform"
//         >
//           ×
//         </button>

//         {/* IMAGE SECTION */}
//         <div className="relative w-full h-[45vh] md:h-full shrink-0 bg-[#FDF7F2] flex justify-center items-center p-4 md:p-8">
//           <img
//             src={`${backendUrl}${item.image}`}
//             alt={`${item.title} - Wholesale Ethnic Wear`}
//             className="w-full h-full object-contain animate-[imageIn_0.4s_ease] rounded-2xl md:rounded-3xl shadow-[0_8px_25px_rgba(122,61,42,0.15)] border border-[#E8D5A3]/50"
//           />

//           {item.badge && item.badge !== "None" && (
//             <span className="absolute top-6 left-6 z-20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#BE6E5B] text-white shadow">
//               {item.badge}
//             </span>
//           )}

//           {totalCount > 1 && (
//             <div className="md:hidden absolute inset-0 flex z-10">
//               <button
//                 onClick={onPrev}
//                 disabled={!hasPrev}
//                 aria-label="Previous piece"
//                 className="w-1/2 h-full disabled:opacity-0"
//               />
//               <button
//                 onClick={onNext}
//                 disabled={!hasNext}
//                 aria-label="Next piece"
//                 className="w-1/2 h-full disabled:opacity-0"
//               />
//             </div>
//           )}

//           {totalCount > 1 && (
//             <span className="absolute bottom-6 right-6 z-20 font-sans text-[10px] tracking-[0.2em] uppercase text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
//               {currentIndex + 1} / {totalCount}
//             </span>
//           )}
//         </div>

//         {/* TEXT SECTION */}
//         <div className="p-6 md:p-10 flex flex-col justify-center h-full">
//           <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-2">
//             {item.category}
//           </p>
//           <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-[#7A3D2A] font-bold mb-4 leading-tight">
//             {item.title}
//           </h2>
//           <p className="font-serif italic text-[#a07f61] text-sm md:text-base mb-8 leading-relaxed">
//             Manufactured in Jaipur, available for wholesale bulk orders.
//             MOQ and pricing details available on inquiry.
//           </p>

//           <div className="flex flex-col gap-3 mt-auto">
//             {shortlist && toggleShortlist && (
//               <button
//                 type="button"
//                 onClick={() => toggleShortlist(item)}
//                 className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full font-sans text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 ${
//                   isShortlisted
//                     ? "bg-[#7A3D2A] text-white shadow-md border-2 border-[#7A3D2A]"
//                     : "bg-transparent text-[#7A3D2A] border-2 border-[#7A3D2A] hover:bg-[#7A3D2A] hover:text-white"
//                 }`}
//               >
//                 {isShortlisted ? "✓ Remove from Box" : "+ Add to Inquiry Box"}
//               </button>
//             )}

//             <a
//               href={`https://wa.me/919251171306?text=${whatsappMsg}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] text-white rounded-full font-sans text-xs tracking-[0.2em] uppercase font-bold hover:brightness-105 shadow-md transition-all"
//             >
//               Inquire on WhatsApp
//             </a>

//             {totalCount > 1 && (
//               <p className="text-center font-sans text-[9px] tracking-[0.2em] uppercase text-[#a07f61] mt-3 hidden md:block">
//                 Use ← → keys to browse
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes popIn {
//           from { opacity: 0; transform: scale(0.92) translateY(10px); }
//           to { opacity: 1; transform: scale(1) translateY(0); }
//         }
//         @keyframes imageIn {
//           from { opacity: 0; transform: scale(1.03); }
//           to { opacity: 1; transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// }


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
          className="flex absolute left-4 md:left-8 lg:left-16 bottom-[5%] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#7A3D2A] lg:bg-white hover:scale-110 text-white lg:text-[#7A3D2A] items-center justify-center transition-all duration-300 shadow-md lg:shadow-[0_0_20px_rgba(255,255,255,0.4)] border border-white lg:border-none"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      
      {hasNext && (
        <button
          onClick={onNext}
          aria-label="Next piece"
          className="flex absolute right-4 md:right-8 lg:right-16 bottom-[5%] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#7A3D2A] lg:bg-white hover:scale-110 text-white lg:text-[#7A3D2A] items-center justify-center transition-all duration-300 shadow-md lg:shadow-[0_0_20px_rgba(255,255,255,0.4)] border border-white lg:border-none"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      <div
        key={item._id}
        className="relative bg-[#FDF7F2] w-full max-w-4xl max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-2xl shadow-2xl flex flex-col md:grid md:grid-cols-2 animate-[popIn_0.3s_ease] z-10"
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-[#7A3D2A] flex items-center justify-center text-xl font-bold shadow-lg hover:scale-105 transition-transform"
        >
          ×
        </button>

        {/* IMAGE SECTION */}
        <div className="relative w-full h-[45vh] md:h-full shrink-0 bg-[#FDF7F2] flex justify-center items-center p-4 md:p-8">
          <img
            src={`${backendUrl}${item.image}`}
            alt={`${item.title} - Wholesale Ethnic Wear`}
            className="w-full h-full object-contain animate-[imageIn_0.4s_ease] rounded-2xl md:rounded-3xl shadow-[0_8px_25px_rgba(122,61,42,0.15)] border border-[#E8D5A3]/50"
          />

          {item.badge && item.badge !== "None" && (
            <span className="absolute top-6 left-6 z-20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#BE6E5B] text-white shadow">
              {item.badge}
            </span>
          )}

          {totalCount > 1 && (
            <div className="md:hidden absolute inset-0 flex z-10">
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
            <span className="absolute bottom-6 right-6 z-20 font-sans text-[10px] tracking-[0.2em] uppercase text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              {currentIndex + 1} / {totalCount}
            </span>
          )}
        </div>

        {/* TEXT SECTION */}
        <div className="p-6 md:p-10 flex flex-col justify-center h-full">
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