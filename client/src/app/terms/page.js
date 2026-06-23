// FILE: client/src/app/terms/page.js
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions - Sanwariyas",
  description: "Wholesale, export, and manufacturing terms and conditions for Sanwariyas premium ethnic wear.",
};

const LAST_UPDATED = "20 June 2026";

// ── Section data — numbered clause format used in B2B/export legal docs ──────
const SECTIONS = [
  {
    id: "definitions",
    num: "1",
    title: "Definitions & Interpretation",
    clauses: [
      { num: "1.1", text: <>In these Terms, <strong>"SANWARIYAS"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, or <strong>"our"</strong> refers to the Sanwariyas export house and its authorized representatives.</> },
      { num: "1.2", text: <><strong>"Buyer"</strong>, <strong>"you"</strong>, or <strong>"Client"</strong> refers to the business entity, retailer, distributor, or individual placing a wholesale or custom manufacturing inquiry.</> },
      { num: "1.3", text: <><strong>"Goods"</strong> refers to all ethnic wear products, fabrics, and accessories manufactured, sold, or exported by SANWARIYAS.</> },
      { num: "1.4", text: <><strong>"MOQ"</strong> means Minimum Order Quantity, the smallest unit volume accepted per style or category.</> },
      { num: "1.5", text: <><strong>"Order Confirmation"</strong> means the written or email acknowledgment issued by SANWARIYAS confirming acceptance of a Buyer's purchase order.</> },
    ],
  },
  {
    id: "general",
    num: "2",
    title: "General Agreement & Scope",
    clauses: [
      { num: "2.1", text: "By accessing this website, submitting a wholesale inquiry, or confirming a bulk order, the Buyer agrees to be legally bound by these Terms and Conditions in their entirety." },
      { num: "2.2", text: "These Terms govern all B2B transactions, international export shipments, and custom/OEM manufacturing engagements between the Buyer and SANWARIYAS." },
      { num: "2.3", text: "SANWARIYAS reserves the right to amend these Terms at any time. Continued use of our services after such amendments constitutes acceptance of the revised Terms." },
      { num: "2.4", text: "These Terms supersede any prior verbal or written agreements unless explicitly stated otherwise in a signed Order Confirmation." },
    ],
  },
  {
    id: "moq",
    num: "3",
    title: "Wholesale Model & Minimum Order Quantity",
    clauses: [
      { num: "3.1", text: "SANWARIYAS operates strictly on a Business-to-Business (B2B) wholesale model and does not service single-unit retail consumers." },
      { num: "3.2", text: <>The standard Minimum Order Quantity (<strong>MOQ</strong>) is <strong>50 pieces</strong> per style, design, or category, unless otherwise agreed in writing.</> },
      { num: "3.3", text: "Single-piece or sub-MOQ requests will only be entertained as a paid commercial evaluation sample, subject to Clause 7." },
      { num: "3.4", text: "Bulk pricing is volume-tiered. Final unit pricing is determined by the total confirmed order quantity and is communicated in the formal quotation." },
    ],
  },
  {
    id: "pricing",
    num: "4",
    title: "Pricing, Quotations & Payment Terms",
    clauses: [
      { num: "4.1", text: "All prices quoted are Ex-Works (EXW) unless otherwise specified, and are exclusive of international freight, insurance, customs duties, and local taxes." },
      { num: "4.2", text: "Quotations remain valid for 7 business days from the date of issue unless extended in writing by SANWARIYAS." },
      { num: "4.3", text: <>A minimum advance payment of <strong>50% of the total order value</strong> is required to initiate production or reserve ready inventory.</> },
      { num: "4.4", text: "The remaining balance, along with finalized shipping and insurance costs, must be cleared in full prior to final dispatch of Goods." },
      { num: "4.5", text: "Accepted payment methods include SWIFT wire transfer, NEFT, RTGS, and other corporate banking instruments as mutually agreed." },
      { num: "4.6", text: "Bank transaction charges, currency conversion fees, and intermediary bank costs are borne solely by the Buyer." },
    ],
  },
  {
    id: "shipping",
    num: "5",
    title: "Shipping, Export & Customs Compliance",
    clauses: [
      { num: "5.1", text: "Ready inventory is dispatched within 5–7 business days of payment confirmation. Custom manufacturing orders require 15–21 business days depending on production load and design complexity." },
      { num: "5.2", text: "SANWARIYAS provides standard export documentation including Commercial Invoice, Packing List, and Certificate of Origin." },
      { num: "5.3", text: "The Buyer (importer of record) is solely responsible for import duties, customs clearance procedures, and applicable local taxes in the destination country." },
      { num: "5.4", text: "Title and risk of loss in the Goods passes to the Buyer upon handover to the designated freight carrier, unless a different Incoterm is agreed in writing." },
      { num: "5.5", text: "SANWARIYAS is not liable for delays caused by customs authorities, carrier disruptions, or force majeure events as defined in Clause 10." },
    ],
  },
  {
    id: "returns",
    num: "6",
    title: "Quality Claims, Returns & Exchanges",
    clauses: [
      { num: "6.1", text: "Owing to the wholesale and made-to-order nature of our business, SANWARIYAS enforces a strict B2B claims policy in lieu of consumer-style returns." },
      { num: "6.2", text: "Claims are accepted exclusively for verifiable major manufacturing defects affecting stitching integrity, fabric structure, or functional usability." },
      { num: "6.3", text: <>All defect claims must be raised in writing with clear photographic or video evidence within <strong>48 hours</strong> of shipment receipt.</> },
      { num: "6.4", text: "Minor color variation arising from digital photography, monitor calibration, or natural dye-lot differences does not constitute a valid defect." },
      { num: "6.5", text: "Approved claims will be resolved via replacement, credit note, or partial refund at SANWARIYAS's sole discretion." },
    ],
  },
  {
    id: "custom",
    num: "7",
    title: "Custom Manufacturing, OEM & Private Label",
    clauses: [
      { num: "7.1", text: "For custom design, exclusive prints, or private-label production, all tech packs, brand assets, and design files supplied by the Buyer remain the Buyer's intellectual property." },
      { num: "7.2", text: "SANWARIYAS will not reproduce, resell, or distribute Buyer-supplied private label designs to any third party." },
      { num: "7.3", text: "Custom orders are deemed final and non-cancellable once fabric cutting, dyeing, or production has commenced." },
      { num: "7.4", text: "Sample approval timelines, revision rounds, and tooling costs (if applicable) will be communicated separately in the production agreement for each custom order." },
    ],
  },
  {
    id: "ip",
    num: "8",
    title: "Intellectual Property",
    clauses: [
      { num: "8.1", text: "All original designs, catalogues, photography, and branding created by SANWARIYAS remain the exclusive intellectual property of SANWARIYAS." },
      { num: "8.2", text: "Buyers may not reproduce, resell, or claim authorship of SANWARIYAS's proprietary designs outside the scope of an agreed private-label arrangement." },
    ],
  },
  {
    id: "liability",
    num: "9",
    title: "Limitation of Liability",
    clauses: [
      { num: "9.1", text: "SANWARIYAS's total liability arising from any order shall not exceed the total invoice value of that specific order." },
      { num: "9.2", text: "SANWARIYAS shall not be liable for any indirect, incidental, or consequential losses, including loss of profit, business opportunity, or goodwill, arising from the use or resale of the Goods." },
      { num: "9.3", text: "Nothing in these Terms limits liability that cannot lawfully be excluded under applicable Indian law." },
    ],
  },
  {
    id: "force-majeure",
    num: "10",
    title: "Force Majeure",
    clauses: [
      { num: "10.1", text: "SANWARIYAS shall not be held responsible for delays or failure to perform obligations caused by events beyond its reasonable control, including but not limited to natural disasters, strikes, port congestion, customs delays, war, or governmental restrictions." },
      { num: "10.2", text: "In such events, delivery timelines will be extended for a reasonable period commensurate with the disruption, and the Buyer will be notified at the earliest opportunity." },
    ],
  },
  {
    id: "governing-law",
    num: "11",
    title: "Governing Law & Jurisdiction",
    clauses: [
      { num: "11.1", text: "These Terms are governed by and construed in accordance with the laws of India." },
      { num: "11.2", text: <>Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in <strong>Jaipur, Rajasthan, India</strong>.</> },
      { num: "11.3", text: "Both parties agree to first attempt resolution through good-faith negotiation before pursuing formal legal proceedings." },
    ],
  },
];

// ── Sidebar Table of Contents (sticky, desktop only) ──────────────────────────
function TableOfContents() {
  return (
    <nav
      aria-label="Terms and Conditions sections"
      className="hidden lg:block sticky top-28 self-start w-64 flex-shrink-0"
    >
      <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold mb-4 px-1">
        On This Page
      </p>
      <ul className="space-y-1 border-l-2 border-[#BE6E5B]/15 pl-0 list-none">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="group flex items-start gap-2.5 py-1.5 px-3 -ml-px border-l-2 border-transparent hover:border-[#BE6E5B] transition-colors duration-200"
            >
              <span className="font-sans text-[11px] font-bold text-[#BE6E5B]/60 group-hover:text-[#BE6E5B] mt-0.5 flex-shrink-0">
                {s.num}
              </span>
              <span className="font-sans text-[12.5px] text-[#a07f61] group-hover:text-[#7A3D2A] leading-snug transition-colors duration-200">
                {s.title}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-6 p-4 rounded-xl bg-[#FAF3E8] border border-[#BE6E5B]/15">
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#BE6E5B] font-bold mb-1">
          Questions?
        </p>
        <p className="font-sans text-[11.5px] text-[#a07f61] leading-relaxed mb-3">
          Reach our administrative desk for legal clarifications.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 font-sans text-[11px] font-bold text-[#7A3D2A] hover:text-[#BE6E5B] transition-colors"
        >
          Contact Us <span aria-hidden="true">→</span>
        </Link>
      </div>
    </nav>
  );
}

// ── Mobile-only quick jump dropdown (since sidebar TOC is desktop-only) ──────
function MobileJumpMenu() {
  return (
    <div className="lg:hidden mb-8 rounded-xl border border-[#BE6E5B]/20 bg-[#FAF3E8] p-4">
      <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold mb-3">
        Jump to Section
      </p>
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#BE6E5B]/20 font-sans text-[11px] font-semibold text-[#7A3D2A] hover:bg-[#BE6E5B] hover:text-white hover:border-[#BE6E5B] transition-colors duration-200"
          >
            <span className="text-[#BE6E5B]/70">{s.num}.</span> {s.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#FDF7F2]">
      <Navbar />

      {/* ── Page Header ── */}
      <section
        className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)" }}
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)", backgroundSize: "30px 30px" }} />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />

        {/* Corner brackets — matches FAQ section styling language for site consistency */}
        {[
          ["top-5 left-5", "rotate-0"],
          ["top-5 right-5", "rotate-90"],
        ].map(([pos, rot], i) => (
          <svg key={i} aria-hidden="true" width="32" height="32" viewBox="0 0 36 36" fill="none" className={`absolute ${pos} ${rot} opacity-[0.18] hidden md:block`}>
            <path d="M3 3 L33 3 L33 7 M3 3 L3 33 L7 33" stroke="#BE6E5B" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="3" cy="3" r="2" fill="#BE6E5B" />
          </svg>
        ))}

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#BE6E5B] font-bold mb-4">
            Legal & Policies
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] font-bold leading-tight drop-shadow-sm">
            Terms & Conditions
          </h1>
          <div aria-hidden="true" className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-12 md:w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
            <span className="text-[#BE6E5B] text-sm animate-pulse">✦</span>
            <div className="h-[2px] w-12 md:w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
          </div>
          <p className="font-serif italic text-[#a07f61] mt-6 text-sm md:text-base max-w-2xl mx-auto font-medium">
            These Terms govern all wholesale trade, custom manufacturing, and global export engagements with SANWARIYAS.
          </p>

          {/* Last updated + document meta strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-7 font-sans text-[11px] text-[#a07f61]">
            <span className="inline-flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BE6E5B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Last Updated: <strong className="text-[#7A3D2A]">{LAST_UPDATED}</strong>
            </span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#BE6E5B]/40" />
            <span>11 Sections</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#BE6E5B]/40" />
            <span>Governing Law: India</span>
          </div>
        </div>
      </section>

      {/* ── Content Section ── */}
      <section className="relative py-16 md:py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12">

            <TableOfContents />

            <div className="flex-1 min-w-0 max-w-4xl">
              <MobileJumpMenu />

              {/* Intro card */}
              <div className="mb-8 p-5 rounded-xl bg-white/70 backdrop-blur-md border border-[#BE6E5B]/20 flex items-start gap-3.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BE6E5B" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                <p className="font-sans text-[13px] text-[#a07f61] leading-relaxed">
                  Please read these Terms and Conditions carefully. They constitute a legally binding agreement between you (the "Buyer") and SANWARIYAS for any wholesale, export, or custom manufacturing engagement.
                </p>
              </div>

              {/* Numbered sections */}
              <div className="space-y-10">
                {SECTIONS.map((section) => (
                  <article
                    key={section.id}
                    id={section.id}
                    className="bg-white/60 backdrop-blur-md border border-[#BE6E5B]/20 rounded-2xl p-7 md:p-9 shadow-[0_8px_30px_rgba(122,61,42,0.06)] scroll-mt-28"
                  >
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#BE6E5B]/15">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#7A3D2A] to-[#BE6E5B] flex items-center justify-center font-display font-bold text-white text-sm">
                        {section.num}
                      </span>
                      <h2 className="font-display text-xl md:text-2xl text-[#7A3D2A] font-bold leading-snug">
                        {section.title}
                      </h2>
                    </div>

                    <ol className="space-y-4 list-none">
                      {section.clauses.map((clause) => (
                        <li key={clause.num} className="flex gap-4">
                          <span className="font-sans text-[12px] font-bold text-[#BE6E5B]/70 flex-shrink-0 mt-0.5 w-10">
                            {clause.num}
                          </span>
                          <p className="font-sans text-[14px] md:text-[15px] text-[#5C3120] leading-relaxed m-0">
                            {clause.text}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}

                {/* Contact / closing card */}
                <article className="bg-[#FAF3E8] border border-[#BE6E5B]/25 rounded-2xl p-7 md:p-9">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#7A3D2A] flex items-center justify-center text-white">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>
                    </span>
                    <h2 className="font-display text-xl md:text-2xl text-[#7A3D2A] font-bold">
                      Contact & Administrative Desk
                    </h2>
                  </div>
                  <p className="font-sans text-[14px] text-[#a07f61] leading-relaxed mb-4">
                    For legal queries, clause clarifications, or formal correspondence regarding these Terms, please reach our administrative desk:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/70 border border-[#BE6E5B]/15">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BE6E5B" strokeWidth="2" className="flex-shrink-0"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>
                      <div>
                        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#BE6E5B] font-bold m-0">Email</p>
                        <p className="font-sans text-[13px] text-[#7A3D2A] font-semibold m-0">hrsanwariyas@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/70 border border-[#BE6E5B]/15">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BE6E5B" strokeWidth="2" className="flex-shrink-0"><path d="M3 2.5h3l1 3-1.5 1a8 8 0 003 3l1-1.5 3 1v3A1.5 1.5 0 0112 13 9.5 9.5 0 012.5 4 1.5 1.5 0 014 2.5H3z" transform="scale(1.3)"/></svg>
                      <div>
                        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#BE6E5B] font-bold m-0">Phone / WhatsApp</p>
                        <p className="font-sans text-[13px] text-[#7A3D2A] font-semibold m-0">+91 9680812813</p>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* ── CTA Block ── */}
              <div className="mt-12 text-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-[#BE6E5B]/40 bg-[#FAF3E8] text-[#7A3D2A] font-sans text-xs tracking-[0.2em] uppercase font-bold px-8 py-4 rounded-xl hover:bg-[#BE6E5B] hover:text-white transition-all duration-300 shadow-sm"
                >
                  Have Questions? Contact Us
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}