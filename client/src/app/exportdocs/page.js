// FILE: client/src/components/home/CertificatesSection.js

"use client";

const CERTIFICATES = [
  {
    id: "gst",
    title: "GST Registration Certificate",
    subtitle: "Government of India",
    desc: "Officially registered manufacturer and supplier under the Goods and Services Tax act.",
    // Next.js access files in the public folder directly from the root path
    pdfSrc: "/images/certificates/New RC.pdf",
  },
  {
    id: "lut",
    title: "Export LUT Acknowledgment",
    subtitle: "Letter of Undertaking",
    desc: "Authorized for international B2B exports without payment of IGST under official compliance.",
    pdfSrc: "/images/certificates/ACKNOWLEDGEMENT GST RFD -11-3.pdf",
  },
];

export default function CertificatesSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#FDF7F2] to-[#F5E8D8]">
      {/* Background Textures */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="mb-14 md:mb-20">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
            Official Accreditations
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#7A3D2A] leading-tight">
            Government Compliances &amp; Export Licenses
          </h2>
          <div
            aria-hidden="true"
            className="flex items-center justify-center gap-4 mt-6"
          >
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
            <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
            <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
          </div>
          <p className="mt-6 max-w-2xl mx-auto text-[#a07f61] font-medium leading-relaxed">
            We operate with complete transparency. SANWARIYAS is a fully
            compliant entity authorized for domestic wholesale and global
            exports.
          </p>
        </div>

        {/* Certificates Grid - Changed to Clickable PDF Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-4xl mx-auto">
          {CERTIFICATES.map((cert) => (
            <a
              key={cert.id}
              href={cert.pdfSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group cursor-pointer"
              aria-label={`Open ${cert.title} PDF document`}
            >
              {/* Clean Document Card Design */}
              <div className="relative w-full max-w-[280px] aspect-[4/3] bg-white rounded-xl shadow-[0_10px_30px_rgba(122,61,42,0.08)] p-6 border border-[#BE6E5B]/20 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(122,61,42,0.15)] flex flex-col items-center justify-center gap-5">
                {/* Document SVG Icon */}
                <div className="w-20 h-20 rounded-full bg-[#FDF7F2] flex items-center justify-center border border-[#BE6E5B]/20 group-hover:bg-[#BE6E5B] transition-colors duration-500">
                  <svg
                    className="w-10 h-10 text-[#BE6E5B] group-hover:text-white transition-colors duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-[#7A3D2A] border border-[#7A3D2A]/20 px-5 py-2.5 rounded-full group-hover:border-[#BE6E5B] group-hover:text-[#BE6E5B] transition-colors duration-300">
                  View PDF Document
                </span>
              </div>

              {/* Document Details */}
              <div className="mt-8 text-center px-4">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#BE6E5B]">
                  {cert.subtitle}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#7A3D2A] mt-2 mb-3 group-hover:text-[#BE6E5B] transition-colors duration-300">
                  {cert.title}
                </h3>
                <p className="font-sans text-[13px] text-[#a07f61] leading-relaxed max-w-[280px] mx-auto">
                  {cert.desc}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Trust & Compliance Disclaimer */}
        <div className="mt-16 md:mt-24 p-5 rounded-2xl bg-white/40 border border-[#BE6E5B]/15 backdrop-blur-sm max-w-3xl mx-auto flex items-start gap-4 text-left shadow-sm">
          <svg
            className="w-6 h-6 text-[#BE6E5B] shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <p className="font-sans text-[12px] md:text-[13px] text-[#7A3D2A] leading-relaxed font-medium">
            <strong className="text-[#5C3120]">Trust & Compliance: </strong>
            We believe in 100% transparency with our global B2B partners. The
            certificates linked above are our official government registrations.
            Additional compliance records and export licenses are gladly shared
            with verified buyers upon direct request.
          </p>
        </div>
      </div>
    </section>
  );
}
