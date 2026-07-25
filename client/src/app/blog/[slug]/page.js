// FILE: client/src/app/blog/[slug]/page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000/api"
).replace(/\/api\/?$/, "");

const IMAGE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

async function getBlog(slug, isPreview = false) {
  try {
    const url = isPreview
      ? `${BACKEND_URL}/api/blogs/${slug}?preview=true`
      : `${BACKEND_URL}/api/blogs/${slug}`;

    console.log(`[Blog SSR] Fetching: ${url}`);

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "x-ssr-secret": "SANWARIYAS_SECRET_123",
      },
    });

    console.log(`[Blog SSR] Status: ${res.status} for slug: ${slug}`);

    if (!res.ok) {
      const text = await res.text();
      console.error(`[Blog SSR] Backend error body: ${text}`);
      return null;
    }

    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    console.error(`[Blog SSR] Fetch exception:`, err.message);
    return null;
  }
}

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;

  let isPreview = false;
  try {
    const resolvedParams = await searchParams;
    isPreview = resolvedParams?.preview === "true";
  } catch (e) {
    console.error("searchParams issue in metadata");
  }

  const blog = await getBlog(slug, isPreview);

  if (!blog || (blog.status === "draft" && !isPreview)) {
    return {
      title: "Story Not Found | SANWARIYAS",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${blog.title} | SANWARIYAS Wholesale Ethnic Wear Journal`,
    description: blog.excerpt || `Read ${blog.title} on SANWARIYAS Journal.`,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      url: `https://sanwariyas.com/blog/${slug}`,
      title: `${blog.title} | SANWARIYAS B2B Journal`,
      description: blog.excerpt || `Read ${blog.title} on SANWARIYAS Journal.`,
      type: "article",
      images: blog.featuredImage ? [`${IMAGE_URL}${blog.featuredImage}`] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | SANWARIYAS B2B Journal`,
      images: blog.featuredImage ? [`${IMAGE_URL}${blog.featuredImage}`] : [],
    },
  };
}


const ARTICLE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

  @keyframes swFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes swLiveDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.4; transform: scale(1.4); }
  }

  .sw-anim-hero    { animation: swFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .sw-anim-image   { animation: swFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
  .sw-anim-content { animation: swFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.18s both; }
  .sw-live-dot     { animation: swLiveDot 1.6s ease-in-out infinite; }

  .sw-corner { position: absolute; width: 26px; height: 26px; opacity: 0.65; pointer-events: none; }
  .sw-corner-tl { top: -8px; left: -8px; border-top: 2px solid #BE6E5B; border-left: 2px solid #BE6E5B; border-radius: 8px 0 0 0; }
  .sw-corner-br { bottom: -8px; right: -8px; border-bottom: 2px solid #BE6E5B; border-right: 2px solid #BE6E5B; border-radius: 0 0 8px 0; }

  .sw-article-content {
    font-family: 'Jost', sans-serif;
    color: #70543E;
    font-size: clamp(15.5px, 1.6vw, 17.5px);
    line-height: 1.9;
  }
  .sw-article-content > *:first-child { margin-top: 0; }
  .sw-article-content > *:last-child  { margin-bottom: 0; }

  .sw-article-content p { margin: 0 0 1.6em; }
  .sw-article-content > p:first-of-type::first-letter {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    font-size: 3.6em;
    line-height: 0.8;
    float: left;
    padding: 0.06em 0.12em 0 0;
    color: #BE6E5B;
  }

  .sw-article-content h1,
  .sw-article-content h2,
  .sw-article-content h3,
  .sw-article-content h4,
  .sw-article-content h5,
  .sw-article-content h6 {
    font-family: 'Cormorant Garamond', serif;
    color: #574325;
    font-weight: 700;
    line-height: 1.25;
    margin: 1.9em 0 0.7em;
  }
  .sw-article-content h2 { font-size: clamp(1.55rem, 3vw, 2.1rem); }
  .sw-article-content h3 { font-size: clamp(1.3rem, 2.4vw, 1.65rem); }
  .sw-article-content h4 {
    font-family: 'Jost', sans-serif;
    font-size: 0.95rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #BE6E5B;
  }

  .sw-article-content a {
    color: #BE6E5B;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 1px;
    transition: color 0.2s ease;
  }
  .sw-article-content a:hover { color: #7A3D2A; }

  .sw-article-content strong { color: #574325; font-weight: 700; }
  .sw-article-content em { font-style: italic; }

  .sw-article-content ul,
  .sw-article-content ol {
    margin: 0 0 1.6em;
    padding-left: 1.4em;
  }
  .sw-article-content li { margin-bottom: 0.6em; }
  .sw-article-content li::marker { color: #BE6E5B; }

  .sw-article-content blockquote {
    margin: 2em 0;
    padding: 0.4em 0 0.4em 1.3em;
    border-left: 3px solid #E8D5A3;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.2em;
    color: #8a6a4a;
  }

  .sw-article-content img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 2.2em auto;
    border-radius: 1rem;
    box-shadow: 0 20px 45px -18px rgba(87,67,37,0.35);
  }

  .sw-article-content hr {
    border: 0;
    border-top: 1px solid #E8D5A3;
    margin: 3em 0;
  }

  .sw-article-content code {
    background: #FAF3E8;
    color: #7A3D2A;
    padding: 0.15em 0.45em;
    border-radius: 0.35em;
    font-size: 0.9em;
  }
  .sw-article-content pre {
    background: #574325;
    color: #FAF3E8;
    padding: 1.2em 1.4em;
    border-radius: 0.9em;
    overflow-x: auto;
    margin: 2em 0;
  }
  .sw-article-content pre code { background: transparent; color: inherit; padding: 0; }

  .sw-article-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 2em 0;
    font-size: 0.92em;
  }
  .sw-article-content th,
  .sw-article-content td {
    text-align: left;
    padding: 0.7em 0.9em;
    border-bottom: 1px solid rgba(232,213,163,0.6);
  }
  .sw-article-content th {
    font-family: 'Cormorant Garamond', serif;
    color: #574325;
    font-weight: 700;
  }
`;

export default async function SingleBlogPage({ params, searchParams }) {
  const { slug } = await params;

  let isPreview = false;
  try {
    const resolvedParams = await searchParams;
    isPreview = resolvedParams?.preview === "true";
  } catch (e) {
    console.error("searchParams issue in component");
  }

  console.log(
    `[Frontend] Loading slug: ${slug}, Preview flag is: ${isPreview}`,
  );

  const blog = await getBlog(slug, isPreview);

  if (!blog) {
    notFound();
  }

  //  Backend gived  draft  because  of the  vip  pass  but  in  url   not  flag   given  404 
  if (blog.status === "draft" && !isPreview) {
    console.log(
      `[Frontend] Blocked Draft rendering because preview param was missing/false.`,
    );
    notFound();
  }

  // Reading-time estimate for the meta row — pure presentation, ~200wpm.
  const plainText = (blog.content || "").replace(/<[^>]*>/g, " ");
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <article className="min-h-screen bg-[#FAF3E8] pb-24 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: ARTICLE_STYLES }} />

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
                ? [`${IMAGE_URL}${blog.featuredImage}`]
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
      <header className="sw-anim-hero relative max-w-3xl mx-auto px-5 pt-16 md:pt-24 pb-8 md:pb-10 text-center">
        <div
          aria-hidden="true"
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#BE6E5B]/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#BE6E5B]" />
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#BE6E5B]/50" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <Link
            href="/blog"
            title="SANWARIYAS Ethnic Wear Manufacturer Blog"
            className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#a07f61] hover:text-[#BE6E5B] transition-colors"
          >
            Journal
          </Link>
          <span className="w-1 h-1 rounded-full bg-[#E8D5A3]"></span>
          <span className="px-2.5 py-1 rounded-full bg-[#BE6E5B]/10 font-sans text-[10px] tracking-[0.2em] uppercase text-[#BE6E5B] font-semibold">
            {blog.category?.name || "Uncategorized"}
          </span>
          {/* 👉 Visual Indicator ki yeh preview mode hai */}
          {isPreview && blog.status === "draft" && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#E8D5A3]"></span>
              <span className="inline-flex items-center gap-1.5 font-sans text-[10px] tracking-[0.2em] uppercase text-red-600 font-bold border border-red-200 bg-red-50 px-2.5 py-1 rounded-full">
                <span className="sw-live-dot w-1.5 h-1.5 rounded-full bg-red-500" />
                Draft Preview
              </span>
            </>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#574325] leading-[1.12] mb-6">
          {blog.title}
        </h1>

        <p className="font-sans text-xs md:text-sm text-[#a07f61] uppercase tracking-widest">
          Published on{" "}
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          <span className="mx-2 text-[#E8D5A3]">•</span>
          {readingTime} min read
        </p>

        <div
          aria-hidden="true"
          className="mx-auto mt-7 h-[2px] w-14 rounded-full bg-gradient-to-r from-transparent via-[#BE6E5B] to-transparent"
        />
      </header>

      {/* Featured image — framed card (no cropping, so full outfit stays visible) */}
      {blog.featuredImage && (
        <div className="sw-anim-image max-w-4xl mx-auto px-5 mb-14 md:mb-20">
          <div className="relative rounded-[28px] p-3 md:p-5 bg-gradient-to-br from-white via-[#FBF4E7] to-[#F3E4C8] ring-1 ring-[#E8D5A3]/70 shadow-[0_25px_70px_-20px_rgba(87,67,37,0.35)]">
            <span aria-hidden="true" className="sw-corner sw-corner-tl" />
            <span aria-hidden="true" className="sw-corner sw-corner-br" />
            {/* plain img tag — next/image nahi, localhost use karo (unchanged) */}
            <img
              src={`${IMAGE_URL}${blog.featuredImage}`}
              alt={`${blog.title} - SANWARIYAS Ethnic Wear Manufacturer Journal`}
              loading="eager"
              decoding="async"
              className="relative z-[1] w-full max-h-[50vh] md:max-h-[68vh] object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}

      {/* Blog Content */}
      <div className="sw-anim-content max-w-3xl mx-auto px-5">
        <div
          className="sw-article-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-16 pt-8 border-t border-[#E8D5A3]/40 flex flex-col gap-8">
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-xs tracking-widest uppercase text-[#a07f61] mr-1">
                Tags
              </span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-white border border-[#E8D5A3] rounded-full font-sans text-xs text-[#70543E] hover:border-[#BE6E5B] hover:text-[#BE6E5B] transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase font-bold text-[#7A3D2A] border border-[#E8D5A3] rounded-full px-6 py-3 hover:bg-[#7A3D2A] hover:text-white hover:border-[#7A3D2A] transition-colors"
            >
              <span aria-hidden="true">←</span> Back to Journal
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
