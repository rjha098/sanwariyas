// // PURPOSE: The HOME PAGE — shown at URL "/"

// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { fetchProducts } from "@/lib/api";

// // Here are your correct paths pointing to D:\SC\project-root\client\src\components\home

// {
//   /* HERO SECTION — full screen with background image */
// }
// {
//   /* CATEGORY GRID — 4 categories with hover images */
// }
// {
//   /* FEATURED PRODUCTS — 4 products from DB */
// }
// {
//   /* WHY US — 4 feature boxes */
// }
// {
//   /* INQUIRY CTA — call to action */
// }
// {
//   /* FAQ — accordion with schema */
// }

// import HeroSection from "@/components/home/HeroSection";
// import MarqueeTicker from "@/components/home/MarqueeTicker";
// import CategoriesSection from "@/components/home/CategoriesSection";
// import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
// import WhyUsSection from "@/components/home/WhyUsSection";
// import InquiryCTASection from "@/components/home/InquiryCTASection";
// import FaqSection from "@/components/home/FaqSection";

// /* NOTE: If your Next.js doesn't support the @ alias, you can use these relative paths instead:
//   import HeroSection from '../components/home/HeroSection';
//   import MarqueeTicker from '../components/home/MarqueeTicker';
//   import CategoriesSection from '../components/home/CategoriesSection';
//   import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
//   import WhyUsSection from '../components/home/WhyUsSection';
//   import InquiryCTASection from '../components/home/InquiryCTASection';
//   import FaqSection from '../components/home/FaqSection';
// */

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
//   const featuredProducts = await getFeaturedProducts();

//   return (
//     <>
//       {/* JSON-LD SEO Schema */}

//       <Navbar />

//       {/* <HeroSection />
//        */}

//       <div className="pt-[72px] md:pt-[80px]">
//         <HeroSection />
//       </div>

//       <MarqueeTicker />
//       <CategoriesSection />

//       {/* Pass the featured products fetched from the server down to the component */}
//       <FeaturedProductsSection products={featuredProducts} />

//       <WhyUsSection />
//       <InquiryCTASection />

//       {/* Pass the FAQ data down to the component */}
//       <FaqSection faqs={faqSchema.mainEntity} />

//       <Footer />

//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
//       />
//     </>
//   );
// }


// PURPOSE: The HOME PAGE — shown at URL "/"

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchProducts } from "@/lib/api";

// Here are your correct paths pointing to D:\SC\project-root\client\src\components\home

{
  /* HERO SECTION — full screen with background image */
}
{
  /* CATEGORY GRID — 4 categories with hover images */
}
{
  /* FEATURED PRODUCTS — 4 products from DB */
}
{
  /* WHY US — 4 feature boxes */
}
{
  /* INQUIRY CTA — call to action */
}
{
  /* FAQ — accordion with schema */
}

import HeroSection from "@/components/home/HeroSection";
import MarqueeTicker from "@/components/home/MarqueeTicker";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import ManufacturingInfoSections from "@/components/home/ManufacturingInfoSections";
import InquiryCTASection from "@/components/home/InquiryCTASection";
import FaqSection from "@/components/home/FaqSection";

/* NOTE: If your Next.js doesn't support the @ alias, you can use these relative paths instead:
  import HeroSection from '../components/home/HeroSection';
  import MarqueeTicker from '../components/home/MarqueeTicker';
  import CategoriesSection from '../components/home/CategoriesSection';
  import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
  import WhyUsSection from '../components/home/WhyUsSection';
  import InquiryCTASection from '../components/home/InquiryCTASection';
  import FaqSection from '../components/home/FaqSection';
*/

export const metadata = {
  title: "SANWARIYAS — Premium Ethnic Wear & Luxury Indian Fashion",
  description:
    "Explore SANWARIYAS's curated collection of premium ethnic wear. Authentic Banarasi sarees, bridal lehengas, designer suits. Send inquiry for pricing.",
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I place an order at SANWARIYAS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Browse our collection, select your desired product, and send us an inquiry. Our team will contact you within 24 hours to discuss pricing, customization, and delivery.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer customization on ethnic wear?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer customization on most pieces including size alterations, blouse stitching, and color variations. Mention your requirements in the inquiry form.",
      },
    },
    {
      "@type": "Question",
      name: "What is the delivery timeline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard delivery takes 7–10 business days. Custom orders may take 15–21 days. Express delivery is available for select locations.",
      },
    },
  ],
};

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Navbar />

      {/* ✅ A11Y: Wrapped the entire page content in <main id="main-content"> for landmark navigation */}
      <main id="main-content">
        <div className="pt-[72px] md:pt-[80px]">
          <HeroSection />
        </div>

        <MarqueeTicker />
        <CategoriesSection />

        {/* Pass the featured products fetched from the server down to the component */}
        <FeaturedProductsSection products={featuredProducts} />

        <WhyUsSection />
        <ManufacturingInfoSections />
        <InquiryCTASection />

        {/* Pass the FAQ data down to the component */}
        <FaqSection faqs={faqSchema.mainEntity} />
      </main>

      <Footer />

      {/* ✅ SEO: Added ID to script tag for better Next.js hydration tracking */}
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}  
