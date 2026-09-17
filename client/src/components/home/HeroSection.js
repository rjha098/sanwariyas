// // FILE: client/src/components/home/HeroSection.js

// "use client";
// import { useState, useEffect, useCallback, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";

// //  SEO FIX: Mapped imgAlt tags to exact-match Top 10 Priority B2B Manufacturer & Supplier keywords
// const slides = [
//   {
//     id: 1,
//     title: ["Global Wholesale", "Regal Heritage"],
//     sub: "India's premier export house for high-end ethnic wear. Discover the pinnacle of pure cotton suits and kurti craftsmanship.",
//     img: "/images/ROLARIMAGES.png",
//     imgAlt:
//       "Wholesale Ethnic Wear Supplier India - Sanwariyas Premium Cotton Ethnic Wear Manufacturer",
//     bg: "radial-gradient(ellipse at 90% 10%, #F2D9C3 0%, #F2D9C3 25%, #E0BFA2 60%, #C9A485 100%)",
//     accentGold: "#8B6508",
//     accentLight: "#F5E6CC",
//     badge: "Export House",
//     imgScale: 1,
//   },
//   {
//     id: 2,
//     title: ["Exquisite Craftsmanship", "A-Line Masterpieces"],
//     sub: "Flawlessly stitched A-Line suits crafted for elegance. Experience the perfect blend of comfort and pure luxury in every thread.",
//     img: "/images/suits/A-Line/a-line.png",
//     imgAlt:
//       "Cotton Suit Manufacturer Jaipur - Premium Pure Cotton A-Line Suits",
//     bg: "linear-gradient(145deg, #F2D9C3 0%, #F2D9C3 30%, #E0BFA2 55%, #B8996E 100%)",
//     accentGold: "#996515",
//     accentLight: "#F8EDD5",
//     badge: "A-Line Suits",
//     imgScale: 1.22,
//   },
//   {
//     id: 3,
//     title: ["Timeless Grace", "Designer Anarkalis"],
//     sub: "Redefining the standard of ethnic fashion. Beautifully flared Anarkali suits tailored with breathable fabrics for the modern woman.",
//     img: "/images/suits/Anarkali/anarkali1.png",
//     imgAlt:
//       "Indian Ethnic Wear Manufacturer - Designer Pure Cotton Anarkali Suits",
//     bg: "linear-gradient(180deg, #F2D9C3 0%, #EDD0B5 15%, #E0BFA2 45%, #C4A07A 100%)",
//     accentGold: "#6B4226",
//     accentLight: "#F3DCC8",
//     badge: "Anarkali Collection",
//     imgScale: 0.9,
//   },
//   {
//     id: 4,
//     title: ["Modern Silhouettes", "Chic Cord Sets"],
//     sub: "Directly sourced from India's master weavers. Trendy, highly demanded, and comfortable cotton Cord sets for everyday luxury.",
//     img: "/images/suits/cordset/co-ordsets.png",
//     imgAlt: "B2B Ethnic Wear Supplier - Trendy Cotton Co-ord Sets Manufacturer",
//     bg: "radial-gradient(circle at 40% 60%, #F2D9C3 0%, #EDD4B8 30%, #E0BFA2 55%, #BEA07A 100%)",
//     accentGold: "#8B6508",
//     accentLight: "#F5E6CC",
//     badge: "Co-ord Sets",
//     imgScale: 1.22,
//   },
//   {
//     id: 5,
//     title: ["Everyday Elegance", "Premium Short Kurtis"],
//     sub: "Versatile and stylish short kurtis at wholesale rates. We ensure perfect fits, breathable fabrics, and vibrant long-lasting prints.",
//     img: "/images/suits/short-Kurtis/short-kurtis.png",
//     imgAlt: "Wholesale Kurti Supplier India - Premium Cotton Short Kurtis",
//     bg: "linear-gradient(0deg, #F2D9C3 0%, #EAC9A8 20%, #E0BFA2 50%, #C2956A 100%)",
//     accentGold: "#6B4226",
//     accentLight: "#F3DCC8",
//     badge: "Short Kurtis",
//     imgScale: 1.22,
//   },
//   {
//     id: 6,
//     title: ["Complete Elegance", "Straight 3-Piece Suits"],
//     sub: "Classic straight-cut 3-piece suits featuring exquisite dupattas. Fully insured, securely packaged, and exported worldwide.",
//     img: "/images/suits/Straight3piece/3-piece-suit.png",
//     imgAlt:
//       "Ladies Cotton Suit Manufacturer - Straight 3-Piece Cotton Suits Export",
//     bg: "linear-gradient(90deg, #C4A07A 0%, #E0BFA2 40%, #EDD0B5 65%, #F2D9C3 100%)",
//     accentGold: "#996515",
//     accentLight: "#F8EDD5",
//     badge: "3-Piece Suits",
//     imgScale: 1.22,
//   },
//   {
//     id: 7,
//     title: ["Graceful Lengths", "Classic Long Kurtis"],
//     sub: "Elegant long kurtis perfect for retail scaling. Partner with India's most trusted export empire for your bulk requirements.",
//     img: "/images/suits/LongKurtis/long-kurtis.png",
//     imgAlt: "Cotton Clothing Exporter India - Wholesale Long Kurtis",
//     bg: "linear-gradient(225deg, #F2D9C3 0%, #EAC9A8 35%, #E0BFA2 65%, #B8916A 100%)",
//     accentGold: "#8B6508",
//     accentLight: "#F5E6CC",
//     badge: "Long Kurtis",
//     imgScale: 1.22,
//   },
// ];

// const STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Jost:wght@300;400;500;600&family=Cinzel:wght@400;600;700&display=swap');

//   @keyframes fadeSlideUp {
//     from { opacity:0; transform:translateY(22px); }
//     to   { opacity:1; transform:translateY(0); }
//   }
//   @keyframes fadeSlideLeft {
//     from { opacity:0; transform:translateX(26px) scale(0.97); }
//     to   { opacity:1; transform:translateX(0) scale(1); }
//   }
//   @keyframes badgePop {
//     0%  { opacity:0; transform:translateY(-10px) scale(0.88); }
//     65% { transform:translateY(2px) scale(1.02); }
//     100%{ opacity:1; transform:translateY(0) scale(1); }
//   }
//   @keyframes slideProgress { from{width:0%} to{width:100%} }
//   @keyframes floatOrb {
//     0%,100%{ transform:translateY(0) scale(1); }
//     50%    { transform:translateY(-8px) scale(1.06); }
//   }
//   @keyframes lineGrow { from{width:0;opacity:0} to{width:52px;opacity:1} }
//   @keyframes shimmerSweep {
//     0%   { background-position: -200% center; }
//     100% { background-position:  200% center; }
//   }
//   @keyframes dotPulse {
//     0%,100%{ transform:scale(1); opacity:1; }
//     50%    { transform:scale(1.5); opacity:0.7; }
//   }
//   @keyframes orbFloat {
//     0%,100%{ transform:translate(0,0) scale(1); }
//     33%    { transform:translate(6px,-10px) scale(1.08); }
//     66%    { transform:translate(-5px,-6px) scale(0.95); }
//   }

//   @keyframes spinSlow {
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// }

// .spin-slow {
//   animation: spinSlow 32s linear infinite;
// }

//   .float-orb  { animation: orbFloat 4.5s ease-in-out infinite; }
//   .float-orb2 { animation: orbFloat 4.5s ease-in-out 2.2s infinite; }
//   .float-orb3 { animation: orbFloat 5s ease-in-out 1.1s infinite; }
//   .dot-pulse  { animation: dotPulse 2s ease-in-out infinite; }

//   .shimmer-btn { background-size: 200% auto; }
//   .shimmer-btn:hover { animation: shimmerSweep 1.4s linear infinite; }

//   .grain-layer {
//     position:absolute; inset:0; pointer-events:none; z-index:1;
//     background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");
//     opacity:0.3; mix-blend-mode:overlay;
//   }

//   .thumb-card {
//     transition: transform 0.4s cubic-bezier(0.22,1,0.36,1),
//                 opacity   0.4s ease,
//                 box-shadow 0.4s ease;
//   }
//   .thumb-card { margin: 0; }
//   .thumb-card:hover { transform: scale(1.08) translateY(-5px) !important; margin: 0 16px !important; }
//   .scrollbar-hide::-webkit-scrollbar { display:none; }
//   .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }

//   .stat-pill {
//     transition: transform 0.3s ease, box-shadow 0.3s ease;
//   }
//   .stat-pill:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 24px rgba(139,101,8,0.15);
//   }

//  .nav-btn {
//   transition: box-shadow 0.3s ease, background 0.3s ease;
// }
// .nav-btn:hover {
//   box-shadow: 0 10px 28px rgba(0,0,0,0.18);
//   background: white;
// }

//   .explore-btn {
//     transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
//   }
//   .explore-btn:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 12px 32px rgba(139,101,8,0.35);
//     filter: brightness(1.06);
//   }

//   .outline-btn {
//     transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
//   }
//   .outline-btn:hover {
//     transform: translateY(-2px);
//     background: rgba(255,255,255,0.92);
//     box-shadow: 0 8px 24px rgba(139,101,8,0.12);
//   }

//   .deco-vline {
//     position:absolute; width:1px;
//     background:linear-gradient(to bottom, transparent 0%, rgba(139,101,8,0.18) 40%, rgba(139,101,8,0.18) 60%, transparent 100%);
//   }

//   @media (min-width:1024px) {
//     .hero-section {
//       min-height: 620px;
//     }
//     .hero-main-grid {
//       flex: 1 1 auto;
//       min-height: 480px;
//     }
//     .hero-thumb-strip {
//       flex-shrink: 0;
//     }
//   }

//   @media (min-width:1024px) and (max-height: 700px) {
//     .hero-thumb-strip {
//       padding-top: 6px;
//       padding-bottom: 10px;
//     }
//     .thumb-card {
//       transform: scale(0.85) !important;
//     }
//   }
// `;

// const CornerOrnament = ({ accentGold, className = "" }) => (
//   <svg
//     aria-hidden="true"
//     width="56"
//     height="56"
//     viewBox="0 0 56 56"
//     fill="none"
//     className={className}
//   >
//     <path
//       d="M3 3 L53 3 L53 8 M3 3 L3 53 L8 53"
//       stroke={accentGold}
//       strokeWidth="1.2"
//       strokeLinecap="round"
//     />
//     <path
//       d="M12 3 L3 3 L3 12"
//       stroke={accentGold}
//       strokeWidth="0.5"
//       strokeLinecap="round"
//       opacity="0.4"
//     />
//     <circle cx="3" cy="3" r="2.5" fill={accentGold} />
//     <circle cx="53" cy="3" r="1.5" fill={accentGold} opacity="0.35" />
//     <circle cx="3" cy="53" r="1.5" fill={accentGold} opacity="0.35" />
//     <circle cx="10" cy="10" r="1" fill={accentGold} opacity="0.2" />
//   </svg>
// );

// const StatPill = ({ value, label, accentGold }) => (
//   <div
//     className="stat-pill flex flex-col items-center px-4 py-2 lg:py-3 rounded-xl"
//     style={{
//       background: `linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.45))`,
//       border: `1px solid rgba(255,255,255,0.6)`,
//       backdropFilter: "blur(16px)",
//       WebkitBackdropFilter: "blur(16px)",
//       boxShadow: `0 4px 16px rgba(139,101,8,0.08), inset 0 1px 0 rgba(255,255,255,0.8)`,
//     }}
//   >
//     <span
//       style={{
//         fontFamily: "'Cinzel',serif",
//         fontWeight: 700,
//         fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)",
//         letterSpacing: "0.04em",
//         color: accentGold,
//       }}
//     >
//       {value}
//     </span>
//     <span
//       style={{
//         fontFamily: "'Jost',sans-serif",
//         fontWeight: 500,
//         fontSize: "clamp(9px, 1vw, 11px)",
//         letterSpacing: "0.2em",
//         textTransform: "uppercase",
//         color: "#b0895e",
//         marginTop: "2px",
//       }}
//     >
//       {label}
//     </span>
//   </div>
// );

// const SlideCard = ({
//   slide,
//   isActive,
//   onClick,
//   accentGold,
//   paused,
//   animKey,
// }) => (
//   <button
//     onClick={onClick}
//     aria-current={isActive ? "true" : "false"}
//     aria-label={`View: ${slide.title[0]} ${slide.title[1]}`}
//     className="thumb-card relative flex-shrink-0 overflow-hidden snap-start focus:outline-none focus-visible:ring-2 rounded-2xl"
//     style={{
//       width: "clamp(90px, 10vw, 120px)",
//       height: "clamp(120px, 14vw, 150px)",
//       margin: isActive ? "0 16px" : "0",
//       border: isActive
//         ? `2px solid ${accentGold}`
//         : "1.5px solid rgba(255,255,255,0.28)",
//       opacity: isActive ? 1 : 0.52,
//       transform: isActive ? "scale(1.07) translateY(-5px)" : "scale(1)",
//       boxShadow: isActive
//         ? `0 12px 36px rgba(0,0,0,0.24), 0 0 0 3px ${accentGold}22`
//         : "0 4px 12px rgba(0,0,0,0.1)",
//       transition:
//         "margin 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease, box-shadow 0.4s ease",
//     }}
//   >
//     <div className="absolute inset-0 z-0">
//       <Image
//         src={slide.img}
//         alt={`Thumbnail - ${slide.title[0]} - Wholesale Ethnic Wear`}
//         fill
//         sizes="(max-width: 1024px) 90px, 120px"
//         className="object-cover"
//       />
//     </div>

//     <div
//       aria-hidden="true"
//       className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-2xl z-10"
//     />

//     {isActive && (
//       <div
//         className="absolute top-1.5 left-1.5 z-20 px-2 py-0.5 rounded-md"
//         style={{
//           background: accentGold,
//           fontFamily: "'Jost',sans-serif",
//           fontWeight: 700,
//           fontSize: "8px",
//           letterSpacing: "0.18em",
//           textTransform: "uppercase",
//           color: "white",
//         }}
//       >
//         {slide.badge}
//       </div>
//     )}

//     <div className="relative h-full flex flex-col justify-end p-2 z-20 text-left pb-4 pointer-events-none">
//       <p
//         style={{
//           fontFamily: "'Jost',sans-serif",
//           fontWeight: 600,
//           fontSize: "10px",
//           lineHeight: 1.35,
//           color: "white",
//           display: "-webkit-box",
//           WebkitLineClamp: 2,
//           WebkitBoxOrient: "vertical",
//           overflow: "hidden",
//         }}
//       >
//         {slide.title[0]} {slide.title[1]}
//       </p>
//     </div>

//     {isActive && (
//       <div
//         key={animKey}
//         aria-hidden="true"
//         className="absolute bottom-0 left-0 h-[3px] z-20 rounded-b-2xl"
//         style={{
//           background: `linear-gradient(to right, ${accentGold}, #BE6E5B)`,
//           animation: `slideProgress 5000ms linear forwards`,
//           animationPlayState: paused ? "paused" : "running",
//         }}
//       />
//     )}
//   </button>
// );

// export default function HeroSection() {
//   const [cur, setCur] = useState(0);
//   const [animKey, setAnimKey] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const pausedRef = useRef(false);

//   useEffect(() => {
//     pausedRef.current = paused;
//   }, [paused]);

//   useEffect(() => {
//     const id = setInterval(() => {
//       if (pausedRef.current) return;
//       setCur((c) => (c + 1) % slides.length);
//       setAnimKey((k) => k + 1);
//     }, 5000);
//     return () => clearInterval(id);
//   }, []);

//   const goTo = useCallback((n) => {
//     const next = ((n % slides.length) + slides.length) % slides.length;
//     setCur(next);
//     setAnimKey((k) => k + 1);
//   }, []);

//   const slide = slides[cur];

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: STYLES }} />

//       <section
//         className="hero-section relative w-full flex flex-col overflow-x-hidden"
//         aria-label="Sanwariyas Global Wholesale – Premium Indian Ethnic Wear"
//         aria-roledescription="carousel"
//         itemScope
//         itemType="https://schema.org/WPHeader"
//         onMouseEnter={() => setPaused(true)}
//         onMouseLeave={() => setPaused(false)}
//         onFocus={() => setPaused(true)}
//         onBlur={() => setPaused(false)}
//       >
//         {/* ── Slide backgrounds ── */}
//         {slides.map((s, i) => (
//           <div
//             key={s.id}
//             aria-hidden="true"
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === cur ? "opacity-100 z-0" : "opacity-0 -z-10"}`}
//             style={{ background: s.bg }}
//           />
//         ))}
//         <div aria-hidden="true" className="grain-layer" />

//         {/* ── Slide counter ── */}
//         <div
//           aria-hidden="true"
//           className="absolute top-5 right-5 z-20 hidden lg:flex items-center gap-2"
//         >
//           {/* Current Slide Number */}
//           <span
//             style={{
//               fontFamily: "'Cinzel',serif",
//               fontWeight: 600,
//               fontSize: "12px",
//               letterSpacing: "0.22em",
//               color: "#b0895e",
//             }}
//           >
//             {String(cur + 1).padStart(2, "0")}
//           </span>

//           <span className="text-[#C9A485] opacity-60 text-xs">/</span>

//           {/* Total Slide Number */}
//           <span
//             style={{
//               fontFamily: "'Cinzel',serif",
//               fontSize: "12px",
//               letterSpacing: "0.22em",
//               color: "#C9A485",
//               opacity: 0.6,
//             }}
//           >
//             {String(slides.length).padStart(2, "0")}
//           </span>
//         </div>

//         {/* ── Main content ── */}
//         <div className="hero-main-grid relative z-10 flex-grow flex items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 pt-20 lg:pt-16 pb-2 lg:pb-0">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-12 items-center w-full">
//             {/* ════ LEFT: Text ════ */}
//             <div
//               aria-live="polite"
//               aria-atomic="true"
//               className="flex flex-col justify-center order-2 lg:order-1 mt-4 lg:mt-0"
//             >
//               {/* Badge row */}
//               <div className="anim-badge flex items-center gap-3 mb-4">
//                 <span
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: "6px",
//                     padding: "6px 14px",
//                     borderRadius: "999px",
//                     background: `linear-gradient(135deg, ${slide.accentGold} 0%, #BE6E5B 100%)`,
//                     fontFamily: "'Jost',sans-serif",
//                     fontWeight: 700,
//                     fontSize: "9px",
//                     letterSpacing: "0.24em",
//                     textTransform: "uppercase",
//                     color: "white",
//                     boxShadow: `0 4px 18px ${slide.accentGold}40`,
//                   }}
//                 >
//                   <span
//                     aria-hidden="true"
//                     className="dot-pulse inline-block w-1.5 h-1.5 rounded-full bg-white/80"
//                   />
//                   {slide.badge}
//                 </span>
//                 <div
//                   className="anim-line h-px rounded-full flex-shrink-0"
//                   style={{
//                     width: "50px",
//                     background: `linear-gradient(to right, ${slide.accentGold}, transparent)`,
//                     opacity: 0.7,
//                   }}
//                 />
//               </div>

//               {/* SEO H1 — visually a small eyebrow line, semantically the page's main heading */}
//               <h1
//                 className="anim-title font-semibold mb-3 tracking-wide text-[#7A3D2A]"
//                 style={{
//                   fontFamily: "'Jost',sans-serif",
//                   fontSize: "clamp(12px, 1.2vw, 13px)",
//                   letterSpacing: "0.08em",
//                   lineHeight: 1.5,
//                   maxWidth: "560px",
//                   opacity: 0.85,
//                 }}
//               >
//                 SANWARIYAS — Wholesale Cotton Ethnic Wear Manufacturer, Supplier
//                 &amp; Exporter in Jaipur, Rajasthan, India
//               </h1>

//               {/* Visual heading — the big styled title */}
//               <h2
//                 className="anim-title text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 tracking-wide"
//                 style={{
//                   fontFamily: "'Cormorant Garamond',Georgia,serif",
//                   color: slide.accentGold,
//                   lineHeight: "1.05",
//                 }}
//               >
//                 <span className="block">{slide.title[0]}</span>
//                 <span className="block italic">{slide.title[1]}</span>
//               </h2>

//               {/* Divider line */}
//               <div
//                 aria-hidden="true"
//                 className="mb-4 md:mb-5 rounded-full"
//                 style={{
//                   height: "2px",
//                   width: "50px",
//                   background: `linear-gradient(to right, ${slide.accentGold}, transparent)`,
//                   opacity: 0.55,
//                 }}
//               />

//               {/* Subtitle */}
//               <p
//                 className="anim-sub leading-[1.75] mb-6 tracking-wide text-[#a07f61] max-w-md"
//                 style={{
//                   fontFamily: "'Jost',sans-serif",
//                   fontWeight: 400,
//                   fontSize: "clamp(13px, 1.5vw, 15px)",
//                 }}
//                 itemProp="description"
//               >
//                 {slide.sub}
//               </p>

//               {/* CTA buttons */}
//               <div className="anim-btns flex flex-wrap gap-3 mb-6">
//                 <Link
//                   href="/lookbook"
//                   title="View Wholesale Cotton Suits & Kurtis Collections"
//                   aria-label="Explore our wholesale ethnic wear collection"
//                   className="explore-btn shimmer-btn group relative inline-flex items-center gap-2.5 rounded-xl overflow-hidden"
//                   style={{
//                     padding: "10px 24px",
//                     backgroundImage: `linear-gradient(135deg, ${slide.accentGold} 0%, #BE6E5B 50%, ${slide.accentGold} 100%)`,
//                     backgroundSize: "200% auto",
//                     color: "#FDF7F2",
//                     fontFamily: "'Jost',sans-serif",
//                     fontWeight: 700,
//                     fontSize: "11px",
//                     letterSpacing: "0.2em",
//                     textTransform: "uppercase",
//                     boxShadow: `0 6px 24px ${slide.accentGold}38`,
//                   }}
//                 >
//                   <span
//                     aria-hidden="true"
//                     className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                     style={{
//                       background:
//                         "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.18) 50%,transparent 70%)",
//                       backgroundSize: "200% auto",
//                     }}
//                   />
//                   <span className="relative">Explore Collection</span>
//                   <span
//                     aria-hidden="true"
//                     className="relative transition-transform duration-300 group-hover:translate-x-1"
//                   >
//                     →
//                   </span>
//                 </Link>

//                 <Link
//                   href="/contact"
//                   title="Contact Jaipur Ethnic Wear Manufacturer"
//                   aria-label="Get wholesale pricing directly from the manufacturer"
//                   className="outline-btn group inline-flex items-center gap-2 rounded-xl"
//                   style={{
//                     padding: "10px 24px",
//                     background: "rgba(255,255,255,0.65)",
//                     backdropFilter: "blur(12px)",
//                     border: `1.5px solid ${slide.accentGold}`,
//                     color: slide.accentGold,
//                     fontFamily: "'Jost',sans-serif",
//                     fontWeight: 700,
//                     fontSize: "11px",
//                     letterSpacing: "0.2em",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Get Wholesale Price
//                   <span
//                     aria-hidden="true"
//                     className="transition-transform duration-300 group-hover:translate-x-0.5 opacity-55"
//                   >
//                     ↗
//                   </span>
//                 </Link>
//               </div>

//               {/* Stats */}
//               <div className="anim-stats flex items-center gap-3">
//                 <StatPill
//                   value="1500+"
//                   label="Designs"
//                   accentGold={slide.accentGold}
//                 />

//                 <StatPill
//                   value="50+"
//                   label="Countries"
//                   accentGold={slide.accentGold}
//                 />
//                 <StatPill
//                   value="15K+"
//                   label="Orders"
//                   accentGold={slide.accentGold}
//                 />
//               </div>
//             </div>

//             {/* ════ RIGHT: Image ════ */}
//             <div
//               key={`img-${cur}`}
//               className="hero-img-wrap relative flex items-center justify-center order-1 lg:order-2 mb-8 lg:mb-0 mt-4 lg:mt-0"
//               style={{ height: "clamp(320px, 55vh, 560px)" }}
//             >
//               <div
//                 className="relative w-full h-full"
//                 style={{
//                   maxWidth: "clamp(320px, 55vh, 560px)",
//                   margin: "0 auto",
//                 }}
//               >
//                 {/* Floating orbs */}
//                 <div
//                   aria-hidden="true"
//                   className="float-orb absolute top-[6%] right-[7%] w-3 h-3 rounded-full z-20"
//                   style={{
//                     background: `radial-gradient(circle, #fff 20%, ${slide.accentGold})`,
//                     boxShadow: `0 3px 10px ${slide.accentGold}60`,
//                   }}
//                 />
//                 <div
//                   aria-hidden="true"
//                   className="float-orb2 absolute bottom-[9%] left-[6%] w-2.5 h-2.5 rounded-full z-20"
//                   style={{
//                     background: `radial-gradient(circle, #fff 20%, #BE6E5B)`,
//                     boxShadow: "0 3px 8px rgba(190,110,91,0.55)",
//                   }}
//                 />
//                 <div
//                   aria-hidden="true"
//                   className="float-orb3 absolute top-[48%] right-[-2%] w-2 h-2 rounded-full z-20"
//                   style={{
//                     background: `radial-gradient(circle, #fff 20%, ${slide.accentGold})`,
//                     opacity: 0.8,
//                   }}
//                 />

//                 <div
//                   aria-hidden="true"
//                   className="absolute inset-[-8%] transition-all duration-700 pointer-events-none"
//                   style={{
//                     background:
//                       "radial-gradient(ellipse 60% 68% at 50% 55%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.16) 35%, rgba(0,0,0,0.05) 60%, transparent 78%)",
//                     filter: "blur(6px)",
//                   }}
//                 />

//                 <div
//                   className="absolute inset-3.5 lg:inset-5 transition-all duration-700"
//                   style={{
//                     transform: `scale(${slide.imgScale || 1})`,
//                     transformOrigin: "50% 50%",
//                   }}
//                 >
//                   <div
//                     className={`absolute inset-0 ${
//                       cur === 0 ? "spin-slow" : ""
//                     }`}
//                     style={{
//                       transformOrigin: "50% 50%",
//                     }}
//                   >
//                     <Image
//                       src={slide.img}
//                       alt={slide.imgAlt}
//                       fill
//                       className="object-contain transition-transform duration-700 hover:scale-[1.04]"
//                       sizes="(max-width:1024px) 300px, 480px"
//                       priority
//                       fetchPriority="high"
//                       itemProp="image"
//                       style={{
//                         filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.22))",
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {/* Nav arrows - Balanced Size */}
//                 <button
//                   onClick={() => goTo(cur - 1)}
//                   aria-label="Previous slide"
//                   className="nav-btn absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 lg:-translate-x-6 z-20 rounded-full flex items-center justify-center"
//                   style={{
//                     width: "clamp(36px, 4vw, 48px)",
//                     height: "clamp(36px, 4vw, 48px)",
//                     background: "rgba(255,255,255,0.88)",
//                     backdropFilter: "blur(12px)",
//                     border: "1px solid rgba(255,255,255,0.7)",
//                     color: slide.accentGold,
//                     boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//                     fontFamily: "serif",
//                     fontWeight: 700,
//                     fontSize: "clamp(16px, 1.8vw, 20px)",
//                   }}
//                 >
//                   ❮
//                 </button>

//                 <button
//                   onClick={() => goTo(cur + 1)}
//                   aria-label="Next slide"
//                   className="nav-btn absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 lg:translate-x-6 z-20 rounded-full flex items-center justify-center"
//                   style={{
//                     width: "clamp(36px, 4vw, 48px)",
//                     height: "clamp(36px, 4vw, 48px)",
//                     background: "rgba(255,255,255,0.88)",
//                     backdropFilter: "blur(12px)",
//                     border: "1px solid rgba(255,255,255,0.7)",
//                     color: slide.accentGold,
//                     boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
//                     fontFamily: "serif",
//                     fontWeight: 700,
//                     fontSize: "clamp(16px, 1.8vw, 20px)",
//                   }}
//                 >
//                   ❯
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── Thumbnail strip ── */}
//         <div
//           className="hero-thumb-strip relative z-20 w-full pt-3 pb-5 mt-auto"
//           style={{
//             background:
//               "linear-gradient(to top, rgba(0,0,0,0.08), transparent)",
//           }}
//         >
//           <nav
//             aria-label="Carousel slide selector"
//             className="max-w-7xl mx-auto px-4 lg:px-14"
//           >
//             {/* Dot indicators */}
//             <div aria-hidden="true" className="flex justify-center gap-2 mb-3">
//               {slides.map((s, i) => (
//                 <button
//                   key={s.id}
//                   onClick={() => goTo(i)}
//                   aria-label={`Go to slide ${i + 1}`}
//                   className="rounded-full transition-all duration-400"
//                   style={{
//                     height: "5px",
//                     width: i === cur ? "28px" : "5px",
//                     background: i === cur ? slide.accentGold : "#C9A485",
//                     opacity: i === cur ? 1 : 0.4,
//                   }}
//                 />
//               ))}
//             </div>

//             {/* Thumbnail cards */}
//             <div className="flex md:justify-center gap-3 lg:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory px-2">
//               {slides.map((s, index) => (
//                 <SlideCard
//                   key={s.id}
//                   slide={s}
//                   isActive={index === cur}
//                   onClick={() => goTo(index)}
//                   accentGold={s.accentGold}
//                   paused={paused}
//                   animKey={animKey}
//                 />
//               ))}
//             </div>
//           </nav>
//         </div>
//       </section>
//     </>
//   );
// }

// FILE: client/src/components/home/HeroSection.js

"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// 1 brand slide + 6 category slides — all pointing at your existing catalogue images
const slides = [
  {
    id: 1,
    title: ["Complete Elegance,", "Woven in Cotton"],
    sub: "India's premier export house for high-end ethnic wear — pure cotton suits, kurtis, co-ord sets and Anarkalis, block printed and hand-finished in Jaipur, fully insured and shipped worldwide.",
    img: "/images/ROLARIMAGES.png",
    badge: "Export House · Jaipur",
  },
  {
    id: 2,
    title: ["Exquisite Craftsmanship,", "A-Line Masterpieces"],
    sub: "Flawlessly stitched A-Line suits crafted for elegance — the perfect blend of comfort and pure luxury in every thread.",
    img: "/images/HomepageTemplate/A-Line.png",
    badge: "A-Line Suits",
  },
  {
    id: 3,
    title: ["Timeless Grace,", "Designer Anarkalis"],
    sub: "Beautifully flared Anarkali suits tailored with breathable fabrics, redefining the standard of ethnic fashion.",
    img: "/images/HomepageTemplate/Anarkali.png",
    badge: "Anarkali Collection",
  },
  {
    id: 4,
    title: ["Complete Elegance,", "Straight 3-Piece Suits"],
    sub: "Classic straight-cut 3-piece suits featuring exquisite dupattas — fully insured, securely packaged, exported worldwide.",
    img: "/images/HomepageTemplate/Straight%203-Piece.png",
    badge: "3-Piece Suits",
  },
  {
    id: 5,
    title: ["Modern Silhouettes,", "Chic Cord Sets"],
    sub: "Directly sourced from India's master weavers — trendy, highly demanded, comfortable cotton co-ord sets for everyday luxury.",
    img: "/images/HomepageTemplate/Co-ord%20Sets.png",
    badge: "Co-ord Sets",
  },
  {
    id: 6,
    title: ["Everyday Elegance,", "Premium Short Kurtis"],
    sub: "Versatile and stylish short kurtis at wholesale rates, with perfect fits, breathable fabrics and vibrant long-lasting prints.",
    img: "/images/HomepageTemplate/Short%20Kurtis.png",
    badge: "Short Kurtis",
  },
  {
    id: 7,
    title: ["Graceful Lengths,", "Classic Long Kurtis"],
    sub: "Elegant long kurtis perfect for retail scaling — partner with India's most trusted export house for your bulk requirements.",
    img: "/images/HomepageTemplate/Long%20Kurtis.png",
    badge: "Long Kurtis",
  },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Jost:wght@300;400;500;600&family=Cinzel:wght@400;600;700&display=swap');

  @keyframes dotPulse {
    0%,100%{ transform:scale(1); opacity:1; }
    50%    { transform:scale(1.5); opacity:0.7; }
  }
  @keyframes floatCard {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-9px); }
  }
  @keyframes slideProgress { from{width:0%} to{width:100%} }
  @keyframes fadeIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes hsSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .hs-spin { animation: hsSpin 28s linear infinite; }

  .hs-explore { transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease; }
  .hs-explore:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(139,101,8,0.35); filter: brightness(1.05); }

  .hs-outline { transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease; }
  .hs-outline:hover { transform: translateY(-2px); background: rgba(255,255,255,0.95); box-shadow: 0 10px 26px rgba(139,101,8,0.14); }

  .hs-badge-card { animation: floatCard 5.5s ease-in-out infinite; }

  .hs-fade { animation: fadeIn 0.5s ease both; }

  @keyframes hsBubbleFloat {
    0%   { transform: translateY(0) scale(1); opacity: 0.35; }
    50%  { transform: translateY(-22px) scale(1.15); opacity: 0.85; }
    100% { transform: translateY(0) scale(1); opacity: 0.35; }
  }
  .hs-bubble {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(190,110,91,0.55) 55%, rgba(139,101,8,0.15) 100%);
    filter: blur(0.4px);
    animation: hsBubbleFloat 6s ease-in-out infinite;
  }

  .hs-thumb {
    transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease, box-shadow 0.4s ease, margin 0.4s cubic-bezier(0.22,1,0.36,1);
  }
  .hs-thumb:hover { transform: scale(1.06) translateY(-3px); }
  .hs-thumb-strip::-webkit-scrollbar { display:none; }
  .hs-thumb-strip { -ms-overflow-style:none; scrollbar-width:none; }

  .hs-blend {
    -webkit-mask-image: radial-gradient(ellipse 80% 84% at 50% 45%, black 55%, transparent 100%);
    mask-image: radial-gradient(ellipse 80% 84% at 50% 45%, black 55%, transparent 100%);
  }
`;

export default function HeroSection() {
  const [cur, setCur] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setCur((c) => (c + 1) % slides.length);
      setAnimKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const goTo = useCallback((n) => {
    const next = ((n % slides.length) + slides.length) % slides.length;
    setCur(next);
    setAnimKey((k) => k + 1);
  }, []);

  const slide = slides[cur];
  const isBrandSlide = cur === 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section
        className="hero-section relative w-full flex flex-col overflow-hidden"
        style={{
          minHeight: "700px",
          background:
            "linear-gradient(100deg, #FBF1E4 0%, #F6E6D2 28%, #F0DBBF 50%, #EACFAD 72%, #E0BF98 100%)",
        }}
        aria-label="Sanwariyas Global Wholesale – Premium Indian Ethnic Wear"
        aria-roledescription="carousel"
        itemScope
        itemType="https://schema.org/WPHeader"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* faint jaali lattice on the light side */}
        <svg
          aria-hidden="true"
          className="hidden lg:block absolute left-0 top-0 h-full opacity-[0.08]"
          width="260"
          viewBox="0 0 260 700"
          fill="none"
        >
          <defs>
            <pattern id="jaali" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M18 0 L36 18 L18 36 L0 18 Z" stroke="#8B6508" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="260" height="700" fill="url(#jaali)" />
        </svg>

        {/* slide counter */}
        <div
          aria-hidden="true"
          className="absolute top-5 right-6 lg:right-14 z-20 hidden lg:flex items-center gap-2"
        >
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.22em",
              color: "#8B6508",
            }}
          >
            {String(cur + 1).padStart(2, "0")}
          </span>
          <span className="text-[#C9A485] opacity-70 text-xs">/</span>
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "12px",
              letterSpacing: "0.22em",
              color: "#a1794f",
              opacity: 0.7,
            }}
          >
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        <div className="relative z-10 flex-1 flex items-center w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-16 pb-6 lg:pt-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr,0.95fr] gap-10 lg:gap-10 items-center w-full">
            {/* ════ LEFT — details for the active slide ════ */}
            <div
              key={`text-${cur}`}
              aria-live="polite"
              aria-atomic="true"
              className="hs-fade flex flex-col text-center lg:text-left order-2 lg:order-1"
            >
              <div className="flex items-center gap-3 mb-5 justify-center lg:justify-start">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 16px",
                    borderRadius: "999px",
                    border: "1px solid #8B6508",
                    fontFamily: "'Jost',sans-serif",
                    fontWeight: 700,
                    fontSize: "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "#8B6508",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: "#8B6508", animation: "dotPulse 2s ease-in-out infinite" }}
                  />
                  {slide.badge}
                </span>
              </div>

              {/* SEO H1 — small eyebrow line, semantically the page heading, stays constant across slides */}
              <h1
                className="font-semibold mb-4 tracking-wide text-[#7A3D2A]"
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: "clamp(12px, 1.2vw, 13px)",
                  letterSpacing: "0.08em",
                  lineHeight: 1.6,
                  opacity: 0.8,
                }}
              >
                SANWARIYAS — Wholesale Cotton Ethnic Wear Manufacturer, Supplier
                &amp; Exporter in Jaipur, Rajasthan, India
              </h1>

              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-wide"
                style={{
                  fontFamily: "'Cormorant Garamond',Georgia,serif",
                  color: "#5C3A1E",
                  lineHeight: "1.08",
                }}
              >
                <span className="block">{slide.title[0]}</span>
                <span className="block italic" style={{ color: "#8B6508" }}>
                  {slide.title[1]}
                </span>
              </h2>

              <p
                className="leading-[1.85] mb-8 tracking-wide text-[#8a6c52] max-w-md mx-auto lg:mx-0"
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(13px, 1.5vw, 15px)",
                }}
                itemProp="description"
              >
                {slide.sub}
              </p>

              <div className="flex flex-wrap gap-3 mb-9 justify-center lg:justify-start">
                <Link
                  href="/lookbook"
                  title="View Wholesale Cotton Suits & Kurtis Collections"
                  aria-label="Explore our wholesale ethnic wear collection"
                  className="hs-explore inline-flex items-center gap-2.5 rounded-full"
                  style={{
                    padding: "13px 28px",
                    background: "linear-gradient(135deg, #8B6508 0%, #BE6E5B 100%)",
                    color: "#FDF7F2",
                    fontFamily: "'Jost',sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    boxShadow: "0 8px 26px rgba(139,101,8,0.4)",
                  }}
                >
                  Explore Collection <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/contact"
                  title="Contact Jaipur Ethnic Wear Manufacturer"
                  aria-label="Get wholesale pricing directly from the manufacturer"
                  className="hs-outline inline-flex items-center gap-2 rounded-full"
                  style={{
                    padding: "13px 28px",
                    background: "rgba(255,255,255,0.55)",
                    border: "1.5px solid #8B6508",
                    color: "#8B6508",
                    fontFamily: "'Jost',sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Get Wholesale Price
                </Link>
              </div>

              {/* Stats — constant across slides */}
              <div className="flex items-center gap-8 justify-center lg:justify-start">
                {[
                  ["1500+", "Designs"],
                  ["50+", "Countries"],
                  ["15K+", "Orders"],
                ].map(([value, label], i) => (
                  <div key={label} className="flex items-center gap-8">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        style={{ width: "1px", height: "30px", background: "rgba(139,101,8,0.25)" }}
                      />
                    )}
                    <div className="flex flex-col items-center lg:items-start">
                      <span
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontWeight: 700,
                          fontSize: "clamp(1.2rem, 1.9vw, 1.4rem)",
                          letterSpacing: "0.03em",
                          color: "#5C3A1E",
                        }}
                      >
                        {value}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 500,
                          fontSize: "10px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "#a1794f",
                          marginTop: "2px",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ════ RIGHT — one clean, framed photo that changes with the slide ════ */}
            <div className="relative flex justify-center lg:justify-end order-1 lg:order-2 w-full">
              <div
                className="relative w-full max-w-[440px] aspect-[3/4] mx-auto lg:mx-0 lg:w-[clamp(240px,30vw,360px)] lg:h-[clamp(320px,46vw,480px)] lg:aspect-auto"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-[-12%] rounded-[2.5rem]"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 42%, rgba(246,230,210,0.95) 0%, rgba(224,191,152,0.6) 45%, rgba(251,241,228,0.3) 68%, transparent 82%)",
                    filter: "blur(18px)",
                  }}
                />

                {/* floating glow bubbles — ties the photo visually into the template */}
                <span className="hs-bubble" style={{ width: 14, height: 14, top: "4%", left: "-4%", animationDelay: "0s" }} />
                <span className="hs-bubble" style={{ width: 9, height: 9, top: "18%", right: "-3%", animationDelay: "1.1s" }} />
                <span className="hs-bubble" style={{ width: 11, height: 11, top: "38%", left: "-6%", animationDelay: "2.2s" }} />
                <span className="hs-bubble" style={{ width: 7, height: 7, top: "58%", right: "-5%", animationDelay: "0.6s" }} />
                <span className="hs-bubble" style={{ width: 13, height: 13, bottom: "10%", left: "-3%", animationDelay: "1.7s" }} />
                <span className="hs-bubble" style={{ width: 8, height: 8, bottom: "22%", right: "-4%", animationDelay: "2.8s" }} />
                <span className="hs-bubble" style={{ width: 10, height: 10, top: "-3%", left: "30%", animationDelay: "0.9s" }} />
                <span className="hs-bubble" style={{ width: 8, height: 8, bottom: "-3%", right: "28%", animationDelay: "1.9s" }} />

                <button
                  onClick={() => goTo(cur - 1)}
                  aria-label="Previous slide"
                  className="hs-nav-btn absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-20 rounded-full flex items-center justify-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #8B6508 0%, #BE6E5B 100%)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    color: "#FDF7F2",
                    boxShadow: "0 8px 22px rgba(59,31,23,0.32)",
                    fontFamily: "serif",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  ❮
                </button>
                <button
                  onClick={() => goTo(cur + 1)}
                  aria-label="Next slide"
                  className="hs-nav-btn absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-20 rounded-full flex items-center justify-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #8B6508 0%, #BE6E5B 100%)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    color: "#FDF7F2",
                    boxShadow: "0 8px 22px rgba(59,31,23,0.32)",
                    fontFamily: "serif",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  ❯
                </button>

                {isBrandSlide ? (
                  // Brand slide — no frame, image spins continuously
                  <div
                    key={`img-${cur}`}
                    className="hs-fade relative w-full h-full"
                  >
                    <div className="hs-spin absolute inset-0">
                      <Image
                        src={slide.img}
                        alt={`${slide.badge} - Sanwariyas Wholesale Ethnic Wear`}
                        fill
                        sizes="(max-width: 1024px) 300px, 360px"
                        className="object-contain"
                        priority
                        fetchPriority="high"
                        itemProp="image"
                        style={{ filter: "drop-shadow(0 18px 26px rgba(59,31,23,0.28))" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    key={`img-${cur}`}
                    className="hs-fade hs-blend relative w-full h-full rounded-[1.75rem] overflow-hidden"
                  >
                    <Image
                      src={slide.img}
                      alt={`${slide.badge} - Sanwariyas Wholesale Ethnic Wear`}
                      fill
                      sizes="(max-width: 1024px) 300px, 360px"
                      className="object-cover"
                      priority
                      fetchPriority="high"
                      itemProp="image"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-24"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }}
                    />

                    <div
                      className="absolute bottom-4 left-4 z-10"
                      style={{
                        fontFamily: "'Jost',sans-serif",
                        fontWeight: 700,
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "white",
                      }}
                    >
                      {slide.badge}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Thumbnail strip — 7 slides: brand + all 6 categories ── */}
        <div className="relative z-20 w-full pb-6 pt-1">
          <nav aria-label="Carousel slide selector" className="max-w-7xl mx-auto px-6 lg:px-14">
            <div aria-hidden="true" className="flex justify-center gap-2 mb-3">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="rounded-full transition-all duration-400"
                  style={{
                    height: "5px",
                    width: i === cur ? "26px" : "5px",
                    background: i === cur ? "#8B6508" : "#C9A485",
                    opacity: i === cur ? 1 : 0.45,
                  }}
                />
              ))}
            </div>

            <div className="hs-thumb-strip flex md:justify-center gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory px-2">
              {slides.map((s, i) => {
                const isActive = i === cur;
                return (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    aria-current={isActive ? "true" : "false"}
                    aria-label={`View ${s.badge}`}
                    className="hs-thumb relative flex-shrink-0 overflow-hidden snap-start rounded-xl"
                    style={{
                      width: "clamp(64px, 8vw, 84px)",
                      height: "clamp(84px, 10vw, 106px)",
                      margin: isActive ? "0 10px" : "0",
                      border: isActive ? "2px solid #8B6508" : "1.5px solid rgba(255,255,255,0.4)",
                      opacity: isActive ? 1 : 0.55,
                      transform: isActive ? "scale(1.06) translateY(-3px)" : "scale(1)",
                      boxShadow: isActive
                        ? "0 12px 28px rgba(59,31,23,0.24)"
                        : "0 4px 10px rgba(59,31,23,0.1)",
                    }}
                  >
                    <Image
                      src={s.img}
                      alt={`Thumbnail - ${s.badge}`}
                      fill
                      sizes="84px"
                      className="object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)" }}
                    />
                    {isActive && (
                      <div
                        key={animKey}
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[3px]"
                        style={{
                          background: "linear-gradient(to right, #8B6508, #BE6E5B)",
                          animation: "slideProgress 5000ms linear forwards",
                          animationPlayState: paused ? "paused" : "running",
                          width: "100%",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </section>
    </>
  );
}