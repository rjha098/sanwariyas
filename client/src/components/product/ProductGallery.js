"use client";

import { useState } from "react";
import { getImageUrl } from "@/lib/imageUrl";

export default function ProductGallery({ product }) {
  // 1. remove  the dublicate 
  const galleryImages = (product.images || []).filter(
    (img) => img !== product.image,
  );

  // 2. Main + Gallery mixed  strict limit set  to  5

  const displayImages = [product.image, ...galleryImages]
    .filter(Boolean)
    .slice(0, 5);

  // 3. State for Click-to-Change functionality
  const [activeImage, setActiveImage] = useState(displayImages[0]);

  return (
    <div className="lg:sticky lg:top-24 space-y-3 max-w-[420px] mx-auto w-full">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white shadow-md border border-[#C9A84C]/20 rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(activeImage)}
          alt={`${product.name} view`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        />
        {product.isFeatured && (
          <div className="absolute top-4 left-4 bg-[#C9A84C] text-[#574325] text-[10px] tracking-widest uppercase px-3 py-1.5 font-sans font-bold shadow-sm rounded-md">
            Featured
          </div>
        )}
      </div>

      {/* small  image  for  the  thumbnail */}
      {displayImages.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImage(img)}
              aria-label={`View image ${i + 1}`}
              className={`relative w-[18%] aspect-[3/4] overflow-hidden bg-white cursor-pointer border rounded-md transition-all duration-300 ${
                activeImage === img
                  ? "border-[#7A3D2A] ring-2 ring-[#7A3D2A]/30 scale-[1.02] shadow-sm"
                  : "border-[#C9A84C]/40 hover:border-[#7A3D2A]/60 opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
