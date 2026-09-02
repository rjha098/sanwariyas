// FILE: client/src/components/home/CustomerReviewsSection.js
"use client";

export const REVIEWS = [
  {
    quote: "I am a reseller, I had a very good experience with these people from enquiry to dispatch, very nice products, happy to be a part with them.",
    name: "Ramya R",
    link: "https://share.google/IrMb5T2Pn6MEeUDNT",
  },
  {
    quote: "Collection is very good and prices are comfortable for bulk orders.",
    name: "Manish Mahawar",
    link: "https://share.google/C1UnSMqlC0NwiO0pw",
  },
  {
    quote: "Really happy with our experience with SANWARIYAS. The designs are fresh, the quality is consistent, and the team understands market trends very well. Every collection has something new and attractive for customers.",
    name: "Simran Saini",
    link: "https://share.google/cd2WnMVeBzy2T5YRN",
  },
  {
    quote: "Authentic fabric, reliable team , and smooth online shopping experience.",
    name: "Rajesh Jonwal",
    link: "https://share.google/trEN0DfL1YChNgUS5",
  },
  {
    quote: "All designs are best material quality is also good.",
    name: "Shivani Rajemahadik",
    link: "https://share.google/wV45EJ72zlppmZsY4",
  },
];

function StarRating() {
  return (
    <div className="flex gap-1" aria-label="5 star rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} aria-hidden="true" className="text-[#BE6E5B] text-xs">
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="group relative flex w-[300px] h-[220px] shrink-0 flex-col justify-between rounded-2xl border border-[#BE6E5B]/20 bg-gradient-to-br from-[#F2D9C3]/40 to-[#F2D9C3]/10 backdrop-blur-sm px-6 py-6 text-left shadow-[0_4px_16px_rgba(122,61,42,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_34px_rgba(122,61,42,0.12)] hover:border-[#BE6E5B]/50 hover:bg-[#F2D9C3]/50 cursor-pointer">
      <a href={review.link || "#"} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20 rounded-2xl" aria-label="View Review"></a>

      <div className="absolute top-2 right-4 font-serif text-[4.5rem] leading-none text-[#BE6E5B]/10 group-hover:text-[#BE6E5B]/20 transition-colors duration-500 select-none">
        &ldquo;
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#BE6E5B]/15 border border-[#BE6E5B]/30 flex items-center justify-center text-[#7A3D2A] font-bold text-xs font-sans uppercase">
            {review.name.charAt(0)}
          </div>
          <p className="font-sans text-[15px] font-bold text-[#7A3D2A]">{review.name}</p>
        </div>

        <p className="font-sans text-[13px] leading-[1.65] text-[#5C3120] italic" style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          "{review.quote}"
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-[#BE6E5B]/15 flex items-center justify-between z-10">
        <StarRating />
        <p className="font-sans text-[9px] tracking-[0.08em] text-[#a07f61] font-bold uppercase">Google Review</p>
      </div>
    </article>
  );
}

export default function CustomerReviewsSection() {
  return (
    <section aria-labelledby="customer-reviews-heading" className="relative py-20 md:py-28 overflow-hidden flex flex-col items-center" style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)" }}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg,#BE6E5B 0,#BE6E5B 1px,transparent 0,transparent 36px)", backgroundSize: "36px 36px" }} />

      <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center md:mb-16">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">What Buyers Say</p>
          <h2 id="customer-reviews-heading" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] leading-tight drop-shadow-sm">
            Customer Reviews for Wholesale Kurtis
            <span className="sr-only"> &amp; Cotton Suits Manufacturer India</span>
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
      </div>

      <div className="relative overflow-hidden w-full mt-4 py-4">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scroll-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee { display: flex; width: max-content; animation: scroll-marquee 40s linear infinite; }
          .animate-marquee:hover { animation-play-state: paused; }
        `}} />
        <div className="animate-marquee hover:[animation-play-state:paused] flex gap-6">
          <div className="flex gap-6 pr-6">
            {REVIEWS.map((review, idx) => (
              <ReviewCard key={`orig-${idx}`} review={review} />
            ))}
          </div>
          <div className="flex gap-6 pr-6">
            {REVIEWS.map((review, idx) => (
              <ReviewCard key={`dup-${idx}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}