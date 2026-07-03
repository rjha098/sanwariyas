// FILE: client/src/app/blog/[slug]/loading.js

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF3E8] flex items-center justify-center">
      <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#70543E]/50 animate-pulse">
        Loading Story...
      </p>
    </div>
  );
}