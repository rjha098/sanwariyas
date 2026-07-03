// FILE: client/src/app/products/layout.js

export const metadata = {
  title: "Wholesale Ethnic Wear Catalog | SANWARIYAS Manufacturer",
  description:
    "Browse the SANWARIYAS wholesale ethnic wear catalog. Source high-quality cotton suits, kurtis, and co-ord sets with factory-direct B2B pricing from Jaipur.",

  keywords: [
    "Wholesale Ethnic Wear Catalog",
    "Wholesale Kurti Supplier India",
    "Cotton Suit Manufacturer Jaipur",
    "B2B Ethnic Wear Supplier",
    "Jaipur Ethnic Wear Manufacturer",
  ],

  alternates: { canonical: "https://sanwariyas.com/products" },
  openGraph: {
    title: "Wholesale Ethnic Wear Catalog | SANWARIYAS Manufacturer",
    description:
      "Browse our complete catalog of premium wholesale ethnic wear with factory-direct pricing from India.",
    url: "https://sanwariyas.com/products",
    siteName: "SANWARIYAS Ethnic Luxury",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://sanwariyas.com/images/og-products.png",
        width: 1200,
        height: 630,
        alt: "SANWARIYAS Wholesale Ethnic Wear Catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale Ethnic Wear Catalog | SANWARIYAS",
    description:
      "Browse our complete catalog of premium wholesale cotton suits and ethnic wear.",
    images: ["https://sanwariyas.com/images/og-products.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProductsLayout({ children }) {
  return (
    <>
      {/* ✅ SEO FIX: Injected CollectionPage Schema for the entire catalog route */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "SANWARIYAS Wholesale Ethnic Wear Catalog",
            description:
              "A comprehensive catalog of premium wholesale cotton suits, kurtis, and ethnic wear collections manufactured in Jaipur for global B2B boutiques.",
            url: "https://sanwariyas.com/products",
            publisher: {
              "@type": "Organization",
              name: "SANWARIYAS",
              logo: {
                "@type": "ImageObject",
                url: "https://sanwariyas.com/images/logooo.png",
              },
            },
          }),
        }}
      />
      {children}
    </>
  );
}
