// FILE: client/src/app/lookbook/page.js

"use client";
import { useState, useEffect } from "react";
// import Navbar from "@/components/layout/Navbar";
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
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [shuffleKey, setShuffleKey] = useState(0);

  const [shortlist, setShortlist] = useState([]);
  const [isBoxOpen, setIsBoxOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLookbook();
        if (data.success) setItems(data.items);
      } catch (error) {
        // Error handled silently
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

  const seededShuffle = (array, seed) => {
    const arr = [...array];
    let s = seed || 1;
    const random = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const displayItems =
    shuffleKey === 0 ? filteredItems : seededShuffle(filteredItems, shuffleKey);

  const toggleShortlist = (item) => {
    const exists = shortlist.find((i) => i._id === item._id);
    if (exists) {
      setShortlist(shortlist.filter((i) => i._id !== item._id));
      if (shortlist.length === 1 && isBoxOpen) {
        setIsBoxOpen(false);
      }
    } else {
      setShortlist([...shortlist, item]);
    }
  };

  const handleBulkInquiry = () => {
    const names = shortlist.map((i) => i.title).join(", ");
    const msg = encodeURIComponent(
      `Hi SANWARIYAS, I'm interested in placing a bulk wholesale order for these collections:\n\n${names}\n\nPlease share catalog, pricing, and MOQ details.`,
    );
    window.open(`https://wa.me/919251171306?text=${msg}`, "_blank");
  };

  useEffect(() => {
    if (isBoxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isBoxOpen]);

  return (
    <>
      {/* <Navbar /> */}
      <main
        id="main-content"
        className="min-h-screen pt-32 pb-24 relative"
        style={{
          background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
        }}
      >
        <header className="relative text-center px-4 mb-14 max-w-4xl mx-auto">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] md:tracking-[0.8em] uppercase text-[#BE6E5B] font-bold mb-4">
            Curated For Boutiques
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold tracking-wide drop-shadow-sm mb-4">
            Wholesale Ethnic Wear Collections
          </h1>
          <p className="font-serif italic text-[#7A3D2A] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our wholesale ethnic wear collections, cotton suits,
            designer kurtis, and B2B boutique fashion designs.
          </p>
          <div
            aria-hidden="true"
            className="flex items-center justify-center gap-4 mt-8"
          >
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
            <span className="text-[#BE6E5B] text-lg">✦</span>
            <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-4 mb-12">
            <div className="flex flex-wrap justify-center gap-3" role="group">
              {visibleCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border font-semibold ${
                    activeCategory === cat
                      ? "bg-[#7A3D2A] text-[#FDF7F2] border-[#7A3D2A] shadow-md"
                      : "bg-white/50 text-[#a07f61] border-[#BE6E5B]/30 hover:border-[#BE6E5B] hover:bg-white/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-2.5 rounded-full font-sans text-xs tracking-widest bg-white/70 border border-[#BE6E5B]/30 focus:border-[#7A3D2A] focus:bg-white focus:outline-none text-[#7A3D2A] placeholder-[#a07f61]/70 transition-all duration-300 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div aria-live="polite" aria-busy={loading}>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-xl bg-[#E0BFA2]/30 shadow-sm animate-pulse aspect-[3/4]"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                {displayItems.length > 0 && (
                  <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
                    <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#a07f61]">
                      {displayItems.length} Pieces Curated
                    </p>
                    {displayItems.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setShuffleKey((k) => k + 1)}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-[#7A3D2A] border border-[#BE6E5B]/40 bg-white/60 hover:bg-[#7A3D2A] hover:text-white hover:border-[#7A3D2A] transition-all duration-300 active:scale-95"
                      >
                        ✨ Surprise Me
                      </button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayItems.map((item, index) => {
                    const isShortlisted = shortlist.some(
                      (i) => i._id === item._id,
                    );

                    return (
                      <article
                        key={item._id}
                        onClick={() => setSelectedIndex(index)}
                        style={{ animationDelay: `${(index % 9) * 60}ms` }}
                        className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 border border-[#BE6E5B]/15 cursor-pointer opacity-0 animate-[cardIn_0.6s_ease_forwards] hover:-translate-y-1.5 bg-white flex flex-col"
                      >
                        <div className="relative w-full aspect-[3/4] bg-[#FAF3E8] overflow-hidden">
                          <img
                            src={`${BACKEND_URL}${item.image}`}
                            alt={`${item.title} - Wholesale Ethnic Wear Collection`}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                          />

                          <div className="absolute top-[40%] left-[30%] z-20 group/hotspot hidden md:block">
                            <div className="relative flex items-center justify-center w-5 h-5">
                              <span className="absolute inline-flex w-full h-full rounded-full bg-white opacity-60 animate-ping"></span>
                              <span className="relative inline-flex w-2 h-2 rounded-full bg-white shadow"></span>
                            </div>
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/hotspot:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-sm text-[#7A3D2A] text-[9px] tracking-[0.1em] uppercase font-bold px-3 py-1.5 rounded shadow-lg pointer-events-none whitespace-nowrap transform -translate-x-2 group-hover/hotspot:translate-x-0">
                              Authentic {item.category}
                            </div>
                          </div>

                          {item.badge && item.badge !== "None" && (
                            <span
                              className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[8px] font-bold tracking-[0.2em] uppercase text-white shadow-md ${
                                badgeStyles[item.badge] || "bg-[#7A3D2A]"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}

                          <div className="absolute top-3 right-3 flex gap-2 z-10">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleShortlist(item);
                              }}
                              title={
                                isShortlisted
                                  ? "Remove from inquiry"
                                  : "Add to Bulk Inquiry"
                              }
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm ${
                                isShortlisted
                                  ? "bg-[#7A3D2A] text-white border border-[#7A3D2A]"
                                  : "bg-white/25 backdrop-blur-md border border-white/40 text-white opacity-80 group-hover:opacity-100 hover:bg-white hover:text-[#7A3D2A]"
                              }`}
                            >
                              {isShortlisted ? "✓" : "+"}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(index);
                              }}
                              title="Quick View"
                              className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-80 group-hover:opacity-100 hover:bg-white hover:text-[#7A3D2A] transition-all duration-300 shadow-sm"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </button>
                          </div>

                          <div
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          />

                          <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none">
                            <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-[#E8D5A3] font-bold mb-1.5">
                              {item.category}
                            </p>
                            <h2 className="font-display text-base md:text-lg text-white font-bold leading-snug mb-0">
                              {item.title}
                            </h2>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-xl border border-[#BE6E5B]/20">
                    <p className="font-display text-2xl text-[#7A3D2A] mb-2 font-bold">
                      No collections found
                    </p>
                    <p className="font-sans text-sm text-[#a07f61]">
                      Try adjusting your search or selecting a different
                      category.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {shortlist.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] bg-[#7A3D2A] text-white px-2 py-2 pr-6 rounded-full shadow-2xl flex items-center justify-between gap-4 animate-[popIn_0.3s_ease] border border-white/20 min-w-[320px]">
          <button
            onClick={() => setIsBoxOpen(true)}
            className="flex items-center gap-3 pl-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
            title="View selected items"
          >
            <span className="flex items-center justify-center bg-white text-[#7A3D2A] w-8 h-8 rounded-full font-bold text-sm">
              {shortlist.length}
            </span>
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold">
              View Box
            </span>
          </button>
          <button
            onClick={() => setIsBoxOpen(true)}
            className="bg-[#25D366] text-white px-5 py-2.5 rounded-full font-sans text-[10px] tracking-[0.2em] uppercase font-bold hover:brightness-110 transition flex items-center gap-2 shadow-lg"
          >
            Inquire Bulk
            <span>→</span>
          </button>
        </div>
      )}

      {isBoxOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease]">
          <div
            className="absolute inset-0"
            onClick={() => setIsBoxOpen(false)}
          ></div>

          <div className="relative w-full max-w-md bg-[#FDF7F2] h-full shadow-2xl flex flex-col animate-[slideInRight_0.4s_ease-out]">
            <div className="flex items-center justify-between p-6 border-b border-[#E8D5A3]/40 bg-white">
              <div>
                <h2 className="font-display text-2xl text-[#7A3D2A] font-bold">
                  Your Inquiry Box
                </h2>
                <p className="font-sans text-xs text-[#a07f61] mt-1">
                  {shortlist.length} items selected
                </p>
              </div>
              <button
                onClick={() => setIsBoxOpen(false)}
                className="w-10 h-10 rounded-full bg-[#FAF3E8] hover:bg-[#E8D5A3] text-[#7A3D2A] flex items-center justify-center text-xl transition-colors"
                title="Close"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {shortlist.length === 0 ? (
                <p className="text-center font-sans text-sm text-[#a07f61] mt-10">
                  Your box is empty.
                </p>
              ) : (
                shortlist.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 items-center bg-white p-3 rounded-xl border border-[#BE6E5B]/15 shadow-sm group"
                  >
                    <div className="w-20 h-24 rounded-lg bg-[#FAF3E8] overflow-hidden flex-shrink-0">
                      <img
                        src={`${BACKEND_URL}${item.image}`}
                        className="w-full h-full object-cover"
                        alt={item.title}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#BE6E5B]">
                        {item.category}
                      </p>
                      <h3 className="font-display text-base text-[#7A3D2A] font-bold leading-tight mt-1 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => toggleShortlist(item)}
                      className="p-2.5 text-red-400 hover:text-white hover:bg-red-500 rounded-full transition-colors flex-shrink-0"
                      title="Remove from box"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {shortlist.length > 0 && (
              <div className="p-6 bg-white border-t border-[#E8D5A3]/40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <button
                  onClick={handleBulkInquiry}
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-sans text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#1EBE57] hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-3"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Send Inquiry to WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <LookbookModal
        item={selectedIndex !== null ? displayItems[selectedIndex] : null}
        backendUrl={BACKEND_URL}
        onClose={() => setSelectedIndex(null)}
        onNext={() =>
          setSelectedIndex((i) => (i < displayItems.length - 1 ? i + 1 : i))
        }
        onPrev={() => setSelectedIndex((i) => (i > 0 ? i - 1 : i))}
        hasNext={
          selectedIndex !== null && selectedIndex < displayItems.length - 1
        }
        hasPrev={selectedIndex !== null && selectedIndex > 0}
        currentIndex={selectedIndex || 0}
        totalCount={displayItems.length}
        shortlist={shortlist}
        toggleShortlist={toggleShortlist}
      />

      <Footer />

      <style jsx global>{`
        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes popIn {
          0% {
            transform: translate(-50%, 100%) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
