// FILE: client/src/app/login/layout.js
// SEO FIX: Optimized Meta Title, Description, and updated placeholder URLs to absolute production URLs.
export const metadata = {
  title: "B2B Wholesale Portal Login | SANWARIYAS Ethnic Wear Manufacturer",
  description:
    "Sign in to your SANWARIYAS B2B wholesale dashboard or register for exclusive access to premium ethnic wear, cotton suits, and kurtis manufactured in Jaipur.",
  keywords:
    "B2B Wholesale Portal Login, Jaipur Ethnic Wear Manufacturer, Wholesale Kurti Supplier India, B2B Ethnic Wear Supplier",
  alternates: { canonical: "https://sanwariyas.com/login" },
  openGraph: {
    title: "B2B Wholesale Portal Login | SANWARIYAS",
    description:
      "Sign in to your SANWARIYAS wholesale dashboard to access premium Indian ethnic wear manufacturing and bulk ordering.",
    url: "https://sanwariyas.com/login",
    siteName: "SANWARIYAS",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://sanwariyas.com/images/og-login.png",
        width: 1200,
        height: 630,
        alt: "SANWARIYAS B2B Wholesale Portal Login",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B Wholesale Portal Login | SANWARIYAS",
    description: "Access your SANWARIYAS B2B wholesale dashboard.",
    images: ["https://sanwariyas.com/images/og-login.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }) {
  return (
    <>
      {/* ✅ SEO FIX: Injected LoginAction and RegisterAction Schema for better Semantic SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "B2B Wholesale Portal Login | SANWARIYAS",
            description: "Sign in to your SANWARIYAS B2B wholesale dashboard.",
            url: "https://sanwariyas.com/login",
            potentialAction: [
              {
                "@type": "LoginAction",
                target: "https://sanwariyas.com/login",
              },
              {
                "@type": "RegisterAction",
                target: "https://sanwariyas.com/login",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
