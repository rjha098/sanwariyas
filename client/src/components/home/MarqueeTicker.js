// FILE: client/src/components/home/MarqueeTicker.js
export default function MarqueeTicker() {
  return (
    <section
      //  SEO FIX: Enriched aria-label with B2B wholesale context
      aria-label="Wholesale Ethnic Wear & Cotton Kurti Collections Ticker"
      className="relative overflow-hidden z-20 shadow-[0_8px_32px_rgba(92,49,32,0.28)]"
      style={{
        background:
          "linear-gradient(90deg, #5C3120 0%, #7A3D2A 35%, #BE6E5B 60%, #7A3D2A 80%, #5C3120 100%)",
      }}
    >
      {/*  SEO FIX: Expanded screen reader text with exact-match B2B, Location, and Manufacturer keywords */}
      <p className="sr-only">
        SANWARIYAS is a premium Jaipur Ethnic Wear Manufacturer. Explore our wholesale collections including Cotton Short Kurtis, Designer Anarkali Suits, A-Line Suits, Straight 3 Piece Suits, Co-ord Sets, and Long Kurtis. We are India's trusted Wholesale Ethnic Wear Supplier and B2B Kurti Manufacturer.
      </p>

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
            ✦ Wholesale Short Kurtis &nbsp;✦ Cotton Anarkali &nbsp;✦ Premium A-Line Suit &nbsp;✦ Straight 3-Piece Suit &nbsp;✦ Designer Co-ord Set &nbsp;✦ Bulk Long Kurtis
          </span>
        ))}
      </div>
    </section>
  );
}