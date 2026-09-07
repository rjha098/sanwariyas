// PURPOSE: Auto-generate robots.txt so it always reflects the real
// production domain and the real private/internal routes. This replaces
// the old static public/robots.txt, which was stale (pointed at
// localhost, and disallowed "/admin" — a route that doesn't exist in this
// app; the real admin route is /operations-center).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sanwariyas.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/operations-center",
        "/operations-center/",
        "/dashboard",
        "/login",
        "/cart",
        "/checkout",
        "/my-orders",
        "/my-orders/",
        "/my-inquiries",
        "/my-inquiries/",
        "/products", // not ready for public indexing yet
        "/products/",
        "/api/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}