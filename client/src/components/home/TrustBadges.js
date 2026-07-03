// FILE: client/src/components/home/TrustBadges.js

const BADGES = [
  {
    label: "Export-Grade Quality",
    sub: "4-step QC on every piece",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-7 h-7"
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
    label: "Direct from Manufacturer",
    sub: "No middlemen, factory pricing",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-7 h-7"
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
    label: "MOQ 50 Pieces",
    sub: "Flexible for retailers",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-7 h-7"
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
    sub: "50+ countries served",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-7 h-7"
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
    sub: "Dedicated export support",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-7 h-7"
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
    label: "Secure & Private",
    sub: "Buyer information protected",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        fill="none"
        className="w-7 h-7"
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

export default function TrustBadges() {
  return (
    <>
      {/* ✅ SEO FIX: Injected ItemList Schema to explicitly define B2B value propositions to search engines */}
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
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background:
            "linear-gradient(160deg,#FDF7F2 0%,#F5E8D8 50%,#F2D9C3 100%)",
        }}
      >
        {/* Top / bottom rules */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />

        {/* Dot grid — consistent with CategoriesSection */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(#7A3D2A 1.8px,transparent 1.8px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Radial glow accents */}
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading — consistent with all other sections */}
          <div className="text-center mb-12 md:mb-16">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
              Why Retailers Trust Us
            </p>
            <h2
              id="trust-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold"
            >
              Trusted Manufacturing &amp; Export Excellence
              {/* ✅ SEO FIX: Visually hidden core entity modifiers for Topical Authority */}
              <span className="sr-only">
                {" "}
                - Jaipur Ethnic Wear Manufacturer
              </span>
            </h2>

            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-4 mt-6"
            >
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>

            <p className="max-w-3xl mx-auto text-[#a07f61] text-base md:text-lg leading-relaxed mt-6 font-serif italic font-medium">
              SANWARIYAS is a trusted wholesale manufacturer serving boutiques,
              distributors, private-label brands, and international retailers
              with premium ethnic wear collections, flexible production
              capabilities, and export-grade quality standards.
            </p>
          </div>

          {/* ✅ SEMANTIC: Unordered list */}
          {/* ✅ SEO FIX: Added Aria-Label for semantic screen-reader context */}
          <ul
            aria-label="Wholesale Manufacturing Trust Signals"
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 lg:gap-6 list-none p-0 m-0"
          >
            {BADGES.map((badge, index) => (
              <li
                key={badge.label}
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-[#BE6E5B]/20 px-5 py-7 text-center shadow-[0_12px_40px_rgba(122,61,42,0.08)] hover:shadow-[0_24px_56px_rgba(122,61,42,0.18)] hover:-translate-y-2 hover:border-[#BE6E5B]/50 hover:bg-white transition-all duration-500 h-full"
              >
                {/* Top accent bar on hover */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7A3D2A] via-[#BE6E5B] to-[#7A3D2A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Hover bg wash */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-[#BE6E5B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Icon circle */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-5 rounded-full bg-[#FDF7F2] border border-[#BE6E5B]/20 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-[#BE6E5B]/45 transition-all duration-500">
                  {badge.icon}
                </div>

                <h3 className="relative z-10 font-sans text-[11px] uppercase tracking-[0.22em] font-bold text-[#5C3120] leading-snug min-h-[42px]">
                  {badge.label}
                </h3>

                <div
                  aria-hidden="true"
                  className="h-px w-8 bg-gradient-to-r from-transparent via-[#BE6E5B]/45 to-transparent mx-auto my-4"
                />

                <p className="relative z-10 text-[12px] text-[#a07f61] leading-relaxed">
                  {badge.sub}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
