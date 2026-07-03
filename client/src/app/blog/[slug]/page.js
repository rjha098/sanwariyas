// // blog  sulg page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';
// import api from '@/lib/api';

// const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
//   .replace(/\/api\/?$/, '');

// export default function SingleBlogPage() {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (!slug) return;

//     api.get(`/blogs/${slug}`)
//       .then(res => setBlog(res.data.data))
//       .catch(err => setError('Story not found or has been removed.'))
//       .finally(() => setLoading(false));
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
//         <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#70543E]/50">Loading Story...</p>
//       </div>
//     );
//   }

//   if (error || !blog) {
//     return (
//       <div className="min-h-screen bg-[#FAF3E8] flex flex-col items-center justify-center text-center px-4">
//         <h1 className="font-display text-3xl text-[#574325] mb-4">Story Not Found</h1>
//         <p className="font-sans text-[#a07f61] mb-8">{error}</p>
//         <Link href="/blog" className="px-6 py-2 border border-[#BE6E5B] text-[#BE6E5B] rounded hover:bg-[#BE6E5B] hover:text-white transition-colors">
//           &larr; Back to Journal
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <article className="min-h-screen bg-[#FAF3E8] pb-20">
//       {/* Hero Header */}
//       <div className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
//         <div className="flex items-center justify-center gap-3 mb-6">
//           <Link href="/blog" className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#a07f61] hover:text-[#BE6E5B]">
//             Journal
//           </Link>
//           <span className="w-1 h-1 rounded-full bg-[#E8D5A3]"></span>
//           <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#BE6E5B]">
//             {blog.category?.name || 'Uncategorized'}
//           </span>
//         </div>

//         <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#574325] leading-tight mb-6">
//           {blog.title}
//         </h1>

//         <p className="font-sans text-sm text-[#a07f61] uppercase tracking-widest">
//           Published on {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
//         </p>
//       </div>

//       {/* Featured Image */}
//       {blog.featuredImage && (
//         <div className="max-w-5xl mx-auto px-4 mb-16">
//           <img
//             src={`${BACKEND_URL}${blog.featuredImage}`}
//             alt={blog.title}
//             className="w-full h-auto max-h-[60vh] object-cover rounded-2xl shadow-sm"
//           />
//         </div>
//       )}

//       {/* Blog Content */}
//       <div className="max-w-3xl mx-auto px-4">
//         {/* Ye classNames prose wagera ensure karenge ki admin ka HTML theek dikhe */}
//         <div
//           className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[#574325] prose-p:font-sans prose-p:text-[#70543E] prose-p:leading-relaxed prose-a:text-[#BE6E5B] prose-img:rounded-xl"
//           dangerouslySetInnerHTML={{ __html: blog.content }}
//         />

//         {/* Tags Section */}
//         {blog.tags && blog.tags.length > 0 && (
//           <div className="mt-16 pt-8 border-t border-[#E8D5A3]/40">
//             <div className="flex flex-wrap gap-2">
//               <span className="font-sans text-xs text-[#a07f61] mr-2 flex items-center">Tags:</span>
//               {blog.tags.map(tag => (
//                 <span key={tag} className="px-3 py-1 bg-white border border-[#E8D5A3] rounded-full font-sans text-xs text-[#70543E]">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </article>
//   );
// }















// FILE: client/src/app/blog/[slug]/page.js
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

// SEO Metadata Generation
export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    // FIX: Added /api to the fetch URL to match the backend route
    const res = await fetch(`${BACKEND_URL}/api/blogs/${slug}`, {
      next: { revalidate: 3600 },
      cache: "force-cache",
    });

    const data = await res.json();
    const blog = data?.data;

    if (!blog) {
      return {
        title: "Story Not Found | SANWARIYAS",
        robots: {
          index: false,
          follow: false,
        },
      };
    }
    return {
      title: `${blog.title} | SANWARIYAS Wholesale Ethnic Wear Journal`,
      description: `Read ${blog.title} on SANWARIYAS Journal. Discover insights from a Wholesale Ethnic Wear Supplier India, Cotton Suit Manufacturer Jaipur, and B2B Ethnic Wear Supplier serving retailers worldwide.`,

      alternates: {
        canonical: `/blog/${slug}`,
      },

      openGraph: {
        url: `https://sanwariyas.com/blog/${slug}`,
        title: `${blog.title} | SANWARIYAS B2B Journal`,
        description: `Read ${blog.title} on SANWARIYAS Journal. Insights from a Jaipur Ethnic Wear Manufacturer, Wholesale Kurti Supplier India and B2B Ethnic Wear Supplier.`,
        type: "article",
        images: blog.featuredImage
          ? [`${BACKEND_URL}${blog.featuredImage}`]
          : [],
      },

      twitter: {
        card: "summary_large_image",
        title: `${blog.title} | SANWARIYAS B2B Journal`,
        description: `Read ${blog.title} on SANWARIYAS Journal. Insights from a Jaipur Ethnic Wear Manufacturer, Wholesale Kurti Supplier India and B2B Ethnic Wear Supplier.`,
        images: blog.featuredImage
          ? [`${BACKEND_URL}${blog.featuredImage}`]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "Blog | SANWARIYAS",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

// Server Component
export default async function SingleBlogPage({ params }) {
  const { slug } = params;
  let blog = null;

  try {
    // FIX: Added /api to the fetch URL to match the backend route
    const res = await fetch(`${BACKEND_URL}/api/blogs/${slug}`, {
      next: { revalidate: 3600 },
      cache: "force-cache",
    });

    const data = await res.json();

    // Only assign the blog if the request was successful
    if (res.ok && data?.data) {
      blog = data.data;
    }
  } catch (err) {
    // Silently catch the fetch error, allowing the blog to remain null
    console.error("Failed to fetch blog:", err);
  }

  // FIX: notFound() must be called OUTSIDE the try/catch block.
  // Next.js uses error boundary throwing for notFound(). Catching it locally breaks the page.
  if (!blog) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-[#FAF3E8] pb-20">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://sanwariyas.com/blog/${slug}`,
              },
              headline: blog.title,
              image: blog.featuredImage
                ? [`${BACKEND_URL}${blog.featuredImage}`]
                : [],
              datePublished: blog.createdAt,
              dateModified: blog.updatedAt || blog.createdAt,
              author: {
                "@type": "Organization",
                name: "SANWARIYAS Editorial Team",
              },
              publisher: {
                "@type": "Organization",
                name: "SANWARIYAS",
                logo: {
                  "@type": "ImageObject",
                  url: "https://sanwariyas.com/images/logooo.png",
                },
              },
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
                {
                  "@type": "ListItem",
                  position: 3,
                  name: blog.title,
                  item: `https://sanwariyas.com/blog/${slug}`,
                },
              ],
            },
          ]),
        }}
      />

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Link
            href="/blog"
            title="SANWARIYAS Ethnic Wear Manufacturer Blog"
            className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#a07f61] hover:text-[#BE6E5B]"
          >
            Journal
          </Link>
          <span className="w-1 h-1 rounded-full bg-[#E8D5A3]"></span>
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#BE6E5B]">
            {blog.category?.name || "Uncategorized"}
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#574325] leading-tight mb-6">
          {blog.title}
        </h1>

        <p className="font-sans text-sm text-[#a07f61] uppercase tracking-widest">
          Published on{" "}
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <Image
            src={`${BACKEND_URL}${blog.featuredImage}`}
            alt={`${blog.title} - SANWARIYAS Ethnic Wear Manufacturer Journal`}
            width={1200}
            height={700}
            priority
            className="w-full h-auto max-h-[60vh] object-cover rounded-2xl shadow-sm"
          />
        </div>
      )}

      {/* Blog Content */}
      <div className="max-w-3xl mx-auto px-4">
        <div
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[#574325] prose-p:font-sans prose-p:text-[#70543E] prose-p:leading-relaxed prose-a:text-[#BE6E5B] prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#E8D5A3]/40">
            <div className="flex flex-wrap gap-2">
              <span className="font-sans text-xs text-[#a07f61] mr-2 flex items-center">
                Tags:
              </span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white border border-[#E8D5A3] rounded-full font-sans text-xs text-[#70543E]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}