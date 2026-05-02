// export function ProductCardSkeleton() {
//   return (
//     <div className="bg-white overflow-hidden shadow-sm">
//       <div className="aspect-[3/4] skeleton" />
//       <div className="p-4 space-y-3">
//         <div className="h-3 w-16 skeleton rounded" />
//         <div className="h-5 w-3/4 skeleton rounded" />
//         <div className="h-3 w-full skeleton rounded" />
//         <div className="h-3 w-2/3 skeleton rounded" />
//         <div className="flex justify-between items-center pt-2">
//           <div className="h-6 w-20 skeleton rounded" />
//           <div className="h-7 w-16 skeleton rounded" />
//         </div>
//       </div>
//     </div>
//   );
// }

// export function ProductGridSkeleton({ count = 8 }) {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//       {Array.from({ length: count }).map((_, i) => (
//         <ProductCardSkeleton key={i} />
//       ))}
//     </div>
//   );
// }


export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="bg-white overflow-hidden shadow-sm">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-3 w-full skeleton rounded" />
        <div className="h-3 w-2/3 skeleton rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 skeleton rounded" />
          <div className="h-7 w-16 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key="{i}"/>
      ))}
    </div>
  );
}