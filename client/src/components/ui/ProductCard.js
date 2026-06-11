// FILE: client/src/components/ui/ProductCard.js
// PURPOSE: The card shown for each product in the grid

import Link from 'next/link';
import Image from 'next/image';

// ── NEW EARTHY COLOR PALETTE ────────────────────────────────
// Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
// Headings/Active: #7A3D2A (Dark Burnt)
// Default Text: #a07f61 (Warm Brown)
// Accents: #BE6E5B (Terracotta)
// ────────────────────────────────────────────────────────────

export default function ProductCard({ product }) {
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <article className="h-full">
      <Link 
        href={`/products/${product.slug}`} 
        className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE6E5B] focus-visible:ring-offset-2 rounded-md"
        aria-label={`View wholesale details for ${product.name}`}
      >
        <div className="overflow-hidden border border-[#BE6E5B]/20 shadow-sm hover:shadow-[0_15px_40px_rgba(190,110,91,0.15)] transition-all duration-500 hover:-translate-y-1 h-full flex flex-col rounded-md bg-white">

          {/* Image Section */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[#FDF7F2]">
            <Image
              src={product.image || '/images/placeholder.jpg'}
              alt={`Wholesale ${product.name}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Top Left Badges (MOQ & Discount) */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              <span className="bg-[#FDF7F2]/95 backdrop-blur-sm border border-[#7A3D2A]/20 text-[#7A3D2A] text-[9px] md:text-[10px] tracking-widest uppercase px-2.5 py-1 font-sans font-bold shadow-sm rounded-sm">
                <span className="sr-only">Requirement: </span>MOQ: 50
              </span>
              
              {discount && (
                <span className="bg-[#7A3D2A] text-[#FDF7F2] text-[9px] md:text-[10px] tracking-widest uppercase px-2.5 py-1 font-sans font-bold shadow-sm rounded-sm">
                  <span className="sr-only">Discount: </span>{discount}% Off
                </span>
              )}
            </div>

            {/* Top Right Badges (Featured) */}
            {product.isFeatured && (
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-[#BE6E5B] text-[#FDF7F2] text-[8px] md:text-[9px] tracking-widest uppercase px-2 py-0.5 font-sans font-bold shadow-sm rounded-sm">
                  <span className="sr-only">Status: </span>Featured
                </span>
              </div>
            )}

            {/* Hover overlay on image */}
            {/* ✅ A11Y FIX: Swapped dark overlay for light overlay to maintain text contrast */}
            <div aria-hidden="true" className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 z-10">
              <span className="bg-white/95 backdrop-blur-sm text-[#7A3D2A] text-[10px] md:text-xs tracking-[0.25em] uppercase px-6 py-2.5 font-sans font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-md rounded-sm border border-[#7A3D2A]/10">
                View Export Lot
              </span>
            </div>
          </div>

          {/* ── DOWN SIDE DETAILED SECTION ── */}
          <div 
            className="p-4 border-t border-[#BE6E5B]/20 flex flex-col flex-grow"
            style={{ background: 'linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)' }}
          >
            {/* Category & Fabric Row */}
            <div className="flex items-center justify-between mb-2">
              {product.category && (
                <p className="font-sans text-[9px] tracking-[0.25em] text-[#BE6E5B] font-bold uppercase drop-shadow-sm">
                  <span className="sr-only">Category: </span>{product.category}
                </p>
              )}
              {product.fabric && (
                <span className="font-sans text-[8.5px] uppercase tracking-wider font-semibold text-[#a07f61] bg-white/40 px-2 py-0.5 rounded-sm border border-[#BE6E5B]/20">
                  {product.fabric}
                </span>
              )}
            </div>
            
            <h3 className="font-display text-[#7A3D2A] font-bold text-base md:text-lg leading-snug mb-2 line-clamp-1 group-hover:text-[#BE6E5B] transition-colors duration-300">
              {product.name}
            </h3>
            
            <p className="font-sans text-[11px] md:text-xs text-[#a07f61] font-medium line-clamp-2 mb-4 leading-relaxed flex-grow">
              {product.shortDescription || product.description}
            </p>

            <div className="flex flex-col gap-1 mt-auto pt-3 border-t border-[#BE6E5B]/20">
              <p className="font-sans text-[8.5px] uppercase tracking-widest font-bold text-[#a07f61]">Wholesale Price</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-lg md:text-xl font-bold text-[#7A3D2A]">
                    {/* ✅ FIX: Safely parse numbers to prevent UI crash */}
                    <span className="sr-only">Current Price: </span>₹{(product.price || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="font-sans text-[9px] md:text-[10px] text-[#a07f61] font-medium">/ piece</span>
                  
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="font-sans text-[10px] md:text-xs text-[#a07f61]/70 line-through font-medium ml-1">
                      <span className="sr-only">Original Price: </span>₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                
                {/* Inquire Button */}
                <span aria-hidden="true" className="font-sans text-[9px] md:text-[10px] tracking-widest text-[#7A3D2A] font-bold uppercase border border-[#BE6E5B]/60 px-3 py-1.5 rounded-sm group-hover:bg-[#BE6E5B] group-hover:text-[#FDF7F2] group-hover:border-[#BE6E5B] transition-all duration-300">
                  Inquire
                </span>
              </div>
            </div>
            
          </div>
          
        </div>
      </Link>
    </article>
  );
}