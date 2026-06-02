// FILE: client/src/components/home/TrustBadges.js
// PURPOSE: Horizontal trust-signal bar — sits just below the MarqueeTicker
// Shows 6 buyer-confidence badges: export quality, secure payment, etc.

// ── COLOR PALETTE ────────────────────────────────
// Background : solid dark brown  #7A3D2A  (stands out between Hero/Marquee)
// Accent     : #BE6E5B  (Terracotta)
// Cream text : #FDF7F2
// Warm text  : #F2D9C3
// ─────────────────────────────────────────────────

const BADGES = [
  {
    label: "Export-Grade Quality",
    sub: "4-step QC on every piece",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="w-6 h-6" stroke="#F2D9C3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="11"/>
        <path d="M10 16.5 L14 20.5 L22 12"/>
      </svg>
    ),
  },
  {
    label: "Direct from Manufacturer",
    sub: "No middlemen, factory price",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="w-6 h-6" stroke="#F2D9C3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 24 L6 14 L16 7 L26 14 L26 24"/>
        <rect x="12" y="17" width="8" height="7" rx="1"/>
        <path d="M6 24 L26 24"/>
      </svg>
    ),
  },
  {
    label: "MOQ 50 Pieces",
    sub: "Flexible for all retailers",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="w-6 h-6" stroke="#F2D9C3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="10" width="8" height="14" rx="1.5"/>
        <rect x="12" y="7" width="8" height="17" rx="1.5"/>
        <rect x="19" y="13" width="8" height="11" rx="1.5"/>
      </svg>
    ),
  },
  {
    label: "Worldwide Shipping",
    sub: "50+ countries, fully insured",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="w-6 h-6" stroke="#F2D9C3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="11"/>
        <path d="M5 16 Q10 11 16 16 Q22 21 27 16"/>
        <path d="M16 5 Q11 11 16 16 Q21 21 16 27"/>
      </svg>
    ),
  },
  {
    label: "24-Hour Reply",
    sub: "Dedicated support team",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="w-6 h-6" stroke="#F2D9C3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="11"/>
        <path d="M16 9 L16 16 L21 20"/>
      </svg>
    ),
  },
  {
    label: "Secure & Private",
    sub: "Your data is never shared",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="w-6 h-6" stroke="#F2D9C3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4 L26 8 L26 17 C26 22 21 26.5 16 28 C11 26.5 6 22 6 17 L6 8 Z"/>
        <path d="M11 16.5 L14.5 20 L21 13"/>
      </svg>
    ),
  },
];

export default function TrustBadges() {
  return (
    <section
      aria-label="Buyer trust and quality guarantees"
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(90deg, #5C3120 0%, #7A3D2A 45%, #8B4A34 100%)" }}
    >
      {/* ── subtle grain ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── top/bottom accent lines ── */}
      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#BE6E5B]/50 to-transparent" />
      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#BE6E5B]/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        {/* screen-reader summary */}
        <p className="sr-only">
          SANWARIYAS guarantees: Export-Grade Quality, Direct from Manufacturer, MOQ 50 Pieces, Worldwide Shipping, 24-Hour Reply, and Secure &amp; Private transactions.
        </p>

        {/* ── Badge strip ── */}
        <ul
          aria-hidden="true"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-2 list-none p-0 m-0"
        >
          {BADGES.map((badge, i) => (
            <li key={i}>
              <div className="group flex flex-col sm:flex-row lg:flex-col items-center lg:items-center text-center gap-3 px-3 py-3 rounded-lg transition-colors duration-300 hover:bg-white/[0.06]">
                {/* Icon ring */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border border-[#BE6E5B]/40 bg-white/[0.08] group-hover:bg-white/[0.14] group-hover:border-[#BE6E5B]/70 transition-all duration-300"
                >
                  {badge.icon}
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.22em] font-bold text-[#FDF7F2] leading-tight">
                    {badge.label}
                  </p>
                  <p className="font-sans text-[9px] text-[#F2D9C3]/60 mt-0.5 leading-tight">
                    {badge.sub}
                  </p>
                </div>
              </div>

              {/* Vertical divider between badges (hidden on last) */}
              {i < BADGES.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute right-0 top-1/4 h-1/2 w-px bg-[#BE6E5B]/20"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}