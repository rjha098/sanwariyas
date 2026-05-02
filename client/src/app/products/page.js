// // PURPOSE: PRODUCTS LISTING PAGE — shown at URL "/products"
// "use client";

// import { Suspense } from "react";
// import { useState, useEffect, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import ProductCard from "@/components/ui/ProductCard";
// import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
// import { fetchProducts, fetchCategories } from "@/lib/api";

// // ── NEW EARTHY COLOR PALETTE ────────────────────────────────
// // Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
// // Headings/Active: #7A3D2A (Dark Burnt)
// // Default Text: #a07f61 (Warm Brown)
// // Accents: #BE6E5B (Terracotta)
// // ────────────────────────────────────────────────────────────

// function ProductsContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [pagination, setPagination] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState(
//     searchParams.get("category") || "",
//   );
//   const [page, setPage] = useState(1);

//   const loadCategories = useCallback(async () => {
//     try {
//       const data = await fetchCategories();
//       setCategories(data.categories || []);
//     } catch {}
//   }, []);

//   const loadProducts = useCallback(async (cat, pg) => {
//     setLoading(true);
//     try {
//       const data = await fetchProducts({
//         category: cat || undefined,
//         page: pg,
//         limit: 12,
//       });
//       setProducts(data.products || []);
//       setPagination(data.pagination || {});
//     } catch {
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadCategories();
//   }, [loadCategories]);

//   useEffect(() => {
//     const cat = searchParams.get("category") || "";
//     setActiveCategory(cat);
//     setPage(1);
//     loadProducts(cat, 1);
//     // Run loadProducts whenever URL changes
//     // User clicks "Sarees" → URL changes → useEffect runs → new products load
//   }, [searchParams, loadProducts]);

//   // Change the URL — this triggers useEffect above
//   // URL change = new products load automatically
//   const handleCategoryChange = (cat) => {
//     const params = new URLSearchParams();
//     if (cat) params.set("category", cat);
//     router.push("/products?" + params.toString());
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     loadProducts(activeCategory, newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   {
//     /* FILTER BUTTONS — All, Sarees, Lehengas, Suits etc. */
//   }
//   {
//     /* PRODUCT GRID — 2 cols mobile, 3 tablet, 4 desktop */
//   }
//   {
//     /* PAGINATION — page numbers at bottom */
//   }

//   return (
//     <>
//       <div className="pt-[72px] md:pt-[80px]">
//         {/* Header Section */}
//         <div
//           className="py-16 relative overflow-hidden"
//           style={{
//             background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
//           }}
//         >
//           <div
//             className="absolute inset-0 opacity-10"
//             style={{
//               backgroundImage:
//                 "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=40')",
//               backgroundSize: "cover",
//             }}
//           />
//           <div className="absolute inset-0 bg-[#FDF7F2]/40" />
//           <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <p className="font-sans text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-[#BE6E5B] font-bold mb-3">
//               Our Collections
//             </p>

//             <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold drop-shadow-sm">
//               {activeCategory || "All Collections"}
//             </h1>

//             {pagination.total > 0 && (
//               <p className="font-serif italic text-[#a07f61] mt-4 text-lg font-medium">
//                 {pagination.total} pieces
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Main Content */}
//         <main
//           className="min-h-screen"
//           style={{
//             background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
//           }}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//             {/* Category Filters */}
//             <div className="flex flex-wrap justify-center gap-3 mb-10 pb-8 border-b border-[#BE6E5B]/20">
//               <button
//                 onClick={() => handleCategoryChange("")}
//                 className={
//                   "font-sans text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all duration-300 " +
//                   (!activeCategory
//                     ? "bg-[#7A3D2A] text-[#FDF7F2] font-bold shadow-md"
//                     : "bg-white/50 backdrop-blur-sm border border-[#BE6E5B]/30 text-[#a07f61] font-medium hover:border-[#7A3D2A] hover:text-[#7A3D2A]")
//                 }
//               >
//                 All
//               </button>
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => handleCategoryChange(cat)}
//                   className={
//                     "font-sans text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all duration-300 " +
//                     (activeCategory === cat
//                       ? "bg-[#7A3D2A] text-[#FDF7F2] font-bold shadow-md"
//                       : "bg-white/50 backdrop-blur-sm border border-[#BE6E5B]/30 text-[#a07f61] font-medium hover:border-[#7A3D2A] hover:text-[#7A3D2A]")
//                   }
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>

//             {/* Product Grid */}
//             {loading ? (
//               <ProductGridSkeleton count={12} />
//             ) : products.length === 0 ? (
//               <div className="text-center py-24 bg-white/40 backdrop-blur-sm rounded-lg border border-[#BE6E5B]/10">
//                 <p className="font-display text-3xl text-[#a07f61] mb-4 font-semibold">
//                   No products found
//                 </p>
//                 <button
//                   onClick={() => handleCategoryChange("")}
//                   className="font-sans text-sm text-[#7A3D2A] font-bold uppercase tracking-wider hover:text-[#BE6E5B] transition-colors"
//                 >
//                   View all collections
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//                 {products.map((product) => (
//                   <ProductCard key={product._id} product={product} />
//                 ))}
//               </div>
//             )}

//             {/* Pagination */}
//             {pagination.pages > 1 && (
//               <div className="flex justify-center gap-3 mt-16">
//                 {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
//                   (pg) => (
//                     <button
//                       key={pg}
//                       onClick={() => handlePageChange(pg)}
//                       className={
//                         "w-10 h-10 rounded-sm font-sans text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center " +
//                         (pg === page
//                           ? "bg-[#7A3D2A] text-[#FDF7F2] shadow-md"
//                           : "bg-white/50 backdrop-blur-sm border border-[#BE6E5B]/30 text-[#a07f61] hover:border-[#7A3D2A] hover:text-[#7A3D2A]")
//                       }
//                     >
//                       {pg}
//                     </button>
//                   ),
//                 )}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

// export default function ProductsPage() {
//   return (
//     <>
//       <Navbar />
//       <Suspense
//         fallback={
//           <div
//             className="min-h-screen pt-32"
//             style={{
//               background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
//             }}
//           >
//             <div className="max-w-7xl mx-auto px-4 py-12">
//               <ProductGridSkeleton count={12} />
//             </div>
//           </div>
//         }
//       >
//         <ProductsContent />
//       </Suspense>
//       <Footer />
//     </>
//   );
// }


// PURPOSE: PRODUCTS LISTING PAGE — shown at URL "/products"
"use client";

import { Suspense } from "react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { fetchProducts, fetchCategories } from "@/lib/api";

// ── NEW EARTHY COLOR PALETTE ────────────────────────────────
// Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
// Headings/Active: #7A3D2A (Dark Burnt)
// Default Text: #a07f61 (Warm Brown)
// Accents: #BE6E5B (Terracotta)
// ────────────────────────────────────────────────────────────

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "",
  );
  const [page, setPage] = useState(1);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategories(data.categories || []);
    } catch {}
  }, []);

  const loadProducts = useCallback(async (cat, pg) => {
    setLoading(true);
    try {
      const data = await fetchProducts({
        category: cat || undefined,
        page: pg,
        limit: 12,
      });
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setActiveCategory(cat);
    setPage(1);
    loadProducts(cat, 1);
    // Run loadProducts whenever URL changes
    // User clicks "Sarees" → URL changes → useEffect runs → new products load
  }, [searchParams, loadProducts]);

  // Change the URL — this triggers useEffect above
  // URL change = new products load automatically
  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    router.push("/products?" + params.toString());
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadProducts(activeCategory, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="pt-[72px] md:pt-[80px]">
        {/* Header Section */}
        {/* ✅ A11Y & SEO: Converted to semantic <header> */}
        <header
          className="py-16 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
          }}
        >
          {/* ✅ A11Y: Hidden decorative background images */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=40')",
              backgroundSize: "cover",
            }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[#FDF7F2]/40" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-sans text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-[#BE6E5B] font-bold mb-3">
              Our Collections
            </p>

            <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold drop-shadow-sm">
              {activeCategory || "All Collections"}
            </h1>

            {/* ✅ A11Y: Status update for screen readers about items count */}
            {pagination.total > 0 && (
              <p aria-live="polite" className="font-serif italic text-[#a07f61] mt-4 text-lg font-medium">
                {pagination.total} pieces
              </p>
            )}
          </div>
        </header>

        {/* Main Content */}
        {/* ✅ A11Y: Added id="main-content" for "skip to content" links */}
        <main
          id="main-content"
          className="min-h-screen"
          style={{
            background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Category Filters */}
            {/* ✅ A11Y & SEO: Wrapped filters in semantic <nav> */}
            <nav aria-label="Product Categories" className="flex flex-wrap justify-center gap-3 mb-10 pb-8 border-b border-[#BE6E5B]/20">
              <button
                onClick={() => handleCategoryChange("")}
                aria-pressed={!activeCategory}
                className={
                  "font-sans text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all duration-300 " +
                  (!activeCategory
                    ? "bg-[#7A3D2A] text-[#FDF7F2] font-bold shadow-md"
                    : "bg-white/50 backdrop-blur-sm border border-[#BE6E5B]/30 text-[#a07f61] font-medium hover:border-[#7A3D2A] hover:text-[#7A3D2A]")
                }
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  aria-pressed={activeCategory === cat}
                  className={
                    "font-sans text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all duration-300 " +
                    (activeCategory === cat
                      ? "bg-[#7A3D2A] text-[#FDF7F2] font-bold shadow-md"
                      : "bg-white/50 backdrop-blur-sm border border-[#BE6E5B]/30 text-[#a07f61] font-medium hover:border-[#7A3D2A] hover:text-[#7A3D2A]")
                  }
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* Product Grid */}
            {/* ✅ A11Y & SEO: Wrapped grid in semantic <section> with aria-live */}
            <section aria-label="Products Grid" aria-live="polite" aria-busy={loading}>
              {loading ? (
                <ProductGridSkeleton count={12} />
              ) : products.length === 0 ? (
                <div role="status" className="text-center py-24 bg-white/40 backdrop-blur-sm rounded-lg border border-[#BE6E5B]/10">
                  <p className="font-display text-3xl text-[#a07f61] mb-4 font-semibold">
                    No products found
                  </p>
                  <button
                    onClick={() => handleCategoryChange("")}
                    className="font-sans text-sm text-[#7A3D2A] font-bold uppercase tracking-wider hover:text-[#BE6E5B] transition-colors"
                  >
                    View all collections
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </section>

            {/* Pagination */}
            {/* ✅ A11Y & SEO: Wrapped pagination in semantic <nav> */}
            {pagination.pages > 1 && (
              <nav aria-label="Pagination" className="flex justify-center gap-3 mt-16">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (pg) => (
                    <button
                      key={pg}
                      onClick={() => handlePageChange(pg)}
                      aria-current={pg === page ? "page" : undefined}
                      aria-label={`Go to page ${pg}`}
                      className={
                        "w-10 h-10 rounded-sm font-sans text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center " +
                        (pg === page
                          ? "bg-[#7A3D2A] text-[#FDF7F2] shadow-md"
                          : "bg-white/50 backdrop-blur-sm border border-[#BE6E5B]/30 text-[#a07f61] hover:border-[#7A3D2A] hover:text-[#7A3D2A]")
                      }
                    >
                      {pg}
                    </button>
                  ),
                )}
              </nav>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div
            className="min-h-screen pt-32"
            style={{
              background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
            }}
            aria-live="polite"
            aria-busy="true"
            aria-label="Loading products"
          >
            <div className="max-w-7xl mx-auto px-4 py-12">
              <ProductGridSkeleton count={12} />
            </div>
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
      <Footer />
    </>
  );
}