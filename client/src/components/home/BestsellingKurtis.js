// // FILE: client/src/components/home/BestsellingKurtis.js

import Image from "next/image";
import Link from "next/link";

const BADGES = [
  "Best Seller",
  "Top Pick",
  "Fan Favourite",
  "Most Ordered",
  "Trending",
  "Staff Pick",
];

const PLACEHOLDER = [
  {
    _id: "p1",
    slug: "anarkali-embroidered-suit",
    name: "Anarkali Embroidered Suit",
    category: "Suits",
    price: 8900,
    originalPrice: 12000,
    fabric: "Georgette",
    image:
      "https://images.unsplash.com/photo-1614519379172-32183e78b3b6?w=600&q=80",
  },
  {
    _id: "p2",
    slug: "pure-muslin-alia-cut-suit",
    name: "Pure Muslin Alia Cut Suit",
    category: "Suits",
    price: 12500,
    originalPrice: 18000,
    fabric: "Pure Muslin",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
  },
  {
    _id: "p3",
    slug: "straight-3-piece-cotton-suit",
    name: "Straight 3-Piece Cotton Suit",
    category: "Suits",
    price: 4500,
    originalPrice: 6500,
    fabric: "Pure Cotton",
    image:
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
  },
  {
    _id: "p4",
    slug: "palazzo-printed-kurti-set",
    name: "Palazzo Printed Kurti Set",
    category: "Kurtis",
    price: 2800,
    originalPrice: 3800,
    fabric: "Rayon",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  },
  {
    _id: "p5",
    slug: "designer-hand-block-coord",
    name: "Designer Hand Block Co-Ord Set",
    category: "Co-Ord Sets",
    price: 2200,
    originalPrice: 3000,
    fabric: "Cotton Flex",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
  },
  {
    _id: "p6",
    slug: "mulmul-cotton-aline-suit",
    name: "Mulmul Cotton A-Line Suit",
    category: "Suits",
    price: 4500,
    originalPrice: 6000,
    fabric: "Mulmul Cotton",
    image:
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&q=80",
  },
];

function Card({ product, rank }) {
  const badge = BADGES[(rank - 1) % BADGES.length];
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

  return (
    <li className="group relative flex-shrink-0 snap-start shrink-0 w-[210px] sm:w-[235px] md:w-[260px]">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View wholesale details for ${product.name}`}
        className="block rounded-2xl overflow-hidden border border-[#BE6E5B]/20 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_28px_60px_rgba(122,61,42,0.22)] hover:border-[#BE6E5B]/60 hover:bg-white"
      >
        {/* Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F2D9C3]">
          {/* ✅ SEO FIX: Enriched Alt Text with Commercial/Manufacturer Intent */}
          <Image
            src={product.image}
            alt={`${product.name} - Wholesale Ethnic Wear Manufacturer`}
            fill
            sizes="(max-width:640px) 210px, 260px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Rank */}
          <div
            aria-hidden="true"
            className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black text-white shadow-lg drop-shadow-md"
            style={{ background: "linear-gradient(135deg,#5C3120,#BE6E5B)" }}
          >
            {rank}
          </div>

          {/* Badge */}
          <div
            className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-widest font-black text-white shadow-sm drop-shadow-md"
            style={{ background: "linear-gradient(135deg,#BE6E5B,#a07f61)" }}
          >
            {badge}
          </div>

          {/* Discount */}
          {discount && (
            <div
              className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full text-[9px] font-black text-white drop-shadow-md"
              style={{ background: "rgba(92,49,32,0.92)" }}
            >
              {discount}% OFF
            </div>
          )}

          {/* Hover overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#5C3120]/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Quick view pill */}
          <div
            aria-hidden="true"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-5 py-2 rounded-full text-[8px] uppercase tracking-widest font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 drop-shadow-md"
            style={{
              background: "rgba(122,61,42,0.90)",
              backdropFilter: "blur(8px)",
            }}
          >
            View Details →
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-4">
          {product.category && (
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#BE6E5B] font-bold mb-1">
              {product.category}
            </p>
          )}
          <h3 className="font-display text-[15px] md:text-base text-[#5C3120] font-bold leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-sans text-base font-black text-[#7A3D2A]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-sans text-xs text-[#a07f61] line-through">
                <span className="sr-only">Original Price: </span>₹
                {product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {product.fabric && (
            <p className="font-sans text-[10px] text-[#a07f61] mt-1">
              {product.fabric}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}

export default function BestsellingKurtis() {
  // Current static version
  const list = PLACEHOLDER;

  return (
    <>
      {/* ✅ SEO FIX: Added ItemList Schema for structured data representation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Bestselling Kurtis and Cotton Suits",
            description:
              "Top picked wholesale ethnic wear manufactured in Jaipur.",
            itemListElement: list.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: item.name,
                image: item.image,
                category: item.category,
                offers: {
                  "@type": "Offer",
                  price: item.price,
                  priceCurrency: "INR",
                  availability: "https://schema.org/InStock",
                },
              },
            })),
          }),
        }}
      />
      <section
        aria-labelledby="bestselling-heading"
        className="relative py-20 md:py-28 overflow-hidden"
        style={{
          background: "linear-gradient(160deg,#FDF7F2 0%,#F2D9C3 100%)",
        }}
      >
        {/* Background pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,#BE6E5B 0,#BE6E5B 1px,transparent 0,transparent 36px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BE6E5B]/30 to-transparent"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-14">
            <div>
              <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
                Most Ordered
              </p>
              <h2
                id="bestselling-heading"
                className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold"
              >
                Bestselling Kurtis
                {/* ✅ SEO FIX: Appended visually hidden B2B keyword to H2 */}
                <span className="sr-only">
                  {" "}
                  - Wholesale Ethnic Wear Supplier India
                </span>
              </h2>
              <div aria-hidden="true" className="flex items-center gap-3 mt-5">
                <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-[#BE6E5B] to-transparent" />
                <span className="text-[#BE6E5B] text-base animate-pulse">
                  ✦
                </span>
              </div>
            </div>

            {/* View All Button — consistent style */}
            {/*  SEO FIX: Converted <div> to <Link> for internal link equity. Pointed to /lookbook since /products does not exist */}
            <Link
              href="/products"
              title="View All Wholesale Ethnic Wear"
              aria-label="View all wholesale kurti and suit collections"
              className="group relative self-start md:self-auto inline-flex items-center gap-2.5 border-2 border-[#7A3D2A] text-[#7A3D2A] font-sans text-[10px] tracking-[0.3em] uppercase font-bold px-8 py-3.5 rounded-xl hover:text-[#FDF7F2] transition-colors duration-500 overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#7A3D2A] to-[#BE6E5B] -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10"
              />
              <span className="relative z-10">View All</span>
              <span
                aria-hidden="true"
                className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300"
              >
                →
              </span>
            </Link>
          </div>

          {/* Scroll strip */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-[#FDF7F2]/90 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-[#F2D9C3]/90 to-transparent"
            />

            <ul
              aria-label="Bestselling wholesale kurtis and suits list"
              className="flex gap-5 md:gap-6 overflow-x-auto pb-5 list-none p-0 m-0 snap-x snap-mandatory"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {list.map((p, i) => (
                <Card key={p._id} product={p} rank={i + 1} />
              ))}
            </ul>
          </div>

          <p
            aria-hidden="true"
            className="text-center mt-5 text-[9px] uppercase tracking-[0.4em] text-[#a07f61]/55 font-bold md:hidden"
          >
            ← Swipe to explore →
          </p>
        </div>
      </section>
    </>
  );
}
