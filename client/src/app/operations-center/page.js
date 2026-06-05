'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useProducts } from '@/hooks/useProducts';
import { useInquiries } from '@/hooks/useInquiries';

import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStats from '@/components/admin/DashboardStats';
import ProductForm from '@/components/admin/ProductForm';
import ProductTable from '@/components/admin/ProductTable';
import InquiryTable from '@/components/admin/InquiryTable';
import LookbookManager from '@/components/admin/LookbookManager';
import Toast from '@/components/ui/Toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const {
    token, admin, authChecking, loginForm, setLoginForm,
    loginError, loggingIn, handleLoginSubmit, handleLogout
  } = useAdminAuth();

  const onLogin = async (e) => {
    e.preventDefault();
    await handleLoginSubmit(e);
    
    // We check token presence to verify success
    setTimeout(() => {
      const storedToken = localStorage.getItem('sanwariyas_admin_token');
      if (storedToken) {
        setToast({ isVisible: true, message: "Welcome back, Admin!", type: 'success' });
      } else {
        setToast({ isVisible: true, message: "Invalid credentials. Please try again.", type: 'error' });
      }
    }, 500);
  };

  const {
    products, productPagination, productPage, setProductPage, productSearch, setProductSearch,
    productsLoading, productForm, setProductForm, editingProductId, productSaving, productMessage,
    deletingProductId, seeding, resetProductForm, handleProductSubmit, handleEditProduct,
    handleDeleteProduct, handleSeedProducts, loadProducts
  } = useProducts(token);

  const {
    inquiries, inquiryPagination, inquiryPage, setInquiryPage, inquiryFilter, setInquiryFilter,
    inquiriesLoading, inquiryMessage, handleInquiryStatus
  } = useInquiries(token);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#f7f2e8] flex items-center justify-center" aria-live="polite" aria-busy="true">
        <p className="font-sans text-sm tracking-[0.3em] uppercase text-brand-coffee/60" role="status">Checking admin session...</p>
      </div>
    );
  }

  return (
    <>
      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />

      {!token ? (
        <AdminLogin
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          handleLoginSubmit={onLogin}
          loginError={loginError}
          loggingIn={loggingIn}
        />
      ) : (
        <div className="min-h-screen bg-[#f8f4ec] text-brand-african">
          <AdminHeader
            admin={admin}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="main-content">
            <DashboardStats
              productsTotal={productPagination.total || products.length}
              featuredTotal={products.filter((product) => product.isFeatured).length}
              openInquiriesTotal={inquiries.filter((item) => item.status === 'pending').length}
              resolvedInquiriesTotal={inquiries.filter((item) => item.status === 'resolved').length}
            />

            {activeTab === 'products' ? (
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
            ) : activeTab === 'lookbook' ? (
              <section aria-label="Lookbook Management">
                <LookbookManager token={token} />
              </section>
            ) : (
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
                />
              </section>
            )}
          </main>
        </div>
      )}
    </>
  );
}