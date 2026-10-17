// FILE: client/src/app/about/page.js

import { Cormorant_Garamond } from "next/font/google";
// import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import AboutInteractive from "@/components/about/AboutInteractive";

export const metadata = {
  title: "About SANWARIYAS | Jaipur Ethnic Wear Manufacturer & Wholesaler",
  description:
    "Discover SANWARIYAS, India's leading B2B ethnic wear manufacturer and wholesale kurti supplier in Jaipur. Learn about our export-quality manufacturing process and heritage.",
  keywords: [
    "Wholesale Ethnic Wear Supplier India",
    "Indian Ethnic Wear Manufacturer",
    "Wholesale Kurti Supplier India",
    "Wholesale Suit Supplier India",
    "Cotton Suit Manufacturer Jaipur",
    "Jaipur Ethnic Wear Manufacturer",
    "Wholesale Cotton Kurti Supplier",
    "Ladies Cotton Suit Manufacturer",
    "B2B Ethnic Wear Supplier",
    "Ethnic Wear Manufacturer India",
    "Ethnic Wear Wholesaler India",
    "Cotton Clothing Exporter India",
    "Private Label Ethnic Wear Manufacturer",
  ],
  alternates: { canonical: "https://sanwariyas.com/about" },
  openGraph: {
    title: "About SANWARIYAS | Jaipur Ethnic Wear Manufacturer",
    description:
      "Learn the story of SANWARIYAS — India's trusted B2B wholesale ethnic wear manufacturer & exporter.",
    url: "https://sanwariyas.com/about",
    siteName: "SANWARIYAS",
    images: [
      {
        url: "https://sanwariyas.com/images/og-about.png",
        width: 1200,
        height: 630,
        alt: "SANWARIYAS Jaipur Ethnic Wear Manufacturer and Wholesale Ethnic Wear Supplier India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About SANWARIYAS | Jaipur Ethnic Wear Manufacturer",
    description:
      "India's trusted B2B wholesale ethnic wear manufacturer & exporter.",
    images: ["https://sanwariyas.com/images/og-about.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// complete timeline text  present  here  and  mapped here

const TIMELINE = [
  {
    year: "2017",
    title: "The Beginning",
    desc: "SANWARIYAS began its journey with customised ethnic wear, crafting garments tailored to the unique requirements of retailers and laying the foundation for lasting partnerships.",
  },
  {
    year: "2018",
    title: "Fabrication & Expansion",
    desc: "We expanded our fabrication capabilities, offering a wider range of fabrics while strengthening our production process.",
  },
  {
    year: "2020",
    title: "Rebuilding & Scaling",
    desc: "Following the pandemic we rebuilt with renewed focus, introducing more designs, expanding our production capacity, and reinforcing our bulk manufacturing capabilities to meet the evolving needs of the market.",
  },
  {
    year: "2023",
    title: "In-House Operations",
    desc: "We established our own manufacturing and wholesale operations, enabling greater control over quality, consistency, and timely deliveries.",
  },
  {
    year: "2025",
    title: "Digital Presence",
    desc: "We expanded our presence online, making it easier for retailers and wholesalers to explore our collections and connect with us from anywhere.",
  },
  {
    year: "2026",
    title: "A Trusted Global Partner",
    desc: "Today, we're more than a manufacturer; we're a trusted partner for wholesalers & retailers across the globe, delivering trend-led collections, premium quality, and the confidence to grow together.",
  },
];

// ── Shared styles ─────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ── Woven cross-hatch texture — a recurring, subject-true motif (handloom
// cotton weave) used in place of a generic dot-grid. Opacity/scale is
// varied per section so the page doesn't read as one pattern stamped
// repeatedly. ──

function WeaveTexture({ opacity = 0.03, size = 14 }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage:
          "repeating-linear-gradient(45deg, #7A3D2A 0, #7A3D2A 1px, transparent 0, transparent " +
          size +
          "px), repeating-linear-gradient(-45deg, #7A3D2A 0, #7A3D2A 1px, transparent 0, transparent " +
          size +
          "px)",
      }}
    />
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
        {eyebrow}
      </p>
      <h2
        className={`${cormorant.className} text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6 leading-tight`}
      >
        {title}
      </h2>
      <div
        aria-hidden="true"
        className="flex items-center justify-center gap-4 mb-8"
      >
        <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
        <span className="text-[#BE6E5B] text-xl">✦</span>
        <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
      </div>

      {subtitle && (
        <p
          className={`${cormorant.className} italic text-lg md:text-xl text-[#a07f61] max-w-2xl mx-auto leading-relaxed font-medium`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* <Navbar /> */}

      <main id="main-content" className="bg-[#FDF7F2]">
        {/* ── 1. HERO ("Where It Started") ── */}
        <section
          aria-label="About SANWARIYAS"
          className="relative overflow-hidden pt-40 pb-32 bg-gradient-to-br from-[#FDF7F2] via-[#F5E8D8] to-[#F2D9C3]"
        >
          <WeaveTexture opacity={0.035} size={16} />
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(190,110,91,0.18) 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          >
            <span
              style={{ fontFamily: "Georgia, serif" }}
              className="text-[12rem] md:text-[25rem] font-bold text-[#7A3D2A]/[0.03] tracking-tighter leading-none"
            >
              S
            </span>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1
              className={`${cormorant.className} text-5xl md:text-7xl font-bold text-[#7A3D2A] leading-tight mb-8`}
            >
              About <em className="italic text-[#BE6E5B]">SANWARIYAS</em>
              <span className="sr-only">
                {" "}
                – Jaipur Ethnic Wear Manufacturer & Wholesale Kurti Supplier
                India
              </span>
            </h1>
            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-6 mb-12"
            >
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-2xl">✦</span>
              <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>

            <p className="font-sans text-[10px] md:text-xs tracking-[0.65em] uppercase text-[#BE6E5B] font-extrabold mb-6">
              Where It Started
            </p>

            <p
              className={`${cormorant.className} italic text-xl md:text-2xl text-[#a07f61] max-w-3xl mx-auto mb-8 leading-relaxed font-medium`}
            >
              A Story Stitched with Tradition, Quality, and Trust.
            </p>
            <div
              className={`${cormorant.className} italic text-lg md:text-xl text-[#a07f61] max-w-4xl mx-auto mb-16 leading-relaxed font-medium space-y-6 text-center`}
            >
              <p>
                Sanganer has always known how to make cloth speak. Long before
                it had a name for itself, this pocket of Jaipur was where
                families spent lifetimes perfecting the block, the dye, and the
                stitch not as a trade taught in a classroom, but as something
                passed hand to hand, season after season.
              </p>
              <p>
                Sanwariyas grew out of that soil. It started in 2017, as a
                modest unit making cotton kurtis for local retailers who wanted
                something better than what the market usually offered. There was
                no plan to become anything in particular. There was only a habit
                - do the work properly, every single time and it turned out that
                habit was enough.
              </p>
              <p>
                What began in Sanganer is now a full-scale garment house in
                Jaipur - designing, cutting, stitching, and quality-checking
                every piece under one roof. Over a decade, that single workshop
                grew into an export house, then into a name wholesalers plan
                their season around.
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. MANUFACTURING ("The Craft Behind the Catalogue") ── */}
        <section
          aria-labelledby="manufacturing-heading"
          className="relative overflow-hidden bg-gradient-to-br from-[#FDF7F2] to-[#F2D9C3] py-24 md:py-28"
        >
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
          />
          <WeaveTexture opacity={0.045} size={40} />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="The Craft Behind the Catalogue"
              title="Wholesale Manufacturing Capability"
              subtitle="Designing, cutting, stitching, and quality-checking every piece under one roof."
            />

            <div
              className={`${cormorant.className} italic text-lg md:text-xl text-[#a07f61] max-w-3xl mx-auto leading-relaxed font-medium space-y-6 text-center mt-8`}
            >
              <p>
                Every SANWARIYAS garment - whether a Kurti, Suit, Anarkali,
                A-Line Suit, or Co-ord Set, passes through a meticulous
                four-step quality process before it leaves our factory. Every
                garment is individually inspected before dispatch, ensuring
                consistent quality across every order.
              </p>
              <p>
                With over 2500+ new designs introduced each season, we help
                boutiques, retailers, and distributors stay ahead. We provide
                collections that are fresh, relevant, and commercially strong,
                allowing our partners to lead the market.
              </p>
              <p>
                Today, our garments are trusted across more than 50 countries,
                yet the philosophy remains unchanged.{" "}
                <strong className="text-[#7A3D2A] font-bold block mt-3">
                  "Every piece is crafted with the same care, attention, and
                  commitment to quality that shaped our very first workshop."
                </strong>
              </p>
            </div>

            {/* Capacity strip — reworked as a single stitched ribbon rather
                than four identical bordered boxes: a continuous strip with
                dashed thread-dividers between each figure, so it reads as
                one measured statement instead of a generic stat-card grid. */}

            <div className="mt-16 relative rounded-2xl border border-[#BE6E5B]/20 bg-white/50 backdrop-blur-sm overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#BE6E5B] to-transparent opacity-60"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x-0 md:divide-x divide-dashed divide-[#BE6E5B]/25">
                {[
                  { v: "10,000+", l: "Pieces/month" },
                  { v: "4-Step", l: "Quality control" },
                  { v: "2500+", l: "Designs per season" },
                  { v: "15+", l: "Fabric categories" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="relative flex flex-col items-center py-8 px-4 text-center transition-colors duration-500 hover:bg-[#7A3D2A]/[0.04]"
                  >
                    <span
                      style={{ fontFamily: "Georgia, serif" }}
                      className="text-3xl md:text-4xl font-bold text-[#7A3D2A] mb-2"
                    >
                      {s.v}
                    </span>
                    <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#a07f61] font-bold">
                      {s.l}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3 & 4. LEADERSHIP + VALUES ("The Visionaries" / "How Trust Gets Built") ── */}
        <AboutInteractive />

        {/* ── 5. EDITORIAL TIMELINE ("Growing Without Losing the Thread") ── */}
        <section
          aria-labelledby="story-heading"
          className="relative overflow-hidden bg-[#FDF7F2] py-12 md:py-16"
        >
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Growing Without Losing the Thread"
              title="Our Journey"
              subtitle="As confidence grew, so did the work. What started as one product line slowly became something much bigger. Every milestone tells the story of growth, but our constant has always been the same - commitment to reliability, quality & trust."
            />

            <div className="relative max-w-5xl mx-auto">
              {/* Signature moment: the connecting line is rendered as an
                  actual hand-stitch — a dashed thread with small
                  perpendicular ticks — directly answering the section's
                  own eyebrow copy ("...Losing the Thread"), rather than a
                  plain gradient rule. */}
              <div
                aria-hidden="true"
                className="hidden md:block absolute left-[29px] top-2 bottom-2 w-[2px]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, #BE6E5B 0, #BE6E5B 8px, transparent 8px, transparent 14px)",
                  opacity: 0.55,
                }}
              />
              <div
                aria-hidden="true"
                className="hidden md:flex flex-col absolute left-[23px] top-2 bottom-2 w-[14px] items-center justify-between py-6"
              >
                {TIMELINE.slice(1).map((item) => (
                  <span
                    key={`tick-${item.year}`}
                    className="block w-[14px] h-[2px] bg-[#BE6E5B]/40 rotate-45"
                  />
                ))}
              </div>

              <div className="flex flex-col">
                {TIMELINE.map((item, i) => (
                  <div
                    key={item.year}
                    className={`relative flex flex-col md:flex-row gap-2 md:gap-6 group ${
                      i !== TIMELINE.length - 1 ? "mb-4 md:mb-3" : ""
                    }`}
                  >
                    {i !== TIMELINE.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="md:hidden absolute left-[29px] top-6 bottom-[-1rem] w-[2px]"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(to bottom, #BE6E5B 0, #BE6E5B 6px, transparent 6px, transparent 11px)",
                          opacity: 0.5,
                        }}
                      />
                    )}

                    <div className="flex items-start gap-6 md:w-1/4 shrink-0 z-10">
                      <div className="relative mt-2">
                        <div
                          aria-hidden="true"
                          className="absolute -inset-1.5 rounded-full bg-[#BE6E5B]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="relative w-[14px] h-[14px] rounded-full bg-[#BE6E5B] ring-4 ring-[#FDF7F2] shadow-[0_0_15px_rgba(190,110,91,0.6)] transition-transform duration-500 group-hover:scale-150" />
                      </div>
                      <div className="leading-none">
                        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold block mb-1">
                          Phase 0{i + 1}
                        </span>

                        <h3
                          className={`${cormorant.className} text-4xl md:text-5xl font-bold leading-none text-[#7A3D2A] transition-colors duration-500 group-hover:text-[#BE6E5B]`}
                        >
                          {item.year}
                        </h3>
                      </div>
                    </div>

                    <div className="md:w-3/4 ml-12 md:ml-0 bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-[#BE6E5B]/20 shadow-[0_8px_30px_rgba(122,61,42,0.06)] hover:shadow-[0_20px_50px_rgba(122,61,42,0.12)] transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                      <span
                        aria-hidden="true"
                        style={{ fontFamily: "Georgia, serif" }}
                        className="absolute -bottom-6 -right-4 text-[6rem] md:text-[7rem] font-bold text-[#7A3D2A]/[0.03] select-none pointer-events-none leading-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
                      >
                        {item.year}
                      </span>

                      <h3
                        className={`${cormorant.className} text-xl md:text-2xl font-bold text-[#7A3D2A] mb-1 relative z-10`}
                      >
                        {item.title}
                      </h3>
                      <div className="font-sans text-[13px] md:text-[14px] text-[#a07f61] leading-relaxed font-medium relative z-10">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. CTA ("More Than a Manufacturer" & "Built for Long-Term Partnerships") ── */}
        <section
          aria-label="Get in touch with SANWARIYAS Wholesale Manufacturer"
          className="relative overflow-hidden py-24 md:py-28 bg-gradient-to-br from-[#FDF7F2] via-[#F5E8D8] to-[#F2D9C3]"
        >
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
          />
          <WeaveTexture opacity={0.03} size={20} />
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(190,110,91,0.18) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-6">
              More Than a Manufacturer
            </p>

            <div
              className={`${cormorant.className} italic text-lg md:text-xl text-[#a07f61] leading-relaxed font-medium max-w-4xl mx-auto mb-12 space-y-6 text-center`}
            >
              <p>
                Over the years, SANWARIYAS has grown from a small workshop in
                Sanganer to a trusted manufacturing partner for retailers,
                wholesalers, and distributors across 50+ countries. Yet, what
                our partners value most isn't just the quality of our garments-
                it's the confidence that every order will arrive exactly as
                promised. From design consistency and transparent communication
                to dependable timelines, we've built our reputation on
                reliability as much as craftsmanship. Every repeat order is a
                reflection of the trust we've earned, one shipment at a time.
              </p>

              <h2
                className={`${cormorant.className} not-italic text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-8 leading-tight`}
              >
                Built for Long-Term{" "}
                <em className="italic text-[#BE6E5B]">Partnerships</em>
              </h2>

              <p>
                Fashion trends evolve, collections change, and businesses grow
                but trust remains timeless. At SANWARIYAS, every order is
                approached with the same care and accountability that shaped our
                earliest days. Our 2500+ fresh designs every season, meticulous
                4-step quality process, and commitment to delivering consistent
                quality are all guided by one simple belief: when our customers
                succeed, we succeed alongside them. That philosophy continues to
                shape every garment we create and every relationship we build-
                making SANWARIYAS not just a supplier, but a dependable partner
                in your journey of growth.
              </p>

              <p className="not-italic text-xl md:text-2xl font-bold text-[#7A3D2A] pt-4">
                Because when your business grows, so does ours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/contact"
                title="Send a Wholesale Inquiry to Ethnic Wear Manufacturer"
                aria-label="Send a wholesale inquiry to SANWARIYAS manufacturing support"
                className="inline-flex items-center gap-3 rounded-xl font-extrabold transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(122,61,42,0.18)] hover:shadow-[0_15px_40px_rgba(122,61,42,0.28)] bg-gradient-to-r from-[#BE6E5B] to-[#a07f61] text-[#FDF7F2] font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase py-4 px-8"
              >
                Send an Inquiry <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/lookbook"
                title="View Wholesale Ethnic Wear Lookbook"
                aria-label="View SANWARIYAS B2B wholesale lookbook"
                className="inline-flex items-center gap-3 rounded-xl font-extrabold transition-all duration-300 hover:bg-white/80 bg-white/50 backdrop-blur-sm text-[#7A3D2A] border-2 border-[#BE6E5B]/40 hover:border-[#BE6E5B]/80 font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase py-4 px-8"
              >
                View Lookbook <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
