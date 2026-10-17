// FILE: client/src/components/home/HeroSection.js

"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";


const slides = [
  {
    id: 2,
    title: ["Complete Elegance,", "Straight 3-Piece Suits"],
    sub: "Classic straight-cut 3-piece suits featuring exquisite dupattas — fully insured, securely packaged, exported worldwide.",
    img: "/images/HomepageTemplate/Straight%203-Piece.png",
    badge: "3-Piece Suits",
  },
  {
    id: 3,
    title: ["Exquisite Craftsmanship,", "A-Line Masterpieces"],
    sub: "Flawlessly stitched A-Line suits crafted for elegance — the perfect blend of comfort and pure luxury in every thread.",
    img: "/images/HomepageTemplate/A-Line.png",
    badge: "A-Line Suits",
  },
  {
    id: 4,
    title: ["Timeless Grace,", "Designer Anarkalis"],
    sub: "Beautifully flared Anarkali suits tailored with breathable fabrics, redefining the standard of ethnic fashion.",
    img: "/images/HomepageTemplate/Anarkali.png",
    badge: "Anarkali Collection",
  },
  {
    id: 5,
    title: ["Modern Silhouettes,", "Chic Cord Sets"],
    sub: "Directly sourced from India's master weavers — trendy, highly demanded, comfortable cotton co-ord sets for everyday luxury.",
    img: "/images/HomepageTemplate/Co-ord%20Sets.png",
    badge: "Co-ord Sets",
  },
  {
    id: 6,
    title: ["Everyday Elegance,", "Premium Short Kurtis"],
    sub: "Versatile and stylish short kurtis at wholesale rates, with perfect fits, breathable fabrics and vibrant long-lasting prints.",
    img: "/images/HomepageTemplate/Short%20Kurtis.png",
    badge: "Short Kurtis",
  },
  {
    id: 7,
    title: ["Graceful Lengths,", "Classic Long Kurtis"],
    sub: "Elegant long kurtis perfect for retail scaling — partner with India's most trusted export house for your bulk requirements.",
    img: "/images/HomepageTemplate/Long%20Kurtis.png",
    badge: "Long Kurtis",
  },
  {
    id: 1,
    title: ["Complete Elegance,", "Woven in Cotton"],
    sub: "India's premier export house for high-end ethnic wear — pure cotton suits, kurtis, co-ord sets and Anarkalis, block printed and hand-finished in Jaipur, fully insured and shipped worldwide.",
    img: "/images/ROLARIMAGES.png",
    badge: "Export House · Jaipur",
    spin: true, // only this slide rotates; keep it wherever you want in the list
  },
];


const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Jost:wght@300;400;500;600&family=Cinzel:wght@400;600;700&display=swap');

  @keyframes dotPulse {
    0%,100%{ transform:scale(1); opacity:1; }
    50%    { transform:scale(1.5); opacity:0.7; }
  }
  @keyframes floatCard {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-9px); }
  }
  @keyframes slideProgress { from{width:0%} to{width:100%} }
  @keyframes fadeIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes hsSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .hs-spin { animation: hsSpin 28s linear infinite; }

  .hs-explore { transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease; }
  .hs-explore:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(139,101,8,0.35); filter: brightness(1.05); }

  .hs-outline { transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease; }
  .hs-outline:hover { transform: translateY(-2px); background: rgba(255,255,255,0.95); box-shadow: 0 10px 26px rgba(139,101,8,0.14); }

  .hs-badge-card { animation: floatCard 5.5s ease-in-out infinite; }

  .hs-fade { animation: fadeIn 0.5s ease both; }

  .hs-thumb {
    transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease, box-shadow 0.4s ease, margin 0.4s cubic-bezier(0.22,1,0.36,1);
  }
  .hs-thumb:hover { transform: scale(1.06) translateY(-3px); }
  .hs-thumb-strip::-webkit-scrollbar { display:none; }
  .hs-thumb-strip { -ms-overflow-style:none; scrollbar-width:none; }

  .hs-blend {
    -webkit-mask-image: radial-gradient(ellipse 80% 84% at 50% 45%, black 55%, transparent 100%);
    mask-image: radial-gradient(ellipse 80% 84% at 50% 45%, black 55%, transparent 100%);
  }
`;

export default function HeroSection() {
  const [cur, setCur] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setCur((c) => (c + 1) % slides.length);
      setAnimKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const goTo = useCallback((n) => {
    const next = ((n % slides.length) + slides.length) % slides.length;
    setCur(next);
    setAnimKey((k) => k + 1);
  }, []);

  const slide = slides[cur];
  const isBrandSlide = Boolean(slide.spin); // brand slide (spinning image) - now the LAST slide

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section
        className="hero-section relative w-full flex flex-col overflow-hidden"
        style={{
          minHeight: "700px",
          background:
            "linear-gradient(100deg, #FBF1E4 0%, #F6E6D2 28%, #F0DBBF 50%, #EACFAD 72%, #E0BF98 100%)",
        }}
        aria-label="Sanwariyas Global Wholesale – Premium Indian Ethnic Wear"
        aria-roledescription="carousel"
        itemScope
        itemType="https://schema.org/WPHeader"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* faint jaali lattice on the light side */}
        <svg
          aria-hidden="true"
          className="hidden lg:block absolute left-0 top-0 h-full opacity-[0.08]"
          width="260"
          viewBox="0 0 260 700"
          fill="none"
        >
          <defs>
            <pattern
              id="jaali"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M18 0 L36 18 L18 36 L0 18 Z"
                stroke="#8B6508"
                strokeWidth="1"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="260" height="700" fill="url(#jaali)" />
        </svg>

        {/* slide counter */}
        <div
          aria-hidden="true"
          className="absolute top-5 right-6 lg:right-14 z-20 hidden lg:flex items-center gap-2"
        >
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.22em",
              color: "#8B6508",
            }}
          >
            {String(cur + 1).padStart(2, "0")}
          </span>
          <span className="text-[#C9A485] opacity-70 text-xs">/</span>
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "12px",
              letterSpacing: "0.22em",
              color: "#a1794f",
              opacity: 0.7,
            }}
          >
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        <div className="relative z-10 flex-1 flex items-center w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-16 pb-6 lg:pt-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr,0.95fr] gap-10 lg:gap-10 items-center w-full">
            {/* ════ LEFT — details for the active slide ════ */}
            <div
              key={`text-${cur}`}
              aria-live="polite"
              aria-atomic="true"
              className="hs-fade flex flex-col text-center lg:text-left order-2 lg:order-1"
            >
              <div className="flex items-center gap-3 mb-5 justify-center lg:justify-start">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 16px",
                    borderRadius: "999px",
                    border: "1px solid #8B6508",
                    fontFamily: "'Jost',sans-serif",
                    fontWeight: 700,
                    fontSize: "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "#8B6508",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#8B6508",
                      animation: "dotPulse 2s ease-in-out infinite",
                    }}
                  />
                  {slide.badge}
                </span>
              </div>

              {/* SEO H1 — small eyebrow line, semantically the page heading, stays constant across slides */}
              <h1
                className="font-semibold mb-4 tracking-wide text-[#7A3D2A]"
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: "clamp(12px, 1.2vw, 13px)",
                  letterSpacing: "0.08em",
                  lineHeight: 1.6,
                  opacity: 0.8,
                }}
              >
                SANWARIYAS — Wholesale Cotton Ethnic Wear Manufacturer, Supplier
                &amp; Exporter in Jaipur, Rajasthan, India
              </h1>

              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-wide"
                style={{
                  fontFamily: "'Cormorant Garamond',Georgia,serif",
                  color: "#5C3A1E",
                  lineHeight: "1.08",
                }}
              >
                <span className="block">{slide.title[0]}</span>
                <span className="block italic" style={{ color: "#8B6508" }}>
                  {slide.title[1]}
                </span>
              </h2>

              <p
                className="leading-[1.85] mb-8 tracking-wide text-[#8a6c52] max-w-md mx-auto lg:mx-0"
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(13px, 1.5vw, 15px)",
                }}
                itemProp="description"
              >
                {slide.sub}
              </p>

              <div className="flex flex-wrap gap-3 mb-9 justify-center lg:justify-start">
                <Link
                  href="/lookbook"
                  title="View Wholesale Cotton Suits & Kurtis Collections"
                  aria-label="Explore our wholesale ethnic wear collection"
                  className="hs-explore inline-flex items-center gap-2.5 rounded-full"
                  style={{
                    padding: "13px 28px",
                    background:
                      "linear-gradient(135deg, #8B6508 0%, #BE6E5B 100%)",
                    color: "#FDF7F2",
                    fontFamily: "'Jost',sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    boxShadow: "0 8px 26px rgba(139,101,8,0.4)",
                  }}
                >
                  Explore Collection <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/contact"
                  title="Contact Jaipur Ethnic Wear Manufacturer"
                  aria-label="Get wholesale pricing directly from the manufacturer"
                  className="hs-outline inline-flex items-center gap-2 rounded-full"
                  style={{
                    padding: "13px 28px",
                    background: "rgba(255,255,255,0.55)",
                    border: "1.5px solid #8B6508",
                    color: "#8B6508",
                    fontFamily: "'Jost',sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Get Wholesale Price
                </Link>
              </div>

              {/* Stats — constant across slides */}
              <div className="flex items-center gap-8 justify-center lg:justify-start">
                {[
                  ["2500+", "Designs"],
                  ["50+", "Countries"],
                  ["15K+", "Orders"],
                ].map(([value, label], i) => (
                  <div key={label} className="flex items-center gap-8">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        style={{
                          width: "1px",
                          height: "30px",
                          background: "rgba(139,101,8,0.25)",
                        }}
                      />
                    )}
                    <div className="flex flex-col items-center lg:items-start">
                      <span
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontWeight: 700,
                          fontSize: "clamp(1.2rem, 1.9vw, 1.4rem)",
                          letterSpacing: "0.03em",
                          color: "#5C3A1E",
                        }}
                      >
                        {value}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 500,
                          fontSize: "10px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "#a1794f",
                          marginTop: "2px",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ════ RIGHT — one clean, framed photo that changes with the slide ════ */}
            <div className="relative flex justify-center lg:justify-end order-1 lg:order-2 w-full">
              <div className="relative w-full max-w-[440px] aspect-[3/4] mx-auto lg:mx-0 lg:w-[clamp(240px,30vw,360px)] lg:h-[clamp(320px,46vw,480px)] lg:aspect-auto">
                <div
                  aria-hidden="true"
                  className="absolute inset-[-12%] rounded-[2.5rem]"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 42%, rgba(246,230,210,0.95) 0%, rgba(224,191,152,0.6) 45%, rgba(251,241,228,0.3) 68%, transparent 82%)",
                    filter: "blur(18px)",
                  }}
                />

                <button
                  onClick={() => goTo(cur - 1)}
                  aria-label="Previous slide"
                  className="hs-nav-btn absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-20 rounded-full flex items-center justify-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    background:
                      "linear-gradient(135deg, #8B6508 0%, #BE6E5B 100%)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    color: "#FDF7F2",
                    boxShadow: "0 8px 22px rgba(59,31,23,0.32)",
                    fontFamily: "serif",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  ❮
                </button>
                <button
                  onClick={() => goTo(cur + 1)}
                  aria-label="Next slide"
                  className="hs-nav-btn absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-20 rounded-full flex items-center justify-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    background:
                      "linear-gradient(135deg, #8B6508 0%, #BE6E5B 100%)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    color: "#FDF7F2",
                    boxShadow: "0 8px 22px rgba(59,31,23,0.32)",
                    fontFamily: "serif",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  ❯
                </button>

                {isBrandSlide ? (
                  // Brand slide — no frame, image spins continuously
                  <div
                    key={`img-${cur}`}
                    className="hs-fade relative w-full h-full"
                  >
                    <div className="hs-spin absolute inset-0">
                      <Image
                        src={slide.img}
                        alt={`${slide.badge} - Sanwariyas Wholesale Ethnic Wear`}
                        fill
                        sizes="(max-width: 1024px) 300px, 360px"
                        className="object-contain"
                        priority
                        fetchPriority="high"
                        itemProp="image"
                        style={{
                          filter:
                            "drop-shadow(0 18px 26px rgba(59,31,23,0.28))",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    key={`img-${cur}`}
                    className="hs-fade hs-blend relative w-full h-full rounded-[1.75rem] overflow-hidden"
                  >
                    <Image
                      src={slide.img}
                      alt={`${slide.badge} - Sanwariyas Wholesale Ethnic Wear`}
                      fill
                      sizes="(max-width: 1024px) 300px, 360px"
                      className="object-cover"
                      priority
                      fetchPriority="high"
                      itemProp="image"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-24"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                      }}
                    />

                    <div
                      className="absolute bottom-4 left-4 z-10"
                      style={{
                        fontFamily: "'Jost',sans-serif",
                        fontWeight: 700,
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "white",
                      }}
                    >
                      {slide.badge}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Thumbnail strip — 7 slides: brand + all 6 categories ── */}
        <div className="relative z-20 w-full pb-6 pt-1">
          <nav
            aria-label="Carousel slide selector"
            className="max-w-7xl mx-auto px-6 lg:px-14"
          >
            <div aria-hidden="true" className="flex justify-center gap-2 mb-3">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="rounded-full transition-all duration-400"
                  style={{
                    height: "5px",
                    width: i === cur ? "26px" : "5px",
                    background: i === cur ? "#8B6508" : "#C9A485",
                    opacity: i === cur ? 1 : 0.45,
                  }}
                />
              ))}
            </div>

            <div className="hs-thumb-strip flex md:justify-center gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory px-2">
              {slides.map((s, i) => {
                const isActive = i === cur;
                return (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    aria-current={isActive ? "true" : "false"}
                    aria-label={`View ${s.badge}`}
                    className="hs-thumb relative flex-shrink-0 overflow-hidden snap-start rounded-xl"
                    style={{
                      width: "clamp(64px, 8vw, 84px)",
                      height: "clamp(84px, 10vw, 106px)",
                      margin: isActive ? "0 10px" : "0",
                      border: isActive
                        ? "2px solid #8B6508"
                        : "1.5px solid rgba(255,255,255,0.4)",
                      opacity: isActive ? 1 : 0.55,
                      transform: isActive
                        ? "scale(1.06) translateY(-3px)"
                        : "scale(1)",
                      boxShadow: isActive
                        ? "0 12px 28px rgba(59,31,23,0.24)"
                        : "0 4px 10px rgba(59,31,23,0.1)",
                    }}
                  >
                    <Image
                      src={s.img}
                      alt={`Thumbnail - ${s.badge}`}
                      fill
                      sizes="84px"
                      className="object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)",
                      }}
                    />
                    {isActive && (
                      <div
                        key={animKey}
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[3px]"
                        style={{
                          background:
                            "linear-gradient(to right, #8B6508, #BE6E5B)",
                          animation: "slideProgress 5000ms linear forwards",
                          animationPlayState: paused ? "paused" : "running",
                          width: "100%",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </section>
    </>
  );
}