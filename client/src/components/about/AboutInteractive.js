
// "use client";

// import Image from "next/image";

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

// // ── TEAM DATA ──
// const TEAM = [
//   {
//     name: "Rahul Soni",
//     role: "Business Growth & Operations Head",
//     bio: "Rahul optimizes our internal human capital and operational workflows, ensuring that our production teams are aligned with strict export deadlines and quality benchmarks.",
//     image: "/images/team/rahul.png",
//     initial: "R",
//   },
//   {
//     name: "Manoj Jain",
//     role: "Resource Head",
//     bio: "Manoj manages our extensive raw material sourcing and vendor network. He ensures that our factory is always stocked with the finest fabrics required for large-scale wholesale production.",
//     image: "/images/team/manoj.png",
//     initial: "M",
//   },
//   {
//     name: "Surekha Jain",
//     role: "Inventory Head",
//     bio: "Surekha commands our warehousing and inventory control systems. Her meticulous tracking prevents stockouts and ensures seamless fulfillment of high-volume B2B orders.",
//     image: "/images/team/surekha.png",
//     initial: "S",
//   },
//   {
//     name: "Shalvy Sadh",
//     role: "Online Sales Head",
//     bio: "Shalvy leads our digital wholesale operations — building strong relationships with boutique owners and online retailers globally. Her deep product knowledge is key to our consistent order growth.",
//     image: "/images/team/shalvy.png",
//     initial: "S",
//   },
//   {
//     name: "Suraj",
//     role: "Offline Sales Head",
//     bio: "Suraj leads our physical B2B sales channels, managing relationships with prominent boutique owners, distributors, and bulk buyers through face-to-face engagements and trade events.",
//     image: "/images/team/suraj.png",
//     initial: "S",
//   },
//   {
//     name: "Manisha",
//     role: "Customer Relationship Manager",
//     bio: "Manisha is the dedicated point of contact for our wholesale partners. She ensures every client receives personalized support, from initial inquiry to post-delivery satisfaction.",
//     image: "/images/team/manisha.png",
//     initial: "M",
//   },
//   {
//     name: "Annu Singh",
//     role: "Dispatch Incharge",
//     bio: "Annu oversees the entire dispatch pipeline — from packaging to international courier handover. She ensures every wholesale consignment is labelled correctly and shipped securely on time.",
//     image: "/images/team/annu.png",
//     initial: "A",
//   },
//   {
//     name: "Geeta Singh",
//     role: "Social Media Manager",
//     bio: "Geeta manages our digital outreach and brand visibility. Her strategic content keeps our wholesale catalogue fresh and showcases our latest export lots to an international audience.",
//     image: "/images/team/geeta.png",
//     initial: "G",
//   },
//   {
//     name: "Ram Kumar  jha",
//     role: "Lead Full Stack Developer",
//     bio: "Ram is the technical architect behind our seamless B2B digital portal. Utilizing the MERN stack and Next.js, he builds and maintains the robust, secure infrastructure that allows our global partners to browse catalogues and place bulk inquiries effortlessly.",
//     image: "/images/team/ram.png",
//     initial: "R",
//   },
//   {
//     name: "Sandeep",
//     role: "Accountant",
//     bio: "Sandeep oversees our day-to-day financial operations, specializing in export tax compliance, GST documentation, and multi-currency reconciliations for seamless B2B transactions.",
//     image: "/images/team/sandeep.png",
//     initial: "S",
//   },
//   {
//     name: "Mohit",
//     role: "Accountant",
//     bio: "Mohit manages our financial health, handling everything from factory-direct invoicing to wholesale ledger accounts, ensuring total transparency in our pricing model.",
//     image: "/images/team/mohit.png",
//     initial: "M",
//   }
// ];

// // ── Fallback avatar shown if photo file is missing ──
// function AvatarFallback({ initial, size = 120 }) {
//   return (
//     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F2D9C3] to-[#E0BFA2]">
//       <span
//         style={{
//           fontFamily: "'Cormorant Garamond', Georgia, serif",
//           fontSize: `${size * 0.45}px`,
//         }}
//         className="font-bold text-[#7A3D2A] opacity-70"
//       >
//         {initial}
//       </span>
//     </div>
//   );
// }

// function TeamCard({ member }) {
//   return (
//     <article className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl bg-white/70 backdrop-blur-xl border border-[#BE6E5B]/20">
//       <div className="relative w-full overflow-hidden bg-[#F2D9C3] aspect-[4/3]">
//         <div className="absolute inset-0">
//           <AvatarFallback initial={member.initial} size={120} />
//         </div>

//         {member.image && (
//           <Image
//             src={member.image}
//             alt={`${member.name} — ${member.role} at SANWARIYAS`}
//             fill
//             unoptimized
//             sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
//             className="relative z-10 object-cover object-top transition-transform duration-700 group-hover:scale-110"
//           />
//         )}

//         <div
//           aria-hidden="true"
//           className="absolute inset-0 z-20 bg-gradient-to-t from-[#7A3D2A]/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"
//         />

//         <div
//           aria-hidden="true"
//           className="absolute bottom-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-[#7A3D2A] to-[#BE6E5B] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
//         >
//           <span className="font-serif font-bold text-[#FDF7F2] text-lg">
//             {member.initial}
//           </span>
//         </div>
//       </div>

//       <div className="p-6 md:p-8">
//         <p className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-extrabold mb-2">
//           {member.role}
//         </p>

//         <h3
//           style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//           className="text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-3"
//         >
//           {member.name}
//         </h3>

//         <div className="h-[2px] w-8 bg-gradient-to-r from-[#BE6E5B] to-transparent rounded-full mb-4 transition-all duration-500 group-hover:w-16" />

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
//       {/* ══ LEADERSHIP SECTION (OWNERS) ══ */}
//       <section className="relative bg-[#FDF7F2] pt-24 pb-12">
//         <div className="max-w-6xl mx-auto px-4 text-center mb-16">
//           <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
//             Leadership
//           </p>
//           <h2
//             style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//             className="text-4xl md:text-5xl font-bold text-[#7A3D2A]"
//           >
//             The Visionaries
//           </h2>
//         </div>
//         <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-12 mb-20">
//           {OWNERS.map((owner) => (
//             <TeamCard key={owner.name} member={owner} />
//           ))}
//         </div>
//       </section>

//       {/* ══ TEAM SECTION ══ */}
//       <section
//         aria-labelledby="team-heading"
//         className="relative overflow-hidden bg-gradient-to-b from-[#FDF7F2] to-[#F8EDE6] pt-12 pb-32"
//       >
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16 md:mb-20">
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
//               The People
//             </p>
//             <h2
//               id="team-heading"
//               style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//               className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6"
//             >
//               Meet Our Team
//             </h2>
//             <div
//               aria-hidden="true"
//               className="flex items-center justify-center gap-4 mb-6"
//             >
//               <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//               <span className="text-[#BE6E5B] text-xl">✦</span>
//               <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {TEAM.map((member) => (
//               <TeamCard key={member.name} member={member} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══ VALUES SECTION ══ */}
//       <section
//         aria-labelledby="values-heading"
//         className="relative overflow-hidden bg-gradient-to-br from-[#FDF7F2] to-[#F2D9C3] py-32"
//       >
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-20">
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
//               What We Stand For
//             </p>
//             <h2
//               id="values-heading"
//               style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//               className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6"
//             >
//               Our Core Values
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {displayValues.map((val) => (
//               <article
//                 key={val.title}
//                 className="group relative rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl bg-white/60 backdrop-blur-xl border border-[#BE6E5B]/20 overflow-hidden"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDF7F2] to-[#E0BFA2] border border-[#BE6E5B]/30 shadow-inner flex items-center justify-center mx-auto mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
//                   <span className="text-2xl text-[#7A3D2A]">{val.icon}</span>
//                 </div>
//                 <h3
//                   style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//                   className="relative z-10 text-2xl font-bold text-[#7A3D2A] mb-4"
//                 >
//                   {val.title}
//                 </h3>
//                 <p className="relative z-10 font-sans text-sm text-[#a07f61] leading-relaxed font-medium">
//                   {val.desc}
//                 </p>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );  
// }




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
];

// ── TEAM DATA ──
const TEAM = [
  {
    name: "Rahul Soni",
    role: "Business Growth & Operations Head",
    bio: "Rahul optimizes our internal human capital and operational workflows, ensuring that our production teams are aligned with strict export deadlines and quality benchmarks.",
    image: "/images/team/rahul.png",
    initial: "R",
  },
  {
    name: "Manoj Jain",
    role: "Resource Head",
    bio: "Manoj manages our extensive raw material sourcing and vendor network. He ensures that our factory is always stocked with the finest fabrics required for large-scale wholesale production.",
    image: "/images/team/manoj.png",
    initial: "M",
  },
  {
    name: "Surekha Jain",
    role: "Inventory Head",
    bio: "Surekha commands our warehousing and inventory control systems. Her meticulous tracking prevents stockouts and ensures seamless fulfillment of high-volume B2B orders.",
    image: "/images/team/surekha.png",
    initial: "S",
  },
  {
    name: "Shalvy Sadh",
    role: "Online Sales Head",
    bio: "Shalvy leads our digital wholesale operations — building strong relationships with boutique owners and online retailers globally. Her deep product knowledge is key to our consistent order growth.",
    image: "/images/team/shalvy.png",
    initial: "S",
  },
  {
    name: "Suraj",
    role: "Offline Sales Head",
    bio: "Suraj leads our physical B2B sales channels, managing relationships with prominent boutique owners, distributors, and bulk buyers through face-to-face engagements and trade events.",
    image: "/images/team/suraj.png",
    initial: "S",
  },
  {
    name: "Manisha",
    role: "Customer Relationship Manager",
    bio: "Manisha is the dedicated point of contact for our wholesale partners. She ensures every client receives personalized support, from initial inquiry to post-delivery satisfaction.",
    image: "/images/team/manisha.png",
    initial: "M",
  },
  {
    name: "Annu Singh",
    role: "Dispatch Incharge",
    bio: "Annu oversees the entire dispatch pipeline — from packaging to international courier handover. She ensures every wholesale consignment is labelled correctly and shipped securely on time.",
    image: "/images/team/annu.png",
    initial: "A",
  },
  {
    name: "Geeta Singh",
    role: "Social Media Manager",
    bio: "Geeta manages our digital outreach and brand visibility. Her strategic content keeps our wholesale catalogue fresh and showcases our latest export lots to an international audience.",
    image: "/images/team/geeta.png",
    initial: "G",
  },
  {
    name: "Ram Kumar  jha",
    role: "Lead Full Stack Developer",
    bio: "Ram is the technical architect behind our seamless B2B digital portal. Utilizing the MERN stack and Next.js, he builds and maintains the robust, secure infrastructure that allows our global partners to browse catalogues and place bulk inquiries effortlessly.",
    image: "/images/team/ram.png",
    initial: "R",
  },
  {
    name: "Sandeep",
    role: "Accountant",
    bio: "Sandeep oversees our day-to-day financial operations, specializing in export tax compliance, GST documentation, and multi-currency reconciliations for seamless B2B transactions.",
    image: "/images/team/sandeep.png",
    initial: "S",
  },
  {
    name: "Mohit",
    role: "Accountant",
    bio: "Mohit manages our financial health, handling everything from factory-direct invoicing to wholesale ledger accounts, ensuring total transparency in our pricing model.",
    image: "/images/team/mohit.png",
    initial: "M",
  }
];

// ── Fallback avatar shown if photo file is missing ──
function AvatarFallback({ initial, size = 120 }) {
  return (
    <div aria-hidden="true" className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F2D9C3] to-[#E0BFA2]">
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
            alt={`${member.name} — ${member.role} at SANWARIYAS`}
            fill
            unoptimized
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

        <div aria-hidden="true" className="h-[2px] w-8 bg-gradient-to-r from-[#BE6E5B] to-transparent rounded-full mb-4 transition-all duration-500 group-hover:w-16" />

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
        {/* ✅ A11Y FIX: Converted grid wrapper to <ul> for semantic list enumeration */}
        <ul className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-12 mb-20 list-none p-0 m-0">
          {OWNERS.map((owner) => (
            <li key={owner.name}>
              <TeamCard member={owner} />
            </li>
          ))}
        </ul>
      </section>

      {/* ══ TEAM SECTION ══ */}
      <section
        aria-labelledby="team-heading"
        className="relative overflow-hidden bg-gradient-to-b from-[#FDF7F2] to-[#F8EDE6] pt-12 pb-32"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
              The People
            </p>
            <h2
              id="team-heading"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6"
            >
              Meet Our Team
            </h2>
            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-xl">✦</span>
              <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>
          </div>

          {/* ✅ A11Y FIX: Converted grid wrapper to <ul> */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 list-none p-0 m-0">
            {TEAM.map((member) => (
              <li key={member.name}>
                <TeamCard member={member} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ VALUES SECTION ══ */}
      <section
        aria-labelledby="values-heading"
        className="relative overflow-hidden bg-gradient-to-br from-[#FDF7F2] to-[#F2D9C3] py-32"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
              What We Stand For
            </p>
            <h2
              id="values-heading"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6"
            >
              Our Core Values
            </h2>
          </div>

          {/* ✅ A11Y FIX: Converted grid wrapper to <ul> */}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 list-none p-0 m-0">
            {displayValues.map((val) => (
              <li key={val.title}>
                <article
                  className="group relative rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl bg-white/60 backdrop-blur-xl border border-[#BE6E5B]/20 overflow-hidden h-full"
                >
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div aria-hidden="true" className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDF7F2] to-[#E0BFA2] border border-[#BE6E5B]/30 shadow-inner flex items-center justify-center mx-auto mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <span className="text-2xl text-[#7A3D2A]">{val.icon}</span>
                  </div>
                  
                  <h3
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
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