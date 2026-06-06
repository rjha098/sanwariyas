// FILE: client/src/app/operations-center/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useInquiries } from '@/hooks/useInquiries';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStats from '@/components/admin/DashboardStats';
import ProductForm from '@/components/admin/ProductForm';
import ProductTable from '@/components/admin/ProductTable';
import InquiryTable from '@/components/admin/InquiryTable';
import LookbookManager from '@/components/admin/LookbookManager';
import Toast from '@/components/ui/Toast';

export default function OperationsCenter() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') =>
    setToast({ isVisible: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, isVisible: false }));

  const {
    token, user, authChecking, isAuthenticated, isAdmin, logout,
  } = useAuth();

  // Not authenticated → redirect to login
  useEffect(() => {
    if (!authChecking && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authChecking, isAuthenticated, router]);

  const {
    products, productPagination, productPage, setProductPage,
    productSearch, setProductSearch, productsLoading,
    productForm, setProductForm, editingProductId,
    productSaving, productMessage, deletingProductId, seeding,
    resetProductForm, handleProductSubmit, handleEditProduct,
    handleDeleteProduct, handleSeedProducts, loadProducts,
  } = useProducts(token);

  const {
    inquiries, inquiryPagination, inquiryPage, setInquiryPage,
    inquiryFilter, setInquiryFilter, inquiriesLoading,
    inquiryMessage, handleInquiryStatus,
  } = useInquiries(token);

  // Show product messages via Toast
  useEffect(() => {
    if (!productMessage) return;
    const isError = productMessage.toLowerCase().includes('unable') ||
                    productMessage.toLowerCase().includes('error') ||
                    productMessage.toLowerCase().includes('failed');
    showToast(productMessage, isError ? 'error' : 'success');
  }, [productMessage]);

  // Show inquiry messages via Toast
  useEffect(() => {
    if (!inquiryMessage) return;
    const isError = inquiryMessage.toLowerCase().includes('unable') ||
                    inquiryMessage.toLowerCase().includes('error') ||
                    inquiryMessage.toLowerCase().includes('failed');
    showToast(inquiryMessage, isError ? 'error' : 'success');
  }, [inquiryMessage]);

  const handleLogout = () => {
    showToast('Logged out successfully.', 'success');
    setTimeout(() => {
      logout();
      router.replace('/login');
    }, 2000);
  };

  // Checking session
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <p className="font-sans text-sm tracking-[0.3em] uppercase text-brand-coffee/60">
          Checking session...
        </p>
      </div>
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
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="main-content">
          <DashboardStats
            productsTotal={productPagination.total || products.length}
            featuredTotal={products.filter((p) => p.isFeatured).length}
            openInquiriesTotal={inquiries.filter((i) => i.status === 'pending').length}
            resolvedInquiriesTotal={inquiries.filter((i) => i.status === 'resolved').length}
          />

          {activeTab === 'products' && (
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
          )}

          {activeTab === 'lookbook' && (
            <section aria-label="Lookbook Management">
              <LookbookManager token={token} showToast={showToast} />
            </section>
          )}

          {activeTab === 'inquiries' && (
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
    </>
  );
}