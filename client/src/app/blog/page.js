// FILE: client/src/app/blog/page.js
import Link from "next/link";

const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000/api"
).replace(/\/api\/?$/, "");

//  SEO FIX: Next.js 14 Server-Side Metadata API
export const metadata = {
  title: "Wholesale Ethnic Wear Journal & Blog | SANWARIYAS",
  description:
    "Explore the SANWARIYAS journal for insights on wholesale ethnic wear, cotton suits, and kurtis. News and trends from India's premium B2B ethnic wear manufacturer.",
  keywords:
    "Wholesale Ethnic Wear Journal, Indian Ethnic Wear Manufacturer, Wholesale Kurti Supplier India, B2B Ethnic Wear Supplier, Cotton Suit Manufacturer Jaipur",
  alternates: {
    canonical: "https://sanwariyas.com/blog",
  },
  openGraph: {
    title: "Wholesale Ethnic Wear Journal & Blog | SANWARIYAS",
    description:
      "Explore the SANWARIYAS journal for insights on wholesale ethnic wear, cotton suits, kurtis, manufacturing trends, and B2B fashion business updates.",
    url: "https://sanwariyas.com/blog",
    siteName: "SANWARIYAS",
    images: [
      {
        url: "https://sanwariyas.com/images/og-blog.png",
        width: 1200,
        height: 630,
        alt: "Wholesale Ethnic Wear Journal - SANWARIYAS",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale Ethnic Wear Journal & Blog | SANWARIYAS",
    description:
      "Explore the SANWARIYAS journal for insights on wholesale ethnic wear, cotton suits, kurtis, manufacturing trends, and B2B fashion business updates.",
    images: ["https://sanwariyas.com/images/og-blog.png"],
  },
};

//  APP ROUTER FIX: Converted to a Server Component to pre-render the blog list for SEO

export default async function BlogListingPage() {
  let blogs = [];

  try {
    const res = await fetch(`${BACKEND_URL}/api/blogs?status=published`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      blogs = data?.data || [];
    }
  } catch (err) {
    // console.error("Failed to fetch blogs", err);
  }

  return (
    <div className="min-h-screen bg-[#FAF3E8] py-16 px-4 sm:px-6 lg:px-8">
      {/*SEO FIX: Dynamic CollectionPage and Blog Schema rendered safely on the server */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "SANWARIYAS Wholesale Ethnic Wear Journal",
              description:
                "Insights, trends, and updates from India's premium wholesale ethnic wear and cotton suit manufacturer.",
              url: "https://sanwariyas.com/blog",
              publisher: {
                "@type": "Organization",
                name: "SANWARIYAS",
                logo: {
                  "@type": "ImageObject",
                  url: "https://sanwariyas.com/images/logooo.png",
                },
              },
              blogPost: blogs.map((blog) => ({
                "@type": "BlogPosting",
                headline: blog.title,
                url: `https://sanwariyas.com/blog/${blog.slug}`,
                datePublished: blog.createdAt,
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://sanwariyas.com/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Journal",
                  item: "https://sanwariyas.com/blog",
                },
              ],
            },
          ]),
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-[#574325] mb-4">
            Wholesale Ethnic Wear Journal & Industry Insights
          </h1>

          <p className="font-sans text-sm text-[#a07f61] max-w-2xl mx-auto">
            Discover the latest trends, styling tips, manufacturing insights,
            and industry updates from SANWARIYAS, a Wholesale Ethnic Wear
            Supplier India, Indian Ethnic Wear Manufacturer, and B2B Ethnic Wear
            Supplier.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-[#a07f61]">
            <p>No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                href={`/blog/${blog.slug}`}
                key={blog._id}
                title={`Read ${blog.title} - SANWARIYAS Ethnic Wear Manufacturer Journal`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#E8D5A3]/40"
              >
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden bg-[#FAF3E8]">
                  {blog.featuredImage ? (
                    <img
                      src={`${BACKEND_URL}${blog.featuredImage}`}
                      alt={`${blog.title} - Wholesale Ethnic Wear Insights`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#E8D5A3]">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#BE6E5B]">
                      {blog.category?.name || "Uncategorized"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#E8D5A3]"></span>
                    <span className="font-sans text-[10px] text-[#a07f61] uppercase tracking-wider">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="font-display text-xl text-[#574325] mb-3 group-hover:text-[#BE6E5B] transition-colors line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="font-sans text-sm text-[#70543E] line-clamp-3 mb-4 flex-1">
                    {blog.excerpt || "Click to read the full story..."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-[#E8D5A3]/30 font-sans text-xs tracking-widest uppercase text-[#574325] group-hover:text-[#BE6E5B] flex items-center gap-2">
                    Read Article &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



