// // PURPOSE: Auto-generate sitemap.xml for SEO
// import { fetchProducts } from '@/lib/api';

// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com';

// export default async function sitemap()
//     // Static pages — manually listed, priority 1.0 = most important

// {
//   const staticRoutes = [
//     { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
//     { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
//     { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
//   ];

//   let productRoutes = [];
//   try {
//     const data = await fetchProducts({ limit: 500 });
//     productRoutes = (data.products || []).map((p) => ({
//       url: `${SITE_URL}/products/${p.slug}`,
//           // lastModified tells Google when this page last changed
//       lastModified: new Date(p.updatedAt || p.createdAt),
//       changeFrequency: 'weekly',
//       priority: 0.8,
//     }));
//   } catch {}

//   return [...staticRoutes, ...productRoutes];
// }



// PURPOSE: Auto-generate sitemap.xml for SEO
import { fetchProducts } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com';

export default async function sitemap() {
  // ✅ SEO: Added ALL static pages (including About and Export Docs) so Google crawls the entire site.
  // Priority 1.0 = most important (Home), 0.9-0.8 = main directories, 0.7 = info pages.
  const staticRoutes = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/exportdocs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  let productRoutes = [];
  try {
    const data = await fetchProducts({ limit: 500 });
    productRoutes = (data.products || []).map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      // lastModified tells Google when this specific product page last changed
      lastModified: new Date(p.updatedAt || p.createdAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    // Silently fail if DB is unreachable, but still return static routes to keep SEO intact
    console.error("Failed to fetch products for sitemap:", error);
  }

  return [...staticRoutes, ...productRoutes];
}