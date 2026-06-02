// FILE: client/src/components/home/BestsellingKurtis.js
// PURPOSE: Bestselling Kurtis strip — fetches top products from API
// Place this section between FeaturedProductsSection and WhyUsSection

import Link from "next/link";
import Image from "next/image";

// ── COLOR PALETTE ────────────────────────────────
// Background : #FDF7F2 → #F2D9C3
// Headings   : #7A3D2A
// Body text  : #a07f61
// Accent     : #BE6E5B
// ─────────────────────────────────────────────────

const BESTSELLER_BADGES = ["Best Seller", "Top Pick", "Fan Favourite", "Most Ordered", "Trending", "Staff Pick"];

function BestsellerCard({ product, rank }) {
  const badge = BESTSELLER_BADGES[(rank - 1) % BESTSELLER_BADGES.length];
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <li className="group relative flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px]">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`${product.name} — ${badge}`}
        className="block rounded-xl overflow-hidden border border-[#BE6E5B]/20 bg-white/70 backdrop-blur-sm shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(122,61,42,0.16)] hover:border-[#BE6E5B]/50 hover:bg-white"
      >
        {/* Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F2D9C3]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 220px, 260px"
            className="object-cover transition-transform duration-700 group-hover:scale-108"
          />

          {/* Rank badge */}
          <div
            aria-hidden="true"
            className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shadow-md"
            style={{ background: "linear-gradient(135deg, #7A3D2A, #BE6E5B)" }}
          >
            {rank}
          </div>

          {/* Bestseller label */}
          <div
            className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-widest font-bold text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #BE6E5B, #a07f61)" }}
          >
            {badge}
          </div>

          {/* Discount pill */}
          {discount && (
            <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-full text-[9px] font-black text-white bg-[#7A3D2A]/90">
              {discount}% OFF
            </div>
          )}

          {/* Dark gradient for text legibility on hover */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#7A3D2A]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category && (
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#BE6E5B] font-bold mb-1">
              {product.category}
            </p>
          )}

          <h3 className="font-display text-[15px] md:text-base text-[#7A3D2A] font-bold leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="font-sans text-base font-black text-[#7A3D2A]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-sans text-xs text-[#a07f61] line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {product.fabric && (
            <p className="font-sans text-[10px] text-[#a07f61] mt-1">{product.fabric}</p>
          )}
        </div>
      </Link>
    </li>
  );
}

// ── Fallback placeholder cards when DB has no products yet ──
const PLACEHOLDER_PRODUCTS = [
  { _id: "p1", slug: "anarkali-embroidered-suit", name: "Anarkali Embroidered Suit", category: "Suits", price: 8900, originalPrice: 12000, fabric: "Georgette", image: "https://images.unsplash.com/photo-1614519379172-32183e78b3b6?w=600&q=80" },
  { _id: "p2", slug: "royal-banarasi-silk-saree", name: "Royal Banarasi Silk Saree", category: "Sarees", price: 12500, originalPrice: 18000, fabric: "Pure Silk", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80" },
  { _id: "p3", slug: "bridal-lehenga-choli", name: "Bridal Lehenga Choli", category: "Lehengas", price: 45000, originalPrice: 65000, fabric: "Velvet & Net", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80" },
  { _id: "p4", slug: "palazzo-printed-kurti-set", name: "Palazzo Printed Kurti Set", category: "Kurtis", price: 2800, originalPrice: 3800, fabric: "Rayon", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80" },
  { _id: "p5", slug: "heavy-embellished-gown", name: "Heavy Embellished Gown", category: "Gowns", price: 22000, originalPrice: 30000, fabric: "Net & Silk", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80" },
  { _id: "p6", slug: "chanderi-cotton-silk-saree", name: "Chanderi Cotton Silk Saree", category: "Sarees", price: 4500, originalPrice: 6000, fabric: "Cotton Silk", image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&q=80" },
];

export default function BestsellingKurtis({ products }) {
  const displayProducts = products && products.length > 0 ? products : PLACEHOLDER_PRODUCTS;

  return (
    <section
      aria-labelledby="bestselling-heading"
      className="relative py-20 md:py-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #FDF7F2 0%, #F2D9C3 100%)" }}
    >
      {/* ── Decorative background ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #BE6E5B 0, #BE6E5B 1px, transparent 0, transparent 36px)", backgroundSize: "36px 36px" }}
      />

      {/* ── Top/bottom rules ── */}
      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />
      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header row ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
              Most Ordered
            </p>
            <h2
              id="bestselling-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold"
            >
              Bestselling Kurtis
            </h2>
            <div aria-hidden="true" className="flex items-center gap-4 mt-5">
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-[#BE6E5B] to-transparent" />
              <span className="text-[#BE6E5B] text-base animate-pulse">✦</span>
            </div>
          </div>

          <Link
            href="/products"
            aria-label="View all bestselling products"
            className="group relative self-start md:self-auto inline-flex items-center gap-2 border border-[#7A3D2A] text-[#7A3D2A] font-sans text-[10px] tracking-[0.3em] uppercase font-bold px-7 py-3 rounded-md hover:text-[#FDF7F2] transition-colors duration-500 overflow-hidden"
          >
            <span aria-hidden="true" className="absolute inset-0 bg-[#7A3D2A] -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10" />
            <span className="relative z-10">View All</span>
            <span aria-hidden="true" className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>

        {/* ── Horizontal scroll strip ── */}
        <div className="relative">
          {/* Left fade */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #F7EDE4, transparent)" }}
          />
          {/* Right fade */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #F7EDE4, transparent)" }}
          />

          <ul
            aria-label="Bestselling products"
            className="flex gap-5 overflow-x-auto pb-4 list-none p-0 m-0 scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {displayProducts.map((product, index) => (
              <BestsellerCard key={product._id} product={product} rank={index + 1} />
            ))}
          </ul>
        </div>

        {/* ── Scroll hint on mobile ── */}
        <p
          aria-hidden="true"
          className="text-center mt-4 text-[9px] uppercase tracking-[0.4em] text-[#a07f61]/60 font-bold md:hidden"
        >
          ← Swipe to explore →
        </p>

      </div>
    </section>
  );
}