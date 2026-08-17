// // FILE: client/src/app/operations-center/page.js
// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import { useProducts } from "@/hooks/useProducts";
// import { useInquiries } from "@/hooks/useInquiries";
// import AdminHeader from "@/components/admin/AdminHeader";
// import DashboardStats from "@/components/admin/DashboardStats";
// import InquiryTable from "@/components/admin/InquiryTable";
// import LookbookManager from "@/components/admin/LookbookManager";
// import Toast from "@/components/ui/Toast";
// import BlogManager from "@/components/admin/BlogManager";
// import OrderManager from "@/components/admin/OrderManager";
// import ProductForm from "@/components/admin/ProductForm";
// import ProductTable from "@/components/admin/ProductTable";

// function OperationsCenterInner() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [activeTab, setActiveTab] = useState("products");
//   const [highlightedInquiryId, setHighlightedInquiryId] = useState(null);
//   const [toast, setToast] = useState({
//     isVisible: false,
//     message: "",
//     type: "success",
//   });
//   const [countdown, setCountdown] = useState(60);

//   const showToast = (message, type = "success") =>
//     setToast({ isVisible: true, message, type });
//   const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

//   const { token, user, logout } = useAuth();

//   useEffect(() => {
//     const tab = searchParams.get("tab");
//     const inquiryId = searchParams.get("id");
//     if (tab) setActiveTab(tab);
//     if (inquiryId) {
//       setHighlightedInquiryId(inquiryId);
//       setTimeout(() => setHighlightedInquiryId(null), 3000);
//     }
//   }, [searchParams]);

//   const {
//     products,
//     productPagination,
//     productPage,
//     setProductPage,
//     productSearch,
//     setProductSearch,
//     productsLoading,
//     productForm,
//     setProductForm,
//     editingProductId,
//     productSaving,
//     productMessage,
//     deletingProductId,
//     seeding,
//     resetProductForm,
//     handleProductSubmit,
//     handleEditProduct,
//     handleDeleteProduct,
//     handleSeedProducts,
//     loadProducts,
//   } = useProducts(token);

//   const {
//     inquiries,
//     inquiryPagination,
//     inquiryPage,
//     setInquiryPage,
//     inquiryFilter,
//     setInquiryFilter,
//     inquiriesLoading,
//     inquiryMessage,
//     handleInquiryStatus,
//     deleteInquiry,
//     markAsViewed,
//     inquiryStats,
//     loadInquiries,
//   } = useInquiries(token);

//   useEffect(() => {
//     if (!token) return;

//     const tickInterval = setInterval(() => {
//       setCountdown((prev) => (prev > 1 ? prev - 1 : 60));
//     }, 1000);

//     const handleGlobalSync = () => {
//       setCountdown(60);
//       if (loadInquiries) {
//         loadInquiries(inquiryPage, inquiryFilter, true);
//       }
//     };

//     window.addEventListener("global_60s_sync", handleGlobalSync);

//     return () => {
//       clearInterval(tickInterval);
//       window.removeEventListener("global_60s_sync", handleGlobalSync);
//     };
//   }, [token, inquiryPage, inquiryFilter, loadInquiries]);

//   useEffect(() => {
//     if (!productMessage) return;
//     const isError =
//       productMessage.toLowerCase().includes("unable") ||
//       productMessage.toLowerCase().includes("error") ||
//       productMessage.toLowerCase().includes("failed");
//     showToast(productMessage, isError ? "error" : "success");
//   }, [productMessage]);

//   useEffect(() => {
//     if (!inquiryMessage) return;
//     const isError =
//       inquiryMessage.toLowerCase().includes("unable") ||
//       inquiryMessage.toLowerCase().includes("error") ||
//       inquiryMessage.toLowerCase().includes("failed");
//     showToast(inquiryMessage, isError ? "error" : "success");
//   }, [inquiryMessage]);

//   const handleLogout = () => {
//     showToast("Logged out successfully.", "success");
//     setTimeout(() => {
//       logout();
//       router.replace("/login");
//     }, 2000);
//   };

//   const tabs = [
//     { id: "products", label: "Products", emoji: "🛍️" },
//     { id: "blogs", label: "Blogs", emoji: "✍️" },
//     { id: "lookbook", label: "Lookbook", emoji: "🖼️" },
//     { id: "inquiries", label: "Inquiries", emoji: "📩" },
//     { id: "orders", label: "Orders", emoji: "📦" },
//   ];

//   return (
//     <>
//       <Toast
//         isVisible={toast.isVisible}
//         message={toast.message}
//         type={toast.type}
//         onClose={hideToast}
//       />

//       <div className="min-h-screen bg-[#f8f4ec] text-brand-african flex flex-col">
//         <AdminHeader
//           admin={user}
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           handleLogout={handleLogout}
//           countdown={countdown}
//         />

//         <div className="flex flex-1">
//           <aside className="w-52 flex-shrink-0 bg-white border-r border-brand-lightgold/40 sticky top-16 self-start min-h-[calc(100vh-64px)]">
//             <nav
//               className="flex flex-col py-6 px-3 gap-1"
//               aria-label="Dashboard sections"
//             >
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-sans text-xs tracking-[0.15em] uppercase transition-all duration-150 ${
//                     activeTab === tab.id
//                       ? "bg-brand-cream text-brand-coffee border-l-2 border-brand-coffee font-semibold"
//                       : "text-brand-mud hover:bg-brand-cream/60 hover:text-brand-coffee"
//                   }`}
//                 >
//                   <span className="text-sm">{tab.emoji}</span>
//                   {tab.label}
//                 </button>
//               ))}
//             </nav>
//           </aside>

//           <main
//             className="flex-1 px-6 py-8 space-y-8 overflow-auto"
//             id="main-content"
//           >
//             <DashboardStats
//               productsTotal={productPagination.total || products.length}
//               featuredTotal={products.filter((p) => p.isFeatured).length}
//               openInquiriesTotal={inquiryStats?.pending || 0}
//               resolvedInquiriesTotal={inquiryStats?.resolved || 0}
//               countdown={countdown}
//             />

//             {activeTab === "products" && (
//               <section aria-label="Product Management" className="space-y-8">
//                 <ProductForm
//                   productForm={productForm}
//                   setProductForm={setProductForm}
//                   handleProductSubmit={handleProductSubmit}
//                   productSaving={productSaving}
//                   productMessage={productMessage}
//                   editingProductId={editingProductId}
//                   resetProductForm={resetProductForm}
//                   handleSeedProducts={handleSeedProducts}
//                   seeding={seeding}
//                 />
//                 <ProductTable
//                   products={products}
//                   productsLoading={productsLoading}
//                   productPagination={productPagination}
//                   productPage={productPage}
//                   setProductPage={setProductPage}
//                   productSearch={productSearch}
//                   setProductSearch={setProductSearch}
//                   handleEditProduct={(p) => handleEditProduct(p, setActiveTab)}
//                   handleDeleteProduct={handleDeleteProduct}
//                   deletingProductId={deletingProductId}
//                   loadProducts={loadProducts}
//                   token={token}
//                 />
//               </section>
//             )}

//             {activeTab === "blogs" && (
//               <section aria-label="Blog Management">
//                 <BlogManager token={token} showToast={showToast} />
//               </section>
//             )}

//             {activeTab === "lookbook" && (
//               <section aria-label="Lookbook Management">
//                 <LookbookManager token={token} showToast={showToast} />
//               </section>
//             )}

//             {activeTab === "inquiries" && (
//               <section aria-label="Inquiries Management">
//                 <InquiryTable
//                   inquiries={inquiries}
//                   inquiriesLoading={inquiriesLoading}
//                   inquiryPagination={inquiryPagination}
//                   inquiryPage={inquiryPage}
//                   setInquiryPage={setInquiryPage}
//                   inquiryFilter={inquiryFilter}
//                   setInquiryFilter={setInquiryFilter}
//                   inquiryMessage={inquiryMessage}
//                   handleInquiryStatus={handleInquiryStatus}
//                   deleteInquiry={deleteInquiry}
//                   markAsViewed={markAsViewed}
//                   highlightedInquiryId={highlightedInquiryId}
//                 />
//               </section>
//             )}

//             {activeTab === "orders" && (
//               <section aria-label="Order Management">
//                 <OrderManager token={token} showToast={showToast} />
//               </section>
//             )}
//           </main>
//         </div>
//       </div>
//     </>
//   );
// }

// export default function OperationsCenter() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
//           <p className="font-sans text-sm tracking-[0.3em] uppercase text-brand-coffee/60">
//             Loading...
//           </p>
//         </div>
//       }
//     >
//       <OperationsCenterInner />
//     </Suspense>
//   );
// }

// FILE: client/src/app/operations-center/page.js
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useInquiries } from "@/hooks/useInquiries";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardStats from "@/components/admin/DashboardStats";
import InquiryTable from "@/components/admin/InquiryTable";
import LookbookManager from "@/components/admin/LookbookManager";
import Toast from "@/components/ui/Toast";
import BlogManager from "@/components/admin/BlogManager";
import OrderManager from "@/components/admin/OrderManager";
import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";

function OperationsCenterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("products");
  const [highlightedInquiryId, setHighlightedInquiryId] = useState(null);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [countdown, setCountdown] = useState(60);

  // Sidebar toggle states for Mobile AND Desktop
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
  const [desktopSidebar, setDesktopSidebar] = useState(true); // Desktop

  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  const { token, user, logout } = useAuth();

  useEffect(() => {
    const tab = searchParams.get("tab");
    const inquiryId = searchParams.get("id");
    if (tab) setActiveTab(tab);
    if (inquiryId) {
      setHighlightedInquiryId(inquiryId);
      setTimeout(() => setHighlightedInquiryId(null), 3000);
    }
  }, [searchParams]);

  const {
    products,
    productPagination,
    productPage,
    setProductPage,
    productSearch,
    setProductSearch,
    productsLoading,
    productForm,
    setProductForm,
    editingProductId,
    productSaving,
    productMessage,
    deletingProductId,
    seeding,
    resetProductForm,
    handleProductSubmit,
    handleEditProduct,
    handleDeleteProduct,
    handleSeedProducts,
    loadProducts,
  } = useProducts(token);

  const {
    inquiries,
    inquiryPagination,
    inquiryPage,
    setInquiryPage,
    inquiryFilter,
    setInquiryFilter,
    inquiriesLoading,
    inquiryMessage,
    handleInquiryStatus,
    deleteInquiry,
    markAsViewed,
    inquiryStats,
    loadInquiries,
  } = useInquiries(token);

  useEffect(() => {
    if (!token) return;

    const tickInterval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);

    const handleGlobalSync = () => {
      setCountdown(60);
      if (loadInquiries) {
        loadInquiries(inquiryPage, inquiryFilter, true);
      }
    };

    window.addEventListener("global_60s_sync", handleGlobalSync);

    return () => {
      clearInterval(tickInterval);
      window.removeEventListener("global_60s_sync", handleGlobalSync);
    };
  }, [token, inquiryPage, inquiryFilter, loadInquiries]);

  useEffect(() => {
    if (!productMessage) return;
    const isError =
      productMessage.toLowerCase().includes("unable") ||
      productMessage.toLowerCase().includes("error") ||
      productMessage.toLowerCase().includes("failed");
    showToast(productMessage, isError ? "error" : "success");
  }, [productMessage]);

  useEffect(() => {
    if (!inquiryMessage) return;
    const isError =
      inquiryMessage.toLowerCase().includes("unable") ||
      inquiryMessage.toLowerCase().includes("error") ||
      inquiryMessage.toLowerCase().includes("failed");
    showToast(inquiryMessage, isError ? "error" : "success");
  }, [inquiryMessage]);

  const handleLogout = () => {
    showToast("Logged out successfully.", "success");
    setTimeout(() => {
      logout();
      router.replace("/login");
    }, 2000);
  };

  const tabs = [
    {
      id: "products",
      label: "Products",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
      id: "blogs",
      label: "Blogs",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    },
    {
      id: "lookbook",
      label: "Lookbook",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      id: "inquiries",
      label: "Inquiries",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    },
  ];

  const activeTabMeta = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="flex min-h-screen bg-[#FAF3E8] font-sans">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-[#3E1E13]/50 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* ── LEFT SIDEBAR ── */}
      <aside
        className={`
          bg-[#EBDCCB] border-r border-[#BE6E5B]/20 text-[#5C3120] flex flex-col transform transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none z-40
          fixed inset-y-0 left-0
          /* 👇 GAP ADJUST KAREIN: 80px ko 72px ya 64px karein agar gap kam karna ho 👇 */
          lg:sticky lg:self-start lg:top-[80px] lg:h-[calc(100vh-80px)]
          ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:translate-x-0"}
          ${desktopSidebar ? "lg:w-64" : "lg:w-0 lg:overflow-hidden lg:opacity-0 lg:border-none"}
        `}
      >
        <div className="w-64 flex flex-col h-full overflow-hidden">
          <div className="shrink-0 flex items-center justify-between p-6 border-b border-[#BE6E5B]/15">
            <h1 className="text-xl font-display font-bold tracking-widest text-[#7A3D2A]">
              SANWARIYAS
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#7A3D2A]/70 hover:text-[#7A3D2A]"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="shrink-0 px-6 py-6 border-b border-[#BE6E5B]/15">
            <p className="text-[15px] font-bold tracking-wide text-[#7A3D2A]">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-[#BE6E5B] mt-1 font-bold tracking-wider uppercase">
              Role: {user?.role || "admin"}
            </p>
          </div>

          <nav
            className="flex-1 min-h-0 overflow-y-auto space-y-1 py-4"
            aria-label="Dashboard sections"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full text-left px-6 py-3.5 text-sm font-bold transition-all duration-200 border-l-4 ${
                    isActive
                      ? "bg-[#FDF7F2] border-[#BE6E5B] text-[#7A3D2A] shadow-sm"
                      : "border-transparent text-[#7A3D2A]/80 hover:bg-[#FDF7F2]/50 hover:text-[#7A3D2A]"
                  }`}
                >
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={tab.icon}
                    />
                  </svg>
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="shrink-0 p-6 pb-8 border-t border-[#BE6E5B]/10">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-2.5 text-sm font-bold text-[#7A3D2A] border border-[#7A3D2A]/30 rounded-lg hover:bg-[#7A3D2A] hover:text-[#FDF7F2] transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── RIGHT MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FAF3E8]">
        {/* Top Header Bar */}
        <header
          className="bg-white border-b border-[#BE6E5B]/15 flex items-center justify-between px-4 sm:px-8 py-4 shrink-0 shadow-sm z-30 sticky top-0 
          /* 👇 GAP ADJUST KAREIN: Same number yahan bhi daalna jo upar sidebar mein daala 👇 */
          lg:top-[80px]"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#7A3D2A] hover:bg-[#BE6E5B]/10 p-1.5 rounded-lg focus:outline-none transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <button
              onClick={() => setDesktopSidebar(!desktopSidebar)}
              className="hidden lg:block text-[#7A3D2A] hover:bg-[#BE6E5B]/10 p-1.5 rounded-lg focus:outline-none transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-[#BE6E5B] hidden sm:block tracking-widest uppercase">
              Live Sync: {countdown}s
            </span>
            <button className="text-[#7A3D2A] hover:text-[#BE6E5B] transition-colors relative">
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BE6E5B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#BE6E5B]"></span>
              </span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className="hidden">
          <AdminHeader
            admin={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
            countdown={countdown}
          />
        </div>

        <main className="flex-1 p-4 sm:p-8" id="main-content">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-3xl font-display font-bold text-[#5C3120] tracking-wide">
              {activeTabMeta.label} Dashboard
            </h2>
          </div>

          <DashboardStats
            productsTotal={productPagination.total || products.length}
            featuredTotal={products.filter((p) => p.isFeatured).length}
            openInquiriesTotal={inquiryStats?.pending || 0}
            resolvedInquiriesTotal={inquiryStats?.resolved || 0}
            countdown={countdown}
          />

          <div className="mt-8 bg-white/80 backdrop-blur-md border border-[#BE6E5B]/20 rounded-2xl shadow-[0_8px_30px_rgba(122,61,42,0.04)] p-4 sm:p-6">
            {activeTab === "products" && (
              <section aria-label="Product Management" className="space-y-8">
                <ProductForm
                  productForm={productForm}
                  setProductForm={setProductForm}
                  handleProductSubmit={handleProductSubmit}
                  productSaving={productSaving}
                  productMessage={productMessage}
                  editingProductId={editingProductId}
                  resetProductForm={resetProductForm}
                  handleSeedProducts={handleSeedProducts}
                  seeding={seeding}
                />
                <ProductTable
                  products={products}
                  productsLoading={productsLoading}
                  productPagination={productPagination}
                  productPage={productPage}
                  setProductPage={setProductPage}
                  productSearch={productSearch}
                  setProductSearch={setProductSearch}
                  handleEditProduct={(p) => handleEditProduct(p, setActiveTab)}
                  handleDeleteProduct={handleDeleteProduct}
                  deletingProductId={deletingProductId}
                  loadProducts={loadProducts}
                  token={token}
                />
              </section>
            )}

            {activeTab === "blogs" && (
              <section aria-label="Blog Management">
                <BlogManager token={token} showToast={showToast} />
              </section>
            )}

            {activeTab === "lookbook" && (
              <section aria-label="Lookbook Management">
                <LookbookManager token={token} showToast={showToast} />
              </section>
            )}

            {activeTab === "inquiries" && (
              <section aria-label="Inquiries Management">
                <InquiryTable
                  inquiries={inquiries}
                  inquiriesLoading={inquiriesLoading}
                  inquiryPagination={inquiryPagination}
                  inquiryPage={inquiryPage}
                  setInquiryPage={setInquiryPage}
                  inquiryFilter={inquiryFilter}
                  setInquiryFilter={setInquiryFilter}
                  inquiryMessage={inquiryMessage}
                  handleInquiryStatus={handleInquiryStatus}
                  deleteInquiry={deleteInquiry}
                  markAsViewed={markAsViewed}
                  highlightedInquiryId={highlightedInquiryId}
                />
              </section>
            )}

            {activeTab === "orders" && (
              <section aria-label="Order Management">
                <OrderManager token={token} showToast={showToast} />
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function OperationsCenter() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF3E8]">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-[#7A3D2A] font-bold animate-pulse">
            Loading Operations...
          </p>
        </div>
      }
    >
      <OperationsCenterInner />
    </Suspense>
  );
}
