// app/contact/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InquiryForm from "@/components/ui/InquiryForm";

// ✅ SEO: Metadata is already well-defined
export const metadata = {
  title: "Contact & Inquiry | SANWARIYAS Ethnic Luxury",
  description:
    "Get in touch with SANWARIYAS for product inquiries, custom orders, and bridal consultations.",
  alternates: { canonical: "/contact" },
};

// ── NEW EARTHY COLOR PALETTE ────────────────────────────────
// Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
// Headings/Active: #7A3D2A (Dark Burnt)
// Default Text: #a07f61 (Warm Brown)
// Accents: #BE6E5B (Terracotta)
// ────────────────────────────────────────────────────────────

const contactItems = [
  {
    label: "Visit Us",
    line1:
      "Shop no.- 12,13 , 1st floor, Shiv plaza, near HDFC bank, Printers Colony, Dada Gurudev Nagar, Sanganer",
    line2: "Jaipur, Rajasthan 302029",
    icon: (
      // ✅ A11Y: Added aria-hidden and focusable to decorative SVGs
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        fill="none"
        stroke="#BE6E5B"
        strokeWidth="1.2"
        className="w-5 h-5"
      >
        <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5z" />
        <circle cx="8" cy="6" r="1.5" />
      </svg>
    ),
  },
  {
    label: "Call Us",
    line1: "+91 9680812813",
    line2: "Mon – Sat: 10am – 7pm",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        fill="none"
        stroke="#BE6E5B"
        strokeWidth="1.2"
        className="w-5 h-5"
      >
        <path d="M3 2.5h3l1 3-1.5 1a8 8 0 003 3l1-1.5 3 1v3A1.5 1.5 0 0112 13 9.5 9.5 0 012.5 4 1.5 1.5 0 014 2.5H3z" />
      </svg>
    ),
  },
  {
    label: "Email Us",
    line1: "hrsanwariyas@gmail.com",
    line2: "We respond within 24 hours",
    icon: (
      <svg
        aria-hidden="true"  
        focusable="false"
        viewBox="0 0 16 16"
        fill="none"
        stroke="#BE6E5B"
        strokeWidth="1.2"
        className="w-5 h-5"
      >
        <rect x="1.5" y="3.5" width="13" height="9" rx="1" />
        <path d="M1.5 5l6.5 4 6.5-4" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    line1: "+91 9680812813",
    line2: "Quick responses on WhatsApp",
    icon: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        fill="none"
        stroke="#BE6E5B"
        strokeWidth="1.2"
        className="w-5 h-5"
      >
        <path d="M13.5 11.5l-2-2a1 1 0 00-1.4 0l-.8.8a7.4 7.4 0 01-3.6-3.6l.8-.8a1 1 0 000-1.4l-2-2a1 1 0 00-1.4 0C1.5 4 2 9 6.5 11.5S14 14.5 13.5 11.5z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />

      {/* ✅ A11Y: Added id="main-content" for "skip to main content" accessibility */}
      <main
        id="main-content"
        className="min-h-screen pt-32 pb-24 flex flex-col"
        style={{
          background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
        }}
      >
        {/* Hero Section */}
        <header className="relative overflow-hidden mb-12">
          {/* Faint Grid Pattern */}
          {/* ✅ A11Y: Hidden decorative element */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(190,110,91,0.1) 40px,rgba(190,110,91,0.1) 41px)",
            }}
          />
          <div className="relative z-10 text-center px-4 pt-10">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] md:tracking-[0.8em] uppercase text-[#BE6E5B] font-bold mb-4">
              Reach Out
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold tracking-wide drop-shadow-sm">
              Get In Touch
            </h1>
            <p className="font-serif italic text-[#7A3D2A] mt-4 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              Our style consultants are here to help you find the perfect
              ensemble for every occasion.
            </p>
            {/* ✅ A11Y: Hidden decorative line */}
            <div aria-hidden="true" className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#BE6E5B] to-transparent mx-auto mt-8" />
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left — Contact Info */}
            {/* ✅ A11Y & SEO: Wrapped in a semantic <section> linked to the heading */}
            <section aria-labelledby="contact-info-heading" className="lg:col-span-2 flex flex-col">
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-3">
                Our Details
              </p>
              <h2 id="contact-info-heading" className="font-display text-3xl md:text-4xl text-[#7A3D2A] font-bold mb-4">
                Let's Connect
              </h2>
              <p className="font-sans text-sm text-[#a07f61] leading-relaxed mb-8">
                Whether you're looking for a bridal ensemble, a festive outfit,
                or a custom creation — we're here to make your vision a reality.
              </p>

              {/* Contact Cards */}
              {/* ✅ A11Y & SEO: Converted div to semantic <ul> for lists */}
              <ul aria-label="Contact Methods" className="flex flex-col gap-3">
                {contactItems.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start gap-4 p-5 bg-white/60 backdrop-blur-sm border border-[#BE6E5B]/20 rounded-md hover:border-[#BE6E5B]/60 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 flex-shrink-0 bg-white border border-[#BE6E5B]/40 rounded-full flex items-center justify-center group-hover:bg-[#BE6E5B]/10 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold mb-1">
                        {item.label}
                      </p>
                      <p className="font-sans text-sm text-[#7A3D2A] font-semibold">
                        {item.line1}
                      </p>
                      <p className="font-sans text-xs text-[#a07f61] mt-0.5">
                        {item.line2}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Promise box */}
              <aside aria-label="Service Guarantee" className="mt-8 bg-white/50 backdrop-blur-md p-8 text-center rounded-md shadow-sm border border-[#BE6E5B]/20 relative overflow-hidden">
                {/* ✅ A11Y: Hidden decorative graphics */}
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(190,110,91,0.08),transparent_60%)] pointer-events-none" />
                <div aria-hidden="true" className="flex items-center justify-center gap-3 mb-4 relative z-10">
                  <div className="w-8 h-px bg-[#BE6E5B]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#BE6E5B]" />
                  <div className="w-8 h-px bg-[#BE6E5B]" />
                </div>
                <p className="font-display text-xl text-[#7A3D2A] font-bold mb-2 relative z-10">
                  24-Hour Response
                </p>
                <p className="font-sans text-xs text-[#a07f61] leading-relaxed relative z-10">
                  We guarantee a response to every inquiry within 24 business
                  hours.
                </p>
              </aside>
            </section>

            {/* Right — Form */}
            {/* ✅ A11Y & SEO: Wrapped in a semantic <section> linked to the heading */}
            <section aria-labelledby="inquiry-form-heading" className="lg:col-span-3 bg-white/70 backdrop-blur-md border border-[#BE6E5B]/20 p-8 md:p-12 rounded-lg shadow-sm">
              <h2 id="inquiry-form-heading" className="font-display text-3xl text-[#7A3D2A] font-bold mb-3">
                Send Your Inquiry
              </h2>
              <p className="font-sans text-sm text-[#a07f61] mb-2">
                Fill in the form below and our team will get back to you with
                pricing and availability.
              </p>
              {/* ✅ A11Y: Hidden decorative line */}
              <div aria-hidden="true" className="w-12 h-[2px] bg-[#BE6E5B] mt-6 mb-8" />

              {/* Note: Ensure InquiryForm component internally uses styles compatible with light backgrounds */}
              <InquiryForm />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}