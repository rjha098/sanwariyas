// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { fetchLookbook } from "@/lib/api";

// const CATEGORIES = ["All Collections", "Bridal Export", "Festive Collections", "Manufacturing BTS", "Dispatch Diaries"];

// // Aapke backend ka exact base URL (Taaki local image load ho sake)
// const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL 
//   ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
//   : 'http://localhost:5000';

// export default function LookbookPage() {
//   const [activeCategory, setActiveCategory] = useState("All Collections");
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Backend se Lookbook fetch karna
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await fetchLookbook();
//         if (data.success) {
//           setItems(data.items);
//         }
//       } catch (error) {
//         console.error("Failed to load lookbook:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   // Filter logic (Removed TypeScript ': any')
//   const filteredItems = activeCategory === "All Collections" 
//     ? items 
//     : items.filter((item) => item.category === activeCategory);

//   return (
//     <>
//       <Navbar/>

//       <main
//         id="main-content"
//         className="min-h-screen pt-32 pb-24"
//         style={{
//           background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
//         }}
//       >
//         <header className="relative text-center px-4 mb-16 max-w-4xl mx-auto">
//           <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] md:tracking-[0.8em] uppercase text-[#BE6E5B] font-bold mb-4">
//             Curated For Boutiques
//           </p>
//           <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold tracking-wide drop-shadow-sm mb-4">
//             Our Brand Story
//           </h1>
//           <p className="font-serif italic text-[#7A3D2A] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
//             Explore our manufacturing process, seasonal shoots, and trending designs. Premium ethnic wear crafted for global wholesale.
//           </p>
//           <div aria-hidden="true" className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#BE6E5B] to-transparent mx-auto mt-8" />
//         </header>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
//           <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
//             {CATEGORIES.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setActiveCategory(cat)}
//                 className={`px-5 py-2.5 rounded-full font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 border ${
//                   activeCategory === cat
//                     ? "bg-[#7A3D2A] text-[#FDF7F2] border-[#7A3D2A] shadow-md"
//                     : "bg-white/50 text-[#a07f61] border-[#BE6E5B]/30 hover:border-[#BE6E5B] hover:bg-white/80"
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>

//           {loading ? (
//              <div className="text-center py-20 font-sans tracking-widest text-[#a07f61] uppercase text-sm">
//                 Loading Collections...
//              </div>
//           ) : (
//             <>
//               <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
//                 {filteredItems.map((item) => (
//                   <article 
//                     key={item._id} 
//                     className="group relative break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#BE6E5B]/10"
//                   >
//                     <div className="relative w-full aspect-[4/5] bg-[#E0BFA2]/30 overflow-hidden">
//                       {/* ✅ FIX: Corrected Image JSX syntax */}
//                       <Image 
//                         src={`${BACKEND_URL}${item.image}`} 
//                         alt={item.title} 
//                         fill 
//                         unoptimized 
//                         className="object-cover transition-transform duration-700 group-hover:scale-110"
//                       />
                      
//                       <div className="absolute inset-0 bg-gradient-to-t from-[#7A3D2A]/90 via-[#7A3D2A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//                       <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
//                         <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#F2D9C3] font-bold mb-1">
//                           {item.category}
//                         </p>
//                         <h3 className="font-display text-xl md:text-2xl text-white font-bold mb-4">
//                           {item.title}
//                         </h3>
                        
//                         {/* ✅ FIX: Corrected Link JSX syntax */}
//                         <Link 
//                           href={`/contact?inquiry=${encodeURIComponent(item.title)}`} 
//                           className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-sm font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-[#7A3D2A] transition-colors w-fit"
//                         >
//                           Source Collection <span aria-hidden="true">→</span>
//                         </Link>
//                       </div>
//                     </div>
//                   </article>
//                 ))}
//               </div>

//               {filteredItems.length === 0 && (
//                 <div className="text-center py-20">
//                   <p className="font-serif text-xl text-[#a07f61]">No collections found in this category.</p>
//                 </div>
//               )}
//             </>
//           )}

//         </div>
//       </main>

//       <Footer/>
//     </>
//   );
// }




// FILE: client/src/app/lookbook/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchLookbook } from "@/lib/api";

const CATEGORIES = ["All Collections", "Bridal Export", "Festive Collections", "Manufacturing BTS", "Dispatch Diaries"];

// Backend exact base URL
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
  : 'http://localhost:5000';

export default function LookbookPage() {
  const [activeCategory, setActiveCategory] = useState("All Collections");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Lookbook data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLookbook();
        if (data.success) {
          setItems(data.items);
        }
      } catch (error) {
        console.error("Failed to load lookbook:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter logic
  const filteredItems = activeCategory === "All Collections" 
    ? items 
    : items.filter((item) => item.category === activeCategory);

  return (
    <>
      <Navbar/>

      <main
        id="main-content"
        className="min-h-screen pt-32 pb-24"
        style={{
          background: "linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)",
        }}
      >
        <header className="relative text-center px-4 mb-16 max-w-4xl mx-auto">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.6em] md:tracking-[0.8em] uppercase text-[#BE6E5B] font-bold mb-4">
            Curated For Boutiques
          </p>
          {/* ✅ SEMANTIC HTML: Strict H1 */}
          <h1 className="font-display text-4xl md:text-6xl text-[#7A3D2A] font-bold tracking-wide drop-shadow-sm mb-4">
            Our Brand Story
          </h1>
          <p className="font-serif italic text-[#7A3D2A] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our manufacturing process, seasonal shoots, and trending designs. Premium ethnic wear crafted for global wholesale.
          </p>
          <div aria-hidden="true" className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#BE6E5B] to-transparent mx-auto mt-8" />
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filters */}
          <div 
            className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12"
            role="group" 
            aria-label="Filter Collections"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                // ✅ A11Y FIX: Added aria-pressed for screen readers to announce active state
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
          </div>

          {/* Dynamic Content Area */}
          <div aria-live="polite" aria-busy={loading}>
            {loading ? (
               // ✅ A11Y FIX: Role status for loading
               <div className="text-center py-20 font-sans tracking-widest text-[#a07f61] uppercase text-sm" role="status">
                 Loading Collections...
               </div>
            ) : (
              <>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                  {filteredItems.map((item) => (
                    <article 
                      key={item._id} 
                      className="group relative break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#BE6E5B]/10"
                    >
                      <div className="relative w-full aspect-[4/5] bg-[#E0BFA2]/30 overflow-hidden">
                        <Image 
                          src={`${BACKEND_URL}${item.image}`} 
                          // ✅ SEO FIX: Ensure descriptive alt text is passed here (item.title is good)
                          alt={item.title} 
                          fill 
                          unoptimized 
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#7A3D2A]/90 via-[#7A3D2A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#F2D9C3] font-bold mb-1">
                            {item.category}
                          </p>
                          {/* ✅ SEO FIX: Changed from H3 to H2 to maintain strict document hierarchy after the H1 */}
                          <h2 className="font-display text-xl md:text-2xl text-white font-bold mb-4">
                            {item.title}
                          </h2>
                          
                          <Link 
                            href={`/contact?inquiry=${encodeURIComponent(item.title)}`} 
                            title={`Inquire about ${item.title}`}
                            aria-label={`Source the ${item.title} collection`}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-sm font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-[#7A3D2A] transition-colors w-fit"
                          >
                            Source Collection <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  // ✅ A11Y FIX: Role status for empty results
                  <div className="text-center py-20" role="status">
                    <p className="font-serif text-xl text-[#a07f61]">No collections found in this category.</p>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </main>

      <Footer/>
    </>
  );
}