// FILE: client/src/app/operations-center/(dashboard)/products/page.js
"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useAdminDashboard } from "@/components/admin/AdminDashboardContext";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";

const isErrorMessage = (msg) => {
  const m = msg.toLowerCase();
  return m.includes("unable") || m.includes("error") || m.includes("failed");
};

export default function ProductsPage() {
  const { token } = useAuth();
  const { showToast } = useAdminDashboard();

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

  useEffect(() => {
    if (!productMessage) return;
    showToast(productMessage, isErrorMessage(productMessage) ? "error" : "success");
  }, [productMessage, showToast]);

  return (
    <AdminSectionCard>
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
          // The hook expects a tab setter; editing now happens in place on this
          // route, so there is no tab to switch and a no-op is correct.
          handleEditProduct={(p) => handleEditProduct(p, () => {})}
          handleDeleteProduct={handleDeleteProduct}
          deletingProductId={deletingProductId}
          loadProducts={loadProducts}
          token={token}
        />
      </section>
    </AdminSectionCard>
  );
}