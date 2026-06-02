// // FILE: client/src/app/page.js
// // PURPOSE: The HOME PAGE — shown at URL "/"

// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { fetchProducts } from "@/lib/api";

// import HeroSection from "@/components/home/HeroSection";
// import MarqueeTicker from "@/components/home/MarqueeTicker";
// import TrustBadges from "@/components/home/TrustBadges";
// import CategoriesSection from "@/components/home/CategoriesSection";
// import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
// import BestsellingKurtis from "@/components/home/BestsellingKurtis";
// import ManufacturingInfoSections from "@/components/home/ManufacturingInfoSections";
// import WhyUsSection from "@/components/home/WhyUsSection";
// import InquiryCTASection from "@/components/home/InquiryCTASection";
// import FaqSection from "@/components/home/FaqSection";

// export const metadata = {
//   title: "SANWARIYAS — Premium Ethnic Wear & Luxury Indian Fashion",
//   description:
//     "Explore SANWARIYAS's curated collection of premium ethnic wear. Authentic Banarasi sarees, bridal lehengas, designer suits. Send inquiry for pricing.",
//   alternates: { canonical: "/" },
// };

// async function getFeaturedProducts() {
//   try {
//     const data = await fetchProducts({ featured: "true", limit: 4 });
//     return data.products || [];
//   } catch {
//     return [];
//   }
// }

// async function getBestsellingProducts() {
//   try {
//     const data = await fetchProducts({ limit: 6 });
//     return data.products || [];
//   } catch {
//     return [];
//   }
// }

// const faqSchema = {
//   "@context": "https://schema.org",
//   "@type": "FAQPage",
//   mainEntity: [
//     {
//       "@type": "Question",
//       name: "How do I place an order at SANWARIYAS?",
//       acceptedAnswer: {
//         "@type": "Answer",
//         text: "Browse our collection, select your desired product, and send us an inquiry. Our team will contact you within 24 hours to discuss pricing, customization, and delivery.",
//       },
//     },
//     {
//       "@type": "Question",
//       name: "Do you offer customization on ethnic wear?",
//       acceptedAnswer: {
//         "@type": "Answer",
//         text: "Yes, we offer customization on most pieces including size alterations, blouse stitching, and color variations. Mention your requirements in the inquiry form.",
//       },
//     },
//     {
//       "@type": "Question",
//       name: "What is the delivery timeline?",
//       acceptedAnswer: {
//         "@type": "Answer",
//         text: "Standard delivery takes 7–10 business days. Custom orders may take 15–21 days. Express delivery is available for select locations.",
//       },
//     },
//   ],
// };

// export default async function HomePage() {
//   const [featuredProducts, bestsellingProducts] = await Promise.all([
//     getFeaturedProducts(),
//     getBestsellingProducts(),
//   ]);

//   return (
//     <>
//       <Navbar />

//       <main id="main-content">

//         {/* 1. HERO — full-screen carousel */}
//         <div className="pt-[72px] md:pt-[80px]">
//           <HeroSection />
//         </div>

//         {/* 2. MARQUEE — trending styles ticker */}
//         <MarqueeTicker />

//         {/* 3. TRUST BADGES — buyer confidence bar */}
//         <TrustBadges />

//         {/* 4. CATEGORIES — wholesale kurti category grid */}
//         <CategoriesSection />

//         {/* 5. FEATURED PRODUCTS — 4 hand-picked from DB */}
//         <FeaturedProductsSection products={featuredProducts} />

//         {/* 6. BESTSELLING KURTIS — ranked horizontal scroll strip */}
//         <BestsellingKurtis products={bestsellingProducts} />

//         {/* 7. MANUFACTURING — process videos + customer reviews */}
//         <ManufacturingInfoSections />

//         {/* 8. WHY US — 6 USP cards */}
//         <WhyUsSection />

//         {/* 9. INQUIRY CTA — contact + send inquiry */}
//         <InquiryCTASection />

//         {/* 10. FAQ — accordion */}
//         <FaqSection faqs={faqSchema.mainEntity} />

//       </main>

//       <Footer />

//       <script
//         id="faq-schema"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
//       />
//     </>
//   );
// }

 

// FILE: client/src/app/page.js
// PURPOSE: The HOME PAGE — shown at URL "/"

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchProducts } from "@/lib/api";

import HeroSection from "@/components/home/HeroSection";
import MarqueeTicker from "@/components/home/MarqueeTicker";
import TrustBadges from "@/components/home/TrustBadges";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import BestsellingKurtis from "@/components/home/BestsellingKurtis";
import ManufacturingInfoSections from "@/components/home/ManufacturingInfoSections";
import WhyUsSection from "@/components/home/WhyUsSection";
import InquiryCTASection from "@/components/home/InquiryCTASection";
import FaqSection from "@/components/home/FaqSection";

export const metadata = {
  title: "SANWARIYAS — Premium Ethnic Wear Exporter & Wholesale Indian Fashion",
  description:
    "Partner with SANWARIYAS for wholesale ethnic wear. Low MOQ, custom manufacturing, and global shipping for boutiques and retailers. Send inquiry for B2B pricing.",
  alternates: { canonical: "/" },
};

async function getFeaturedProducts() {
  try {
    const data = await fetchProducts({ featured: "true", limit: 4 });
    return data.products || [];
  } catch {
    return [];
  }
}

async function getBestsellingProducts() {
  try {
    const data = await fetchProducts({ limit: 6 });
    return data.products || [];
  } catch {
    return [];
  }
}

// ✅ FIXED: Updated SEO Schema to match strict B2B Export Terminology
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I place an order at SANWARIYAS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply browse our wholesale catalogue, select the styles you want to source, and fill out the bulk inquiry form with your requirements — quantity, size distribution, and international shipping address. Our export desk will get back to you within 24 hours with a custom proforma quotation.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer customization on ethnic wear?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — we offer full contract manufacturing support including custom fabric selection, custom size specifications, custom embroidery, print production, and private label/OEM solutions. Detail your specifications in the B2B inquiry form.",
      },
    },
    {
      "@type": "Question",
      name: "What is the delivery timeline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ready inventory lots are dispatched within 5–7 business days. Custom commercial manufacturing orders typically require 15–21 business days based on manufacturing load and design complexity. Timelines are committed upfront before booking.",
      },
    },
  ],
};

export default async function HomePage() {
  const [featuredProducts, bestsellingProducts] = await Promise.all([
    getFeaturedProducts(),
    getBestsellingProducts(),
  ]);

  return (
    <>
      <Navbar />
      <main id="main-content">
        <div className="pt-[72px] md:pt-[80px]">
          <HeroSection />
        </div>
        <MarqueeTicker />
        <TrustBadges />
        <CategoriesSection />
        <FeaturedProductsSection products={featuredProducts} />
        <BestsellingKurtis products={bestsellingProducts} />
        <ManufacturingInfoSections />
        <WhyUsSection />
        <InquiryCTASection />
        <FaqSection faqs={faqSchema.mainEntity} />
      </main>
      <Footer />
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}



