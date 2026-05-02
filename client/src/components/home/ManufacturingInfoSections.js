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
    <article className="group relative min-h-[180px] overflow-hidden rounded-md border border-[#BE6E5B]/25 bg-[#7A3D2A] shadow-[0_18px_48px_rgba(122,61,42,0.16)]">
      
      {/* ✅ VIDEO FIX (opacity removed) */}
      <video
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

{/* ✅ fallback if video fails */}
<div className="absolute inset-0 flex items-center justify-center text-white text-sm opacity-70">
  Video Loading...
</div>

      {/* ✅ OVERLAY FIX (lighter so video visible) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#7A3D2A]/60 via-[#7A3D2A]/10 to-transparent"
      />

      <div className="relative z-10 flex h-full min-h-[180px] flex-col justify-between p-5 text-[#FDF7F2]">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F2D9C3]/55 bg-[#FDF7F2]/15 font-display text-lg">
          {step.label}
        </span>

        <div>
          <p className="mb-2 font-sans text-[9px] font-bold uppercase tracking-[0.32em] text-[#F2D9C3]">
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
    <div className="mb-6 flex justify-center gap-2 text-sm text-[#BE6E5B]" aria-label="5 star rating">
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
    <article className="flex min-h-[344px] flex-col justify-center rounded-md border border-[#BE6E5B]/30 bg-[#FDF7F2] px-8 py-10 text-center shadow-[0_10px_30px_rgba(122,61,42,0.12)]">
      <StarRating />
      <p className="mx-auto max-w-[13rem] font-sans text-lg leading-snug text-[#7A3D2A]">
        {review.quote}
      </p>
      <div className="mt-7">
        <p className="font-sans text-sm text-[#7A3D2A] font-semibold">{review.name}</p>
        <p className="font-sans text-sm text-[#BE6E5B]">Happy Customer</p>
      </div>
    </article>
  );
}

export default function ManufacturingInfoSections() {
  return (
    <>
      <section
        aria-labelledby="custom-manufacturing-heading"
        className="relative overflow-hidden py-20 md:py-24"
        style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F8EDE6 100%)" }}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/35 to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)", backgroundSize: "34px 34px" }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1fr] lg:gap-16 lg:px-8">
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

            <div aria-hidden="true" className="mt-8 h-px w-24 bg-[#BE6E5B]/35" />

            <p className="mt-6 max-w-2xl font-sans text-base leading-8 text-[#251815] md:text-lg">
              At SANWARIYAS, every idea is shaped with careful fabric selection,
              clean cutting, skilled stitching, and final quality checks. Share
              your design, size set, color preference, or wholesale requirement,
              and our team will curate production-ready pieces for your store.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex items-center justify-center border border-[#7A3D2A] px-7 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#7A3D2A] transition duration-300 hover:bg-[#7A3D2A] hover:text-[#FDF7F2]"
            >
              Shop Wholesale Kurtis
            </Link>
          </div>

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

      <section
        aria-labelledby="customer-reviews-heading"
        className="relative overflow-hidden py-20 md:py-24"
        style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10 text-center md:mb-14">
            <h2
              id="customer-reviews-heading"
              className="font-sans text-3xl font-medium uppercase tracking-[0.08em] text-[#7A3D2A] md:text-4xl"
            >
              Customer Reviews for Wholesale Kurtis
            </h2>
            <div aria-hidden="true" className="mx-auto mt-7 h-px w-24 bg-[#BE6E5B]/40" />
          </header>

          <div className="grid gap-6 lg:grid-cols-[1fr_repeat(5,minmax(0,1fr))]">
            <aside className="flex min-h-[344px] flex-col justify-center rounded-md bg-[#7A3D2A] px-8 py-10 text-[#FDF7F2]">
              <p className="font-sans text-2xl font-bold leading-tight">
                Real feedback
                <br />  
                from global
                <br />
                wholesale buyers
              </p>
              <p className="mt-8 font-sans text-lg font-semibold leading-snug">
                4.8 average
                <br />
                136+ reviews
              </p>
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