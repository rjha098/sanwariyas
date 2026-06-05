// export default function AdminHeader({
//   admin,
//   activeTab,
//   setActiveTab,
//   handleLogout,
// }) {
//   return (
//     <header className="bg-brand-african text-brand-cream px-6 py-5 border-b border-brand-gold/20">
//       <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <p
//             className="font-sans text-[11px] tracking-[0.4em] uppercase text-brand-gold mb-2"
//             aria-hidden="true"
//           >
//             Sanwariyas
//           </p>
//           <h1 className="font-display text-3xl">Admin Panel</h1>
//           <p className="font-sans text-sm text-brand-cream/70 mt-1">
//             Signed in as {admin?.username || "admin"}
//           </p>
//         </div>

//         <nav aria-label="Admin Navigation" className="flex flex-wrap gap-3">
//           <button
//             onClick={() => setActiveTab("products")}
//             aria-current={activeTab === "products" ? "page" : undefined}
//             className={`px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border transition-colors ${
//               activeTab === "products"
//                 ? "bg-brand-gold text-brand-african border-brand-gold"
//                 : "border-brand-cream/30 text-brand-cream"
//             }`}
//           >
//             Products
//           </button>
//           <button
//             onClick={() => setActiveTab("inquiries")}
//             aria-current={activeTab === "inquiries" ? "page" : undefined}
//             className={`px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border transition-colors ${
//               activeTab === "inquiries"
//                 ? "bg-brand-gold text-brand-african border-brand-gold"
//                 : "border-brand-cream/30 text-brand-cream"
//             }`}
//           >
//             Inquiries
//           </button>

//           <button
//             onClick={() => setActiveTab("lookbook")}
//             className={`px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border transition-colors ${
//               activeTab === "lookbook"
//                 ? "bg-brand-gold text-brand-african border-brand-gold"
//                 : "border-brand-cream/30 text-brand-cream"
//             }`}
//           >
//             Gallery
//           </button>

//           <a
//             href="/"
//             className="px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border border-brand-cream/30 text-brand-cream"
//             aria-label="View main website"
//           >
//             View Site
//           </a>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border border-brand-cream/30 text-brand-cream"
//             aria-label="Logout of admin panel"
//           >
//             Logout
//           </button>
//         </nav>
//       </div>
//     </header>
//   );
// }



import Link from 'next/link';

export default function AdminHeader({
  admin,
  activeTab,
  setActiveTab,
  handleLogout,
}) {
  return (
    <header className="bg-brand-african text-brand-cream px-6 py-5 border-b border-brand-gold/20">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p
            className="font-sans text-[11px] tracking-[0.4em] uppercase text-brand-gold mb-2"
            aria-hidden="true"
          >
            Sanwariyas
          </p>
          <h1 className="font-display text-3xl">Admin Panel</h1>
          <p className="font-sans text-sm text-brand-cream/70 mt-1">
            Signed in as {admin?.username || "admin"}
          </p>
        </div>

        <nav aria-label="Admin Navigation" className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab("products")}
            aria-current={activeTab === "products" ? "page" : undefined}
            className={`px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border transition-all duration-300 ${
              activeTab === "products"
                ? "bg-brand-gold text-brand-african border-brand-gold shadow-md"
                : "border-brand-cream/30 text-brand-cream hover:border-brand-gold hover:text-brand-gold"
            }`}
          >
            Products
          </button>
          
          <button
            onClick={() => setActiveTab("inquiries")}
            aria-current={activeTab === "inquiries" ? "page" : undefined}
            className={`px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border transition-all duration-300 ${
              activeTab === "inquiries"
                ? "bg-brand-gold text-brand-african border-brand-gold shadow-md"
                : "border-brand-cream/30 text-brand-cream hover:border-brand-gold hover:text-brand-gold"
            }`}
          >
            Inquiries
          </button>

          <button
            onClick={() => setActiveTab("lookbook")}
            // ✅ A11Y FIX: Added missing aria-current for screen readers
            aria-current={activeTab === "lookbook" ? "page" : undefined}
            className={`px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border transition-all duration-300 ${
              activeTab === "lookbook"
                ? "bg-brand-gold text-brand-african border-brand-gold shadow-md"
                : "border-brand-cream/30 text-brand-cream hover:border-brand-gold hover:text-brand-gold"
            }`}
          >
            Gallery
          </button>

          {/* ✅ PERFORMANCE FIX: Replaced <a> with Next.js <Link> */}
          <Link
            href="/"
            className="px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border border-brand-cream/30 text-brand-cream transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
            aria-label="View main website"
          >
            View Site
          </Link>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border border-brand-cream/30 text-brand-cream transition-all duration-300 hover:border-red-400 hover:text-red-400"
            aria-label="Logout of admin panel"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}