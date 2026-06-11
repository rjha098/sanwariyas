// FILE: client/src/components/home/ManufacturingInfoSections.js
"use client";

import Link from "next/link";

const VIDEO_STEPS = [
  {
    title: "Fabric Selection",
    label: "01",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    // 👉 later replace with: "/videos/fabric.mp4"
  },
  {
    title: "Cutting & Stitching",
    label: "02",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    // 👉 later replace with: "/videos/stitching.mp4"
  },
  {
    title: "Finishing Check",
    label: "03",
    src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    // 👉 later replace with: "/videos/finishing.mp4"
  },
];

const REVIEWS = [
  {
    quote: "Very good wholesale quality. Stitching and finishing both are neat.",
    name: "N P",
  },
  {
    quote: "Authentic fabric, reliable team, and smooth online shopping experience.",
    name: "Pia Kokare",
  },
  {
    quote: "Collection is very good and prices are comfortable for bulk orders.",
    name: "Tamil Mathi",
  },
  {
    quote: "Affordable fabric with very good customer support for every order.",
    name: "Soorya S S",
  },
  {
    quote: "SANWARIYAS has vibrant prints, fresh patterns, and great designs.",
    name: "Akshay Sharma",
  },
];

function VideoTile({ step }) {
  return (
    <article className="group relative min-h-[200px] overflow-hidden rounded-2xl border border-[#BE6E5B]/25 bg-[#7A3D2A] shadow-[0_18px_48px_rgba(122,61,42,0.18)]">

      <video
        aria-label={`Video showing ${step.title}`}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        src={step.src}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* Fallback if video fails */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-white text-sm opacity-70">
        Video Loading...
      </div>

      {/* Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#5C3120]/70 via-[#7A3D2A]/10 to-transparent pointer-events-none"
      />

      {/* Inner border on hover */}
      <div aria-hidden="true"
        className="absolute inset-2 border border-[#BE6E5B]/0 group-hover:border-[#BE6E5B]/50 transition-all duration-700 z-20 pointer-events-none rounded-xl"/>

      <div className="relative z-10 flex h-full min-h-[200px] flex-col justify-between p-5 text-[#FDF7F2] pointer-events-none">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F2D9C3]/55 bg-[#FDF7F2]/15 font-display text-lg font-bold">
          {step.label}
        </span>

        <div>
          <p className="mb-2 font-sans text-[9px] font-bold uppercase tracking-[0.35em] text-[#F2D9C3]/80">
            Manufacturing
          </p>
          <h3 className="font-display text-2xl font-semibold leading-tight">
            {step.title}
          </h3>
        </div>
      </div>
    </article>
  );
}

function StarRating() {
  return (
    <div className="mb-5 flex justify-center gap-1.5 text-sm text-[#BE6E5B]" aria-label="5 star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} aria-hidden="true">
          {"\u2605"}
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#BE6E5B]/25 bg-[#FDF7F2] px-4 py-5 text-center shadow-[0_8px_24px_rgba(122,61,42,0.09)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(122,61,42,0.16)] hover:border-[#BE6E5B]/50">
      <StarRating />
      <p className="mx-auto max-w-[11rem] font-sans text-[13px] leading-[1.6] text-[#5C3120] flex-1">
        {review.quote}
      </p>
      <div className="mt-4 pt-4 border-t border-[#BE6E5B]/15">
        <p className="font-sans text-[13px] text-[#7A3D2A] font-semibold">{review.name}</p>
        <p className="font-sans text-[10px] text-[#BE6E5B] tracking-[0.2em] uppercase mt-0.5">Happy Customer</p>
      </div>
    </article>
  );
}

export default function ManufacturingInfoSections() {
  return (
    <>
      {/* ── Manufacturing Section ── */}
      <section
        aria-labelledby="custom-manufacturing-heading"
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F8EDE6 100%)" }}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/35 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/35 to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)", backgroundSize: "34px 34px" }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1fr] lg:gap-20 lg:px-8">

          {/* Left: Text */}
          <div>
            <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.62em] text-[#BE6E5B]">
              Custom Production
            </p>
            <h2
              id="custom-manufacturing-heading"
              className="font-display text-4xl font-bold leading-[1.12] text-[#7A3D2A] md:text-5xl lg:text-6xl"
            >
              Journey from{" "}
              <span className="text-[#BE6E5B]">imagination</span>
              <br />
              <span className="text-[#BE6E5B]">to reality</span> - Kurtis
            </h2>

            <div aria-hidden="true" className="flex items-center gap-3 mt-7">
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-[#BE6E5B] to-transparent" />
              <span className="text-[#BE6E5B] text-base animate-pulse">✦</span>
            </div>

            <p className="mt-6 max-w-2xl font-sans text-base leading-8 text-[#251815] md:text-lg">
              At SANWARIYAS, every idea is shaped with careful fabric selection,
              clean cutting, skilled stitching, and final quality checks. Share
              your design, size set, color preference, or wholesale requirement,
              and our team will curate production-ready pieces for your store.
            </p>

            {/* ── Consistent CTA button ── */}
            {/* <Link
              href="/products"
              className="group relative mt-10 inline-flex items-center gap-2.5 border-2 border-[#7A3D2A] text-[#7A3D2A] font-sans text-[10px] tracking-[0.3em] uppercase font-bold px-8 py-3.5 rounded-xl hover:text-[#FDF7F2] transition-colors duration-500 overflow-hidden"
            >
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#7A3D2A] to-[#BE6E5B] -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10" />
              <span className="relative z-10">Shop Wholesale Kurtis</span>
              <span aria-hidden="true" className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </Link> */}
          </div>

          {/* Right: Video tiles */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:pt-10">
              <VideoTile step={VIDEO_STEPS[0]} />
            </div>
            <div className="grid gap-4">
              <VideoTile step={VIDEO_STEPS[1]} />
              <VideoTile step={VIDEO_STEPS[2]} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews Section ── */}
      <section
        aria-labelledby="customer-reviews-heading"
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)" }}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg,#BE6E5B 0,#BE6E5B 1px,transparent 0,transparent 36px)", backgroundSize: "36px 36px" }} />

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
          </header>

          {/* Grid: aside + 5 review cards */}
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 items-stretch">

            {/* Stats aside */}
            <aside className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#7A3D2A] to-[#5C3120] px-5 py-5 text-[#FDF7F2] shadow-[0_18px_48px_rgba(122,61,42,0.22)] border border-[#BE6E5B]/20">
              <p className="font-sans text-[9px] uppercase tracking-[0.4em] text-[#F2D9C3]/70 font-bold mb-3">Verified Buyers</p>
              <p className="font-display text-xl font-bold leading-snug">
                Real feedback
                <br />
                from global
                <br />
                wholesale buyers
              </p>
              <div aria-hidden="true" className="mt-4 h-px w-10 bg-[#BE6E5B]/60" />
              <div className="mt-3">
                <p className="font-sans text-base font-bold text-[#F2D9C3]">4.8 average</p>
                <p className="font-sans text-xs font-normal text-[#F2D9C3]/70 mt-0.5">136+ reviews</p>
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