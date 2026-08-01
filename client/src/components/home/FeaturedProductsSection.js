// FILE: client/src/components/home/FeaturedProductsSection.js
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

export default function FeaturedProductsSection({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Featured Wholesale Ethnic Wear",
            description:
              "Featured premium cotton suits and kurtis manufactured by SANWARIYAS.",
            itemListElement: products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Thing",
                name: product.name,
                url: `https://sanwariyas.com/lookbook#${product.slug || product._id}`,
                image: product.image || product.images?.[0],
              },
            })),
          }),
        }}
      />
      <section
        aria-labelledby="featured-heading"
        className="py-20 md:py-28 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
        }}
      >
        {/* ── Decorative Borders & Background Patterns ── */}
        <div
          aria-hidden="true"
          className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/20 to-transparent hidden sm:block"
        />
        <div
          aria-hidden="true"
          className="absolute right-4 md:right-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/20 to-transparent hidden sm:block"
        />
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/25 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/25 to-transparent"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #BE6E5B 0, #BE6E5B 1px, transparent 0, transparent 40px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* ── Giant Background Watermark ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span
            className="font-display font-bold text-[#7A3D2A]/[0.025] tracking-[-0.04em] leading-none"
            style={{ fontSize: "clamp(8rem, 16vw, 16rem)" }}
          >
            FEATURED
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* ── Section Header ── */}
          <div className="text-center mb-12 md:mb-16">
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
              Hand-Picked
            </p>
            <h2
              id="featured-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold"
            >
              Featured Pieces
              {/*  SEO FIX: Upgraded to Priority #2 Keyword for maximum Semantic relevance */}
              <span className="sr-only">
                {" "}
                - Indian Ethnic Wear Manufacturer
              </span>
            </h2>

            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-3 md:gap-4 mt-5"
            >
              <div className="h-[2px] w-12 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
              <div className="h-[2px] w-12 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>

            <p className="font-serif italic text-[#a07f61] mt-6 text-sm md:text-lg max-w-2xl mx-auto font-medium">
              Curated selections from our finest collection — representing the
              pinnacle of our artisanship.
            </p>
          </div>

          {/* ── Products Grid ── */}
          <ul
            aria-label="Featured Products List"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-7 list-none p-0 m-0"
          >
            {products.map((product) => (
              <li
                key={product._id}
                className="group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_24px_52px_rgba(122,61,42,0.18)] rounded-2xl overflow-hidden bg-white/70 backdrop-blur-sm border border-[#BE6E5B]/20 hover:border-[#BE6E5B]/50 hover:bg-white/95"
              >
                <ProductCard product={product} />
              </li>
            ))}
          </ul>

          {/* ── Bottom Call to Action — consistent button style across all sections ── */}
          <div className="text-center mt-16 md:mt-20">
            {/* ✅ SEO FIX: Maintained valid internal Link and Descriptive Title for Crawlability */}
            <Link
              href="/lookbook"
              title="View Wholesale Ethnic Wear Lookbook"
              aria-label="View all wholesale ethnic wear collections and lookbook"
              className="group relative inline-flex items-center gap-3 border-2 border-[#7A3D2A] text-[#7A3D2A] font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase font-bold px-10 py-4 rounded-xl hover:text-[#FDF7F2] transition-colors duration-500 hover:shadow-[0_14px_40px_rgba(122,61,42,0.25)] overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#7A3D2A] to-[#BE6E5B] -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10"
              />
              <span className="relative z-10">View All Collections</span>
              <span
                aria-hidden="true"
                className="relative z-10 group-hover:translate-x-2 transition-transform duration-300 text-base leading-none"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
