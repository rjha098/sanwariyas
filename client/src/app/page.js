// FILE: client/src/app/page.js
// import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import MarqueeTicker from "@/components/home/MarqueeTicker";
import TrustBadges from "@/components/home/TrustBadges";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import ManufacturingInfoSections from "@/components/home/ManufacturingInfoSections";
import WhyUsSection from "@/components/home/WhyUsSection";
import InquiryCTASection from "@/components/home/InquiryCTASection";
import { fetchProducts } from "@/lib/api";

// SEO FIX: Highly optimized Metadata for E-commerce B2B Homepage
export const metadata = {
  title: "Wholesale Ethnic Wear Manufacturer in Jaipur | SANWARIYAS",
  description:
    "SANWARIYAS is a premier wholesale ethnic wear manufacturer and B2B exporter in Jaipur, Rajasthan. We supply premium cotton suits, kurtis, muslin, organza, and silk collections for global boutiques and retailers.",
  keywords: [
    "wholesale ethnic wear manufacturer Jaipur",
    "B2B ethnic wear exporter India",
    "cotton suit manufacturer Jaipur",
    "wholesale kurti supplier India",
    "bulk ethnic clothing manufacturer",
    "premium muslin and organza wholesale",
  ],
  alternates: { canonical: "https://sanwariyas.com/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sanwariyas.com/",
    siteName: "SANWARIYAS Wholesale",
    title: "SANWARIYAS — Wholesale Ethnic Wear Manufacturer",
    description:
      "B2B ethnic wear manufacturer. Low MOQ, custom OEM manufacturing, and global shipping for fashion boutiques.",
    images: [
      {
        url: "/images/og-home.png",
        width: 1200,
        height: 630,
        alt: "SANWARIYAS Wholesale Ethnic Wear",
      },
    ],
  },
  robots: { index: true, follow: true },
};

// ✅ SEO FIX: Robust Schema for Homepage (Organization, Website Sitelinks, and FAQ)
const homepageSchema = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I place a wholesale order at SANWARIYAS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Browse our catalog, select your styles, and fill out the inquiry form. Our export team responds within 24 hours.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer customization on ethnic wear?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we offer full OEM/Contract manufacturing including fabric selection and private labeling.",
        },
      },
    ],
  },
];

async function getFeaturedProducts() {
  try {
    const data = await fetchProducts({ featured: "true", limit: 4 });
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />
      {/* <Navbar /> */}
      <main id="main-content">
        <HeroSection />

        {/* ── LOOKBOOK TEASER SECTION ── */}
        <section
          aria-label="Brand Lookbook"
          className="bg-gradient-to-r from-[#FDF7F2] to-[#F2D9C3] py-8 border-b border-[#BE6E5B]/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#BE6E5B] font-bold mb-2">
                Our Brand Story
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-[#7A3D2A] font-bold">
                Explore Our Manufacturing & Seasonal Collections
              </h2>
            </div>
            <Link
              href="/lookbook"
              title="Explore SANWARIYAS Wholesale Lookbook"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#7A3D2A] text-[#FDF7F2] rounded-sm font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#BE6E5B] transition-colors shadow-md"
            >
              View Lookbook <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <MarqueeTicker />
        <CategoriesSection />
        <FeaturedProductsSection products={featuredProducts} />
        <ManufacturingInfoSections />
        <TrustBadges />

        <WhyUsSection />
        <InquiryCTASection />
      </main>
      <Footer />
    </>
  );
}
