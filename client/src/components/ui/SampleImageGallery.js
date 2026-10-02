// FILE: client/src/components/ui/SampleImageGallery.js
"use client";

import { getImageUrl } from "@/lib/imageUrl";

// Shows the sample images a customer attached to an inquiry.
//  • default : bigger thumbnails; click opens the full image in a new tab
//  • compact : small non-clickable thumbnails, for list rows/cards that are
//              themselves clickable (so we never nest a link inside a card)
// Renders nothing for old inquiries that have no images.
// size: "md" (default, big thumbnails) | "sm" (small thumbnails, e.g. inside chat bubbles)
const SIZE_CLASSES = {
  sm: "w-16 h-16",
  md: "w-32 h-32 sm:w-40 sm:h-40",
};

export default function SampleImageGallery({
  images,
  compact = false,
  size = "md",
  className = "",
}) {
  if (!Array.isArray(images) || images.length === 0) return null;

  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 mt-2 ${className}`}>
        {images.map((path, index) => (
          // eslint-disable-next-line @next/next/no-img-element -- backend-hosted upload
          <img
            key={path}
            src={getImageUrl(path)}
            alt={`Sample image ${index + 1}`}
            loading="lazy"
            className="w-10 h-10 object-cover border border-[#E8D5A3] bg-gray-50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {images.map((path, index) => (
        <a
          key={path}
          href={getImageUrl(path)}
          target="_blank"
          rel="noopener noreferrer"
          title="Open full size in a new tab"
          className={`block ${SIZE_CLASSES[size] || SIZE_CLASSES.md} border border-[#E8D5A3] bg-gray-50 overflow-hidden hover:border-[#7A3D2A] transition-colors`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- backend-hosted upload */}
          <img
            src={getImageUrl(path)}
            alt={`Sample image ${index + 1}`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </a>
      ))}
    </div>
  );
}
