// PURPOSE: Auto-generate sitemap.xml for SEO
// NOTE: /products is intentionally excluded — the product catalog is not
// ready for public indexing yet. It is not linked from the Navbar either.
// Re-add its static entry and the productRoutes fetch block below once the
// module is production-ready.
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
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  let blogRoutes = [];

  try {
    // IMPORTANT: status: "published" is explicit here — without it the
    // public /api/blogs endpoint returns drafts too, which would otherwise
    // leak unpublished posts into the sitemap and get them indexed.
    const firstPage = await fetchBlogs({
      status: "published",
      limit: 50,
      page: 1,
    });
    let allBlogs = firstPage.data || [];
    const totalPages = firstPage.pagination?.pages || 1;

    // The public API caps limit at 50 per page — loop through any
    // additional pages so large blogs don't get silently truncated.
    for (let page = 2; page <= totalPages; page++) {
      const nextPage = await fetchBlogs({
        status: "published",
        limit: 50,
        page,
      });
      allBlogs = allBlogs.concat(nextPage.data || []);
    }

    blogRoutes = allBlogs.map((blog) => ({
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (error) {
    // console.error("Failed to fetch blogs for sitemap:", error);
  }

  return [...staticRoutes, ...blogRoutes];
}