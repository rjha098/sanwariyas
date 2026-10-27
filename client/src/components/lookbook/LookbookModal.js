// // FILE: client/src/components/lookbook/LookbookModal.js
// // Full-screen image viewer (lightbox): prev/next, swipe, zoom, selection.
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { getImageUrl } from "@/lib/imageUrl";
// import { itemCaption } from "@/components/lookbook/LookbookGrid";

// const fallback = (e) => {
//   e.currentTarget.onerror = null;
//   e.currentTarget.src = "/images/placeholder.png";
// };

// export default function LookbookModal({
//   items,
//   index,
//   selectedSet,
//   selectable = true,
//   onIndex,
//   onClose,
//   onToggle,
// }) {
//   const [zoom, setZoom] = useState(false);
//   const dialogRef = useRef(null);
//   const closeRef = useRef(null);
//   const swipeStart = useRef(null);
//   const count = items.length;
//   const item = items[index];

//   const prev = () => onIndex((index - 1 + count) % count);
//   const next = () => onIndex((index + 1) % count);

//   useEffect(() => setZoom(false), [index]);

//   // focus management + scroll lock
//   useEffect(() => {
//     const opener = document.activeElement;
//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     closeRef.current?.focus();
//     return () => {
//       document.body.style.overflow = prevOverflow;
//       if (opener && typeof opener.focus === "function") opener.focus();
//     };
//   }, []);

//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") return onClose();
//       if (e.key === "ArrowRight") return next();
//       if (e.key === "ArrowLeft") return prev();
//       if (e.key === "Tab" && dialogRef.current) {
//         const f = dialogRef.current.querySelectorAll(
//           "button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
//         );
//         if (!f.length) return;
//         const firstEl = f[0];
//         const lastEl = f[f.length - 1];
//         if (e.shiftKey && document.activeElement === firstEl) {
//           e.preventDefault();
//           lastEl.focus();
//         } else if (!e.shiftKey && document.activeElement === lastEl) {
//           e.preventDefault();
//           firstEl.focus();
//         }
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   });

//   // preload neighbours
//   useEffect(() => {
//     [items[(index + 1) % count], items[(index - 1 + count) % count]]
//       .filter(Boolean)
//       .forEach((it) => {
//         const img = new Image();
//         img.src = getImageUrl(it.display || it.image);
//       });
//   }, [items, index, count]);

//   if (!item) return null;
//   const selected = selectedSet.has(item._id);
//   const code = item.styleNumber || item.title;

//   const onPointerDown = (e) => {
//     swipeStart.current = zoom ? null : e.clientX;
//   };
//   const onPointerUp = (e) => {
//     if (swipeStart.current == null) return;
//     const dx = e.clientX - swipeStart.current;
//     swipeStart.current = null;
//     if (Math.abs(dx) > 60 && count > 1) (dx < 0 ? next : prev)();
//   };

//   return (
//     <div
//       ref={dialogRef}
//       className="lb-root lb-overlay"
//       role="dialog"
//       aria-modal="true"
//       aria-label={`Design ${code}`}
//     >
//       <div className="lb-lightbox-top">
//         <span className="lb-count" aria-live="polite">
//           {index + 1} / {count}
//         </span>
//         <div className="lb-tools">
//           <button
//             type="button"
//             className="lb-btn lb-btn--sm"
//             onClick={() => setZoom((z) => !z)}
//             aria-pressed={zoom}
//           >
//             {zoom ? "Fit to screen" : "Zoom in"}
//           </button>
//           <button
//             ref={closeRef}
//             type="button"
//             className="lb-icon-btn"
//             onClick={onClose}
//             aria-label="Close viewer"
//           >
//             ✕
//           </button>
//         </div>
//       </div>

//       <div
//         className={`lb-stage${zoom ? " is-zoomed" : ""}`}
//         onPointerDown={onPointerDown}
//         onPointerUp={onPointerUp}
//         onClick={() => zoom && setZoom(false)}
//       >
//         {count > 1 && !zoom && (
//           <>
//             <button
//               type="button"
//               className="lb-icon-btn lb-nav lb-nav--prev"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 prev();
//               }}
//               aria-label="Previous design"
//             >
//               ‹
//             </button>
//             <button
//               type="button"
//               className="lb-icon-btn lb-nav lb-nav--next"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 next();
//               }}
//               aria-label="Next design"
//             >
//               ›
//             </button>
//           </>
//         )}
//         <img
//           key={`${item._id}-${zoom}`}
//           src={getImageUrl(zoom ? item.full || item.image : item.display || item.image)}
//           alt={item.title || code}
//           draggable={false}
//           decoding="async"
//           onError={fallback}
//         />
//       </div>

//       <div className="lb-lightbox-bottom">
//         <div>
//           {item.styleNumber && <p className="lb-code">{item.styleNumber}</p>}
//           <p className="lb-meta">{itemCaption(item)}</p>
//         </div>
//         {selectable && (
//           <button
//             type="button"
//             className={`lb-btn${selected ? " lb-btn--accent" : ""}`}
//             aria-pressed={selected}
//             onClick={() => onToggle(item._id)}
//           >
//             {selected ? "✓ Selected" : "Select this design"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// FILE: client/src/components/lookbook/LookbookModal.js
// Full-screen image viewer (lightbox): prev/next, swipe, zoom, selection.
"use client";

import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "@/lib/imageUrl";
import { itemCaption } from "@/components/lookbook/LookbookGrid";

const fallback = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = "/images/placeholder.png";
};

export default function LookbookModal({
  items,
  index,
  selectedSet,
  selectable = true,
  onIndex,
  onClose,
  onToggle,
}) {
  const [zoom, setZoom] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const swipeStart = useRef(null);
  const count = items.length;
  const item = items[index];

  const prev = () => onIndex((index - 1 + count) % count);
  const next = () => onIndex((index + 1) % count);

  useEffect(() => setZoom(false), [index]);

  // focus management + scroll lock
  useEffect(() => {
    const opener = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight") return next();
      if (e.key === "ArrowLeft") return prev();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll(
          "button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (!f.length) return;
        const firstEl = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // preload neighbours
  useEffect(() => {
    [items[(index + 1) % count], items[(index - 1 + count) % count]]
      .filter(Boolean)
      .forEach((it) => {
        const img = new Image();
        img.src = getImageUrl(it.display || it.image);
      });
  }, [items, index, count]);

  if (!item) return null;
  const selected = selectedSet.has(item._id);
  const code = item.styleNumber || item.title;

  const onPointerDown = (e) => {
    swipeStart.current = zoom ? null : e.clientX;
  };
  const onPointerUp = (e) => {
    if (swipeStart.current == null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 60 && count > 1) (dx < 0 ? next : prev)();
  };

  return (
    <div
      ref={dialogRef}
      className="lb-root lb-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Design ${code}`}
    >
      <div className="lb-lightbox-top">
        <span className="lb-count" aria-live="polite">
          {index + 1} / {count}
        </span>
        <div className="lb-tools">
          <button
            type="button"
            className="lb-btn lb-btn--sm"
            onClick={() => setZoom((z) => !z)}
            aria-pressed={zoom}
          >
            {zoom ? "Fit to screen" : "Zoom in"}
          </button>
          <button
            ref={closeRef}
            type="button"
            className="lb-icon-btn"
            onClick={onClose}
            aria-label="Close viewer"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        className={`lb-stage${zoom ? " is-zoomed" : ""}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={() => zoom && setZoom(false)}
      >
        {count > 1 && !zoom && (
          <>
            <button
              type="button"
              className="lb-icon-btn lb-nav lb-nav--prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous design"
            >
              ‹
            </button>
            <button
              type="button"
              className="lb-icon-btn lb-nav lb-nav--next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next design"
            >
              ›
            </button>
          </>
        )}
        <img
          key={`${item._id}-${zoom}`}
          src={getImageUrl(
            zoom ? item.full || item.image : item.display || item.image,
          )}
          alt={item.title || code}
          draggable={false}
          decoding="async"
          onError={fallback}
        />
      </div>

      <div className="lb-lightbox-bottom">
        <div>
          {item.styleNumber && <p className="lb-code">{item.styleNumber}</p>}
          <p className="lb-meta">{itemCaption(item)}</p>
        </div>
        {selectable && !item.unselectable && (
          <button
            type="button"
            className={`lb-btn${selected ? " lb-btn--accent" : ""}`}
            aria-pressed={selected}
            onClick={() => onToggle(item._id)}
          >
            {selected ? "✓ Selected" : "Select this design"}
          </button>
        )}
      </div>
    </div>
  );
}
