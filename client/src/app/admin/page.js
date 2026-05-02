// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   adminLogin,
//   adminSession,
//   createAdminProduct,
//   deleteAdminProduct,
//   fetchAdminInquiries,
//   fetchAdminProducts,
//   seedAdminProducts,
//   updateAdminInquiryStatus,
//   updateAdminProduct,
// } from '@/lib/api';

// const ADMIN_TOKEN_KEY = 'sanwariyas_admin_token';

// const STATUS_COLORS = {
//   pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
//   contacted: 'bg-blue-100 text-blue-800 border-blue-300',
//   resolved: 'bg-green-100 text-green-800 border-green-300',
// };

// // Default blank form for creating a new product.
// const emptyProductForm = {
//   name: '',
//   slug: '',
//   category: '',
//   price: '',
//   originalPrice: '',
//   image: '',
//   images: '',
//   shortDescription: '',
//   description: '',
//   tags: '',
//   fabric: '',
//   occasion: '',
//   metaTitle: '',
//   metaDescription: '',
//   isFeatured: false,
//   isAvailable: true,
// };

// const toProductForm = (product) => ({
//   // Convert API product data into form-friendly text values.
//   name: product.name || '',
//   slug: product.slug || '',
//   category: product.category || '',
//   price: product.price ?? '',
//   originalPrice: product.originalPrice ?? '',
//   image: product.image || '',
//   images: (product.images || []).join('\n'),
//   shortDescription: product.shortDescription || '',
//   description: product.description || '',
//   tags: (product.tags || []).join(', '),
//   fabric: product.fabric || '',
//   occasion: product.occasion || '',
//   metaTitle: product.metaTitle || '',
//   metaDescription: product.metaDescription || '',
//   isFeatured: Boolean(product.isFeatured),
//   isAvailable: product.isAvailable !== false,
// });

// const productPayloadFromForm = (form) => ({
//   // Convert form strings into the shape expected by the backend.
//   ...form,
//   price: form.price === '' ? '' : Number(form.price),
//   originalPrice: form.originalPrice === '' ? '' : Number(form.originalPrice),
// });

// export default function AdminDashboard() {
//   // Login/session state
//   const [token, setToken] = useState('');
//   const [admin, setAdmin] = useState(null);
//   const [authChecking, setAuthChecking] = useState(true);
//   const [loginForm, setLoginForm] = useState({ username: '', password: '' });
//   const [loginError, setLoginError] = useState('');
//   const [loggingIn, setLoggingIn] = useState(false);

//   // Which admin tab is open right now.
//   const [activeTab, setActiveTab] = useState('products');

//   // Product management state
//   const [products, setProducts] = useState([]);
//   const [productPagination, setProductPagination] = useState({});
//   const [productPage, setProductPage] = useState(1);
//   const [productSearch, setProductSearch] = useState('');
//   const [productsLoading, setProductsLoading] = useState(false);
//   const [productForm, setProductForm] = useState(emptyProductForm);
//   const [editingProductId, setEditingProductId] = useState('');
//   const [productSaving, setProductSaving] = useState(false);
//   const [productMessage, setProductMessage] = useState('');
//   const [deletingProductId, setDeletingProductId] = useState('');
//   const [seeding, setSeeding] = useState(false);

//   // Inquiry management state
//   const [inquiries, setInquiries] = useState([]);
//   const [inquiryPagination, setInquiryPagination] = useState({});
//   const [inquiryPage, setInquiryPage] = useState(1);
//   const [inquiryFilter, setInquiryFilter] = useState('');
//   const [inquiriesLoading, setInquiriesLoading] = useState(false);
//   const [inquiryMessage, setInquiryMessage] = useState('');

//   const setFlash = (setter, message) => {
//     // Show a temporary success/error message for 4 seconds.
//     setter(message);
//     window.setTimeout(() => setter(''), 4000);
//   };

//   const resetProductForm = () => {
//     // Leave edit mode and go back to a fresh "new product" form.
//     setProductForm(emptyProductForm);
//     setEditingProductId('');
//   };

//   const loadProducts = async (authToken, page = productPage, search = productSearch) => {
//     // Load products for the admin table.
//     if (!authToken) return;
//     setProductsLoading(true);
//     try {
//       const data = await fetchAdminProducts(authToken, { page, limit: 12, search: search || undefined });
//       setProducts(data.products || []);
//       setProductPagination(data.pagination || {});
//     } catch (error) {
//       setFlash(setProductMessage, error.response?.data?.message || 'Unable to load products');
//     } finally {
//       setProductsLoading(false);
//     }
//   };

//   const loadInquiries = async (authToken, page = inquiryPage, status = inquiryFilter) => {
//     // Load inquiries for the admin table.
//     if (!authToken) return;
//     setInquiriesLoading(true);
//     try {
//       const data = await fetchAdminInquiries(authToken, { status: status || undefined, page, limit: 15 });
//       setInquiries(data.inquiries || []);
//       setInquiryPagination(data.pagination || {});
//     } catch (error) {
//       setFlash(setInquiryMessage, error.response?.data?.message || 'Unable to load inquiries');
//     } finally {
//       setInquiriesLoading(false);
//     }
//   };

//   useEffect(() => {
//     // When /admin opens, check whether browser already has a saved token.
//     const savedToken = window.localStorage.getItem(ADMIN_TOKEN_KEY);

//     if (!savedToken) {
//       setAuthChecking(false);
//       return;
//     }

//     adminSession(savedToken)
//       .then((data) => {
//         setToken(savedToken);
//         setAdmin(data.admin);
//       })
//       .catch(() => {
//         window.localStorage.removeItem(ADMIN_TOKEN_KEY);
//       })
//       .finally(() => setAuthChecking(false));
//   }, []);

//   useEffect(() => {
//     // Reload products after login or page change.
//     if (!token) return;
//     loadProducts(token, productPage, productSearch);
//   }, [token, productPage]);

//   useEffect(() => {
//     // Reload inquiries after login or filter/page change.
//     if (!token) return;
//     loadInquiries(token, inquiryPage, inquiryFilter);
//   }, [token, inquiryPage, inquiryFilter]);

//   const handleLoginSubmit = async (e) => {
//     // Send username/password to backend and save returned token in localStorage.
//     e.preventDefault();
//     setLoggingIn(true);
//     setLoginError('');

//     try {
//       const data = await adminLogin(loginForm);
//       window.localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
//       setToken(data.token);
//       setAdmin(data.admin);
//       setLoginForm({ username: '', password: '' });
//       setProductPage(1);
//       setInquiryPage(1);
//     } catch (error) {
//       setLoginError(error.response?.data?.message || 'Login failed');
//     } finally {
//       setLoggingIn(false);
//     }
//   };

//   const handleLogout = () => {
//     // Remove saved token so admin area becomes locked again.
//     window.localStorage.removeItem(ADMIN_TOKEN_KEY);
//     setToken('');
//     setAdmin(null);
//     resetProductForm();
//     setProducts([]);
//     setInquiries([]);
//   };

//   const handleProductSubmit = async (e) => {
//     // Same form handles both "create product" and "update product".
//     e.preventDefault();
//     if (!token) return;

//     setProductSaving(true);

//     try {
//       const payload = productPayloadFromForm(productForm);
//       if (editingProductId) {
//         await updateAdminProduct(token, editingProductId, payload);
//         setFlash(setProductMessage, 'Product updated successfully');
//       } else {
//         await createAdminProduct(token, payload);
//         setFlash(setProductMessage, 'Product created successfully');
//       }

//       resetProductForm();
//       setProductPage(1);
//       await loadProducts(token, 1, productSearch);
//     } catch (error) {
//       setFlash(setProductMessage, error.response?.data?.message || 'Unable to save product');
//     } finally {
//       setProductSaving(false);
//     }
//   };

//   const handleEditProduct = (product) => {
//     // Fill the form with selected product data so admin can edit it.
//     setEditingProductId(product._id);
//     setProductForm(toProductForm(product));
//     setActiveTab('products');
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDeleteProduct = async (id) => {
//     // Permanently remove one product after browser confirmation.
//     if (!token) return;
//     if (!window.confirm('Delete this product? This cannot be undone.')) return;

//     setDeletingProductId(id);
//     try {
//       await deleteAdminProduct(token, id);
//       setFlash(setProductMessage, 'Product deleted successfully');
//       if (editingProductId === id) resetProductForm();
//       await loadProducts(token, productPage, productSearch);
//     } catch (error) {
//       setFlash(setProductMessage, error.response?.data?.message || 'Unable to delete product');
//     } finally {
//       setDeletingProductId('');
//     }
//   };

//   const handleSeedProducts = async () => {
//     // Insert sample products for testing/demo if DB is empty.
//     if (!token) return;
//     setSeeding(true);
//     try {
//       const data = await seedAdminProducts(token);
//       setFlash(setProductMessage, data.message || 'Sample products seeded successfully');
//       await loadProducts(token, 1, productSearch);
//     } catch (error) {
//       setFlash(setProductMessage, error.response?.data?.message || 'Unable to seed products');
//     } finally {
//       setSeeding(false);
//     }
//   };

//   const handleInquiryStatus = async (id, status) => {
//     // Update inquiry status from the admin dashboard.
//     if (!token) return;

//     try {
//       await updateAdminInquiryStatus(token, id, { status });
//       setFlash(setInquiryMessage, `Inquiry marked as ${status}`);
//       await loadInquiries(token, inquiryPage, inquiryFilter);
//     } catch (error) {
//       setFlash(setInquiryMessage, error.response?.data?.message || 'Unable to update inquiry');
//     }
//   };

//   if (authChecking) {
//     return (
//       <div className="min-h-screen bg-[#f7f2e8] flex items-center justify-center">
//         <p className="font-sans text-sm tracking-[0.3em] uppercase text-brand-coffee/60">Checking admin session...</p>
//       </div>
//     );
//   }

//   if (!token) {
//     return (
//       <div className="min-h-screen bg-[#f5efe4] text-brand-african flex items-center justify-center px-4">
//         <div className="w-full max-w-md bg-white border border-brand-lightgold/60 shadow-xl p-8">
//           <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-brand-gold mb-3">Sanwariyas</p>
//           <h1 className="font-display text-3xl mb-2">Admin Login</h1>
//           <p className="font-sans text-sm text-brand-mud mb-8">
//             Use your configured admin username and password to manage products and inquiries.
//           </p>

//           <form onSubmit={handleLoginSubmit} className="space-y-5">
//             {/* Admin login form */}
//             <div>
//               <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={loginForm.username}
//                 onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
//                 className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//               />
//             </div>

//             <div>
//               <label className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 required
//                 value={loginForm.password}
//                 onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
//                 className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//               />
//             </div>

//             {loginError && (
//               <p className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
//                 {loginError}
//               </p>
//             )}

//             <button
//               type="submit"
//               disabled={loggingIn}
//               className="w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-60"
//             >
//               {loggingIn ? 'Signing In...' : 'Sign In'}
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8f4ec] text-brand-african">
//       <header className="bg-brand-african text-brand-cream px-6 py-5 border-b border-brand-gold/20">
//         <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-brand-gold mb-2">Sanwariyas</p>
//             <h1 className="font-display text-3xl">Admin Panel</h1>
//             <p className="font-sans text-sm text-brand-cream/70 mt-1">
//               Signed in as {admin?.username || 'admin'}
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <button
//               onClick={() => setActiveTab('products')}
//               className={`px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border transition-colors ${
//                 activeTab === 'products'
//                   ? 'bg-brand-gold text-brand-african border-brand-gold'
//                   : 'border-brand-cream/30 text-brand-cream'
//               }`}
//             >
//               Products
//             </button>
//             <button
//               onClick={() => setActiveTab('inquiries')}
//               className={`px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border transition-colors ${
//                 activeTab === 'inquiries'
//                   ? 'bg-brand-gold text-brand-african border-brand-gold'
//                   : 'border-brand-cream/30 text-brand-cream'
//               }`}
//             >
//               Inquiries
//             </button>
//             <a
//               href="/"
//               className="px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border border-brand-cream/30 text-brand-cream"
//             >
//               View Site
//             </a>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border border-brand-cream/30 text-brand-cream"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//         <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {[
//             { label: 'Products', value: productPagination.total || products.length, tone: 'bg-brand-african text-white' },
//             { label: 'Featured', value: products.filter((product) => product.isFeatured).length, tone: 'bg-brand-coffee text-white' },
//             { label: 'Open Inquiries', value: inquiries.filter((item) => item.status === 'pending').length, tone: 'bg-yellow-600 text-white' },
//             { label: 'Resolved', value: inquiries.filter((item) => item.status === 'resolved').length, tone: 'bg-green-700 text-white' },
//           ].map((item) => (
//             <div key={item.label} className={`${item.tone} p-5 shadow-sm`}>
//               <p className="font-sans text-3xl mb-1">{item.value}</p>
//               <p className="font-sans text-xs tracking-[0.3em] uppercase opacity-80">{item.label}</p>
//             </div>
//           ))}
//         </section>

//         {activeTab === 'products' ? (
//           <section className="space-y-6">
//             <div className="grid lg:grid-cols-[1.05fr_1.45fr] gap-6">
//               <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
//                 {/* Left panel: create or edit product */}
//                 <div className="flex items-start justify-between gap-4 mb-6">
//                   <div>
//                     <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2">Catalog</p>
//                     <h2 className="font-display text-2xl">
//                       {editingProductId ? 'Edit Product' : 'Add Product'}
//                     </h2>
//                   </div>
//                   {editingProductId && (
//                     <button
//                       onClick={resetProductForm}
//                       className="font-sans text-xs tracking-[0.2em] uppercase text-brand-coffee"
//                     >
//                       New Product
//                     </button>
//                   )}
//                 </div>

//                 <form onSubmit={handleProductSubmit} className="space-y-4">
//                   <div className="grid sm:grid-cols-2 gap-4">
//                     <input
//                       type="text"
//                       placeholder="Product name"
//                       value={productForm.name}
//                       onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                       required
//                     />
//                     <input
//                       type="text"
//                       placeholder="Slug"
//                       value={productForm.slug}
//                       onChange={(e) => setProductForm((prev) => ({ ...prev, slug: e.target.value }))}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                     />
//                   </div>

//                   <div className="grid sm:grid-cols-3 gap-4">
//                     <input
//                       type="text"
//                       placeholder="Category"
//                       value={productForm.category}
//                       onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                     />
//                     <input
//                       type="number"
//                       min="0"
//                       placeholder="Price"
//                       value={productForm.price}
//                       onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                       required
//                     />
//                     <input
//                       type="number"
//                       min="0"
//                       placeholder="Original price"
//                       value={productForm.originalPrice}
//                       onChange={(e) => setProductForm((prev) => ({ ...prev, originalPrice: e.target.value }))}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                     />
//                   </div>

//                   <input
//                     type="url"
//                     placeholder="Main image URL"
//                     value={productForm.image}
//                     onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
//                     className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                     required
//                   />

//                   <textarea
//                     rows={3}
//                     placeholder="More image URLs, one per line"
//                     value={productForm.images}
//                     onChange={(e) => setProductForm((prev) => ({ ...prev, images: e.target.value }))}
//                     className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee resize-none"
//                   />

//                   <input
//                     type="text"
//                     placeholder="Short description"
//                     value={productForm.shortDescription}
//                     onChange={(e) => setProductForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
//                     className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                   />

//                   <textarea
//                     rows={5}
//                     placeholder="Full description"
//                     value={productForm.description}
//                     onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
//                     className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee resize-none"
//                     required
//                   />

//                   <div className="grid sm:grid-cols-3 gap-4">
//                     <input
//                       type="text"
//                       placeholder="Tags, comma separated"
//                       value={productForm.tags}
//                       onChange={(e) => setProductForm((prev) => ({ ...prev, tags: e.target.value }))}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Fabric"
//                       value={productForm.fabric}
//                       onChange={(e) => setProductForm((prev) => ({ ...prev, fabric: e.target.value }))}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Occasion"
//                       value={productForm.occasion}
//                       onChange={(e) => setProductForm((prev) => ({ ...prev, occasion: e.target.value }))}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                     />
//                   </div>

//                   <div className="grid sm:grid-cols-2 gap-4">
//                     <input
//                       type="text"
//                       placeholder="Meta title"
//                       value={productForm.metaTitle}
//                       onChange={(e) => setProductForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Meta description"
//                       value={productForm.metaDescription}
//                       onChange={(e) => setProductForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//                     />
//                   </div>

//                   <div className="flex flex-wrap gap-6 pt-1">
//                     <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
//                       <input
//                         type="checkbox"
//                         checked={productForm.isFeatured}
//                         onChange={(e) => setProductForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
//                       />
//                       Featured product
//                     </label>
//                     <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
//                       <input
//                         type="checkbox"
//                         checked={productForm.isAvailable}
//                         onChange={(e) => setProductForm((prev) => ({ ...prev, isAvailable: e.target.checked }))}
//                       />
//                       Available on site
//                     </label>
//                   </div>

//                   {productMessage && (
//                     <p className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3">
//                       {productMessage}
//                     </p>
//                   )}

//                   <div className="flex flex-wrap gap-3">
//                     <button
//                       type="submit"
//                       disabled={productSaving}
//                       className="bg-brand-coffee text-brand-cream px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60"
//                     >
//                       {productSaving ? 'Saving...' : editingProductId ? 'Update Product' : 'Create Product'}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleSeedProducts}
//                       disabled={seeding}
//                       className="border border-brand-coffee text-brand-coffee px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60"
//                     >
//                       {seeding ? 'Seeding...' : 'Seed Samples'}
//                     </button>
//                   </div>
//                 </form>
//               </div>

//               <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
//                 {/* Right panel: product list and search */}
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//                   <div>
//                     <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2">Inventory</p>
//                     <h2 className="font-display text-2xl">Manage Products</h2>
//                   </div>
//                   <div className="flex gap-3">
//                     <input
//                       type="text"
//                       placeholder="Search by name, slug, category"
//                       value={productSearch}
//                       onChange={(e) => setProductSearch(e.target.value)}
//                       className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee w-full md:w-72"
//                     />
//                     <button
//                       onClick={() => {
//                         setProductPage(1);
//                         loadProducts(token, 1, productSearch);
//                       }}
//                       className="bg-brand-african text-brand-cream px-4 py-3 font-sans text-xs tracking-[0.2em] uppercase"
//                     >
//                       Search
//                     </button>
//                   </div>
//                 </div>

//                 {productsLoading ? (
//                   <div className="py-16 text-center font-sans text-sm text-brand-mud/60">Loading products...</div>
//                 ) : products.length === 0 ? (
//                   <div className="py-16 text-center font-sans text-sm text-brand-mud/60">No products found.</div>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="w-full min-w-[760px]">
//                       <thead className="border-b border-brand-lightgold/60">
//                         <tr>
//                           {['Product', 'Category', 'Price', 'Status', 'Updated', 'Actions'].map((heading) => (
//                             <th
//                               key={heading}
//                               className="text-left py-3 pr-4 font-sans text-[10px] tracking-[0.25em] uppercase text-brand-mud/70"
//                             >
//                               {heading}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-brand-lightgold/40">
//                         {products.map((product) => (
//                           <tr key={product._id}>
//                             <td className="py-4 pr-4">
//                               <div className="flex items-center gap-3">
//                                 <img
//                                   src={product.image}
//                                   alt={product.name}
//                                   className="w-14 h-14 object-cover border border-brand-lightgold/50"
//                                 />
//                                 <div>
//                                   <p className="font-sans text-sm text-brand-african">{product.name}</p>
//                                   <p className="font-sans text-xs text-brand-mud/60">{product.slug}</p>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="py-4 pr-4 font-sans text-sm text-brand-mud">{product.category}</td>
//                             <td className="py-4 pr-4 font-sans text-sm text-brand-mud">
//                               Rs. {Number(product.price || 0).toLocaleString('en-IN')}
//                             </td>
//                             <td className="py-4 pr-4">
//                               <div className="flex flex-wrap gap-2">
//                                 <span className={`px-2 py-1 text-[10px] tracking-[0.2em] uppercase border ${product.isAvailable ? 'border-green-300 text-green-700 bg-green-50' : 'border-gray-300 text-gray-600 bg-gray-50'}`}>
//                                   {product.isAvailable ? 'Live' : 'Hidden'}
//                                 </span>
//                                 {product.isFeatured && (
//                                   <span className="px-2 py-1 text-[10px] tracking-[0.2em] uppercase border border-brand-gold/50 text-brand-coffee bg-brand-parchment">
//                                     Featured
//                                   </span>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="py-4 pr-4 font-sans text-xs text-brand-mud/70">
//                               {new Date(product.updatedAt || product.createdAt).toLocaleDateString('en-IN', {
//                                 day: '2-digit',
//                                 month: 'short',
//                                 year: 'numeric',
//                               })}
//                             </td>
//                             <td className="py-4 pr-4">
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => handleEditProduct(product)}
//                                   className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-brand-coffee text-brand-coffee"
//                                 >
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() => handleDeleteProduct(product._id)}
//                                   disabled={deletingProductId === product._id}
//                                   className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-red-200 text-red-700 disabled:opacity-60"
//                                 >
//                                   {deletingProductId === product._id ? 'Deleting...' : 'Delete'}
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}

//                 {productPagination.pages > 1 && (
//                   <div className="flex flex-wrap gap-2 mt-6">
//                     {Array.from({ length: productPagination.pages }, (_, index) => index + 1).map((pg) => (
//                       <button
//                         key={pg}
//                         onClick={() => setProductPage(pg)}
//                         className={`w-10 h-10 font-sans text-xs ${
//                           pg === productPage
//                             ? 'bg-brand-coffee text-brand-cream'
//                             : 'border border-brand-lightgold/60 text-brand-mud'
//                         }`}
//                       >
//                         {pg}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </section>
//         ) : (
//           <section className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
//             {/* Inquiry management section */}
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//               <div>
//                 <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2">Customer Desk</p>
//                 <h2 className="font-display text-2xl">Manage Inquiries</h2>
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 {['', 'pending', 'contacted', 'resolved'].map((status) => (
//                   <button
//                     key={status || 'all'}
//                     onClick={() => {
//                       setInquiryFilter(status);
//                       setInquiryPage(1);
//                     }}
//                     className={`px-4 py-2 font-sans text-xs tracking-[0.25em] uppercase border ${
//                       inquiryFilter === status
//                         ? 'bg-brand-coffee text-brand-cream border-brand-coffee'
//                         : 'border-brand-lightgold/60 text-brand-mud'
//                     }`}
//                   >
//                     {status || 'All'}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {inquiryMessage && (
//               <p className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3 mb-4">
//                 {inquiryMessage}
//               </p>
//             )}

//             {inquiriesLoading ? (
//               <div className="py-16 text-center font-sans text-sm text-brand-mud/60">Loading inquiries...</div>
//             ) : inquiries.length === 0 ? (
//               <div className="py-16 text-center font-sans text-sm text-brand-mud/60">No inquiries found.</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[840px]">
//                   <thead className="border-b border-brand-lightgold/60">
//                     <tr>
//                       {['Customer', 'Contact', 'Product', 'Message', 'Status', 'Date', 'Actions'].map((heading) => (
//                         <th
//                           key={heading}
//                           className="text-left py-3 pr-4 font-sans text-[10px] tracking-[0.25em] uppercase text-brand-mud/70"
//                         >
//                           {heading}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-brand-lightgold/40">
//                     {inquiries.map((inquiry) => (
//                       <tr key={inquiry._id}>
//                         <td className="py-4 pr-4 font-sans text-sm">{inquiry.name}</td>
//                         <td className="py-4 pr-4 font-sans text-xs text-brand-mud">
//                           <p>{inquiry.email}</p>
//                           <p className="text-brand-mud/60 mt-1">{inquiry.whatsapp}</p>
//                         </td>
//                         <td className="py-4 pr-4 font-sans text-xs text-brand-mud">
//                           {inquiry.productName || 'General inquiry'}
//                         </td>
//                         <td className="py-4 pr-4 font-sans text-xs text-brand-mud max-w-[260px]">
//                           <p className="max-h-16 overflow-hidden">{inquiry.message}</p>
//                         </td>
//                         <td className="py-4 pr-4">
//                           <span className={`inline-block font-sans text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 border rounded-full ${STATUS_COLORS[inquiry.status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
//                             {inquiry.status}
//                           </span>
//                         </td>
//                         <td className="py-4 pr-4 font-sans text-xs text-brand-mud/70">
//                           {new Date(inquiry.createdAt).toLocaleDateString('en-IN', {
//                             day: '2-digit',
//                             month: 'short',
//                             year: 'numeric',
//                           })}
//                         </td>
//                         <td className="py-4 pr-4">
//                           <div className="flex gap-2">
//                             {inquiry.status !== 'contacted' && (
//                               <button
//                                 onClick={() => handleInquiryStatus(inquiry._id, 'contacted')}
//                                 className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-blue-200 text-blue-700"
//                               >
//                                 Contacted
//                               </button>
//                             )}
//                             {inquiry.status !== 'resolved' && (
//                               <button
//                                 onClick={() => handleInquiryStatus(inquiry._id, 'resolved')}
//                                 className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-green-200 text-green-700"
//                               >
//                                 Resolve
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {inquiryPagination.pages > 1 && (
//               <div className="flex flex-wrap gap-2 mt-6">
//                 {Array.from({ length: inquiryPagination.pages }, (_, index) => index + 1).map((pg) => (
//                   <button
//                     key={pg}
//                     onClick={() => setInquiryPage(pg)}
//                     className={`w-10 h-10 font-sans text-xs ${
//                       pg === inquiryPage
//                         ? 'bg-brand-coffee text-brand-cream'
//                         : 'border border-brand-lightgold/60 text-brand-mud'
//                     }`}
//                   >
//                     {pg}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}
//       </main>
//     </div>
//   );
// }





'use client';

import { useEffect, useState } from 'react';
import {
  adminLogin,
  adminSession,
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminInquiries,
  fetchAdminProducts,
  seedAdminProducts,
  updateAdminInquiryStatus,
  updateAdminProduct,
} from '@/lib/api';

const ADMIN_TOKEN_KEY = 'sanwariyas_admin_token';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  contacted: 'bg-blue-100 text-blue-800 border-blue-300',
  resolved: 'bg-green-100 text-green-800 border-green-300',
};

// Default blank form for creating a new product.
const emptyProductForm = {
  name: '',
  slug: '',
  category: '',
  price: '',
  originalPrice: '',
  image: '',
  images: '',
  shortDescription: '',
  description: '',
  tags: '',
  fabric: '',
  occasion: '',
  metaTitle: '',
  metaDescription: '',
  isFeatured: false,
  isAvailable: true,
};

const toProductForm = (product) => ({
  // Convert API product data into form-friendly text values.
  name: product.name || '',
  slug: product.slug || '',
  category: product.category || '',
  price: product.price ?? '',
  originalPrice: product.originalPrice ?? '',
  image: product.image || '',
  images: (product.images || []).join('\n'),
  shortDescription: product.shortDescription || '',
  description: product.description || '',
  tags: (product.tags || []).join(', '),
  fabric: product.fabric || '',
  occasion: product.occasion || '',
  metaTitle: product.metaTitle || '',
  metaDescription: product.metaDescription || '',
  isFeatured: Boolean(product.isFeatured),
  isAvailable: product.isAvailable !== false,
});

const productPayloadFromForm = (form) => ({
  // Convert form strings into the shape expected by the backend.
  ...form,
  price: form.price === '' ? '' : Number(form.price),
  originalPrice: form.originalPrice === '' ? '' : Number(form.originalPrice),
});

export default function AdminDashboard() {
  // Login/session state
  const [token, setToken] = useState('');
  const [admin, setAdmin] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Which admin tab is open right now.
  const [activeTab, setActiveTab] = useState('products');

  // Product management state
  const [products, setProducts] = useState([]);
  const [productPagination, setProductPagination] = useState({});
  const [productPage, setProductPage] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [productsLoading, setProductsLoading] = useState(false);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState('');
  const [productSaving, setProductSaving] = useState(false);
  const [productMessage, setProductMessage] = useState('');
  const [deletingProductId, setDeletingProductId] = useState('');
  const [seeding, setSeeding] = useState(false);

  // Inquiry management state
  const [inquiries, setInquiries] = useState([]);
  const [inquiryPagination, setInquiryPagination] = useState({});
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquiryFilter, setInquiryFilter] = useState('');
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');

  const setFlash = (setter, message) => {
    // Show a temporary success/error message for 4 seconds.
    setter(message);
    window.setTimeout(() => setter(''), 4000);
  };

  const resetProductForm = () => {
    // Leave edit mode and go back to a fresh "new product" form.
    setProductForm(emptyProductForm);
    setEditingProductId('');
  };

  const loadProducts = async (authToken, page = productPage, search = productSearch) => {
    // Load products for the admin table.
    if (!authToken) return;
    setProductsLoading(true);
    try {
      const data = await fetchAdminProducts(authToken, { page, limit: 12, search: search || undefined });
      setProducts(data.products || []);
      setProductPagination(data.pagination || {});
    } catch (error) {
      setFlash(setProductMessage, error.response?.data?.message || 'Unable to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const loadInquiries = async (authToken, page = inquiryPage, status = inquiryFilter) => {
    // Load inquiries for the admin table.
    if (!authToken) return;
    setInquiriesLoading(true);
    try {
      const data = await fetchAdminInquiries(authToken, { status: status || undefined, page, limit: 15 });
      setInquiries(data.inquiries || []);
      setInquiryPagination(data.pagination || {});
    } catch (error) {
      setFlash(setInquiryMessage, error.response?.data?.message || 'Unable to load inquiries');
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    // When /admin opens, check whether browser already has a saved token.
    const savedToken = window.localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!savedToken) {
      setAuthChecking(false);
      return;
    }

    adminSession(savedToken)
      .then((data) => {
        setToken(savedToken);
        setAdmin(data.admin);
      })
      .catch(() => {
        window.localStorage.removeItem(ADMIN_TOKEN_KEY);
      })
      .finally(() => setAuthChecking(false));
  }, []);

  useEffect(() => {
    // Reload products after login or page change.
    if (!token) return;
    loadProducts(token, productPage, productSearch);
  }, [token, productPage]);

  useEffect(() => {
    // Reload inquiries after login or filter/page change.
    if (!token) return;
    loadInquiries(token, inquiryPage, inquiryFilter);
  }, [token, inquiryPage, inquiryFilter]);

  const handleLoginSubmit = async (e) => {
    // Send username/password to backend and save returned token in localStorage.
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const data = await adminLogin(loginForm);
      window.localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setToken(data.token);
      setAdmin(data.admin);
      setLoginForm({ username: '', password: '' });
      setProductPage(1);
      setInquiryPage(1);
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    // Remove saved token so admin area becomes locked again.
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
    setAdmin(null);
    resetProductForm();
    setProducts([]);
    setInquiries([]);
  };

  const handleProductSubmit = async (e) => {
    // Same form handles both "create product" and "update product".
    e.preventDefault();
    if (!token) return;

    setProductSaving(true);

    try {
      const payload = productPayloadFromForm(productForm);
      if (editingProductId) {
        await updateAdminProduct(token, editingProductId, payload);
        setFlash(setProductMessage, 'Product updated successfully');
      } else {
        await createAdminProduct(token, payload);
        setFlash(setProductMessage, 'Product created successfully');
      }

      resetProductForm();
      setProductPage(1);
      await loadProducts(token, 1, productSearch);
    } catch (error) {
      setFlash(setProductMessage, error.response?.data?.message || 'Unable to save product');
    } finally {
      setProductSaving(false);
    }
  };

  const handleEditProduct = (product) => {
    // Fill the form with selected product data so admin can edit it.
    setEditingProductId(product._id);
    setProductForm(toProductForm(product));
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    // Permanently remove one product after browser confirmation.
    if (!token) return;
    if (!window.confirm('Delete this product? This cannot be undone.')) return;

    setDeletingProductId(id);
    try {
      await deleteAdminProduct(token, id);
      setFlash(setProductMessage, 'Product deleted successfully');
      if (editingProductId === id) resetProductForm();
      await loadProducts(token, productPage, productSearch);
    } catch (error) {
      setFlash(setProductMessage, error.response?.data?.message || 'Unable to delete product');
    } finally {
      setDeletingProductId('');
    }
  };

  const handleSeedProducts = async () => {
    // Insert sample products for testing/demo if DB is empty.
    if (!token) return;
    setSeeding(true);
    try {
      const data = await seedAdminProducts(token);
      setFlash(setProductMessage, data.message || 'Sample products seeded successfully');
      await loadProducts(token, 1, productSearch);
    } catch (error) {
      setFlash(setProductMessage, error.response?.data?.message || 'Unable to seed products');
    } finally {
      setSeeding(false);
    }
  };

  const handleInquiryStatus = async (id, status) => {
    // Update inquiry status from the admin dashboard.
    if (!token) return;

    try {
      await updateAdminInquiryStatus(token, id, { status });
      setFlash(setInquiryMessage, `Inquiry marked as ${status}`);
      await loadInquiries(token, inquiryPage, inquiryFilter);
    } catch (error) {
      setFlash(setInquiryMessage, error.response?.data?.message || 'Unable to update inquiry');
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#f7f2e8] flex items-center justify-center" aria-live="polite" aria-busy="true">
        <p className="font-sans text-sm tracking-[0.3em] uppercase text-brand-coffee/60">Checking admin session...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#f5efe4] text-brand-african flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-brand-lightgold/60 shadow-xl p-8">
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-brand-gold mb-3">Sanwariyas</p>
          <h1 className="font-display text-3xl mb-2">Admin Login</h1>
          <p className="font-sans text-sm text-brand-mud mb-8">
            Use your configured admin username and password to manage products and inquiries.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
            {/* Admin login form */}
            <div>
              <label htmlFor="admin-username" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                aria-required="true"
              />
            </div>

            {loginError && (
              <p aria-live="assertive" role="alert" className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-60"
              aria-busy={loggingIn}
            >
              {loggingIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ec] text-brand-african">
      <header className="bg-brand-african text-brand-cream px-6 py-5 border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-brand-gold mb-2" aria-hidden="true">Sanwariyas</p>
            <h1 className="font-display text-3xl">Admin Panel</h1>
            <p className="font-sans text-sm text-brand-cream/70 mt-1">
              Signed in as {admin?.username || 'admin'}
            </p>
          </div>

          <nav aria-label="Admin Navigation" className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('products')}
              aria-current={activeTab === 'products' ? 'page' : undefined}
              className={`px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border transition-colors ${
                activeTab === 'products'
                  ? 'bg-brand-gold text-brand-african border-brand-gold'
                  : 'border-brand-cream/30 text-brand-cream'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              aria-current={activeTab === 'inquiries' ? 'page' : undefined}
              className={`px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border transition-colors ${
                activeTab === 'inquiries'
                  ? 'bg-brand-gold text-brand-african border-brand-gold'
                  : 'border-brand-cream/30 text-brand-cream'
              }`}
            >
              Inquiries
            </button>
            <a
              href="/"
              className="px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border border-brand-cream/30 text-brand-cream"
              aria-label="View main website"
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-sans text-xs tracking-[0.3em] uppercase border border-brand-cream/30 text-brand-cream"
              aria-label="Logout of admin panel"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="main-content">
        <section aria-label="Quick Stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Products', value: productPagination.total || products.length, tone: 'bg-brand-african text-white' },
            { label: 'Featured', value: products.filter((product) => product.isFeatured).length, tone: 'bg-brand-coffee text-white' },
            { label: 'Open Inquiries', value: inquiries.filter((item) => item.status === 'pending').length, tone: 'bg-yellow-600 text-white' },
            { label: 'Resolved', value: inquiries.filter((item) => item.status === 'resolved').length, tone: 'bg-green-700 text-white' },
          ].map((item) => (
            <div key={item.label} className={`${item.tone} p-5 shadow-sm`} role="status" aria-atomic="true">
              <p className="font-sans text-3xl mb-1">{item.value}</p>
              <p className="font-sans text-xs tracking-[0.3em] uppercase opacity-80">{item.label}</p>
            </div>
          ))}
        </section>

        {activeTab === 'products' ? (
          <section aria-label="Product Management" className="space-y-6">
            <div className="grid lg:grid-cols-[1.05fr_1.45fr] gap-6">
              <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
                {/* Left panel: create or edit product */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2" aria-hidden="true">Catalog</p>
                    <h2 className="font-display text-2xl">
                      {editingProductId ? 'Edit Product' : 'Add Product'}
                    </h2>
                  </div>
                  {editingProductId && (
                    <button
                      onClick={resetProductForm}
                      className="font-sans text-xs tracking-[0.2em] uppercase text-brand-coffee"
                      aria-label="Cancel editing and create new product"
                    >
                      New Product
                    </button>
                  )}
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      aria-label="Product name"
                      placeholder="Product name"
                      value={productForm.name}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                      required
                    />
                    <input
                      type="text"
                      aria-label="Product slug"
                      placeholder="Slug"
                      value={productForm.slug}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, slug: e.target.value }))}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      aria-label="Product category"
                      placeholder="Category"
                      value={productForm.category}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                    />
                    <input
                      type="number"
                      aria-label="Product price"
                      min="0"
                      placeholder="Price"
                      value={productForm.price}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                      required
                    />
                    <input
                      type="number"
                      aria-label="Original price"
                      min="0"
                      placeholder="Original price"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, originalPrice: e.target.value }))}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                    />
                  </div>

                  <input
                    type="url"
                    aria-label="Main image URL"
                    placeholder="Main image URL"
                    value={productForm.image}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
                    className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                    required
                  />

                  <textarea
                    rows={3}
                    aria-label="More image URLs, one per line"
                    placeholder="More image URLs, one per line"
                    value={productForm.images}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, images: e.target.value }))}
                    className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee resize-none"
                  />

                  <input
                    type="text"
                    aria-label="Short description"
                    placeholder="Short description"
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                    className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                  />

                  <textarea
                    rows={5}
                    aria-label="Full description"
                    placeholder="Full description"
                    value={productForm.description}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee resize-none"
                    required
                  />

                  <div className="grid sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      aria-label="Tags, comma separated"
                      placeholder="Tags, comma separated"
                      value={productForm.tags}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, tags: e.target.value }))}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                    />
                    <input
                      type="text"
                      aria-label="Fabric"
                      placeholder="Fabric"
                      value={productForm.fabric}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, fabric: e.target.value }))}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                    />
                    <input
                      type="text"
                      aria-label="Occasion"
                      placeholder="Occasion"
                      value={productForm.occasion}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, occasion: e.target.value }))}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      aria-label="Meta title for SEO"
                      placeholder="Meta title"
                      value={productForm.metaTitle}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                    />
                    <input
                      type="text"
                      aria-label="Meta description for SEO"
                      placeholder="Meta description"
                      value={productForm.metaDescription}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
                    />
                  </div>

                  <div className="flex flex-wrap gap-6 pt-1">
                    <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
                      <input
                        type="checkbox"
                        checked={productForm.isFeatured}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                        aria-label="Mark product as featured"
                      />
                      Featured product
                    </label>
                    <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
                      <input
                        type="checkbox"
                        checked={productForm.isAvailable}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, isAvailable: e.target.checked }))}
                        aria-label="Mark product as available on site"
                      />
                      Available on site
                    </label>
                  </div>

                  {productMessage && (
                    <p aria-live="polite" role="status" className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3">
                      {productMessage}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={productSaving}
                      aria-busy={productSaving}
                      className="bg-brand-coffee text-brand-cream px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60"
                    >
                      {productSaving ? 'Saving...' : editingProductId ? 'Update Product' : 'Create Product'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSeedProducts}
                      disabled={seeding}
                      aria-busy={seeding}
                      className="border border-brand-coffee text-brand-coffee px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60"
                    >
                      {seeding ? 'Seeding...' : 'Seed Samples'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
                {/* Right panel: product list and search */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2" aria-hidden="true">Inventory</p>
                    <h2 className="font-display text-2xl">Manage Products</h2>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="search"
                      aria-label="Search products by name, slug, or category"
                      placeholder="Search by name, slug, category"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee w-full md:w-72"
                    />
                    <button
                      onClick={() => {
                        setProductPage(1);
                        loadProducts(token, 1, productSearch);
                      }}
                      className="bg-brand-african text-brand-cream px-4 py-3 font-sans text-xs tracking-[0.2em] uppercase"
                      aria-label="Submit search"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {productsLoading ? (
                  <div className="py-16 text-center font-sans text-sm text-brand-mud/60" aria-live="polite" aria-busy="true">Loading products...</div>
                ) : products.length === 0 ? (
                  <div className="py-16 text-center font-sans text-sm text-brand-mud/60" aria-live="polite">No products found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]" aria-label="Products Table">
                      <thead className="border-b border-brand-lightgold/60">
                        <tr>
                          {['Product', 'Category', 'Price', 'Status', 'Updated', 'Actions'].map((heading) => (
                            <th
                              key={heading}
                              scope="col"
                              className="text-left py-3 pr-4 font-sans text-[10px] tracking-[0.25em] uppercase text-brand-mud/70"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-lightgold/40">
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={`Thumbnail for ${product.name}`}
                                  className="w-14 h-14 object-cover border border-brand-lightgold/50"
                                />
                                <div>
                                  <p className="font-sans text-sm text-brand-african">{product.name}</p>
                                  <p className="font-sans text-xs text-brand-mud/60">{product.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 pr-4 font-sans text-sm text-brand-mud">{product.category}</td>
                            <td className="py-4 pr-4 font-sans text-sm text-brand-mud">
                              Rs. {Number(product.price || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-4 pr-4">
                              <div className="flex flex-wrap gap-2">
                                <span className={`px-2 py-1 text-[10px] tracking-[0.2em] uppercase border ${product.isAvailable ? 'border-green-300 text-green-700 bg-green-50' : 'border-gray-300 text-gray-600 bg-gray-50'}`}>
                                  {product.isAvailable ? 'Live' : 'Hidden'}
                                </span>
                                {product.isFeatured && (
                                  <span className="px-2 py-1 text-[10px] tracking-[0.2em] uppercase border border-brand-gold/50 text-brand-coffee bg-brand-parchment">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 pr-4 font-sans text-xs text-brand-mud/70">
                              {new Date(product.updatedAt || product.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-4 pr-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  aria-label={`Edit product: ${product.name}`}
                                  className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-brand-coffee text-brand-coffee"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  disabled={deletingProductId === product._id}
                                  aria-label={`Delete product: ${product.name}`}
                                  className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-red-200 text-red-700 disabled:opacity-60"
                                >
                                  {deletingProductId === product._id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {productPagination.pages > 1 && (
                  <nav aria-label="Product pagination" className="flex flex-wrap gap-2 mt-6">
                    {Array.from({ length: productPagination.pages }, (_, index) => index + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setProductPage(pg)}
                        aria-current={pg === productPage ? 'page' : undefined}
                        aria-label={`Go to page ${pg}`}
                        className={`w-10 h-10 font-sans text-xs ${
                          pg === productPage
                            ? 'bg-brand-coffee text-brand-cream'
                            : 'border border-brand-lightgold/60 text-brand-mud'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </nav>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section aria-label="Inquiry Management" className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
            {/* Inquiry management section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2" aria-hidden="true">Customer Desk</p>
                <h2 className="font-display text-2xl">Manage Inquiries</h2>
              </div>

              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter inquiries by status">
                {['', 'pending', 'contacted', 'resolved'].map((status) => (
                  <button
                    key={status || 'all'}
                    onClick={() => {
                      setInquiryFilter(status);
                      setInquiryPage(1);
                    }}
                    aria-pressed={inquiryFilter === status}
                    aria-label={`Filter by ${status || 'All'}`}
                    className={`px-4 py-2 font-sans text-xs tracking-[0.25em] uppercase border ${
                      inquiryFilter === status
                        ? 'bg-brand-coffee text-brand-cream border-brand-coffee'
                        : 'border-brand-lightgold/60 text-brand-mud'
                    }`}
                  >
                    {status || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {inquiryMessage && (
              <p aria-live="polite" role="status" className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3 mb-4">
                {inquiryMessage}
              </p>
            )}

            {inquiriesLoading ? (
              <div className="py-16 text-center font-sans text-sm text-brand-mud/60" aria-live="polite" aria-busy="true">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
              <div className="py-16 text-center font-sans text-sm text-brand-mud/60" aria-live="polite">No inquiries found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[840px]" aria-label="Customer Inquiries Table">
                  <thead className="border-b border-brand-lightgold/60">
                    <tr>
                      {['Customer', 'Contact', 'Product', 'Message', 'Status', 'Date', 'Actions'].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="text-left py-3 pr-4 font-sans text-[10px] tracking-[0.25em] uppercase text-brand-mud/70"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-lightgold/40">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry._id}>
                        <td className="py-4 pr-4 font-sans text-sm">{inquiry.name}</td>
                        <td className="py-4 pr-4 font-sans text-xs text-brand-mud">
                          <p>{inquiry.email}</p>
                          <p className="text-brand-mud/60 mt-1">{inquiry.whatsapp}</p>
                        </td>
                        <td className="py-4 pr-4 font-sans text-xs text-brand-mud">
                          {inquiry.productName || 'General inquiry'}
                        </td>
                        <td className="py-4 pr-4 font-sans text-xs text-brand-mud max-w-[260px]">
                          <p className="max-h-16 overflow-hidden">{inquiry.message}</p>
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`inline-block font-sans text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 border rounded-full ${STATUS_COLORS[inquiry.status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="py-4 pr-4 font-sans text-xs text-brand-mud/70">
                          {new Date(inquiry.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex gap-2">
                            {inquiry.status !== 'contacted' && (
                              <button
                                onClick={() => handleInquiryStatus(inquiry._id, 'contacted')}
                                aria-label={`Mark inquiry from ${inquiry.name} as contacted`}
                                className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-blue-200 text-blue-700"
                              >
                                Contacted
                              </button>
                            )}
                            {inquiry.status !== 'resolved' && (
                              <button
                                onClick={() => handleInquiryStatus(inquiry._id, 'resolved')}
                                aria-label={`Mark inquiry from ${inquiry.name} as resolved`}
                                className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-green-200 text-green-700"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {inquiryPagination.pages > 1 && (
              <nav aria-label="Inquiries pagination" className="flex flex-wrap gap-2 mt-6">
                {Array.from({ length: inquiryPagination.pages }, (_, index) => index + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setInquiryPage(pg)}
                    aria-current={pg === inquiryPage ? 'page' : undefined}
                    aria-label={`Go to page ${pg}`}
                    className={`w-10 h-10 font-sans text-xs ${
                      pg === inquiryPage
                        ? 'bg-brand-coffee text-brand-cream'
                        : 'border border-brand-lightgold/60 text-brand-mud'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
              </nav>
            )}
          </section>
        )}
      </main>
    </div>
  );
}



