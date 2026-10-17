
 // FILE: client/src/app/privacy/page.js

// import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

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
        url: "https://sanwariyas.com/images/og-terms.png",
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

const LAST_UPDATED = "25 August 2026";

const SECTIONS = [
  {
    id: "information-we-collect",
    num: "1",
    title: "Information We Collect",
    clauses: [
      {
        num: "1.1",
        text: (
          <>
            We may collect:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a07f61]">
              <li>Name</li>
              <li>Mobile and WhatsApp number</li>
              <li>Email address</li>
              <li>Business or shop name</li>
              <li>Billing and shipping address</li>
              <li>GST details, where required</li>
              <li>Order and payment-related information</li>
              <li>Information shared through enquiry or catalogue request forms</li>
            </ul>
          </>
        ),
      },
      {
        num: "1.2",
        text: "We may also collect basic website usage information through cookies or analytics tools.",
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
            We use your information to:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a07f61]">
              <li>Respond to your enquiries</li>
              <li>Share catalogues and product information</li>
              <li>Process and manage wholesale orders</li>
              <li>Arrange payment, dispatch, and delivery</li>
              <li>Provide customer support</li>
              <li>Send updates about new collections, products, and offers</li>
              <li>Improve our website and services</li>
              <li>Meet legal and business requirements</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    id: "sharing-your-information",
    num: "3",
    title: "Sharing Your Information",
    clauses: [
      {
        num: "3.1",
        text: "We do not sell your personal information.",
      },
      {
        num: "3.2",
        text: (
          <>
            Your information may be shared with trusted service providers when necessary, such as:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a07f61]">
              <li>Payment partners</li>
              <li>Courier and logistics companies</li>
              <li>Website and technology providers</li>
              <li>Customer communication or support services</li>
            </ul>
          </>
        ),
      },
      {
        num: "3.3",
        text: "We may also share information when required by law.",
      },
    ],
  },
  {
    id: "marketing-communication",
    num: "4",
    title: "Marketing Communication",
    clauses: [
      {
        num: "4.1",
        text: "With your permission or where permitted by applicable law, we may contact you through WhatsApp, phone, SMS, or email regarding our products, collections, catalogues, and offers.",
      },
      {
        num: "4.2",
        text: "You can request to stop receiving promotional communication at any time.",
      },
    ],
  },
  {
    id: "cookies",
    num: "5",
    title: "Cookies",
    clauses: [
      {
        num: "5.1",
        text: "Our website may use cookies and similar technologies to improve your browsing experience and understand how visitors use our website.",
      },
      {
        num: "5.2",
        text: "You can manage or disable cookies through your browser settings.",
      },
    ],
  },
  {
    id: "data-security",
    num: "6",
    title: "Data Security",
    clauses: [
      {
        num: "6.1",
        text: "We take reasonable steps to protect your personal and business information from unauthorised access, misuse, or disclosure.",
      },
      {
        num: "6.2",
        text: "However, no online system is completely secure, and we cannot guarantee absolute security of information transmitted over the internet.",
      },
    ],
  },
  {
    id: "third-party-services",
    num: "7",
    title: "Third-Party Services",
    clauses: [
      {
        num: "7.1",
        text: "Our website may contain links or use services provided by third parties, such as payment gateways or social media platforms.",
      },
      {
        num: "7.2",
        text: "SANWARIYAS is not responsible for the privacy practices of these third-party services. We recommend reviewing their privacy policies separately.",
      },
    ],
  },
  {
    id: "your-rights",
    num: "8",
    title: "Your Rights",
    clauses: [
      {
        num: "8.1",
        text: (
          <>
            You may contact us to:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a07f61]">
              <li>Request access to your information</li>
              <li>Correct or update your details</li>
              <li>Request deletion of information, where applicable</li>
              <li>Stop receiving promotional messages</li>
            </ul>
          </>
        ),
      },
      {
        num: "8.2",
        text: "Some information may need to be retained for legal, tax, accounting, or order-related purposes.",
      },
    ],
  },
  {
    id: "changes-to-policy",
    num: "9",
    title: "Changes to This Policy",
    clauses: [
      {
        num: "9.1",
        text: "SANWARIYAS may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.",
      },
    ],
  },
  {
    id: "grievances",
    num: "10",
    title: "Grievances and Privacy Concerns",
    clauses: [
      {
        num: "10.1",
        text: "If you have any questions, concerns, complaints, or requests regarding your personal information or this Privacy Policy, you may contact us using the details below:",
      },
      {
        num: "10.2",
        text: (
          <>
            <strong>Grievance / Privacy Contact:</strong> SANWARIYAS Administrative Desk<br />
            <strong>Email:</strong> hrsanwariyas@gmail.com<br />
            <strong>Phone:</strong> +91 9680812813
          </>
        ),
      },
      {
        num: "10.3",
        text: "We will review your concern and respond within a reasonable timeframe, in accordance with applicable laws.",
      },
    ],
  },
  {
    id: "governing-law",
    num: "11",
    title: "Governing Law and Jurisdiction",
    clauses: [
      {
        num: "11.1",
        text: "This Privacy Policy shall be governed by and interpreted in accordance with the laws of India.",
      },
      {
        num: "11.2",
        text: "Any dispute arising out of or relating to this Privacy Policy, your use of the SANWARIYAS website, or the handling of information by SANWARIYAS shall be subject to the exclusive jurisdiction of the competent courts in Jaipur, Rajasthan, India, subject to applicable law.",
      },
    ],
  },
];

function TableOfContents() {
  return (
    <nav
      aria-label="Privacy Policy sections"
      className="hidden lg:block sticky top-28 self-start w-64 flex-shrink-0"
    >
      <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#BE6E5B] font-bold mb-5 px-1">
        On This Page
      </p>
      <ul className="space-y-1 border-l-2 border-[#BE6E5B]/15 pl-0 list-none">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="group flex items-start gap-3 py-2 px-4 -ml-px border-l-2 border-transparent hover:border-[#BE6E5B] transition-colors duration-200"
            >
              {/* 👇 LEFT SIDE - THODA CHHOTA KIYA HAI (12px aur 13px/14px) */}
              <span className="font-sans text-[12px] font-bold text-[#BE6E5B]/60 group-hover:text-[#BE6E5B] mt-[2px] flex-shrink-0">
                {s.num}
              </span>
              <span className="font-sans text-[13px] md:text-[14px] text-[#a07f61] group-hover:text-[#7A3D2A] leading-snug transition-colors duration-200">
                {s.title}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 p-5 rounded-xl bg-[#FAF3E8] border border-[#BE6E5B]/15">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#BE6E5B] font-bold mb-1.5">
          Data Requests
        </p>
        <p className="font-sans text-[12.5px] text-[#a07f61] leading-relaxed mb-4">
          Reach our administrative desk for data deletion or privacy concerns.
        </p>
        <Link
          href="/contact"
          title="Contact SANWARIYAS Administrative Desk"
          className="inline-flex items-center gap-1.5 font-sans text-[12px] font-bold text-[#7A3D2A] hover:text-[#BE6E5B] transition-colors"
        >
          Contact Us <span aria-hidden="true">→</span>
        </Link>
      </div>
    </nav>
  );
}

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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#BE6E5B]/20 font-sans text-[11.5px] font-semibold text-[#7A3D2A] hover:bg-[#BE6E5B] hover:text-white hover:border-[#BE6E5B] transition-colors duration-200"
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
            
            .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
            .font-display { font-family: 'Playfair Display', serif !important; }
            .font-serif { font-family: 'Playfair Display', serif !important; }
          `
        }}
      />

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
              dateModified: "2026-08-25",
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
        {/* <Navbar /> */}

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
              At SANWARIYAS, we respect your privacy and are committed to protecting the information you share with us.
            </p>

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
              <span>{SECTIONS.length} Sections</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#BE6E5B]/40" />
              <span>Governing Law: India</span>
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-20 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-12">
              <TableOfContents />

              <div className="flex-1 min-w-0 max-w-4xl">
                <MobileJumpMenu />

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
                    SANWARIYAS is a B2B manufacturer and wholesale supplier of women's ethnic wear.
                  </p>
                </div>

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
                      If you have any questions, concerns, requests, or
                      complaints regarding this Privacy Policy or the handling
                      of your personal information, please contact SANWARIYAS
                      through:
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
                      * For privacy-related requests, please include enough
                      information for us to identify your account or request.
                    </p>
                  </article>
                </div>

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