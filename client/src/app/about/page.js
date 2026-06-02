// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";

// // ✅ TECHNICAL SEO: Added Next.js metadata for Search Engine ranking
// export const metadata = {
//   title: "About Us | SANWARIYAS - Premium Ethnic Luxury",
//   description: "Discover the story of SANWARIYAS, a premium ethnic fashion brand blending timeless elegance with modern craftsmanship. Explore our heritage and artistry.",
//   keywords: "SANWARIYAS, ethnic fashion, premium quality, custom designs, bridal lehengas, Indian luxury wear, ethnic brand story",
// };

// export default function AboutPage() {
//   return (
//     <>
//       {/* Navbar */}
//       <Navbar />

//       {/* ✅ ACCESSIBILITY & SEO: Changed <section> to <main> for semantic structure */}
//       <main
//         id="main-content"
//         className="min-h-screen pt-36 py-28 relative"
//         style={{
//           background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
//         }}
//       >
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
//           <p className="text-xs tracking-[0.7em] uppercase text-[#7A3D2A] font-semibold mb-4">
//             Our Story
//           </p>

//           <h1 className="text-5xl md:text-6xl text-[#7A3D2A] mb-6 font-serif">
//             About SANWARIYAS
//           </h1>

//           {/* ✅ ACCESSIBILITY: Added aria-hidden="true" so screen readers ignore decorative lines/symbols */}
//           <div className="flex items-center justify-center gap-4 mb-12" aria-hidden="true">
//             <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//             <span className="text-[#BE6E5B] text-lg">✦</span>
//             <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//           </div>

//           <p className="text-[#7A3D2A] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
//             SANWARIYAS is a premium ethnic fashion brand dedicated to bringing
//             timeless elegance and modern craftsmanship together. From bridal
//             lehengas to everyday luxury wear, each piece reflects heritage,
//             artistry, and sophistication.
//           </p>

//           <p className="text-[#7A3D2A] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-16">
//             We believe in creating not just garments, but experiences — helping
//             you look your best for every occasion.
//           </p>

//           {/* Features Grid */}
//           <section aria-label="Our Core Values" className="grid md:grid-cols-3 gap-8 mt-10">
//             <div className="p-6 bg-white/70 border border-[#BE6E5B]/20 rounded-sm shadow-sm backdrop-blur-sm">
//               {/* ✅ ACCESSIBILITY: Changed <h3> to <h2> to maintain strict heading hierarchy (h1 -> h2) */}
//               <h2 className="text-[#7A3D2A] text-xl mb-2 font-semibold">
//                 Premium Quality
//               </h2>
//               <p className="text-[#a07f61] text-sm font-medium">
//                 Finest fabrics and detailed craftsmanship.
//               </p>
//             </div>

//             <div className="p-6 bg-white/70 border border-[#BE6E5B]/20 rounded-sm shadow-sm backdrop-blur-sm">
//               <h2 className="text-[#7A3D2A] text-xl mb-2 font-semibold">
//                 Custom Designs
//               </h2>
//               <p className="text-[#a07f61] text-sm font-medium">
//                 Tailored outfits for your perfect fit.
//               </p>
//             </div>

//             <div className="p-6 bg-white/70 border border-[#BE6E5B]/20 rounded-sm shadow-sm backdrop-blur-sm">
//               <h2 className="text-[#7A3D2A] text-xl mb-2 font-semibold">
//                 Trusted Brand
//               </h2>
//               <p className="text-[#a07f61] text-sm font-medium">
//                 Loved by customers for quality & service.
//               </p>
//             </div>
//           </section>
//         </div>
//       </main>

//       {/* Footer */}
//       <Footer />   
//     </>
//   );
// }



// FILE: client/src/app/about/page.js
// Pure Server Component — no event handlers here

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import AboutInteractive from "@/components/about/AboutInteractive";

export const metadata = {
  title: "About Us | SANWARIYAS — Premium Wholesale Ethnic Wear, Jaipur",
  description:
    "Learn the story of SANWARIYAS — Jaipur's trusted wholesale ethnic wear manufacturer. Discover our manufacturing capability, quality process, and the team behind every piece.",
  keywords:
    "SANWARIYAS about, ethnic wear manufacturer Jaipur, wholesale kurti manufacturer, Indian ethnic fashion brand story, Rajasthan ethnic wear factory",
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "2010",  label: "Founded"            },
  { value: "500+",  label: "Designs per season"  },
  { value: "15K+",  label: "Orders delivered"    },
  { value: "50+",   label: "Countries exported"  },
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
    step: "01", title: "Fabric Sourcing",
    desc: "We source directly from certified mills in Surat, Varanasi, and Jaipur. Every fabric batch is tested for GSM, colour-fastness, shrinkage, and tensile strength before entering production.",
  },
  {
    step: "02", title: "Design & Pattern Making",
    desc: "Our in-house design team creates seasonal catalogues with 500+ original styles. Each design goes through a pattern-making process with precise size grading across XS–3XL.",
  },
  {
    step: "03", title: "Cutting & Stitching",
    desc: "Precision cutting is done using CAD-guided machines. Stitching is carried out by skilled artisans on our production floor, ensuring consistent quality across every piece in the lot.",
  },
  {
    step: "04", title: "Embroidery & Embellishment",
    desc: "For embroidered pieces, we use a mix of hand-embroidery artisans and computerised embroidery machines — ensuring intricate detailing without compromising on speed or consistency.",
  },
  {
    step: "05", title: "4-Step Quality Control",
    desc: "Every garment passes through four QC checkpoints: fabric inspection, mid-production stitch check, finishing review, and a final packing audit — before it ever leaves our facility.",
  },
  {
    step: "06", title: "Packing & Dispatch",
    desc: "Orders are individually folded, tagged, and packed as per buyer specifications. Export orders are packed with customs documentation, barcode tagging, and full insurance coverage.",
  },
];

const TEAM = [
  {
    name: "Harish Rathi",    role: "Founder & Managing Director",
    bio: "With over 14 years in the ethnic wear industry, Harish built SANWARIYAS from a single workshop into Jaipur's leading wholesale export house.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", initial: "H",
  },
  {
    name: "Priya Sharma",    role: "Head of Design",
    bio: "A graduate of NIFT Jaipur, Priya leads our seasonal design catalogue — crafting 500+ original styles that blend heritage prints with contemporary silhouettes.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80", initial: "P",
  },
  {
    name: "Rajesh Verma",    role: "Head of Manufacturing",
    bio: "Rajesh oversees our entire production floor — from fabric intake to final dispatch — ensuring every piece meets our 4-step quality standard.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", initial: "R",
  },
  {
    name: "Sunita Meena",    role: "Export & Client Relations",
    bio: "Sunita manages our global buyer relationships across 50+ countries — handling inquiries, order coordination, and ensuring every client receives a smooth experience.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", initial: "S",
  },
];

const VALUES = [
  { title: "Premium Quality",      icon: "✦", desc: "Every garment is stitched to meet export standards. No shortcuts, no compromise — only pieces we are proud to put our name on." },
  { title: "Artisan Heritage",     icon: "◈", desc: "We work with master weavers and skilled artisans from Rajasthan, preserving centuries-old craft traditions in every collection." },
  { title: "Transparent Pricing",  icon: "◎", desc: "Factory-direct means no middlemen. You get wholesale pricing straight from the source, with full invoice transparency on every order." },
  { title: "Custom Production",    icon: "⬡", desc: "From private labels to custom embroidery and size grading, we tailor every order to your exact specifications." },
];

// ── Shared styles ─────────────────────────────
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Nunito+Sans:wght@400;500;600;700&display=swap');
.s-rule{height:1px;background:linear-gradient(to right,transparent,rgba(190,110,91,0.35),transparent);}`;

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-14 md:mb-16">
      <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:"10px", letterSpacing:"0.65em", textTransform:"uppercase", color:"#BE6E5B", fontWeight:700, marginBottom:"14px" }}>
        {eyebrow}
      </p>
      <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(2rem,4vw,3.5rem)", fontWeight:700, color:"#7A3D2A", lineHeight:1.1, marginBottom:"20px" }}>
        {title}
      </h2>
      <div aria-hidden="true" className="flex items-center justify-center gap-4 mb-6">
        <div style={{ height:"2px", width:"70px", background:"linear-gradient(to right,transparent,#BE6E5B)" }} />
        <span style={{ color:"#BE6E5B", fontSize:"16px" }}>✦</span>
        <div style={{ height:"2px", width:"70px", background:"linear-gradient(to left,transparent,#BE6E5B)" }} />
      </div>
      {subtitle && (
        <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontStyle:"italic", fontSize:"clamp(15px,1.4vw,18px)", color:"#a07f61", maxWidth:"560px", margin:"0 auto", lineHeight:1.8, fontWeight:500 }}>
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

      <main id="main-content">

        {/* ── 1. HERO ── */}
        <section aria-label="About SANWARIYAS" className="relative overflow-hidden"
          style={{ background:"linear-gradient(160deg,#FDF7F2 0%,#F5E8D8 50%,#F2D9C3 100%)", padding:"140px 0 100px" }}>
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage:"radial-gradient(#7A3D2A 1.5px,transparent 1.5px)", backgroundSize:"28px 28px" }} />
          <div aria-hidden="true" className="absolute bottom-0 inset-x-0 s-rule" />
          {[["top-5 left-5","0"],["top-5 right-5","90"],["bottom-5 left-5","-90"],["bottom-5 right-5","180"]].map(([pos,rot],i)=>(
            <svg key={i} aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none"
              className={`absolute ${pos} hidden md:block`} style={{ transform:`rotate(${rot}deg)`, opacity:0.18 }}>
              <path d="M3 3L29 3L29 7M3 3L3 29L7 29" stroke="#BE6E5B" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="3" cy="3" r="1.8" fill="#BE6E5B"/>
            </svg>
          ))}
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span style={{ fontFamily:"Georgia,serif", fontSize:"clamp(8rem,20vw,20rem)", fontWeight:700, color:"rgba(122,61,42,0.028)", letterSpacing:"-0.04em", lineHeight:1 }}>S</span>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:"10px", letterSpacing:"0.65em", textTransform:"uppercase", color:"#BE6E5B", fontWeight:700, marginBottom:"16px" }}>
              Our Story
            </p>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(2.8rem,6vw,5rem)", fontWeight:700, color:"#7A3D2A", lineHeight:1.06, marginBottom:"24px" }}>
              About <em className="italic" style={{ color:"#BE6E5B" }}>SANWARIYAS</em>
            </h1>
            <div aria-hidden="true" className="flex items-center justify-center gap-5 mb-10">
              <div style={{ height:"2px", width:"80px", background:"linear-gradient(to right,transparent,#BE6E5B)" }} />
              <span style={{ color:"#BE6E5B", fontSize:"18px" }}>✦</span>
              <div style={{ height:"2px", width:"80px", background:"linear-gradient(to left,transparent,#BE6E5B)" }} />
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontStyle:"italic", fontSize:"clamp(16px,1.6vw,20px)", color:"#a07f61", maxWidth:"680px", margin:"0 auto 16px", lineHeight:1.85, fontWeight:500 }}>
              From a single workshop in Sanganer, Jaipur — to an export house trusted by retailers across 50+ countries.
              SANWARIYAS is where Indian craftsmanship meets global wholesale.
            </p>
            <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:"15px", color:"#a07f61", maxWidth:"620px", margin:"0 auto 52px", lineHeight:1.85, fontWeight:500 }}>
              We manufacture premium ethnic wear — Kurtis, Anarkalis, Suits, Lehengas, and Co-ord Sets — directly in our
              Jaipur facility, and deliver to boutiques, retailers, and wholesalers worldwide.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center py-5 px-4 rounded-xl"
                  style={{ background:"rgba(255,255,255,0.65)", backdropFilter:"blur(12px)", border:"1.5px solid rgba(190,110,91,0.2)", boxShadow:"0 4px 16px rgba(122,61,42,0.07)" }}>
                  <span style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.6rem,2.5vw,2.2rem)", fontWeight:700, color:"#7A3D2A", lineHeight:1 }}>{s.value}</span>
                  <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"#a07f61", fontWeight:700, marginTop:"6px" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── 2. TIMELINE ── */}
        <section aria-labelledby="story-heading" className="relative overflow-hidden"
          style={{ background:"linear-gradient(180deg,#FDF7F2 0%,#F8EDE6 100%)", padding:"96px 0" }}>
          <div aria-hidden="true" className="absolute top-0 inset-x-0 s-rule" />
          <div aria-hidden="true" className="absolute bottom-0 inset-x-0 s-rule" />
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage:"radial-gradient(#7A3D2A 1.5px,transparent 1.5px)", backgroundSize:"30px 30px" }} />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="Our Journey" title="How We Got Here"
              subtitle="A 14-year story of craft, growth, and an unwavering commitment to quality." />

            <div className="relative">
              {/* vertical line */}
              <div aria-hidden="true" className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
                style={{ background:"linear-gradient(to bottom,transparent,rgba(190,110,91,0.4),transparent)" }} />

              <ol className="relative flex flex-col gap-8 list-none p-0 m-0">
                {TIMELINE.map((item, i) => (
                  <li key={item.year}
                    className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* dot */}
                    <div className="absolute left-[19px] md:left-1/2 top-4 -translate-x-1/2 z-10">
                      <div style={{ width:"38px", height:"38px", borderRadius:"50%", background:"linear-gradient(135deg,#7A3D2A,#BE6E5B)", border:"3px solid #FDF7F2", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(122,61,42,0.25)" }}>
                        <span style={{ fontFamily:"Georgia,serif", fontSize:"8px", color:"#FDF7F2", fontWeight:700 }}>{item.year}</span>
                      </div>
                    </div>
                    {/* card — no hover handlers, pure CSS via group */}
                    <div
                      className={`group ml-14 md:ml-0 rounded-2xl p-6 md:p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(122,61,42,0.12)] hover:border-[rgba(190,110,91,0.45)] ${i % 2 === 0 ? "md:mr-[54%]" : "md:ml-[54%]"}`}
                      style={{ background:"rgba(255,255,255,0.75)", backdropFilter:"blur(12px)", border:"1.5px solid rgba(190,110,91,0.2)", boxShadow:"0 4px 20px rgba(122,61,42,0.07)", flex:1 }}>
                      <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", color:"#BE6E5B", fontWeight:700, display:"block", marginBottom:"6px" }}>{item.year}</span>
                      <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(18px,2vw,22px)", fontWeight:700, color:"#7A3D2A", marginBottom:"10px" }}>{item.title}</h3>
                      <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:"14px", color:"#a07f61", lineHeight:1.8, fontWeight:500 }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>


        {/* ── 3. MANUFACTURING ── */}
        <section aria-labelledby="manufacturing-heading" className="relative overflow-hidden"
          style={{ background:"linear-gradient(160deg,#FDF7F2 0%,#F2D9C3 100%)", padding:"96px 0" }}>
          <div aria-hidden="true" className="absolute top-0 inset-x-0 s-rule" />
          <div aria-hidden="true" className="absolute bottom-0 inset-x-0 s-rule" />
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage:"repeating-linear-gradient(45deg,#BE6E5B 0,#BE6E5B 1px,transparent 0,transparent 36px)", backgroundSize:"36px 36px" }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="How We Make It" title="Manufacturing Capability"
              subtitle="A 6-step production process built for consistency, quality, and scale." />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {MANUFACTURING.map((step) => (
                <article key={step.step}
                  className="group relative rounded-2xl p-7 md:p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(122,61,42,0.13)] hover:border-[rgba(190,110,91,0.5)]"
                  style={{ background:"rgba(255,255,255,0.7)", backdropFilter:"blur(12px)", border:"1.5px solid rgba(190,110,91,0.2)", boxShadow:"0 4px 20px rgba(122,61,42,0.06)" }}>
                  <span aria-hidden="true" style={{ position:"absolute", top:"12px", right:"16px", fontFamily:"Georgia,serif", fontSize:"52px", fontWeight:700, color:"rgba(122,61,42,0.05)", lineHeight:1, userSelect:"none" }}>
                    {step.step}
                  </span>
                  <div className="mb-5 w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background:"rgba(190,110,91,0.08)", border:"1px solid rgba(190,110,91,0.3)" }}>
                    <span style={{ fontFamily:"Georgia,serif", fontSize:"20px", fontWeight:700, color:"#BE6E5B" }}>{step.step}</span>
                  </div>
                  <div style={{ height:"2px", width:"32px", background:"rgba(190,110,91,0.4)", borderRadius:"2px", marginBottom:"14px" }} />
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(17px,1.8vw,20px)", fontWeight:700, color:"#7A3D2A", marginBottom:"10px" }}>{step.title}</h3>
                  <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:"13.5px", color:"#a07f61", lineHeight:1.8, fontWeight:500 }}>{step.desc}</p>
                </article>
              ))}
            </div>

            {/* Capacity strip */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { v:"10,000+", l:"Pieces/month"       },
                { v:"4-Step",  l:"Quality control"    },
                { v:"500+",    l:"Designs per season" },
                { v:"15+",     l:"Fabric categories"  },
              ].map((s) => (
                <div key={s.l} className="flex flex-col items-center py-5 px-3 rounded-xl text-center"
                  style={{ background:"rgba(122,61,42,0.06)", border:"1px solid rgba(190,110,91,0.2)" }}>
                  <span style={{ fontFamily:"Georgia,serif", fontSize:"clamp(1.4rem,2vw,1.9rem)", fontWeight:700, color:"#7A3D2A", lineHeight:1 }}>{s.v}</span>
                  <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"#a07f61", fontWeight:700, marginTop:"6px" }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── 4. TEAM (interactive — client component) ── */}
        <AboutInteractive team={TEAM} values={VALUES} />


        {/* ── 5. CTA ── */}
        <section aria-label="Get in touch with SANWARIYAS" className="relative overflow-hidden"
          style={{ background:"linear-gradient(160deg,#5C3120 0%,#7A3D2A 60%,#8B4A34 100%)", padding:"80px 0" }}>
          <div aria-hidden="true" className="absolute top-0 inset-x-0 h-px"
            style={{ background:"linear-gradient(to right,transparent,rgba(242,217,195,0.4),transparent)" }} />
          <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px"
            style={{ background:"linear-gradient(to right,transparent,rgba(242,217,195,0.4),transparent)" }} />
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage:"radial-gradient(rgba(242,217,195,0.6) 1.5px,transparent 1.5px)", backgroundSize:"28px 28px" }} />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:"10px", letterSpacing:"0.65em", textTransform:"uppercase", color:"#F2D9C3", fontWeight:700, opacity:0.75, marginBottom:"14px" }}>
              Partner With Us
            </p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(2rem,4.5vw,3.5rem)", fontWeight:700, color:"#FDF7F2", lineHeight:1.1, marginBottom:"20px" }}>
              Ready to source premium{" "}
              <em className="italic" style={{ color:"#F2D9C3" }}>ethnic wear?</em>
            </h2>
            <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:"15px", color:"rgba(242,217,195,0.8)", lineHeight:1.8, maxWidth:"480px", margin:"0 auto 40px" }}>
              Send us an inquiry and our team will respond within 24 hours with pricing,
              availability, and a curated selection tailored to your store.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact"
                className="inline-flex items-center gap-3 rounded-lg font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{ background:"linear-gradient(135deg,#BE6E5B,#a07f61)", color:"#FDF7F2", fontFamily:"'Nunito Sans',sans-serif", fontSize:"10px", letterSpacing:"0.3em", textTransform:"uppercase", padding:"14px 32px", boxShadow:"0 8px 28px rgba(0,0,0,0.2)" }}>
                Send an Inquiry <span aria-hidden="true">→</span>
              </Link>
              <Link href="/products"
                className="inline-flex items-center gap-3 rounded-lg font-bold transition-all duration-300 hover:bg-white/10"
                style={{ background:"transparent", color:"#F2D9C3", fontFamily:"'Nunito Sans',sans-serif", fontSize:"10px", letterSpacing:"0.3em", textTransform:"uppercase", padding:"13px 28px", border:"1.5px solid rgba(242,217,195,0.45)" }}>
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