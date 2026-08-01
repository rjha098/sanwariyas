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
    { id: "products", label: "Products", emoji: "🛍️" },
    { id: "blogs", label: "Blogs", emoji: "✍️" },
    { id: "lookbook", label: "Lookbook", emoji: "🖼️" },
    { id: "inquiries", label: "Inquiries", emoji: "📩" },
    { id: "orders", label: "Orders", emoji: "📦" },
  ];

  return (
    <>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <div className="min-h-screen bg-[#f8f4ec] text-brand-african flex flex-col">
        <AdminHeader
          admin={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
          countdown={countdown}
        />

        <div className="flex flex-1">
          <aside className="w-52 flex-shrink-0 bg-white border-r border-brand-lightgold/40 sticky top-16 self-start min-h-[calc(100vh-64px)]">
            <nav
              className="flex flex-col py-6 px-3 gap-1"
              aria-label="Dashboard sections"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-sans text-xs tracking-[0.15em] uppercase transition-all duration-150 ${
                    activeTab === tab.id
                      ? "bg-brand-cream text-brand-coffee border-l-2 border-brand-coffee font-semibold"
                      : "text-brand-mud hover:bg-brand-cream/60 hover:text-brand-coffee"
                  }`}
                >
                  <span className="text-sm">{tab.emoji}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          <main
            className="flex-1 px-6 py-8 space-y-8 overflow-auto"
            id="main-content"
          >
            <DashboardStats
              productsTotal={productPagination.total || products.length}
              featuredTotal={products.filter((p) => p.isFeatured).length}
              openInquiriesTotal={inquiryStats?.pending || 0}
              resolvedInquiriesTotal={inquiryStats?.resolved || 0}
              countdown={countdown}
            />

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
          </main>
        </div>
      </div>
    </>
  );
}

export default function OperationsCenter() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-brand-coffee/60">
            Loading...
          </p>
        </div>
      }
    >
      <OperationsCenterInner />
    </Suspense>
  );
}
