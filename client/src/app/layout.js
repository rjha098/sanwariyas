// FILE: client/src/app/layout.js
import './globals.css';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';

export const viewport = {
  themeColor: '#FAF3E8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sanwariyas.com'),
  title: {
    default: 'SANWARIYAS — Premium Ethnic Wear Exporter & Wholesale Indian Fashion',
    template: '%s | SANWARIYAS Wholesale',
  },
  description:
    'Discover SANWARIYAS\'s curated collection of premium wholesale ethnic wear — Banarasi sarees, bridal lehengas, designer suits. Bulk sourcing with low MOQ and global shipping.',
  keywords: [
    'wholesale ethnic wear',
    'Indian fashion exporter',
    'bulk sarees',
    'wholesale lehengas',
    'kurti manufacturer India',
    'B2B clothing supplier',
    'Jaipur ethnic wear manufacturer'
  ],
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'SANWARIYAS Exports' }],
  creator: 'SANWARIYAS Exports',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'SANWARIYAS Wholesale Exports',
    title: 'SANWARIYAS — Premium Ethnic Wear Exporter',
    description:
      'Partner with SANWARIYAS for wholesale ethnic wear. Low MOQ, custom manufacturing, and global shipping for boutiques and retailers.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SANWARIYAS Export Facility',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SANWARIYAS — Wholesale Ethnic Wear',
    description: 'B2B Indian ethnic wear exporter. Low MOQ & Global Shipping.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// ✅ UPGRADED SCHEMA: Added LocalBusiness & WholesaleStore with Jaipur Address
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'WholesaleStore', 'ClothingStore'],
  name: 'SANWARIYAS Exports',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sanwariyas.com',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sanwariyas.com'}/logo.png`,
  image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sanwariyas.com'}/og-image.jpg`,
  description: 'Premium ethnic wear B2B exporter and manufacturer based in Jaipur.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop no.- 12,13, 1st floor, Shiv Plaza, near HDFC bank, Printers Colony, Dada Gurudev Nagar, Sanganer',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302029',
    addressCountry: 'IN'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9680812813',
    contactType: 'wholesale sales',
    availableLanguage: ['English', 'Hindi'],
  },
  priceRange: "$$",
  sameAs: [
    'https://www.instagram.com/sanwariyas.official',
    'https://www.facebook.com/sanwariyas.official',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SANWARIYAS Exports',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sanwariyas.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sanwariyas.com'}/products?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logooo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-[#FAF3E8] text-[#1A1A1A] min-h-screen flex flex-col">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-4 focus:bg-white focus:text-[#7A3D2A] focus:font-bold focus:shadow-md"
        >
          Skip to main content
        </a>
        
        <script    
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script    
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        
        <div className="flex-grow">
          {children}
        </div>

        <WhatsAppWidget/>
      </body>
    </html>
  );
}