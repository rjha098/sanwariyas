// FILE: client/src/components/home/ManufacturingInfoSections.js

"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const VIDEO_STEPS = [
  {
    title: "Fabric Selection",
    label: "01",
    stage: "Fabric Selection",
    desc: "Premium fabrics sourced directly from certified mills in Surat, Varanasi & Jaipur.",
    src: "/videos/fabric-selection.mp4",
  },
  {
    title: "Cutting & Stitching",
    label: "02",
    stage: "Manufacturing",
    desc: "CAD-guided precision cutting and skilled artisan stitching for every piece.",
    src: "/videos/cutting-stitching.mp4",
  },
  {
    title: "Finishing Check",
    label: "03",
    stage: "Quality Check",
    desc: "4-step quality inspection before every order leaves our facility.",
    src: "/videos/finishing-check.mp4",
  },
];

const REVIEWS = [
  {
    quote:
      "I am a reseller, I had a very good experience with these people from enquiry to dispatch, very nice products, happy to be a part with them.",
    name: "Ramya R",
  },
  {
    quote:
      "Collection is very good and prices are comfortable for bulk orders.",
    name: "Manish Mahawar",
  },
  {
    quote: "Sanwariyas has vibrant prints ,fresh patterns, and great designs.",
    name: "RELAXING MUSIC",
  },
  {
    quote:
      "Very good wholesale quality. Stitching and finishing both are neat.",
    name: "Ramlal Kumar",
  },
  {
    quote:
      "Really happy with our experience with SANWARIYAS. The designs are fresh, the quality is consistent, and the team understands market trends very well. Every collection has something new and attractive for customers.",
    name: "Simran Saini",
  },
  {
    quote:
      "Authentic fabric, reliable team , and smooth online shopping experience.",
    name: "Rajesh Jonwal",
  },
];

// ── Premium Video Lightbox ────────────────────────────────────────────────────
function VideoLightbox({ step, onClose }) {
  const videoRef = useRef(null);
  const lightboxRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    const contentTimer = setTimeout(() => {
      setIsContentVisible(true);
    }, 60);

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 120);

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll";

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(focusTimer);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsContentVisible(false);
    setIsVisible(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  const handleBackdropClick = (e) => {
    if (e.target === lightboxRef.current) {
      handleClose();
    }
  };

  return (
    <div
      ref={lightboxRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${step.title} manufacturing process video`}
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 48px)",
        backgroundColor: isVisible ? "rgba(8, 4, 2, 0.88)" : "rgba(8, 4, 2, 0)",
        backdropFilter: isVisible ? "blur(16px)" : "blur(0px)",
        WebkitBackdropFilter: isVisible ? "blur(16px)" : "blur(0px)",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(145deg, rgba(20,10,5,0.96) 0%, rgba(35,16,8,0.98) 100%)",
          border: "1px solid rgba(190,110,91,0.20)",
          borderRadius: "20px",
          boxShadow:
            "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
          overflow: "hidden",
          opacity: isContentVisible ? 1 : 0,
          transform: isContentVisible
            ? "scale(1) translateY(0)"
            : "scale(0.94) translateY(20px)",
          transition:
            "opacity 0.32s cubic-bezier(0.16,1,0.3,1), transform 0.32s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          aria-label="Close video"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            zIndex: 10,
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "50%",
            cursor: "pointer",
            color: "rgba(255,255,255,0.85)",
            transition: "background 0.2s ease, transform 0.2s ease",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.20)";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.10)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "2px solid rgba(190,110,91,0.8)";
            e.currentTarget.style.outlineOffset = "2px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 2L14 14M14 2L2 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div
          style={{
            width: "100%",
            background: "#000",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "75vh",
            overflow: "hidden",
          }}
        >
          <video
            ref={videoRef}
            src={step.src}
            controls
            playsInline
            loop
            preload="metadata"
            controlsList="nodownload"
            disablePictureInPicture
            aria-label={`${step.title} — SANWARIYAS manufacturing process`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              maxHeight: "75vh",
              objectFit: "contain",
              background: "#000",
            }}
          />
        </div>

        <div
          style={{
            padding: "20px 24px 24px",
            flexShrink: 0,
            borderTop: "1px solid rgba(190,110,91,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}
          >
            <span
              style={{
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid rgba(190,110,91,0.45)",
                background: "rgba(190,110,91,0.10)",
                fontFamily: "var(--font-display, serif)",
                fontSize: "12px",
                fontWeight: "700",
                color: "#F2D9C3",
                letterSpacing: "0.02em",
              }}
            >
              {step.label}
            </span>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-sans, sans-serif)",
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: "rgba(190,110,91,0.75)",
                  marginBottom: "4px",
                }}
              >
                {step.stage}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display, serif)",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
                  fontWeight: "700",
                  color: "#FDF7F2",
                  lineHeight: "1.2",
                  marginBottom: "6px",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans, sans-serif)",
                  fontSize: "13px",
                  color: "rgba(242,217,195,0.65)",
                  lineHeight: "1.65",
                  maxWidth: "520px",
                }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoTile({ step, onOpen }) {
  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-[#BE6E5B]/25 bg-[#5C3120] shadow-[0_14px_40px_rgba(92,49,32,0.20)] aspect-[3/4] w-full max-w-[200px] md:max-w-[220px] mx-auto"
      style={{ cursor: "pointer" }}
      onClick={() => onOpen(step)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(step);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Play ${step.title} video`}
    >
      <video
        aria-label={`Preview of ${step.title} by SANWARIYAS`}
        title={`${step.title} - Wholesale Ethnic Wear Production`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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

      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-[#F2D9C3]/40 text-xs font-sans tracking-widest uppercase pointer-events-none"
      >
        Loading…
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(92,49,32,0.90) 0%, rgba(92,49,32,0.35) 45%, rgba(92,49,32,0.08) 100%)",
          transition: "opacity 0.45s ease",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: "rgba(10,4,2,0.45)",
          transition: "opacity 0.35s ease",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-[6px] rounded-xl pointer-events-none border border-transparent group-hover:border-[#BE6E5B]/50 transition-all duration-500"
      />

      <div
        aria-hidden="true"
        className="absolute bottom-5 right-5 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 z-20 pointer-events-none"
      >
        <span
          style={{
            position: "absolute",
            inset: "-6px",
            borderRadius: "50%",
            border: "1.5px solid rgba(190,110,91,0.50)",
            animation: "mfgPulse 1.8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "rgba(253,247,242,0.14)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1.5px solid rgba(253,247,242,0.40)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.36), 0 0 0 1px rgba(190,110,91,0.20) inset",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path d="M5 3L13 8L5 13V3Z" fill="rgba(253,247,242,0.95)" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-6 pointer-events-none">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#F2D9C3]/40 bg-[#FDF7F2]/12 font-display text-sm font-bold text-[#FDF7F2] flex-shrink-0">
            {step.label}
          </span>
          <div className="h-px w-6 bg-[#BE6E5B]/60 group-hover:w-12 transition-all duration-700" />
          <p className="font-sans text-[9px] font-bold uppercase tracking-[0.38em] text-[#F2D9C3]/65">
            {step.stage}
          </p>
        </div>
        <h3
          className="font-display font-semibold leading-tight text-[#FDF7F2] drop-shadow-md mb-1.5"
          style={{ fontSize: "clamp(1.1rem,2vw,1.5rem)" }}
        >
          {step.title}
        </h3>
        <p className="font-sans text-[12px] text-[#F2D9C3]/70 leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {step.desc}
        </p>
      </div>
    </article>
  );
}

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

// ✅ DESIGN FIX: Fixed Height, Line Clamp, and Better Visual Alignment applied properly
function ReviewCard({ review }) {
  return (
    <article className="group relative flex w-[300px] h-[220px] shrink-0 flex-col justify-between rounded-2xl border border-[#BE6E5B]/20 bg-gradient-to-br from-[#F2D9C3]/40 to-[#F2D9C3]/10 backdrop-blur-sm px-6 py-6 text-left shadow-[0_4px_16px_rgba(122,61,42,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_34px_rgba(122,61,42,0.12)] hover:border-[#BE6E5B]/50 hover:bg-[#F2D9C3]/50">
      {/* Decorative Quote Mark */}
      <div className="absolute top-2 right-4 font-serif text-[4.5rem] leading-none text-[#BE6E5B]/10 group-hover:text-[#BE6E5B]/20 transition-colors duration-500 select-none">
        &ldquo;
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar Profile Initials */}
          <div className="w-8 h-8 rounded-full bg-[#BE6E5B]/15 border border-[#BE6E5B]/30 flex items-center justify-center text-[#7A3D2A] font-bold text-xs font-sans uppercase">
            {review.name.charAt(0)}
          </div>
          <p className="font-sans text-[15px] font-bold text-[#7A3D2A]">
            {review.name}
          </p>
        </div>

        {/* Text with Line Clamp to restrict exactly to 4 lines max */}
        <p
          className="font-sans text-[13px] leading-[1.65] text-[#5C3120] italic"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          "{review.quote}"
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-[#BE6E5B]/15 flex items-center justify-between z-10">
        <StarRating />
        <p className="font-sans text-[9px] tracking-[0.08em] text-[#a07f61] font-bold uppercase">
          Google Review
        </p>
      </div>
    </article>
  );
}

export default function ManufacturingInfoSections() {
  const [activeVideo, setActiveVideo] = useState(null);

  const handleOpen = useCallback((step) => {
    setActiveVideo(step);
  }, []);

  const handleClose = useCallback(() => {
    setActiveVideo(null);
  }, []);

  return (
    <>
      {activeVideo && (
        <VideoLightbox step={activeVideo} onClose={handleClose} />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            ...VIDEO_STEPS.map((step) => ({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: `${step.title} - Ethnic Wear Manufacturing Process`,
              description: step.desc,
              thumbnailUrl:
                "https://sanwariyas.com/images/thumbnails/manufacturing-thumbnail.png",
              uploadDate: "2025-01-01",
              contentUrl: `${SITE_URL}${step.src}`,
              publisher: {
                "@type": "Organization",
                name: "SANWARIYAS",
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/images/logooo.png`,
                },
              },
            })),
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SANWARIYAS",
              url: SITE_URL,
              review: REVIEWS.map((r) => ({
                "@type": "Review",
                author: { "@type": "Person", name: r.name },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                },
                reviewBody: r.quote,
              })),
            },
          ]),
        }}
      />

      <section
        aria-labelledby="custom-manufacturing-heading"
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background: "linear-gradient(135deg, #FDF7F2 0%, #F8EDE6 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/35 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/35 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)",
            backgroundSize: "34px 34px",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute right-8 bottom-8 font-display font-black text-[#7A3D2A]/[0.025] leading-none select-none pointer-events-none hidden xl:block"
          style={{ fontSize: "clamp(10rem, 14vw, 14rem)" }}
        >
          01
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1fr] lg:gap-20 lg:px-8">
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
              <span className="sr-only">
                {" "}
                - Jaipur Ethnic Wear Manufacturer
              </span>
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

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { v: "10K+", l: "Pieces / month" },
                { v: "4-Step", l: "Quality control" },
                { v: "500+", l: "Designs / season" },
                { v: "10+", l: "Fabric types" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="flex flex-col items-center py-4 px-3 rounded-xl text-center border border-[#BE6E5B]/20 bg-white/55 backdrop-blur-sm"
                  style={{ boxShadow: "0 3px 12px rgba(122,61,42,0.06)" }}
                >
                  <span className="font-display text-xl font-black text-[#7A3D2A] leading-none">
                    {s.v}
                  </span>
                  <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-[#a07f61] font-bold mt-1">
                    {s.l}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              title="Contact Indian Ethnic Wear Manufacturer"
              aria-label="Contact our wholesale ethnic wear manufacturing team"
              className="group relative mt-8 inline-flex items-center gap-2.5 border-2 border-[#7A3D2A] text-[#7A3D2A] font-sans text-[10px] tracking-[0.3em] uppercase font-bold px-8 py-3.5 rounded-xl hover:text-[#FDF7F2] transition-colors duration-500 overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#7A3D2A] to-[#BE6E5B] -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10"
              />
              <span className="relative z-10">Shop Wholesale Kurtis</span>
              <span
                aria-hidden="true"
                className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300"
              >
                →
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center justify-center mx-auto w-full max-w-[460px]">
            <div className="grid h-full place-items-center">
              <VideoTile step={VIDEO_STEPS[0]} onOpen={handleOpen} />
            </div>
            <div className="grid gap-4 content-start h-full">
              <VideoTile step={VIDEO_STEPS[1]} onOpen={handleOpen} />
              <VideoTile step={VIDEO_STEPS[2]} onOpen={handleOpen} />
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="customer-reviews-heading"
        className="relative py-20 md:py-28 overflow-hidden flex flex-col items-center"
        style={{
          background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,#BE6E5B 0,#BE6E5B 1px,transparent 0,transparent 36px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center md:mb-16">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
              What Buyers Say
            </p>
            <h2
              id="customer-reviews-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] leading-tight drop-shadow-sm"
            >
              Customer Reviews for Wholesale Kurtis
              <span className="sr-only">
                {" "}
                &amp; Cotton Suits Manufacturer India
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
            <p className="font-serif italic text-[#a07f61] mt-5 text-sm md:text-base max-w-lg mx-auto font-medium">
              Trusted by wholesale buyers, boutiques and retailers across 50+
              countries worldwide.
            </p>
          </header>
        </div>

        {/*  FIXED: Smooth Marquee Animation */}
        <div className="relative overflow-hidden w-full mt-4 py-4">
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @keyframes scroll-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                width: max-content;
                animation: scroll-marquee 40s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `,
            }}
          />

          {/* Marquee Track (Hover karne par pause ho jayega) */}
          <div className="animate-marquee hover:[animation-play-state:paused] flex gap-6">
            {/* First Set of 6 Reviews */}
            <div className="flex gap-6 pr-6">
              {REVIEWS.map((review, idx) => (
                <ReviewCard key={`orig-${idx}`} review={review} />
              ))}
            </div>
            {/* Second Duplicate Set for Infinite Loop */}
            <div className="flex gap-6 pr-6">
              {REVIEWS.map((review, idx) => (
                <ReviewCard key={`dup-${idx}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
