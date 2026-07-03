// import { useState, useEffect, useRef } from "react";

// import {
//   fetchAdminProducts,
//   createAdminProduct,
//   updateAdminProduct,
//   deleteAdminProduct,
//   seedAdminProducts,
// } from "@/lib/api";

// const emptyProductForm = {
//   name: "",
//   slug: "",
//   category: "",
//   price: "",
//   originalPrice: "",
//   image: "",
//   images: "",
//   shortDescription: "",
//   description: "",
//   tags: "",
//   fabric: "",
//   occasion: "",
//   metaTitle: "",
//   metaDescription: "",
//   isFeatured: false,
//   isAvailable: true,
// };

// const toProductForm = (product) => ({
//   name: product.name || "",
//   slug: product.slug || "",
//   category: product.category || "",
//   price: product.price ?? "",
//   originalPrice: product.originalPrice ?? "",
//   image: product.image || "",
//   images: (product.images || []).join("\n"),
//   shortDescription: product.shortDescription || "",
//   description: product.description || "",
//   tags: (product.tags || []).join(", "),
//   fabric: product.fabric || "",
//   occasion: product.occasion || "",
//   metaTitle: product.metaTitle || "",
//   metaDescription: product.metaDescription || "",
//   isFeatured: Boolean(product.isFeatured),
//   isAvailable: product.isAvailable !== false,
// });

// const productPayloadFromForm = (form) => ({
//   ...form,
//   price: form.price === "" ? "" : Number(form.price),
//   originalPrice: form.originalPrice === "" ? "" : Number(form.originalPrice),
// });

// export function useProducts(token) {
//   const [products, setProducts] = useState([]);
//   const [productPagination, setProductPagination] = useState({});
//   const [productPage, setProductPage] = useState(1);
//   const [productSearch, setProductSearch] = useState("");
//   const [productsLoading, setProductsLoading] = useState(false);
//   const [productForm, setProductForm] = useState(emptyProductForm);
//   const [editingProductId, setEditingProductId] = useState("");
//   const [productSaving, setProductSaving] = useState(false);
//   const [productMessage, setProductMessage] = useState("");
//   const [deletingProductId, setDeletingProductId] = useState("");
//   const [seeding, setSeeding] = useState(false);

//   const flashTimeout = useRef(null);

//   const setFlash = (setter, message) => {
//     if (flashTimeout.current) {
//       clearTimeout(flashTimeout.current);
//     }

//     setter(message);

//     flashTimeout.current = window.setTimeout(() => {
//       setter("");
//       flashTimeout.current = null;
//     }, 4000);
//   };

//   const resetProductForm = () => {
//     setProductForm(emptyProductForm);
//     setEditingProductId("");
//   };

//   const loadProducts = async (
//     authToken,
//     page = productPage,
//     search = productSearch,
//   ) => {
//     if (!authToken) return;
//     setProductsLoading(true);
//     try {
//       const data = await fetchAdminProducts(authToken, {
//         page,
//         limit: 12,
//         search: search || undefined,
//       });
//       setProducts(data.products || []);
//       setProductPagination(data.pagination || {});
//     } catch (error) {
//       setFlash(
//         setProductMessage,
//         error.response?.data?.message || "Unable to load products",
//       );
//     } finally {
//       setProductsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       setProducts([]);
//       setProductPage(1);
//       resetProductForm();
//       return;
//     }
//     loadProducts(token, productPage, productSearch);
//   }, [token, productPage, productSearch]);

//   const handleProductSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) return;
//     setProductSaving(true);
//     try {
//       const payload = productPayloadFromForm(productForm);
//       if (editingProductId) {
//         await updateAdminProduct(token, editingProductId, payload);
//         setFlash(setProductMessage, "Product updated successfully");
//       } else {
//         await createAdminProduct(token, payload);
//         setFlash(setProductMessage, "Product created successfully");
//       }
//       resetProductForm();
//       setProductPage(1);
//       await loadProducts(token, 1, productSearch);
//     } catch (error) {
//       setFlash(
//         setProductMessage,
//         error.response?.data?.message || "Unable to save product",
//       );
//     } finally {
//       setProductSaving(false);
//     }
//   };

//   const handleEditProduct = (product, setActiveTab) => {
//     setEditingProductId(product._id);
//     setProductForm(toProductForm(product));
//     setActiveTab("products");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDeleteProduct = async (id) => {
//     if (!token) return;
//     if (!window.confirm("Delete this product? This cannot be undone.")) return;
//     setDeletingProductId(id);
//     try {
//       await deleteAdminProduct(token, id);
//       setFlash(setProductMessage, "Product deleted successfully");
//       if (editingProductId === id) resetProductForm();
//       await loadProducts(token, productPage, productSearch);
//     } catch (error) {
//       setFlash(
//         setProductMessage,
//         error.response?.data?.message || "Unable to delete product",
//       );
//     } finally {
//       setDeletingProductId("");
//     }
//   };

//   const handleSeedProducts = async () => {
//     if (!token) return;
//     setSeeding(true);
//     try {
//       const data = await seedAdminProducts(token);
//       setFlash(
//         setProductMessage,
//         data.message || "Sample products seeded successfully",
//       );
//       await loadProducts(token, 1, productSearch);
//     } catch (error) {
//       setFlash(
//         setProductMessage,
//         error.response?.data?.message || "Unable to seed products",
//       );
//     } finally {
//       setSeeding(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (flashTimeout.current) {
//         clearTimeout(flashTimeout.current);
//       }
//     };
//   }, []);

//   return {
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
//   };
// }




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
};

const toProductForm = (product) => ({
  name: product.name || "",
  slug: product.slug || "",
  category: product.category || "",
  price: product.price ?? "",
  originalPrice: product.originalPrice ?? "",
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
});

const productPayloadFromForm = (form) => ({
  ...form,
  price: form.price === "" ? "" : Number(form.price),
  originalPrice: form.originalPrice === "" ? "" : Number(form.originalPrice),
});

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

  // Memoize flash setter to prevent recreation on every render
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

  // Decoupled loadProducts from state variables to stabilize its reference
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
        setFlash(
          setProductMessage,
          error.response?.data?.message || "Unable to load products"
        );
      } finally {
        setProductsLoading(false);
      }
    },
    [setFlash]
  );

  // Fetch products on mount or when page/search changes
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
      setProductSaving(true);
      try {
        const payload = productPayloadFromForm(productForm);
        if (editingProductId) {
          await updateAdminProduct(token, editingProductId, payload);
          setFlash(setProductMessage, "Product updated successfully");
        } else {
          await createAdminProduct(token, payload);
          setFlash(setProductMessage, "Product created successfully");
        }
        resetProductForm();
        setProductPage(1);
        await loadProducts(token, 1, productSearch);
      } catch (error) {
        setFlash(
          setProductMessage,
          error.response?.data?.message || "Unable to save product"
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
    ]
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
      if (!window.confirm("Delete this product? This cannot be undone.")) return;
      setDeletingProductId(id);
      try {
        await deleteAdminProduct(token, id);
        setFlash(setProductMessage, "Product deleted successfully");
        if (editingProductId === id) resetProductForm();
        await loadProducts(token, productPage, productSearch);
      } catch (error) {
        setFlash(
          setProductMessage,
          error.response?.data?.message || "Unable to delete product"
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
    ]
  );

  const handleSeedProducts = useCallback(async () => {
    if (!token) return;
    setSeeding(true);
    try {
      const data = await seedAdminProducts(token);
      setFlash(
        setProductMessage,
        data.message || "Sample products seeded successfully"
      );
      await loadProducts(token, 1, productSearch);
    } catch (error) {
      setFlash(
        setProductMessage,
        error.response?.data?.message || "Unable to seed products"
      );
    } finally {
      setSeeding(false);
    }
  }, [token, productSearch, loadProducts, setFlash]);

  // Clean up the timeout if the component unmounts
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