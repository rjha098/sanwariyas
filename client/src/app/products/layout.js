// FILE: client/src/app/products/layout.js

export const metadata = {
  title: "Wholesale Ethnic Wear Catalog | SANWARIYAS",
  description: "Browse our complete catalog of premium wholesale ethnic wear. Explore high-quality kurtis, suits, and bridal export collections with factory-direct pricing.",
  alternates: { canonical: "https://www.yourdomain.com/products" }, // Replace with your actual domain
  openGraph: {
    title: "Wholesale Ethnic Wear Catalog | SANWARIYAS",
    description: "Browse our complete catalog of premium wholesale ethnic wear with factory-direct pricing.",
    url: "https://www.yourdomain.com/products",
    siteName: "SANWARIYAS Ethnic Luxury",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale Ethnic Wear Catalog | SANWARIYAS",
    description: "Browse our complete catalog of premium wholesale ethnic wear.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProductsLayout({ children }) {
  return <>{children}</>;
}