// FILE: client/src/app/lookbook/layout.js
export const metadata = {
  title: "Wholesale Ethnic Wear Lookbook | SANWARIYAS Manufacturer",
  description:
    "Explore the SANWARIYAS lookbook for trending wholesale cotton suits, kurtis, and ethnic wear collections manufactured in Jaipur for global B2B boutiques.",

  keywords: [
    "Wholesale Ethnic Wear Lookbook",
    "Wholesale Boutique Clothing Supplier",
    "Jaipur Ethnic Wear Manufacturer",
    "Cotton Suit Manufacturer Jaipur",
    "B2B Ethnic Wear Supplier",
  ],

  alternates: { canonical: "https://sanwariyas.com/lookbook" },
  openGraph: {
    title: "Wholesale Ethnic Wear Lookbook | SANWARIYAS Manufacturer",
    description:
      "Explore seasonal shoots and trending designs from India's premium wholesale ethnic wear manufacturer.",
    url: "https://sanwariyas.com/lookbook",
    siteName: "SANWARIYAS",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://sanwariyas.com/images/og-lookbook.png",
        width: 1200,
        height: 630,
        alt: "SANWARIYAS Wholesale Ethnic Wear Lookbook",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale Ethnic Wear Lookbook | SANWARIYAS",
    description:
      "Explore our manufacturing process and seasonal shoots for B2B boutiques.",
    images: ["https://sanwariyas.com/images/og-lookbook.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function LookbookLayout({ children }) {
  return (
    <>
      {/* ✅ SEO FIX: Injected CollectionPage and BreadcrumbList Schema for Semantic SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "SANWARIYAS Wholesale Ethnic Wear Lookbook",
              description:
                "A curated collection of trending wholesale cotton suits, kurtis, and ethnic wear designs manufactured in Jaipur.",
              url: "https://sanwariyas.com/lookbook",
              publisher: {
                "@type": "Organization",
                name: "SANWARIYAS",
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
                  name: "Lookbook",
                  item: "https://sanwariyas.com/lookbook",
                },
              ],
            },
          ]),
        }}
      />
      {children}
    </>
  );
}
