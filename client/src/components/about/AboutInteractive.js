// FILE: client/src/components/about/AboutInteractive.js
"use client";

import Image from "next/image";

// ── OWNERS / LEADERSHIP ──
const OWNERS = [
  {
    name: "Sonali Kanther",
    role: "CEO & Founder",
    bio: "Sonali is the driving force behind SANWARIYAS, setting the strategic vision for our global B2B export operations. Her commitment to authentic craftsmanship and scalable manufacturing has positioned the brand as a trusted partner for retailers worldwide.",
    image: "/images/team/sonali.png",
    initial: "S",
  },
  {
    name: "Sanyam Kanther",
    role: "Director",
    bio: "Sanyam oversees our overarching business strategy and international expansions. His expertise in supply chain optimization ensures that our wholesale operations run with precision and unmatched reliability.",
    image: "/images/team/sanyam.png",
    initial: "S",
  },
  {
    name: "Surekha Jain",
    role: "Inventory Head",
    bio: "Surekha commands our warehousing and inventory control systems. Her meticulous tracking prevents stockouts and ensures seamless fulfillment of high-volume B2B orders.",
    image: "/images/team/surekha.png",
    initial: "S",
  },
  {
    name: "Manoj Jain",
    role: "Resource Head",
    bio: "Manoj manages our extensive raw material sourcing and vendor network. He ensures that our factory is always stocked with the finest fabrics required for large-scale wholesale production.",
    image: "/images/team/manoj.png",
    initial: "M",
  },
];

// ── Fallback avatar shown if photo file is missing ──
function AvatarFallback({ initial, size = 120 }) {
  return (
    <div
      aria-hidden="true"
      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F2D9C3] to-[#E0BFA2]"
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: `${size * 0.45}px`,
        }}
        className="font-bold text-[#7A3D2A] opacity-70"
      >
        {initial}
      </span>
    </div>
  );
}

function TeamCard({ member }) {
  return (
    <article className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl bg-white/70 backdrop-blur-xl border border-[#BE6E5B]/20 h-full">
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
            className="relative z-10 object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 bg-gradient-to-t from-[#7A3D2A]/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        />

        <div
          aria-hidden="true"
          className="absolute bottom-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-[#7A3D2A] to-[#BE6E5B] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
        >
          <span className="font-serif font-bold text-[#FDF7F2] text-lg">
            {member.initial}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <p className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-extrabold mb-2">
          {member.role}
        </p>

        <h3
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          className="text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-3"
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

export default function AboutInteractive({ values }) {
  const displayValues = values || [];

  return (
    <>
      {/* ══ LEADERSHIP SECTION (OWNERS) ══ */}
      <section className="relative bg-[#FDF7F2] pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 text-center mb-16">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
            Leadership
          </p>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            className="text-4xl md:text-5xl font-bold text-[#7A3D2A]"
          >
            The Visionaries
          </h2>
        </div>

        <ul className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20 list-none p-0 m-0">
          {OWNERS.map((owner) => (
            <li key={owner.name}>
              <TeamCard member={owner} />
            </li>
          ))}
        </ul>
      </section>

      {/* ══ VALUES SECTION ══ */}
      <section
        aria-labelledby="values-heading"
        className="relative overflow-hidden bg-gradient-to-br from-[#FDF7F2] to-[#F2D9C3] py-32"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
              How Trust Gets Built
            </p>
            <h2
              id="values-heading"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6"
            >
              Our Core Principles
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 list-none p-0 m-0">
            {displayValues.map((val) => (
              <li key={val.title}>
                <article className="group relative rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl bg-white/60 backdrop-blur-xl border border-[#BE6E5B]/20 overflow-hidden h-full">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  <div
                    aria-hidden="true"
                    className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDF7F2] to-[#E0BFA2] border border-[#BE6E5B]/30 shadow-inner flex items-center justify-center mx-auto mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  >
                    <span className="text-2xl text-[#7A3D2A]">{val.icon}</span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                    className="relative z-10 text-2xl font-bold text-[#7A3D2A] mb-4"
                  >
                    {val.title}
                  </h3>

                  <p className="relative z-10 font-sans text-sm text-[#a07f61] leading-relaxed font-medium">
                    {val.desc}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}