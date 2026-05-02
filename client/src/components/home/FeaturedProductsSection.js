import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';

export default function FeaturedProductsSection({ products }) {
  if (!products || products.length === 0) return null;

  // ── NEW EARTHY COLOR PALETTE ────────────────────────────────
  // Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
  // Headings/Active: #7A3D2A (Dark Burnt)
  // Default Text: #a07f61 (Warm Brown)
  // Accents & Borders: #BE6E5B (Terracotta)
  // ────────────────────────────────────────────────────────────
  
  return (
    // ✅ A11Y & SEO: Added aria-labelledby to identify the section's purpose
    <section 
      aria-labelledby="featured-heading"
      className="py-20 md:py-24 relative overflow-hidden shadow-inner"
      // Light Premium Gradient matching your global theme
      style={{ background: 'linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)' }}
    >
      
      {/* Decorative Side Lines */}
      {/* ✅ A11Y: Hidden decorative side lines from screen readers */}
      <div aria-hidden="true" className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/20 to-transparent hidden sm:block" />
      <div aria-hidden="true" className="absolute right-4 md:right-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#BE6E5B]/20 to-transparent hidden sm:block" />

      {/* Subtle earthy diagonal background pattern for texture */}
      {/* ✅ A11Y: Hidden decorative background */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #BE6E5B 0, #BE6E5B 1px, transparent 0, transparent 40px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* ── Header ── */}
        <div className="text-center mb-12 md:mb-16">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.7em] uppercase text-[#BE6E5B] font-bold mb-3 md:mb-4">
            Hand-Picked
          </p>
          <h2 id="featured-heading" className="font-display text-4xl md:text-5xl lg:text-6xl text-[#7A3D2A] leading-tight drop-shadow-sm font-bold">
            Featured Pieces
          </h2>
          
          {/* ✅ A11Y: Hidden purely visual star and separators */}
          <div aria-hidden="true" className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
            <div className="h-[2px] w-12 md:w-20 bg-gradient-to-r from-transparent to-[#BE6E5B]" />
            <span className="text-[#BE6E5B] text-sm md:text-lg animate-pulse">✦</span>
            <div className="h-[2px] w-12 md:w-20 bg-gradient-to-l from-transparent to-[#BE6E5B]" />
          </div>
          
          <p className="font-serif italic text-[#a07f61] mt-6 md:mt-8 text-sm md:text-lg max-w-2xl mx-auto px-4 font-medium">
            Curated selections from our finest collection, representing the pinnacle of our artisanship.
          </p>
        </div>

        {/* ── Product Grid ── */}
        {/* ✅ A11Y & SEO: Converted div grid into a semantic ul/li list */}
        <ul aria-label="Featured Products List" className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 list-none p-0 m-0">
          {products.map((product) => (
            <li 
              key={product._id} 
              className="group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(122,61,42,0.15)] rounded-lg overflow-hidden bg-white/60 backdrop-blur-sm border border-[#BE6E5B]/20"
            >
              <ProductCard product={product} />
            </li>
          ))}
        </ul>

        {/* ── CTA Button ── */}
        <div className="text-center mt-16 md:mt-20">
          <Link
            href="/products"
            aria-label="View all product collections"
            className="group relative inline-flex items-center gap-3 border border-[#7A3D2A] text-[#7A3D2A] font-sans text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase font-bold px-8 py-3 md:px-10 md:py-4 hover:text-[#FDF7F2] transition-colors duration-500 hover:shadow-[0_10px_30px_rgba(190,110,91,0.2)] overflow-hidden rounded-md"
          >
            {/* Sliding background effect */}
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#7A3D2A] to-[#BE6E5B] -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10" />
            
            <span className="relative z-10">View All Collections</span>
            
            {/* ✅ A11Y: Hidden decorative arrow */}
            <span aria-hidden="true" className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300 text-sm md:text-lg leading-none">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}