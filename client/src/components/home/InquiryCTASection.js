// FILE: client/src/components/home/InquiryCTASection.js
import Link from "next/link";

const CONTACT_CARDS = [
  {
    label: "Visit Us",
    line1: "Shiv Plaza, 1st Floor, Shop 10–12",
    line2: "Sanganer, Jaipur, Rajasthan 302029",
    href: "https://maps.google.com/?q=Shiv+Plaza+Sanganer+Jaipur",
    external: true,
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="w-5 h-5"
      >
        <path
          d="M10 2C7.24 2 5 4.24 5 7c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="7" r="2" />
      </svg>
    ),
  },
  {
    label: "Call Us",
    line1: "+91 9352111306",
    line2: "Mon – Sat · 10 am – 7 pm",
    href: "tel:+919251171306",
    external: false,
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="w-5 h-5"
      >
        <path
          d="M4 3h3.5l1.5 4-2 1.5a10 10 0 003.5 3.5L12 10l4 1.5V15a1.5 1.5 0 01-1.5 1.5A14.5 14.5 0 013.5 4.5 1.5 1.5 0 015 3H4z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="w-5 h-5"
      >
        <rect
          x="2"
          y="4"
          width="16"
          height="12"
          rx="1.5"
          strokeLinecap="round"
        />
        <path d="M2 6l8 5 8-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    line1: "+91 9251171306",
    line2: "Quick responses guaranteed",
    href: "https://wa.me/919251171306?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20products.",
    external: true,
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="w-5 h-5"
      >
        <path
          d="M17 3C15.2 1.2 12.7 0 10 0 4.5 0 0 4.5 0 10c0 1.8.5 3.4 1.3 4.9L0 20l5.3-1.3C6.7 19.5 8.3 20 10 20c5.5 0 10-4.5 10-10 0-2.7-1.1-5.2-3-7z"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="scale(0.9) translate(1,1)"
        />
        <path d="M7 8.5c.5 1 1.5 2.5 3 3.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export const TRUST_BADGES = [
  { label: "100% Factory Direct" },
  { label: "Complete Export Documentation" },
  { label: "Low MOQ, Boutique Friendly" },
  { label: "100% GST Invoiced" },
  { label: "Ships Across India & Worldwide" },
];

const STYLES = `
  @keyframes cta-rise { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  .cta-rise { animation:cta-rise 0.85s cubic-bezier(0.22,1,0.36,1) forwards; opacity:0; }
  .cta-d1{animation-delay:0.04s} .cta-d2{animation-delay:0.12s} .cta-d3{animation-delay:0.20s}
  .cta-d4{animation-delay:0.28s} .cta-d5{animation-delay:0.36s} .cta-d6{animation-delay:0.44s}
  .cta-d7{animation-delay:0.52s} .cta-d8{animation-delay:0.60s}

  .cc-card {
    display:flex; align-items:flex-start; gap:16px; padding:18px 20px;
    background:rgba(255,255,255,0.62); backdrop-filter:blur(12px);
    border:1.5px solid rgba(190,110,91,0.20); border-radius:14px;
    text-decoration:none; color:inherit;
    transition:transform 0.38s cubic-bezier(0.22,1,0.36,1),
               box-shadow 0.38s ease, border-color 0.3s ease, background 0.3s ease;
  }
  .cc-card:hover {
    transform:translateY(-4px);
    box-shadow:0 16px 44px rgba(122,61,42,0.12);
    border-color:rgba(190,110,91,0.55);
    background:rgba(255,255,255,0.90);
  }
  .cc-icon {
    width:44px; height:44px; flex-shrink:0; border-radius:12px;
    background:rgba(190,110,91,0.08); border:1px solid rgba(190,110,91,0.25);
    color:#BE6E5B; display:flex; align-items:center; justify-content:center;
    transition:background 0.3s ease,border-color 0.3s ease,transform 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  .cc-card:hover .cc-icon { background:rgba(190,110,91,0.16); border-color:rgba(190,110,91,0.60); transform:scale(1.1); }

  @keyframes shimPass { 0%{transform:translateX(-130%) skewX(-12deg)} 100%{transform:translateX(230%) skewX(-12deg)} }
  .btn-primary-cta { position:relative; overflow:hidden; }
  .btn-primary-cta:hover .btn-shim { animation:shimPass 0.85s ease forwards; }
  .btn-shim { position:absolute; inset:0; pointer-events:none; background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.22) 50%,transparent 70%); transform:translateX(-130%) skewX(-12deg); }

  @keyframes oPulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
  .o-pulse { animation:oPulse 2.8s ease-in-out infinite; display:inline-block; }

  .cta-grain { background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); opacity:0.36; mix-blend-mode:overlay; }
  .h-rule { height:1px; background:linear-gradient(to right,transparent,rgba(190,110,91,0.45),transparent); }
  .deco-vline { width:1px; background:linear-gradient(to bottom,transparent,rgba(190,110,91,0.28),transparent); }
  .btn-secondary-cta { transition:background 0.3s ease,border-color 0.3s ease,box-shadow 0.3s ease,transform 0.3s ease; }
  .btn-secondary-cta:hover { background:rgba(190,110,91,0.08); box-shadow:0 6px 24px rgba(190,110,91,0.14); transform:translateY(-2px); border-color:rgba(190,110,91,0.55) !important; }
  @media (prefers-reduced-motion:reduce) { .cta-rise,.cc-card,.cc-icon { transition:none; animation:none; opacity:1; } }

  @keyframes trustScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .trust-track { animation:trustScroll 22s linear infinite; }
  .trust-track:hover { animation-play-state:paused; }
  @media (prefers-reduced-motion:reduce) { .trust-track { animation:none; } }

  @keyframes accentShimmer { 0%{background-position:0% 0} 100%{background-position:200% 0} }
  .accent-shimmer { animation:accentShimmer 6s linear infinite; }
  @media (prefers-reduced-motion:reduce) { .accent-shimmer { animation:none; } }
`;

function TrustMarquee({ items }) {
  // Duplicated once so the CSS-only marquee loops seamlessly with no
  // visible seam or JS-driven interval — pure decorative animation,
  // doesn't touch any state/functionality.
  const loop = [...items, ...items];
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden rounded-xl py-3"
      style={{
        background: "rgba(255,255,255,0.42)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(190,110,91,0.16)",
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="trust-track flex items-center gap-3 w-max">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap"
            style={{
              background: "rgba(190,110,91,0.07)",
              border: "1px solid rgba(190,110,91,0.20)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "#BE6E5B" }}
            />
            <span className="font-sans text-[10.5px] font-bold tracking-wide text-[#7A3D2A]">
              {item.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function InquiryCTASection() {
  return (
    <>
      {/* ✅ SEO FIX: Replaced invalid inline Microdata with robust LocalBusiness JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "SANWARIYAS Ethnic Wear Manufacturer",
            image: "https://sanwariyas.com/images/logooo.png",
            telephone: "+919680812813",
            email: "hrsanwariyas@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Shiv Plaza, 1st Floor, Shop 12–13, Sanganer",
              addressLocality: "Jaipur",
              addressRegion: "Rajasthan",
              postalCode: "302029",
              addressCountry: "IN",
            },
            url: "https://sanwariyas.com",
            sameAs: [
              "https://www.instagram.com/sanwariyas_jaipur?igsh=MW1oYmh5ZDQ0NDE3",
            ],

            priceRange: "$$",
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ],
              opens: "10:00",
              closes: "19:00",
            },
          }),
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section
        aria-labelledby="inquiry-cta-heading"
        className="relative py-20 md:py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(150deg,#FDF7F2 0%,#F2D9C3 55%,#EDD0B5 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="cta-grain absolute inset-0 pointer-events-none"
        />

        {/* watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span
            className="font-display font-black text-[#7A3D2A]/[0.028] tracking-[-0.04em] leading-none"
            style={{ fontSize: "clamp(12rem,28vw,26rem)" }}
          >
            S
          </span>
        </div>

        {/* rules */}
        <div aria-hidden="true" className="absolute top-0 inset-x-0 h-rule" />
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-rule"
        />

        {/* corner brackets */}
        {[
          ["top-4 left-4", "0deg"],
          ["top-4 right-4", "90deg"],
          ["bottom-4 left-4", "-90deg"],
          ["bottom-4 right-4", "180deg"],
        ].map(([pos, rot], i) => (
          <svg
            key={i}
            aria-hidden="true"
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            className={`absolute ${pos} opacity-[0.16] hidden md:block`}
            style={{ transform: `rotate(${rot})` }}
          >
            <path
              d="M3 3 L41 3 L41 8 M3 3 L3 41 L8 41"
              stroke="#BE6E5B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="3" cy="3" r="2.2" fill="#BE6E5B" />
          </svg>
        ))}

        <div
          aria-hidden="true"
          className="deco-vline absolute left-[7%] top-[10%] h-[80%] hidden xl:block"
        />
        <div
          aria-hidden="true"
          className="deco-vline absolute right-[7%] top-[20%] h-[60%] hidden xl:block"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="text-center mb-14 md:mb-16">
            <p className="cta-rise cta-d1 font-sans text-[9px] md:text-[10px] uppercase tracking-[0.7em] font-bold mb-5 text-[#BE6E5B]">
              Get in touch.
            </p>
            <h2
              id="inquiry-cta-heading"
              itemProp="name"
              className="cta-rise cta-d2 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.06] text-[#7A3D2A] mb-6"
            >
              Looking for Something
              <br aria-hidden="true" />
              <em
                className="italic text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(110deg,#7A3D2A 0%,#BE6E5B 100%)",
                }}
              >
                Special?
              </em>
              {/* ✅ SEO FIX: Visually hidden core B2B commercial intent keyword */}
              <span className="sr-only">
                {" "}
                - Contact Wholesale Ethnic Wear Supplier India
              </span>
            </h2>
            <div
              aria-hidden="true"
              className="cta-rise cta-d3 flex items-center justify-center gap-5 mb-7"
            >
              <div className="h-rule w-16 md:w-24" />
              <span className="o-pulse text-[#BE6E5B] text-lg">✦</span>
              <div className="h-rule w-16 md:w-24" />
            </div>
            {/* ✅ SEO FIX: Replaced B2C text (weddings/occasions) with targeted B2B Manufacturer & Retailer text */}
            <p
              className="cta-rise cta-d4 font-serif italic text-base md:text-[17px] leading-[1.9] max-w-lg mx-auto text-[#a07f61]"
              itemProp="description"
            >
              Our expert manufacturing consultants will curate the perfect
              wholesale collection for your retail boutique — premium cotton
              suits, kurtis, and everyday luxury.
            </p>
          </header>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* LEFT — contact cards */}
            <div className="flex flex-col gap-3">
              <p className="cta-rise cta-d4 font-sans text-[8.5px] uppercase tracking-[0.26em] font-bold mb-1 text-[#BE6E5B]">
                Reach us directly
              </p>
              <h3 className="cta-rise cta-d5 font-display text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-4">
                We're Always Here
              </h3>

              {/* ✅ A11Y FIX: Wrapped contact cards in a semantic unordered list */}
              <ul
                aria-label="Contact Methods"
                className="flex flex-col gap-3 list-none p-0 m-0"
              >
                {CONTACT_CARDS.map((item, i) => {
                  const attrs = item.external
                    ? {
                        href: item.href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : { href: item.href };
                  return (
                    <li key={item.label} className="w-full">
                      <a
                        {...attrs}
                        aria-label={`${item.label}: ${item.line1}`}
                        className={`cc-card cta-rise cta-d${Math.min(i + 5, 8)}`}
                      >
                        <div className="cc-icon">{item.icon}</div>
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-[8.5px] uppercase tracking-[0.24em] font-bold mb-1 text-[#BE6E5B]">
                            {item.label}
                          </p>
                          <p className="font-sans text-sm font-semibold truncate text-[#7A3D2A]">
                            {item.line1}
                          </p>
                          <p className="font-sans text-xs mt-0.5 text-[#a07f61]">
                            {item.line2}
                          </p>
                        </div>
                        <span
                          aria-hidden="true"
                          className="ml-auto self-center text-[#BE6E5B] opacity-35 flex-shrink-0 text-lg"
                        >
                          ›
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Promise strip */}
              <div
                className="cta-rise cta-d8 mt-3 flex items-center gap-4 px-5 py-4 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(122,61,42,0.06),rgba(190,110,91,0.06))",
                  border: "1px solid rgba(190,110,91,0.18)",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 o-pulse"
                  style={{ background: "#BE6E5B" }}
                />
                <p className="font-sans text-xs leading-relaxed text-[#a07f61]">
                  <span className="font-bold text-[#7A3D2A]">
                    Fast, Personal Response
                  </span>{" "}
                  — Every inquiry is reviewed and replied to directly by our team.
                </p>
              </div>
            </div>

            {/* RIGHT — CTA card */}
            <div
              className="cta-rise cta-d5 relative rounded-2xl md:rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(160deg,rgba(253,247,242,0.97) 0%,rgba(242,217,195,0.92) 100%)",
                backdropFilter: "blur(24px)",
                border: "1.5px solid rgba(190,110,91,0.2)",
                boxShadow:
                  "0 32px 80px rgba(122,61,42,0.12),0 8px 24px rgba(122,61,42,0.07)",
              }}
            >
              {/* top accent bar — subtle animated sheen instead of a static
                  gradient, gives the card a quiet "alive" feel on load */}
              <div
                aria-hidden="true"
                className="h-[3px] w-full accent-shimmer"
                style={{
                  background:
                    "linear-gradient(to right,#7A3D2A,#BE6E5B,#a07f61,#BE6E5B,#7A3D2A)",
                  backgroundSize: "200% 100%",
                }}
              />

              <div className="px-8 py-10 md:px-10 md:py-12 flex flex-col items-center text-center gap-6">
                {/* ornament */}
                <div
                  aria-hidden="true"
                  className="relative w-18 h-18 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle,rgba(190,110,91,0.12) 0%,transparent 70%)",
                    border: "1px solid rgba(190,110,91,0.28)",
                    width: "72px",
                    height: "72px",
                  }}
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 36 36"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 4 L22 14 L33 14 L24 21 L27 32 L18 26 L9 32 L12 21 L3 14 L14 14 Z"
                      stroke="#BE6E5B"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                      fill="rgba(190,110,91,0.08)"
                    />
                  </svg>
                  <div
                    className="absolute inset-[-10px] rounded-full"
                    style={{
                      border: "1px dashed rgba(190,110,91,0.3)",
                      animation: "spin-ring 20s linear infinite",
                    }}
                  />
                </div>
                <style
                  dangerouslySetInnerHTML={{
                    __html: `@keyframes spin-ring{to{transform:rotate(360deg)}}`,
                  }}
                />

                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-3 leading-tight">
                    Ready to order?
                    <br />
                    <em className="italic font-normal text-[#BE6E5B]">
                      Let us Talk
                    </em>
                  </h3>
                  <p className="font-sans text-sm leading-relaxed max-w-xs mx-auto text-[#a07f61]">
                    Fill our inquiry form and our team will reply with custom
                    pricing, availability, and a curated selection — tailored
                    just for you.
                  </p>
                </div>

                {/* trust marquee — replaces vanity stat numbers with a
                    scrolling strip of real, verifiable value props */}
                <TrustMarquee items={TRUST_BADGES} />

                <div aria-hidden="true" className="h-rule w-full" />

                {/* benefits list */}
                {/* ✅ SEO FIX: Replaced B2C text with target B2B manufacturing and wholesale keywords */}
                <ul
                  className="text-left w-full flex flex-col gap-2.5 list-none p-0 m-0"
                  aria-label="What you get when you inquire"
                >
                  {[
                    "Custom B2B pricing for bulk & wholesale orders",
                    "Manufacturing availability across our full catalogue",
                    "Dedicated export consultant assigned",
                    "Premium cotton suits & kurtis creation",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(190,110,91,0.12)" }}
                        aria-hidden="true"
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1.5 4 L3 5.5 L6.5 2"
                            stroke="#BE6E5B"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="font-sans text-[12px] leading-relaxed text-[#7A3D2A]">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Primary CTA */}
                {/* ✅ SEO FIX: Added contextual title attribute for link equity */}
                <Link
                  href="/contact"
                  title="Send Inquiry to Jaipur Ethnic Wear Manufacturer"
                  aria-label="Go to the B2B wholesale inquiry form page"
                  className="btn-primary-cta group w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-sans font-black text-[10.5px] tracking-[0.3em] uppercase transition-all duration-500 hover:shadow-[0_16px_48px_rgba(190,110,91,0.32)] hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(135deg,#BE6E5B 0%,#a07f61 100%)",
                    color: "#FDF7F2",
                  }}
                >
                  <span className="btn-shim" aria-hidden="true" />
                  <span aria-hidden="true" className="relative z-10 o-pulse">
                    ✦
                  </span>
                  <span className="relative z-10">Send Your Inquiry</span>
                  <span
                    aria-hidden="true"
                    className="relative z-10 opacity-70 text-sm group-hover:translate-x-1.5 transition-transform duration-300"
                  >
                    →
                  </span>
                </Link>

                {/* WhatsApp */}
                {/* ✅ SEO FIX: Added contextual title attribute for external link indexing */}
                <a
                  href="https://wa.me/919251171306?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat with Wholesale Kurti Supplier"
                  aria-label="Chat with our wholesale team on WhatsApp."
                  className="btn-secondary-cta w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-sans font-black text-[10px] tracking-[0.25em] uppercase"
                  style={{
                    border: "1.5px solid rgba(190,110,91,0.35)",
                    color: "#7A3D2A",
                    background: "transparent",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="15"
                    height="15"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="#BE6E5B"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M17.5 2.5C15.7.8 13.2 0 10.5 0 4.7 0 0 4.7 0 10.5c0 1.9.5 3.7 1.4 5.3L0 20.5l4.9-1.3c1.5.8 3.1 1.3 4.8 1.3 5.8 0 10.5-4.7 10.5-10.5 0-2.8-1.1-5.3-2.7-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: "scale(0.88) translate(1.2px,1.2px)",
                      }}
                    />
                  </svg>
                  Chat on WhatsApp
                </a>

                <p className="font-sans text-[9.5px] text-[#a07f61] text-center leading-relaxed">
                  Your information is private and secure. We never share your
                  details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}