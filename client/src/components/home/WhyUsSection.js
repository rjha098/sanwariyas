// // FILE: client/src/components/home/WhyUsSection.js

// const USP_ITEMS = [
//   {
//     number: "01",

//     title: "Flexible MOQ",
//     desc: "Ready stock orders start from just 2–3 sets, while custom manufacturing begins from 120–150 pieces per design and color—ideal for retailers, wholesalers, boutiques, and private label brands.",

//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 40 40"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#BE6E5B"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <rect x="6" y="12" width="10" height="20" rx="2" />
//         <rect x="15" y="8" width="10" height="24" rx="2" />
//         <rect x="24" y="16" width="10" height="16" rx="2" />
//       </svg>
//     ),
//   },
//   {
//     number: "02",
//     title: "Export-Grade Quality Control",
//     desc: "Every piece passes a 4-step QC — fabric check, stitching inspection, color-fastness test, and a final finishing review before dispatch.",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 40 40"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#BE6E5B"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="20" cy="20" r="13" />
//         <path d="M13 20.5 L17.5 25 L27 15" />
//       </svg>
//     ),
//   },
//   {
//     number: "03",
//     title: "Direct from Manufacturer",
//     desc: "No middlemen. We manufacture in Jaipur and ship directly — factory-direct wholesale pricing, faster lead times, and full visibility over every order.",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 40 40"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#BE6E5B"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M8 28 L8 16 L20 8 L32 16 L32 28" />
//         <rect x="15" y="20" width="10" height="8" rx="1" />
//         <path d="M8 28 L32 28" />
//       </svg>
//     ),
//   },
//   {
//     number: "04",
//     title: "2500 New Designs Every Season",
//     desc: "Our in-house team launches new wholesale kurti, cotton suit and co-ord set collections every season, helping boutiques stay ahead of fashion trends.",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 40 40"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#BE6E5B"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="20" cy="20" r="6" />
//         <path d="M20 6 L20 10 M20 30 L20 34 M6 20 L10 20 M30 20 L34 20" />
//         <path d="M10.1 10.1 L13 13 M27 27 L29.9 29.9 M29.9 10.1 L27 13 M13 27 L10.1 29.9" />
//       </svg>
//     ),
//   },
//   {
//     number: "05",
//     title: "Worldwide Export & Fast Dispatch",
//     desc: "We export wholesale ethnic wear to over 50 countries with fully insured, trackable shipments and fast dispatch.",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 40 40"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#BE6E5B"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="20" cy="20" r="13" />
//         <path d="M7 20 Q13 14 20 20 Q27 26 33 20" />
//         <path d="M20 7 Q14 13 20 20 Q26 27 20 33" />
//       </svg>
//     ),
//   },
//   {
//     number: "06",

//     title: "Brand Building Partner",
//     desc: "We help wholesalers, retailers, boutiques, and private label brands create exclusive ethnic wear collections with complete manufacturing and branding support.",

//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 40 40"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#BE6E5B"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M12 28 L16 16 L28 12 L24 24 Z" />
//         <circle cx="20" cy="20" r="3" />
//         <path d="M8 8 L14 14 M32 8 L26 14 M8 32 L14 26 M32 32 L26 26" />
//       </svg>
//     ),
//   },
// ];

// export default function WhyUsSection() {
//   return (
//     <>
//       {/* JSON-LD Schema */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "ItemList",
//             name: "Why Choose SANWARIYAS",
//             itemListElement: USP_ITEMS.map((item, index) => ({
//               "@type": "ListItem",
//               position: index + 1,
//               name: item.title,
//               description: item.desc,
//             })),
//           }),
//         }}
//       />

//       <section
//         aria-labelledby="why-us-heading"
//         className="relative py-24 md:py-32 overflow-hidden"
//         style={{
//           background:
//             "linear-gradient(160deg,#FDF7F2 0%,#F2D9C3 60%,#EDD0B5 100%)",
//         }}
//       >
//         <div
//           aria-hidden="true"
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage: "radial-gradient(#7A3D2A 1.5px,transparent 1.5px)",
//             backgroundSize: "30px 30px",
//           }}
//         />
//         <div
//           aria-hidden="true"
//           className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent "
//         />
//         <div
//           aria-hidden="true"
//           className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
//         />
//         <div
//           aria-hidden="true"
//           className="absolute left-6 md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/18 to-transparent hidden lg:block"
//         />
//         <div
//           aria-hidden="true"
//           className="absolute right-6 md:right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/18 to-transparent hidden lg:block"
//         />

//         {/* watermark */}
//         <div
//           aria-hidden="true"
//           className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
//         >
//           <span
//             className="font-display font-bold text-[#7A3D2A]/[0.025] tracking-[-0.04em] leading-none"
//             style={{ fontSize: "clamp(8rem,18vw,18rem)" }}
//           >
//             WHY US
//           </span>
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16 md:mb-20">
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
//               Why Choose SANWARIYAS?{" "}
//             </p>

//             <h2
//               id="why-us-heading"
//               className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-sm font-bold"
//             >
//               <span className="text-[#7A3D2A]">
//                 Why Choose SANWARIYAS as Your Wholesale
//               </span>
//               <br />
//               <span
//                 className="italic bg-gradient-to-r from-[#7A3D2A] via-[#D8956B] via-[#BE6E5B] to-[#7A3D2A] bg-clip-text text-transparent bg-[length:200%_auto]"
//                 style={{ animation: "wuGradientShift 6s ease-in-out infinite" }}
//               >
//                 Ethnic Wear Manufacturer?
//               </span>
//               <style>{`
//                 @keyframes wuGradientShift {
//                   0%, 100% { background-position: 0% center; }
//                   50% { background-position: 100% center; }
//                 }
//                 @media (prefers-reduced-motion: reduce) {
//                   h2 span[style] { animation: none !important; }
//                 }
//               `}</style>
//             </h2>

//             <div
//               aria-hidden="true"
//               className="flex items-center justify-center gap-4 mt-6"
//             >
//               <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//               <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
//               <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//             </div>
//             <p className="font-serif italic text-[#a07f61] mt-6 md:mt-8 text-sm md:text-lg max-w-2xl mx-auto font-medium">
//               Six reasons boutiques, retailers and fashion brands choose
//               SANWARIYAS as their trusted wholesale ethnic wear manufacturer in
//               Jaipur.
//             </p>
//           </div>

//           <ul
//             aria-label="Why choose Sanwariyas"
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 list-none p-0 m-0"
//           >
//             {USP_ITEMS.map((item) => (
//               <li key={item.number}>
//                 <article className="group relative h-full flex flex-col gap-5 p-7 md:p-8 rounded-2xl border border-[#BE6E5B]/20 bg-white/65 backdrop-blur-sm shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(122,61,42,0.14)] hover:border-[#BE6E5B]/55 hover:bg-white/90 overflow-hidden">
//                   {/* top accent bar on hover */}
//                   <div
//                     aria-hidden="true"
//                     className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#7A3D2A] via-[#BE6E5B] to-[#a07f61] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                   />

//                   {/* watermark number */}
//                   <span
//                     aria-hidden="true"
//                     className="absolute top-4 right-5 font-sans text-6xl font-black leading-none text-[#7A3D2A]/[0.05] select-none pointer-events-none group-hover:text-[#BE6E5B]/[0.08] transition-colors duration-500"
//                   >
//                     {item.number}
//                   </span>

//                   {/* icon ring */}
//                   <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#BE6E5B]/25 bg-[#BE6E5B]/[0.07] group-hover:bg-[#BE6E5B]/[0.14] group-hover:border-[#BE6E5B]/50 transition-all duration-400 group-hover:scale-110">
//                     {item.icon}
//                   </div>

//                   {/* accent line — expands on hover */}
//                   <div
//                     aria-hidden="true"
//                     className="h-px w-8 bg-gradient-to-r from-[#BE6E5B] to-transparent group-hover:w-16 transition-all duration-500 rounded-full"
//                   />

//                   <div>
//                     <h3 className="font-display text-xl md:text-2xl text-[#7A3D2A] font-bold mb-3 leading-snug group-hover:text-[#BE6E5B] transition-colors duration-400">
//                       {item.title}
//                     </h3>
//                     <p className="font-sans text-sm md:text-[14.5px] text-[#a07f61] leading-relaxed">
//                       {item.desc}
//                     </p>
//                   </div>
//                 </article>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>
//     </>
//   );
// }

// FILE: client/src/components/home/WhyUsSection.js

const USP_ITEMS = [
  {
    number: "01",

    title: "Flexible MOQ",
    desc: "Ready stock orders start from just 2–3 sets, while custom manufacturing begins from 120–150 pieces per design and color—ideal for retailers, wholesalers, boutiques, and private label brands.",

    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        fill="none"
        className="w-7 h-7"
        stroke="#BE6E5B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="6" y="12" width="10" height="20" rx="2" />
        <rect x="15" y="8" width="10" height="24" rx="2" />
        <rect x="24" y="16" width="10" height="16" rx="2" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Export-Grade Quality Control",
    desc: "Every piece passes a 4-step QC — fabric check, stitching inspection, color-fastness test, and a final finishing review before dispatch.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        fill="none"
        className="w-7 h-7"
        stroke="#BE6E5B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="20" cy="20" r="13" />
        <path d="M13 20.5 L17.5 25 L27 15" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Direct from Manufacturer",
    desc: "No middlemen. We manufacture in Jaipur and ship directly — factory-direct wholesale pricing, faster lead times, and full visibility over every order.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        fill="none"
        className="w-7 h-7"
        stroke="#BE6E5B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 28 L8 16 L20 8 L32 16 L32 28" />
        <rect x="15" y="20" width="10" height="8" rx="1" />
        <path d="M8 28 L32 28" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "2500 New Designs Every Season",
    desc: "Our in-house team launches new wholesale kurti, cotton suit and co-ord set collections every season, helping boutiques stay ahead of fashion trends.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        fill="none"
        className="w-7 h-7"
        stroke="#BE6E5B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="20" cy="20" r="6" />
        <path d="M20 6 L20 10 M20 30 L20 34 M6 20 L10 20 M30 20 L34 20" />
        <path d="M10.1 10.1 L13 13 M27 27 L29.9 29.9 M29.9 10.1 L27 13 M13 27 L10.1 29.9" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Worldwide Export & Fast Dispatch",
    desc: "We export wholesale ethnic wear to over 50 countries with fully insured, trackable shipments and fast dispatch.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        fill="none"
        className="w-7 h-7"
        stroke="#BE6E5B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="20" cy="20" r="13" />
        <path d="M7 20 Q13 14 20 20 Q27 26 33 20" />
        <path d="M20 7 Q14 13 20 20 Q26 27 20 33" />
      </svg>
    ),
  },
  {
    number: "06",

    title: "Brand Building Partner",
    desc: "We help wholesalers, retailers, boutiques, and private label brands create exclusive ethnic wear collections with complete manufacturing and branding support.",

    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        fill="none"
        className="w-7 h-7"
        stroke="#BE6E5B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 28 L16 16 L28 12 L24 24 Z" />
        <circle cx="20" cy="20" r="3" />
        <path d="M8 8 L14 14 M32 8 L26 14 M8 32 L14 26 M32 32 L26 26" />
      </svg>
    ),
  },
];

export default function WhyUsSection() {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Why Choose SANWARIYAS",
            itemListElement: USP_ITEMS.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.title,
              description: item.desc,
            })),
          }),
        }}
      />

      <section
        aria-labelledby="why-us-heading"
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg,#FDF7F2 0%,#F2D9C3 60%,#EDD0B5 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#7A3D2A 1.5px,transparent 1.5px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent "
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute left-6 md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/18 to-transparent hidden lg:block"
        />
        <div
          aria-hidden="true"
          className="absolute right-6 md:right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/18 to-transparent hidden lg:block"
        />

        {/* watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span
            className="font-display font-bold text-[#7A3D2A]/[0.025] tracking-[-0.04em] leading-none"
            style={{ fontSize: "clamp(8rem,18vw,18rem)" }}
          >
            WHY US
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
              Why Choose SANWARIYAS?{" "}
            </p>

            <h2
              id="why-us-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-sm font-bold"
            >
              <span className="text-[#7A3D2A]">
                Why Choose SANWARIYAS as Your Wholesale
              </span>
              <br />
              <span
                className="italic bg-gradient-to-r from-[#7A3D2A] via-[#D8956B] via-[#BE6E5B] to-[#7A3D2A] bg-clip-text text-transparent bg-[length:200%_auto]"
                style={{ animation: "wuGradientShift 6s ease-in-out infinite" }}
              >
                Ethnic Wear Manufacturer?
              </span>
              <style>{`
                @keyframes wuGradientShift {
                  0%, 100% { background-position: 0% center; }
                  50% { background-position: 100% center; }
                }
                @media (prefers-reduced-motion: reduce) {
                  h2 span[style] { animation: none !important; }
                }
              `}</style>
            </h2>

            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-4 mt-6"
            >
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>
            <p className="font-serif italic text-[#a07f61] mt-6 md:mt-8 text-sm md:text-lg max-w-2xl mx-auto font-medium">
              Six reasons boutiques, retailers and fashion brands choose
              SANWARIYAS as their trusted wholesale ethnic wear manufacturer in
              Jaipur.
            </p>
          </div>

          <style>{`
            @property --wu-angle {
              syntax: "<angle>";
              initial-value: 0deg;
              inherits: false;
            }
            @keyframes wuSpin { to { --wu-angle: 360deg; } }
            @keyframes wuRise {
              from { opacity: 0; transform: translateY(40px) scale(0.97); }
              to   { opacity: 1; transform: none; }
            }

            .wu-grid { perspective: 1400px; }

            .wu-card {
              position: relative;
              isolation: isolate;
              height: 100%;
              display: flex;
              flex-direction: column;
              gap: 22px;
              padding: 34px 30px 30px;
              border-radius: 26px;
              overflow: hidden;
              background: linear-gradient(150deg, rgba(255,255,255,0.88) 0%, rgba(255,246,238,0.62) 100%);
              border: 1px solid rgba(190,110,91,0.18);
              box-shadow: 0 6px 22px rgba(122,61,42,0.06);
              backdrop-filter: blur(6px);
              transition: transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s ease, border-color 0.6s ease;
            }
            /* rotating gradient border */
            .wu-card::before {
              content: "";
              position: absolute;
              inset: 0;
              z-index: 3;
              padding: 1.5px;
              border-radius: inherit;
              background: conic-gradient(from var(--wu-angle), transparent 0 55%, #BE6E5B 72%, #E8D5A3 86%, #BE6E5B 94%, transparent 100%);
              -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
              -webkit-mask-composite: xor;
              mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
              opacity: 0;
              transition: opacity 0.5s ease;
              pointer-events: none;
            }
            /* light sweep */
            .wu-card::after {
              content: "";
              position: absolute;
              top: -50%;
              left: -70%;
              width: 40%;
              height: 200%;
              z-index: 2;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);
              transform: rotate(18deg) translateX(0);
              opacity: 0;
              pointer-events: none;
            }
            .wu-glow {
              position: absolute;
              inset: 0;
              z-index: -1;
              background: radial-gradient(circle at 100% 0%, rgba(190,110,91,0.20), transparent 55%);
              opacity: 0;
              transition: opacity 0.6s ease;
            }

            .wu-num {
              position: absolute;
              top: 16px;
              right: 22px;
              font-family: var(--font-playfair), Georgia, serif;
              font-size: 64px;
              line-height: 1;
              color: transparent;
              -webkit-text-stroke: 1px rgba(190,110,91,0.32);
              transition: transform 0.6s cubic-bezier(0.22,1,0.36,1), -webkit-text-stroke-color 0.5s ease;
              pointer-events: none;
              user-select: none;
            }

            .wu-icon {
              position: relative;
              width: 60px;
              height: 60px;
              border-radius: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(140deg, #7A3D2A 0%, #BE6E5B 100%);
              box-shadow: 0 10px 22px rgba(122,61,42,0.28);
              transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1), border-radius 0.6s ease;
            }
            .wu-icon svg { stroke: #fff; }
            .wu-icon::after {
              content: "";
              position: absolute;
              inset: -6px;
              border-radius: 22px;
              border: 1px dashed rgba(190,110,91,0.45);
              opacity: 0;
              transform: scale(0.85);
              transition: opacity 0.5s ease, transform 0.6s ease;
            }

            .wu-bar {
              position: absolute;
              left: 0;
              bottom: 0;
              height: 3px;
              width: 0;
              background: linear-gradient(90deg, #7A3D2A, #BE6E5B, #E8D5A3);
              transition: width 0.8s cubic-bezier(0.22,1,0.36,1);
            }

            @media (hover: hover) {
              .wu-card:hover {
                transform: translateY(-12px) rotateX(3deg);
                border-color: transparent;
                box-shadow: 0 34px 70px rgba(122,61,42,0.20);
              }
              .wu-card:hover::before { opacity: 1; animation: wuSpin 4s linear infinite; }
              .wu-card:hover::after { opacity: 1; transform: rotate(18deg) translateX(520%); transition: transform 1.1s ease, opacity 0.3s ease; }
              .wu-card:hover .wu-glow { opacity: 1; }
              .wu-card:hover .wu-num { transform: translateY(-6px); -webkit-text-stroke-color: rgba(190,110,91,0.7); }
              .wu-card:hover .wu-icon { transform: rotate(-8deg) scale(1.1); border-radius: 50%; }
              .wu-card:hover .wu-icon::after { opacity: 1; transform: scale(1); }
              .wu-card:hover .wu-bar { width: 100%; }
            }

            /* scroll-in reveal (browsers that support scroll-driven animations) */
            @supports (animation-timeline: view()) {
              .wu-item {
                animation: wuRise linear both;
                animation-timeline: view();
                animation-range: entry 0% entry 45%;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .wu-item { animation: none !important; }
              .wu-card, .wu-card:hover { transform: none !important; transition: none; }
              .wu-card::before, .wu-card::after { animation: none !important; }
            }
          `}</style>

          <ul
            aria-label="Why choose Sanwariyas"
            className="wu-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 list-none p-0 m-0"
          >
            {USP_ITEMS.map((item) => (
              <li key={item.number} className="wu-item">
                <article className="wu-card group">
                  <div aria-hidden="true" className="wu-glow" />
                  <span aria-hidden="true" className="wu-num">
                    {item.number}
                  </span>

                  <div className="wu-icon">{item.icon}</div>

                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-[#7A3D2A] font-semibold mb-3 leading-snug transition-colors duration-500 group-hover:text-[#BE6E5B]">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm md:text-[14.5px] text-[#8a6a50] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <span aria-hidden="true" className="wu-bar" />
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
