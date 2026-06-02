// // app/contact/page.tsx
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import InquiryForm from "@/components/ui/InquiryForm";

// // ✅ SEO: Metadata is already well-defined
// export const metadata = {
//   title: "Contact & Inquiry | SANWARIYAS Ethnic Luxury",
//   description:
//     "Get in touch with SANWARIYAS for bulk product inquiries, custom manufacturing orders, and wholesale export consultations.",
//   alternates: { canonical: "/contact" },
// };
  
// // ── NEW EARTHY COLOR PALETTE ────────────────────────────────
// // Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
// // Headings/Active: #7A3D2A (Dark Burnt)
// // Default Text: #a07f61 (Warm Brown)
// // Accents: #BE6E5B (Terracotta)
// // ────────────────────────────────────────────────────────────

// const contactItems = [
//   {
//     label: "Visit Us",
//     line1:
//       "Shop no.- 12,13 , 1st floor, Shiv plaza, near HDFC bank, Printers Colony, Dada Gurudev Nagar, Sanganer",
//     line2: "Jaipur, Rajasthan 302029",
//     icon: (
//       // ✅ A11Y: Added aria-hidden and focusable to decorative SVGs
//       <svg
//         aria-hidden="true"
//         focusable="false"
//         viewBox="0 0 16 16"
//         fill="none"
//         stroke="#BE6E5B"
//         strokeWidth="1.2"
//         className="w-5 h-5"
//       >
//         <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5z" />
//         <circle cx="8" cy="6" r="1.5" />
//       </svg>
//     ),
//   },
//   {
//     label: "Call Us",
//     line1: "+91 9680812813",
//     line2: "Mon – Sat: 10am – 7pm (IST)",
//     icon: (
//       <svg
//         aria-hidden="true"
//         focusable="false"
//         viewBox="0 0 16 16"
//         fill="none"
//         stroke="#BE6E5B"
//         strokeWidth="1.2"
//         className="w-5 h-5"
//       >
//         <path d="M3 2.5h3l1 3-1.5 1a8 8 0 003 3l1-1.5 3 1v3A1.5 1.5 0 0112 13 9.5 9.5 0 012.5 4 1.5 1.5 0 014 2.5H3z" />
//       </svg>
//     ),
//   },
//   {
//     label: "Email Us",
//     line1: "hrsanwariyas@gmail.com",
//     line2: "We respond within 24 hours",
//     icon: (
//       <svg
//         aria-hidden="true"  
//         focusable="false"
//         viewBox="0 0 16 16"
//         fill="none"
//         stroke="#BE6E5B"
//         strokeWidth="1.2"
//         className="w-5 h-5"
//       >
//         <rect x="1.5" y="3.5" width="13" height="9" rx="1" />
//         <path d="M1.5 5l6.5 4 6.5-4" />
//       </svg>
//     ),
//   },
//   {
//     label: "WhatsApp",
//     line1: "+91 9680812813",
//     line2: "Quick responses on WhatsApp",
//     icon: (
//       <svg
//         aria-hidden="true"
//         focusable="false"
//         viewBox="0 0 16 16"
//         fill="none"
//         stroke="#BE6E5B"
//         strokeWidth="1.2"
//         className="w-5 h-5"
//       >
//         <path d="M13.5 11.5l-2-2a1 1 0 00-1.4 0l-.8.8a7.4 7.4 0 01-3.6-3.6l.8-.8a1 1 0 000-1.4l-2-2a1 1 0 00-1.4 0C1.5 4 2 9 6.5 11.5S14 14.5 13.5 11.5z" />
//       </svg>
//     ),
//   },
// ];

// export default function ContactPage() {
//   return (
//     <>
//       <Navbar />

//       {/* ✅ A11Y: Added id="main-content" for "skip to main content" accessibility */}
//       <main
//         id="main-content"
//         className="min-h-screen pt-32 pb-24 flex flex-col"
//         style={{
//           background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
//         }}
//       >
//         {/* Hero Section */}
//         <header className="relative overflow-hidden mb-12">
//           <div
//             aria-hidden="true"
//             className="absolute inset-0 opacity-20 pointer-events-none"
//             style={{
//               backgroundImage:
//                 "repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(190,110,91,0.1) 40px,rgba(190,110,91,0.1) 41px)",
//             }}
//           />
//           <div className="relative z-10 text-center px-4 pt-10">
//             <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] md:tracking-[0.8em] uppercase text-[#BE6E5B] font-bold mb-4">
//               Reach Out
//             </p>
//             <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold tracking-wide drop-shadow-sm">
//               Get In Touch
//             </h1>
//             <p className="font-serif italic text-[#7A3D2A] mt-4 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
//               Our export desk is here to help you finalize bulk requirements, custom manufacturing, and global logistics.
//             </p>
//             <div aria-hidden="true" className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#BE6E5B] to-transparent mx-auto mt-8" />
//           </div>
//         </header>

//         {/* Main Content Area */}
//         <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
//           {/* ✅ FIX: Changed to grid-cols-2 for perfect 50-50 balance, removing right side empty space */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            
//             {/* Left — Contact Info */}
//             {/* ✅ FIX: Added lg:pt-12 to perfectly align with the right box's p-12 padding */}
//             <section aria-labelledby="contact-info-heading" className="flex flex-col h-fit lg:pt-12">
//               <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-3">
//                 Our Details
//               </p>
//               <h2 id="contact-info-heading" className="font-display text-3xl md:text-4xl text-[#7A3D2A] font-bold mb-4">
//                 Let's Connect
//               </h2>
//               <p className="font-sans text-sm text-[#a07f61] leading-relaxed mb-8 pr-4">
//                 Whether you're looking for wholesale sourcing, a custom manufacturing partner, or international dispatch details — we're ready to assist.
//               </p>

//               {/* Contact Cards */}
//               <ul aria-label="Contact Methods" className="flex flex-col gap-3">
//                 {contactItems.map((item) => (
//                   <li
//                     key={item.label}
//                     className="flex items-start gap-4 p-5 bg-white/60 backdrop-blur-sm border border-[#BE6E5B]/20 rounded-md hover:border-[#BE6E5B]/60 hover:shadow-md transition-all duration-300 group"
//                   >
//                     <div className="w-10 h-10 flex-shrink-0 bg-white border border-[#BE6E5B]/40 rounded-full flex items-center justify-center group-hover:bg-[#BE6E5B]/10 transition-colors">
//                       {item.icon}
//                     </div>
//                     <div>
//                       <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold mb-1">
//                         {item.label}
//                       </p>
//                       <p className="font-sans text-sm text-[#7A3D2A] font-semibold">
//                         {item.line1}
//                       </p>
//                       <p className="font-sans text-xs text-[#a07f61] mt-0.5">
//                         {item.line2}
//                       </p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>

//               {/* Live Google Map Embed */}
//               <div className="mt-8 rounded-md overflow-hidden border border-[#BE6E5B]/20 shadow-sm" style={{ height: "250px" }}>
//                 <iframe
//                   title="SANWARIYAS Office Location"
//                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.840909565507!2d75.8037149!3d26.8131804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9e20a2334f5%3A0xc54ff6e3604f32dc!2sShiv%20Plaza!5e0!3m2!1sen!2sin!4v1717327318712!5m2!1sen!2sin"
//                   width="100%"
//                   height="100%"
//                   style={{ border: 0 }}
//                   allowFullScreen={false}
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade"
//                 ></iframe>
//               </div>

//               {/* Promise box */}
//               <aside aria-label="Service Guarantee" className="mt-8 bg-white/50 backdrop-blur-md p-8 text-center rounded-md shadow-sm border border-[#BE6E5B]/20 relative overflow-hidden">
//                 <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(190,110,91,0.08),transparent_60%)] pointer-events-none" />
//                 <div aria-hidden="true" className="flex items-center justify-center gap-3 mb-4 relative z-10">
//                   <div className="w-8 h-px bg-[#BE6E5B]" />
//                   <div className="w-1.5 h-1.5 rounded-full bg-[#BE6E5B]" />
//                   <div className="w-8 h-px bg-[#BE6E5B]" />
//                 </div>
//                 <p className="font-display text-xl text-[#7A3D2A] font-bold mb-2 relative z-10">
//                   24-Hour Response
//                 </p>
//                 <p className="font-sans text-xs text-[#a07f61] leading-relaxed relative z-10">
//                   We guarantee a response to every wholesale inquiry within 24 business hours.
//                 </p>
//               </aside>
//             </section>

//             {/* Right — Form */}
//             {/* ✅ FIX: p-8 md:p-12 matches the lg:pt-12 on the left, keeping them perfectly row-aligned */}
//             <section aria-labelledby="inquiry-form-heading" className="bg-white/70 backdrop-blur-md border border-[#BE6E5B]/20 p-8 md:p-12 rounded-lg shadow-sm h-fit w-full">
              
//               {/* ✅ FIX: Added missing eyebrow text here to perfectly match left side structure */}
//               <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-3">
//                 Trade Inquiry
//               </p>
              
//               <h2 id="inquiry-form-heading" className="font-display text-3xl md:text-4xl text-[#7A3D2A] font-bold mb-4">
//                 Send Your Bulk Inquiry
//               </h2>
              
//               <p className="font-sans text-sm text-[#a07f61] mb-2">
//                 Fill in the form below and our export team will get back to you with custom pricing and container availability.
//               </p>
              
//               <div aria-hidden="true" className="w-12 h-[2px] bg-[#BE6E5B] mt-6 mb-8" />

//               <InquiryForm />
//             </section>
            
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </>
//   );
// }   



// FILE: client/src/app/contact/page.js

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InquiryForm from "@/components/ui/InquiryForm";

export const metadata = {
  title: "Contact & Inquiry | SANWARIYAS Ethnic Luxury",
  description:
    "Get in touch with SANWARIYAS for bulk product inquiries, custom manufacturing orders, and wholesale export consultations.",
  alternates: { canonical: "/contact" },
};

const contactItems = [
  {
    label: "Visit Us",
    line1: "Shop no.- 12,13, 1st floor, Shiv Plaza, near HDFC bank, Printers Colony, Dada Gurudev Nagar, Sanganer",
    line2: "Jaipur, Rajasthan 302029",
    href: "https://maps.google.com/?q=Shiv+Plaza+Sanganer+Jaipur",
    external: true,
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none" stroke="#BE6E5B" strokeWidth="1.2" className="w-5 h-5 flex-shrink-0">
        <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5z"/>
        <circle cx="8" cy="6" r="1.5"/>
      </svg>
    ),
  },
  {
    label: "Call Us",
    line1: "+91 9680812813",
    line2: "Mon – Sat: 10am – 7pm (IST)",
    href: "tel:+919680812813",
    external: false,
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none" stroke="#BE6E5B" strokeWidth="1.2" className="w-5 h-5 flex-shrink-0">
        <path d="M3 2.5h3l1 3-1.5 1a8 8 0 003 3l1-1.5 3 1v3A1.5 1.5 0 0112 13 9.5 9.5 0 012.5 4 1.5 1.5 0 014 2.5H3z"/>
      </svg>
    ),
  },
  {
    label: "Email Us",
    line1: "hrsanwariyas@gmail.com",
    line2: "We respond within 24 hours",
    href: "mailto:hrsanwariyas@gmail.com",
    external: false,
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none" stroke="#BE6E5B" strokeWidth="1.2" className="w-5 h-5 flex-shrink-0">
        <rect x="1.5" y="3.5" width="13" height="9" rx="1"/>
        <path d="M1.5 5l6.5 4 6.5-4"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    line1: "+91 9680812813",
    line2: "Quick responses on WhatsApp",
    href: "https://wa.me/919680812813?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20products.",
    external: true,
    icon: (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="none" stroke="#BE6E5B" strokeWidth="1.2" className="w-5 h-5 flex-shrink-0">
        <path d="M13.5 11.5l-2-2a1 1 0 00-1.4 0l-.8.8a7.4 7.4 0 01-3.6-3.6l.8-.8a1 1 0 000-1.4l-2-2a1 1 0 00-1.4 0C1.5 4 2 9 6.5 11.5S14 14.5 13.5 11.5z"/>
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Equal 50-50 two column grid — pure CSS, no Tailwind lg: needed */
        .cg-wrap {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }
        @media (min-width: 640px)  { .cg-wrap { padding: 0 24px; } }
        @media (min-width: 1024px) { .cg-wrap { padding: 0 32px; } }

        .cg-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .cg-grid {
            grid-template-columns: 1fr 1fr;
            gap: 48px;
          }
        }

        /* Card hover — pure CSS, zero JS */
        .cc-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 20px;
          background: rgba(255,255,255,0.62);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(190,110,91,0.20);
          border-radius: 12px;
          text-decoration: none;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s, transform 0.3s;
          color: inherit;
        }
        .cc-card:hover {
          border-color: rgba(190,110,91,0.55);
          background: rgba(255,255,255,0.90);
          box-shadow: 0 8px 28px rgba(122,61,42,0.10);
          transform: translateY(-2px);
        }
        .cc-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          background: white;
          border: 1px solid rgba(190,110,91,0.30);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.3s, border-color 0.3s;
        }
        .cc-card:hover .cc-icon {
          background: rgba(190,110,91,0.10);
          border-color: rgba(190,110,91,0.60);
        }
      `}} />

      <Navbar />

      <main
        id="main-content"
        className="min-h-screen pt-32 pb-24"
        style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)" }}
      >

        {/* ── HERO ── */}
        <header className="relative text-center px-4 pb-14 overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(190,110,91,0.1) 40px,rgba(190,110,91,0.1) 41px)" }} />
          <div className="relative z-10 pt-8">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
              Reach Out
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold drop-shadow-sm">
              Get In Touch
            </h1>
            <p className="font-serif italic text-[#7A3D2A] mt-4 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              Our export desk is here to help you finalize bulk requirements, custom manufacturing, and global logistics.
            </p>
            <div aria-hidden="true" className="flex items-center justify-center gap-4 mt-8">
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] animate-pulse">✦</span>
              <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>
          </div>
        </header>

        {/* ── MAIN GRID ── */}
        <div className="cg-wrap">
          <div className="cg-grid">

            {/* ══ LEFT ══ */}
            <section aria-labelledby="contact-info-heading">

              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-3">
                Our Details
              </p>
              <h2 id="contact-info-heading" className="font-display text-3xl md:text-4xl text-[#7A3D2A] font-bold mb-4">
                Let's Connect
              </h2>
              <p className="font-sans text-sm text-[#a07f61] leading-relaxed">
                Whether you're looking for wholesale sourcing, a custom manufacturing partner, or international dispatch details — we're ready to assist.
              </p>
              <div aria-hidden="true" className="w-12 h-[2px] bg-[#BE6E5B] mt-6 mb-8" />

              {/* Contact cards */}
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {contactItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      aria-label={`${item.label}: ${item.line1}`}
                      className="cc-card"
                    >
                      <div className="cc-icon">{item.icon}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold mb-1">
                          {item.label}
                        </p>
                        <p className="font-sans text-sm text-[#7A3D2A] font-semibold break-words">
                          {item.line1}
                        </p>
                        <p className="font-sans text-xs text-[#a07f61] mt-0.5">
                          {item.line2}
                        </p>
                      </div>
                      <span aria-hidden="true" className="text-[#BE6E5B] opacity-40 flex-shrink-0 self-center pl-2 text-lg">›</span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Google Map */}
              <div className="mt-6 rounded-xl overflow-hidden border border-[#BE6E5B]/20 shadow-sm" style={{ height: "220px" }}>
                <iframe
                  title="SANWARIYAS Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.840909565507!2d75.8037149!3d26.8131804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9e20a2334f5%3A0xc54ff6e3604f32dc!2sShiv%20Plaza!5e0!3m2!1sen!2sin!4v1717327318712!5m2!1sen!2sin"
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen={false} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* 24h promise */}
              <aside aria-label="Service Guarantee"
                className="mt-6 relative overflow-hidden rounded-xl border border-[#BE6E5B]/20 bg-white/50 backdrop-blur-md p-6 text-center shadow-sm">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(190,110,91,0.07),transparent_60%)] pointer-events-none" />
                <div aria-hidden="true" className="flex items-center justify-center gap-3 mb-3 relative z-10">
                  <div className="w-8 h-px bg-[#BE6E5B]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#BE6E5B]" />
                  <div className="w-8 h-px bg-[#BE6E5B]" />
                </div>
                <p className="font-display text-lg text-[#7A3D2A] font-bold mb-1 relative z-10">
                  24-Hour Response Guarantee
                </p>
                <p className="font-sans text-xs text-[#a07f61] leading-relaxed relative z-10">
                  We respond to every wholesale inquiry within 24 business hours.
                </p>
              </aside>
            </section>

            {/* ══ RIGHT ══ */}
            <section
              aria-labelledby="inquiry-form-heading"
              className="bg-white/70 backdrop-blur-md border border-[#BE6E5B]/20 rounded-xl shadow-sm p-8 md:p-10"
            >
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-3">
                Trade Inquiry
              </p>
              <h2 id="inquiry-form-heading" className="font-display text-3xl md:text-4xl text-[#7A3D2A] font-bold mb-4">
                Send Your Bulk Inquiry
              </h2>
              <p className="font-sans text-sm text-[#a07f61] leading-relaxed">
                Fill in the form below and our export team will get back to you with custom pricing and availability.
              </p>
              <div aria-hidden="true" className="w-12 h-[2px] bg-[#BE6E5B] mt-6 mb-8" />

              <InquiryForm />
            </section>

          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}