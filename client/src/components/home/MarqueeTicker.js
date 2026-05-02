// export default function MarqueeTicker() {
//   return (
//     <>
//       <div
//         className="relative overflow-hidden shadow-2xl z-20"
//         style={{
//           // Using #6c4e3e as the main color with a very subtle gradient for 3D depth
//           background:
//             'linear-gradient(90deg, #563e31 0%, #6c4e3e 40%, #7a5847 60%, #563e31 100%)',
//         }}
//       >
//         {/* soft overlay for depth */}
//         <div className="absolute inset-0 backdrop-blur-[2px] bg-black/10" />

//         {/* top/bottom accent lines (Soft Tan to complement #6c4e3e) */}
//         <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EAC9A8]/40 to-transparent" />
//         <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EAC9A8]/40 to-transparent" />

//         {/* marquee */}
//         <div className="flex animate-[slide_30s_linear_infinite] whitespace-nowrap py-3 relative z-10">
//           {[...Array(8)].map((_, i) => (
//             <span
//               key={i}
//               className="font-sans text-[11px] md:text-[12px] tracking-[0.25em] md:tracking-[0.4em] uppercase mx-8 md:mx-10 font-bold"
//               style={{
//                 // Alternating between Light Cream and Warm Tan for high contrast luxury
//                 color: i % 2 === 0 ? '#FDF7F2' : '#EAC9A8',
//               }}
//             >
//               ✦ Short Kurti &nbsp;✦ Anarkali &nbsp;✦ ALine Suit &nbsp;✦ Straight 3 Piece Suit &nbsp;✦ Cord Set &nbsp;✦ Long Kurtis
//             </span>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }



export default function MarqueeTicker() {
  return (
    <>
      {/* ✅ A11Y & SEO: Converted to a semantic section with an aria-label */}
      <section
        aria-label="Trending Styles Ticker"
        className="relative overflow-hidden shadow-2xl z-20"
        style={{
          // Using #6c4e3e as the main color with a very subtle gradient for 3D depth
          background:
            'linear-gradient(90deg, #563e31 0%, #6c4e3e 40%, #7a5847 60%, #563e31 100%)',
        }}
      >
        {/* ✅ A11Y & SEO: Screen reader only text. 
            This cleanly reads the keywords once instead of repeating the marquee 8 times. */}
        <div className="sr-only">
          Our featured styles include: Short Kurti, Anarkali, A-Line Suit, Straight 3 Piece Suit, Cord Set, and Long Kurtis.
        </div>

        {/* soft overlay for depth */}
        {/* ✅ A11Y: Hidden decorative overlays */}
        <div aria-hidden="true" className="absolute inset-0 backdrop-blur-[2px] bg-black/10" />

        {/* top/bottom accent lines (Soft Tan to complement #6c4e3e) */}
        {/* ✅ A11Y: Hidden decorative lines */}
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EAC9A8]/40 to-transparent" />
        <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EAC9A8]/40 to-transparent" />

        {/* marquee */}
        {/* ✅ A11Y: Hidden the infinite looping text from screen readers to prevent spam */}
        <div aria-hidden="true" className="flex animate-[slide_30s_linear_infinite] whitespace-nowrap py-3 relative z-10">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="font-sans text-[11px] md:text-[12px] tracking-[0.25em] md:tracking-[0.4em] uppercase mx-8 md:mx-10 font-bold"
              style={{
                // Alternating between Light Cream and Warm Tan for high contrast luxury
                color: i % 2 === 0 ? '#FDF7F2' : '#EAC9A8',
              }}
            >
              ✦ Short Kurti &nbsp;✦ Anarkali &nbsp;✦ ALine Suit &nbsp;✦ Straight 3 Piece Suit &nbsp;✦ Cord Set &nbsp;✦ Long Kurtis
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
