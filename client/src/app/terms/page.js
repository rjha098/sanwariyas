// FILE: client/src/app/terms/page.js
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

//  SEO FIX: Highly optimized Meta Title, Description, Canonical URL, OpenGraph, and Twitter Cards
export const metadata = {
  title: "Terms & Conditions | SANWARIYAS Wholesale Manufacturer",
  description:
    "Review the B2B wholesale, export, and custom manufacturing terms and conditions for SANWARIYAS, India's premium ethnic wear supplier.",

  keywords: [
    "Wholesale Ethnic Wear Terms",
    "B2B Ethnic Wear Supplier",
    "Indian Ethnic Wear Manufacturer",
    "Export Policy",
    "Custom Manufacturing Terms",
  ],

  alternates: { canonical: "https://sanwariyas.com/terms" },
  openGraph: {
    title: "Terms & Conditions | SANWARIYAS Wholesale",
    description:
      "Review the B2B wholesale and export terms for SANWARIYAS ethnic wear.",
    url: "https://sanwariyas.com/terms",
    siteName: "SANWARIYAS",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "https://sanwariyas.com/images/og-terms.png",
        width: 1200,
        height: 630,
        alt: "SANWARIYAS Terms and Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | SANWARIYAS",
    description: "B2B wholesale, export, and custom manufacturing terms.",
    images: ["https://sanwariyas.com/images/og-terms.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const LAST_UPDATED = "1 August 2026";

// ── Section data — replaced with SANWARIYAS's actual wholesale/export policies ──
const SECTIONS = [
  {
    id: "moq",
    num: "1",
    title: "Wholesale Model & Minimum Order Quantity (MOQ)",
    clauses: [
      {
        num: "1.1",
        text: "At SANWARIYAS, we are committed to supporting wholesalers, retailers, boutique owners, and fashion businesses with a flexible and reliable wholesale model.",
      },
      {
        num: "1.2",
        text: (
          <>
            <strong>Wholesale Eligibility:</strong> Minimum wholesale order
            value is <strong>₹10,000–12,000/-</strong>. Orders below ₹10,000
            may not qualify for wholesale pricing.
          </>
        ),
      },
      {
        num: "1.3",
        text: (
          <>
            <strong>Minimum Order Quantity (MOQ):</strong> Our MOQ is designed
            to help businesses start with low inventory risk —{" "}
            <strong>2–3 sets per design</strong>.
          </>
        ),
      },
      {
        num: "1.4",
        text: (
          <>
            Products are supplied in standard wholesale sets. A{" "}
            <strong>5-Piece Set</strong> includes M ×1, L ×1, XL ×1, XXL ×1,
            3XL ×1. A <strong>4-Piece Set</strong> includes M ×1, L ×1, XL
            ×1, XXL ×1.
          </>
        ),
      },
      {
        num: "1.5",
        text: "The available set configuration depends on the design and will be mentioned in the product catalogue.",
      },
      {
        num: "1.6",
        text: "Bulk orders are welcomed and may be eligible for additional pricing benefits. For large-volume orders, export inquiries, or custom manufacturing requirements, our sales team will provide dedicated assistance and pricing.",
      },
      {
        num: "1.7",
        text: "We strive to offer a seamless wholesale experience with premium-quality products, competitive pricing, timely dispatch, and dependable customer support.",
      },
    ],
  },
  {
    id: "shipping",
    num: "2",
    title: "Shipping & Delivery Policy",
    clauses: [
      {
        num: "2.1",
        text: "At SANWARIYAS, we strive to dispatch every order quickly and safely.",
      },
      {
        num: "2.2",
        text: (
          <>
            <strong>Domestic Shipping:</strong> We ship across India through
            trusted logistics partners, including DTDC, Delhivery, Tirupati
            Courier, and other reliable courier partners as required.
          </>
        ),
      },
      {
        num: "2.3",
        text: "Standard delivery time is 4–6 business days, depending on the delivery location. Delivery timelines may be affected due to unforeseen circumstances such as weather conditions, natural calamities, transportation delays, public holidays, or other events beyond our control.",
      },
      {
        num: "2.4",
        text: (
          <>
            <strong>International Shipping:</strong> International orders are
            dispatched within 24–48 business hours after completion of our
            quality inspection and order processing.
          </>
        ),
      },
      {
        num: "2.5",
        text: "We ship through trusted international logistics partners such as Sky Express, Rudransh International, DHL, FedEx, UPS, Aramex, and approved air cargo services. The shipping partner is selected based on the destination country, customs regulations, and shipping requirements.",
      },
      {
        num: "2.6",
        text: "International shipping charges and customs duties will be communicated before dispatch. Depending on the shipping agreement, customs duties may be either included or payable by the buyer.",
      },
    ],
  },
  {
    id: "returns",
    num: "3",
    title: "Return, Refund & Exchange Policy",
    clauses: [
      {
        num: "3.1",
        text: "Customer satisfaction is important to us. Every product undergoes multiple quality inspections before dispatch.",
      },
      {
        num: "3.2",
        text: (
          <>
            <strong>Exchange Policy:</strong> If you receive a product that is
            damaged or has a manufacturing defect, please notify us within{" "}
            <strong>48 hours</strong> of receiving the shipment by sharing
            clear photos or videos. After verification, we will arrange a
            replacement or exchange for the defective item.
          </>
        ),
      },
      {
        num: "3.3",
        text: (
          <>
            <strong>Return Policy:</strong> As we deal in wholesale and
            manufactured products, returns are not accepted.
          </>
        ),
      },
      {
        num: "3.4",
        text: (
          <>
            <strong>Refund Policy:</strong> Refunds are not applicable once
            the order has been dispatched. Refunds will only be considered in
            exceptional cases where SANWARIYAS is unable to fulfil the order,
            or any other circumstances at our discretion.
          </>
        ),
      },
    ],
  },
  {
    id: "export",
    num: "4",
    title: "Export Policy",
    clauses: [
      {
        num: "4.1",
        text: "SANWARIYAS proudly supplies premium women's ethnic wear to retailers, wholesalers, distributors, and businesses worldwide.",
      },
      {
        num: "4.2",
        text: "International orders are dispatched within 24–48 business hours after successful quality inspection and order processing.",
      },
      {
        num: "4.3",
        text: "Export shipments are handled through trusted international logistics partners. Shipping timelines vary depending on the destination country and customs clearance.",
      },
      {
        num: "4.4",
        text: "Import duties, taxes, and local customs charges are determined by the destination country's regulations and will be communicated where applicable.",
      },
      {
        num: "4.5",
        text: "Buyers are responsible for complying with the import regulations of their respective countries unless otherwise agreed in writing.",
      },
    ],
  },
  {
    id: "cancellation",
    num: "5",
    title: "Cancellation Policy",
    clauses: [
      {
        num: "5.1",
        text: "Orders are confirmed only after the required advance payment or token amount is received.",
      },
      {
        num: "5.2",
        text: "Once an order is confirmed, the token amount is non-refundable.",
      },
      {
        num: "5.3",
        text: "Confirmed orders cannot be cancelled once production or dispatch processing has started.",
      },
      {
        num: "5.4",
        text: (
          <>
            Orders may be kept on hold for a maximum of{" "}
            <strong>2–3 days</strong> if the advance payment has not been
            received. If payment is not received within this period, the
            order will be automatically cancelled without prior notice.
          </>
        ),
      },
    ],
  },
  {
    id: "quality",
    num: "6",
    title: "Quality Assurance Policy",
    clauses: [
      {
        num: "6.1",
        text: "Quality is at the heart of everything we manufacture. Every garment undergoes a rigorous 3-Step Quality Control (QC) Process before dispatch.",
      },
      {
        num: "6.2",
        text: (
          <>
            <strong>1. Manufacturing Inspection:</strong> Each product is
            checked during production to ensure accurate stitching, fabric
            quality, measurements, and finishing.
          </>
        ),
      },
      {
        num: "6.3",
        text: (
          <>
            <strong>2. Packing Inspection:</strong> Before packaging, every
            piece is inspected again for cleanliness, presentation, and
            overall quality.
          </>
        ),
      },
      {
        num: "6.4",
        text: (
          <>
            <strong>3. Dispatch Inspection:</strong> A final quality check is
            conducted before shipment to ensure only approved products leave
            our facility.
          </>
        ),
      },
      {
        num: "6.5",
        text: "For export shipments, we perform an additional quality inspection before dispatch to ensure international quality standards are met.",
      },
      {
        num: "6.6",
        text: "Our quality process ensures that every order reflects the craftsmanship and reliability SANWARIYAS is known for.",
      },
    ],
  },
  {
    id: "payment",
    num: "7",
    title: "Payment Policy",
    clauses: [
      {
        num: "7.1",
        text: "SANWARIYAS operates on a 100% advance payment basis unless otherwise agreed in writing.",
      },
      {
        num: "7.2",
        text: "Once your order is confirmed, payment can be made through UPI (PhonePe, Google Pay, Paytm), Bank Transfer (NEFT/RTGS/IMPS), Net Banking, Cash Deposit, Cheque (subject to clearance), International Bank Transfer (Wire Transfer), or Foreign Remittance (credited in INR).",
      },
      {
        num: "7.3",
        text: "Orders will be processed only after the payment has been successfully received and verified.",
      },
      {
        num: "7.4",
        text: "For international buyers, all foreign remittances must comply with applicable RBI and banking regulations.",
      },
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
        {/* ✅ SEO FIX: Added descriptive title attribute */}
        <Link
          href="/contact"
          title="Contact SANWARIYAS Administrative Desk"
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
    <>
      {/* ✅ SEO FIX: Added WebPage schema for Trust/EEAT Signals */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Terms and Conditions | SANWARIYAS",
              description:
                "Wholesale, export, and manufacturing terms and conditions for SANWARIYAS premium ethnic wear.",
              url: "https://sanwariyas.com/terms",
              inLanguage: "en-IN",
              datePublished: "2026-06-20",
              dateModified: "2026-06-20",

              publisher: {
                "@type": "Organization",
                name: "SANWARIYAS",
                url: "https://sanwariyas.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://sanwariyas.com/images/logooo.png",
                },
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
                  item: "https://sanwariyas.com/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Terms & Conditions",
                  item: "https://sanwariyas.com/terms",
                },
              ],
            },
          ]),
        }}
      />
      {/* ✅ A11Y FIX: Added id="main-content" for accessibility best practices */}
      <main
        id="main-content"
        className="flex min-h-screen flex-col bg-[#FDF7F2]"
      >
        <Navbar />

        {/* ── Page Header ── */}
        <section
          className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)",
              backgroundSize: "30px 30px",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
          />

          {/* Corner brackets — matches FAQ section styling language for site consistency */}
          {[
            ["top-5 left-5", "rotate-0"],
            ["top-5 right-5", "rotate-90"],
          ].map(([pos, rot], i) => (
            <svg
              key={i}
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 36 36"
              fill="none"
              className={`absolute ${pos} ${rot} opacity-[0.18] hidden md:block`}
            >
              <path
                d="M3 3 L33 3 L33 7 M3 3 L3 33 L7 33"
                stroke="#BE6E5B"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
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
            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-4 mt-6"
            >
              <div className="h-[2px] w-12 md:w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-sm animate-pulse">✦</span>
              <div className="h-[2px] w-12 md:w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>
            <p className="font-serif italic text-[#a07f61] mt-6 text-sm md:text-base max-w-2xl mx-auto font-medium">
              These Terms govern all wholesale trade, custom manufacturing, and
              global export engagements with SANWARIYAS.
            </p>

            {/* Last updated + document meta strip */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-7 font-sans text-[11px] text-[#a07f61]">
              <span className="inline-flex items-center gap-1.5">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#BE6E5B"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                Last Updated:{" "}
                <strong className="text-[#7A3D2A]">{LAST_UPDATED}</strong>
              </span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#BE6E5B]/40" />
              <span>7 Sections</span>
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
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#BE6E5B"
                    strokeWidth="2"
                    className="flex-shrink-0 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <p className="font-sans text-[13px] text-[#a07f61] leading-relaxed">
                    Please read these Terms and Conditions carefully. They
                    constitute a legally binding agreement between you (the
                    "Buyer") and SANWARIYAS for any wholesale, export, or custom
                    manufacturing engagement.
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
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="M2 7l10 6 10-6" />
                        </svg>
                      </span>
                      <h2 className="font-display text-xl md:text-2xl text-[#7A3D2A] font-bold">
                        Contact & Administrative Desk
                      </h2>
                    </div>
                    <p className="font-sans text-[14px] text-[#a07f61] leading-relaxed mb-4">
                      For legal queries, clause clarifications, or formal
                      correspondence regarding these Terms, please reach our
                      administrative desk:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/70 border border-[#BE6E5B]/15">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#BE6E5B"
                          strokeWidth="2"
                          className="flex-shrink-0"
                        >
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="M2 7l10 6 10-6" />
                        </svg>
                        <div>
                          <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#BE6E5B] font-bold m-0">
                            Email
                          </p>
                          <p className="font-sans text-[13px] text-[#7A3D2A] font-semibold m-0">
                            hrsanwariyas@gmail.com
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/70 border border-[#BE6E5B]/15">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#BE6E5B"
                          strokeWidth="2"
                          className="flex-shrink-0"
                        >
                          <path
                            d="M3 2.5h3l1 3-1.5 1a8 8 0 003 3l1-1.5 3 1v3A1.5 1.5 0 0112 13 9.5 9.5 0 012.5 4 1.5 1.5 0 014 2.5H3z"
                            transform="scale(1.3)"
                          />
                        </svg>
                        <div>
                          <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#BE6E5B] font-bold m-0">
                            Phone / WhatsApp
                          </p>
                          <p className="font-sans text-[13px] text-[#7A3D2A] font-semibold m-0">
                            +91 9680812813
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>

                {/* ── CTA Block ── */}
                <div className="mt-12 text-center">
                  {/* ✅ SEO FIX: Added descriptive title attribute */}
                  <Link
                    href="/contact"
                    title="Contact SANWARIYAS for Wholesale Inquiries"
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
    </>
  );
}