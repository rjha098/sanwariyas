// FILE: client/src/components/home/ManufacturingInfoSections.js
"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import CustomerReviewsSection, { REVIEWS } from "./CustomerReviewsSection";

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

/* ------------------------------------------------------------------ */
/*  Icons used inside the 4-Step Quality Inspection cards              */
/* ------------------------------------------------------------------ */
function IconMagnifier({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="21" y1="21" x2="15.5" y2="15.5" />
    </svg>
  );
}

function IconScissors({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <line x1="8.2" y1="7.8" x2="19" y2="18" />
      <line x1="8.2" y1="16.2" x2="19" y2="6" />
    </svg>
  );
}

function IconNeedle({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21c3-1 5-2 7-4l9-9a2.5 2.5 0 0 0-3.5-3.5l-9 9c-2 2-3 4-4 7" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <path d="M8 16c-1.5 0-3-0.5-4-1.5" />
    </svg>
  );
}

function IconCheckBadge({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l2.4 1.8 3-.4 1 2.8 2.6 1.5-.9 3 .9 3-2.6 1.5-1 2.8-3-.4L12 20l-2.4-1.8-3 .4-1-2.8-2.6-1.5.9-3-.9-3 2.6-1.5 1-2.8 3 .4L12 2z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// 👇 4-STEP QUALITY DATA (now with an icon per step)
const QUALITY_STEPS = [
  {
    id: "01",
    title: "Fabric Inspection",
    desc: "Testing color fastness, shrinkage & weave quality before cutting begins.",
    icon: IconMagnifier,
  },
  {
    id: "02",
    title: "Precision Cutting",
    desc: "CAD-guided pattern cutting ensuring 100% perfect sizing and fit.",
    icon: IconScissors,
  },
  {
    id: "03",
    title: "Stitching Audit",
    desc: "Checking seam strength, thread matching, and pattern alignment.",
    icon: IconNeedle,
  },
  {
    id: "04",
    title: "Final Finishing",
    desc: "Thread trimming, steam ironing, and strict packaging audit.",
    icon: IconCheckBadge,
  },
];

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
            style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}
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

/* ------------------------------------------------------------------ */
/*  Single card in the 4-Step Quality Inspection grid                  */
/* ------------------------------------------------------------------ */
function QualityStepCard({ step, index, isVisible }) {
  const Icon = step.icon;
  // Alternate the tilt direction and corner-morph pattern per card so the
  // four cards don't all warp identically — reads as a deliberate "shape
  // change" instead of one repeated hover effect.
  const isEven = index % 2 === 0;

  return (
    // Outer wrapper: ONLY handles the one-time scroll-reveal. Keeping the
    // entrance transform here (and not on the card itself) matters —
    // an inline `transform` style always wins over Tailwind's `hover:`
    // transform classes, so putting both on one element silently killed
    // the hover motion before.
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: isVisible ? `${index * 0.13}s` : "0s",
      }}
    >
      <div
        className="quality-step-card group relative bg-white/45 backdrop-blur-sm border border-[#BE6E5B]/20 p-6 overflow-hidden cursor-default"
        style={{
          borderRadius: "20px",
          "--tilt": isEven ? "-2.5deg" : "2.5deg",
          "--radius-hover": isEven
            ? "34px 8px 34px 8px"
            : "8px 34px 8px 34px",
        }}
      >
        {/* Diagonal shine sweep on hover */}
        <span className="shine-layer" aria-hidden="true" />

        {/* Decorative background circle, fades out as the card inverts */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-24 h-24 bg-[#BE6E5B]/5 rounded-bl-[100px] -z-10 group-hover:opacity-0 transition-opacity duration-300"
        />

        <div className="relative z-[3] flex items-start justify-between mb-3">
          <span className="font-display text-5xl font-black text-[#7A3D2A]/10 group-hover:text-[#F2D9C3]/25 transition-colors duration-500">
            {step.id}
          </span>

          <div className="quality-icon-badge flex items-center justify-center w-11 h-11 rounded-full border border-[#BE6E5B]/30 bg-[#BE6E5B]/8 text-[#7A3D2A] shadow-[0_4px_14px_rgba(122,61,42,0.10)] group-hover:bg-[#FDF7F2] group-hover:text-[#7A3D2A] group-hover:border-[#FDF7F2] group-hover:rotate-[12deg] group-hover:scale-110 transition-all duration-500">
            {/* Idle float lives on this inner span so it never fights the
                badge's own hover rotate/scale (both animate transform). */}
            <span className="quality-icon-float flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </span>
          </div>
        </div>

        <h4 className="relative z-[3] font-sans font-bold text-[#7A3D2A] text-lg mb-2 group-hover:text-[#FDF7F2] transition-colors duration-300">
          {step.title}
        </h4>
        <p className="relative z-[3] font-sans text-[13px] text-[#5C3120]/80 group-hover:text-[#F2D9C3]/85 leading-relaxed transition-colors duration-300">
          {step.desc}
        </p>

        <div
          aria-hidden="true"
          className="relative z-[3] mt-4 h-[2px] w-8 bg-gradient-to-r from-[#7A3D2A] to-[#BE6E5B] rounded-full group-hover:w-full group-hover:from-[#F2D9C3] group-hover:to-[#BE6E5B] transition-all duration-700 ease-out"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  4-Step Quality Inspection section (scroll-triggered animation)     */
/* ------------------------------------------------------------------ */
function QualityProcessSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // If IntersectionObserver isn't available, just show everything.
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="mt-24 pt-16 border-t border-[#BE6E5B]/15 relative"
    >
      <style>{`
        @keyframes qualityShine {
          0% { transform: translateX(-160%) skewX(-20deg); }
          100% { transform: translateX(220%) skewX(-20deg); }
        }
        @keyframes qualityNodePop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes qualityIconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .quality-step-card {
          isolation: isolate;
          will-change: transform, border-radius;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
            border-radius 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
            background 0.45s ease, border-color 0.45s ease,
            box-shadow 0.45s ease;
          box-shadow: 0 2px 10px rgba(122, 61, 42, 0.05);
        }
        /* The dramatic hover: the card lifts, tilts (direction alternates
           per card via --tilt), its corners morph from a plain rounded
           rectangle into an asymmetric shape (--radius-hover), and the
           surface inverts to a dark, warm fill. */
        .quality-step-card:hover {
          transform: translateY(-14px) scale(1.045) rotate(var(--tilt));
          border-radius: var(--radius-hover);
          background: linear-gradient(150deg, #5c3120 0%, #3d1f12 100%);
          border-color: rgba(242, 217, 195, 0.18);
          box-shadow: 0 26px 50px rgba(61, 31, 18, 0.35);
        }
        .quality-step-card .shine-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 55%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.28),
            transparent
          );
          transform: translateX(-160%) skewX(-20deg);
          pointer-events: none;
          z-index: 2;
          opacity: 0;
        }
        /* Only run the shine while actually hovered, and don't restart
           it if the pointer re-enters mid-animation. */
        .quality-step-card:hover .shine-layer {
          opacity: 1;
          animation: qualityShine 0.9s ease-out 1;
        }
        .quality-icon-float {
          animation: qualityIconFloat 3s ease-in-out infinite;
        }
        /* Freeze the idle float the moment we hover, so the badge's own
           rotate/scale transform takes over cleanly instead of the two
           fighting over the transform property on the same frame. */
        .group:hover .quality-icon-float {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .quality-icon-float { animation: none; }
          .quality-step-card:hover .shine-layer { animation: none; opacity: 0; }
        }
      `}</style>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FDF7F2] px-6">
        <span
          className="text-[#BE6E5B] text-2xl inline-block"
          style={{
            animation: isVisible ? "qualityNodePop 0.6s ease" : "none",
          }}
        >
          ✦
        </span>
      </div>

      <div className="text-center mb-10">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[#BE6E5B] mb-3">
          Zero Compromise
        </p>
        <h3 className="font-display text-3xl md:text-4xl font-bold text-[#7A3D2A]">
          4-Step Quality Inspection
        </h3>
      </div>

      {/* Animated progress connector — uses the exact same grid-cols-4/gap-6
          track as the card grid below, so each node sits centered directly
          above its matching card instead of floating in a separate,
          mismatched-width box. Only shown at the breakpoint where the
          cards are actually laid out in a single row of 4. */}
      <div className="relative mb-10 hidden lg:grid grid-cols-4 gap-6">
        <div className="absolute top-1/2 left-[12.5%] right-[12.5%] -translate-y-1/2 h-[2px] bg-[#BE6E5B]/15 rounded-full" />
        <div
          className="absolute top-1/2 left-[12.5%] -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#7A3D2A] to-[#BE6E5B] rounded-full"
          style={{
            width: isVisible ? "75%" : "0%",
            transition: "width 1.3s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}
        />
        {QUALITY_STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center justify-center">
            <div
              className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full border-2 border-[#7A3D2A] bg-[#FDF7F2] font-display text-[10px] font-black text-[#7A3D2A]"
              style={{
                opacity: isVisible ? 1 : 0,
                animation: isVisible
                  ? `qualityNodePop 0.5s ease ${0.25 + i * 0.15}s backwards`
                  : "none",
              }}
            >
              {s.id}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {QUALITY_STEPS.map((qStep, i) => (
          <QualityStepCard
            key={qStep.id}
            step={qStep}
            index={i}
            isVisible={isVisible}
          />
        ))}
      </div>
    </div>
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
              // SEO ke liye Reviews wapis fetch kar rahe hain
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

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Top Video Grid Section */}
          <div className="grid lg:grid-cols-[0.92fr_1fr] items-center gap-12 lg:gap-20">
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
                <span className="text-[#BE6E5B] text-base animate-pulse">
                  ✦
                </span>
              </div>

              <p className="mt-6 max-w-lg font-sans text-base leading-[1.9] text-[#4A2E1E] md:text-[15px]">
                At SANWARIYAS, every idea is shaped with careful fabric
                selection, clean cutting, skilled stitching, and final quality
                checks. Share your design, size set, color preference, or
                wholesale requirement, and our team will curate production-ready
                pieces for your store.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { v: "10K+", l: "Pieces / month" },
                  { v: "4-Step", l: "Quality control" },
                  { v: "1500+", l: "Designs / season" },
                  { v: "15+", l: "Fabric types" },
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

          {/*  4-Step Quality Process — enhanced styling & animation */}
          <QualityProcessSection />
        </div>
      </section>
      <CustomerReviewsSection />
    </>
  );
}