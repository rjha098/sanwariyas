// // FILE: client/src/app/about/page.js
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import Link from "next/link";
// import AboutInteractive from "@/components/about/AboutInteractive";

// export const metadata = {
//   title: "About Us | SANWARIYAS — Premium Wholesale Ethnic Wear, Jaipur",
//   description:
//     "Learn the story of SANWARIYAS — Jaipur's trusted wholesale ethnic wear manufacturer. Discover our manufacturing capability, quality process, and the team behind every piece.",
//   keywords:
//     "SANWARIYAS about, ethnic wear manufacturer Jaipur, wholesale kurti manufacturer, Indian ethnic fashion brand story, Rajasthan ethnic wear factory",
//   alternates: { canonical: "/about" },
// };

// const STATS = [
//   { value: "2010", label: "Founded" },
//   { value: "500+", label: "Designs per season" },
//   { value: "15K+", label: "Orders delivered" },
//   { value: "50+", label: "Countries exported" },
// ];

// const TIMELINE = [
//   {
//     year: "2010",
//     title: "The Beginning",
//     desc: "SANWARIYAS was founded in a small workshop in Sanganer, Jaipur — the heart of India's textile belt. We started with a single product line of hand-block printed Kurtis, sold locally to boutiques across Rajasthan.",
//   },
//   {
//     year: "2014",
//     title: "Scaling Production",
//     desc: "Demand grew rapidly. We expanded our workshop into a full manufacturing unit, added a dedicated stitching floor, and launched our first catalogue of wholesale Anarkalis and straight-cut suits for pan-India distribution.",
//   },
//   {
//     year: "2017",
//     title: "Export House Status",
//     desc: "SANWARIYAS received its export house certification and began shipping to the UAE, UK, USA, and Southeast Asia. Our quality-first approach earned repeat orders from global boutiques and ethnic wear retailers.",
//   },
//   {
//     year: "2020",
//     title: "Digital Expansion",
//     desc: "We launched our online wholesale platform, enabling retailers worldwide to browse collections, send bulk inquiries, and track orders seamlessly — bringing factory-direct access to every corner of the globe.",
//   },
//   {
//     year: "2024",
//     title: "Today & Beyond",
//     desc: "With 500+ fresh designs every season, a 4-step quality control process, and partnerships with certified fabric mills, SANWARIYAS continues to set the standard for wholesale ethnic wear — from Jaipur to the world.",
//   },
// ];

// const MANUFACTURING = [
//   {
//     step: "01",
//     title: "Fabric Sourcing",
//     desc: "We source directly from certified mills in Surat, Varanasi, and Jaipur. Every fabric batch is tested for GSM, colour-fastness, shrinkage, and tensile strength before entering production.",
//   },
//   {
//     step: "02",
//     title: "Design & Pattern Making",
//     desc: "Our in-house design team creates seasonal catalogues with 500+ original styles. Each design goes through a pattern-making process with precise size grading across XS–3XL.",
//   },
//   {
//     step: "03",
//     title: "Cutting & Stitching",
//     desc: "Precision cutting is done using CAD-guided machines. Stitching is carried out by skilled artisans on our production floor, ensuring consistent quality across every piece in the lot.",
//   },
//   {
//     step: "04",
//     title: "Embroidery & Embellishment",
//     desc: "For embroidered pieces, we use a mix of hand-embroidery artisans and computerised embroidery machines — ensuring intricate detailing without compromising on speed or consistency.",
//   },
//   {
//     step: "05",
//     title: "4-Step Quality Control",
//     desc: "Every garment passes through four QC checkpoints: fabric inspection, mid-production stitch check, finishing review, and a final packing audit — before it ever leaves our facility.",
//   },
//   {
//     step: "06",
//     title: "Packing & Dispatch",
//     desc: "Orders are individually folded, tagged, and packed as per buyer specifications. Export orders are packed with customs documentation, barcode tagging, and full insurance coverage.",
//   },
// ];

// const VALUES = [
//   {
//     title: "Premium Quality",
//     icon: "✦",
//     desc: "Every garment is stitched to meet export standards. No shortcuts, no compromise — only pieces we are proud to put our name on.",
//   },
//   {
//     title: "Artisan Heritage",
//     icon: "◈",
//     desc: "We work with master weavers and skilled artisans from Rajasthan, preserving centuries-old craft traditions in every collection.",
//   },
//   {
//     title: "Transparent Pricing",
//     icon: "◎",
//     desc: "Factory-direct means no middlemen. You get wholesale pricing straight from the source, with full invoice transparency on every order.",
//   },
//   {
//     title: "Custom Production",
//     icon: "⬡",
//     desc: "From private labels to custom embroidery and size grading, we tailor every order to your exact specifications.",
//   },
// ];

// // ── Shared styles ─────────────────────────────
// const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Nunito+Sans:wght@400;500;600;700&display=swap');
// .s-rule { height: 1px; background: linear-gradient(to right, transparent, rgba(190,110,91,0.35), transparent); }`;

// function SectionHeader({ eyebrow, title, subtitle }) {
//   return (
//     <div className="text-center mb-16 md:mb-20">
//       <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
//         {eyebrow}
//       </p>
//       <h2
//         style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//         className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6 leading-tight"
//       >
//         {title}
//       </h2>
//       <div aria-hidden="true" className="flex items-center justify-center gap-4 mb-8">
//         <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//         <span className="text-[#BE6E5B] text-xl">✦</span>
//         <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//       </div>
//       {subtitle && (
//         <p
//           style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//           className="italic text-lg md:text-xl text-[#a07f61] max-w-2xl mx-auto leading-relaxed font-medium"
//         >
//           {subtitle}
//         </p>
//       )}
//     </div>
//   );
// }

// export default function AboutPage() {
//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />
//       <Navbar />

//       <main id="main-content" className="bg-[#FDF7F2]">
//         {/* ── 1. HERO ── */}
//         <section
//           aria-label="About SANWARIYAS"
//           className="relative overflow-hidden pt-40 pb-32 bg-gradient-to-br from-[#FDF7F2] via-[#F5E8D8] to-[#F2D9C3]"
//         >
//           <div
//             aria-hidden="true"
//             className="absolute inset-0 pointer-events-none opacity-[0.03]"
//             style={{
//               backgroundImage: "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)",
//               backgroundSize: "32px 32px",
//             }}
//           />
//           <div aria-hidden="true" className="absolute bottom-0 inset-x-0 s-rule" />

//           {/* Large Watermark 'S' */}
//           <div
//             aria-hidden="true"
//             className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
//           >
//             <span
//               style={{ fontFamily: "Georgia, serif" }}
//               className="text-[12rem] md:text-[25rem] font-bold text-[#7A3D2A]/[0.03] tracking-tighter leading-none"
//             >
//               S
//             </span>
//           </div>

//           <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.65em] uppercase text-[#BE6E5B] font-extrabold mb-6">
//               Our Story
//             </p>
//             <h1
//               style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//               className="text-5xl md:text-7xl font-bold text-[#7A3D2A] leading-tight mb-8"
//             >
//               About <em className="italic text-[#BE6E5B]">SANWARIYAS</em>
//             </h1>
//             <div aria-hidden="true" className="flex items-center justify-center gap-6 mb-12">
//               <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//               <span className="text-[#BE6E5B] text-2xl">✦</span>
//               <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//             </div>
//             <p
//               style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//               className="italic text-xl md:text-2xl text-[#a07f61] max-w-3xl mx-auto mb-6 leading-relaxed font-medium"
//             >
//               From a single workshop in Sanganer, Jaipur — to an export house trusted by
//               retailers across 50+ countries. SANWARIYAS is where Indian craftsmanship meets global wholesale.
//             </p>
//             <p className="font-sans text-base md:text-lg text-[#a07f61] max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
//               We manufacture premium ethnic wear — Kurtis, Anarkalis, Suits, Lehengas, and
//               Co-ord Sets — directly in our Jaipur facility, and deliver to boutiques,
//               retailers, and wholesalers worldwide.
//             </p>

//             {/* Stats */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
//               {STATS.map((s) => (
//                 <div
//                   key={s.label}
//                   className="flex flex-col items-center py-8 px-4 rounded-2xl bg-white/50 backdrop-blur-md border border-[#BE6E5B]/30 shadow-[0_8px_30px_rgb(122,61,42,0.08)] transition-transform hover:-translate-y-1"
//                 >
//                   <span
//                     style={{ fontFamily: "Georgia, serif" }}
//                     className="text-3xl md:text-4xl font-bold text-[#7A3D2A] mb-2"
//                   >
//                     {s.value}
//                   </span>
//                   <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#a07f61] font-bold">
//                     {s.label}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── 2. NEW EDITORIAL TIMELINE ── */}
//         <section
//           aria-labelledby="story-heading"
//           className="relative overflow-hidden bg-[#FDF7F2] py-32"
//         >
//           <div aria-hidden="true" className="absolute bottom-0 inset-x-0 s-rule" />

//           <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//             <SectionHeader
//               eyebrow="Our Journey"
//               title="How We Got Here"
//               subtitle="A 14-year story of craft, growth, and an unwavering commitment to quality."
//             />

//             <div className="relative mt-20 max-w-5xl mx-auto">
//               {/* Desktop continuous vertical line */}
//               <div
//                 aria-hidden="true"
//                 className="hidden md:block absolute left-[29px] top-6 bottom-12 w-[2px] bg-gradient-to-b from-[#BE6E5B]/50 via-[#BE6E5B]/20 to-transparent"
//               />

//               <div className="flex flex-col gap-12 md:gap-24">
//                 {TIMELINE.map((item, i) => (
//                   <div key={item.year} className="relative flex flex-col md:flex-row gap-6 md:gap-16 group">
                    
//                     {/* Mobile-only vertical line */}
//                     <div 
//                       aria-hidden="true" 
//                       className="md:hidden absolute left-[29px] top-6 bottom-[-3rem] w-[2px] bg-gradient-to-b from-[#BE6E5B]/40 to-transparent" 
//                     />

//                     {/* Left Side: Glowing Dot + Year */}
//                     <div className="flex items-start gap-8 md:w-1/3 shrink-0 z-10">
//                       <div className="relative mt-[14px]">
//                         <div className="w-[14px] h-[14px] rounded-full bg-[#BE6E5B] ring-4 ring-[#FDF7F2] shadow-[0_0_15px_rgba(190,110,91,0.6)] transition-transform duration-500 group-hover:scale-150" />
//                       </div>
//                       <div>
//                         <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold block mb-2">
//                           Phase 0{i + 1}
//                         </span>
//                         <h3 
//                           style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }} 
//                           className="text-5xl md:text-6xl font-bold text-[#7A3D2A] transition-colors duration-500 group-hover:text-[#BE6E5B]"
//                         >
//                           {item.year}
//                         </h3>
//                       </div>
//                     </div>

//                     {/* Right Side: Editorial Content Card */}
//                     <div className="md:w-2/3 ml-14 md:ml-0 bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-[#BE6E5B]/20 shadow-[0_8px_30px_rgba(122,61,42,0.06)] hover:shadow-[0_20px_50px_rgba(122,61,42,0.12)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
//                       {/* Massive Watermark Year */}
//                       <span 
//                         aria-hidden="true" 
//                         style={{ fontFamily: "Georgia, serif" }} 
//                         className="absolute -bottom-8 -right-4 text-[8rem] md:text-[10rem] font-bold text-[#7A3D2A]/[0.03] select-none pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
//                       >
//                         {item.year}
//                       </span>
                      
//                       <h4 
//                         style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }} 
//                         className="text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-4 relative z-10"
//                       >
//                         {item.title}
//                       </h4>
//                       <p className="font-sans text-[15px] text-[#a07f61] leading-relaxed font-medium relative z-10">
//                         {item.desc}
//                       </p>
//                     </div>

//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ── 3. MANUFACTURING ── */}
//         <section
//           aria-labelledby="manufacturing-heading"
//           className="relative overflow-hidden bg-gradient-to-br from-[#FDF7F2] to-[#F2D9C3] py-32"
//         >
//           <div aria-hidden="true" className="absolute top-0 inset-x-0 s-rule" />
//           <div aria-hidden="true" className="absolute bottom-0 inset-x-0 s-rule" />
//           <div
//             aria-hidden="true"
//             className="absolute inset-0 opacity-[0.03] pointer-events-none"
//             style={{
//               backgroundImage:
//                 "repeating-linear-gradient(45deg, #BE6E5B 0, #BE6E5B 1px, transparent 0, transparent 40px)",
//             }}
//           />

//           <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <SectionHeader
//               eyebrow="How We Make It"
//               title="Manufacturing Capability"
//               subtitle="A 6-step production process built for consistency, quality, and scale."
//             />

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
//               {MANUFACTURING.map((step) => (
//                 <article
//                   key={step.step}
//                   className="group relative rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl bg-white/60 backdrop-blur-xl border border-[#BE6E5B]/20"
//                 >
//                   <span
//                     aria-hidden="true"
//                     style={{ fontFamily: "Georgia, serif" }}
//                     className="absolute top-6 right-6 text-7xl font-bold text-[#7A3D2A]/[0.04] leading-none select-none transition-transform duration-500 group-hover:scale-110"
//                   >
//                     {step.step}
//                   </span>
//                   <div className="mb-6 w-16 h-16 rounded-2xl bg-[#BE6E5B]/10 border border-[#BE6E5B]/30 flex items-center justify-center">
//                     <span
//                       style={{ fontFamily: "Georgia, serif" }}
//                       className="text-2xl font-bold text-[#BE6E5B]"
//                     >
//                       {step.step}
//                     </span>
//                   </div>
//                   <div className="h-[2px] w-12 bg-[#BE6E5B]/40 rounded-full mb-6" />
//                   <h3
//                     style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//                     className="text-2xl font-bold text-[#7A3D2A] mb-4"
//                   >
//                     {step.title}
//                   </h3>
//                   <p className="font-sans text-sm text-[#a07f61] leading-relaxed font-medium">
//                     {step.desc}
//                   </p>
//                 </article>
//               ))}
//             </div>

//             {/* Capacity strip */}
//             <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
//               {[
//                 { v: "10,000+", l: "Pieces/month" },
//                 { v: "4-Step", l: "Quality control" },
//                 { v: "500+", l: "Designs per season" },
//                 { v: "15+", l: "Fabric categories" },
//               ].map((s) => (
//                 <div
//                   key={s.l}
//                   className="flex flex-col items-center py-8 px-4 rounded-2xl text-center bg-[#7A3D2A]/[0.04] border border-[#BE6E5B]/20 backdrop-blur-sm"
//                 >
//                   <span
//                     style={{ fontFamily: "Georgia, serif" }}
//                     className="text-3xl md:text-4xl font-bold text-[#7A3D2A] mb-2"
//                   >
//                     {s.v}
//                   </span>
//                   <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#a07f61] font-bold">
//                     {s.l}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── 4. TEAM (Interactive - Client Component) ── */}
//         <AboutInteractive values={VALUES} />

//         {/* ── 5. CTA ── */}
//         <section
//           aria-label="Get in touch with SANWARIYAS"
//           className="relative overflow-hidden py-32 bg-gradient-to-br from-[#5C3120] via-[#7A3D2A] to-[#8B4A34]"
//         >
//           <div
//             aria-hidden="true"
//             className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F2D9C3]/40 to-transparent"
//           />
//           <div
//             aria-hidden="true"
//             className="absolute inset-0 pointer-events-none opacity-10"
//             style={{
//               backgroundImage:
//                 "radial-gradient(rgba(242,217,195,0.8) 1.5px, transparent 1.5px)",
//               backgroundSize: "32px 32px",
//             }}
//           />

//           <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#F2D9C3] font-bold opacity-80 mb-6">
//               Partner With Us
//             </p>
//             <h2
//               style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
//               className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FDF7F2] mb-8 leading-tight"
//             >
//               Ready to source premium <em className="italic text-[#F2D9C3]">ethnic wear?</em>
//             </h2>
//             <p className="font-sans text-base md:text-lg text-[#F2D9C3]/90 leading-relaxed max-w-2xl mx-auto mb-12">
//               Send us an inquiry and our team will respond within 24 hours with pricing,
//               availability, and a curated selection tailored to your store.
//             </p>
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
//               <Link
//                 href="/contact"
//                 className="inline-flex items-center gap-3 rounded-xl font-extrabold transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] bg-gradient-to-r from-[#BE6E5B] to-[#a07f61] text-[#FDF7F2] font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase py-4 px-8"
//               >
//                 Send an Inquiry <span aria-hidden="true">→</span>
//               </Link>
//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-3 rounded-xl font-extrabold transition-all duration-300 hover:bg-white/10 bg-transparent text-[#F2D9C3] border-2 border-[#F2D9C3]/40 hover:border-[#F2D9C3]/80 font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase py-4 px-8"
//               >
//                 View Collections <span aria-hidden="true">↗</span>
//               </Link>
//             </div>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </>
//   );
// }





// FILE: client/src/app/about/page.js
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import AboutInteractive from "@/components/about/AboutInteractive";

// ✅ SEO FIX: Added absolute Canonical URL, OpenGraph, Twitter Cards, and explicit Robots indexing.
export const metadata = {
  title: "About Us | SANWARIYAS — Premium Wholesale Ethnic Wear, Jaipur",
  description:
    "Learn the story of SANWARIYAS — Jaipur's trusted wholesale ethnic wear manufacturer. Discover our manufacturing capability, quality process, and the team behind every piece.",
  keywords:
    "SANWARIYAS about, ethnic wear manufacturer Jaipur, wholesale kurti manufacturer, Indian ethnic fashion brand story, Rajasthan ethnic wear factory",
  alternates: { canonical: "https://www.yourdomain.com/about" }, // Replace with your actual live domain
  openGraph: {
    title: "About SANWARIYAS | Premium Wholesale Ethnic Wear",
    description: "Learn the story of SANWARIYAS — Jaipur's trusted wholesale ethnic wear manufacturer.",
    url: "https://www.yourdomain.com/about",
    siteName: "SANWARIYAS",
    images: [
      {
        url: "/images/og-about.jpg", // Add an actual image path here if you have one for link sharing
        width: 1200,
        height: 630,
        alt: "SANWARIYAS Wholesale Ethnic Wear Manufacturing",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About SANWARIYAS | Premium Wholesale Ethnic Wear",
    description: "Jaipur's trusted wholesale ethnic wear manufacturer.",
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
  { value: "15K+", label: "Orders delivered" },
  { value: "50+", label: "Countries exported" },
];

const TIMELINE = [
  {
    year: "2010",
    title: "The Beginning",
    desc: "SANWARIYAS was founded in a small workshop in Sanganer, Jaipur — the heart of India's textile belt. We started with a single product line of hand-block printed Kurtis, sold locally to boutiques across Rajasthan.",
  },
  {
    year: "2014",
    title: "Scaling Production",
    desc: "Demand grew rapidly. We expanded our workshop into a full manufacturing unit, added a dedicated stitching floor, and launched our first catalogue of wholesale Anarkalis and straight-cut suits for pan-India distribution.",
  },
  {
    year: "2017",
    title: "Export House Status",
    desc: "SANWARIYAS received its export house certification and began shipping to the UAE, UK, USA, and Southeast Asia. Our quality-first approach earned repeat orders from global boutiques and ethnic wear retailers.",
  },
  {
    year: "2020",
    title: "Digital Expansion",
    desc: "We launched our online wholesale platform, enabling retailers worldwide to browse collections, send bulk inquiries, and track orders seamlessly — bringing factory-direct access to every corner of the globe.",
  },
  {
    year: "2024",
    title: "Today & Beyond",
    desc: "With 500+ fresh designs every season, a 4-step quality control process, and partnerships with certified fabric mills, SANWARIYAS continues to set the standard for wholesale ethnic wear — from Jaipur to the world.",
  },
];

const MANUFACTURING = [
  {
    step: "01",
    title: "Fabric Sourcing",
    desc: "We source directly from certified mills in Surat, Varanasi, and Jaipur. Every fabric batch is tested for GSM, colour-fastness, shrinkage, and tensile strength before entering production.",
  },
  {
    step: "02",
    title: "Design & Pattern Making",
    desc: "Our in-house design team creates seasonal catalogues with 500+ original styles. Each design goes through a pattern-making process with precise size grading across XS–3XL.",
  },
  {
    step: "03",
    title: "Cutting & Stitching",
    desc: "Precision cutting is done using CAD-guided machines. Stitching is carried out by skilled artisans on our production floor, ensuring consistent quality across every piece in the lot.",
  },
  {
    step: "04",
    title: "Embroidery & Embellishment",
    desc: "For embroidered pieces, we use a mix of hand-embroidery artisans and computerised embroidery machines — ensuring intricate detailing without compromising on speed or consistency.",
  },
  {
    step: "05",
    title: "4-Step Quality Control",
    desc: "Every garment passes through four QC checkpoints: fabric inspection, mid-production stitch check, finishing review, and a final packing audit — before it ever leaves our facility.",
  },
  {
    step: "06",
    title: "Packing & Dispatch",
    desc: "Orders are individually folded, tagged, and packed as per buyer specifications. Export orders are packed with customs documentation, barcode tagging, and full insurance coverage.",
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

// ── Shared styles ─────────────────────────────
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Nunito+Sans:wght@400;500;600;700&display=swap');
.s-rule { height: 1px; background: linear-gradient(to right, transparent, rgba(190,110,91,0.35), transparent); }`;

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-16 md:mb-20">
      <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
        {eyebrow}
      </p>
      {/* Outputs as an H2 */}
      <h2
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7A3D2A] mb-6 leading-tight"
      >
        {title}
      </h2>
      <div aria-hidden="true" className="flex items-center justify-center gap-4 mb-8">
        <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
        <span className="text-[#BE6E5B] text-xl">✦</span>
        <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
      </div>
      {subtitle && (
        <p
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          className="italic text-lg md:text-xl text-[#a07f61] max-w-2xl mx-auto leading-relaxed font-medium"
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
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />
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
              backgroundImage: "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div aria-hidden="true" className="absolute bottom-0 inset-x-0 s-rule" />

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
            <h1
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-5xl md:text-7xl font-bold text-[#7A3D2A] leading-tight mb-8"
            >
              About <em className="italic text-[#BE6E5B]">SANWARIYAS</em>
            </h1>
            <div aria-hidden="true" className="flex items-center justify-center gap-6 mb-12">
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-2xl">✦</span>
              <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>
            <p
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="italic text-xl md:text-2xl text-[#a07f61] max-w-3xl mx-auto mb-6 leading-relaxed font-medium"
            >
              From a single workshop in Sanganer, Jaipur — to an export house trusted by
              retailers across 50+ countries. SANWARIYAS is where Indian craftsmanship meets global wholesale.
            </p>
            <p className="font-sans text-base md:text-lg text-[#a07f61] max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
              We manufacture premium ethnic wear — Kurtis, Anarkalis, Suits, Lehengas, and
              Co-ord Sets — directly in our Jaipur facility, and deliver to boutiques,
              retailers, and wholesalers worldwide.
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

        {/* ── 2. NEW EDITORIAL TIMELINE ── */}
        <section
          aria-labelledby="story-heading"
          className="relative overflow-hidden bg-[#FDF7F2] py-32"
        >
          <div aria-hidden="true" className="absolute bottom-0 inset-x-0 s-rule" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Our Journey"
              title="How We Got Here"
              subtitle="A 14-year story of craft, growth, and an unwavering commitment to quality."
            />

            <div className="relative mt-20 max-w-5xl mx-auto">
              {/* Desktop continuous vertical line */}
              <div
                aria-hidden="true"
                className="hidden md:block absolute left-[29px] top-6 bottom-12 w-[2px] bg-gradient-to-b from-[#BE6E5B]/50 via-[#BE6E5B]/20 to-transparent"
              />

              <div className="flex flex-col gap-12 md:gap-24">
                {TIMELINE.map((item, i) => (
                  <div key={item.year} className="relative flex flex-col md:flex-row gap-6 md:gap-16 group">
                    
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
                          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }} 
                          className="text-5xl md:text-6xl font-bold text-[#7A3D2A] transition-colors duration-500 group-hover:text-[#BE6E5B]"
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
                      
                      {/* ✅ SEO FIX: Changed from H4 to H3 to maintain strict semantic hierarchy after SectionHeader's H2 */}
                      <h3 
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }} 
                        className="text-2xl md:text-3xl font-bold text-[#7A3D2A] mb-4 relative z-10"
                      >
                        {item.title}
                      </h3>
                      <p className="font-sans text-[15px] text-[#a07f61] leading-relaxed font-medium relative z-10">
                        {item.desc}
                      </p>
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
          <div aria-hidden="true" className="absolute top-0 inset-x-0 s-rule" />
          <div aria-hidden="true" className="absolute bottom-0 inset-x-0 s-rule" />
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
              title="Manufacturing Capability"
              subtitle="A 6-step production process built for consistency, quality, and scale."
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
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    className="text-2xl font-bold text-[#7A3D2A] mb-4"
                  >
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-[#a07f61] leading-relaxed font-medium">
                    {step.desc}
                  </p>
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
          aria-label="Get in touch with SANWARIYAS"
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
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FDF7F2] mb-8 leading-tight"
            >
              Ready to source premium <em className="italic text-[#F2D9C3]">ethnic wear?</em>
            </h2>
            <p className="font-sans text-base md:text-lg text-[#F2D9C3]/90 leading-relaxed max-w-2xl mx-auto mb-12">
              Send us an inquiry and our team will respond within 24 hours with pricing,
              availability, and a curated selection tailored to your store.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* ✅ SEO FIX: Added highly descriptive aria-label and titles for screen readers and link context */}
              <Link
                href="/contact"
                title="Send a Wholesale Inquiry"
                aria-label="Send a wholesale inquiry to SANWARIYAS customer support"
                className="inline-flex items-center gap-3 rounded-xl font-extrabold transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] bg-gradient-to-r from-[#BE6E5B] to-[#a07f61] text-[#FDF7F2] font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase py-4 px-8"
              >
                Send an Inquiry <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/products"
                title="View Wholesale Collections"
                aria-label="View SANWARIYAS wholesale product collections"
                className="inline-flex items-center gap-3 rounded-xl font-extrabold transition-all duration-300 hover:bg-white/10 bg-transparent text-[#F2D9C3] border-2 border-[#F2D9C3]/40 hover:border-[#F2D9C3]/80 font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase py-4 px-8"
              >
                View Collections <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}