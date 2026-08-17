// FILE: client/src/hooks/useProducts.js
import { useState, useEffect, useRef, useCallback } from "react";

import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  seedAdminProducts,
} from "@/lib/api";

const emptyProductForm = {
  name: "",
  slug: "",
  category: "",
  price: "",
  originalPrice: "",
  stock: "", //  STOCK ADDED
  image: "",
  images: "",
  shortDescription: "",
  description: "",
  tags: "",
  fabric: "",
  occasion: "",
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
  isAvailable: true,
  imageFile: null,
  galleryFiles: [],
};

const toProductForm = (product) => ({
  name: product.name || "",
  slug: product.slug || "",
  category: product.category || "",
  price: product.price ?? "",
  originalPrice: product.originalPrice ?? "",
  stock: product.stock ?? "", //  STOCK ADDED
  image: product.image || "",
  images: (product.images || []).join("\n"),
  shortDescription: product.shortDescription || "",
  description: product.description || "",
  tags: (product.tags || []).join(", "),
  fabric: product.fabric || "",
  occasion: product.occasion || "",
  metaTitle: product.metaTitle || "",
  metaDescription: product.metaDescription || "",
  isFeatured: Boolean(product.isFeatured),
  isAvailable: product.isAvailable !== false,
  imageFile: null,
  galleryFiles: [],
});

const productPayloadFromForm = (form) => ({
  ...form,
  price: form.price === "" ? "" : Number(form.price),
  originalPrice: form.originalPrice === "" ? "" : Number(form.originalPrice),
  stock: form.stock === "" ? "" : Number(form.stock), //  STOCK ADDED
});

const buildProductFormData = (form) => {
  const fd = new FormData();
  const payload = productPayloadFromForm(form);

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "imageFile" || key === "galleryFiles") return;
    if (value === null || typeof value === "undefined") return;
    fd.append(key, value);
  });

  if (form.imageFile) {
    fd.append("image", form.imageFile);
  }
  if (form.galleryFiles?.length) {
    form.galleryFiles.forEach((file) => fd.append("images", file));
  }

  return fd;
};

export function useProducts(token) {
  const [products, setProducts] = useState([]);
  const [productPagination, setProductPagination] = useState({});
  const [productPage, setProductPage] = useState(1);
  const [productSearch, setProductSearch] = useState("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState("");
  const [productSaving, setProductSaving] = useState(false);
  const [productMessage, setProductMessage] = useState("");
  const [deletingProductId, setDeletingProductId] = useState("");
  const [seeding, setSeeding] = useState(false);

  const flashTimeout = useRef(null);

  const setFlash = useCallback((setter, message) => {
    if (flashTimeout.current) {
      clearTimeout(flashTimeout.current);
    }
    setter(message);
    flashTimeout.current = window.setTimeout(() => {
      setter("");
      flashTimeout.current = null;
    }, 4000);
  }, []);

  const resetProductForm = useCallback(() => {
    setProductForm(emptyProductForm);
    setEditingProductId("");
  }, []);

  const loadProducts = useCallback(
    async (authToken, page, search) => {
      if (!authToken) return;
      setProductsLoading(true);
      try {
        const data = await fetchAdminProducts(authToken, {
          page,
          limit: 12,
          search: search || undefined,
        });
        setProducts(data.products || []);
        setProductPagination(data.pagination || {});
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setProducts([]);
          setProductPagination({});
        } else {
          setFlash(
            setProductMessage,
            error.userMessage ||
              error.response?.data?.message ||
              "Unable to load products",
          );
        }
      } finally {
        setProductsLoading(false);
      }
    },
    [setFlash],
  );

  useEffect(() => {
    if (!token) {
      setProducts([]);
      setProductPage(1);
      resetProductForm();
      return;
    }
    loadProducts(token, productPage, productSearch);
  }, [token, productPage, productSearch, loadProducts, resetProductForm]);

  const handleProductSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!token) return;

      if (!editingProductId && !productForm.imageFile) {
        setFlash(setProductMessage, "Please upload a main product image.");
        return;
      }

      setProductSaving(true);
      try {
        const formData = buildProductFormData(productForm);
        if (editingProductId) {
          await updateAdminProduct(token, editingProductId, formData);
          setFlash(setProductMessage, "Product updated successfully");
        } else {
          await createAdminProduct(token, formData);
          setFlash(setProductMessage, "Product created successfully");
        }

        resetProductForm();
        setProductPage(1);
        await loadProducts(token, 1, productSearch);
      } catch (error) {
        setFlash(
          setProductMessage,
          error.response?.data?.message || "Unable to save product",
        );
      } finally {
        setProductSaving(false);
      }
    },
    [
      token,
      productForm,
      editingProductId,
      productSearch,
      loadProducts,
      resetProductForm,
      setFlash,
    ],
  );

  const handleEditProduct = useCallback((product, setActiveTab) => {
    setEditingProductId(product._id);
    setProductForm(toProductForm(product));
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDeleteProduct = useCallback(
    async (id) => {
      if (!token) return;
      if (!window.confirm("Delete this product? This cannot be undone."))
        return;
      setDeletingProductId(id);
      try {
        await deleteAdminProduct(token, id);
        setFlash(setProductMessage, "Product deleted successfully");
        if (editingProductId === id) resetProductForm();
        await loadProducts(token, productPage, productSearch);
      } catch (error) {
        setFlash(
          setProductMessage,
          error.response?.data?.message || "Unable to delete product",
        );
      } finally {
        setDeletingProductId("");
      }
    },
    [
      token,
      editingProductId,
      productPage,
      productSearch,
      loadProducts,
      resetProductForm,
      setFlash,
    ],
  );

  const handleSeedProducts = useCallback(async () => {
    if (!token) return;
    setSeeding(true);
    try {
      const data = await seedAdminProducts(token);
      setFlash(
        setProductMessage,
        data.message || "Sample products seeded successfully",
      );
      await loadProducts(token, 1, productSearch);
    } catch (error) {
      setFlash(
        setProductMessage,
        error.response?.data?.message || "Unable to seed products",
      );
    } finally {
      setSeeding(false);
    }
  }, [token, productSearch, loadProducts, setFlash]);

  useEffect(() => {
    return () => {
      if (flashTimeout.current) {
        clearTimeout(flashTimeout.current);
      }
    };
  }, []);

  return {
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
  };
}
