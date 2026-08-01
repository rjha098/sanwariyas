// FILE: client/src/app/products/[slug]/page.js
// PURPOSE: INDIVIDUAL PRODUCT PAGE — /products/[slug]

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InquiryForm from "@/components/ui/InquiryForm";
import AddToCartBox from "@/components/product/AddToCartBox";
import { getImageUrl } from "@/lib/imageUrl";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sanwariyas.com";

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const { product } = await fetchProductBySlug(resolvedParams.slug);

    const rawDesc = product.shortDescription || product.description || "";
    const cleanDesc = rawDesc
      ? rawDesc.slice(0, 110) + "..."
      : "Premium wholesale ethnic wear.";
    const enhancedDesc = `Source wholesale ${product.name} direct from our Jaipur manufacturing facility. ${cleanDesc}`;

    return {
      title:
        product.metaTitle ||
        `${product.name} | Wholesale Ethnic Wear Manufacturer`,
      description: product.metaDescription || enhancedDesc,
      alternates: { canonical: `${BASE_URL}/products/${product.slug}` },
      openGraph: {
        title: `${product.name} | SANWARIYAS Wholesale Export`,
        description: product.metaDescription || enhancedDesc,
        url: `${BASE_URL}/products/${product.slug}`,
        siteName: "SANWARIYAS Ethnic Luxury",
        images: [
          {
            url: product.image,
            width: 800,
            height: 1067,
            alt: `Wholesale ${product.name} Manufacturer`,
          },
        ],
        locale: "en_IN",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | B2B Wholesale`,
        description: product.metaDescription || enhancedDesc,
        images: [product.image],
      },
      robots: { index: true, follow: true, "max-image-preview": "large" },
    };
  } catch {
    return { title: "Product Not Found | SANWARIYAS" };
  }
}

export async function generateStaticParams() {
  try {
    const data = await fetchProducts({ limit: 100 });
    return (data.products || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  let product;
  try {
    const resolvedParams = await params;
    const data = await fetchProductBySlug(resolvedParams.slug);
    product = data.product;
  } catch (err) {
    if (err.response?.status === 404) notFound();
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#FAF3E8] flex items-center justify-center px-4 pt-32 pb-20">
          <div className="text-center max-w-md">
            <h1 className="font-display text-2xl text-[#574325] mb-3">
              Unable to load this product
            </h1>
            <p className="font-sans text-sm text-[#a07f61]">
              Network Error. Please check your internet connection and try
              again.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const combinedSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: [product.image, ...(product.images || [])],
      sku: product.slug,
      category: product.category,
      url: `${BASE_URL}/products/${product.slug}`,
      brand: { "@type": "Brand", name: "SANWARIYAS" },
      offers: {
        "@type": "Offer",
        url: `${BASE_URL}/products/${product.slug}`,
        price: product.price,
        priceCurrency: "INR",
        availability: product.isAvailable
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "SANWARIYAS Ethnic Luxury" },
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
          item: `${BASE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Wholesale Catalog",
          item: `${BASE_URL}/products`,
        },
        ...(product.category
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: product.category,
                item: `${BASE_URL}/products?category=${encodeURIComponent(product.category)}`,
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: product.category ? 4 : 3,
          name: product.name,
          item: `${BASE_URL}/products/${product.slug}`,
        },
      ],
    },
  ];

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  // ✅ STRICT DEDUPLICATION LOGIC:
  // Remove the main image from the gallery array if it exists there,
  // then merge it safely to guarantee no duplicates.
  const galleryImages = (product.images || []).filter(
    (img) => img !== product.image,
  );
  const displayImages = [product.image, ...galleryImages]
    .filter(Boolean)
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      <Navbar />

      {/* ── Breadcrumb bar ── */}
      <div className="bg-[#574325] pt-24 pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="font-sans text-xs text-[#F5EFE6]/60"
          >
            <ol className="flex items-center gap-2 list-none p-0 m-0 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#C9A84C] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#C9A84C] transition-colors"
                >
                  Wholesale Catalog
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              {product.category && (
                <>
                  <li>
                    <Link
                      href={`/products?category=${product.category}`}
                      className="hover:text-[#C9A84C] transition-colors"
                    >
                      {product.category}
                    </Link>
                  </li>
                  <li aria-hidden="true">›</li>
                </>
              )}
              <li>
                <span aria-current="page" className="text-[#F5EFE6]">
                  {product.name}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Main content ── */}
      <main id="main-content" className="bg-[#FAF3E8] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* ── Top 2-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* LEFT — Image gallery */}
            <div className="lg:col-span-5 relative">
              <div className="lg:sticky lg:top-24 space-y-3">
                {/* Main image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white shadow-md border border-[#C9A84C]/20 rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(product.image)}
                    alt={`Wholesale ${product.name} - Front Manufacturer View`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {product.isFeatured && (
                    <div className="absolute top-4 left-4 bg-[#C9A84C] text-[#574325] text-[10px] tracking-widest uppercase px-3 py-1.5 font-sans font-bold shadow-sm rounded-md">
                      Featured
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {displayImages.length > 0 && (
                  <div
                    className="grid grid-cols-4 gap-2"
                    role="group"
                    aria-label={`${product.name} image gallery`}
                  >
                    {displayImages.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-[3/4] overflow-hidden bg-white cursor-pointer border border-[#C9A84C]/20 rounded-md"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getImageUrl(img)}
                          alt={`${product.name} view ${i + 1}`}
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Product info */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div>
                {/* Category link */}
                {product.category && (
                  <Link
                    href={`/products?category=${product.category}`}
                    className="inline-block mb-2"
                  >
                    <span className="font-sans text-[11px] tracking-[0.3em] text-[#C9A84C] font-bold uppercase hover:text-[#7A3D2A] transition-colors">
                      <span className="sr-only">Category: </span>
                      {product.category}
                    </span>
                  </Link>
                )}

                {/* Product name */}
                <h1 className="font-display text-3xl md:text-4xl text-[#7A3D2A] leading-snug font-bold mb-4">
                  {product.name}
                </h1>
              </div>

              {/* MOQ + Price block */}
              <div className="bg-white p-5 rounded-xl border border-[#BE6E5B]/20 shadow-sm space-y-4">
                {/* MOQ badge */}
                <div className="inline-flex items-center gap-2 bg-[#FDF7F2] border border-[#BE6E5B]/30 px-3 py-1.5 rounded-md">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#BE6E5B]">
                    Minimum Order:
                  </span>
                  <span className="font-sans text-xs font-bold text-[#7A3D2A]">
                    10 Pieces
                  </span>
                </div>

                {/* Price row */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-sans text-xs uppercase tracking-widest text-[#a07f61] font-bold">
                    Wholesale Price:
                  </span>
                  <span className="font-display text-4xl font-bold text-[#7A3D2A]">
                    <span className="sr-only">Current Price: </span>₹
                    {product.price.toLocaleString("en-IN")}
                    <span className="text-sm font-sans text-[#a07f61] font-medium ml-1">
                      / piece
                    </span>
                  </span>
                  {product.originalPrice && (
                    <div className="flex items-center gap-2 ml-2">
                      <span className="font-sans text-lg text-[#7A3D2A]/40 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="font-sans text-[10px] bg-[#C9A84C]/20 text-[#7A3D2A] px-2 py-1 rounded-md font-bold">
                        {discount}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Smart Set Calculator */}
              <div className="w-full">
                <AddToCartBox product={product} />
              </div>

              {/* Short description */}
              {product.shortDescription && (
                <p className="font-serif italic text-[#a07f61] text-base leading-relaxed border-l-2 border-[#BE6E5B]/40 pl-4 bg-white/40 py-2 rounded-r-md">
                  {product.shortDescription}
                </p>
              )}

              {/* Fabric + Occasion */}
              {(product.fabric || product.occasion) && (
                <div className="grid grid-cols-2 gap-4 bg-white p-4 border border-[#BE6E5B]/20 rounded-xl shadow-sm">
                  {product.fabric && (
                    <div>
                      <p className="font-sans text-[9px] font-bold tracking-widest uppercase text-[#BE6E5B] mb-1">
                        Fabric Spec
                      </p>
                      <p className="font-sans text-sm font-semibold text-[#7A3D2A]">
                        {product.fabric}
                      </p>
                    </div>
                  )}
                  {product.occasion && (
                    <div>
                      <p className="font-sans text-[9px] font-bold tracking-widest uppercase text-[#BE6E5B] mb-1">
                        Target Market
                      </p>
                      <p className="font-sans text-sm font-semibold text-[#7A3D2A]">
                        {product.occasion}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {product.tags?.length > 0 && (
                <ul
                  aria-label="Product Characteristics"
                  className="flex flex-wrap gap-2 list-none p-0 m-0"
                >
                  {product.tags.map((tag) => (
                    <li
                      key={tag}
                      className="font-sans text-[10px] font-bold tracking-widest uppercase text-[#7A3D2A] border border-[#a07f61]/30 bg-white px-3 py-1.5 rounded-md shadow-sm"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              {/* Divider */}
              <div aria-hidden="true" className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-[#BE6E5B]/30" />
                <span className="text-[#BE6E5B] text-xs">✦</span>
                <div className="flex-1 h-px bg-[#BE6E5B]/30" />
              </div>

              {/* Inquiry form */}
              <section
                aria-labelledby="inquiry-heading"
                className="bg-white p-6 rounded-xl border border-[#C9A84C]/30 shadow-md"
              >
                <h2
                  id="inquiry-heading"
                  className="font-display text-2xl font-bold text-[#7A3D2A] mb-1"
                >
                  Request Wholesale Quote
                </h2>
                <p className="font-sans text-xs text-[#a07f61] mb-6">
                  Submit your bulk requirements below. Our export desk replies
                  within 24 hours.
                </p>
                <InquiryForm
                  productId={product._id}
                  productName={product.name}
                />
              </section>

              {/* ── Manufacturing Details / Main Description ── */}
              <section
                aria-labelledby="description-heading"
                className="bg-white/60 p-6 rounded-xl border border-[#BE6E5B]/20 mt-4"
              >
                <h2
                  id="description-heading"
                  className="font-display text-xl font-bold text-[#7A3D2A] mb-3"
                >
                  Manufacturing Details
                </h2>
                <div aria-hidden="true" className="h-px bg-[#BE6E5B]/20 mb-4" />

                <div className="font-sans text-sm text-[#574325] leading-relaxed whitespace-pre-wrap break-words">
                  {product.description}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
