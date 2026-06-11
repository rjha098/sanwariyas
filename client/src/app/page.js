// FILE: client/src/app/page.js
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

import HeroSection from "@/components/home/HeroSection";
import MarqueeTicker from "@/components/home/MarqueeTicker";
import TrustBadges from "@/components/home/TrustBadges";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
// import BestsellingKurtis from "@/components/home/BestsellingKurtis";
import ManufacturingInfoSections from "@/components/home/ManufacturingInfoSections";
import WhyUsSection from "@/components/home/WhyUsSection";
import InquiryCTASection from "@/components/home/InquiryCTASection";
import FaqSection from "@/components/home/FaqSection";
import { fetchProducts } from "@/lib/api";

export const metadata = {
  title: "SANWARIYAS — Premium Ethnic Wear Exporter & Wholesale Indian Fashion",
  description:
    "Partner with SANWARIYAS for wholesale ethnic wear. Low MOQ, custom manufacturing, and global shipping for boutiques and retailers. Send inquiry for B2B pricing.",
  alternates: { canonical: "https://sanwariyas.com/" },
  openGraph: {
    title: "SANWARIYAS — Wholesale Ethnic Wear Manufacturer",
    description: "Premium wholesale ethnic wear exporter. Custom manufacturing & global shipping.",
    url: "https://sanwariyas.com/",
    siteName: "SANWARIYAS Wholesale",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I place an order at SANWARIYAS?",
      acceptedAnswer: { "@type": "Answer", text: "Browse our wholesale catalogue, select your styles, and fill out the bulk inquiry form. Our export desk will reply within 24 hours with a custom proforma quotation." },
    },
    {
      "@type": "Question",
      name: "Do you offer customization on ethnic wear?",
      acceptedAnswer: { "@type": "Answer", text: "Yes—we offer full contract manufacturing including custom fabric, sizing, embroidery, and private label/OEM solutions." },
    },
    {
      "@type": "Question",
      name: "What is the delivery timeline?",
      acceptedAnswer: { "@type": "Answer", text: "Ready inventory is dispatched within 5–7 business days. Custom commercial orders require 15–21 business days." },
    },
  ],
};

async function getFeaturedProducts() {
  try {
    const data = await fetchProducts({ featured: "true", limit: 4 });
    return data.products || [];
  } catch { return []; }
}

// async function getBestsellingProducts() {
//   try {
//     const data = await fetchProducts({ limit: 6 });
//     return data.products || [];
//   } catch { return []; }
// }


export default async function HomePage() {


  // this is  the  for  dynamic  things 
  // const [featuredProducts, bestsellingProducts] = await Promise.all([
  //   getFeaturedProducts(),
  //   getBestsellingProducts(),
  // ]);

  // this  is  for  the  static  things 
  const [featuredProducts] = await Promise.all([
  getFeaturedProducts(),
]);

// Static mode
const bestsellingProducts = [];

  return (
    <>
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main id="main-content">
        <div className="pt-[72px] md:pt-[80px]">
          <HeroSection />
        </div>

        {/* ── LOOKBOOK TEASER SECTION ── */}
        <section aria-label="Brand Lookbook" className="bg-gradient-to-r from-[#FDF7F2] to-[#F2D9C3] py-8 border-b border-[#BE6E5B]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-2">Our Brand Story</p>
              <h2 className="font-display text-2xl md:text-3xl text-[#7A3D2A] font-bold">
                Explore Our Manufacturing & Seasonal Collections
              </h2>
            </div>
            <Link
              href="/lookbook"
              aria-label="View our brand lookbook and manufacturing process"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#7A3D2A] text-[#FDF7F2] rounded-sm font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#BE6E5B] transition-colors whitespace-nowrap shadow-md"
            >
              View Lookbook <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <MarqueeTicker />
        <TrustBadges />
        <CategoriesSection />
        <FeaturedProductsSection products={featuredProducts} />
        {/* <BestsellingKurtis products={bestsellingProducts} /> */}
        <ManufacturingInfoSections />
        <WhyUsSection />
        <InquiryCTASection />
        <FaqSection faqs={faqSchema.mainEntity} />
      </main>
      <Footer />
    </>
  );
}