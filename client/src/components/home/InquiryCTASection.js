import Link from "next/link";

// ─────────────────────────────────────────────
//  SANWARIYAS — Inquiry CTA Section
//  Homepage bridge → /contact page
//  No duplicate form. Clean, SEO-optimised,
//  accessible, premium luxury aesthetic.
// ─────────────────────────────────────────────

// ── Static data ──────────────────────────────
const CONTACT_CARDS = [
  {
    label: "Visit Us",
    line1: "Shiv Plaza, 1st Floor, Shop 12–13",
    line2: "Sanganer, Jaipur, Rajasthan 302029",
    href: "https://maps.google.com/?q=Shiv+Plaza+Sanganer+Jaipur",
    external: true,
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" fill="none"
        stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
        <path d="M10 2C7.24 2 5 4.24 5 7c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5z"
          strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="10" cy="7" r="2"/>
      </svg>
    ),
  },
  {
    label: "Call Us",
    line1: "+91 96808 12813",
    line2: "Mon – Sat · 10 am – 7 pm",
    href: "tel:+919680812813",
    external: false,
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" fill="none"
        stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
        <path d="M4 3h3.5l1.5 4-2 1.5a10 10 0 003.5 3.5L12 10l4 1.5V15a1.5 1.5 0 01-1.5 1.5A14.5 14.5 0 013.5 4.5 1.5 1.5 0 015 3H4z"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Email Us",
    line1: "hrsanwariyas@gmail.com",
    line2: "We reply within 24 hours",
    href: "mailto:hrsanwariyas@gmail.com",
    external: false,
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" fill="none"
        stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
        <rect x="2" y="4" width="16" height="12" rx="1.5" strokeLinecap="round"/>
        <path d="M2 6l8 5 8-5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    line1: "+91 96808 12813",
    line2: "Quick responses guaranteed",
    href: "https://wa.me/919680812813?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20products.",
    external: true,
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" fill="none"
        stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
        <path d="M17 3C15.2 1.2 12.7 0 10 0 4.5 0 0 4.5 0 10c0 1.8.5 3.4 1.3 4.9L0 20l5.3-1.3C6.7 19.5 8.3 20 10 20c5.5 0 10-4.5 10-10 0-2.7-1.1-5.2-3-7z"
          strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(1,1)"/>
        <path d="M7 8.5c.5 1 1.5 2.5 3 3.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const STATS = [
  { value: "500+", label: "Designs" },
  { value: "50+",  label: "Countries" },
  { value: "15K+", label: "Orders" },
  { value: "24h",  label: "Reply Time" },
];

// ── Styles (injected once) ───────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel:wght@400;600;700&family=Nunito+Sans:wght@300;400;600;700&display=swap');

  /* Entrance */
  @keyframes cta-rise {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cta-rise { animation: cta-rise 0.85s cubic-bezier(0.22,1,0.36,1) forwards; opacity: 0; }
  .cta-d1  { animation-delay: 0.04s; }
  .cta-d2  { animation-delay: 0.12s; }
  .cta-d3  { animation-delay: 0.20s; }
  .cta-d4  { animation-delay: 0.28s; }
  .cta-d5  { animation-delay: 0.36s; }
  .cta-d6  { animation-delay: 0.44s; }
  .cta-d7  { animation-delay: 0.52s; }
  .cta-d8  { animation-delay: 0.60s; }

  /* Card hover lift */
  .contact-card {
    transition: transform 0.38s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.38s cubic-bezier(0.22,1,0.36,1),
                border-color 0.3s ease,
                background 0.3s ease;
  }
  .contact-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 48px rgba(122,61,42,0.13), 0 4px 12px rgba(122,61,42,0.07);
    border-color: rgba(190,110,91,0.55);
    background: rgba(255,255,255,0.85);
  }

  /* Icon ring hover */
  .icon-ring {
    transition: background 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  .contact-card:hover .icon-ring {
    background: rgba(190,110,91,0.14);
    transform: scale(1.08);
  }

  /* CTA primary button shimmer */
  @keyframes shimPass {
    0%   { transform: translateX(-130%) skewX(-12deg); }
    100% { transform: translateX(230%)  skewX(-12deg); }
  }
  .btn-primary { position: relative; overflow: hidden; }
  .btn-primary:hover .btn-shim { animation: shimPass 0.85s ease forwards; }
  .btn-shim {
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
    transform: translateX(-130%) skewX(-12deg);
  }

  /* Ornament pulse */
  @keyframes oPulse {
    0%,100% { opacity: 0.5; transform: scale(1); }
    50%      { opacity: 1;   transform: scale(1.2); }
  }
  .o-pulse { animation: oPulse 2.8s ease-in-out infinite; display: inline-block; }

  /* Grain overlay */
  .cta-grain {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.36; mix-blend-mode: overlay;
  }

  /* Stat counter */
  .stat-val {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  /* Horizontal rule gradient */
  .h-rule { height: 1px; background: linear-gradient(to right, transparent, rgba(190,110,91,0.45), transparent); }

  /* Diagonal deco line */
  .deco-vline {
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(190,110,91,0.3), transparent);
  }

  /* Secondary button */
  .btn-secondary {
    transition: background 0.3s ease, color 0.3s ease,
                border-color 0.3s ease, box-shadow 0.3s ease,
                transform 0.3s ease;
  }
  .btn-secondary:hover {
    background: rgba(190,110,91,0.08);
    box-shadow: 0 6px 24px rgba(190,110,91,0.14);
    transform: translateY(-2px);
  }

  /* Scroll‑based reveal via IntersectionObserver polyfill fallback */
  @media (prefers-reduced-motion: reduce) {
    .cta-rise { animation: none; opacity: 1; }
  }
`;

// ── Sub-components ───────────────────────────

function ContactCard({ item, delay }) {
  const Tag    = item.external ? "a" : "a";
  const attrs  = item.external
    ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: item.href };

  return (
    <Tag
      {...attrs}
      aria-label={`${item.label}: ${item.line1}`}
      className={`contact-card cta-rise ${delay} flex items-start gap-4 p-5 rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE6E5B] focus-visible:ring-offset-2`}
      style={{
        background: "rgba(255,255,255,0.62)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(190,110,91,0.2)",
        boxShadow: "0 4px 16px rgba(122,61,42,0.06)",
        textDecoration: "none",
      }}
    >
      {/* Icon */}
      <div
        className="icon-ring w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(190,110,91,0.08)",
          border: "1px solid rgba(190,110,91,0.25)",
          color: "#BE6E5B",
        }}
      >
        {item.icon}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p
          className="text-[8.5px] uppercase tracking-[0.24em] font-bold mb-1"
          style={{ color: "#BE6E5B", fontFamily: "'Nunito Sans', sans-serif" }}
        >
          {item.label}
        </p>
        <p
          className="text-sm font-semibold truncate"
          style={{ color: "#7A3D2A", fontFamily: "'Nunito Sans', sans-serif" }}
        >
          {item.line1}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "#a07f61", fontFamily: "'Nunito Sans', sans-serif" }}
        >
          {item.line2}
        </p>
      </div>

      {/* Arrow */}
      <span
        aria-hidden="true"
        className="ml-auto self-center text-[#BE6E5B] opacity-40 flex-shrink-0 text-sm"
      >
        ›
      </span>
    </Tag>
  );
}

function StatPill({ value, label, delay }) {
  return (
    <div
      className={`cta-rise ${delay} flex flex-col items-center px-5 py-3 rounded-xl`}
      style={{
        background: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(190,110,91,0.18)",
      }}
    >
      <span className="stat-val text-xl text-[#7A3D2A]">{value}</span>
      <span
        className="text-[8.5px] uppercase tracking-widest text-[#a07f61] font-semibold mt-0.5"
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main export ──────────────────────────────
export default function InquiryCTASection() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section
        aria-labelledby="inquiry-cta-heading"
        itemScope
        itemType="https://schema.org/ContactPage"
        className="relative py-20 md:py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(150deg, #FDF7F2 0%, #F2D9C3 55%, #EDD0B5 100%)",
        }}
      >
        {/* ── Grain texture ── */}
        <div aria-hidden="true" className="cta-grain absolute inset-0 pointer-events-none" />

        {/* ── Watermark ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(12rem, 28vw, 26rem)",
              lineHeight: 1,
              color: "rgba(122,61,42,0.03)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            S
          </span>
        </div>

        {/* ── Edge rules ── */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-rule" />
        <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-rule" />

        {/* ── Corner brackets ── */}
        {[
          ["top-4 left-4",    "0deg"],
          ["top-4 right-4",   "90deg"],
          ["bottom-4 left-4", "-90deg"],
          ["bottom-4 right-4","180deg"],
        ].map(([pos, rot], i) => (
          <svg
            key={i}
            aria-hidden="true"
            width="42" height="42" viewBox="0 0 42 42" fill="none"
            className={`absolute ${pos} opacity-[0.18] hidden md:block`}
            style={{ transform: `rotate(${rot})` }}
          >
            <path
              d="M3 3 L39 3 L39 7 M3 3 L3 39 L7 39"
              stroke="#BE6E5B" strokeWidth="1.5" strokeLinecap="round"
            />
            <circle cx="3" cy="3" r="2" fill="#BE6E5B" />
          </svg>
        ))}

        {/* ── Vertical deco lines ── */}
        <div aria-hidden="true" className="deco-vline absolute left-[7%]  top-[10%] h-[80%] hidden xl:block" />
        <div aria-hidden="true" className="deco-vline absolute right-[7%] top-[20%] h-[60%] hidden xl:block" />

        {/* ══════════════════════════════════════
            INNER LAYOUT
        ══════════════════════════════════════ */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Section header ── */}
          <header className="text-center mb-14 md:mb-18">
            <p
              className="cta-rise cta-d1 text-[9px] md:text-[10px] uppercase tracking-[0.7em] font-bold mb-5"
              style={{ color: "#BE6E5B", fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Get in Touch
            </p>

            <h2
              id="inquiry-cta-heading"
              itemProp="name"
              className="cta-rise cta-d2 text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.07] text-[#7A3D2A] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Looking for Something
              <br aria-hidden="true" />
              <em
                className="italic text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(110deg, #7A3D2A 0%, #BE6E5B 100%)",
                }}
              >
                Special?
              </em>
            </h2>

            {/* Ornament divider */}
            <div
              aria-hidden="true"
              className="cta-rise cta-d3 flex items-center justify-center gap-5 mb-7"
            >
              <div className="h-rule w-16 md:w-24" />
              <span className="o-pulse text-[#BE6E5B]">✦</span>
              <div className="h-rule w-16 md:w-24" />
            </div>

            <p
              className="cta-rise cta-d4 text-base md:text-[17px] leading-[1.9] max-w-lg mx-auto"
              style={{
                color: "#a07f61",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
              }}
              itemProp="description"
            >
              Our expert style consultants will curate the perfect ensemble for
              your occasion — grand wedding, festive celebration, or everyday luxury.
            </p>
          </header>

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* LEFT — Contact cards */}
            <div className="flex flex-col gap-3">
              <p
                className="cta-rise cta-d4 text-[8.5px] uppercase tracking-[0.26em] font-bold mb-1"
                style={{ color: "#BE6E5B", fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Reach us directly
              </p>
              <h3
                className="cta-rise cta-d5 text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                We're Always Here
              </h3>

              {CONTACT_CARDS.map((item, i) => (
                <ContactCard
                  key={item.label}
                  item={item}
                  delay={`cta-d${Math.min(i + 5, 8)}`}
                />
              ))}

              {/* Promise strip */}
              <div
                className="cta-rise cta-d8 mt-4 flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(122,61,42,0.06), rgba(190,110,91,0.06))",
                  border: "1px solid rgba(190,110,91,0.18)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 o-pulse"
                  style={{ background: "#BE6E5B" }}
                />
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "#a07f61",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  <span
                    className="font-bold"
                    style={{ color: "#7A3D2A" }}
                  >
                    24-Hour Reply Guarantee
                  </span>{" "}
                  — We respond to every inquiry within one business day.
                </p>
              </div>
            </div>

            {/* RIGHT — CTA card */}
            <div
              className="cta-rise cta-d5 relative rounded-2xl md:rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(160deg, rgba(253,247,242,0.96) 0%, rgba(242,217,195,0.9) 100%)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(190,110,91,0.18)",
                boxShadow:
                  "0 32px 80px rgba(122,61,42,0.11), 0 8px 24px rgba(122,61,42,0.07)",
              }}
            >
              {/* Accent top bar */}
              <div
                aria-hidden="true"
                className="h-[3px] w-full"
                style={{
                  background:
                    "linear-gradient(to right, #7A3D2A, #BE6E5B, #a07f61, #BE6E5B, #7A3D2A)",
                }}
              />

              <div className="px-8 py-10 md:px-10 md:py-12 flex flex-col items-center text-center gap-7">

                {/* Ornament ring */}
                <div
                  aria-hidden="true"
                  className="relative w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(190,110,91,0.1) 0%, transparent 70%)",
                    border: "1px solid rgba(190,110,91,0.25)",
                  }}
                >
                  <svg
                    width="36" height="36" viewBox="0 0 36 36" fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 4 L22 14 L33 14 L24 21 L27 32 L18 26 L9 32 L12 21 L3 14 L14 14 Z"
                      stroke="#BE6E5B" strokeWidth="1.2"
                      strokeLinejoin="round" fill="rgba(190,110,91,0.08)"
                    />
                  </svg>
                  {/* Spinning ring */}
                  <div
                    className="absolute inset-[-8px] rounded-full"
                    style={{
                      border: "1px dashed rgba(190,110,91,0.3)",
                      animation: "spin-ring 18s linear infinite",
                    }}
                  />
                </div>

                <style dangerouslySetInnerHTML={{ __html:
                  `@keyframes spin-ring { to { transform: rotate(360deg); } }` }} />

                {/* Headline */}
                <div>
                  <h3
                    className="text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-3 leading-tight"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Ready to Order?
                    <br />
                    <em className="italic font-normal text-[#BE6E5B]">
                      Let's Talk
                    </em>
                  </h3>
                  <p
                    className="text-sm leading-relaxed max-w-xs mx-auto"
                    style={{
                      color: "#a07f61",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    Fill our inquiry form and our team will reply with custom
                    pricing, availability, and a curated selection — tailored
                    just for you.
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2 w-full">
                  {STATS.map((s, i) => (
                    <StatPill key={s.label} value={s.value} label={s.label} delay={`cta-d${Math.min(i + 5, 8)}`} />
                  ))}
                </div>

                {/* Divider */}
                <div aria-hidden="true" className="h-rule w-full" />

                {/* What to expect list */}
                <ul
                  className="text-left w-full flex flex-col gap-2.5"
                  aria-label="What you get when you inquire"
                >
                  {[
                    "Custom pricing for bulk & wholesale orders",
                    "Availability check across 500+ designs",
                    "Dedicated style consultant assigned",
                    "Bridal & festive collection curations",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(190,110,91,0.12)" }}
                        aria-hidden="true"
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1.5 4 L3 5.5 L6.5 2"
                            stroke="#BE6E5B" strokeWidth="1.4"
                            strokeLinecap="round" strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span
                        className="text-[11.5px] leading-relaxed"
                        style={{
                          color: "#7A3D2A",
                          fontFamily: "'Nunito Sans', sans-serif",
                        }}
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Primary CTA */}
                <Link
                  href="/contact"
                  aria-label="Go to the inquiry form page"
                  className="btn-primary group w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-[10.5px] tracking-[0.3em] uppercase transition-all duration-500 hover:shadow-[0_16px_48px_rgba(190,110,91,0.32)] hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(135deg, #BE6E5B 0%, #a07f61 100%)",
                    color: "#FDF7F2",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  <span className="btn-shim" aria-hidden="true" />
                  <span aria-hidden="true" className="relative z-10 o-pulse">✦</span>
                  <span className="relative z-10">Send Your Inquiry</span>
                  <span
                    aria-hidden="true"
                    className="relative z-10 opacity-70 text-sm group-hover:translate-x-1.5 transition-transform duration-300"
                  >
                    →
                  </span>
                </Link>

                {/* Secondary: WhatsApp shortcut */}
                <a
                  href="https://wa.me/919680812813?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with us on WhatsApp"
                  className="btn-secondary w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-[10px] tracking-[0.25em] uppercase"
                  style={{
                    border: "1.5px solid rgba(190,110,91,0.35)",
                    color: "#7A3D2A",
                    fontFamily: "'Nunito Sans', sans-serif",
                    background: "transparent",
                  }}
                >
                  {/* WhatsApp icon */}
                  <svg
                    aria-hidden="true"
                    width="15" height="15" viewBox="0 0 20 20" fill="none"
                    stroke="#BE6E5B" strokeWidth="1.5"
                  >
                    <path
                      d="M17.5 2.5C15.7.8 13.2 0 10.5 0 4.7 0 0 4.7 0 10.5c0 1.9.5 3.7 1.4 5.3L0 20.5l4.9-1.3c1.5.8 3.1 1.3 4.8 1.3 5.8 0 10.5-4.7 10.5-10.5 0-2.8-1.1-5.3-2.7-7z"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: "scale(0.88) translate(1.2px,1.2px)" }}
                    />
                  </svg>
                  Chat on WhatsApp
                </a>

                {/* Privacy assurance */}
                <p
                  className="text-[9.5px] text-[#a07f61] text-center leading-relaxed"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                >
                  Your information is private and secure. We never share your details.
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom fade line ── */}
          {/* <div
            aria-hidden="true"
            className="w-px h-16 md:h-20 mx-auto mt-14"
            style={{
              background:
                "linear-gradient(to bottom, #BE6E5B, rgba(190,110,91,0.25), transparent)",
            }}
          /> */}
        </div>
      </section>
    </>
  );
}