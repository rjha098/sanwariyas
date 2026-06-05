// FILE: client/src/app/lookbook/layout.js

export const metadata = {
  title: "Lookbook & Brand Story | SANWARIYAS Ethnic Luxury",
  description: "Explore our manufacturing process, seasonal shoots, and trending ethnic wear designs curated for global wholesale boutiques.",
  alternates: { canonical: "https://www.yourdomain.com/lookbook" }, // Replace with your actual live domain
  openGraph: {
    title: "Lookbook | SANWARIYAS Wholesale Ethnic Wear",
    description: "Explore our manufacturing process, seasonal shoots, and trending designs.",
    url: "https://www.yourdomain.com/lookbook",
    siteName: "SANWARIYAS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lookbook | SANWARIYAS Ethnic Luxury",
    description: "Explore our manufacturing process and seasonal shoots.",
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
  return <>{children}</>;
}