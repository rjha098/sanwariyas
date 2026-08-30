// FILE: client/src/app/faq/page.js
// import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FaqSection from "@/components/home/FaqSection";

//  Highly optimized Meta Title, Description, Canonical URL, OpenGraph, and Twitter Cards
export const metadata = {
  title: "Wholesale Ethnic Wear FAQ | SANWARIYAS B2B Manufacturer",
  description:
    "Got questions about bulk wholesale orders, custom manufacturing, MOQ, or international shipping? Read the SANWARIYAS FAQ. India's trusted B2B ethnic wear exporter.",

  keywords: [
    "Wholesale Ethnic Wear FAQ",
    "B2B Ethnic Wear Supplier",
    "Jaipur Ethnic Wear Manufacturer",
    "Cotton Clothing Exporter India",
    "Wholesale Kurti Supplier",
  ],

  alternates: { canonical: "https://sanwariyas.com/faq" },
  openGraph: {
    title: "Wholesale Ethnic Wear FAQ | SANWARIYAS Manufacturer",
    description:
      "Frequently Asked Questions about SANWARIYAS global wholesale, custom production, and international shipping.",
    url: "https://sanwariyas.com/faq",
    siteName: "SANWARIYAS",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://sanwariyas.com/images/og-faq.png",
        width: 1200,
        height: 630,
        alt: "SANWARIYAS Wholesale Ethnic Wear FAQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale Ethnic Wear FAQ | SANWARIYAS B2B Manufacturer",
    description:
      "Frequently Asked Questions about our B2B wholesale ethnic wear export process.",
    images: ["https://sanwariyas.com/images/og-faq.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FaqPage() {
  return (
    <>
      {/*  Injected BreadcrumbList and FAQPage Schema to trigger Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
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
                  name: "FAQ",
                  item: "https://sanwariyas.com/faq",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How do I place a wholesale order at SANWARIYAS?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Simply browse our wholesale catalogue, select the styles you want to source, and fill out the bulk inquiry form with your requirements. Our export desk will respond within 24 hours with a custom proposal quote.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the minimum order quantity (MOQ)?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our wholesale MOQ starts strictly at 50 pieces per style. This helps boutique owners, international retailers, and commercial distributors scale up inventory efficiently.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you offer customization on ethnic wear?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes — we offer full contract manufacturing support including custom fabric selection, custom size specifications, custom embroidery, print production, and private label/OEM solutions.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you ship internationally?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. We export worldwide to over 50+ countries including the USA, UK, UAE, Canada, and Australia. All global export shipments are fully cargo-insured and securely packed.",
                  },
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
        {/* 1. Navbar */}
        {/* <Navbar /> */}

        {/* 2. Main FAQ Section (Padding added to account for Navbar height) */}
        <div className="flex-grow">
          <FaqSection />
        </div>

        {/* 3. Footer */}
        <Footer />
      </main>
    </>
  );
}
