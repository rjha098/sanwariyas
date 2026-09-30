// FILE: client/src/app/contact/layout.js

export const metadata = {
  title: "Contact SANWARIYAS | Wholesale Ethnic Wear Supplier & Manufacturer",
  description: "Get in touch with SANWARIYAS, Jaipur's leading wholesale ethnic wear and cotton suit manufacturer. Send your B2B bulk inquiry for premium kurtis and suits.",
 keywords: [
    "Wholesale Ethnic Wear Supplier Contact", 
    "Jaipur Ethnic Wear Manufacturer", 
    "B2B Ethnic Wear Supplier", 
    "Cotton Suit Manufacturer Jaipur", 
    "Wholesale Kurti Supplier India"
  ],
  alternates: {
    canonical: "https://sanwariyas.com/contact",
  },
  openGraph: {
    title: "Contact SANWARIYAS | Wholesale Ethnic Wear Supplier",
    description: "Send your B2B bulk inquiry for premium wholesale ethnic wear to SANWARIYAS, Jaipur.",
    url: "https://sanwariyas.com/contact",
    siteName: "SANWARIYAS",
    images: [
      {
        url: "https://sanwariyas.com/images/og-contact.png",
        width: 1200,
        height: 630,
        alt: "Contact SANWARIYAS Ethnic Wear",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact SANWARIYAS | Wholesale Ethnic Wear Supplier & Manufacturer",
    description: "Get in touch with SANWARIYAS, Jaipur's leading wholesale ethnic wear and cotton suit manufacturer.",
    images: ["https://sanwariyas.com/images/og-contact.png"],
  },
};

export default function ContactLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "mainEntity": {
                "@type": "Organization",
                "name": "SANWARIYAS",
                "url": "https://sanwariyas.com",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+91-9680812813",
                  "contactType": "Wholesale Sales & Export",
                  "email": "hrsanwariyas@gmail.com",
                  "areaServed": "Worldwide",
                  "availableLanguage": ["English", "Hindi"]
                }
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "SANWARIYAS - Premium Ethnic Wear Manufacturer",
              "image": "https://sanwariyas.com/images/logooo.png",
              "telephone": "+91-9680812813",
              "email": "hrsanwariyas@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Shop no. - 12,13, 1st floor, Shiv Plaza, near HDFC Bank, Dada Gurudev Nagar, Sanganer",
                "addressLocality": "Jaipur",
                "addressRegion": "Rajasthan",
                "postalCode": "302029",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 26.8131804,
                "longitude": 75.8037149
              },
              "url": "https://sanwariyas.com/contact"
            }
          ])
        }}
      />
      {children}
    </>
  );
}