// FILE: client/src/app/products/page.js
// PURPOSE: PRODUCTS LISTING PAGE — shown at URL "/products"

"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
// import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { fetchProducts, fetchProductCategories } from "@/lib/api";
import { redirect } from "next/navigation";

const FABRICS = ["Cotton", "Georgette", "Silk", "Rayon", "Mixed"];

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
  const [activeFabric, setActiveFabric] = useState(
    searchParams.get("fabric") || "",
  );
  const [page, setPage] = useState(1);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchProductCategories();
      setCategories(data.categories || []);
    } catch {}
  }, []);

  const loadProducts = useCallback(async (cat, fab, pg) => {
    setLoading(true);
    try {
      const data = await fetchProducts({
        category: cat || undefined,
        fabric: fab || undefined,
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
    const fab = searchParams.get("fabric") || "";
    setActiveCategory(cat);
    setActiveFabric(fab);
    setPage(1);
    loadProducts(cat, fab, 1);
  }, [searchParams, loadProducts]);

  const updateFilters = (cat, fab) => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (fab) params.set("fabric", fab);
    router.push("/products?" + params.toString());
  };

  const handleCategoryChange = (cat) => updateFilters(cat, activeFabric);
  const handleFabricChange = (fab) => updateFilters(activeCategory, fab);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadProducts(activeCategory, activeFabric, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="pt-[72px] md:pt-[80px]">
        <header
          className="py-16 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=40')",
              backgroundSize: "cover",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#FDF7F2]/40"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-sans text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-[#BE6E5B] font-bold mb-3">
              Wholesale Export Catalogue
            </p>

            {/*  SEO FIX: Enhanced B2B intent on fallback H1 */}
            <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold drop-shadow-sm">
              {activeCategory
                ? `Wholesale ${activeCategory}`
                : "Wholesale Ethnic Wear Manufacturer Catalog"}
            </h1>

            {pagination.total > 0 && (
              <p
                aria-live="polite"
                className="font-serif italic text-[#a07f61] mt-4 text-lg font-medium"
              >
                {pagination.total} wholesale export lots available
              </p>
            )}
          </div>
        </header>

        <main
          id="main-content"
          className="min-h-screen"
          style={{
            background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Filters Section */}
            <div className="flex flex-col gap-6 mb-10 pb-8 border-b border-[#BE6E5B]/20">
              {/* Categories */}
              {/*  A11Y FIX: Added role="group" for better screen reader context */}
              <nav
                aria-label="Wholesale Product Categories"
                role="group"
                className="flex flex-wrap justify-center gap-3"
              >
                <button
                  onClick={() => handleCategoryChange("")}
                  aria-pressed={!activeCategory}
                  title="View All Wholesale Ethnic Wear"
                  className={`font-sans text-[10px] md:text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all duration-300 font-bold ${
                    !activeCategory
                      ? "bg-[#7A3D2A] text-[#FDF7F2] shadow-md"
                      : "bg-white/50 backdrop-blur-sm border border-[#BE6E5B]/30 text-[#a07f61] hover:border-[#7A3D2A] hover:text-[#7A3D2A]"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    aria-pressed={activeCategory === cat}
                    title={`Filter by Wholesale ${cat}`}
                    className={`font-sans text-[10px] md:text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all duration-300 font-bold ${
                      activeCategory === cat
                        ? "bg-[#7A3D2A] text-[#FDF7F2] shadow-md"
                        : "bg-white/50 backdrop-blur-sm border border-[#BE6E5B]/30 text-[#a07f61] hover:border-[#7A3D2A] hover:text-[#7A3D2A]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>

              {/* Fabrics */}
              <nav
                aria-label="Wholesale Fabric Filters"
                role="group"
                className="flex flex-wrap justify-center gap-3"
              >
                <span className="font-serif italic text-[#a07f61] self-center mr-2">
                  Filter by Fabric:
                </span>
                <button
                  onClick={() => handleFabricChange("")}
                  aria-pressed={!activeFabric}
                  title="Any Fabric"
                  className={`font-sans text-[9px] md:text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full transition-all duration-300 font-bold ${
                    !activeFabric
                      ? "bg-[#BE6E5B] text-white"
                      : "bg-transparent border border-[#BE6E5B]/40 text-[#BE6E5B] hover:bg-[#BE6E5B]/10"
                  }`}
                >
                  Any
                </button>
                {FABRICS.map((fab) => (
                  <button
                    key={fab}
                    onClick={() => handleFabricChange(fab)}
                    aria-pressed={activeFabric === fab}
                    title={`Filter wholesale products by ${fab} fabric`}
                    className={`font-sans text-[9px] md:text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full transition-all duration-300 font-bold ${
                      activeFabric === fab
                        ? "bg-[#BE6E5B] text-white"
                        : "bg-transparent border border-[#BE6E5B]/40 text-[#BE6E5B] hover:bg-[#BE6E5B]/10"
                    }`}
                  >
                    {fab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Product Grid */}
            <section
              aria-label="Wholesale Products Grid"
              aria-live="polite"
              aria-busy={loading}
            >
              {loading ? (
                <ProductGridSkeleton count={12} />
              ) : products.length === 0 ? (
                <div
                  role="status"
                  className="text-center py-24 bg-white/40 backdrop-blur-sm rounded-lg border border-[#BE6E5B]/10"
                >
                  <p className="font-display text-3xl text-[#7A3D2A] mb-4 font-bold">
                    No matching wholesale lots found
                  </p>
                  <button
                    onClick={() => updateFilters("", "")}
                    aria-label="Clear all product filters"
                    title="Clear Filters"
                    className="font-sans text-xs text-[#BE6E5B] font-bold uppercase tracking-[0.2em] border border-[#BE6E5B] px-6 py-2 rounded-sm hover:bg-[#BE6E5B] hover:text-white transition-colors"
                  >
                    Clear Filters
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
            {pagination.pages > 1 && (
              <nav
                aria-label="Wholesale Catalog Pagination"
                className="flex justify-center gap-3 mt-16"
              >
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (pg) => (
                    <button
                      key={pg}
                      onClick={() => handlePageChange(pg)}
                      aria-current={pg === page ? "page" : undefined}
                      aria-label={`Go to wholesale catalog page ${pg}`}
                      title={`Page ${pg}`}
                      className={`w-10 h-10 rounded-sm font-sans text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center ${
                        pg === page
                          ? "bg-[#7A3D2A] text-[#FDF7F2] shadow-md"
                          : "bg-white/50 backdrop-blur-sm border border-[#BE6E5B]/30 text-[#a07f61] hover:border-[#7A3D2A] hover:text-[#7A3D2A]"
                      }`}
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
  
  redirect("/");

  return (
    <>
      {/* <Navbar /> */}
      <Suspense
        fallback={
          <div
            className="min-h-screen pt-32 bg-[#FAF3E8]"
            aria-live="polite"
            aria-busy="true"
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
