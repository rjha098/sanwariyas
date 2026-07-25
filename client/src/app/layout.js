import "./globals.css";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import { AppProviders } from "@/providers/AppProviders";
import { CartProvider } from "@/providers/CartProvider";
import InquiryModal from "@/components/ui/InquiryModal";
import Navbar from "@/components/layout/Navbar";

export const viewport = {
  themeColor: "#FAF3E8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://sanwariyas.com",
  ),
  title: {
    default:
      "SANWARIYAS — Premium Ethnic Wear Manufacturer & Wholesale Supplier",
    template: "%s | SANWARIYAS Wholesale",
  },
  description:
    "SANWARIYAS is a premium B2B ethnic wear manufacturer in Jaipur. We supply wholesale cotton suits, kurtis, anarkalis, and co-ord sets with low MOQ and global export shipping.",
  keywords: [
    "wholesale ethnic wear manufacturer",
    "wholesale kurti supplier India",
    "cotton suit manufacturer Jaipur",
    "B2B ethnic wear exporter",
    "wholesale ethnic clothing for boutiques",
    "custom manufacturing ethnic wear",
    "global wholesale fashion supplier",
  ],
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "SANWARIYAS Exports" }],
  creator: "SANWARIYAS Exports",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "SANWARIYAS",
    title: "SANWARIYAS — Premium Ethnic Wear Manufacturer",
    description:
      "Partner with SANWARIYAS for wholesale ethnic wear. Low MOQ, custom manufacturing, and global shipping for retailers.",
    images: [
      {
        url: "/images/og-home.png",
        width: 1200,
        height: 630,
        alt: "SANWARIYAS Export Facility Jaipur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SANWARIYAS — Wholesale Ethnic Wear Manufacturer",
    description:
      "B2B Indian ethnic wear manufacturer. Low MOQ & Global Shipping.",
    images: ["/images/og-home.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "WholesaleStore", "ClothingStore"],
  name: "SANWARIYAS Exports",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sanwariyas.com",
  inLanguage: "en-IN",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sanwariyas.com"}/images/logooo.png`,
  image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sanwariyas.com"}/images/og-home.png`,
  description:
    "Premium ethnic wear B2B manufacturer and exporter based in Jaipur, India.",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Shop no.- 12,13, 1st floor, Shiv Plaza, near HDFC bank, Printers Colony, Dada Gurudev Nagar, Sanganer",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302029",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9680812813",
    contactType: "wholesale sales",
    availableLanguage: ["English", "Hindi"],
  },
  priceRange: "$$",
  sameAs: [
    "https://www.instagram.com/sanwariyas.official",
    "https://www.facebook.com/sanwariyas.official",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SANWARIYAS Exports",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sanwariyas.com",
  inLanguage: "en-IN",
  publisher: {
    "@type": "Organization",
    name: "SANWARIYAS Exports",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://sanwariyas.com",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sanwariyas.com"}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logooo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-[#FAF3E8] text-[#1A1A1A] min-h-screen flex flex-col"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-4 focus:bg-white focus:text-[#7A3D2A] focus:font-bold focus:shadow-md"
        >
          Skip to main content
        </a>

        <script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/*  FIX: AppProviders properly wrapping EVERYTHING that needs Auth */}

        <AppProviders>
          <CartProvider>
            <Navbar />
            <div className="flex-grow pt-[80px]">{children}</div>
            <WhatsAppWidget />
            <InquiryModal />
          </CartProvider>
        </AppProviders>
      </body>
    </html>
  );
}
