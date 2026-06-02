"use client";

import Image from "next/image";

// ── OWNERS / LEADERSHIP ──
const OWNERS = [
  {
    name: "Sanmay",
    role: "Founder & Creative Director",
    bio: "Sanmay is the visionary behind SANWARIYAS, blending traditional Rajasthani aesthetics with modern fashion trends. With a focus on artisan heritage, he ensures every collection tells a unique story of craft and quality.",
    image: "/images/team/sanmay.jpeg",
    initial: "S",
  },
  {
    name: "Rahul Soni",
    role: "HR & Operations Head",
    bio: "Rahul leads our human resources and internal operations, ensuring a seamless workflow across all departments. His focus on team building and operational efficiency is the backbone of our growing workforce.",
    image: "/images/team/rahul.jpeg",
    initial: "R",
  },
];

// ── TEAM DATA ──
const TEAM = [
  {
    name: "Geeta Singh",
    role: "Social Media Associate & Inventory Analyst",
    bio: "Geeta manages our social media presence while simultaneously tracking real-time inventory levels across all product lines. Her dual role keeps our catalogue content fresh and ensures stock availability is always accurately reflected for buyers.",
    image: "/images/team/geeta.png",
    initial: "G",
  },
  {
    name: "Shalvy Sadh",
    role: "Sales Manager",
    bio: "Shalvy leads our wholesale sales operations — building strong relationships with boutique owners and retailers across India and international markets. Her deep product knowledge and client-first approach have been key to SANWARIYAS's consistent order growth.",
    image: "/images/team/shalvy.png",
    initial: "S",
  },
  {
    name: "Aasmi Marwal",
    role: "Business Growth & Data Analyst",
    bio: "Aasmi drives strategic decisions through data — tracking sales trends, analysing buyer behaviour, and identifying new market opportunities. Her insights shape our seasonal catalogue planning and pricing strategy for wholesale clients.",
    image: "/images/team/aasmi.png",
    initial: "A",
  },
  {
    name: "Yogita",
    role: "Inventory Analyst",
    bio: "Yogita keeps a sharp eye on our stock levels, coordinating with our production team to ensure that our most popular designs are always ready for dispatch.",
    image: "/images/team/yogita.png",
    initial: "Y",
  },
  {
    name: "Annu Singh",
    role: "Dispatch Supervisor & Order Processing",
    bio: "Annu oversees the entire dispatch pipeline — from order confirmation to final packaging and courier handover. She ensures every wholesale consignment is packed accurately, labelled correctly, and shipped on time, every time.",
    image: "/images/team/annu.png",
    initial: "A",
  },
  {
    name: "Manish",
    role: "Order And Return Processing",
    bio: "Manish streamlines our logistics by managing the complex flow of orders and returns, ensuring a smooth experience for our retail partners and end customers alike.",
    image: "/images/team/manish.png",
    initial: "M",
  },
  {
    name: "Mohit",
    role: "Accountant",
    bio: "Mohit manages our financial health, handling everything from factory-direct invoicing to wholesale accounts, ensuring total transparency in our pricing model.",
    image: "/images/team/mohit.png",
    initial: "M",
  },
  {
    name:"Sandeep",
    role:"Accountant",
    bio:"Sandeep oversees our day-to-day financial operations, specializing in export tax compliance, GST documentation, and multi-currency reconciliations. He ensures every international B2B transaction is processed smoothly and securely.",
    image:"/images/team/sandeep.png",
    initial:"S"
  }
  
];

const VALUES = [
  {
    title: "Premium Quality",
    icon: "✦",
    desc: "Every garment is stitched to meet export standards. No shortcuts, no compromise — only pieces we are proud to put our name on.",
  },
  {
    title: "Artisan Heritage",
    icon: "◈",
    desc: "We work with master weavers and skilled artisans from Rajasthan, preserving centuries-old craft traditions in every collection.",
  },
  {
    title: "Transparent Pricing",
    icon: "◎",
    desc: "Factory-direct means no middlemen. You get wholesale pricing straight from the source, with full invoice transparency on every order.",
  },
  {
    title: "Custom Production",
    icon: "⬡",
    desc: "From private labels to custom embroidery and size grading, we tailor every order to your exact specifications.",
  },
];

// ── Fallback avatar shown if photo file is missing ──
function AvatarFallback({ initial, size = 120 }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F2D9C3 0%, #E0BFA2 100%)",
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: `${size * 0.45}px`,
          fontWeight: 700,
          color: "#7A3D2A",
          opacity: 0.6,
        }}
      >
        {initial}
      </span>
    </div>
  );
}

function TeamCard({ member }) {
  return (
    <article
      className="group rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(122,61,42,0.15)]"
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(12px)",
        border: "1.5px solid rgba(190,110,91,0.18)",
        boxShadow: "0 4px 20px rgba(122,61,42,0.07)",
      }}
    >
      <div
        className="relative w-full overflow-hidden bg-[#F2D9C3]"
        style={{ aspectRatio: "4/3" }}
      >
        <div className="absolute inset-0">
          <AvatarFallback initial={member.initial} size={120} />
        </div>

        <Image
          src={member.image}
          alt={`${member.name} — ${member.role} at SANWARIYAS`}
          fill
          unoptimized
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          className="relative z-10 object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 z-20"
          style={{
            background:
              "linear-gradient(to top, rgba(122,61,42,0.4) 0%, transparent 55%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute bottom-3 right-3 z-30 w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #7A3D2A, #BE6E5B)",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              color: "#FDF7F2",
              fontSize: "14px",
            }}
          >
            {member.initial} 
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <p
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "8.5px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#BE6E5B",
            fontWeight: 700,
            marginBottom: "6px",
          }}
        >
          {member.role}
        </p>

        <h3
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(17px, 1.8vw, 20px)",
            fontWeight: 700,
            color: "#7A3D2A",
            marginBottom: "10px",
          }}
        >
          {member.name}
        </h3>

        <div
          style={{
            height: "2px",
            width: "28px",
            background: "rgba(190,110,91,0.4)",
            borderRadius: "2px",
            marginBottom: "12px",
          }}
        />

        <p
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "13px",
            color: "#a07f61",
            lineHeight: 1.75,
            fontWeight: 500,
          }}
        >
          {member.bio}
        </p>
      </div>
    </article>
  );
}

export default function AboutInteractive({ values: valuesProp }) {
  const displayValues = valuesProp || VALUES;

  return (
    <>
      {/* ══ LEADERSHIP SECTION (OWNERS) ══ */}
      <section
        className="relative"
        style={{ background: "#FDF7F2", padding: "80px 0 0 0" }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center mb-10">
          <p
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.65em",
              textTransform: "uppercase",
              color: "#BE6E5B",
              fontWeight: 700,
              marginBottom: "14px",
            }}
          >
            Leadership
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 700,
              color: "#7A3D2A",
            }}
          >
            The Visionaries
          </h2>
        </div>
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-8 mb-20">
          {OWNERS.map((owner) => (
            <TeamCard key={owner.name} member={owner} />
          ))}
        </div>
      </section>

      {/* ══ TEAM SECTION ══ */}
      <section
        aria-labelledby="team-heading"
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FDF7F2 0%, #F8EDE6 100%)",
          padding: "40px 0 96px 0",
        }}
      >
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.65em",
                textTransform: "uppercase",
                color: "#BE6E5B",
                fontWeight: 700,
                marginBottom: "14px",
              }}
            >
              The People
            </p>
            <h2
              id="team-heading"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 700,
                color: "#7A3D2A",
                lineHeight: 1.1,
                marginBottom: "20px",
              }}
            >
              Meet Our Team
            </h2>
            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div
                style={{
                  height: "2px",
                  width: "70px",
                  background: "linear-gradient(to right, transparent, #BE6E5B)",
                }}
              />
              <span style={{ color: "#BE6E5B", fontSize: "16px" }}>✦</span>
              <div
                style={{
                  height: "2px",
                  width: "70px",
                  background: "linear-gradient(to left, transparent, #BE6E5B)",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ VALUES SECTION ══ */}
      <section
        aria-labelledby="values-heading"
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #FDF7F2 0%, #F2D9C3 100%)",
          padding: "96px 0",
        }}
      >
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-16">
            <p
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.65em",
                textTransform: "uppercase",
                color: "#BE6E5B",
                fontWeight: 700,
                marginBottom: "14px",
              }}
            >
              What We Stand For
            </p>
            <h2
              id="values-heading"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 700,
                color: "#7A3D2A",
                lineHeight: 1.1,
                marginBottom: "20px",
              }}
            >
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayValues.map((val) => (
              <article
                key={val.title}
                className="group rounded-2xl p-7 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(122,61,42,0.13)] hover:bg-white/90"
                style={{
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(12px)",
                  border: "1.5px solid rgba(190,110,91,0.2)",
                  boxShadow: "0 4px 20px rgba(122,61,42,0.06)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 transition-all duration-400 group-hover:scale-110"
                  style={{
                    background: "rgba(190,110,91,0.1)",
                    border: "1px solid rgba(190,110,91,0.3)",
                  }}
                >
                  <span style={{ fontSize: "22px", color: "#BE6E5B" }}>
                    {val.icon}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(17px, 1.8vw, 20px)",
                    fontWeight: 700,
                    color: "#7A3D2A",
                    marginBottom: "10px",
                  }}
                >
                  {val.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontSize: "13.5px",
                    color: "#a07f61",
                    lineHeight: 1.8,
                    fontWeight: 500,
                  }}
                >
                  {val.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
