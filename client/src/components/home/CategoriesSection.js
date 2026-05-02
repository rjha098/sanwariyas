import Image from 'next/image';
import Link from 'next/link';

// ── UPDATED CATEGORY DATA ────────────────────────────────
const categories = [
  { 
    name: 'Anarkali Kurtis',  
    slug: 'anarkali-kurti',  
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',  
    count: 'Anarkali • Festive • Designer' 
  },
  { 
    name: 'Short Kurtis', 
    slug: 'short-kurti', 
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80',  
    count: 'Casual • Printed • Daily Wear' 
  },
  { 
    name: 'Long Kurtis',    
    slug: 'long-kurti',    
    image: 'https://images.unsplash.com/photo-1724139139873-57572c120322?q=80&w=880&auto=format&fit=crop', 
    count: 'Straight • Ethnic • Elegant'  
  },
  { 
    name: 'Co-ord Sets',    
    slug: 'coord-set',    
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',  
    count: 'Matching Sets • Trendy • Modern'   
  },
  { 
    name: 'Straight 3 Piece Suits',    
    slug: 'straight-3piece-suit',    
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',  
    count: 'Kurta • Pant • Dupatta'   
  },
  { 
    name: 'A-Line Suits',    
    slug: 'a-line-suit',    
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',  
    count: 'A-Line • Party • Festive'   
  },
];


export default function CategoriesSection() {
  return (
    <section 
      aria-labelledby="categories-heading"
      className="py-24 md:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)' }}
    >
      <div 
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(#7A3D2A 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="font-sans text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-4">
            Wholesale Collections
          </p>

          {/* SEO optimized heading */}
          <h2 id="categories-heading" className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold">
            Explore Wholesale Kurti Categories
          </h2>

          <div aria-hidden="true" className="flex items-center justify-center gap-4 mt-6">
            <div className="h-[2px] w-16 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
            <span className="text-[#BE6E5B] text-lg animate-pulse">✦</span>
            <div className="h-[2px] w-16 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
          </div>   
        </div>

        {/* ✅ FIXED GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(122,61,42,0.25)] hover:-translate-y-2 transition-all duration-700 bg-[#7A3D2A] rounded-sm"
              style={{ aspectRatio: '3/4' }}
              aria-label={`Explore ${cat.name} wholesale collection`}
            >
              <Image
                src={cat.image}
                alt={`${cat.name} wholesale collection India`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 16vw"
                className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-[1500ms] group-hover:scale-110"
              />
              
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#7A3D2A] via-[#7A3D2A]/30 to-transparent group-hover:from-[#7A3D2A]/90 transition-all duration-700" />
              
              <div aria-hidden="true" className="absolute inset-3 border border-[#BE6E5B]/0 group-hover:border-[#BE6E5B]/60 transition-all duration-700 z-20 pointer-events-none" />
              
              <div aria-hidden="true" className="absolute top-6 right-6 font-display text-5xl text-[#FDF7F2]/30 group-hover:text-[#F2D9C3]/50 transition-colors duration-700 leading-none select-none z-10">
                0{index + 1}
              </div>
                    
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 z-20">
                <div className="flex items-center gap-3 mb-3">
                  <div aria-hidden="true" className="h-px w-8 bg-[#BE6E5B]/80 group-hover:w-12 transition-all duration-700" />
                  <p className="font-sans text-[9px] md:text-[10px] text-[#F2D9C3] tracking-[0.3em] uppercase font-bold">
                    <span className="sr-only">Available styles: </span>
                    {cat.count}
                  </p>
                </div>
                
                <h3 className="font-display text-2xl md:text-3xl text-[#FDF7F2] mb-4 drop-shadow-md">
                  {cat.name}
                </h3>
                
                <span className="inline-flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-[#BE6E5B] border-b border-[#BE6E5B]/0 group-hover:border-[#BE6E5B]/100 pb-1 opacity-0 group-hover:opacity-100 transition-all duration-700 font-bold">
                  View Collection
                  <span aria-hidden="true" className="group-hover:translate-x-2 transition-transform duration-500 text-base leading-none">→</span>
                </span>   
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
}