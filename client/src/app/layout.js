
// import './globals.css';
// import WhatsAppWidget from '@/components/ui/WhatsAppWidget';

// export const metadata = {
//   metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com'),
//   title: {
//     default: 'SANWARIYAS — Premium Ethnic Wear & Luxury Indian Fashion',
//     template: '%s | SANWARIYAS Ethnic Luxury',
//   },
//   description:
//     'Discover SANWARIYAS\'s curated collection of premium ethnic wear — Banarasi sarees, bridal lehengas, designer suits, and more. Send inquiry for pricing and availability.',
//   keywords: [
//     'ethnic wear',
//     'Indian fashion',
//     'sarees',
//     'lehengas',
//     'bridal wear',
//     'Banarasi saree',
//     'designer suits',
//     'luxury Indian clothing',
//   ],
//   authors: [{ name: 'SANWARIYAS Fashion' }],
//   creator: 'SANWARIYAS Fashion',
//   openGraph: {
//     type: 'website',
//     locale: 'en_IN',
//     url: '/',
//     siteName: 'SANWARIYAS Ethnic Luxury',
//     title: 'SANWARIYAS — Premium Ethnic Wear & Luxury Indian Fashion',
//     description:
//       'Explore our curated collection of premium ethnic wear. Authentic Banarasi sarees, bridal lehengas, designer suits and more.',
//     images: [
//       {
//         url: '/og-image.jpg',
//         width: 1200,
//         height: 630,
//         alt: 'SANWARIYAS Ethnic Luxury Fashion',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'SANWARIYAS — Premium Ethnic Wear',
//     description: 'Luxury Indian ethnic wear collection. Sarees, Lehengas, Suits & more.',
//     images: ['/og-image.jpg'],
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },
// };

// const organizationSchema = {
//   '@context': 'https://schema.org',
//   '@type': 'Organization',
//   name: 'SANWARIYAS Ethnic Luxury',
//   url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com',
//   logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com'}/logo.png`,
//   description: 'Premium ethnic wear and luxury Indian fashion brand',
//   contactPoint: {
//     '@type': 'ContactPoint',
//     telephone: '+91-XXXXXXXXXX',
//     contactType: 'customer service',
//     availableLanguage: ['English', 'Hindi'],
//   },
//   sameAs: [
//     'https://www.instagram.com/SANWARIYASfashion',
//     'https://www.facebook.com/SANWARIYASfashion',
//   ],
// };

// const websiteSchema = {
//   '@context': 'https://schema.org',
//   '@type': 'WebSite',
//   name: 'SANWARIYAS Ethnic Luxury',
//   url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com',
//   potentialAction: {
//     '@type': 'SearchAction',
//     target: {
//       '@type': 'EntryPoint',
//       urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com'}/products?search={search_term_string}`,
//     },
//     'query-input': 'required name=search_term_string',
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
//       <head>
//         <link rel="icon" href="/images/logoo.png" type="image/png" />
//         <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
//         {/* CHANGED: Theme color matched to Light Premium Cream background */}
//         <meta name="theme-color" content="#FAF3E8" />
//       </head>
//       {/* CHANGED: Removed custom classes and added standard premium background & text colors */}
//       <body suppressHydrationWarning className="font-sans antialiased bg-[#FAF3E8] text-[#1A1A1A] min-h-screen flex flex-col">
        
//         {/* We moved the scripts here to avoid <head> hydration issues */}
//         <script    
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
//         />
//         <script    
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
//         />
        
//         <div className="flex-grow">
//           {children}
//         </div>

//         <WhatsAppWidget/>
//       </body>
//     </html>
//   );
// }



import './globals.css';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';

// ✅ SEO: Separated viewport configuration (Next.js 14+ Best Practice)
export const viewport = {
  themeColor: '#FAF3E8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allows visually impaired users to zoom in
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com'),
  title: {
    default: 'SANWARIYAS — Premium Ethnic Wear & Luxury Indian Fashion',
    template: '%s | SANWARIYAS Ethnic Luxury',
  },
  description:
    'Discover SANWARIYAS\'s curated collection of premium ethnic wear — Banarasi sarees, bridal lehengas, designer suits, and more. Send inquiry for pricing and availability.',
  keywords: [
    'ethnic wear',
    'Indian fashion',
    'sarees',
    'lehengas',
    'bridal wear',
    'Banarasi saree',
    'designer suits',
    'luxury Indian clothing',
  ],
  authors: [{ name: 'SANWARIYAS Fashion' }],
  creator: 'SANWARIYAS Fashion',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'SANWARIYAS Ethnic Luxury',
    title: 'SANWARIYAS — Premium Ethnic Wear & Luxury Indian Fashion',
    description:
      'Explore our curated collection of premium ethnic wear. Authentic Banarasi sarees, bridal lehengas, designer suits and more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SANWARIYAS Ethnic Luxury Fashion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SANWARIYAS — Premium Ethnic Wear',
    description: 'Luxury Indian ethnic wear collection. Sarees, Lehengas, Suits & more.',
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SANWARIYAS Ethnic Luxury',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com'}/logo.png`,
  description: 'Premium ethnic wear and luxury Indian fashion brand',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-XXXXXXXXXX',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.instagram.com/SANWARIYASfashion',
    'https://www.facebook.com/SANWARIYASfashion',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SANWARIYAS Ethnic Luxury',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com'}/products?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logoo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-[#FAF3E8] text-[#1A1A1A] min-h-screen flex flex-col">
        
        {/* ✅ A11Y: Skip to main content link for keyboard users. This is invisible until focused. */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-4 focus:bg-white focus:text-[#7A3D2A] focus:font-bold focus:shadow-md"
        >
          Skip to main content
        </a>
        
        {/* ✅ SEO: Added ID to script tags for better Next.js hydration tracking */}
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