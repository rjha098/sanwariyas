// PURPOSE: Auto-generate sitemap.xml for SEO
import { fetchProducts } from "@/lib/api";
import { fetchBlogs } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sanwariyas.com";

export default async function sitemap() {
  const staticRoutes = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/lookbook`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/exportdocs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let productRoutes = [];

  let blogRoutes = [];

  try {
    const data = await fetchProducts({ limit: 500 });
    productRoutes = (data.products || []).map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      // lastModified tells Google when this specific product page last changed
      lastModified: new Date(p.updatedAt || p.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    // Silently fail if DB is unreachable, but still return static routes to keep SEO intact
    console.error("Failed to fetch products for sitemap:", error);
  }

  try {
    const data = await fetchBlogs({ limit: 500 });

    blogRoutes = (data.data || []).map((blog) => ({
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch blogs for sitemap:", error);
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
