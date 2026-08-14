// // FILE: client/src/components/home/TrustBadges.js

// const BADGES = [
//   {
//     label: "Export-Grade Quality",
//     sub: "4-Step Quality Inspection",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="16" cy="16" r="11" />
//         <path d="M10 16.5 L14 20.5 L22 12" />
//       </svg>
//     ),
//   },
//   {
//     label: "Factory-Direct Supply",
//     sub: "No Middlemen, Better Pricing",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M6 24 L6 14 L16 7 L26 14 L26 24" />
//         <rect x="12" y="17" width="8" height="7" rx="1" />
//         <path d="M6 24 L26 24" />
//       </svg>
//     ),
//   },
//   {
//     label: "Flexible MOQ",
//     sub: "Ready: 2–3 Sets • Custom: 120–150 pcs",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <rect x="5" y="10" width="8" height="14" rx="1.5" />
//         <rect x="12" y="7" width="8" height="17" rx="1.5" />
//         <rect x="19" y="13" width="8" height="11" rx="1.5" />
//       </svg>
//     ),
//   },
//   {
//     label: "Worldwide Shipping",
//     sub: "Serving 50+ Countries",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="16" cy="16" r="11" />
//         <path d="M5 16 Q10 11 16 16 Q22 21 27 16" />
//         <path d="M16 5 Q11 11 16 16 Q21 21 16 27" />
//       </svg>
//     ),
//   },
//   {
//     label: "24–48 Hour Response",
//     sub: "Dedicated Export Assistance",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="16" cy="16" r="11" />
//         <path d="M16 9 L16 16 L21 20" />
//       </svg>
//     ),
//   },
//   {
//     label: "Secure & Trusted",
//     sub: "Business Data Protected",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-7 h-7"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M16 4 L26 8 L26 17 C26 22 21 26.5 16 28 C11 26.5 6 22 6 17 L6 8 Z" />
//         <path d="M11 16.5 L14.5 20 L21 13" />
//       </svg>
//     ),
//   },
// ];

// export default function TrustBadges() {
//   return (
//     <>
//       {/*  SEO FIX: Injected ItemList Schema to explicitly define B2B value propositions to search engines */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "ItemList",
//             name: "Why Choose SANWARIYAS - Wholesale Ethnic Wear Manufacturer",
//             description:
//               "Key B2B manufacturing and export benefits including low MOQ, worldwide shipping, and factory-direct pricing.",
//             itemListElement: BADGES.map((badge, index) => ({
//               "@type": "ListItem",
//               position: index + 1,
//               name: badge.label,
//               description: badge.sub,
//             })),
//           }),
//         }}
//       />
//       <section
//         aria-labelledby="trust-heading"
//         className="relative overflow-hidden py-20 md:py-28"
//         style={{
//           background:
//             "linear-gradient(160deg,#FDF7F2 0%,#F5E8D8 50%,#F2D9C3 100%)",
//         }}
//       >
//         {/* Top / bottom rules */}
//         <div
//           aria-hidden="true"
//           className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
//         />
//         <div
//           aria-hidden="true"
//           className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
//         />

//         {/* Dot grid — consistent with CategoriesSection */}
//         <div
//           aria-hidden="true"
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage: "radial-gradient(#7A3D2A 1.8px,transparent 1.8px)",
//             backgroundSize: "30px 30px",
//           }}
//         />

//         {/* Radial glow accents */}
//         <div
//           aria-hidden="true"
//           className="absolute inset-0 opacity-[0.05]"
//           style={{
//             backgroundImage: `
//               radial-gradient(circle at 12% 20%, #BE6E5B 0%, transparent 30%),
//               radial-gradient(circle at 88% 78%, #BE6E5B 0%, transparent 30%)
//             `,
//           }}
//         />

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Heading — consistent with all other sections */}
//           <div className="text-center mb-12 md:mb-16">
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
//               Why Retailers and Wholesalers Trust Us{" "}
//             </p>
//             <h2
//               id="trust-heading"
//               className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold"
//             >
//               Trusted Manufacturing &amp; Export Excellence
//               {/*  SEO FIX: Visually hidden core entity modifiers for Topical Authority */}
//               <span className="sr-only">
//                 {" "}
//                 - Jaipur Ethnic Wear Manufacturer
//               </span>
//             </h2>

//             <div
//               aria-hidden="true"
//               className="flex items-center justify-center gap-4 mt-6"
//             >
//               <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//               <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
//               <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//             </div>

//             <p className="max-w-3xl mx-auto text-[#a07f61] text-base md:text-lg leading-relaxed mt-6 font-serif italic font-medium">
//               SANWARIYAS is a trusted ethnic wear manufacturer serving
//               wholesalers, distributors, retailers, boutiques, private label
//               brands, and international buyers with premium in-house designed
//               and manufactured ethnic wear collections, flexible MOQs,
//               export-grade quality standards, and dependable long-term business
//               partnerships.
//             </p>
//           </div>

//           {/*  SEMANTIC: Unordered list */}
//           {/*  SEO FIX: Added Aria-Label for semantic screen-reader context */}
//           <ul
//             aria-label="Wholesale Manufacturing Trust Signals"
//             className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 lg:gap-6 list-none p-0 m-0"
//           >
//             {BADGES.map((badge, index) => (
//               <li
//                 key={badge.label}
//                 className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-[#BE6E5B]/20 px-5 py-7 text-center shadow-[0_12px_40px_rgba(122,61,42,0.08)] hover:shadow-[0_24px_56px_rgba(122,61,42,0.18)] hover:-translate-y-2 hover:border-[#BE6E5B]/50 hover:bg-white transition-all duration-500 h-full"
//               >
//                 {/* Top accent bar on hover */}
//                 <div
//                   aria-hidden="true"
//                   className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7A3D2A] via-[#BE6E5B] to-[#7A3D2A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                 />

//                 {/* Hover bg wash */}
//                 <div
//                   aria-hidden="true"
//                   className="absolute inset-0 bg-gradient-to-b from-[#BE6E5B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                 />

//                 {/* Icon circle */}
//                 <div className="relative z-10 w-16 h-16 mx-auto mb-5 rounded-full bg-[#FDF7F2] border border-[#BE6E5B]/20 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-[#BE6E5B]/45 transition-all duration-500">
//                   {badge.icon}
//                 </div>

//                 <h3
//                   className="
//                   relative z-10
//                   font-sans
//                   text-[11px]
//                   uppercase
//                   tracking-[0.22em]
//                   font-bold
//                   text-[#5C3120]
//                   leading-snug
//                   min-h-[64px]
//                   flex
//                   items-center
//                   justify-center
//                   text-center
//                   "
//                 >
//                   {badge.label}
//                 </h3>

//                 <div
//                   aria-hidden="true"
//                   className="h-px w-8 bg-gradient-to-r from-transparent via-[#BE6E5B]/45 to-transparent mx-auto my-4"
//                 />

//                 <p className="relative z-10 text-[12px] text-[#a07f61] leading-relaxed">
//                   {badge.sub}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>
//     </>
//   );
// }




// second  code    




// FILE: client/src/components/home/TrustBadges.js


// "use client";

// import { useState, useEffect } from "react";

// const BADGES = [
//   {
//     label: "Export-Grade Quality",
//     sub: "4-Step Quality Inspection",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-8 h-8 md:w-10 md:h-10"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="16" cy="16" r="11" />
//         <path d="M10 16.5 L14 20.5 L22 12" />
//       </svg>
//     ),
//   },
//   {
//     label: "Factory-Direct Supply",
//     sub: "No Middlemen, Better Pricing",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-8 h-8 md:w-10 md:h-10"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M6 24 L6 14 L16 7 L26 14 L26 24" />
//         <rect x="12" y="17" width="8" height="7" rx="1" />
//         <path d="M6 24 L26 24" />
//       </svg>
//     ),
//   },
//   {
//     label: "Flexible MOQ",
//     sub: "Ready: 2–3 Sets • Custom: 120–150 pcs",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-8 h-8 md:w-10 md:h-10"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <rect x="5" y="10" width="8" height="14" rx="1.5" />
//         <rect x="12" y="7" width="8" height="17" rx="1.5" />
//         <rect x="19" y="13" width="8" height="11" rx="1.5" />
//       </svg>
//     ),
//   },
//   {
//     label: "Worldwide Shipping",
//     sub: "Serving 50+ Countries",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-8 h-8 md:w-10 md:h-10"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="16" cy="16" r="11" />
//         <path d="M5 16 Q10 11 16 16 Q22 21 27 16" />
//         <path d="M16 5 Q11 11 16 16 Q21 21 16 27" />
//       </svg>
//     ),
//   },
//   {
//     label: "24–48 Hour Response",
//     sub: "Dedicated Export Assistance",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-8 h-8 md:w-10 md:h-10"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="16" cy="16" r="11" />
//         <path d="M16 9 L16 16 L21 20" />
//       </svg>
//     ),
//   },
//   {
//     label: "Secure & Trusted",
//     sub: "Business Data Protected",
//     icon: (
//       <svg
//         aria-hidden="true"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="w-8 h-8 md:w-10 md:h-10"
//         stroke="#7A3D2A"
//         strokeWidth="1.5"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M16 4 L26 8 L26 17 C26 22 21 26.5 16 28 C11 26.5 6 22 6 17 L6 8 Z" />
//         <path d="M11 16.5 L14.5 20 L21 13" />
//       </svg>
//     ),
//   },
// ];

// //  UPDATED STYLES: Smaller Cards & Tighter Spacing
// const STYLES = `
//   .radial-card-wrapper {
//     position: absolute;
//     left: 50%;
//     top: 0;
//     width: 240px;
//     height: 280px;
//     transition: all 0.6s cubic-bezier(0.34, 1.3, 0.64, 1);
//     transform-origin: center bottom;
//   }

//   @media (min-width: 768px) {
//     .radial-card-wrapper {
//       width: 270px;
//       height: 290px;
//     }
//   }

//   /* Center Card (Active) */
//   .radial-center {
//     transform: translate(-50%, 0) rotate(0deg) scale(1);
//     opacity: 1;
//     z-index: 30;
//     pointer-events: auto;
//   }

//   /* Left Side Card */
//   .radial-left-1 {
//     transform: translate(-50%, 0) translateX(-95%) translateY(25px) rotate(-14deg) scale(0.85);
//     opacity: 0.65;
//     z-index: 20;
//     pointer-events: none;
//   }

//   /* Right Side Card */
//   .radial-right-1 {
//     transform: translate(-50%, 0) translateX(95%) translateY(25px) rotate(14deg) scale(0.85);
//     opacity: 0.65;
//     z-index: 20;
//     pointer-events: none;
//   }

//   @media (min-width: 768px) {
//     .radial-left-1 {
//       transform: translate(-50%, 0) translateX(-105%) translateY(30px) rotate(-14deg) scale(0.85);
//     }
//     .radial-right-1 {
//       transform: translate(-50%, 0) translateX(105%) translateY(30px) rotate(14deg) scale(0.85);
//     }
//   }

//   /* Hidden Left Cards */
//   .radial-hidden-left {
//     transform: translate(-50%, 0) translateX(-180%) translateY(80px) rotate(-28deg) scale(0.65);
//     opacity: 0;
//     z-index: 10;
//     pointer-events: none;
//   }

//   /* Hidden Right Cards */
//   .radial-hidden-right {
//     transform: translate(-50%, 0) translateX(180%) translateY(80px) rotate(28deg) scale(0.65);
//     opacity: 0;
//     z-index: 10;
//     pointer-events: none;
//   }
// `;

// export default function TrustBadges() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % BADGES.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev - 1 + BADGES.length) % BADGES.length);
//   };

//   useEffect(() => {
//     const timer = setInterval(() => {
//       nextSlide();
//     }, 4500);
//     return () => clearInterval(timer);
//   }, [currentIndex]);

//   const getCardPositionClass = (index) => {
//     let diff = index - currentIndex;
//     if (diff < -3) diff += BADGES.length;
//     if (diff > 2) diff -= BADGES.length;

//     //  COLOR THEME FIX: Match the exact beige/warm theme instead of pure white
//     if (diff === 0) return "radial-center shadow-[0_16px_40px_rgba(122,61,42,0.12)] bg-gradient-to-b from-[#FDF7F2] to-[#F5E8D8] border-[#BE6E5B]/40";
//     if (diff === -1) return "radial-left-1 shadow-md bg-[#F2D9C3]/60 backdrop-blur-sm border-[#BE6E5B]/20";
//     if (diff === 1) return "radial-right-1 shadow-md bg-[#F2D9C3]/60 backdrop-blur-sm border-[#BE6E5B]/20";
//     if (diff === -2 || diff === 3) return "radial-hidden-left bg-[#F2D9C3]/30";
//     return "radial-hidden-right bg-[#F2D9C3]/30"; 
//   };

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: STYLES }} />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             "@context": "https://schema.org",
//             "@type": "ItemList",
//             name: "Why Choose SANWARIYAS - Wholesale Ethnic Wear Manufacturer",
//             description:
//               "Key B2B manufacturing and export benefits including low MOQ, worldwide shipping, and factory-direct pricing.",
//             itemListElement: BADGES.map((badge, index) => ({
//               "@type": "ListItem",
//               position: index + 1,
//               name: badge.label,
//               description: badge.sub,
//             })),
//           }),
//         }}
//       />

//       {/*  REDUCED PADDING: Fits tightly in one screen */}
//       <section
//         aria-labelledby="trust-heading"
//         className="relative overflow-hidden py-14 md:py-16"
//         style={{
//           background:
//             "linear-gradient(160deg,#FDF7F2 0%,#F5E8D8 50%,#F2D9C3 100%)",
//         }}
//       >
//         <div
//           aria-hidden="true"
//           className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
//         />
//         <div
//           aria-hidden="true"
//           className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
//         />
//         <div
//           aria-hidden="true"
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage: "radial-gradient(#7A3D2A 1.8px,transparent 1.8px)",
//             backgroundSize: "30px 30px",
//           }}
//         />
//         <div
//           aria-hidden="true"
//           className="absolute inset-0 opacity-[0.05]"
//           style={{
//             backgroundImage: `
//               radial-gradient(circle at 12% 20%, #BE6E5B 0%, transparent 30%),
//               radial-gradient(circle at 88% 78%, #BE6E5B 0%, transparent 30%)
//             `,
//           }}
//         />

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
//           {/* Header - Reduced Margins */}
//           <div className="text-center mb-8 md:mb-12 w-full">
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-3">
//               Why Retailers and Wholesalers Trust Us{" "}
//             </p>
//            <h2
//               id="trust-heading"
//               className="font-display text-5xl md:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold"
//             >
//               Trusted Manufacturing &amp; Export Excellence
//               <span className="sr-only">
//                 {" "}
//                 - Jaipur Ethnic Wear Manufacturer
//               </span>
//             </h2>

//             <div
//               aria-hidden="true"
//               className="flex items-center justify-center gap-4 mt-5"
//             >
//               <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//               <span className="text-[#BE6E5B] text-base animate-pulse">✦</span>
//               <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//             </div>
            
//             <p className="max-w-3xl mx-auto text-[#a07f61] text-sm md:text-base leading-relaxed mt-4 font-serif italic font-medium">
//               SANWARIYAS is a trusted ethnic wear manufacturer serving
//               wholesalers, distributors, retailers, boutiques, private label
//               brands, and international buyers with premium in-house designed
//               and manufactured ethnic wear collections.
//             </p>
//           </div>

//           {/*  GOOGLE LABS "SPEEDOMETER" RADIAL CAROUSEL - SCALED DOWN  */}
//           <div className="relative w-full h-[300px] md:h-[310px] overflow-hidden">
//             {BADGES.map((badge, index) => (
//               <div
//                 key={badge.label}
//                 className={`radial-card-wrapper rounded-3xl border p-5 md:p-6 flex flex-col items-center justify-center text-center ${getCardPositionClass(index)}`}
//               >
//                 {/* Inner Icon Circle */}
//                 <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-5 rounded-full bg-white/50 border border-[#BE6E5B]/20 flex items-center justify-center shadow-inner">
//                   {badge.icon}
//                 </div>

//                 {/* Title */}
//                 <h3 className="font-sans text-[12px] md:text-[13px] uppercase tracking-[0.18em] font-extrabold text-[#5C3120] leading-snug mb-3">
//                   {badge.label}
//                 </h3>

//                 {/* Divider */}
//                 <div aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-transparent via-[#BE6E5B]/50 to-transparent mx-auto mb-3" />

//                 {/* Subtitle */}
//                 <p className="text-[11px] md:text-[12px] text-[#8a6a4a] leading-relaxed font-semibold px-2">
//                   {badge.sub}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Nav Arrows */}
//           <div className="flex items-center justify-center gap-6 mt-2 md:mt-4 relative z-40">
//             <button
//               onClick={prevSlide}
//               aria-label="Previous Badge"
//               className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#BE6E5B]/40 bg-white/60 backdrop-blur-sm flex items-center justify-center text-[#7A3D2A] hover:bg-[#BE6E5B] hover:text-white hover:border-[#BE6E5B] transition-all duration-300 shadow-sm"
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M15 18l-6-6 6-6" />
//               </svg>
//             </button>
//             <button
//               onClick={nextSlide}
//               aria-label="Next Badge"
//               className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#BE6E5B]/40 bg-white/60 backdrop-blur-sm flex items-center justify-center text-[#7A3D2A] hover:bg-[#BE6E5B] hover:text-white hover:border-[#BE6E5B] transition-all duration-300 shadow-sm"
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M9 18l6-6-6-6" />
//               </svg>
//             </button>
//           </div>

//         </div>
//       </section>
//     </>
//   );
// }






// third  one   



// FILE: client/src/components/home/TrustBadges.js
"use client";

import { useState, useEffect } from "react";

const BADGES = [
  {
    label: "Export-Grade Quality",
    sub: "4-Step Quality Inspection",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-8 h-8 md:w-10 md:h-10"
        stroke="#7A3D2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="16" cy="16" r="11" />
        <path d="M10 16.5 L14 20.5 L22 12" />
      </svg>
    ),
  },
  {
    label: "Factory-Direct Supply",
    sub: "No Middlemen, Better Pricing",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-8 h-8 md:w-10 md:h-10"
        stroke="#7A3D2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 24 L6 14 L16 7 L26 14 L26 24" />
        <rect x="12" y="17" width="8" height="7" rx="1" />
        <path d="M6 24 L26 24" />
      </svg>
    ),
  },
  {
    label: "Flexible MOQ",
    sub: "Ready: 2–3 Sets • Custom: 120–150 pcs",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-8 h-8 md:w-10 md:h-10"
        stroke="#7A3D2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="10" width="8" height="14" rx="1.5" />
        <rect x="12" y="7" width="8" height="17" rx="1.5" />
        <rect x="19" y="13" width="8" height="11" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Worldwide Shipping",
    sub: "Serving 50+ Countries",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-8 h-8 md:w-10 md:h-10"
        stroke="#7A3D2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="16" cy="16" r="11" />
        <path d="M5 16 Q10 11 16 16 Q22 21 27 16" />
        <path d="M16 5 Q11 11 16 16 Q21 21 16 27" />
      </svg>
    ),
  },
  {
    label: "24–48 Hour Response",
    sub: "Dedicated Export Assistance",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-8 h-8 md:w-10 md:h-10"
        stroke="#7A3D2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="16" cy="16" r="11" />
        <path d="M16 9 L16 16 L21 20" />
      </svg>
    ),
  },
  {
    label: "Secure & Trusted",
    sub: "Business Data Protected",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-8 h-8 md:w-10 md:h-10"
        stroke="#7A3D2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 4 L26 8 L26 17 C26 22 21 26.5 16 28 C11 26.5 6 22 6 17 L6 8 Z" />
        <path d="M11 16.5 L14.5 20 L21 13" />
      </svg>
    ),
  },
];

// UPDATED STYLES: Now showing 5 cards (Center + 2 Left + 2 Right)
const STYLES = `
  .radial-card-wrapper {
    position: absolute;
    left: 50%;
    top: 0;
    width: 220px;
    height: 260px;
    transition: all 0.6s cubic-bezier(0.34, 1.3, 0.64, 1);
    transform-origin: center bottom;
  }

  @media (min-width: 768px) {
    .radial-card-wrapper {
      width: 250px;
      height: 280px;
    }
  }

  /* Center Card (Active) */
  .radial-center {
    transform: translate(-50%, 0) rotate(0deg) scale(1);
    opacity: 1;
    z-index: 30;
    pointer-events: auto;
  }

  /* First Level Side Cards (Visible) */
  .radial-left-1 {
    transform: translate(-50%, 0) translateX(-85%) translateY(20px) rotate(-10deg) scale(0.85);
    opacity: 0.75;
    z-index: 20;
    pointer-events: none;
  }
  .radial-right-1 {
    transform: translate(-50%, 0) translateX(85%) translateY(20px) rotate(10deg) scale(0.85);
    opacity: 0.75;
    z-index: 20;
    pointer-events: none;
  }

  /* Second Level Side Cards (Visible but smaller) */
  .radial-left-2 {
    transform: translate(-50%, 0) translateX(-155%) translateY(65px) rotate(-20deg) scale(0.7);
    opacity: 0.4;
    z-index: 10;
    pointer-events: none;
  }
  .radial-right-2 {
    transform: translate(-50%, 0) translateX(155%) translateY(65px) rotate(20deg) scale(0.7);
    opacity: 0.4;
    z-index: 10;
    pointer-events: none;
  }

  @media (min-width: 768px) {
    .radial-left-1 { transform: translate(-50%, 0) translateX(-95%) translateY(25px) rotate(-10deg) scale(0.85); }
    .radial-right-1 { transform: translate(-50%, 0) translateX(95%) translateY(25px) rotate(10deg) scale(0.85); }
    .radial-left-2 { transform: translate(-50%, 0) translateX(-175%) translateY(80px) rotate(-20deg) scale(0.7); }
    .radial-right-2 { transform: translate(-50%, 0) translateX(175%) translateY(80px) rotate(20deg) scale(0.7); }
  }

  /* Hidden Cards (Out of view) */
  .radial-hidden-left-out {
    transform: translate(-50%, 0) translateX(-220%) translateY(120px) rotate(-30deg) scale(0.5);
    opacity: 0;
    z-index: 0;
    pointer-events: none;
  }
  .radial-hidden-right-out {
    transform: translate(-50%, 0) translateX(220%) translateY(120px) rotate(30deg) scale(0.5);
    opacity: 0;
    z-index: 0;
    pointer-events: none;
  }
`;

export default function TrustBadges() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % BADGES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + BADGES.length) % BADGES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const getCardPositionClass = (index) => {
    let diff = index - currentIndex;
    const total = BADGES.length;

    // Logic to wrap around the carousel smoothly for 6 items
    if (diff < -2) diff += total;
    if (diff > 3) diff -= total;

    if (diff === 0) return "radial-center shadow-[0_16px_40px_rgba(122,61,42,0.12)] bg-gradient-to-b from-[#FDF7F2] to-[#F5E8D8] border-[#BE6E5B]/40";
    if (diff === -1) return "radial-left-1 shadow-md bg-[#F2D9C3]/60 backdrop-blur-sm border-[#BE6E5B]/20";
    if (diff === 1) return "radial-right-1 shadow-md bg-[#F2D9C3]/60 backdrop-blur-sm border-[#BE6E5B]/20";
    if (diff === -2) return "radial-left-2 shadow-sm bg-[#F2D9C3]/40 backdrop-blur-sm border-[#BE6E5B]/10";
    
    // ✅ FIX APPLIED HERE: Separated diff === 2 and diff === 3 to hide the 6th card properly
    if (diff === 2) return "radial-right-2 shadow-sm bg-[#F2D9C3]/40 backdrop-blur-sm border-[#BE6E5B]/10";
    if (diff === 3) return "radial-hidden-right-out bg-[#F2D9C3]/20"; 
    
    // Fallback for hidden
    if (diff < -2) return "radial-hidden-left-out bg-[#F2D9C3]/20";
    return "radial-hidden-right-out bg-[#F2D9C3]/20"; 
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Why Choose SANWARIYAS - Wholesale Ethnic Wear Manufacturer",
            description:
              "Key B2B manufacturing and export benefits including low MOQ, worldwide shipping, and factory-direct pricing.",
            itemListElement: BADGES.map((badge, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: badge.label,
              description: badge.sub,
            })),
          }),
        }}
      />

      <section
        aria-labelledby="trust-heading"
        className="relative overflow-hidden py-14 md:py-16"
        style={{
          background:
            "linear-gradient(160deg,#FDF7F2 0%,#F5E8D8 50%,#F2D9C3 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#7A3D2A 1.8px,transparent 1.8px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 12% 20%, #BE6E5B 0%, transparent 30%),
              radial-gradient(circle at 88% 78%, #BE6E5B 0%, transparent 30%)
            `,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center mb-8 md:mb-12 w-full">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-3">
              Why Retailers and Wholesalers Trust Us{" "}
            </p>
            <h2
              id="trust-heading"
              className="font-display text-5xl md:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold"
            >
              Trusted Manufacturing &amp; Export Excellence
              <span className="sr-only">
                {" "}
                - Jaipur Ethnic Wear Manufacturer
              </span>
            </h2>

            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-4 mt-5"
            >
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-base animate-pulse">✦</span>
              <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>
            
            <p className="max-w-3xl mx-auto text-[#a07f61] text-sm md:text-base leading-relaxed mt-4 font-serif italic font-medium">
              SANWARIYAS is a trusted ethnic wear manufacturer serving
              wholesalers, distributors, retailers, boutiques, private label
              brands, and international buyers with premium in-house designed
              and manufactured ethnic wear collections.
            </p>
          </div>

          {/* 🚀 GOOGLE LABS "SPEEDOMETER" RADIAL CAROUSEL (5 CARDS VISIBLE) 🚀 */}
          <div className="relative w-full h-[280px] md:h-[310px] overflow-hidden">
            {BADGES.map((badge, index) => (
              <div
                key={badge.label}
                className={`radial-card-wrapper rounded-3xl border p-4 md:p-6 flex flex-col items-center justify-center text-center ${getCardPositionClass(index)}`}
              >
                {/* Inner Icon Circle */}
                <div className="relative z-10 w-14 h-14 md:w-20 md:h-20 mx-auto mb-3 md:mb-5 rounded-full bg-white/50 border border-[#BE6E5B]/20 flex items-center justify-center shadow-inner">
                  {badge.icon}
                </div>

                {/* Title */}
                <h3 className="font-sans text-[11px] md:text-[13px] uppercase tracking-[0.18em] font-extrabold text-[#5C3120] leading-snug mb-3">
                  {badge.label}
                </h3>

                {/* Divider */}
                <div aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-transparent via-[#BE6E5B]/50 to-transparent mx-auto mb-3" />

                {/* Subtitle */}
                <p className="text-[10px] md:text-[12px] text-[#8a6a4a] leading-relaxed font-semibold px-2">
                  {badge.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Nav Arrows */}
          <div className="flex items-center justify-center gap-6 mt-2 md:mt-4 relative z-40">
            <button
              onClick={prevSlide}
              aria-label="Previous Badge"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#BE6E5B]/40 bg-white/60 backdrop-blur-sm flex items-center justify-center text-[#7A3D2A] hover:bg-[#BE6E5B] hover:text-white hover:border-[#BE6E5B] transition-all duration-300 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Badge"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#BE6E5B]/40 bg-white/60 backdrop-blur-sm flex items-center justify-center text-[#7A3D2A] hover:bg-[#BE6E5B] hover:text-white hover:border-[#BE6E5B] transition-all duration-300 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

        </div>
      </section>
    </>
  );
}