// // FILE: client/src/app/lookbook/page.js

// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { fetchLookbook } from "@/lib/api";

// const BACKEND_URL = (
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
// ).replace(/\/api\/?$/, "");

// export default function LookbookPage() {
//   const [activeCategory, setActiveCategory] = useState("All Collections");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch Lookbook data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await fetchLookbook();
//         if (data.success) {
//           setItems(data.items);
//         }
//       } catch (error) {
//         // console.error("Failed to load lookbook:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   // Dynamically extract unique categories
//   const dynamicCategories = [
//     "All Collections",
//     ...Array.from(new Set(items.map((item) => item.category).filter(Boolean))),
//   ];

//   // Logic to split categories (Max 5 buttons, rest in dropdown)
//   const VISIBLE_LIMIT = 5;
//   const visibleCategories = dynamicCategories.slice(0, VISIBLE_LIMIT);
//   const hiddenCategories = dynamicCategories.slice(VISIBLE_LIMIT);

//   // Advanced Filter logic (Category + Search Query combined)
//   const filteredItems = items.filter((item) => {
//     // 1. Category check
//     const matchesCategory =
//       activeCategory === "All Collections" || item.category === activeCategory;

//     // 2. Search check (matches title OR category)
//     const searchLower = searchQuery.toLowerCase().trim();
//     const matchesSearch =
//       searchLower === "" ||
//       item.title.toLowerCase().includes(searchLower) ||
//       item.category.toLowerCase().includes(searchLower);

//     return matchesCategory && matchesSearch;
//   });

//   return (
//     <>
//       <Navbar />

//       <main
//         id="main-content"
//         className="min-h-screen pt-32 pb-24"
//         style={{
//           background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
//         }}
//       >
//         <header className="relative text-center px-4 mb-12 max-w-4xl mx-auto">
//           <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] md:tracking-[0.8em] uppercase text-[#BE6E5B] font-bold mb-4">
//             Curated For Boutiques
//           </p>
//           <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold tracking-wide drop-shadow-sm mb-4">
//             Wholesale Ethnic Wear Collections & Lookbook
//           </h1>
//           <p className="font-serif italic text-[#7A3D2A] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
//             Explore our wholesale ethnic wear collections, cotton suits,
//             designer kurtis, and B2B boutique fashion designs manufactured in
//             Jaipur.
//           </p>
//           <div
//             aria-hidden="true"
//             className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#BE6E5B] to-transparent mx-auto mt-8"
//           />
//         </header>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Category Filters + Search Bar UI */}
//           <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 mb-12">
//             {/* 1. Visible Buttons (Limit to 5) */}
//             <div
//               className="flex flex-wrap justify-center gap-3"
//               role="group"
//               aria-label="Filter Wholesale Collections"
//             >
//               {visibleCategories.map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setActiveCategory(cat)}
//                   aria-pressed={activeCategory === cat}
//                   title={`Filter by ${cat}`}
//                   aria-label={`Show ${cat} wholesale collection`}
//                   className={`px-5 py-2.5 rounded-full font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 border ${
//                     activeCategory === cat
//                       ? "bg-[#7A3D2A] text-[#FDF7F2] border-[#7A3D2A] shadow-md"
//                       : "bg-white/50 text-[#a07f61] border-[#BE6E5B]/30 hover:border-[#BE6E5B] hover:bg-white/80"
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}

//               {/* 2. Dropdown for extra categories (Appears only if > 5 categories) */}
//               {hiddenCategories.length > 0 && (
//                 <select
//                   value={
//                     hiddenCategories.includes(activeCategory)
//                       ? activeCategory
//                       : ""
//                   }
//                   onChange={(e) => setActiveCategory(e.target.value)}
//                   aria-label="Select additional wholesale categories"
//                   title="More wholesale categories"
//                   className={`px-5 py-2.5 rounded-full font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 border focus:outline-none cursor-pointer appearance-none ${
//                     hiddenCategories.includes(activeCategory)
//                       ? "bg-[#7A3D2A] text-[#FDF7F2] border-[#7A3D2A] shadow-md"
//                       : "bg-white/50 text-[#a07f61] border-[#BE6E5B]/30 hover:border-[#BE6E5B]"
//                   }`}
//                 >
//                   <option value="" disabled>
//                     More Categories...
//                   </option>
//                   {hiddenCategories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>

//             {/* 3. Search Bar */}
//             <div className="relative w-full md:w-auto mt-4 md:mt-0 flex-grow max-w-sm">
//               <input
//                 type="text"
//                 placeholder="Search collections..."
//                 aria-label="Search wholesale ethnic wear collections"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full px-5 py-2.5 rounded-full font-sans text-xs tracking-widest bg-white/70 border border-[#BE6E5B]/30 focus:border-[#7A3D2A] focus:bg-white focus:outline-none text-[#7A3D2A] placeholder-[#a07f61]/70 transition-all duration-300 shadow-sm"
//               />
//               <svg
//                 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BE6E5B]/70"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </div>
//           </div>

//           {/* Dynamic Content Area */}
//           <div aria-live="polite" aria-busy={loading}>
//             {loading ? (
//               <div
//                 className="text-center py-20 font-sans tracking-widest text-[#a07f61] uppercase text-sm"
//                 role="status"
//               >
//                 Loading Collections...
//               </div>
//             ) : (
//               <>
//                 <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
//                   {filteredItems.map((item) => (
//                     <article
//                       key={item._id}
//                       className="group relative break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#BE6E5B]/10"
//                     >
//                       <div className="relative w-full aspect-[4/5] bg-[#E0BFA2]/30 overflow-hidden">
//                         {/* ✅ SEO FIX: Enhanced Image Alt Text and added async decoding */}

//                         <img
//                           src={`${BACKEND_URL}${item.image}`}
//                           alt={`${item.title} - Wholesale Ethnic Wear Collection`}
//                           loading="lazy"
//                           decoding="async"
//                           className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                         />

//                         <div
//                           aria-hidden="true"
//                           className="absolute inset-0 bg-gradient-to-t from-[#7A3D2A]/90 via-[#7A3D2A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                         />

//                         <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
//                           <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#F2D9C3] font-bold mb-1">
//                             {item.category}
//                           </p>
//                           <h2 className="font-display text-xl md:text-2xl text-white font-bold mb-4">
//                             {item.title}
//                           </h2>

//                           {/* ✅ SEO FIX: Highly specific B2B internal linking context */}
//                           <Link
//                             href={`/contact?inquiry=${encodeURIComponent(item.title)}`}
//                             title={`Send bulk inquiry for ${item.title} collection`}
//                             aria-label={`Source the ${item.title} wholesale collection`}
//                             className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-sm font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-[#7A3D2A] transition-colors w-fit"
//                           >
//                             Source Collection <span aria-hidden="true">→</span>
//                           </Link>
//                         </div>
//                       </div>
//                     </article>
//                   ))}
//                 </div>

//                 {/* Empty State Message */}
//                 {filteredItems.length === 0 && (
//                   <div
//                     className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-xl border border-[#BE6E5B]/20"
//                     role="status"
//                   >
//                     <p className="font-display text-2xl text-[#7A3D2A] mb-2 font-bold">
//                       No collections found
//                     </p>
//                     <p className="font-sans text-sm text-[#a07f61]">
//                       Try adjusting your search or selecting a different
//                       category.
//                     </p>
//                     {searchQuery && (
//                       <button
//                         onClick={() => setSearchQuery("")}
//                         aria-label="Clear collection search query"
//                         className="mt-6 px-6 py-2 border border-[#BE6E5B] text-[#BE6E5B] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#BE6E5B] hover:text-white transition-colors"
//                       >
//                         Clear Search
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </>
//   );
// }


// FILE: client/src/app/lookbook/page.js
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LookbookModal from "@/components/lookbook/LookbookModal";
import { fetchLookbook } from "@/lib/api";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const badgeStyles = {
  Bestseller: "bg-[#BE6E5B]",
  Trending: "bg-[#D4A24C]",
  "New Arrival": "bg-[#4C8C6C]",
};

export default function LookbookPage() {
  const [activeCategory, setActiveCategory] = useState("All Collections");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null); // ✅ Quick view state

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLookbook();
        if (data.success) setItems(data.items);
      } catch (error) {
        // console.error("Failed to load lookbook:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const dynamicCategories = [
    "All Collections",
    ...Array.from(new Set(items.map((item) => item.category).filter(Boolean))),
  ];

  const VISIBLE_LIMIT = 5;
  const visibleCategories = dynamicCategories.slice(0, VISIBLE_LIMIT);
  const hiddenCategories = dynamicCategories.slice(VISIBLE_LIMIT);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === "All Collections" || item.category === activeCategory;
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      searchLower === "" ||
      item.title.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen pt-32 pb-24"
        style={{ background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)" }}
      >
        <header className="relative text-center px-4 mb-12 max-w-4xl mx-auto">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] md:tracking-[0.8em] uppercase text-[#BE6E5B] font-bold mb-4">
            Curated For Boutiques
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold tracking-wide drop-shadow-sm mb-4">
            Wholesale Ethnic Wear Collections & Lookbook
          </h1>
          <p className="font-serif italic text-[#7A3D2A] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our wholesale ethnic wear collections, cotton suits,
            designer kurtis, and B2B boutique fashion designs manufactured in Jaipur.
          </p>
          <div aria-hidden="true" className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#BE6E5B] to-transparent mx-auto mt-8" />
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 mb-12">
            <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Filter Wholesale Collections">
              {visibleCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`px-5 py-2.5 rounded-full font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 border ${
                    activeCategory === cat
                      ? "bg-[#7A3D2A] text-[#FDF7F2] border-[#7A3D2A] shadow-md"
                      : "bg-white/50 text-[#a07f61] border-[#BE6E5B]/30 hover:border-[#BE6E5B] hover:bg-white/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
              {hiddenCategories.length > 0 && (
                <select
                  value={hiddenCategories.includes(activeCategory) ? activeCategory : ""}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  aria-label="Select additional wholesale categories"
                  className={`px-5 py-2.5 rounded-full font-sans text-xs tracking-[0.2em] uppercase border cursor-pointer appearance-none ${
                    hiddenCategories.includes(activeCategory)
                      ? "bg-[#7A3D2A] text-[#FDF7F2] border-[#7A3D2A] shadow-md"
                      : "bg-white/50 text-[#a07f61] border-[#BE6E5B]/30 hover:border-[#BE6E5B]"
                  }`}
                >
                  <option value="" disabled>More Categories...</option>
                  {hiddenCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="relative w-full md:w-auto mt-4 md:mt-0 flex-grow max-w-sm">
              <input
                type="text"
                placeholder="Search collections..."
                aria-label="Search wholesale ethnic wear collections"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-2.5 rounded-full font-sans text-xs tracking-widest bg-white/70 border border-[#BE6E5B]/30 focus:border-[#7A3D2A] focus:bg-white focus:outline-none text-[#7A3D2A] placeholder-[#a07f61]/70 transition-all duration-300 shadow-sm"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BE6E5B]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div aria-live="polite" aria-busy={loading}>
            {loading ? (
              <div className="text-center py-20 font-sans tracking-widest text-[#a07f61] uppercase text-sm" role="status">
                Loading Collections...
              </div>
            ) : (
              <>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                  {filteredItems.map((item, index) => (
                    <article
                      key={item._id}
                      onClick={() => setSelectedItem(item)}
                      style={{ animationDelay: `${(index % 9) * 60}ms` }}
                      className="group relative break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#BE6E5B]/10 cursor-pointer opacity-0 animate-[cardIn_0.6s_ease_forwards] hover:-translate-y-1"
                    >
                      <div className="relative w-full aspect-[4/5] bg-[#E0BFA2]/30 overflow-hidden">
                        <img
                          src={`${BACKEND_URL}${item.image}`}
                          alt={`${item.title} - Wholesale Ethnic Wear Collection`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* ✅ Bestseller/Trending Ribbon */}
                        {item.badge && item.badge !== "None" && (
                          <span
                            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase text-white shadow-md ${
                              badgeStyles[item.badge] || "bg-[#7A3D2A]"
                            }`}
                          >
                            {item.badge === "Bestseller" ? "🔥 " : ""}
                            {item.badge}
                          </span>
                        )}

                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#7A3D2A]/90 via-[#7A3D2A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#F2D9C3] font-bold mb-1">
                            {item.category}
                          </p>
                          <h2 className="font-display text-xl md:text-2xl text-white font-bold mb-4">
                            {item.title}
                          </h2>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-sm font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-[#7A3D2A] transition-colors w-fit"
                            >
                              Quick View <span aria-hidden="true">→</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-xl border border-[#BE6E5B]/20" role="status">
                    <p className="font-display text-2xl text-[#7A3D2A] mb-2 font-bold">No collections found</p>
                    <p className="font-sans text-sm text-[#a07f61]">
                      Try adjusting your search or selecting a different category.
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-6 px-6 py-2 border border-[#BE6E5B] text-[#BE6E5B] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#BE6E5B] hover:text-white transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* ✅ Quick View Modal */}
      <LookbookModal
        item={selectedItem}
        backendUrl={BACKEND_URL}
        onClose={() => setSelectedItem(null)}
      />

      <Footer />

      <style jsx global>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}