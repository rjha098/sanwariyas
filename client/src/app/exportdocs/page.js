// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import Link from "next/link";

// export const metadata = {
//   title: "Export Documents & Certifications | SANWARIYAS",
//   description:
//     "View our export documentation, international shipping policies, payment terms, and quality certifications for SANWARIYAS Ethnic Luxury.",
// };

// // ── NEW EARTHY COLOR PALETTE ────────────────────────────────
// // Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
// // Headings/Active: #7A3D2A (Dark Burnt)
// // Default Text: #a07f61 (Warm Brown)
// // Accents: #BE6E5B (Terracotta)
// // Callout Box: #7A3D2A (Dark Burnt for high luxury contrast)
// // ────────────────────────────────────────────────────────────

// const documents = [
//   {
//     category: "Quality Certifications",
//     items: [
//       {
//         name: "ISO 9001:2015 Certification",
//         desc: "Quality Management System compliance.",
//         size: "1.2 MB",
//         ext: "PDF",
//       },
//       {
//         name: "Silk Mark India Certificate",
//         desc: "Authenticity guarantee for pure silk products.",
//         size: "850 KB",
//         ext: "PDF",
//       },
//       {
//         name: "Handloom Mark Registration",
//         desc: "Government certified authentic handloom goods.",
//         size: "1.5 MB",
//         ext: "PDF",
//       },
//     ],
//   },
//   {
//     category: "Shipping & Logistics",
//     items: [
//       {
//         name: "Standard Export Packaging Guidelines",
//         desc: "Details on moisture-proof, secure international packing.",
//         size: "2.1 MB",
//         ext: "PDF",
//       },
//       {
//         name: "Customs Clearance Process",
//         desc: "Step-by-step guide for international buyers.",
//         size: "900 KB",
//         ext: "PDF",
//       },
//       {
//         name: "DHL/FedEx Rate Card 2026",
//         desc: "Estimated volumetric weight charts and zones.",
//         size: "3.4 MB",
//         ext: "PDF",
//       },
//     ],
//   },
//   {
//     category: "Commercial & Payment",
//     items: [
//       {
//         name: "Proforma Invoice Template",
//         desc: "Sample invoice for wholesale and custom bridal orders.",
//         size: "400 KB",
//         ext: "DOCX",
//       },
//       {
//         name: "Letter of Credit (LC) Terms",
//         desc: "Standard terms for large volume export orders.",
//         size: "600 KB",
//         ext: "PDF",
//       },
//       {
//         name: "Bank Transfer Details & Swift Code",
//         desc: "Secure payment routing information.",
//         size: "200 KB",
//         ext: "PDF",
//       },
//     ],
//   },
// ];

// export default function ExportDocsPage() {
//   return (
//     <>
//       <Navbar />

//       <main
//         className="min-h-screen pt-32 md:pt-36 pb-24"
//         style={{
//           background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
//         }}
//       >
//         {/* Header Section */}
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 md:mb-20">
//           <div className="inline-flex items-center gap-4 mb-6 animate-fade-in opacity-90">
//             <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] md:tracking-[0.7em] uppercase text-[#BE6E5B] font-bold">
//               Compliance & Logistics
//             </p>
//             <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
//           </div>

//           <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[#7A3D2A] leading-tight mb-6 md:mb-8 drop-shadow-sm font-bold">
//             Export Documentation
//           </h1>
//           <p className="font-serif text-base md:text-xl text-[#a07f61] max-w-2xl mx-auto leading-relaxed italic">
//             Ensuring global standards for our international clientele. Access
//             our quality certificates, shipping terms, and commercial
//             documentation below.
//           </p>
//         </div>

//         {/* Documents Grid */}
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
//           {documents.map((section, idx) => (
//             <div key={idx} className="relative">
//               {/* Section Header */}
//               <div className="flex items-center gap-4 md:gap-6 mb-8">
//                 <h2 className="font-display text-2xl md:text-4xl text-[#7A3D2A] font-bold">
//                   {section.category}
//                 </h2>
//                 <div className="flex-1 h-px bg-gradient-to-r from-[#BE6E5B]/40 to-transparent" />
//               </div>

//               {/* Cards Grid (Frosted Glass Look) */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {section.items.map((doc, docIdx) => (
//                   <div
//                     key={docIdx}
//                     className="group bg-white/70 backdrop-blur-sm border border-[#BE6E5B]/20 p-6 md:p-8 rounded-lg hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(190,110,91,0.15)] transition-all duration-500 flex flex-col"
//                   >
//                     <div className="flex justify-between items-start mb-6">
//                       {/* Document Icon Box */}
//                       <div className="w-12 h-12 bg-white/50 border border-[#BE6E5B]/30 rounded-md flex items-center justify-center group-hover:bg-[#BE6E5B]/10 transition-colors duration-300">
//                         <span className="font-sans text-[10px] font-bold text-[#7A3D2A] tracking-widest">
//                           {doc.ext}
//                         </span>
//                       </div>
//                       <span className="font-sans text-[10px] text-[#a07f61] tracking-wider uppercase font-medium">
//                         {doc.size}
//                       </span>
//                     </div>

//                     <h3 className="font-display text-xl text-[#7A3D2A] mb-3 group-hover:text-[#BE6E5B] transition-colors duration-300 font-bold">
//                       {doc.name}
//                     </h3>
//                     <p className="font-sans text-xs text-[#a07f61] leading-relaxed mb-8 flex-1 font-medium">
//                       {doc.desc}
//                     </p>

//                     {/* Download Button (Visual only for now) */}
//                     <button className="inline-flex items-center gap-3 font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] border-t border-[#BE6E5B]/20 pt-4 w-full group-hover:border-[#BE6E5B]/60 font-bold transition-colors duration-300">
//                       <span className="group-hover:translate-y-1 transition-transform duration-300">
//                         ↓
//                       </span>
//                       View Document
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Global Support Callout (Dark Burnt for high contrast luxury) */}
//         <div className="max-w-4xl mx-auto px-4 mt-24 md:mt-32 text-center">
//           <div className="p-8 md:p-12 border border-[#BE6E5B]/40 bg-[#7A3D2A] rounded-lg relative overflow-hidden shadow-2xl">
//             {/* Glow effect */}
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(242,217,195,0.15),transparent_70%)] pointer-events-none" />

//             <h3 className="font-display text-2xl md:text-4xl text-[#FDF7F2] mb-4 relative z-10 font-bold">
//               Need specific documentation?
//             </h3>
//             <p className="font-sans text-xs md:text-sm text-[#FDF7F2]/80 mb-8 max-w-lg mx-auto relative z-10 leading-relaxed">
//               If your country's customs require specific regional certifications
//               or fumigation certificates, our export team can arrange them upon
//               request.
//             </p>

//             <Link
//               href="/contact"
//               className="relative z-10 inline-flex items-center gap-3 font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase px-8 py-3.5 md:px-10 md:py-4 rounded-md transition-all duration-300 font-bold hover:shadow-[0_0_20px_rgba(190,110,91,0.4)] hover:-translate-y-1"
//               style={{
//                 background: "linear-gradient(135deg, #BE6E5B 0%, #a07f61 100%)",
//                 color: "#FDF7F2",
//               }}
//             >
//               Contact Export Team{" "}
//               <span className="text-lg leading-none">→</span>
//             </Link>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </>
//   );
// }



import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

// ✅ SEO: Added keywords for better search engine ranking
export const metadata = {
  title: "Export Documents & Certifications | SANWARIYAS",
  description:
    "View our export documentation, international shipping policies, payment terms, and quality certifications for SANWARIYAS Ethnic Luxury.",
  keywords: "export documents, quality certifications, international shipping, ethnic wear export, ISO 9001, Silk Mark India, wholesale ethnic wear",
};

// ── NEW EARTHY COLOR PALETTE ────────────────────────────────
// Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
// Headings/Active: #7A3D2A (Dark Burnt)
// Default Text: #a07f61 (Warm Brown)
// Accents: #BE6E5B (Terracotta)
// Callout Box: #7A3D2A (Dark Burnt for high luxury contrast)
// ────────────────────────────────────────────────────────────

const documents = [
  {
    category: "Quality Certifications",
    items: [
      {
        name: "ISO 9001:2015 Certification",
        desc: "Quality Management System compliance.",
        size: "1.2 MB",
        ext: "PDF",
      },
      {
        name: "Silk Mark India Certificate",
        desc: "Authenticity guarantee for pure silk products.",
        size: "850 KB",
        ext: "PDF",
      },
      {
        name: "Handloom Mark Registration",
        desc: "Government certified authentic handloom goods.",
        size: "1.5 MB",
        ext: "PDF",
      },
    ],
  },
  {
    category: "Shipping & Logistics",
    items: [
      {
        name: "Standard Export Packaging Guidelines",
        desc: "Details on moisture-proof, secure international packing.",
        size: "2.1 MB",
        ext: "PDF",
      },
      {
        name: "Customs Clearance Process",
        desc: "Step-by-step guide for international buyers.",
        size: "900 KB",
        ext: "PDF",
      },
      {
        name: "DHL/FedEx Rate Card 2026",
        desc: "Estimated volumetric weight charts and zones.",
        size: "3.4 MB",
        ext: "PDF",
      },
    ],
  },
  {
    category: "Commercial & Payment",
    items: [
      {
        name: "Proforma Invoice Template",
        desc: "Sample invoice for wholesale and custom bridal orders.",
        size: "400 KB",
        ext: "DOCX",
      },
      {
        name: "Letter of Credit (LC) Terms",
        desc: "Standard terms for large volume export orders.",
        size: "600 KB",
        ext: "PDF",
      },
      {
        name: "Bank Transfer Details & Swift Code",
        desc: "Secure payment routing information.",
        size: "200 KB",
        ext: "PDF",
      },
    ],
  },
];

export default function ExportDocsPage() {
  return (
    <>
      <Navbar />

      {/* ✅ A11Y: Added id="main-content" for "skip to content" navigation */}
      <main
        id="main-content"
        className="min-h-screen pt-32 md:pt-36 pb-24"
        style={{
          background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
        }}
      >
        {/* Header Section */}
        <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 md:mb-20">
          {/* ✅ A11Y: Hidden decorative lines from screen readers */}
          <div aria-hidden="true" className="inline-flex items-center gap-4 mb-6 animate-fade-in opacity-90">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
            <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] md:tracking-[0.7em] uppercase text-[#BE6E5B] font-bold">
              Compliance & Logistics
            </p>
            <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[#7A3D2A] leading-tight mb-6 md:mb-8 drop-shadow-sm font-bold">
            Export Documentation
          </h1>
          <p className="font-serif text-base md:text-xl text-[#a07f61] max-w-2xl mx-auto leading-relaxed italic">
            Ensuring global standards for our international clientele. Access
            our quality certificates, shipping terms, and commercial
            documentation below.
          </p>
        </header>

        {/* Documents Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
          {documents.map((section, idx) => (
            /* ✅ A11Y & SEO: Wrapped categories in semantic <section> linked to their headings */
            <section key={idx} aria-labelledby={`section-heading-${idx}`} className="relative">
              {/* Section Header */}
              <div className="flex items-center gap-4 md:gap-6 mb-8">
                <h2 id={`section-heading-${idx}`} className="font-display text-2xl md:text-4xl text-[#7A3D2A] font-bold">
                  {section.category}
                </h2>
                {/* ✅ A11Y: Hidden decorative line */}
                <div aria-hidden="true" className="flex-1 h-px bg-gradient-to-r from-[#BE6E5B]/40 to-transparent" />
              </div>

              {/* Cards Grid (Frosted Glass Look) */}
              {/* ✅ A11Y & SEO: Converted grid to semantic <ul> for lists of items */}
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((doc, docIdx) => (
                  <li
                    key={docIdx}
                    className="group bg-white/70 backdrop-blur-sm border border-[#BE6E5B]/20 p-6 md:p-8 rounded-lg hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(190,110,91,0.15)] transition-all duration-500 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-6">
                      {/* Document Icon Box */}
                      {/* ✅ A11Y: Hidden purely visual badge since extension is usually obvious or screen readers can read it normally */}
                      <div aria-hidden="true" className="w-12 h-12 bg-white/50 border border-[#BE6E5B]/30 rounded-md flex items-center justify-center group-hover:bg-[#BE6E5B]/10 transition-colors duration-300">
                        <span className="font-sans text-[10px] font-bold text-[#7A3D2A] tracking-widest">
                          {doc.ext}
                        </span>
                      </div>
                      <span className="font-sans text-[10px] text-[#a07f61] tracking-wider uppercase font-medium">
                        <span className="sr-only">File size: </span>{doc.size}
                      </span>
                    </div>

                    <h3 className="font-display text-xl text-[#7A3D2A] mb-3 group-hover:text-[#BE6E5B] transition-colors duration-300 font-bold">
                      {doc.name}
                    </h3>
                    <p className="font-sans text-xs text-[#a07f61] leading-relaxed mb-8 flex-1 font-medium">
                      {doc.desc}
                    </p>

                    {/* Download Button (Visual only for now) */}
                    {/* ✅ A11Y: Added aria-label so screen readers announce WHICH document is being viewed */}
                    <button 
                      aria-label={`View ${doc.name} document`}
                      className="inline-flex items-center gap-3 font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] border-t border-[#BE6E5B]/20 pt-4 w-full group-hover:border-[#BE6E5B]/60 font-bold transition-colors duration-300"
                    >
                      {/* ✅ A11Y: Hidden decorative arrow */}
                      <span aria-hidden="true" className="group-hover:translate-y-1 transition-transform duration-300">
                        ↓
                      </span>
                      View Document
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Global Support Callout (Dark Burnt for high contrast luxury) */}
        {/* ✅ A11Y & SEO: Wrapped callout in semantic <aside> */}
        <aside aria-labelledby="callout-heading" className="max-w-4xl mx-auto px-4 mt-24 md:mt-32 text-center">
          <div className="p-8 md:p-12 border border-[#BE6E5B]/40 bg-[#7A3D2A] rounded-lg relative overflow-hidden shadow-2xl">
            {/* Glow effect */}
            {/* ✅ A11Y: Hidden decorative glow */}
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(242,217,195,0.15),transparent_70%)] pointer-events-none" />

            <h3 id="callout-heading" className="font-display text-2xl md:text-4xl text-[#FDF7F2] mb-4 relative z-10 font-bold">
              Need specific documentation?
            </h3>
            <p className="font-sans text-xs md:text-sm text-[#FDF7F2]/80 mb-8 max-w-lg mx-auto relative z-10 leading-relaxed">
              If your country's customs require specific regional certifications
              or fumigation certificates, our export team can arrange them upon
              request.
            </p>

            <Link
              href="/contact"
              className="relative z-10 inline-flex items-center gap-3 font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase px-8 py-3.5 md:px-10 md:py-4 rounded-md transition-all duration-300 font-bold hover:shadow-[0_0_20px_rgba(190,110,91,0.4)] hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, #BE6E5B 0%, #a07f61 100%)",
                color: "#FDF7F2",
              }}
            >
              Contact Export Team{" "}
              {/* ✅ A11Y: Hidden decorative arrow */}
              <span aria-hidden="true" className="text-lg leading-none">→</span>
            </Link>
          </div>
        </aside>
      </main>

      <Footer />
    </>
  );
}