// FILE: client/src/components/home/FaqSection.js
"use client";

import { useState } from "react";
import Link from "next/link";

// ── COLOR PALETTE ────────────────────────────────
// Background : #FDF7F2 to #F2D9C3 (Light Cream to Pumpkin Essence)
// Headings   : #7A3D2A  (Dark Burnt)
// Body text  : #a07f61  (Warm Brown)
// Accent     : #BE6E5B  (Terracotta)
// ─────────────────────────────────────────────────

// ✅ SEO FIX: Naturally injected primary B2B and Manufacturer keywords into FAQ answers for Topical Authority
const BUILT_IN_FAQS = [
  {
    name: "How do I place an order at SANWARIYAS?",
    acceptedAnswer: {
      text: "Simply browse our wholesale catalogue of Cotton Suits and Kurtis, select the styles you want to source, and fill out the bulk inquiry form with your requirements — quantity, size distribution, and international shipping address. Our export desk will get back to you within 24 hours with a custom proposal quote.",
    },
    category: "Ordering",
  },
  {
    name: "Do you offer customization on ethnic wear?",
    acceptedAnswer: {
      text: "Yes — as a premier Jaipur Ethnic Wear Manufacturer, we offer full contract manufacturing support including custom fabric selection, custom size specifications, custom embroidery, print production, and private label/OEM solutions. Detail your specifications in the B2B inquiry form.",
    },
    category: "Customization",
  },
  {
    name: "What is the delivery timeline?",
    acceptedAnswer: {
      text: "Ready inventory lots are dispatched within 5–7 business days. Custom commercial manufacturing orders typically require 15–21 business days based on manufacturing load and design complexity. Timelines are committed upfront before booking.",
    },
    category: "Shipping",
  },
  {
    name: "What is the minimum order quantity (MOQ)?",
    acceptedAnswer: {
      text: "Our wholesale MOQ starts strictly at 50 pieces per style. This helps boutique owners, international retailers, and commercial distributors scale up inventory efficiently. Better container pricing applies to larger order volumes.",
    },
    category: "Ordering",
  },
  {
    name: "What fabrics do you work with?",
    acceptedAnswer: {
      text: "We specialize in export-grade Cotton, Georgette, Pure Silk, Rayon, Chanderi, Tussar Silk, Velvet, Net, and high-durability mixed blends perfect for B2B Ethnic Wear Suppliers. Every lot is checked thoroughly for colorfastness and stitching tensile strength.",
    },
    category: "Products",
  },
  {
    name: "Do you ship internationally?",
    acceptedAnswer: {
      text: "Yes. As a leading Cotton Clothing Exporter India, we export worldwide to over 50+ countries including the USA, UK, UAE, Canada, and Australia. All global export shipments are fully cargo-insured, securely crated or packed, and freight-forwarded via trackable global carrier services.",
    },
    category: "Shipping",
  },
  {
    name: "Can I get a sample before placing a bulk order?",
    acceptedAnswer: {
      text: "Yes, evaluation sample pieces can be ordered to check stitching quality and fabric specifications. Samples are charged at commercial prototype rates plus shipping costs, which are fully adjusted when your bulk order invoice is generated.",
    },
    category: "Ordering",
  },
  {
    name: "What payment methods do you accept?",
    acceptedAnswer: {
      text: "We process payments via secure corporate Bank Wire Transfers (SWIFT / International Telegraphic Transfers), NEFT, RTGS, and legal business invoices. For overseas trade orders, we accept clean wire payments in USD, GBP, AED, and EUR accounts.",
    },
    category: "Payment",
  },
  // ── NEW FAQS ADDED ──────────────────────────────────────────────────────
  {
    name: "Do you provide size charts and grading for bulk orders?",
    acceptedAnswer: {
      text: "Yes — every style comes with a detailed size chart and grading breakdown (XS–3XL or custom Asian/Western sizing on request). We can also follow your brand's specific size grading rules for private label orders.",
    },
    category: "Products",
  },
  {
    name: "Can I mix multiple styles and sizes in one bulk order?",
    acceptedAnswer: {
      text: "Absolutely. As long as the total order meets our 50-piece MOQ per style, you can freely mix designs, colors, and sizes within your container to match your retail demand patterns.",
    },
    category: "Ordering",
  },
  {
    name: "Do you offer private labelling and branded packaging?",
    acceptedAnswer: {
      text: "Yes, we support full private label programs — custom neck labels, brand tags, poly-bag branding, and tailored hang-tag printing. Share your brand guidelines and we'll handle the rest at no extra design cost above MOQ.",
    },
    category: "Customization",
  },
  {
    name: "What quality checks happen before shipping?",
    acceptedAnswer: {
      text: "Every lot undergoes a 3-stage QC process: fabric inspection, in-line stitching checks, and a final pre-dispatch audit covering measurements, finishing, and packaging — so what you see in samples is exactly what you receive in bulk.",
    },
    category: "Products",
  },
  {
    name: "Can I track my shipment after dispatch?",
    acceptedAnswer: {
      text: "Yes. Once your order is dispatched, you'll receive a tracking number and carrier details via email. Our export desk also proactively shares status updates at key milestones — customs clearance, transit, and final delivery.",
    },
    category: "Shipping",
  },
  {
    name: "Do you offer repeat-order or long-term partnership pricing?",
    acceptedAnswer: {
      text: "Yes — returning partners and high-volume retailers are moved to our preferred pricing tier with priority production slots, locked-in rates, and dedicated account support. Ask your export consultant about long-term partnership terms.",
    },
    category: "Payment",
  },
];

const CATEGORY_COLORS = {
  Ordering: {
    bg: "bg-[#7A3D2A]/10",
    text: "text-[#7A3D2A]",
    border: "border-[#7A3D2A]/20",
  },
  Customization: {
    bg: "bg-[#BE6E5B]/10",
    text: "text-[#BE6E5B]",
    border: "border-[#BE6E5B]/20",
  },
  Products: {
    bg: "bg-[#8B6040]/10",
    text: "text-[#8B6040]",
    border: "border-[#8B6040]/20",
  },
  Shipping: {
    bg: "bg-[#9A5535]/10",
    text: "text-[#9A5535]",
    border: "border-[#9A5535]/20",
  },
  Payment: {
    bg: "bg-[#BE6E5B]/10",
    text: "text-[#BE6E5B]",
    border: "border-[#BE6E5B]/20",
  },
  Default: {
    bg: "bg-[#a07f61]/10",
    text: "text-[#a07f61]",
    border: "border-[#a07f61]/20",
  },
};

export default function FaqSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  // Assign categories to incoming schema items based on keywords
  const processedIncoming = (faqs || []).map((f) => {
    let assignedCategory = "Ordering";
    const titleLower = f.name.toLowerCase();

    if (
      titleLower.includes("custom") ||
      titleLower.includes("stitch") ||
      titleLower.includes("design")
    ) {
      assignedCategory = "Customization";
    } else if (
      titleLower.includes("fabric") ||
      titleLower.includes("material") ||
      titleLower.includes("product")
    ) {
      assignedCategory = "Products";
    } else if (
      titleLower.includes("ship") ||
      titleLower.includes("delivery") ||
      titleLower.includes("timeline")
    ) {
      assignedCategory = "Shipping";
    } else if (
      titleLower.includes("pay") ||
      titleLower.includes("invoice") ||
      titleLower.includes("price")
    ) {
      assignedCategory = "Payment";
    }

    return { ...f, category: assignedCategory };
  });

  // Filter out semantic duplicates dynamically
  const finalFaqsList = [...processedIncoming];

  BUILT_IN_FAQS.forEach((builtInItem) => {
    const isAlreadyPresent = finalFaqsList.some((incomingItem) => {
      const incTitle = incomingItem.name.toLowerCase();
      const builtTitle = builtInItem.name.toLowerCase();
      return (
        incTitle === builtTitle ||
        (incTitle.includes("order") && builtTitle.includes("order")) ||
        (incTitle.includes("custom") && builtTitle.includes("custom")) ||
        (incTitle.includes("delivery") && builtTitle.includes("delivery")) ||
        (incTitle.includes("fabric") && builtTitle.includes("fabric"))
      );
    });

    if (!isAlreadyPresent) {
      finalFaqsList.push(builtInItem);
    }
  });

  if (finalFaqsList.length === 0) return null;

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Split into left and right arrays natively but track their actual true indices
  const leftColumnFaqs = finalFaqsList.filter((_, i) => i % 2 === 0);
  const rightColumnFaqs = finalFaqsList.filter((_, i) => i % 2 !== 0);

  // Distinct category list for the filter strip (purely decorative/informational —
  // does not change existing toggle logic, just visually groups what's available)
  const categoryChips = [
    ...new Set(finalFaqsList.map((f) => (f.category || "").replace(":", ""))),
  ].filter(Boolean);

  return (
    <>
      {/* ✅ SEO FIX: Injected Dynamic FAQPage Schema for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: finalFaqsList.map((faq) => ({
              "@type": "Question",
              name: faq.name,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.acceptedAnswer.text,
              },
            })),
          }),
        }}
      />
      <section
        aria-labelledby="faq-heading"
        className="relative py-24 md:py-32 overflow-hidden z-10"
        style={{
          background:
            "linear-gradient(150deg, #FDF7F2 0%, #F2D9C3 60%, #EDD0B5 100%)",
        }}
      >
        {/* Dot Grid Background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#7A3D2A 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Frame Decorative Lines */}
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
          className="absolute left-6 md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/18 to-transparent hidden sm:block"
        />
        <div
          aria-hidden="true"
          className="absolute right-6 md:right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/18 to-transparent hidden sm:block"
        />

        {/* Giant Background Watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span
            className="font-serif font-bold text-[#7A3D2A]/5 tracking-tighter leading-none"
            style={{ fontSize: "clamp(10rem, 22vw, 24rem)" }}
          >
            FAQ
          </span>
        </div>

        {/* Floating Accent Orbs — subtle extra polish, purely decorative */}
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-[8%] w-2 h-2 rounded-full bg-[#BE6E5B]/40 hidden lg:block"
          style={{ animation: "faqFloat 5s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 right-[10%] w-1.5 h-1.5 rounded-full bg-[#7A3D2A]/30 hidden lg:block"
          style={{ animation: "faqFloat 6s ease-in-out 1.2s infinite" }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-1/3 left-[14%] w-1 h-1 rounded-full bg-[#a07f61]/40 hidden lg:block"
          style={{ animation: "faqFloat 4.5s ease-in-out 0.6s infinite" }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes faqFloat {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
            50%      { transform: translateY(-10px) scale(1.15); opacity: 1; }
          }
        `,
          }}
        />

        {/* Corner Brackets */}
        {[
          ["top-5 left-5", "rotate-0"],
          ["top-5 right-5", "rotate-90"],
          ["bottom-5 left-5", "-rotate-90"],
          ["bottom-5 right-5", "rotate-180"],
        ].map(([pos, rot], i) => (
          <svg
            key={i}
            aria-hidden="true"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            className={`absolute ${pos} ${rot} opacity-[0.16] hidden md:block`}
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Block */}
          <div className="text-center mb-12 md:mb-14">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
              Commercial Sourcing Help
            </p>

            <h2
              id="faq-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] drop-shadow-sm font-bold leading-tight"
            >
              Frequently Asked:
              {/* ✅ SEO FIX: Injected visually hidden primary priority keyword */}
              <span className="sr-only">
                {" "}
                - Wholesale Ethnic Wear Supplier India
              </span>
            </h2>

            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-4 mt-6"
            >
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>

            <p className="font-serif italic text-[#a07f61] mt-6 text-sm md:text-lg max-w-xl mx-auto font-medium">
              Everything you need to verify before placing your international
              wholesale export inquiry.
            </p>

            {/* Category chips — visual summary of topics covered below */}
            {categoryChips.length > 0 && (
              <div
                aria-hidden="true"
                className="flex flex-wrap items-center justify-center gap-2 mt-7"
              >
                {categoryChips.map((cat) => {
                  const c = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Default;
                  return (
                    <span
                      key={cat}
                      className={`inline-flex items-center px-3.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-[0.18em] ${c.bg} ${c.text} ${c.border}`}
                    >
                      {cat}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Fixed Two-Column Symmetrical Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start max-w-6xl mx-auto w-full mt-10">
            {/* Left Column Stack */}
            <div className="flex flex-col gap-4 md:gap-5 w-full">
              {leftColumnFaqs.map((faq) => {
                const globalIndex = finalFaqsList.findIndex(
                  (f) => f.name === faq.name,
                );
                return (
                  <FaqItem
                    key={globalIndex}
                    index={globalIndex}
                    faq={faq}
                    isOpen={openIndex === globalIndex}
                    onToggle={() => handleToggle(globalIndex)}
                  />
                );
              })}
            </div>

            {/* Right Column Stack (Perfect Line-Level Alignment) */}
            <div className="flex flex-col gap-4 md:gap-5 w-full">
              {rightColumnFaqs.map((faq) => {
                const globalIndex = finalFaqsList.findIndex(
                  (f) => f.name === faq.name,
                );
                return (
                  <FaqItem
                    key={globalIndex}
                    index={globalIndex}
                    faq={faq}
                    isOpen={openIndex === globalIndex}
                    onToggle={() => handleToggle(globalIndex)}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom CTA Block */}
          <div className="mt-16 md:mt-24 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-8 rounded-2xl border border-[#BE6E5B]/20 bg-white/60 backdrop-blur-md shadow-[0_10px_40px_rgba(122,61,42,0.08)] max-w-6xl mx-auto w-full">
            <div className="text-center sm:text-left">
              <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#BE6E5B] font-bold mb-2">
                Have unique trade specifications?
              </p>
              <p className="font-display text-2xl md:text-3xl font-bold text-[#7A3D2A]">
                Our export consultants are standing by.
              </p>
            </div>

            {/* ✅ SEO FIX: Maintained Title and Aria-Label for contextual link equity */}
            <Link
              href="/contact"
               prefetch={false}
              title="Contact Wholesale Ethnic Wear Manufacturer"
              aria-label="Contact SANWARIYAS wholesale export team"
              className="group relative inline-flex items-center justify-center gap-3 border-2 border-[#7A3D2A] text-[#7A3D2A] font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold px-8 py-4 rounded-md hover:text-[#FDF7F2] transition-colors duration-500 overflow-hidden flex-shrink-0 w-full sm:w-auto"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[#7A3D2A] -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10"
              />
              <span className="relative z-10">Connect Direct.</span>
              <span
                aria-hidden="true"
                className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300 text-sm md:text-lg leading-none"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Atomic FAQ Item Card Component ──────────────────────────────
function FaqItem({ faq, isOpen, onToggle, index }) {
  const currentCatColors = faq.category
    ? CATEGORY_COLORS[faq.category] || CATEGORY_COLORS.Default
    : CATEGORY_COLORS.Default;

  return (
    <div
      onClick={onToggle}
      // ✅ A11Y FIX: Make the entire div keyboard accessible as a button
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${index}`}
      className={`group relative border rounded-xl backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-[#BE6E5B] focus-visible:ring-offset-2 ${
        isOpen
          ? "bg-white/95 border-[#BE6E5B]/50 shadow-[0_15px_40px_rgba(122,61,42,0.12)] -translate-y-0.5"
          : "bg-white/60 border-[#BE6E5B]/20 shadow-sm hover:bg-white/85 hover:border-[#BE6E5B]/40 hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      {/* Sliding Active Top Indicator Glow */}
      <div
        aria-hidden="true"
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A3D2A] via-[#BE6E5B] to-[#a07f61] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      {/* Corner glint — extra polish, shows only when open */}
      <div
        aria-hidden="true"
        className={`absolute -top-8 -right-8 w-16 h-16 rounded-full bg-[#BE6E5B]/10 blur-xl transition-opacity duration-700 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <div className="relative flex items-start gap-4 p-6 md:p-7 select-none">
        {/* Left Vertical Dynamic Pillar */}
        <div
          aria-hidden="true"
          className={`mt-1.5 w-1 rounded-full flex-shrink-0 transition-all duration-500 ${
            isOpen
              ? "h-full bg-[#BE6E5B]"
              : "h-5 bg-[#BE6E5B]/30 group-hover:bg-[#BE6E5B]/50"
          }`}
        />

        {/* Question + Premium Category Pill */}
        <div className="flex-1 min-w-0">
          <span
            className={`inline-flex items-center px-3 py-0.5 mb-2.5 rounded-full border text-[8.5px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${currentCatColors.bg} ${currentCatColors.text} ${currentCatColors.border}`}
          >
            {faq.category}
          </span>
          {/* ✅ SEO FIX: Added matching ID to ensure aria-labelledby of the content panel properly maps to this heading for screen readers and Passage Indexing */}
          <h3
            id={`faq-heading-${index}`}
            className={`font-display text-base md:text-lg font-bold leading-snug transition-colors duration-300 ${isOpen ? "text-[#BE6E5B]" : "text-[#7A3D2A]"}`}
          >
            {faq.name}
          </h3>
        </div>

        {/* Animated Smooth Plus/Cross SVG Trigger */}
        <div
          aria-hidden="true"
          className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex-shrink-0 border-2 flex items-center justify-center mt-0.5 transition-all duration-500 ${
            isOpen
              ? "border-[#BE6E5B] bg-[#BE6E5B] rotate-45 shadow-[0_4px_14px_rgba(190,110,91,0.4)]"
              : "border-[#BE6E5B]/40 bg-transparent rotate-0 group-hover:border-[#BE6E5B]/80"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1V11M1 6H11"
              stroke={isOpen ? "#FDF7F2" : "#7A3D2A"}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Buttery Dynamic Grid Animation Panel */}
      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-heading-${index}`}
        className="grid transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="px-6 md:px-7 pb-7 pt-0">
            <div className="ml-[19px] pl-4 border-l-2 border-[#BE6E5B]/25">
              <p className="font-sans text-sm md:text-[15px] text-[#a07f61] leading-relaxed font-medium">
                {faq.acceptedAnswer.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
