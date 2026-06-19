// // FILE: client/src/components/home/ManufacturingInfoSections.js
// "use client";

// import Link from "next/link";

// const VIDEO_STEPS = [
//   {
//     title: "Fabric Selection",
//     label: "01",
//     src: "https://www.w3schools.com/html/mov_bbb.mp4",
//     // 👉 later replace with: "/videos/fabric.mp4"
//   },
//   {
//     title: "Cutting & Stitching",
//     label: "02",
//     src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
//     // 👉 later replace with: "/videos/stitching.mp4"
//   },
//   {
//     title: "Finishing Check",
//     label: "03",
//     src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
//     // 👉 later replace with: "/videos/finishing.mp4"
//   },
// ];

// const REVIEWS = [
//   {
//     quote: "Very good wholesale quality. Stitching and finishing both are neat.",
//     name: "N P",
//   },
//   {
//     quote: "Authentic fabric, reliable team, and smooth online shopping experience.",
//     name: "Pia Kokare",
//   },
//   {
//     quote: "Collection is very good and prices are comfortable for bulk orders.",
//     name: "Tamil Mathi",
//   },
//   {
//     quote: "Affordable fabric with very good customer support for every order.",
//     name: "Soorya S S",
//   },
//   {
//     quote: "SANWARIYAS has vibrant prints, fresh patterns, and great designs.",
//     name: "Akshay Sharma",
//   },
// ];

// function VideoTile({ step }) {
//   return (
//     <article className="group relative min-h-[200px] overflow-hidden rounded-2xl border border-[#BE6E5B]/25 bg-[#7A3D2A] shadow-[0_18px_48px_rgba(122,61,42,0.18)]">

//       <video
//         aria-label={`Video showing ${step.title}`}
//         className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
//         src={step.src}
//         muted
//         loop
//         playsInline
//         autoPlay
//         preload="auto"
//         onError={(e) => {
//           e.currentTarget.style.display = "none";
//         }}
//       />

//       {/* Fallback if video fails */}
//       <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-white text-sm opacity-70">
//         Video Loading...
//       </div>

//       {/* Overlay */}
//       <div
//         aria-hidden="true"
//         className="absolute inset-0 bg-gradient-to-t from-[#5C3120]/70 via-[#7A3D2A]/10 to-transparent pointer-events-none"
//       />

//       {/* Inner border on hover */}
//       <div aria-hidden="true"
//         className="absolute inset-2 border border-[#BE6E5B]/0 group-hover:border-[#BE6E5B]/50 transition-all duration-700 z-20 pointer-events-none rounded-xl"/>

//       <div className="relative z-10 flex h-full min-h-[200px] flex-col justify-between p-5 text-[#FDF7F2] pointer-events-none">
//         <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F2D9C3]/55 bg-[#FDF7F2]/15 font-display text-lg font-bold">
//           {step.label}
//         </span>

//         <div>
//           <p className="mb-2 font-sans text-[9px] font-bold uppercase tracking-[0.35em] text-[#F2D9C3]/80">
//             Manufacturing
//           </p>
//           <h3 className="font-display text-2xl font-semibold leading-tight">
//             {step.title}
//           </h3>
//         </div>
//       </div>
//     </article>
//   );
// }

// function StarRating() {
//   return (
//     <div className="mb-5 flex justify-center gap-1.5 text-sm text-[#BE6E5B]" aria-label="5 star rating">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <span key={star} aria-hidden="true">
//           {"\u2605"}
//         </span>
//       ))}
//     </div>
//   );
// }

// function ReviewCard({ review }) {
//   return (
//     <article className="flex flex-col justify-between rounded-2xl border border-[#BE6E5B]/25 bg-[#FDF7F2] px-4 py-5 text-center shadow-[0_8px_24px_rgba(122,61,42,0.09)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(122,61,42,0.16)] hover:border-[#BE6E5B]/50">
//       <StarRating />
//       <p className="mx-auto max-w-[11rem] font-sans text-[13px] leading-[1.6] text-[#5C3120] flex-1">
//         {review.quote}
//       </p>
//       <div className="mt-4 pt-4 border-t border-[#BE6E5B]/15">
//         <p className="font-sans text-[13px] text-[#7A3D2A] font-semibold">{review.name}</p>
//         <p className="font-sans text-[10px] text-[#BE6E5B] tracking-[0.2em] uppercase mt-0.5">Happy Customer</p>
//       </div>
//     </article>
//   );
// }

// export default function ManufacturingInfoSections() {
//   return (
//     <>
//       {/* ── Manufacturing Section ── */}
//       <section
//         aria-labelledby="custom-manufacturing-heading"
//         className="relative overflow-hidden py-20 md:py-28"
//         style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F8EDE6 100%)" }}
//       >
//         <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/35 to-transparent" />
//         <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/35 to-transparent" />
//         <div aria-hidden="true" className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)", backgroundSize: "34px 34px" }} />

//         <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1fr] lg:gap-20 lg:px-8">

//           {/* Left: Text */}
//           <div>
//             <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.62em] text-[#BE6E5B]">
//               Custom Production
//             </p>
//             <h2
//               id="custom-manufacturing-heading"
//               className="font-display text-4xl font-bold leading-[1.12] text-[#7A3D2A] md:text-5xl lg:text-6xl"
//             >
//               Journey from{" "}
//               <span className="text-[#BE6E5B]">imagination</span>
//               <br />
//               <span className="text-[#BE6E5B]">to reality</span> - Kurtis
//             </h2>

//             <div aria-hidden="true" className="flex items-center gap-3 mt-7">
//               <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-[#BE6E5B] to-transparent" />
//               <span className="text-[#BE6E5B] text-base animate-pulse">✦</span>
//             </div>

//             <p className="mt-6 max-w-2xl font-sans text-base leading-8 text-[#251815] md:text-lg">
//               At SANWARIYAS, every idea is shaped with careful fabric selection,
//               clean cutting, skilled stitching, and final quality checks. Share
//               your design, size set, color preference, or wholesale requirement,
//               and our team will curate production-ready pieces for your store.
//             </p>

//             {/* ── Consistent CTA button ── */}
//             {/* <Link
//               href="/products"
//               className="group relative mt-10 inline-flex items-center gap-2.5 border-2 border-[#7A3D2A] text-[#7A3D2A] font-sans text-[10px] tracking-[0.3em] uppercase font-bold px-8 py-3.5 rounded-xl hover:text-[#FDF7F2] transition-colors duration-500 overflow-hidden"
//             >
//               <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#7A3D2A] to-[#BE6E5B] -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10" />
//               <span className="relative z-10">Shop Wholesale Kurtis</span>
//               <span aria-hidden="true" className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
//             </Link> */}
//           </div>

//           {/* Right: Video tiles */}
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div className="sm:pt-10">
//               <VideoTile step={VIDEO_STEPS[0]} />
//             </div>
//             <div className="grid gap-4">
//               <VideoTile step={VIDEO_STEPS[1]} />
//               <VideoTile step={VIDEO_STEPS[2]} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Reviews Section ── */}
//       <section
//         aria-labelledby="customer-reviews-heading"
//         className="relative overflow-hidden py-20 md:py-28"
//         style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)" }}
//       >
//         <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />
//         <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />
//         <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg,#BE6E5B 0,#BE6E5B 1px,transparent 0,transparent 36px)", backgroundSize: "36px 36px" }} />

//         <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//           {/* Header */}
//           <header className="mb-12 text-center md:mb-16">
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
//               What Buyers Say
//             </p>
//             <h2
//               id="customer-reviews-heading"
//               className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] leading-tight drop-shadow-sm"
//             >
//               Customer Reviews for Wholesale Kurtis
//             </h2>
//             <div aria-hidden="true" className="flex items-center justify-center gap-4 mt-6">
//               <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//               <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
//               <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//             </div>
//           </header>

//           {/* Grid: aside + 5 review cards */}
//           <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 items-stretch">

//             {/* Stats aside */}
//             <aside className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#7A3D2A] to-[#5C3120] px-5 py-5 text-[#FDF7F2] shadow-[0_18px_48px_rgba(122,61,42,0.22)] border border-[#BE6E5B]/20">
//               <p className="font-sans text-[9px] uppercase tracking-[0.4em] text-[#F2D9C3]/70 font-bold mb-3">Verified Buyers</p>
//               <p className="font-display text-xl font-bold leading-snug">
//                 Real feedback
//                 <br />
//                 from global
//                 <br />
//                 wholesale buyers
//               </p>
//               <div aria-hidden="true" className="mt-4 h-px w-10 bg-[#BE6E5B]/60" />
//               <div className="mt-3">
//                 <p className="font-sans text-base font-bold text-[#F2D9C3]">4.8 average</p>
//                 <p className="font-sans text-xs font-normal text-[#F2D9C3]/70 mt-0.5">136+ reviews</p>
//               </div>
//             </aside>

//             {REVIEWS.map((review) => (
//               <ReviewCard key={review.name} review={review} />
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// FILE: client/src/components/home/ManufacturingInfoSections.js
"use client";

import Link from "next/link";

const VIDEO_STEPS = [
  {
    title: "Fabric Selection",
    label: "01",
    desc: "Premium fabrics sourced directly from certified mills in Surat, Varanasi & Jaipur.",
    src: "/videos/fabricSelection.mp4",
  },
  {
    title: "Cutting & Stitching",
    label: "02",
    desc: "CAD-guided precision cutting and skilled artisan stitching for every piece.",
    src: "/videos/cutting&stiching.mp4",
  },
  {
    title: "Finishing Check",
    label: "03",
    desc: "4-step quality inspection before every order leaves our facility.",
    src: "/videos/finishingCheck.mp4",
  },
];

const REVIEWS = [
  { quote: "Very good wholesale quality. Stitching and finishing both are neat.",            name: "N P"           },
  { quote: "Authentic fabric, reliable team, and smooth online shopping experience.",        name: "Pia Kokare"    },
  { quote: "Collection is very good and prices are comfortable for bulk orders.",            name: "Tamil Mathi"   },
  { quote: "Affordable fabric with very good customer support for every order.",             name: "Soorya S S"    },
  { quote: "SANWARIYAS has vibrant prints, fresh patterns, and great designs.",              name: "Akshay Sharma" },
];

// ── Video tile — ALL 3 NOW HAVE THE EXACT SAME TALL PORTRAIT (INSTA) SHAPE AND REDUCED SIZE ──
function VideoTile({ step }) {
  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-[#BE6E5B]/25 bg-[#5C3120] shadow-[0_14px_40px_rgba(92,49,32,0.20)] aspect-[3/4] w-full max-w-[200px] md:max-w-[220px] mx-auto"
    >
      {/* Video */}
      <video
        aria-label={`Video showing ${step.title}`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        src={step.src}
        muted loop playsInline autoPlay preload="auto"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />

      {/* Fallback */}
      <div aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-[#F2D9C3]/40 text-xs font-sans tracking-widest uppercase pointer-events-none">
        Loading…
      </div>

      {/* Bottom-to-top gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(92,49,32,0.90) 0%, rgba(92,49,32,0.35) 45%, rgba(92,49,32,0.08) 100%)",
        }}
      />

      {/* Inner border on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-2 border border-[#BE6E5B]/0 group-hover:border-[#BE6E5B]/50 transition-all duration-700 z-20 pointer-events-none rounded-xl"
      />

      {/* Content — bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-6 pointer-events-none">
        {/* Step pill + line */}
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#F2D9C3]/40 bg-[#FDF7F2]/12 font-display text-sm font-bold text-[#FDF7F2] flex-shrink-0">
            {step.label}
          </span>
          <div className="h-px w-6 bg-[#BE6E5B]/60 group-hover:w-12 transition-all duration-700" />
          <p className="font-sans text-[9px] font-bold uppercase tracking-[0.38em] text-[#F2D9C3]/65">
            Manufacturing
          </p>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold leading-tight text-[#FDF7F2] drop-shadow-md mb-1.5"
          style={{ fontSize: "clamp(1.1rem,2vw,1.5rem)" }}>
          {step.title}
        </h3>

        {/* Description — only shown on tall tile or on hover for small */}
        <p className="font-sans text-[12px] text-[#F2D9C3]/70 leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {step.desc}
        </p>
      </div>
    </article>
  );
}

function StarRating() {
  return (
    <div className="mb-4 flex justify-center gap-1" aria-label="5 star rating">
      {[1,2,3,4,5].map((s) => (
        <span key={s} aria-hidden="true" className="text-[#BE6E5B] text-sm">★</span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#BE6E5B]/22 bg-[#FDF7F2] px-5 py-6 text-center shadow-[0_6px_20px_rgba(122,61,42,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(122,61,42,0.14)] hover:border-[#BE6E5B]/48 group">
      <StarRating />
      <div aria-hidden="true" className="text-[#BE6E5B]/18 font-serif text-4xl leading-none mb-2 font-black group-hover:text-[#BE6E5B]/28 transition-colors duration-400">"</div>
      <p className="mx-auto max-w-[13rem] font-sans text-[13px] leading-[1.65] text-[#5C3120] flex-1">
        {review.quote}
      </p>
      <div className="mt-5 pt-4 border-t border-[#BE6E5B]/15">
        <p className="font-sans text-[13px] text-[#7A3D2A] font-bold">{review.name}</p>
        <p className="font-sans text-[9.5px] text-[#BE6E5B] tracking-[0.22em] uppercase mt-0.5 font-semibold">Verified Buyer</p>
      </div>
    </article>
  );
}

export default function ManufacturingInfoSections() {
  return (
    <>
      {/* ══════════════════════════════════════════
          MANUFACTURING SECTION
      ══════════════════════════════════════════ */}
      <section
        aria-labelledby="custom-manufacturing-heading"
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F8EDE6 100%)" }}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/35 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/35 to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)", backgroundSize: "34px 34px" }} />

        {/* Large decorative watermark */}
        <div aria-hidden="true"
          className="absolute right-8 bottom-8 font-display font-black text-[#7A3D2A]/[0.025] leading-none select-none pointer-events-none hidden xl:block"
          style={{ fontSize: "clamp(10rem, 14vw, 14rem)" }}>
          01
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1fr] lg:gap-20 lg:px-8">

          {/* ── Left: Text ── */}
          <div className="lg:sticky lg:top-24">
            <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.62em] text-[#BE6E5B]">
              Custom Production
            </p>
            <h2
              id="custom-manufacturing-heading"
              className="font-display text-4xl font-bold leading-[1.1] text-[#7A3D2A] md:text-5xl lg:text-6xl"
            >
              Journey from{" "}
              <span className="text-[#BE6E5B] italic">imagination</span>
              <br />
              <span className="text-[#BE6E5B] italic">to reality</span>
            </h2>

            <div aria-hidden="true" className="flex items-center gap-3 mt-7">
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-[#BE6E5B] to-transparent" />
              <span className="text-[#BE6E5B] text-base animate-pulse">✦</span>
            </div>

            <p className="mt-6 max-w-lg font-sans text-base leading-[1.9] text-[#4A2E1E] md:text-[15px]">
              At SANWARIYAS, every idea is shaped with careful fabric selection,
              clean cutting, skilled stitching, and final quality checks. Share
              your design, size set, color preference, or wholesale requirement,
              and our team will curate production-ready pieces for your store.
            </p>

            {/* Mini stats */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { v: "10K+",   l: "Pieces / month"   },
                { v: "4-Step", l: "Quality control"  },
                { v: "500+",   l: "Designs / season" },
                { v: "15+",    l: "Fabric types"     },
              ].map((s) => (
                <div key={s.l}
                  className="flex flex-col items-center py-4 px-3 rounded-xl text-center border border-[#BE6E5B]/20 bg-white/55 backdrop-blur-sm"
                  style={{ boxShadow: "0 3px 12px rgba(122,61,42,0.06)" }}>
                  <span className="font-display text-xl font-black text-[#7A3D2A] leading-none">{s.v}</span>
                  <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-[#a07f61] font-bold mt-1">{s.l}</span>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="group relative mt-8 inline-flex items-center gap-2.5 border-2 border-[#7A3D2A] text-[#7A3D2A] font-sans text-[10px] tracking-[0.3em] uppercase font-bold px-8 py-3.5 rounded-xl hover:text-[#FDF7F2] transition-colors duration-500 overflow-hidden"
            >
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#7A3D2A] to-[#BE6E5B] -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10" />
              <span className="relative z-10">Shop Wholesale Kurtis</span>
              <span aria-hidden="true" className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </Link>
          </div>

          {/* ── Right: Video tiles — NOW SYMMETRIC + CENTERED ──
              Both columns share the same grid row-start and gap,
              so tile 01 (left) and tiles 02 + 03 (right, stacked)
              line up evenly as one balanced, centered block.
          ── */}
          <div className="grid grid-cols-2 gap-4 items-center justify-center mx-auto w-full max-w-[460px]">
            {/* Left column — tile 01, vertically centered against the stacked 02+03 */}
            <div className="grid h-full place-items-center">
              <VideoTile step={VIDEO_STEPS[0]} />
            </div>
            {/* Right column — tiles 02 & 03 stacked */}
            <div className="grid gap-4 content-start h-full">
              <VideoTile step={VIDEO_STEPS[1]} />
              <VideoTile step={VIDEO_STEPS[2]} />
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          REVIEWS SECTION
      ══════════════════════════════════════════ */}
      <section
        aria-labelledby="customer-reviews-heading"
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)" }}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,#BE6E5B 0,#BE6E5B 1px,transparent 0,transparent 36px)", backgroundSize: "36px 36px" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <header className="mb-12 text-center md:mb-16">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
              What Buyers Say
            </p>
            <h2
              id="customer-reviews-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] leading-tight drop-shadow-sm"
            >
              Customer Reviews for Wholesale Kurtis
            </h2>
            <div aria-hidden="true" className="flex items-center justify-center gap-4 mt-6">
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>
            <p className="font-serif italic text-[#a07f61] mt-5 text-sm md:text-base max-w-lg mx-auto font-medium">
              Trusted by wholesale buyers, boutiques and retailers across 50+ countries worldwide.
            </p>
          </header>

          {/* Grid: hero aside + 5 cards */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 items-stretch">

            {/* Stats aside */}
            <aside className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#7A3D2A] to-[#5C3120] px-6 py-7 text-[#FDF7F2] shadow-[0_18px_48px_rgba(92,49,32,0.22)] border border-[#BE6E5B]/20 sm:col-span-2 md:col-span-1 xl:col-span-1">
              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.4em] text-[#F2D9C3]/65 font-bold mb-4">
                  Verified Buyers
                </p>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <span key={s} aria-hidden="true" className="text-[#F2D9C3] text-base">★</span>)}
                </div>
                <p className="font-display text-xl font-bold leading-snug">
                  Real feedback<br />from global<br />wholesale buyers
                </p>
              </div>
              <div>
                <div aria-hidden="true" className="my-5 h-px w-10 bg-[#BE6E5B]/55" />
                <p className="font-display text-3xl font-black text-[#F2D9C3]">4.8</p>
                <p className="font-sans text-[10px] font-bold text-[#F2D9C3]/65 uppercase tracking-widest mt-0.5">Average rating</p>
                <p className="font-display text-xl font-black text-[#F2D9C3] mt-3">136+</p>
                <p className="font-sans text-[10px] font-bold text-[#F2D9C3]/65 uppercase tracking-widest mt-0.5">Verified reviews</p>
              </div>
            </aside>

            {REVIEWS.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}