// FILE: client/src/app/privacy/page.js

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

//  SEO FIX: Highly optimized Meta Title, Description, Canonical URL, OpenGraph, and Twitter Cards
export const metadata = {
  title: "Privacy Policy | SANWARIYAS Wholesale Manufacturer",
  description:
    "Review the Privacy Policy for SANWARIYAS. Learn how we collect, use, and protect your data on our B2B wholesale platform.",

  keywords: [
    "Privacy Policy",
    "Data Protection",
    "SANWARIYAS Privacy",
    "B2B Platform Privacy",
    "Wholesale Data Security",
  ],

  alternates: { canonical: "https://sanwariyas.com/privacy" },
  openGraph: {
    title: "Privacy Policy | SANWARIYAS Wholesale",
    description:
      "Learn how SANWARIYAS protects your privacy and data on our online wholesale platform.",
    url: "https://sanwariyas.com/privacy",
    siteName: "SANWARIYAS",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "https://sanwariyas.com/images/og-terms.png", // Using the same legal OG image
        width: 1200,
        height: 630,
        alt: "SANWARIYAS Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | SANWARIYAS",
    description: "Learn how we handle and protect your data.",
    images: ["https://sanwariyas.com/images/og-terms.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const LAST_UPDATED = "14 August 2026";

// ── Section data — Formatted EXACTLY like the Terms page ──
const SECTIONS = [
  {
    id: "information-we-collect",
    num: "1",
    title: "Information We Collect",
    clauses: [
      {
        num: "1.1",
        text: "We may collect the following categories of information when you use our website or interact with us.",
      },
      {
        num: "1.2",
        text: (
          <>
            <strong>A. Personal Information:</strong> When you create an account, submit an inquiry, place an order, or contact us, we may collect:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a07f61]">
              <li>Full name & Email address</li>
              <li>Phone/mobile number</li>
              <li>Company or business name & Country</li>
              <li>Billing, shipping, and delivery information</li>
              <li>Account login information</li>
              <li>Information provided in inquiries or messages</li>
            </ul>
          </>
        ),
      },
      {
        num: "1.3",
        text: (
          <>
            <strong>B. Order & Transaction Information:</strong> When you purchase products or submit an order, we collect information necessary to process the transaction, including:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a07f61]">
              <li>Products ordered and Quantity</li>
              <li>Order value and Payment status</li>
              <li>Shipping, delivery, and billing details</li>
              <li>Order history and related transaction information</li>
            </ul>
            <div className="mt-2 italic">We do not intentionally store your complete payment card, banking, or other sensitive payment credentials on our servers. Payments may be processed through third-party payment providers.</div>
          </>
        ),
      },
      {
        num: "1.4",
        text: (
          <>
            <strong>C. Technical Information:</strong> When you visit our website, certain technical information may be collected automatically, such as IP address, Browser type, Device type, Operating system, Pages visited, Referring pages, Approximate usage information, Date and time of website access, and Error/diagnostic information.
          </>
        ),
      },
      {
        num: "1.5",
        text: (
          <>
            <strong>D. Cookies & Similar Technologies:</strong> SANWARIYAS may use cookies to keep you signed in, maintain your shopping cart, remember preferences, improve website functionality, and support security and fraud prevention. You can manage or disable cookies through your browser settings.
          </>
        ),
      },
    ],
  },
  {
    id: "how-we-use",
    num: "2",
    title: "How We Use Your Information",
    clauses: [
      {
        num: "2.1",
        text: (
          <>
            We may use the information we collect to:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a07f61]">
              <li>Create and manage your customer account & authenticate your login.</li>
              <li>Process and manage orders, inquiries, and requests.</li>
              <li>Communicate with you regarding your orders or inquiries.</li>
              <li>Arrange shipping, delivery, and process payments.</li>
              <li>Send important account or transaction-related communications.</li>
              <li>Improve our products, website, services, and maintain security.</li>
              <li>Prevent fraud, misuse, or unauthorized activity.</li>
              <li>Comply with applicable legal and regulatory requirements.</li>
            </ul>
          </>
        ),
      },
      {
        num: "2.2",
        text: "We will use personal information only for legitimate and specified purposes relevant to the services we provide.",
      },
    ],
  },
  {
    id: "account-information",
    num: "3",
    title: "Account Information",
    clauses: [
      {
        num: "3.1",
        text: "If you create an account on SANWARIYAS, we may use your information to maintain your account and provide account-related services.",
      },
      {
        num: "3.2",
        text: "You are responsible for keeping your login credentials confidential and for notifying us if you believe your account has been accessed without authorization.",
      },
    ],
  },
  {
    id: "inquiry-communication",
    num: "4",
    title: "Inquiry and Communication Data",
    clauses: [
      {
        num: "4.1",
        text: "When you submit an inquiry, contact request, product inquiry, or message through our website, we may collect the information you provide so that our team can respond to your request.",
      },
      {
        num: "4.2",
        text: "This may include Name, Email, Phone number, Company information, Product/Quantity requirements, Message content, and Related communication history.",
      },
      {
        num: "4.3",
        text: "We may retain inquiry information for customer-service, business, and record-keeping purposes.",
      },
    ],
  },
  {
    id: "order-information",
    num: "5",
    title: "Order Information",
    clauses: [
      {
        num: "5.1",
        text: "If you place an order through SANWARIYAS, we use the information associated with the order to confirm and process the order, prepare products, arrange shipment, and provide order updates and tracking information.",
      },
      {
        num: "5.2",
        text: "This information is also used to handle returns, cancellations, or support requests where applicable, and to maintain transaction records.",
      },
    ],
  },
  {
    id: "sharing-of-information",
    num: "6",
    title: "Sharing of Information",
    clauses: [
      {
        num: "6.1",
        text: "We do not sell or rent your personal information to third parties for their own independent marketing purposes.",
      },
      {
        num: "6.2",
        text: (
          <>
            We may share necessary information with trusted service providers when required to operate our business, including:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a07f61]">
              <li>Payment, shipping, and courier service providers</li>
              <li>Website, hosting, cloud, and database service providers</li>
              <li>Email, communication, analytics, or technical service providers</li>
              <li>Customer-support or business-management service providers</li>
            </ul>
          </>
        ),
      },
      {
        num: "6.3",
        text: "These parties receive only information reasonably necessary for the service they provide.",
      },
      {
        num: "6.4",
        text: "We may also disclose information where required to comply with applicable law, legal process, government requests, court orders, or to protect our legal rights, users, or business.",
      },
    ],
  },
  {
    id: "payment-information",
    num: "7",
    title: "Payment Information",
    clauses: [
      {
        num: "7.1",
        text: "Payments may be processed through third-party payment providers. When you make a payment, your payment information may be handled directly by the applicable payment provider according to its own terms and privacy policy.",
      },
      {
        num: "7.2",
        text: "SANWARIYAS does not intentionally store complete card numbers, CVV numbers, or banking passwords on its own servers.",
      },
    ],
  },
  {
    id: "data-security-retention",
    num: "8",
    title: "Data Security & Retention",
    clauses: [
      {
        num: "8.1",
        text: "We take reasonable technical and organizational measures to protect personal information against unauthorized access, disclosure, loss, misuse, alteration, or destruction. However, no internet-based system can be guaranteed to be completely secure.",
      },
      {
        num: "8.2",
        text: "We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy (e.g., providing services, processing orders, meeting legal obligations).",
      },
      {
        num: "8.3",
        text: "When information is no longer reasonably required, we may delete, anonymize, or securely dispose of it, subject to applicable legal requirements.",
      },
    ],
  },
  {
    id: "privacy-choices",
    num: "9",
    title: "Your Privacy Choices and Rights",
    clauses: [
      {
        num: "9.1",
        text: (
          <>
            Depending on applicable law, you may have rights relating to your personal information, including the ability to:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a07f61]">
              <li>Request access to personal information we hold about you.</li>
              <li>Request correction of inaccurate or incomplete information.</li>
              <li>Request deletion of personal information where legally applicable.</li>
              <li>Withdraw consent where processing is based on consent.</li>
              <li>Raise a privacy-related complaint or concern.</li>
            </ul>
          </>
        ),
      },
      {
        num: "9.2",
        text: "Requests may be subject to reasonable verification to protect your account and personal information.",
      },
    ],
  },
  {
    id: "communications-thirdparty",
    num: "10",
    title: "Communications & Third-Party Websites",
    clauses: [
      {
        num: "10.1",
        text: "Where applicable, we may send promotional or marketing communications about SANWARIYAS products, offers, or business updates. You may request to stop receiving promotional communications by using the available unsubscribe option or by contacting us directly.",
      },
      {
        num: "10.2",
        text: "Transactional and service-related communications (order confirmations, security notices, etc.) may still be sent when necessary.",
      },
      {
        num: "10.3",
        text: "Our website may contain links to third-party websites or services. SANWARIYAS is not responsible for the privacy practices, security, or content of third-party websites.",
      },
    ],
  },
  {
    id: "other-policies",
    num: "11",
    title: "Children's Privacy, International Users & Updates",
    clauses: [
      {
        num: "11.1",
        text: "SANWARIYAS is intended primarily for businesses, retailers, and wholesalers capable of entering into commercial transactions. Our website is not knowingly intended to collect personal information from children.",
      },
      {
        num: "11.2",
        text: "SANWARIYAS may work with service providers or business partners located in different jurisdictions. Where personal information is processed outside your country, we will take reasonable steps to ensure it complies with applicable data-protection requirements.",
      },
      {
        num: "11.3",
        text: "We may update this Privacy Policy from time to time to reflect changes in our services, technology, business practices, or laws. When we make changes, we will update the 'Last Updated' date at the top of this page.",
      },
    ],
  },
];

// ── Sidebar Table of Contents (sticky, desktop only) ──────────────────────────
function TableOfContents() {
  return (
    <nav
      aria-label="Privacy Policy sections"
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
          Data Requests
        </p>
        <p className="font-sans text-[11.5px] text-[#a07f61] leading-relaxed mb-3">
          Reach our administrative desk for data deletion or privacy concerns.
        </p>
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

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Privacy Policy | SANWARIYAS",
              description:
                "Privacy Policy and Data Protection guidelines for SANWARIYAS wholesale platform.",
              url: "https://sanwariyas.com/privacy",
              inLanguage: "en-IN",
              datePublished: "2026-08-14",
              dateModified: "2026-08-14",
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
                  name: "Privacy Policy",
                  item: "https://sanwariyas.com/privacy",
                },
              ],
            },
          ]),
        }}
      />

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

          {/* Corner brackets */}
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
              Privacy Policy
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
              SANWARIYAS ("we", "our", or "us") respects your privacy and is committed to protecting the personal information you provide.
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
                    This Privacy Policy explains what information we collect, why we collect it, how we use it, when it may be shared, and the choices available to you. By using the SANWARIYAS website, you acknowledge the practices described below.
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
                            <div className="font-sans text-[14px] md:text-[15px] text-[#5C3120] leading-relaxed m-0 w-full">
                              {clause.text}
                            </div>
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
                      If you have any questions, concerns, requests, or complaints regarding this Privacy Policy or the handling of your personal information, please contact SANWARIYAS through:
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
                    <p className="mt-5 font-sans text-xs text-[#a07f61] italic border-t border-[#BE6E5B]/10 pt-4">
                      * For privacy-related requests, please include enough information for us to identify your account or request.
                    </p>
                  </article>
                </div>

                {/* ── CTA Block ── */}
                <div className="mt-12 text-center">
                  <Link
                    href="/contact"
                    title="Contact SANWARIYAS Privacy Desk"
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
      </main>
    </>
  );
}