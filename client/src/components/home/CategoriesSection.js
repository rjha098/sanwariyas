// // FILE: client/src/components/home/CategoriesSection.js
import Image from "next/image";
import Link from "next/link";

//  SEO FIX: Mapped exact-match primary B2B/Manufacturer keywords to each category to maximize topical authority in Image SEO
const categories = [
  {
    name: "Anarkali Kurtis",
    slug: "anarkali-kurti",
    image: "/images/suits/Anarkali/Anarkali2.png",
    count: "Anarkali • Festive • Designer",
    seoKeyword: "Wholesale Ethnic Wear Supplier India",
  },
  {
    name: "Short Kurtis",
    slug: "short-kurti",
    image: "/images/suits/short-Kurtis/short-kurtis1.png",
    count: "Casual • Printed • Daily Wear",
    seoKeyword: "Wholesale Cotton Kurti Supplier",
  },
  {
    name: "Long Kurtis",
    slug: "long-kurti",
    image: "/images/suits/LongKurtis/long-kurtis1.png",
    count: "Straight • Ethnic • Elegant",
    seoKeyword: "Indian Ethnic Wear Manufacturer",
  },
  {
    //  SEO FIX: Corrected spelling to match exact high-volume SEO target keyword
    name: "Co-Ord Sets",
    slug: "co-ord-sets",
    image: "/images/suits/cordset/co-ordsets1.png",
    count: "Matching Sets • Trendy • Modern",
    seoKeyword: "Designer Co-Ord Set Manufacturer",
  },
  {
    name: "Straight 3 Piece",
    slug: "straight-3piece-suit",
    image: "/images/suits/Straight3piece/3-piece-suit1.png",
    count: "Kurta • Pant • Dupatta",
    seoKeyword: "Ladies Cotton Suit Manufacturer",
  },
  {
    name: "A-Line Suits",
    slug: "a-line-suit",
    image: "/images/suits/anarkali/Anarkali2.png",
    count: "A-Line • Party • Festive",
    seoKeyword: "Jaipur Ethnic Wear Manufacturer",
  },
];

export default function CategoriesSection() {
  return (
    <>
      {/*  SEO FIX: Enriched ItemList Schema with 'Thing' entities and Image URLs for better Knowledge Graph integration */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "SANWARIYAS Wholesale Ethnic Wear Collections",
            description:
              "Signature ethnic wear collections manufactured in Jaipur including Cotton Suits, Kurtis, and Co-ord Sets.",
            itemListElement: categories.map((cat, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Thing",
                name: cat.name,
                image: `https://sanwariyas.com${cat.image}`,
              },
            })),
          }),
        }}
      />
      <section
        aria-labelledby="categories-heading"
        className="py-24 md:py-32 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg,#FDF7F2 0%,#F5E8D8 50%,#F2D9C3 100%)",
        }}
      >
        {/* Dot grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: "radial-gradient(#7A3D2A 1.8px,transparent 1.8px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Top / bottom rules */}
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
          <div className="text-center mb-16 md:mb-20">
            {/* <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
              Wholesale Collections
            </p> */}
            <h2
              id="categories-heading"
              className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold"
            >
              Our Signature Collections
              {/*  SEO FIX: Mapped to #1 Priority B2B Keyword */}
              <span className="sr-only">
                {" "}
                - Wholesale Ethnic Wear Supplier India
              </span>
            </h2>
            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-4 mt-6"
            >
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
              <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
              <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
            </div>
            <p className="font-serif italic text-[#a07f61] mt-6 text-sm md:text-lg max-w-xl mx-auto font-medium">
              Handpicked styles from Jaipur's finest looms — sourced directly
              for your store.
            </p>
          </div>

          {/*  SEMANTIC HTML: Unordered list grid */}
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 list-none p-0 m-0">
            {/* {categories.map((cat, index) => (
             <li key={cat.slug}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  aria-label={`View ${cat.name} wholesale collection`}
                  className="group relative overflow-hidden shadow-lg hover:shadow-[0_28px_60px_rgba(122,61,42,0.30)] hover:-translate-y-3 transition-all duration-700 bg-[#7A3D2A] rounded-2xl block h-full"
                  style={{ aspectRatio: "3/4" }}
                > */}

            {categories.map((cat, index) => (
              <li key={cat.slug}>
                <Link
                  href="/contact"
                  aria-label={`Inquire about ${cat.name} wholesale collection`}
                  className="group relative overflow-hidden shadow-lg hover:shadow-[0_28px_60px_rgba(122,61,42,0.30)] hover:-translate-y-3 transition-all duration-700 bg-[#7A3D2A] rounded-2xl block h-full"
                  style={{ aspectRatio: "3/4" }}
                >
                  {/*  SEO FIX: Dynamic, highly relevant B2B keyword alt text applied here */}
                  <Image
                    src={cat.image}
                    alt={`${cat.name} - ${cat.seoKeyword}`}
                    fill
                    sizes="(max-width:768px) 50vw,(max-width:1200px) 33vw,16vw"
                    className="object-cover opacity-85 group-hover:opacity-100 transition-all duration-[1400ms] group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#5C3120]/95 via-[#7A3D2A]/25 to-transparent group-hover:from-[#5C3120]/88 transition-all duration-700"
                  />

                  {/* Inner border reveal on hover */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-2 border border-[#BE6E5B]/0 group-hover:border-[#BE6E5B]/60 transition-all duration-700 z-20 pointer-events-none rounded-xl"
                  />

                  {/* Number */}
                  <div
                    aria-hidden="true"
                    className="absolute top-4 right-4 font-display text-4xl text-[#FDF7F2]/20 group-hover:text-[#F2D9C3]/45 transition-colors duration-700 leading-none select-none z-10 font-bold"
                  >
                    0{index + 1}
                  </div>

                  {/* Gold accent dot */}
                  <div
                    aria-hidden="true"
                    className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-[#BE6E5B]/60 group-hover:bg-[#BE6E5B] transition-colors duration-500 z-10"
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-5 md:px-5 translate-y-3 group-hover:translate-y-0 transition-transform duration-700 z-20">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div
                        aria-hidden="true"
                        className="h-px w-6 bg-[#BE6E5B]/70 group-hover:w-10 transition-all duration-700"
                      />
                      <p className="font-sans text-[8px] md:text-[9px] text-[#F2D9C3]/80 tracking-[0.28em] uppercase font-bold">
                        <span className="sr-only">Available styles: </span>
                        {cat.count}
                      </p>
                    </div>
                    <h3 className="font-display text-lg md:text-xl text-[#FDF7F2] mb-3 drop-shadow-md font-semibold leading-tight">
                      {cat.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 font-sans text-[9px] tracking-widest uppercase text-[#BE6E5B] border-b border-[#BE6E5B]/0 group-hover:border-[#BE6E5B] pb-0.5 opacity-0 group-hover:opacity-100 transition-all duration-700 font-bold">
                      View Collection
                      <span
                        aria-hidden="true"
                        className="group-hover:translate-x-1.5 transition-transform duration-500 text-sm leading-none"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
