// // FILE: client/src/components/home/MarqueeTicker.js
// export default function MarqueeTicker() {
//   return (
//     <>
//       <section
//         aria-label="Trending Styles Ticker"
//         className="relative overflow-hidden shadow-2xl z-20"
//         style={{
//           // Using #6c4e3e as the main color with a very subtle gradient for 3D depth
//           background:
//             'linear-gradient(90deg, #563e31 0%, #6c4e3e 40%, #7a5847 60%, #563e31 100%)',
//         }}
//       >
//         {/* Screen reader only text. 
//             This cleanly reads the keywords once instead of repeating the marquee 8 times. */}
//         <div className="sr-only">
//           Our featured styles include: Short Kurti, Anarkali, A-Line Suit, Straight 3 Piece Suit, Cord Set, and Long Kurtis.
//         </div>

//         {/* Soft overlay for depth */}
//         <div aria-hidden="true" className="absolute inset-0 backdrop-blur-[2px] bg-black/10 pointer-events-none" />

//         {/* Top/bottom accent lines (Soft Tan to complement #6c4e3e) */}
//         <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EAC9A8]/40 to-transparent pointer-events-none" />
//         <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EAC9A8]/40 to-transparent pointer-events-none" />

//         {/* Marquee */}
//         {/* ✅ A11Y & UX FIX: Added hover pause and motion-reduce pause */}
//         <div 
//           aria-hidden="true" 
//           className="flex animate-[slide_30s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused] whitespace-nowrap py-3 relative z-10"
//         >
//           {[...Array(8)].map((_, i) => (
//             <span
//               key={i}
//               className="font-sans text-[11px] md:text-[12px] tracking-[0.25em] md:tracking-[0.4em] uppercase mx-8 md:mx-10 font-bold"
//               style={{
//                 // Alternating between Light Cream and Warm Tan for high contrast luxury
//                 color: i % 2 === 0 ? '#FDF7F2' : '#EAC9A8',
//               }}
//             >
//               ✦ Short Kurti &nbsp;✦ Anarkali &nbsp;✦ A-Line Suit &nbsp;✦ Straight 3 Piece Suit &nbsp;✦ Cord Set &nbsp;✦ Long Kurtis
//             </span>
//           ))}
//         </div>
//       </section>
//     </>
//   );
// }



// FILE: client/src/components/home/MarqueeTicker.js
export default function MarqueeTicker() {
  return (
    <section
      aria-label="Trending Styles Ticker"
      className="relative overflow-hidden z-20 shadow-[0_8px_32px_rgba(92,49,32,0.28)]"
      style={{
        background:
          "linear-gradient(90deg, #5C3120 0%, #7A3D2A 35%, #BE6E5B 60%, #7A3D2A 80%, #5C3120 100%)",
      }}
    >
      {/* Screen reader only text */}
      <div className="sr-only">
        Our featured styles include: Short Kurti, Anarkali, A-Line Suit, Straight 3 Piece Suit, Co-ord Set, and Long Kurtis.
      </div>

      {/* Subtle depth overlay */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Top accent line */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F2D9C3]/50 to-transparent pointer-events-none" />
      {/* Bottom accent line */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F2D9C3]/50 to-transparent pointer-events-none" />

      {/* Left/right fade edges */}
      <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#5C3120]/70 to-transparent z-10 pointer-events-none" />
      <div aria-hidden="true" className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#5C3120]/70 to-transparent z-10 pointer-events-none" />

      {/* Marquee */}
      <div
        aria-hidden="true"
        className="flex animate-[slide_32s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused] whitespace-nowrap py-3.5 relative z-10"
      >
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="font-sans text-[11px] md:text-[12px] tracking-[0.28em] md:tracking-[0.42em] uppercase mx-8 md:mx-10 font-bold"
            style={{
              color: i % 2 === 0 ? "#FDF7F2" : "#F2D9C3",
            }}
          >
            ✦ Short Kurti &nbsp;✦ Anarkali &nbsp;✦ A-Line Suit &nbsp;✦ Straight 3 Piece Suit &nbsp;✦ Co-ord Set &nbsp;✦ Long Kurtis
          </span>
        ))}
      </div>
    </section>
  );
}