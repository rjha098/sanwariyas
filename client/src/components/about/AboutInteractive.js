// FILE: client/src/components/about/AboutInteractive.js
"use client";

import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ── OWNERS / LEADERSHIP ──
const OWNERS = [
  {
    name: "Sonali Kanther",
    role: "CEO & Founder",
    bio: "Sonali is the driving force behind SANWARIYAS, setting the strategic vision for our global B2B export operations. Her commitment to authentic craftsmanship and scalable manufacturing has positioned the brand as a trusted partner for retailers worldwide.",
    image: "/images/sonali.png",
    initial: "S",
  },
  {
    name: "Sanyam Kanther",
    role: "Director",
    bio: "Sanyam oversees our overarching business strategy and international expansions. His expertise in supply chain optimization ensures that our wholesale operations run with precision and unmatched reliability.",
    image: "/images/sanyam.png",
    initial: "S",
  },
];

// ── Woven cross-hatch texture — a recurring, subject-true motif (handloom
// cotton weave) used instead of a generic dot-grid, at varying opacity so
// each section reads as considered rather than copy-pasted. ──

function WeaveTexture({ opacity = 0.035 }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage:
          "repeating-linear-gradient(45deg, #7A3D2A 0, #7A3D2A 1px, transparent 0, transparent 14px), repeating-linear-gradient(-45deg, #7A3D2A 0, #7A3D2A 1px, transparent 0, transparent 14px)",
      }}
    />
  );
}

// ── Fallback avatar shown if photo file is missing ──
function AvatarFallback({ initial, size = 120 }) {
  return (
    <div
      aria-hidden="true"
      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F2D9C3] via-[#E7CBAA] to-[#D9AE85]"
    >
      <span
        className={`${cormorant.className} font-bold text-[#7A3D2A]/70`}
        style={{ fontSize: `${size * 0.45}px` }}
      >
        {initial}
      </span>
    </div>
  );
}

function TeamCard({ member }) {
  return (
    <article className="group relative rounded-[1.75rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-white/70 backdrop-blur-xl border border-[#BE6E5B]/15 shadow-[0_6px_24px_rgba(122,61,42,0.06)] hover:shadow-[0_28px_60px_rgba(122,61,42,0.16)] h-full">
      {/* Gold hairline that appears on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-[#BE6E5B]/0 group-hover:ring-[#BE6E5B]/40 transition-all duration-500 z-30 pointer-events-none"
      />

      {/* Stitched swatch-tag corner — a small folded-label detail, evoking
          a fabric sample tag rather than a generic profile card. */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-8 z-30 w-8 h-10 pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500"
      >
        <svg viewBox="0 0 32 40" className="w-full h-full" fill="none">
          <path
            d="M2 0 H30 V32 L16 40 L2 32 Z"
            fill="#FDF7F2"
            stroke="#BE6E5B"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          <line
            x1="6"
            y1="9"
            x2="26"
            y2="9"
            stroke="#BE6E5B"
            strokeOpacity="0.6"
            strokeWidth="1.5"
            strokeDasharray="2.5 2.5"
          />
        </svg>
      </div>

      <div className="relative w-full overflow-hidden bg-[#F2D9C3] aspect-[4/3]">
        <div className="absolute inset-0">
          <AvatarFallback initial={member.initial} size={120} />
        </div>

        {member.image && (
          <Image
            src={member.image}
            alt={`${member.name}, ${member.role} at SANWARIYAS`}
            fill
            priority={member.name === "Sonali Kanther"}
            decoding="async"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            className="relative z-10 object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 bg-gradient-to-t from-[#3E1E13]/70 via-[#7A3D2A]/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"
        />

        <div
          aria-hidden="true"
          className="absolute top-4 left-4 z-30 h-8 w-8 rounded-full border border-white/30 backdrop-blur-md bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
        >
          <span className="text-white text-xs">✦</span>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-4 right-4 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-[#7A3D2A] to-[#BE6E5B] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
        >
          <span className="font-serif font-bold text-[#FDF7F2] text-lg">
            {member.initial}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 relative">
        <p className="font-sans text-[9px] md:text-[10px] tracking-[0.32em] uppercase text-[#BE6E5B] font-extrabold mb-2">
          {member.role}
        </p>

        <h3
          className={`${cormorant.className} text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-3 leading-tight`}
        >
          {member.name}
        </h3>

        <div
          aria-hidden="true"
          className="h-[2px] w-8 bg-gradient-to-r from-[#BE6E5B] to-transparent rounded-full mb-4 transition-all duration-500 group-hover:w-16"
        />

        <p className="font-sans text-sm text-[#a07f61] leading-relaxed font-medium">
          {member.bio}
        </p>
      </div>
    </article>
  );
}

export default function AboutInteractive() {
  return (
    <>
      {/* ══ LEADERSHIP ("The Visionaries") ══ */}
      <section className="relative overflow-hidden bg-[#FDF7F2] pt-24 pb-20 md:pt-28 md:pb-24">
        <WeaveTexture opacity={0.025} />
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />

        <div className="relative max-w-6xl mx-auto px-4 text-center mb-14 md:mb-16">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
            Leadership
          </p>
          <h2
            className={`${cormorant.className} text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6 leading-tight`}
          >
            The Visionaries
          </h2>
          <div
            aria-hidden="true"
            className="flex items-center justify-center gap-4"
          >
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
            <span className="text-[#BE6E5B] text-xl">✦</span>
            <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
          </div>
        </div>

        <ul className="relative max-w-3xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 list-none p-0 m-0">
          {OWNERS.map((owner) => (
            <li key={owner.name}>
              <TeamCard member={owner} />
            </li>
          ))}
        </ul>
      </section>

      {/* ══ VALUES ("How Trust Gets Built") - Continuous Prose ══ */}
      <section
        aria-labelledby="values-heading"
        className="relative overflow-hidden bg-gradient-to-br from-[#FDF7F2] to-[#F2D9C3] py-24 md:py-28"
      >
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />
        <WeaveTexture opacity={0.045} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
              How Trust Gets Built
            </p>
            <h2
              id="values-heading"
              className={`${cormorant.className} text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6 leading-tight`}
            >
              Our Core Principles
            </h2>
            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-4"
            >
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-xl">✦</span>
              <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>
          </div>

          <div className="font-sans text-base md:text-lg text-[#a07f61] max-w-3xl mx-auto leading-relaxed font-medium space-y-6 text-left md:text-center">
            <p>
              Retailers don't reorder because a brand asks nicely. They reorder
              because the last shipment matched the first one, and the one
              before that. That's the quiet discipline Sanwariyas was built on.
              Fair pricing that didn't shift with demand, and deliveries that
              came when promised, not when convenient.
            </p>
            <p>
              It means having accountability—a willingness to actually listen
              when a wholesaler said a design wasn't moving, or a fit needed
              adjusting, and to act on it, not just note it down.
            </p>

            {/* Quote styled as a stitched fabric label/tag — the one
                deliberate accent moment in this section: a dashed border
                evoking a hand-sewn hem rather than a generic pull-quote. */}
            <div className="pt-6 flex justify-center">
              <div className="relative max-w-2xl w-full rounded-2xl border border-dashed border-[#BE6E5B]/40 bg-white/50 backdrop-blur-sm px-6 py-8 md:px-10 md:py-10">
                <span
                  aria-hidden="true"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FDF7F2] px-4 text-[#BE6E5B] text-lg"
                >
                  ✦
                </span>
                <p className="font-sans text-[15px] md:text-[17px] font-bold text-[#7A3D2A] leading-relaxed text-center">
                  "None of this makes headlines. But it's the reason a small
                  workshop kept getting called back, long after the first order
                  was filled, building a foundation of long-term trust."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}