// // FILE: client/src/app/operations-center/page.js
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import { useProducts } from "@/hooks/useProducts";
// import { useInquiries } from "@/hooks/useInquiries";
// import AdminHeader from "@/components/admin/AdminHeader";
// import DashboardStats from "@/components/admin/DashboardStats";
// import ProductForm from "@/components/admin/ProductForm";
// // import ProductTable from '@/components/admin/ProductTable';
// import InquiryTable from "@/components/admin/InquiryTable";
// import LookbookManager from "@/components/admin/LookbookManager";
// import Toast from "@/components/ui/Toast";
// import BlogManager from "@/components/admin/BlogManager";

// export default function OperationsCenter() {
//   const router = useRouter();
//   // const [activeTab, setActiveTab] = useState('products');
//   // const [activeTab, setActiveTab] = useState('lookbook');
//   // Change the initial state if you want
//   const [activeTab, setActiveTab] = useState("blogs");
//   const [toast, setToast] = useState({
//     isVisible: false,
//     message: "",
//     type: "success",
//   });

//   // State for the auto-refresh countdown timer
//   const [countdown, setCountdown] = useState(15);

//   const showToast = (message, type = "success") =>
//     setToast({ isVisible: true, message, type });
//   const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

//   const { token, user, authChecking, isAuthenticated, isAdmin, logout } =
//     useAuth();

//   // Not authenticated → redirect to login
//   useEffect(() => {
//     if (!authChecking && !isAuthenticated) {
//       router.replace("/login");
//     }
//   }, [authChecking, isAuthenticated, router]);

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
//     loadInquiries, // Required to trigger the background refresh
//   } = useInquiries(token);

//   // Auto-polling logic for Inquiries
//   useEffect(() => {
//     // Only run the timer if the user is authenticated and on the inquiries tab
//     if (!token || activeTab !== "inquiries") return;

//     const tickInterval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           // When timer hits 0, fetch inquiries silently (assuming the 3rd parameter handles silent fetching if configured in hook)
//           if (loadInquiries) {
//             loadInquiries(inquiryPage, inquiryFilter, false);
//           }
//           return 15; // Reset timer
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(tickInterval);
//   }, [token, activeTab, inquiryPage, inquiryFilter, loadInquiries]);

//   // Show product messages via Toast
//   useEffect(() => {
//     if (!productMessage) return;
//     const isError =
//       productMessage.toLowerCase().includes("unable") ||
//       productMessage.toLowerCase().includes("error") ||
//       productMessage.toLowerCase().includes("failed");
//     showToast(productMessage, isError ? "error" : "success");
//   }, [productMessage]);

//   // Show inquiry messages via Toast
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

//   // Checking session
//   if (authChecking) {
//     return (
//       <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
//         <p className="font-sans text-sm tracking-[0.3em] uppercase text-brand-coffee/60">
//           Checking session...
//         </p>
//       </div>
//     );
//   }

//   // Not logged in
//   if (!isAuthenticated || !isAdmin) return null;

//   return (
//     <>
//       <Toast
//         isVisible={toast.isVisible}
//         message={toast.message}
//         type={toast.type}
//         onClose={hideToast}
//       />

//       <div className="min-h-screen bg-[#f8f4ec] text-brand-african">
//         <AdminHeader
//           admin={user}
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           handleLogout={handleLogout}
//           countdown={countdown} // Pass countdown to header
//         />

//         <main
//           className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
//           id="main-content"
//         >
//           <DashboardStats
//             productsTotal={productPagination.total || products.length}
//             featuredTotal={products.filter((p) => p.isFeatured).length}
//             openInquiriesTotal={inquiryStats?.pending || 0}
//             resolvedInquiriesTotal={inquiryStats?.resolved || 0}
//           />

//           {/* {activeTab === 'products' && (
//             <section aria-label="Product Management" className="space-y-6">
//               <div className="grid lg:grid-cols-[1.05fr_1.45fr] gap-6">
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
//                   handleEditProduct={(prod) => handleEditProduct(prod, setActiveTab)}
//                   handleDeleteProduct={handleDeleteProduct}
//                   deletingProductId={deletingProductId}
//                   loadProducts={loadProducts}
//                   token={token}
//                 />
//               </div>
//             </section>
//           )} */}

//           {activeTab === "blogs" && (
//             <section aria-label="Blog Management">
//               <BlogManager token={token} showToast={showToast} />
//             </section>
//           )}

//           {activeTab === "lookbook" && (
//             <section aria-label="Lookbook Management">
//               <LookbookManager token={token} showToast={showToast} />
//             </section>
//           )}

//           {activeTab === "inquiries" && (
//             <section aria-label="Inquiries Management">
//               <InquiryTable
//                 inquiries={inquiries}
//                 inquiriesLoading={inquiriesLoading}
//                 inquiryPagination={inquiryPagination}
//                 inquiryPage={inquiryPage}
//                 setInquiryPage={setInquiryPage}
//                 inquiryFilter={inquiryFilter}
//                 setInquiryFilter={setInquiryFilter}
//                 inquiryMessage={inquiryMessage}
//                 handleInquiryStatus={handleInquiryStatus}
//                 deleteInquiry={deleteInquiry}
//                 markAsViewed={markAsViewed}
//               />
//             </section>
//           )}
//         </main>
//       </div>
//     </>
//   );
// }




// FILE: client/src/app/operations-center/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useInquiries } from "@/hooks/useInquiries";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardStats from "@/components/admin/DashboardStats";
// import ProductForm from "@/components/admin/ProductForm";
// import ProductTable from '@/components/admin/ProductTable';
import InquiryTable from "@/components/admin/InquiryTable";
import LookbookManager from "@/components/admin/LookbookManager";
import Toast from "@/components/ui/Toast";
import BlogManager from "@/components/admin/BlogManager";

export default function OperationsCenter() {
  const router = useRouter();
  // const [activeTab, setActiveTab] = useState('products');
  // const [activeTab, setActiveTab] = useState('lookbook');
  // Change the initial state if you want
  const [activeTab, setActiveTab] = useState("blogs");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  // State for the auto-refresh countdown timer
  const [countdown, setCountdown] = useState(15);

  const showToast = (message, type = "success") =>
    setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  const { token, user, authChecking, isAuthenticated, isAdmin, logout } =
    useAuth();

  // Not authenticated → redirect to login
  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authChecking, isAuthenticated, router]);

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
    // loadProducts,
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
    loadInquiries, // Required to trigger the background refresh
  } = useInquiries(token);

  // Auto-polling logic for Inquiries
  useEffect(() => {
    // Only run the timer if the user is authenticated and on the inquiries tab
    if (!token || activeTab !== "inquiries") return;

    const tickInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // When timer hits 0, fetch inquiries silently (assuming the 3rd parameter handles silent fetching if configured in hook)
          if (loadInquiries) {
            loadInquiries(inquiryPage, inquiryFilter, false);
          }
          return 15; // Reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tickInterval);
  }, [token, activeTab, inquiryPage, inquiryFilter, loadInquiries]);

  // Show product messages via Toast
  useEffect(() => {
    if (!productMessage) return;
    const isError =
      productMessage.toLowerCase().includes("unable") ||
      productMessage.toLowerCase().includes("error") ||
      productMessage.toLowerCase().includes("failed");
    showToast(productMessage, isError ? "error" : "success");
  }, [productMessage]);

  // Show inquiry messages via Toast
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

  // Checking session
  if (authChecking) {
    return (
      <>
       
        <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-brand-coffee/60">
            Checking session...
          </p>
        </div>
      </>
    );
  }

  // Not logged in
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
          countdown={countdown} // Pass countdown to header
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
          />

          {/* {activeTab === 'products' && (
            <section aria-label="Product Management" className="space-y-6">
              <div className="grid lg:grid-cols-[1.05fr_1.45fr] gap-6">
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
                  handleEditProduct={(prod) => handleEditProduct(prod, setActiveTab)}
                  handleDeleteProduct={handleDeleteProduct}
                  deletingProductId={deletingProductId}
                  loadProducts={loadProducts}
                  token={token}
                />
              </div>
            </section>
          )} */}

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
              />
            </section>
          )}
        </main>
      </div>
    </>
  );
}