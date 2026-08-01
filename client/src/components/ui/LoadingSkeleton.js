// FILE: client/src/components/ui/Skeletons.js

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="bg-white overflow-hidden shadow-sm rounded-2xl border border-[#BE6E5B]/10">
      <div className="aspect-[3/4] skeleton bg-gray-200/60 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton bg-gray-200/80 animate-pulse rounded" />
        <div className="h-5 w-3/4 skeleton bg-gray-200/80 animate-pulse rounded" />
        <div className="h-3 w-full skeleton bg-gray-200/80 animate-pulse rounded" />
        <div className="h-3 w-2/3 skeleton bg-gray-200/80 animate-pulse rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 skeleton bg-gray-200/80 animate-pulse rounded" />
          <div className="h-7 w-16 skeleton bg-gray-200/80 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div 
      role="status" 
      aria-live="polite" 
    
      aria-busy="true"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
    >
      {/*  SEO FIX: Enriched screen reader announcement with B2B wholesale entity keywords */}
      <span className="sr-only">Loading wholesale ethnic wear collections, please wait.</span>
      
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}