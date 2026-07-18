// FILE: client/src/app/about/page.js
import { Cormorant_Garamond } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import AboutInteractive from "@/components/about/AboutInteractive";

//  SEO FIX: Expanded Keywords Array with all requested B2B/Manufacturer/Exporter combinations

//  SEO FIX: Expanded Keywords Array with all requested B2B/Manufacturer/Exporter combinations
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

const STATS = [
  { value: "2010", label: "Founded" },
  { value: "500+", label: "Designs per season" },
  { value: "15K+", label: "B2B Orders delivered" },
  { value: "50+", label: "Countries exported" },
];

// ✅ SEO FIX: Injected natural semantic keywords & contextual internal links seamlessly
const TIMELINE = [
  {
    year: "2010",
    title: "The Beginning",
    desc: (
      <>
        SANWARIYAS was founded in a small workshop in Sanganer, Jaipur — the
        heart of India's textile belt. We started our journey as a dedicated{" "}
        <strong>Jaipur Kurti Manufacturer</strong>, offering a single product
        line of hand-block printed Cotton Kurtis, sold locally to boutiques
        across Rajasthan.
      </>
    ),
  },
  {
    year: "2014",
    title: "Scaling Production",
    desc: (
      <>
        Demand grew rapidly. We expanded our workshop into a fully equipped{" "}
        <strong>Indian Ethnic Wear Manufacturer</strong> unit, added a dedicated
        stitching floor, and launched our first catalogue of wholesale Anarkalis
        and straight-cut suits.
      </>
    ),
  },
  {
    year: "2017",
    title: "Export House Status",
    desc: (
      <>
        SANWARIYAS received its export house certification and began operating
        as a premier <strong>Cotton Clothing Exporter India</strong>. Our
        quality-first approach earned repeat wholesale orders from global
        boutiques and distributors.
      </>
    ),
  },
  {
    year: "2020",
    title: "Digital Expansion",
    desc: (
      <>
        We launched our online B2B platform, cementing our position as a leading{" "}
        <strong>Wholesale Ethnic Wear Supplier India</strong>. This enabled
        global retailers to browse collections, review our{" "}
        <Link
          href="/faq"
          className="underline hover:text-[#7A3D2A] transition-colors"
        >
          B2B guidelines
        </Link>
        , and track manufacturing orders seamlessly as their trusted{" "}
        <strong>B2B Ethnic Wear Supplier</strong>.
      </>
    ),
  },
  {
    year: "2024",
    title: "Today & Beyond",
    desc: (
      <>
        With 500+ fresh designs every season and a robust 4-step quality control
        process, our <strong>Jaipur Garment Factory</strong> operates at peak
        capacity. As a top <strong>Ladies Cotton Suit Manufacturer</strong>,
        SANWARIYAS continues to set the standard for wholesale ethnic wear
        suppliers globally.
      </>
    ),
  },
];

const MANUFACTURING = [
  {
    step: "01",
    title: "Fabric Sourcing",
    desc: (
      <>
        As a leading <strong>Jaipur Clothing Manufacturer</strong>, we source
        directly from certified mills in Surat, Varanasi, and Jaipur. Every
        fabric batch is tested for GSM, color-fastness, shrinkage, and tensile
        strength before entering production.
      </>
    ),
  },
  {
    step: "02",
    title: "Design & Pattern Making",
    desc: "Our in-house design team creates seasonal catalogues with 500+ original styles. Each design goes through a meticulous pattern-making process with precise size grading across XS–3XL.",
  },
  {
    step: "03",
    title: "Cutting & Stitching",
    desc: (
      <>
        Precision cutting is done using CAD-guided machines. Stitching is
        carried out by skilled artisans on our production floor, showcasing why
        we are a trusted <strong>Ethnic Wear Manufacturer India</strong>,
        ensuring consistent quality across every piece in the lot.
      </>
    ),
  },
  {
    step: "04",
    title: "Embroidery & Embellishment",
    desc: "For embroidered pieces, we use a mix of hand-embroidery artisans and computerized embroidery machines — ensuring intricate detailing without compromising on speed or consistency.",
  },
  {
    step: "05",
    title: "4-Step Quality Control",
    desc: "Every garment passes through four QC checkpoints: fabric inspection, mid-production stitch check, finishing review, and a final packing audit — before it ever leaves our facility.",
  },
  {
    step: "06",
    title: "Packing & Dispatch",
    desc: (
      <>
        Orders are individually folded, tagged, and packed as per buyer
        specifications. Export orders are packed with customs documentation,
        barcode tagging, and full insurance coverage. Ready to order?{" "}
        <Link
          href="/contact"
          className="underline hover:text-[#7A3D2A] transition-colors"
        >
          Contact our wholesale team
        </Link>
        .
      </>
    ),
  },
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
    desc: "We work with master weavers and skilled artisans from Rajasthan, preserving centuries-old craft traditions in every cotton suit collection.",
  },
  {
    title: "Transparent Pricing",
    icon: "◎",
    desc: (
      <>
        Factory-direct means no middlemen. Whether you need a{" "}
        <strong>Wholesale Cotton Kurti Supplier</strong> or a{" "}
        <strong>Jaipur Suit Manufacturer</strong>, you get exact B2B wholesale
        pricing directly from us.
      </>
    ),
  },
  {
    title: "Custom Production",
    icon: "⬡",
    desc: "From private labels to custom embroidery and size grading, we tailor every wholesale order to your exact retail specifications.",
  },
];

// ── Shared styles ─────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-16 md:mb-20">
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
      {/* ✅ SEO FIX: Injected Comprehensive Schema Array (AboutPage, LocalBusiness, BreadcrumbList, FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              mainEntity: {
                "@type": "Organization",
                name: "SANWARIYAS",
                alternateName: "SANWARIYAS Ethnic Wear Manufacturer",
                description:
                  "B2B Wholesale, Custom Manufacturing, and Global Export of Premium Ethnic Wear including Cotton Suits, Kurtis, and Co-ord Sets.",
                foundingDate: "2010",
                founder: { "@type": "Person", name: "Sonali Kanther" },
                url: "https://sanwariyas.com",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "SANWARIYAS",
              image: "https://sanwariyas.com/images/og-about.png",
              "@id": "https://sanwariyas.com",
              url: "https://sanwariyas.com",
              telephone: "+91-9680812813",
              priceRange: "$$",
              description:
                "Jaipur Ethnic Wear Manufacturer, Jaipur Kurti Manufacturer, Jaipur Clothing Manufacturer, and Jaipur Garment Factory.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jaipur",
                addressRegion: "Rajasthan",
                addressCountry: "IN",
              },
              areaServed: {
                "@type": "Country",
                name: "Global",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://sanwariyas.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "About",
                  item: "https://sanwariyas.com/about",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Who is SANWARIYAS?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SANWARIYAS is a Jaipur-based ethnic wear manufacturer specializing in wholesale kurtis, cotton suits, co-ord sets, and export-quality ethnic wear for boutiques and retailers worldwide.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does SANWARIYAS offer wholesale ethnic wear?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. SANWARIYAS supplies wholesale ethnic wear to retailers, boutiques, distributors, and fashion businesses across India and international markets.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does SANWARIYAS provide private label manufacturing?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. SANWARIYAS offers private label manufacturing, custom branding, custom sizing, and bulk production services.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does SANWARIYAS export internationally?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. SANWARIYAS exports premium ethnic wear to multiple countries and supports international wholesale orders.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What products does SANWARIYAS manufacture?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SANWARIYAS manufactures Cotton Kurtis, Cotton Suits, Muslin Suits, Mulmul Cotton Suits, Co-Ord Sets, Anarkali Suits, Chikankari Suits, and Designer Ethnic Wear.",
                  },
                },
              ],
            },
          ]),
        }}
      />

      <Navbar />

      <main id="main-content" className="bg-[#FDF7F2]">
        {/* ── 1. HERO ── */}
        <section
          aria-label="About SANWARIYAS"
          className="relative overflow-hidden pt-40 pb-32 bg-gradient-to-br from-[#FDF7F2] via-[#F5E8D8] to-[#F2D9C3]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
          />

          {/* Large Watermark 'S' */}
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
            <p className="font-sans text-[10px] md:text-xs tracking-[0.65em] uppercase text-[#BE6E5B] font-extrabold mb-6">
              Our Story
            </p>
            {/* ✅ SEO FIX: Visually hidden text in H1 to strictly match target keywords while keeping UI identical */}
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
            <p
              className={`${cormorant.className} italic text-xl md:text-2xl text-[#a07f61] max-w-3xl mx-auto mb-6 leading-relaxed font-medium`}
            >
              From a single workshop in Sanganer, Jaipur — to an ethnic wear
              export house trusted by retailers across 50+ countries. SANWARIYAS
              is where Indian craftsmanship meets global wholesale.
            </p>
            <p className="font-sans text-base md:text-lg text-[#a07f61] max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
              We manufacture premium ethnic wear — Kurtis, Anarkalis, Suits,
              A-Line Suits, and Co-ord Sets — directly in our Jaipur facility,
              and deliver to boutiques, retailers, and wholesalers worldwide.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center py-8 px-4 rounded-2xl bg-white/50 backdrop-blur-md border border-[#BE6E5B]/30 shadow-[0_8px_30px_rgb(122,61,42,0.08)] transition-transform hover:-translate-y-1"
                >
                  <span
                    style={{ fontFamily: "Georgia, serif" }}
                    className="text-3xl md:text-4xl font-bold text-[#7A3D2A] mb-2"
                  >
                    {s.value}
                  </span>
                  <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#a07f61] font-bold">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. EDITORIAL TIMELINE ── */}
        <section
          aria-labelledby="story-heading"
          className="relative overflow-hidden bg-[#FDF7F2] py-32"
        >
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Our Journey"
              title="How We Got Here"
              subtitle="A 14-year story of craft, growth, and an unwavering commitment to manufacturing quality."
            />

            <div className="relative mt-20 max-w-5xl mx-auto">
              {/* Desktop continuous vertical line */}
              <div
                aria-hidden="true"
                className="hidden md:block absolute left-[29px] top-6 bottom-12 w-[2px] bg-gradient-to-b from-[#BE6E5B]/50 via-[#BE6E5B]/20 to-transparent"
              />

              <div className="flex flex-col gap-12 md:gap-24">
                {TIMELINE.map((item, i) => (
                  <div
                    key={item.year}
                    className="relative flex flex-col md:flex-row gap-6 md:gap-16 group"
                  >
                    {/* Mobile-only vertical line */}
                    <div
                      aria-hidden="true"
                      className="md:hidden absolute left-[29px] top-6 bottom-[-3rem] w-[2px] bg-gradient-to-b from-[#BE6E5B]/40 to-transparent"
                    />

                    {/* Left Side: Glowing Dot + Year */}
                    <div className="flex items-start gap-8 md:w-1/3 shrink-0 z-10">
                      <div className="relative mt-[14px]">
                        <div className="w-[14px] h-[14px] rounded-full bg-[#BE6E5B] ring-4 ring-[#FDF7F2] shadow-[0_0_15px_rgba(190,110,91,0.6)] transition-transform duration-500 group-hover:scale-150" />
                      </div>
                      <div>
                        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold block mb-2">
                          Phase 0{i + 1}
                        </span>

                        <h3
                          className={`${cormorant.className} text-5xl md:text-6xl font-bold text-[#7A3D2A] transition-colors duration-500 group-hover:text-[#BE6E5B]`}
                        >
                          {item.year}
                        </h3>
                      </div>
                    </div>

                    {/* Right Side: Editorial Content Card */}
                    <div className="md:w-2/3 ml-14 md:ml-0 bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-[#BE6E5B]/20 shadow-[0_8px_30px_rgba(122,61,42,0.06)] hover:shadow-[0_20px_50px_rgba(122,61,42,0.12)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                      {/* Massive Watermark Year */}
                      <span
                        aria-hidden="true"
                        style={{ fontFamily: "Georgia, serif" }}
                        className="absolute -bottom-8 -right-4 text-[8rem] md:text-[10rem] font-bold text-[#7A3D2A]/[0.03] select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
                      >
                        {item.year}
                      </span>

                      <h3
                        className={`${cormorant.className} text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-4 relative z-10`}
                      >
                        {item.title}
                      </h3>
                      <div className="font-sans text-[15px] text-[#a07f61] leading-relaxed font-medium relative z-10">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. MANUFACTURING ── */}
        <section
          aria-labelledby="manufacturing-heading"
          className="relative overflow-hidden bg-gradient-to-br from-[#FDF7F2] to-[#F2D9C3] py-32"
        >
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #BE6E5B 0, #BE6E5B 1px, transparent 0, transparent 40px)",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="How We Make It"
              title="Wholesale Manufacturing Capability"
              subtitle="A 6-step factory production process built for consistency, export quality, and scale."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {MANUFACTURING.map((step) => (
                <article
                  key={step.step}
                  className="group relative rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl bg-white/60 backdrop-blur-xl border border-[#BE6E5B]/20"
                >
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "Georgia, serif" }}
                    className="absolute top-6 right-6 text-7xl font-bold text-[#7A3D2A]/[0.04] leading-none select-none transition-transform duration-500 group-hover:scale-110"
                  >
                    {step.step}
                  </span>
                  <div className="mb-6 w-16 h-16 rounded-2xl bg-[#BE6E5B]/10 border border-[#BE6E5B]/30 flex items-center justify-center">
                    <span
                      style={{ fontFamily: "Georgia, serif" }}
                      className="text-2xl font-bold text-[#BE6E5B]"
                    >
                      {step.step}
                    </span>
                  </div>
                  <div className="h-[2px] w-12 bg-[#BE6E5B]/40 rounded-full mb-6" />
                  <h3
                    className={`${cormorant.className} text-2xl font-bold text-[#7A3D2A] mb-4`}
                  >
                    {step.title}
                  </h3>
                  <div className="font-sans text-sm text-[#a07f61] leading-relaxed font-medium">
                    {step.desc}
                  </div>
                </article>
              ))}
            </div>

            {/* Capacity strip */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { v: "10,000+", l: "Pieces/month" },
                { v: "4-Step", l: "Quality control" },
                { v: "500+", l: "Designs per season" },
                { v: "15+", l: "Fabric categories" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="flex flex-col items-center py-8 px-4 rounded-2xl text-center bg-[#7A3D2A]/[0.04] border border-[#BE6E5B]/20 backdrop-blur-sm"
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
        </section>

        {/* ── 4. TEAM (Interactive - Client Component) ── */}
        <AboutInteractive values={VALUES} />

        {/* ── 5. CTA ── */}
        <section
          aria-label="Get in touch with SANWARIYAS Wholesale Manufacturer"
          className="relative overflow-hidden py-32 bg-gradient-to-br from-[#5C3120] via-[#7A3D2A] to-[#8B4A34]"
        >
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F2D9C3]/40 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(rgba(242,217,195,0.8) 1.5px, transparent 1.5px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#F2D9C3] font-bold opacity-80 mb-6">
              Partner With Us
            </p>
            <h2
              className={`${cormorant.className} text-4xl md:text-5xl lg:text-6xl font-bold text-[#FDF7F2] mb-8 leading-tight`}
            >
              Ready to source premium{" "}
              <em className="italic text-[#F2D9C3]">ethnic wear?</em>
            </h2>
            <p className="font-sans text-base md:text-lg text-[#F2D9C3]/90 leading-relaxed max-w-2xl mx-auto mb-12">
              Send us a B2B inquiry and our export team will respond within 24
              hours with pricing, availability, and a curated catalog tailored
              to your retail boutique.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/contact"
                title="Send a Wholesale Inquiry to Ethnic Wear Manufacturer"
                aria-label="Send a wholesale inquiry to SANWARIYAS manufacturing support"
                className="inline-flex items-center gap-3 rounded-xl font-extrabold transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] bg-gradient-to-r from-[#BE6E5B] to-[#a07f61] text-[#FDF7F2] font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase py-4 px-8"
              >
                Send an Inquiry <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/lookbook"
                title="View Wholesale Ethnic Wear Lookbook"
                aria-label="View SANWARIYAS B2B wholesale lookbook"
                className="inline-flex items-center gap-3 rounded-xl font-extrabold transition-all duration-300 hover:bg-white/10 bg-transparent text-[#F2D9C3] border-2 border-[#F2D9C3]/40 hover:border-[#F2D9C3]/80 font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase py-4 px-8"
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
