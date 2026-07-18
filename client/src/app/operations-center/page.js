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

function OperationsCenterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("blogs");
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

  const { token, user, authChecking, isAuthenticated, isAdmin, logout } =
    useAuth();

  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authChecking, isAuthenticated, router]);

  // ✅ KEY FIX: notification click se aaya URL params read karo
  useEffect(() => {
    const tab = searchParams.get("tab");
    const inquiryId = searchParams.get("id");

    if (tab === "inquiries") {
      setActiveTab("inquiries");
    }
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


  // useEffect(() => {
  //   if (!token || activeTab !== "inquiries") return;

  //   const tickInterval = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev <= 1) {
  //         if (loadInquiries) {
  //           loadInquiries(inquiryPage, inquiryFilter, false);
  //         }
  //         return 60;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(tickInterval);
  // }, [token, activeTab, inquiryPage, inquiryFilter, loadInquiries]);


  
  // useEffect(() => {
  //   if (!token || activeTab !== "inquiries") return;

  //   const handleGlobalSync = () => {
  //     if (loadInquiries) {
  //       loadInquiries(inquiryPage, inquiryFilter, true); // true = silent refresh
  //     }     
  //   };

  //   window.addEventListener("global_60s_sync", handleGlobalSync);
  //   return () =>
  //     window.removeEventListener("global_60s_sync", handleGlobalSync);
  // }, [token, activeTab, inquiryPage, inquiryFilter, loadInquiries]);

   // ✅ FIX: UI Countdown (60 to 0) which resets perfectly on Global Sync




  // useEffect(() => {
  //   if (!token || activeTab !== "inquiries") return;

  //   // 1-second UI countdown
  //   const tickInterval = setInterval(() => {
  //     setCountdown((prev) => (prev > 1 ? prev - 1 : 60));
  //   }, 1000);

  //   // Actual Data Sync
  //   const handleGlobalSync = () => {
  //     setCountdown(60); // Reset timer to 60 immediately
  //     if (loadInquiries) {
  //       loadInquiries(inquiryPage, inquiryFilter, true); 
  //     }
  //   };

  //   window.addEventListener("global_60s_sync", handleGlobalSync);
    
  //   return () => {
  //     clearInterval(tickInterval);
  //     window.removeEventListener("global_60s_sync", handleGlobalSync);
  //   };
  // }, [token, activeTab, inquiryPage, inquiryFilter, loadInquiries]);


// ✅ FIX: UI Countdown hamesha chalega (tab change karne par rukega nahi)
  useEffect(() => {
    if (!token) return; 

    // 1-second UI countdown
    const tickInterval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);

    // Actual Data Sync
    const handleGlobalSync = () => {
      setCountdown(60); // Reset timer to 60 immediately
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

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <p className="font-sans text-sm tracking-[0.3em] uppercase text-brand-coffee/60">
          Checking session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <div className="min-h-screen bg-[#f8f4ec] text-brand-african">
        <AdminHeader
          admin={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
          countdown={countdown}
        />

        <main
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
          id="main-content"
        >


          <DashboardStats
            productsTotal={productPagination.total || products.length}
            featuredTotal={products.filter((p) => p.isFeatured).length}
            openInquiriesTotal={inquiryStats?.pending || 0}
            resolvedInquiriesTotal={inquiryStats?.resolved || 0}
            countdown={countdown}
          />




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
        </main>
      </div>
    </>
  );
}

// ✅ Suspense wrap — useSearchParams ke liye Next.js 14 mein zaroori
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
