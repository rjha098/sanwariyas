// 'use client';
// import { useState, useEffect, useCallback, useRef } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';

// const slides = [
//   {
//     id: 1,
//     title: ['Global Wholesale', 'Regal Heritage'],
//     sub: 'India\'s premier export house for high-end ethnic wear. Discover the pinnacle of Kurti craftsmanship and designer suits.',
//     img: '/images/ROLARIMAGES.png',
//     imgAlt: 'Sanwariyas Global Wholesale Hub',
//     // Dark Dry Creek base → light Pumpkin Essence burst top-right
//     bg: 'radial-gradient(ellipse at 90% 10%, #F2D9C3 0%, #F2D9C3 25%, #E0BFA2 60%, #C9A485 100%)',
//     accentGold: '#8B6508',
//   },
//   {
//     id: 2,
//     title: ['Exquisite Handwoven', 'Bridal Masterpieces'],
//     sub: 'Intricately stitched lehengas and sarees crafted for your most unforgettable moments. A legacy of pure luxury.',
//     img: 'https://images.unsplash.com/photo-1769063382670-823451e5a7ef?q=80&w=687&auto=format&fit=crop',
//     imgAlt: 'Premium Handwoven Bridal Couture',
//     // Light Pumpkin top-left → deep Dry Creek bottom-right (very dark corner)
//     bg: 'linear-gradient(145deg, #F2D9C3 0%, #F2D9C3 30%, #E0BFA2 55%, #B8996E 100%)',
//     accentGold: '#996515',
//   },
//   {
//     id: 3,
//     title: ['Timeless Grace', 'Contemporary Suits'],
//     sub: 'Redefining the standard of ethnic fashion. Designer Anarkalis and cord sets tailored for the modern woman.',
//     img: 'https://images.unsplash.com/photo-1767687718046-bf05d7243259?q=80&w=687&auto=format&fit=crop',
//     imgAlt: 'Designer Suits and Anarkalis',
//     // Mostly dark Dry Creek — Pumpkin Essence glows only at very top
//     bg: 'linear-gradient(180deg, #F2D9C3 0%, #EDD0B5 15%, #E0BFA2 45%, #C4A07A 100%)',
//     accentGold: '#6B4226',
//   },
//   {
//     id: 4,
//     title: ['Craftsmanship In', 'Every Single Thread'],
//     sub: 'Directly sourced from India\'s master weavers. Fabrics that carry the soul and heritage of our rich culture.',
//     img: 'https://images.unsplash.com/photo-1765529375039-13dabeab0684?q=80&w=687&auto=format&fit=crop',
//     imgAlt: 'Artisan Hand-stitched Fabrics',
//     // Radial: very bright Pumpkin Essence center spotlight, Dry Creek dark ring around
//     bg: 'radial-gradient(circle at 40% 60%, #F2D9C3 0%, #EDD4B8 30%, #E0BFA2 55%, #BEA07A 100%)',
//     accentGold: '#8B6508',
//   },
//   {
//     id: 5,
//     title: ['Tailored Exclusively', 'For Your Vision'],
//     sub: 'Personalised luxury at wholesale rates. We customize every stitch to your specific measurements and occasion.',
//     img: 'https://plus.unsplash.com/premium_photo-1687485793889-9402fd58b544?q=80&w=687&auto=format&fit=crop',
//     imgAlt: 'Custom Tailored Ethnic Wear',
//     // Mostly dark base, Pumpkin Essence lights only the bottom strip
//     bg: 'linear-gradient(0deg, #F2D9C3 0%, #EAC9A8 20%, #E0BFA2 50%, #C2956A 100%)',
//     accentGold: '#6B4226',
//   },
//   {
//     id: 6,
//     title: ['Global Luxury', 'Seamless Delivery'],
//     sub: 'Exporting Indian excellence to the world. Fully insured, securely packaged, and delivered with royal care.',
//     img: 'https://plus.unsplash.com/premium_photo-1668443423052-81d51888646d?q=80&w=687&auto=format&fit=crop',
//     imgAlt: 'Global Delivery Excellence',
//     // Horizontal split: left dark Dry Creek, right bright Pumpkin Essence
//     bg: 'linear-gradient(90deg, #C4A07A 0%, #E0BFA2 40%, #EDD0B5 65%, #F2D9C3 100%)',
//     accentGold: '#996515',
//   },
//   {
//     id: 7,
//     title: ['Premium Partner', 'Bulk Order Luxury'],
//     sub: 'Partner with India\'s most trusted export empire. Scalable solutions for global retailers and luxury boutiques.',
//     img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=687&auto=format&fit=crop',
//     imgAlt: 'Wholesale and Bulk Orders',
//     // Diagonal: dark Dry Creek top-left corner, light Pumpkin Essence bottom-right
//     bg: 'linear-gradient(225deg, #F2D9C3 0%, #EAC9A8 35%, #E0BFA2 65%, #B8916A 100%)',
//     accentGold: '#8B6508',
//   },
// ];

// const STYLES = `
//   @keyframes smoothSlideUp {
//     from { opacity: 0; transform: translateY(20px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
//   .animate-slide-up {
//     animation: smoothSlideUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
//     opacity: 0;
//   }
//   .delay-100 { animation-delay: 100ms; }
//   .delay-200 { animation-delay: 200ms; }
//   .delay-300 { animation-delay: 300ms; }

//   /* Circular Rings Animations */
//   @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//   @keyframes spinSlowR { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
//   .spin-slow { animation: spinSlow 25s linear infinite; }
//   .spin-slowR { animation: spinSlowR 30s linear infinite; }

//   /* ⏱️ SLIDER TIMING ANIMATION KEYFRAME */
//   @keyframes slideProgress {
//     0% { width: 0%; }
//     100% { width: 100%; }
//   }
// `;

// // Added 'paused' and 'animKey' props so the progress bar works flawlessly
// const SlideCard = ({ slide, isActive, onClick, accentGold, paused, animKey }) => (
//   <button
//     onClick={onClick}
//     className="relative flex-shrink-0 w-[110px] h-[140px] lg:w-[130px] lg:h-[150px] rounded-lg overflow-hidden transition-all duration-700 ease-in-out group focus:outline-none shadow-md hover:shadow-lg"
//     style={{
//       background: `url('${slide.img}')`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       border: isActive ? `2px solid ${accentGold}` : '2px solid transparent',
//       opacity: isActive ? 1 : 0.65,
//       transform: isActive ? 'scale(1.05)' : 'scale(1)',
//     }}
//   >
//     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-700" />

//     <div className="relative h-full flex flex-col justify-end p-2.5 z-10 text-left pb-4">
//       <p className="text-[10px] lg:text-[11px] font-bold leading-tight line-clamp-2 text-white shadow-sm">
//         {slide.title[0]} {slide.title[1]}
//       </p>
//     </div>

//     {/* ⏱️ TIMING PROGRESS BAR (Only shows on active slide) */}
//     {isActive && (
//       <div
//         key={animKey} // Forces the animation to restart from 0% when slide changes
//         className="absolute bottom-0 left-0 h-1.5 z-20"
//         style={{
//           background: accentGold,
//           animation: 'slideProgress 5000ms linear forwards',
//           animationPlayState: paused ? 'paused' : 'running', // Pauses when user hovers
//         }}
//       />
//     )}
//   </button>
// );

// export default function HeroSection() {
//   const [cur, setCur] = useState(0);
//   const [animKey, setAnimKey] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const timerRef = useRef(null);

//   const goTo = useCallback((n) => {
//     const next = ((n % slides.length) + slides.length) % slides.length;
//     if (next === cur) return;
//     setCur(next);
//     setAnimKey(k => k + 1);
//   }, [cur]);

//   useEffect(() => {
//     if (paused) return;
//     timerRef.current = setTimeout(() => goTo(cur + 1), 5000); // 5 Seconds exactly
//     return () => clearTimeout(timerRef.current);
//   }, [cur, paused, goTo]);

//   const slide = slides[cur];

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: STYLES }} />

//       {/* Main Container - Reduced height logic to fit 1 screen */}
//       <section
//         className="relative w-full h-screen min-h-[600px] flex flex-col overflow-hidden"
//         onMouseEnter={() => setPaused(true)}
//         onMouseLeave={() => setPaused(false)}
//       >
//         {/* Backgrounds */}
//         {slides.map((s, i) => (
//           <div
//             key={s.id}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === cur ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
//             style={{ background: s.bg }}
//           />
//         ))}

//         <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] pointer-events-none z-0" />

//         {/* TOP CONTENT: Title, Description, Buttons & Image */}
//         <div key={animKey} className="relative z-10 flex-grow flex items-center w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-24 pb-4">

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">

//             {/* LEFT: TEXT COLUMN */}
//             <div className="flex flex-col justify-center">

//               {/* Reduced Title Size */}
//               <h1 className="animate-slide-up delay-100 text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.05] mb-4 tracking-wide text-[#1A1A1A]">
//                 <span className="block">{slide.title[0]}</span>
//                 <span className="block text-transparent bg-clip-text mt-1 pb-1" style={{ backgroundImage: `linear-gradient(to right, ${slide.accentGold}, #B8860B)` }}>
//                   {slide.title[1]}
//                 </span>
//               </h1>

//               {/* Reduced Subtitle Size */}
//               <p className="animate-slide-up delay-200 text-xs lg:text-sm leading-relaxed mb-6 lg:mb-8 tracking-wide text-[#333333] max-w-md font-medium">
//                 {slide.sub}
//               </p>

//               <div className="animate-slide-up delay-300 flex flex-wrap gap-3">
//                 <Link
//                   href="/products"
//                   className="px-6 py-2.5 lg:px-7 lg:py-3 rounded-lg font-bold text-[9px] lg:text-[10px] tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
//                   style={{
//                     background: `linear-gradient(135deg, ${slide.accentGold}, #E8D08B)`,
//                     color: '#1A1A1A',
//                   }}
//                 >
//                   Explore Collection →
//                 </Link>
//                 <Link
//                   href="/contact"
//                   className="px-6 py-2.5 lg:px-7 lg:py-3 rounded-lg font-bold text-[9px] lg:text-[10px] tracking-widest uppercase bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
//                   style={{
//                     border: `1px solid ${slide.accentGold}`,
//                     color: slide.accentGold,
//                   }}
//                 >
//                   Get Wholesale Price
//                 </Link>
//               </div>
//             </div>

//             {/* RIGHT: IMAGE COLUMN */}
//             <div className="relative flex items-center justify-center h-[280px] md:h-[350px] lg:h-[450px]">
//               <div className="animate-slide-up delay-100 relative w-full h-full max-w-[280px] md:max-w-[350px] lg:max-w-[420px]">

//                 {/* Rings */}
//                 <div
//                   className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none"
//                   style={{ border: `1px solid ${slide.accentGold}`, opacity: 0.6, transform: 'translate(-12px, -12px)' }}
//                 />
//                 <div
//                   className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none"
//                   style={{ border: `1px solid ${slide.accentGold}`, opacity: 0.3, transform: 'translate(15px, 15px)' }}
//                 />

//                 {/* Main Circular Image */}
//                 <div className="absolute inset-4 md:inset-5 rounded-full overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-700 bg-white">
//                   <Image
//                     src={slide.img}
//                     alt={slide.imgAlt}
//                     fill
//                     className="object-cover"
//                     sizes="(max-width:1024px) 300px, 450px"
//                     priority
//                   />
//                 </div>

//                 {/* Left Arrow */}
//                 <button
//                   onClick={() => goTo(cur - 1)}
//                   className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-20 w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-base lg:text-lg font-bold"
//                   style={{ color: slide.accentGold }}
//                 >
//                   ❮
//                 </button>

//                 {/* Right Arrow */}
//                 <button
//                   onClick={() => goTo(cur + 1)}
//                   className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-20 w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-base lg:text-lg font-bold"
//                   style={{ color: slide.accentGold }}
//                 >
//                   ❯
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* BOTTOM: SLIDE CARDS NAVIGATION */}
//         <div className="relative z-20 w-full bg-gradient-to-t from-black/5 to-transparent pt-4 pb-6 mt-auto">
//           <div className="max-w-7xl mx-auto px-4 lg:px-12">
//             <div className="flex md:justify-center gap-3 lg:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
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
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }





// "use client";
// import { useState, useEffect, useCallback, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";

// const slides = [
//   {
//     id: 1,
//     title: ["Global Wholesale", "Regal Heritage"],
//     sub: "India's premier export house for high-end ethnic wear. Discover the pinnacle of Kurti craftsmanship and designer suits.",
//     img: "/images/ROLARIMAGES.png",
//     imgAlt: "Sanwariyas Global Wholesale Hub",
//     bg: "radial-gradient(ellipse at 90% 10%, #F2D9C3 0%, #F2D9C3 25%, #E0BFA2 60%, #C9A485 100%)",
//     accentGold: "#8B6508",
//   },
//   {
//     id: 2,
//     title: ["Exquisite Handwoven", "Bridal Masterpieces"],
//     sub: "Intricately stitched lehengas and sarees crafted for your most unforgettable moments. A legacy of pure luxury.",
//     img: "https://images.unsplash.com/photo-1769063382670-823451e5a7ef?q=80&w=687&auto=format&fit=crop",
//     imgAlt: "Premium Handwoven Bridal Couture",
//     bg: "linear-gradient(145deg, #F2D9C3 0%, #F2D9C3 30%, #E0BFA2 55%, #B8996E 100%)",
//     accentGold: "#996515",
//   },
//   {
//     id: 3,
//     title: ["Timeless Grace", "Contemporary Suits"],
//     sub: "Redefining the standard of ethnic fashion. Designer Anarkalis and cord sets tailored for the modern woman.",
//     img: "https://images.unsplash.com/photo-1767687718046-bf05d7243259?q=80&w=687&auto=format&fit=crop",
//     imgAlt: "Designer Suits and Anarkalis",
//     bg: "linear-gradient(180deg, #F2D9C3 0%, #EDD0B5 15%, #E0BFA2 45%, #C4A07A 100%)",
//     accentGold: "#6B4226",
//   },
//   {
//     id: 4,
//     title: ["Craftsmanship In", "Every Single Thread"],
//     sub: "Directly sourced from India's master weavers. Fabrics that carry the soul and heritage of our rich culture.",
//     img: "https://images.unsplash.com/photo-1765529375039-13dabeab0684?q=80&w=687&auto=format&fit=crop",
//     imgAlt: "Artisan Hand-stitched Fabrics",
//     bg: "radial-gradient(circle at 40% 60%, #F2D9C3 0%, #EDD4B8 30%, #E0BFA2 55%, #BEA07A 100%)",
//     accentGold: "#8B6508",
//   },
//   {
//     id: 5,
//     title: ["Tailored Exclusively", "For Your Vision"],
//     sub: "Personalised luxury at wholesale rates. We customize every stitch to your specific measurements and occasion.",
//     img: "https://plus.unsplash.com/premium_photo-1687485793889-9402fd58b544?q=80&w=687&auto=format&fit=crop",
//     imgAlt: "Custom Tailored Ethnic Wear",
//     bg: "linear-gradient(0deg, #F2D9C3 0%, #EAC9A8 20%, #E0BFA2 50%, #C2956A 100%)",
//     accentGold: "#6B4226",
//   },
//   {
//     id: 6,
//     title: ["Global Luxury", "Seamless Delivery"],
//     sub: "Exporting Indian excellence to the world. Fully insured, securely packaged, and delivered with royal care.",
//     img: "https://plus.unsplash.com/premium_photo-1668443423052-81d51888646d?q=80&w=687&auto=format&fit=crop",
//     imgAlt: "Global Delivery Excellence",
//     bg: "linear-gradient(90deg, #C4A07A 0%, #E0BFA2 40%, #EDD0B5 65%, #F2D9C3 100%)",
//     accentGold: "#996515",
//   },
//   {
//     id: 7,
//     title: ["Premium Partner", "Bulk Order Luxury"],
//     sub: "Partner with India's most trusted export empire. Scalable solutions for global retailers and luxury boutiques.",
//     img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=687&auto=format&fit=crop",
//     imgAlt: "Wholesale and Bulk Orders",
//     bg: "linear-gradient(225deg, #F2D9C3 0%, #EAC9A8 35%, #E0BFA2 65%, #B8916A 100%)",
//     accentGold: "#8B6508",
//   },
// ];

// const STYLES = `
//   @keyframes smoothSlideUp {
//     from { opacity: 0; transform: translateY(20px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
//   .animate-slide-up {
//     animation: smoothSlideUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
//     opacity: 0;
//   }
//   .delay-100 { animation-delay: 100ms; }
//   .delay-200 { animation-delay: 200ms; }
//   .delay-300 { animation-delay: 300ms; }

//   /* Circular Rings Animations */
//   @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//   @keyframes spinSlowR { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
//   .spin-slow { animation: spinSlow 35s linear infinite; }
//   .spin-slowR { animation: spinSlowR 40s linear infinite; }

//   /* ⏱️ SLIDER TIMING ANIMATION KEYFRAME */
//   @keyframes slideProgress {
//     0% { width: 0%; }
//     100% { width: 100%; }
//   }
// `;

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
//     aria-label={`Show slide: ${slide.title[0]} ${slide.title[1]}`}
//     className="relative flex-shrink-0 w-[110px] h-[140px] lg:w-[130px] lg:h-[150px] rounded-lg overflow-hidden transition-all duration-700 ease-in-out group focus:outline-none shadow-md hover:shadow-lg"
//     style={{
//       background: `url('${slide.img}')`,
//       backgroundSize: "cover",
//       backgroundPosition: "center",
//       border: isActive ? `2px solid ${accentGold}` : "2px solid transparent",
//       opacity: isActive ? 1 : 0.65,
//       transform: isActive ? "scale(1.05)" : "scale(1)",
//     }}
//   >
//     {/* ✅ A11Y: Hidden decorative gradient */}
//     <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-700" />

//     <div className="relative h-full flex flex-col justify-end p-2.5 z-10 text-left pb-4">
//       <p className="text-[10px] lg:text-[11px] font-bold leading-tight line-clamp-2 text-white shadow-sm">
//         {slide.title[0]} {slide.title[1]}
//       </p>
//     </div>

//     {isActive && (
//       <div
//         key={animKey}
//         aria-hidden="true"
//         className="absolute bottom-0 left-0 h-1.5 z-20"
//         style={{
//           background: accentGold,
//           animation: "slideProgress 5000ms linear forwards",
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
//   const timerRef = useRef(null);

//   const goTo = useCallback(
//     (n) => {
//       const next = ((n % slides.length) + slides.length) % slides.length;
//       if (next === cur) return;
//       setCur(next);
//       setAnimKey((k) => k + 1);
//     },
//     [cur],
//   );

//   useEffect(() => {
//     if (paused) return;
//     timerRef.current = setTimeout(() => goTo(cur + 1), 5000);
//     return () => clearTimeout(timerRef.current);
//   }, [cur, paused, goTo]);

//   const slide = slides[cur];

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: STYLES }} />

//       {/* FIX: min-h-[100dvh] added back for mobile cutoff issue */}
//       {/* ✅ A11Y: Added aria-label and role to explicitly define the carousel */}
//       <section
//         aria-label="Hero Image Carousel"
//         aria-roledescription="carousel"
//         className="relative w-full min-h-[100dvh] lg:h-screen flex flex-col overflow-hidden"
//         onMouseEnter={() => setPaused(true)}
//         onMouseLeave={() => setPaused(false)}
//       >
//         {slides.map((s, i) => (
//           <div
//             key={s.id}
//             aria-hidden="true"
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === cur ? "opacity-100 z-0" : "opacity-0 -z-10"}`}
//             style={{ background: s.bg }}
//           />
//         ))}

//         {/* ✅ A11Y: Hidden decorative backdrop blur */}
//         <div aria-hidden="true" className="absolute inset-0 bg-white/20 backdrop-blur-[2px] pointer-events-none z-0" />

//         {/* FIX: Removed key={animKey} from here so image doesn't reset rotation */}
//         <div className="relative z-10 flex-grow flex items-center w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-24 pb-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
//             {/* FIX: Added key={animKey} here so only text animates */}
//             <div
//               key={animKey}
//               aria-live="polite"
//               aria-atomic="true"
//               className="flex flex-col justify-center mt-4 lg:mt-0"
//             >
//               {/* NEW COLORS */}
//               <h1 className="animate-slide-up delay-100 text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.05] mb-4 tracking-wide text-[#7A3D2A]">
//                 <span className="block">{slide.title[0]}</span>
//                 <span
//                   className="block text-transparent bg-clip-text mt-1 pb-1"
//                   style={{
//                     backgroundImage: `linear-gradient(to right, ${slide.accentGold}, #BE6E5B)`,
//                   }}
//                 >
//                   {slide.title[1]}
//                 </span>
//               </h1>

//               <p className="animate-slide-up delay-200 text-xs lg:text-sm leading-relaxed mb-6 lg:mb-8 tracking-wide text-[#a07f61] max-w-md font-medium">
//                 {slide.sub}
//               </p>

//               <div className="animate-slide-up delay-300 flex flex-wrap gap-3">
//                 <Link
//                   href="/products"
//                   className="px-6 py-2.5 lg:px-7 lg:py-3 rounded-lg font-bold text-[9px] lg:text-[10px] tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
//                   style={{
//                     background: `linear-gradient(135deg, ${slide.accentGold}, #BE6E5B)`,
//                     color: "#FDF7F2",
//                   }}
//                 >
//                   Explore Collection <span aria-hidden="true">→</span>
//                 </Link>
//                 <Link
//                   href="/contact"
//                   className="px-6 py-2.5 lg:px-7 lg:py-3 rounded-lg font-bold text-[9px] lg:text-[10px] tracking-widest uppercase bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
//                   style={{
//                     border: `1px solid ${slide.accentGold}`,
//                     color: slide.accentGold,
//                   }}
//                 >
//                   Get Wholesale Price
//                 </Link>
//               </div>
//             </div>

//             <div className="relative flex items-center justify-center h-[280px] md:h-[350px] lg:h-[450px]">
//               <div className="relative w-full h-full max-w-[280px] md:max-w-[350px] lg:max-w-[420px]">
//                 {/* ✅ A11Y: Hidden decorative spinning rings */}
//                 <div
//                   aria-hidden="true"
//                   className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none spin-slow"
//                   style={{
//                     border: `1px solid ${slide.accentGold}`,
//                     opacity: 0.6,
//                     transform: "scale(1.05)",
//                   }}
//                 />
//                 <div
//                   aria-hidden="true"
//                   className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none spin-slowR"
//                   style={{
//                     border: `1px solid ${slide.accentGold}`,
//                     opacity: 0.3,
//                     transform: "scale(1.1)",
//                   }}
//                 />

//                 {/* FIX: Added spin-slow conditionally for cur === 0 */}
//                 <div
//                   className={`absolute inset-4 md:inset-5 rounded-full overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-700 bg-white ${cur === 0 ? "spin-slow" : ""}`}
//                 >
//                   <Image
//                     src={slide.img}
//                     alt={slide.imgAlt}
//                     fill
//                     className="object-cover"
//                     sizes="(max-width:1024px) 300px, 450px"
//                     priority
//                   />
//                 </div>

//                 <button
//                   onClick={() => goTo(cur - 1)}
//                   aria-label="Previous slide"
//                   className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-20 w-8 h-8 lg:w-10 lg:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-base lg:text-lg font-bold"
//                   style={{ color: slide.accentGold }}
//                 >
//                   <span aria-hidden="true">❮</span>
//                 </button>

//                 <button
//                   onClick={() => goTo(cur + 1)}
//                   aria-label="Next slide"
//                   className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-20 w-8 h-8 lg:w-10 lg:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-base lg:text-lg font-bold"
//                   style={{ color: slide.accentGold }}
//                 >
//                   <span aria-hidden="true">❯</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="relative z-20 w-full bg-gradient-to-t from-black/5 to-transparent pt-4 pb-6 mt-auto">
//           {/* ✅ A11Y: Added aria-label to the thumbnail navigation group */}
//           <nav aria-label="Carousel slide selector" className="max-w-7xl mx-auto px-4 lg:px-12">
//             <div className="flex md:justify-center gap-3 lg:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
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
















































"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: ["Global Wholesale", "Regal Heritage"],
    sub: "India's premier export house for high-end ethnic wear. Discover the pinnacle of Kurti craftsmanship and designer suits.",
    img: "/images/ROLARIMAGES.png",
    imgAlt: "Sanwariyas Global Wholesale Hub – Premium Indian Ethnic Wear",
    bg: "radial-gradient(ellipse at 90% 10%, #F2D9C3 0%, #F2D9C3 25%, #E0BFA2 60%, #C9A485 100%)",
    accentGold: "#8B6508",
    badge: "Export House",
  },
  {
    id: 2,
    title: ["Exquisite Handwoven", "Bridal Masterpieces"],
    sub: "Intricately stitched lehengas and sarees crafted for your most unforgettable moments. A legacy of pure luxury.",
    img: "https://images.unsplash.com/photo-1769063382670-823451e5a7ef?q=80&w=687&auto=format&fit=crop",
    imgAlt: "Premium Handwoven Bridal Lehengas and Sarees – Luxury Indian Couture",
    bg: "linear-gradient(145deg, #F2D9C3 0%, #F2D9C3 30%, #E0BFA2 55%, #B8996E 100%)",
    accentGold: "#996515",
    badge: "Bridal Couture",
  },
  {
    id: 3,
    title: ["Timeless Grace", "Contemporary Suits"],
    sub: "Redefining the standard of ethnic fashion. Designer Anarkalis and cord sets tailored for the modern woman.",
    img: "https://images.unsplash.com/photo-1767687718046-bf05d7243259?q=80&w=687&auto=format&fit=crop",
    imgAlt: "Designer Anarkali Suits and Ethnic Cord Sets – Modern Indian Fashion",
    bg: "linear-gradient(180deg, #F2D9C3 0%, #EDD0B5 15%, #E0BFA2 45%, #C4A07A 100%)",
    accentGold: "#6B4226",
    badge: "Designer Suits",
  },
  {
    id: 4,
    title: ["Craftsmanship In", "Every Single Thread"],
    sub: "Directly sourced from India's master weavers. Fabrics that carry the soul and heritage of our rich culture.",
    img: "https://images.unsplash.com/photo-1765529375039-13dabeab0684?q=80&w=687&auto=format&fit=crop",
    imgAlt: "Artisan Hand-Stitched Indian Fabrics – Heritage Weaving",
    bg: "radial-gradient(circle at 40% 60%, #F2D9C3 0%, #EDD4B8 30%, #E0BFA2 55%, #BEA07A 100%)",
    accentGold: "#8B6508",
    badge: "Artisan Craft",
  },
  {
    id: 5,
    title: ["Tailored Exclusively", "For Your Vision"],
    sub: "Personalised luxury at wholesale rates. We customize every stitch to your specific measurements and occasion.",
    img: "https://plus.unsplash.com/premium_photo-1687485793889-9402fd58b544?q=80&w=687&auto=format&fit=crop",
    imgAlt: "Custom Tailored Ethnic Wear – Personalized Indian Fashion",
    bg: "linear-gradient(0deg, #F2D9C3 0%, #EAC9A8 20%, #E0BFA2 50%, #C2956A 100%)",
    accentGold: "#6B4226",
    badge: "Custom Orders",
  },
  {
    id: 6,
    title: ["Global Luxury", "Seamless Delivery"],
    sub: "Exporting Indian excellence to the world. Fully insured, securely packaged, and delivered with royal care.",
    img: "https://plus.unsplash.com/premium_photo-1668443423052-81d51888646d?q=80&w=687&auto=format&fit=crop",
    imgAlt: "Global Indian Ethnic Wear Export – Worldwide Delivery",
    bg: "linear-gradient(90deg, #C4A07A 0%, #E0BFA2 40%, #EDD0B5 65%, #F2D9C3 100%)",
    accentGold: "#996515",
    badge: "Worldwide Export",
  },
  {
    id: 7,
    title: ["Premium Partner", "Bulk Order Luxury"],
    sub: "Partner with India's most trusted export empire. Scalable solutions for global retailers and luxury boutiques.",
    img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=687&auto=format&fit=crop",
    imgAlt: "Wholesale Bulk Orders – Indian Ethnic Wear for Retailers",
    bg: "linear-gradient(225deg, #F2D9C3 0%, #EAC9A8 35%, #E0BFA2 65%, #B8916A 100%)",
    accentGold: "#8B6508",
    badge: "Wholesale",
  },
];

/* ─────────────── STYLES ─────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Cinzel:wght@400;600;700&family=Nunito+Sans:wght@300;400;600&display=swap');

  :root {
    --gold-primary: #8B6508;
    --cream-light: #F2D9C3;
    --cream-mid: #E0BFA2;
    --brown-dark: #7A3D2A;
  }

  /* ── Entrance animations ── */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
  @keyframes fadeSlideLeft {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes subtleFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lineReveal {
    from { width: 0; }
    to   { width: 60px; }
  }
  @keyframes badgePop {
    0%   { opacity: 0; transform: translateY(-12px) scale(0.85); }
    70%  { transform: translateY(2px) scale(1.03); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  .anim-title   { animation: fadeSlideUp  0.85s cubic-bezier(0.22,1,0.36,1) forwards; opacity: 0; }
  .anim-sub     { animation: fadeSlideUp  0.85s cubic-bezier(0.22,1,0.36,1) 0.18s forwards; opacity: 0; }
  .anim-btns    { animation: fadeSlideUp  0.85s cubic-bezier(0.22,1,0.36,1) 0.32s forwards; opacity: 0; }
  .anim-stats   { animation: fadeSlideUp  0.85s cubic-bezier(0.22,1,0.36,1) 0.46s forwards; opacity: 0; }
  .anim-img     { animation: fadeSlideLeft 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s forwards; opacity: 0; }
  .anim-badge   { animation: badgePop     0.7s cubic-bezier(0.22,1,0.36,1) 0.55s forwards; opacity: 0; }
  .anim-line    { animation: lineReveal   0.7s cubic-bezier(0.22,1,0.36,1) 0.15s forwards; }

  /* ── Orbit / ring spins ── */
  @keyframes spinSlow  { to { transform: rotate(360deg); } }
  @keyframes spinSlowR { to { transform: rotate(-360deg); } }
  .spin-slow  { animation: spinSlow  35s linear infinite; }
  .spin-slowR { animation: spinSlowR 40s linear infinite; }

  /* ── Slide progress bar ── */
  @keyframes slideProgress { from { width: 0%; } to { width: 100%; } }

  /* ── Shimmer on CTA button ── */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .btn-shimmer {
    background-size: 200% auto;
    transition: background-position 0s;
  }
  .btn-shimmer:hover {
    animation: shimmer 1.6s linear infinite;
  }

  /* ── Floating orbs on image ring ── */
  @keyframes floatOrb {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-8px) scale(1.06); }
  }
  .float-orb { animation: floatOrb 3.5s ease-in-out infinite; }
  .float-orb-delay { animation: floatOrb 3.5s ease-in-out 1.8s infinite; }

  /* ── Scroll indicator bounce ── */
  @keyframes scrollBounce {
    0%, 100% { transform: translateY(0) translateX(-50%); opacity: 0.6; }
    50%       { transform: translateY(7px) translateX(-50%); opacity: 1; }
  }
  .scroll-bounce { animation: scrollBounce 2s ease-in-out infinite; }

  /* ── Grain texture overlay ── */
  .grain-overlay {
    position: absolute; inset: 0; pointer-events: none; z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
    mix-blend-mode: overlay;
  }

  /* ── Diagonal decorative line ── */
  .deco-line {
    position: absolute;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(139,101,8,0.25), transparent);
  }

  /* ── Number counter shine ── */
  .stat-num {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  /* ── Thumbnail card hover lift ── */
  .thumb-card {
    transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease;
  }
  .thumb-card:hover { transform: scale(1.08) translateY(-3px) !important; box-shadow: 0 12px 32px rgba(0,0,0,0.18); }

  /* ── Nav dot indicator ── */
  .dot-active {
    transition: width 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s;
  }

  /* hide scrollbar */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

/* ─────────────── SUB-COMPONENTS ─────────────── */

/** Decorative floating corner ornament */
const CornerOrnament = ({ accentGold }) => (
  <svg aria-hidden="true" width="60" height="60" viewBox="0 0 60 60" fill="none" className="opacity-30">
    <path d="M4 4 L56 4 L56 8 M4 4 L4 56 L8 56" stroke={accentGold} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="4" cy="4" r="2.5" fill={accentGold}/>
  </svg>
);

/** Animated stat pill */
const StatPill = ({ value, label, accentGold }) => (
  <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm">
    <span className="stat-num text-lg lg:text-xl" style={{ color: accentGold }}>{value}</span>
    <span className="text-[9px] lg:text-[10px] uppercase tracking-widest text-[#a07f61] font-semibold mt-0.5">{label}</span>
  </div>
);

/** Slide thumbnail card */
const SlideCard = ({ slide, isActive, onClick, accentGold, paused, animKey }) => (
  <button
    onClick={onClick}
    aria-current={isActive ? "true" : "false"}
    aria-label={`View slide: ${slide.title[0]} ${slide.title[1]}`}
    className="thumb-card relative flex-shrink-0 w-[100px] h-[132px] lg:w-[122px] lg:h-[148px] rounded-xl overflow-hidden snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
    style={{
      backgroundImage: `url('${slide.img}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      border: isActive ? `2px solid ${accentGold}` : "2px solid rgba(255,255,255,0.3)",
      opacity: isActive ? 1 : 0.6,
      transform: isActive ? "scale(1.06) translateY(-3px)" : "scale(1)",
      boxShadow: isActive ? `0 8px 28px rgba(0,0,0,0.22), 0 0 0 3px ${accentGold}22` : "0 4px 12px rgba(0,0,0,0.12)",
    }}
  >
    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

    {/* Badge label */}
    {isActive && (
      <div
        className="absolute top-2 left-2 z-20 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-widest text-white"
        style={{ background: accentGold }}
      >
        {slide.badge}
      </div>
    )}

    <div className="relative h-full flex flex-col justify-end p-2.5 z-10 text-left pb-4">
      <p className="text-[9.5px] lg:text-[10.5px] font-bold leading-tight line-clamp-2 text-white">
        {slide.title[0]} {slide.title[1]}
      </p>
    </div>

    {isActive && (
      <div
        key={animKey}
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[3px] z-20 rounded-b-xl"
        style={{
          background: `linear-gradient(to right, ${accentGold}, #BE6E5B)`,
          animation: "slideProgress 5000ms linear forwards",
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    )}
  </button>
);

/* ─────────────── MAIN COMPONENT ─────────────── */
export default function HeroSection() {
  const [cur, setCur] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (n) => {
      const next = ((n % slides.length) + slides.length) % slides.length;
      if (next === cur) return;
      setCur(next);
      setAnimKey((k) => k + 1);
    },
    [cur],
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => goTo(cur + 1), 5000);
    return () => clearTimeout(timerRef.current);
  }, [cur, paused, goTo]);

  const slide = slides[cur];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── SEO: Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Sanwariyas Global Wholesale",
            description: "India's premier export house for high-end ethnic wear, Kurtis, designer suits, and bridal couture.",
            url: "https://sanwariyas.com",
            sameAs: [],
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "INR",
              offerCount: "500+",
              description: "Wholesale bulk orders for Indian ethnic wear",
            },
          }),
        }}
      />

      <section
        aria-label="Sanwariyas Global Wholesale – Premium Indian Ethnic Wear"
        aria-roledescription="carousel"
        itemScope
        itemType="https://schema.org/WPHeader"
        className="relative w-full min-h-[100dvh] lg:h-screen flex flex-col overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* ── Background transitions ── */}
        {slides.map((s, i) => (
          <div
            key={s.id}
            aria-hidden="true"
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === cur ? "opacity-100 z-0" : "opacity-0 -z-10"}`}
            style={{ background: s.bg }}
          />
        ))}

        {/* ── Grain texture ── */}
        <div aria-hidden="true" className="grain-overlay" />

        {/* ── Subtle backdrop ── */}
        <div aria-hidden="true" className="absolute inset-0 bg-white/15 backdrop-blur-[1px] pointer-events-none z-0" />

        {/* ── Vertical decorative line left ── */}
        <div aria-hidden="true" className="deco-line hidden lg:block h-3/4 top-[12%] left-[8%] z-10" />
        {/* ── Vertical decorative line right ── */}
        <div aria-hidden="true" className="deco-line hidden lg:block h-1/2 top-[25%] right-[8%] z-10" />

        {/* ── Corner ornaments ── */}
        <div aria-hidden="true" className="absolute top-4 left-4 z-10 hidden lg:block">
          <CornerOrnament accentGold={slide.accentGold} />
        </div>
        <div aria-hidden="true" className="absolute top-4 right-4 z-10 hidden lg:block rotate-90">
          <CornerOrnament accentGold={slide.accentGold} />
        </div>

        {/* ── Slide counter top-right ── */}
        <div
          aria-hidden="true"
          className="absolute top-6 right-6 z-20 hidden lg:flex items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#a07f61]">
            {String(cur + 1).padStart(2, "0")}
          </span>
          <div className="w-10 h-px bg-[#C9A485]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A485]">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        {/* ── Main content grid ── */}
        <div className="relative z-10 flex-grow flex items-center w-full max-w-7xl mx-auto px-6 lg:px-14 pt-20 lg:pt-24 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">

            {/* LEFT – Text block */}
            <div
              key={animKey}
              aria-live="polite"
              aria-atomic="true"
              className="flex flex-col justify-center mt-4 lg:mt-0 order-2 lg:order-1"
            >
              {/* Eyebrow badge */}
              <div className="anim-badge flex items-center gap-3 mb-5">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.22em] font-bold text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${slide.accentGold}, #BE6E5B)` }}
                >
                  <svg aria-hidden="true" width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="white"/></svg>
                  {slide.badge}
                </span>
                <div
                  className="anim-line h-px flex-shrink-0"
                  style={{ background: `linear-gradient(to right, ${slide.accentGold}, transparent)` }}
                />
              </div>

              {/* Headline */}
              <h1
                className="anim-title text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.04] mb-2 tracking-wide text-[#7A3D2A]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                itemProp="headline"
              >
                <span className="block">{slide.title[0]}</span>
                <span
                  className="block italic mt-1 pb-1 text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(110deg, ${slide.accentGold} 0%, #BE6E5B 60%, ${slide.accentGold} 100%)`,
                  }}
                >
                  {slide.title[1]}
                </span>
              </h1>

              {/* Thin rule */}
              <div
                aria-hidden="true"
                className="mb-5 h-px w-16 rounded-full opacity-50"
                style={{ background: slide.accentGold }}
              />

              {/* Sub-description */}
              <p
                className="anim-sub text-xs lg:text-sm leading-[1.8] mb-6 lg:mb-8 tracking-wide text-[#a07f61] max-w-md"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                itemProp="description"
              >
                {slide.sub}
              </p>

              {/* CTA Buttons */}
              <div className="anim-btns flex flex-wrap gap-3 mb-8">
                <Link
                  href="/products"
                  aria-label="Explore our ethnic wear collection"
                  className="btn-shimmer group relative inline-flex items-center gap-2 px-6 py-3 lg:px-8 lg:py-3.5 rounded-xl font-bold text-[9.5px] lg:text-[10.5px] tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${slide.accentGold} 0%, #BE6E5B 50%, ${slide.accentGold} 100%)`,
                    color: "#FDF7F2",
                  }}
                >
                  {/* shimmer layer */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)", backgroundSize: "200% auto" }}
                  />
                  <span className="relative">Explore Collection</span>
                  <span aria-hidden="true" className="relative transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>

                <Link
                  href="/contact"
                  aria-label="Get wholesale pricing for bulk orders"
                  className="group inline-flex items-center gap-2 px-6 py-3 lg:px-8 lg:py-3.5 rounded-xl font-bold text-[9.5px] lg:text-[10.5px] tracking-widest uppercase bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:-translate-y-1"
                  style={{
                    border: `1.5px solid ${slide.accentGold}`,
                    color: slide.accentGold,
                  }}
                >
                  Get Wholesale Price
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 opacity-60">↗</span>
                </Link>
              </div>

              {/* Stats row */}
              <div className="anim-stats flex items-center gap-3 flex-wrap">
                <StatPill value="500+" label="Designs" accentGold={slide.accentGold} />
                <StatPill value="50+" label="Countries" accentGold={slide.accentGold} />
                <StatPill value="15K+" label="Orders" accentGold={slide.accentGold} />
              </div>
            </div>

            {/* RIGHT – Image orb */}
            <div
              key={`img-${cur}`}
              className="anim-img relative flex items-center justify-center h-[280px] md:h-[360px] lg:h-[460px] order-1 lg:order-2"
            >
              <div className="relative w-full h-full max-w-[280px] md:max-w-[360px] lg:max-w-[430px]">

                {/* Outer glow ring */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    boxShadow: `0 0 60px 15px ${slide.accentGold}22, inset 0 0 40px ${slide.accentGold}11`,
                    transition: "box-shadow 0.7s ease",
                  }}
                />

                {/* Spinning rings */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full pointer-events-none spin-slow"
                  style={{ border: `1px solid ${slide.accentGold}`, opacity: 0.5, transform: "scale(1.07)" }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full pointer-events-none spin-slowR"
                  style={{ border: `1px dashed ${slide.accentGold}`, opacity: 0.25, transform: "scale(1.13)" }}
                />

                {/* Floating accent orbs on ring */}
                <div
                  aria-hidden="true"
                  className="float-orb absolute top-[5%] right-[8%] w-3 h-3 rounded-full shadow-lg z-20"
                  style={{ background: `radial-gradient(circle, white, ${slide.accentGold})` }}
                />
                <div
                  aria-hidden="true"
                  className="float-orb-delay absolute bottom-[8%] left-[5%] w-2 h-2 rounded-full shadow-md z-20"
                  style={{ background: `radial-gradient(circle, white, #BE6E5B)` }}
                />

                {/* Main image circle */}
                <div
                  className={`absolute inset-4 md:inset-5 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-all duration-700 bg-white ${cur === 0 ? "spin-slow" : ""}`}
                >
                  <Image
                    src={slide.img}
                    alt={slide.imgAlt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width:1024px) 300px, 460px"
                    priority
                    fetchPriority="high"
                  />
                  {/* Inner vignette */}
                  <div aria-hidden="true" className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(139,101,8,0.08)]" />
                </div>

                {/* Floating tag on image */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold text-white shadow-xl whitespace-nowrap"
                  style={{ background: `linear-gradient(135deg, ${slide.accentGold}, #BE6E5B)` }}
                >
                  ✦ Made in India ✦
                </div>

                {/* Nav arrows */}
                <button
                  onClick={() => goTo(cur - 1)}
                  aria-label="Previous slide"
                  className="group absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 lg:-translate-x-10 z-20 w-9 h-9 lg:w-11 lg:h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-white/60"
                  style={{ color: slide.accentGold }}
                >
                  <span aria-hidden="true" className="text-base lg:text-lg font-bold transition-transform duration-300 group-hover:-translate-x-0.5">❮</span>
                </button>

                <button
                  onClick={() => goTo(cur + 1)}
                  aria-label="Next slide"
                  className="group absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 lg:translate-x-10 z-20 w-9 h-9 lg:w-11 lg:h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-white/60"
                  style={{ color: slide.accentGold }}
                >
                  <span aria-hidden="true" className="text-base lg:text-lg font-bold transition-transform duration-300 group-hover:translate-x-0.5">❯</span>
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* ── Thumbnail strip + dot nav ── */}
        <div className="relative z-20 w-full bg-gradient-to-t from-black/8 to-transparent pt-4 pb-6 mt-auto">
          <nav aria-label="Carousel slide selector" className="max-w-7xl mx-auto px-4 lg:px-14">
            {/* Dot indicators */}
            <div aria-hidden="true" className="flex justify-center gap-1.5 mb-3">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="dot-active rounded-full h-1.5 transition-all duration-400"
                  style={{
                    width: i === cur ? "24px" : "6px",
                    background: i === cur ? slide.accentGold : "#C9A485",
                    opacity: i === cur ? 1 : 0.45,
                  }}
                />
              ))}
            </div>

            {/* Thumbnail cards */}
            <div className="flex md:justify-center gap-2.5 lg:gap-3.5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
              {slides.map((s, index) => (
                <SlideCard
                  key={s.id}
                  slide={s}
                  isActive={index === cur}
                  onClick={() => goTo(index)}
                  accentGold={s.accentGold}
                  paused={paused}
                  animKey={animKey}
                />
              ))}
            </div>
          </nav>
        </div>
      </section>
    </>
  );
}