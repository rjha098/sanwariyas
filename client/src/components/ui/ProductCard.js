// // PURPOSE: The card shown for each product in the grid

// import Link from 'next/link';
// import Image from 'next/image';

// // ── NEW EARTHY COLOR PALETTE ────────────────────────────────
// // Background: #FDF7F2 (Light Cream) to #F2D9C3 (Pumpkin Essence)
// // Headings/Active: #7A3D2A (Dark Burnt)
// // Default Text: #a07f61 (Warm Brown)
// // Accents: #BE6E5B (Terracotta)
// // ────────────────────────────────────────────────────────────

// export default function ProductCard({ product }) {
//   const discount = product.originalPrice
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : null;

//   return (
//     <Link href={`/products/${product.slug}`} className="group block h-full">
//       <div className="overflow-hidden border border-[#BE6E5B]/20 shadow-sm hover:shadow-[0_15px_40px_rgba(190,110,91,0.15)] transition-all duration-500 hover:-translate-y-1 h-full flex flex-col rounded-md">

//         {/* Image Section */}
//         <div className="relative aspect-[3/4] overflow-hidden bg-white">
//           <Image
//             src={product.image}
//             alt={product.name}
//             fill
//             sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//             className="object-cover transition-transform duration-700 group-hover:scale-105"
//           />

//           {/* Badges */}
//           <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
//             {product.isFeatured && (
//               <span className="bg-[#BE6E5B] text-[#FDF7F2] text-[9px] md:text-[10px] tracking-widest uppercase px-2.5 py-1 font-sans font-bold shadow-sm">
//                 Featured
//               </span>
//             )}
//             {discount && (
//               <span className="bg-[#7A3D2A] text-[#FDF7F2] text-[9px] md:text-[10px] tracking-widest uppercase px-2.5 py-1 font-sans font-bold shadow-sm">
//                 {discount}% Off
//               </span>
//             )}
//           </div>

//           {/* Hover overlay on image */}
//           <div className="absolute inset-0 bg-[#7A3D2A]/0 group-hover:bg-[#7A3D2A]/10 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 z-10">
//             <span className="bg-white/90 backdrop-blur-sm text-[#7A3D2A] text-[10px] md:text-xs tracking-[0.25em] uppercase px-6 py-2.5 font-sans font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-md">
//               View Details
//             </span>
//           </div>
//         </div>

//         {/* ── DOWN SIDE DETAILED SECTION ── */}
//         {/* Background matches the global light earthy theme */}
//         <div 
//           className="p-4 border-t border-[#BE6E5B]/20 flex flex-col flex-grow"
//           style={{ background: 'linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)' }}
//         >
//           {product.category && (
//             <p className="font-sans text-[9px] tracking-[0.25em] text-[#BE6E5B] font-bold uppercase mb-1.5 drop-shadow-sm">
//               {product.category}
//             </p>
//           )}
          
//           <h3 className="font-display text-[#7A3D2A] font-bold text-base md:text-lg leading-snug mb-2 line-clamp-1 group-hover:text-[#BE6E5B] transition-colors duration-300">
//             {product.name}
//           </h3>
          
//           <p className="font-sans text-[11px] md:text-xs text-[#a07f61] font-medium line-clamp-2 mb-4 leading-relaxed flex-grow">
//             {product.shortDescription || product.description}
//           </p>

//           <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#BE6E5B]/20">
//             <div className="flex items-baseline gap-2">
//               <span className="font-display text-lg md:text-xl font-bold text-[#7A3D2A]">
//                 ₹{product.price.toLocaleString('en-IN')}
//               </span>
//               {product.originalPrice && (
//                 <span className="font-sans text-[10px] md:text-xs text-[#a07f61]/70 line-through font-medium">
//                   ₹{product.originalPrice.toLocaleString('en-IN')}
//                 </span>
//               )}
//             </div>
            
//             {/* Inquire Button */}
//             <span className="font-sans text-[9px] md:text-[10px] tracking-widest text-[#7A3D2A] font-bold uppercase border border-[#BE6E5B]/60 px-3 py-1.5 rounded-sm hover:bg-[#BE6E5B] hover:text-[#FDF7F2] hover:border-[#BE6E5B] transition-all duration-300">
//               Inquire
//             </span>
//           </div>
//         </div>
        
//       </div>
//     </Link>
//   );
// }



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
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    // ✅ A11Y & SEO: Wrapped the card in a semantic <article> tag
    <article className="h-full">
      <Link 
        href={`/products/${product.slug}`} 
        className="group block h-full focus:outline-none focus:ring-2 focus:ring-[#BE6E5B] rounded-md"
        aria-label={`View details for ${product.name}`}
      >
        <div className="overflow-hidden border border-[#BE6E5B]/20 shadow-sm hover:shadow-[0_15px_40px_rgba(190,110,91,0.15)] transition-all duration-500 hover:-translate-y-1 h-full flex flex-col rounded-md">

          {/* Image Section */}
          <div className="relative aspect-[3/4] overflow-hidden bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isFeatured && (
                <span className="bg-[#BE6E5B] text-[#FDF7F2] text-[9px] md:text-[10px] tracking-widest uppercase px-2.5 py-1 font-sans font-bold shadow-sm">
                  <span className="sr-only">Status: </span>Featured
                </span>
              )}
              {discount && (
                <span className="bg-[#7A3D2A] text-[#FDF7F2] text-[9px] md:text-[10px] tracking-widest uppercase px-2.5 py-1 font-sans font-bold shadow-sm">
                  <span className="sr-only">Discount: </span>{discount}% Off
                </span>
              )}
            </div>

            {/* Hover overlay on image */}
            {/* ✅ A11Y: Hidden from screen readers to prevent repetitive link text */}
            <div aria-hidden="true" className="absolute inset-0 bg-[#7A3D2A]/0 group-hover:bg-[#7A3D2A]/10 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 z-10">
              <span className="bg-white/90 backdrop-blur-sm text-[#7A3D2A] text-[10px] md:text-xs tracking-[0.25em] uppercase px-6 py-2.5 font-sans font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-md">
                View Details
              </span>
            </div>
          </div>

          {/* ── DOWN SIDE DETAILED SECTION ── */}
          {/* Background matches the global light earthy theme */}
          <div 
            className="p-4 border-t border-[#BE6E5B]/20 flex flex-col flex-grow"
            style={{ background: 'linear-gradient(135deg, #FDF7F2 0%, #F2D9C3 100%)' }}
          >
            {product.category && (
              <p className="font-sans text-[9px] tracking-[0.25em] text-[#BE6E5B] font-bold uppercase mb-1.5 drop-shadow-sm">
                <span className="sr-only">Category: </span>{product.category}
              </p>
            )}
            
            <h3 className="font-display text-[#7A3D2A] font-bold text-base md:text-lg leading-snug mb-2 line-clamp-1 group-hover:text-[#BE6E5B] transition-colors duration-300">
              {product.name}
            </h3>
            
            <p className="font-sans text-[11px] md:text-xs text-[#a07f61] font-medium line-clamp-2 mb-4 leading-relaxed flex-grow">
              {product.shortDescription || product.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#BE6E5B]/20">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg md:text-xl font-bold text-[#7A3D2A]">
                  {/* ✅ A11Y: Added clear labels for the pricing */}
                  <span className="sr-only">Current Price: </span>₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="font-sans text-[10px] md:text-xs text-[#a07f61]/70 line-through font-medium">
                    <span className="sr-only">Original Price: </span>₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              
              {/* Inquire Button */}
              {/* ✅ A11Y: Hidden from screen readers. Since the whole card is a link, this button is purely visual and would cause screen reader spam if read aloud. */}
              <span aria-hidden="true" className="font-sans text-[9px] md:text-[10px] tracking-widest text-[#7A3D2A] font-bold uppercase border border-[#BE6E5B]/60 px-3 py-1.5 rounded-sm hover:bg-[#BE6E5B] hover:text-[#FDF7F2] hover:border-[#BE6E5B] transition-all duration-300">
                Inquire
              </span>
            </div>
          </div>
          
        </div>
      </Link>
    </article>
  );
}
