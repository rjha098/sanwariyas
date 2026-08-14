// // FILE: client/src/components/about/AboutInteractive.js
// "use client";

// import { Cormorant_Garamond } from "next/font/google";
// import Image from "next/image";

// const cormorant = Cormorant_Garamond({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// // ── OWNERS / LEADERSHIP ──
// const OWNERS = [
//   {
//     name: "Sonali Kanther",
//     role: "CEO & Founder",
//     bio: "Sonali is the driving force behind SANWARIYAS, setting the strategic vision for our global B2B export operations. Her commitment to authentic craftsmanship and scalable manufacturing has positioned the brand as a trusted partner for retailers worldwide.",
//     image: "/images/team/sonali.png",
//     initial: "S",
//   },
//   {
//     name: "Sanyam Kanther",
//     role: "Director",
//     bio: "Sanyam oversees our overarching business strategy and international expansions. His expertise in supply chain optimization ensures that our wholesale operations run with precision and unmatched reliability.",
//     image: "/images/team/sanyam.png",
//     initial: "S",
//   },
// ];

// // ── Fallback avatar shown if photo file is missing ──
// function AvatarFallback({ initial, size = 120 }) {
//   return (
//     <div
//       aria-hidden="true"
//       className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F2D9C3] via-[#E7CBAA] to-[#D9AE85]"
//     >
//       <span
//         className={`${cormorant.className} font-bold text-[#7A3D2A]/70`}
//         style={{ fontSize: `${size * 0.45}px` }}
//       >
//         {initial}
//       </span>
//     </div>
//   );
// }

// function TeamCard({ member }) {
//   return (
//     <article className="group relative rounded-[1.75rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-white/70 backdrop-blur-xl border border-[#BE6E5B]/15 shadow-[0_6px_24px_rgba(122,61,42,0.06)] hover:shadow-[0_28px_60px_rgba(122,61,42,0.16)] h-full">
//       {/* Gold hairline that appears on hover */}
//       <div
//         aria-hidden="true"
//         className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-[#BE6E5B]/0 group-hover:ring-[#BE6E5B]/40 transition-all duration-500 z-30 pointer-events-none"
//       />

//       <div className="relative w-full overflow-hidden bg-[#F2D9C3] aspect-[4/3]">
//         <div className="absolute inset-0">
//           <AvatarFallback initial={member.initial} size={120} />
//         </div>

//         {member.image && (
//           <Image
//             src={member.image}
//             alt={`${member.name}, ${member.role} at SANWARIYAS`}
//             fill
//             priority={member.name === "Sonali Kanther"}
//             decoding="async"
//             sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
//             className="relative z-10 object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.08]"
//           />
//         )}

//         <div
//           aria-hidden="true"
//           className="absolute inset-0 z-20 bg-gradient-to-t from-[#3E1E13]/70 via-[#7A3D2A]/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"
//         />

//         <div
//           aria-hidden="true"
//           className="absolute top-4 left-4 z-30 h-8 w-8 rounded-full border border-white/30 backdrop-blur-md bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
//         >
//           <span className="text-white text-xs">✦</span>
//         </div>

//         <div
//           aria-hidden="true"
//           className="absolute bottom-4 right-4 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-[#7A3D2A] to-[#BE6E5B] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
//         >
//           <span className="font-serif font-bold text-[#FDF7F2] text-lg">
//             {member.initial}
//           </span>
//         </div>
//       </div>

//       <div className="p-6 md:p-8 relative">
//         <p className="font-sans text-[9px] md:text-[10px] tracking-[0.32em] uppercase text-[#BE6E5B] font-extrabold mb-2">
//           {member.role}
//         </p>

//         <h3
//           className={`${cormorant.className} text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-3 leading-tight`}
//         >
//           {member.name}
//         </h3>

//         <div
//           aria-hidden="true"
//           className="h-[2px] w-8 bg-gradient-to-r from-[#BE6E5B] to-transparent rounded-full mb-4 transition-all duration-500 group-hover:w-16"
//         />

//         <p className="font-sans text-sm text-[#a07f61] leading-relaxed font-medium">
//           {member.bio}
//         </p>
//       </div>
//     </article>
//   );
// }

// export default function AboutInteractive({ values }) {
//   const displayValues = values || [];

//   return (
//     <>
//       {/* ══ LEADERSHIP ("The Visionaries") ══ */}
//       <section className="relative overflow-hidden bg-[#FDF7F2] pt-24 pb-20 md:pt-28 md:pb-24">
//         <div
//           aria-hidden="true"
//           className="absolute inset-0 pointer-events-none opacity-[0.025]"
//           style={{
//             backgroundImage:
//               "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)",
//             backgroundSize: "30px 30px",
//           }}
//         />
//         <div
//           aria-hidden="true"
//           className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
//         />

//         <div className="relative max-w-6xl mx-auto px-4 text-center mb-14 md:mb-16">
//           <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
//             Leadership
//           </p>
//           <h2
//             className={`${cormorant.className} text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6 leading-tight`}
//           >
//             The Visionaries
//           </h2>
//           <div
//             aria-hidden="true"
//             className="flex items-center justify-center gap-4"
//           >
//             <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//             <span className="text-[#BE6E5B] text-xl">✦</span>
//             <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//           </div>
//         </div>

//         <ul className="relative max-w-3xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 list-none p-0 m-0">
//           {OWNERS.map((owner) => (
//             <li key={owner.name}>
//               <TeamCard member={owner} />
//             </li>
//           ))}
//         </ul>
//       </section>

//       {/* ══ VALUES ("How Trust Gets Built") ══ */}
//       {/* Readable prose layout — numbered/iconed rows with a connecting
//           line, no card grid. Text unchanged. */}
//       <section
//         aria-labelledby="values-heading"
//         className="relative overflow-hidden bg-gradient-to-br from-[#FDF7F2] to-[#F2D9C3] py-24 md:py-28"
//       >
//         <div
//           aria-hidden="true"
//           className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
//         />
//         <div
//           aria-hidden="true"
//           className="absolute inset-0 opacity-[0.03] pointer-events-none"
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(45deg, #BE6E5B 0, #BE6E5B 1px, transparent 0, transparent 40px)",
//           }}
//         />

//         <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-10 md:mb-14">
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
//               How Trust Gets Built
//             </p>
//             <h2
//               id="values-heading"
//               className={`${cormorant.className} text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6 leading-tight`}
//             >
//               Our Core Principles
//             </h2>
//             <div
//               aria-hidden="true"
//               className="flex items-center justify-center gap-4"
//             >
//               <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//               <span className="text-[#BE6E5B] text-xl">✦</span>
//               <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//             </div>
//           </div>

//           <ul className="flex flex-col gap-10 md:gap-12 list-none p-0 m-0">
//             {displayValues.map((val, i) => (
//               <li key={val.title} className="flex gap-5 md:gap-7 group">
//                 <div className="flex-shrink-0 flex flex-col items-center">
//                   <div
//                     aria-hidden="true"
//                     className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-white/80 to-[#F2D9C3]/80 border border-[#BE6E5B]/25 shadow-inner flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
//                   >
//                     <span className="text-xl md:text-2xl text-[#7A3D2A]">
//                       {val.icon}
//                     </span>
//                   </div>
//                   {i !== displayValues.length - 1 && (
//                     <span
//                       aria-hidden="true"
//                       className="mt-3 flex-1 w-px bg-gradient-to-b from-[#BE6E5B]/35 to-transparent"
//                     />
//                   )}
//                 </div>
//                 <div className="pb-2">
//                   <h3
//                     className={`${cormorant.className} text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-2`}
//                   >
//                     {val.title}
//                   </h3>
//                   <p className="font-sans text-[15px] md:text-base text-[#a07f61] leading-relaxed font-medium">
//                     {val.desc}
//                   </p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>
//     </>
//   );
// }

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
];

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
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)",
            backgroundSize: "30px 30px",
          }}
        />
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
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #BE6E5B 0, #BE6E5B 1px, transparent 0, transparent 40px)",
          }}
        />

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

            {/* 🚀 FIX: TEXT SIZE REDUCED AND MATCHED TO SCREENSHOT 🚀 */}
            <div className="pt-8 pb-4 text-center">
              <p className="font-sans text-[15px] md:text-[17px] font-bold text-[#7A3D2A] leading-relaxed">
                “None of this makes headlines. But it's the reason a small
                workshop kept getting called back, long after the first order
                was filled, building a foundation of long-term trust.”
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
