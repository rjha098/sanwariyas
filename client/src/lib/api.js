// // FILE: client/src/lib/api.js
// import axios from "axios";

// const rawApiUrl =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// const API_URL = rawApiUrl.endsWith("/api")
//   ? rawApiUrl
//   : `${rawApiUrl.replace(/\/+$/, "")}/api`;

// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 15000,
//   headers: { "Content-Type": "application/json" },
//   // withCredentials: true, // Uncomment when you add httpOnly cookie support
// });

// /** Attach admin/auth token to a request */
// const withAuth = (token) => ({
//   headers: { Authorization: `Bearer ${token}` },
// });

// // ─────────────────────────────────────────
// // AUTH
// // ─────────────────────────────────────────

// /**
//  * UNIFIED LOGIN
//  * Accepts { identifier, password } where identifier is email or phone.
//  * Returns { token, user: { id, username, email, role } }
//  */
// export const unifiedLogin = (credentials) =>
//   api.post("/auth/login", credentials).then((r) => r.data);

// // export const customerSignup = (data) =>
// //   api.post('/auth/customer/signup', data).then((r) => r.data);

// /**
//  * SESSION CHECK
//  * Called on app mount to restore an in-memory session.
//  * Returns { token, user } if session is still valid.
//  */
// // ✅ Updated checkAuthSession in api.js
// export const checkAuthSession = (token) =>
//   api
//     .get(
//       "/auth/session",
//       token ? { headers: { Authorization: `Bearer ${token}` } } : {},
//     )
//     .then((r) => r.data);

// export const verifyOTP = (data) =>
//   api.post("/auth/verify-otp", data).then((r) => r.data);

// export const customerSignup = (data) =>
//   api.post("/auth/customer/signup", data).then((r) => r.data);

// /**
//  * LOGOUT (optional backend invalidation)
//  */
// export const authLogout = (token) =>
//   api.post("/auth/logout", {}, withAuth(token)).then((r) => r.data);

// // ─────────────────────────────────────────
// // PRODUCTS — PUBLIC
// // ─────────────────────────────────────────
// export const fetchProducts = (params = {}) =>
//   api.get("/products", { params }).then((r) => r.data);

// export const fetchProductBySlug = (slug) =>
//   api.get(`/products/${slug}`).then((r) => r.data);

// export const fetchProductCategories = () =>
//   api.get("/products/categories").then((r) => r.data);

// // ─────────────────────────────────────────
// // PRODUCTS — ADMIN
// // ─────────────────────────────────────────
// export const fetchAdminProducts = (token, params = {}) =>
//   api
//     .get("/products/admin/list", { ...withAuth(token), params })
//     .then((r) => r.data);

// export const fetchAdminProductById = (token, id) =>
//   api.get(`/products/admin/${id}`, withAuth(token)).then((r) => r.data);

// export const createAdminProduct = (token, data) =>
//   api.post("/products", data, withAuth(token)).then((r) => r.data);

// export const updateAdminProduct = (token, id, data) =>
//   api.patch(`/products/${id}`, data, withAuth(token)).then((r) => r.data);

// export const deleteAdminProduct = (token, id) =>
//   api.delete(`/products/${id}`, withAuth(token)).then((r) => r.data);

// export const seedAdminProducts = (token) =>
//   api.get("/products/seed", withAuth(token)).then((r) => r.data);

// // ─────────────────────────────────────────
// // INQUIRIES — PUBLIC (guest submit only)
// // ─────────────────────────────────────────
// export const submitInquiry = (data, token) =>
//   api.post("/inquiry", data, withAuth(token)).then((r) => r.data);

// // ─────────────────────────────────────────
// // INQUIRIES — ADMIN
// // ─────────────────────────────────────────
// export const fetchAdminInquiries = (token, params = {}) =>
//   api.get("/inquiry", { ...withAuth(token), params }).then((r) => r.data);

// export const updateAdminInquiryStatus = (token, id, data) =>
//   api.patch(`/inquiry/${id}/status`, data, withAuth(token)).then((r) => r.data);

// // ─────────────────────────────────────────
// // LOOKBOOK
// // ─────────────────────────────────────────
// export const fetchLookbook = () => api.get("/lookbook").then((r) => r.data);

// export const createLookbookItem = (token, formData) =>
//   api
//     .post("/lookbook", formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },
//     })
//     .then((r) => r.data);

// export const deleteLookbookItem = (token, id) =>
//   api.delete(`/lookbook/${id}`, withAuth(token)).then((r) => r.data);

// // ─────────────────────────────────────────
// // NOTIFICATIONS
// // ─────────────────────────────────────────
// export const fetchUnreadCount = (token) =>
//   api.get("/notification/unread-count", withAuth(token)).then((r) => r.data);

// export const fetchNotifications = (token) =>
//   api.get("/notification", withAuth(token)).then((r) => r.data);

// export const markNotificationsRead = (token) =>
//   api.patch("/notification/mark-read", {}, withAuth(token)).then((r) => r.data);

// export const deleteNotifications = (token) =>
//   api.delete("/notification/clear", withAuth(token)).then((r) => r.data);

// export const clearReadNotifications = (token) =>
//   api.delete("/notification/clear-read", withAuth(token)).then((r) => r.data);

// // blog


// // Blogs - Public
// export const fetchBlogs = (params = {}) =>
//   api.get("/blogs", { params }).then((r) => r.data);

// export const fetchBlogBySlug = (slug) =>
//   api.get(`/blogs/${slug}`).then((r) => r.data);

// // Blog Categories
// export const fetchBlogCategories = () =>
//   api.get("/blogs/categories").then((r) => r.data);

// export const createBlogCategory = (token, data) =>
//   api.post("/blogs/categories", data, withAuth(token)).then((r) => r.data);

// export const createBlog = (token, formData) =>
//   api
//     .post("/blogs", formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },
//     })
//     .then((r) => r.data);

// export default api;


// this  is  the  old  working  code in upper  side   in downside  ot  implemented  to  fix  the  login  problem  of   down  side      fixed  prob



// FILE: client/src/lib/api.js
import axios from "axios";
import { tokenStorage } from "./tokenStorage"; // Added to clear token on expiry

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const API_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true, // Uncomment when you add httpOnly cookie support
});

// ═══════════════════════════════════════════════════════════════════════════
// ENTERPRISE GLOBAL INTERCEPTOR (Auto-Logout on Token Expiry)
// ═══════════════════════════════════════════════════════════════════════════
api.interceptors.response.use(
  (response) => {
    // Pass successful responses through seamlessly
    return response;
  },
  (error) => {
    // If the error is 401 Unauthorized (invalid or expired token)
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // 1. Clear the invalid token from local storage
        tokenStorage.clear();
        
        // 2. Redirect to login page if the user is not already there
        if (window.location.pathname !== "/login") {
          // Pass a query parameter so the login page knows the session expired
          window.location.href = "/login?session_expired=true";
        }
      }
    }
    return Promise.reject(error);
  }
);

/** Attach admin/auth token to a request */
const withAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────

/**
 * UNIFIED LOGIN
 * Accepts { identifier, password } where identifier is email or phone.
 * Returns { token, user: { id, username, email, role } }
 */
export const unifiedLogin = (credentials) =>
  api.post("/auth/login", credentials).then((r) => r.data);

// export const customerSignup = (data) =>
//   api.post('/auth/customer/signup', data).then((r) => r.data);

/**
 * SESSION CHECK
 * Called on app mount to restore an in-memory session.
 * Returns { token, user } if session is still valid.
 */
// ✅ Updated checkAuthSession in api.js
export const checkAuthSession = (token) =>
  api
    .get(
      "/auth/session",
      token ? { headers: { Authorization: `Bearer ${token}` } } : {},
    )
    .then((r) => r.data);

export const verifyOTP = (data) =>
  api.post("/auth/verify-otp", data).then((r) => r.data);

export const customerSignup = (data) =>
  api.post("/auth/customer/signup", data).then((r) => r.data);

/**
 * LOGOUT (optional backend invalidation)
 */
export const authLogout = (token) =>
  api.post("/auth/logout", {}, withAuth(token)).then((r) => r.data);

// ─────────────────────────────────────────
// PRODUCTS — PUBLIC
// ─────────────────────────────────────────
export const fetchProducts = (params = {}) =>
  api.get("/products", { params }).then((r) => r.data);

export const fetchProductBySlug = (slug) =>
  api.get(`/products/${slug}`).then((r) => r.data);

export const fetchProductCategories = () =>
  api.get("/products/categories").then((r) => r.data);

// ─────────────────────────────────────────
// PRODUCTS — ADMIN
// ─────────────────────────────────────────
export const fetchAdminProducts = (token, params = {}) =>
  api
    .get("/products/admin/list", { ...withAuth(token), params })
    .then((r) => r.data);

export const fetchAdminProductById = (token, id) =>
  api.get(`/products/admin/${id}`, withAuth(token)).then((r) => r.data);

export const createAdminProduct = (token, data) =>
  api.post("/products", data, withAuth(token)).then((r) => r.data);

export const updateAdminProduct = (token, id, data) =>
  api.patch(`/products/${id}`, data, withAuth(token)).then((r) => r.data);

export const deleteAdminProduct = (token, id) =>
  api.delete(`/products/${id}`, withAuth(token)).then((r) => r.data);

export const seedAdminProducts = (token) =>
  api.get("/products/seed", withAuth(token)).then((r) => r.data);

// ─────────────────────────────────────────
// INQUIRIES — PUBLIC (guest submit only)
// ─────────────────────────────────────────
export const submitInquiry = (data, token) =>
  api.post("/inquiry", data, withAuth(token)).then((r) => r.data);

// ─────────────────────────────────────────
// INQUIRIES — ADMIN
// ─────────────────────────────────────────
export const fetchAdminInquiries = (token, params = {}) =>
  api.get("/inquiry", { ...withAuth(token), params }).then((r) => r.data);

export const updateAdminInquiryStatus = (token, id, data) =>
  api.patch(`/inquiry/${id}/status`, data, withAuth(token)).then((r) => r.data);

// ─────────────────────────────────────────
// LOOKBOOK
// ─────────────────────────────────────────
export const fetchLookbook = () => api.get("/lookbook").then((r) => r.data);

export const createLookbookItem = (token, formData) =>
  api
    .post("/lookbook", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((r) => r.data);

export const deleteLookbookItem = (token, id) =>
  api.delete(`/lookbook/${id}`, withAuth(token)).then((r) => r.data);

// ─────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────
export const fetchUnreadCount = (token) =>
  api.get("/notification/unread-count", withAuth(token)).then((r) => r.data);

export const fetchNotifications = (token) =>
  api.get("/notification", withAuth(token)).then((r) => r.data);

export const markNotificationsRead = (token) =>
  api.patch("/notification/mark-read", {}, withAuth(token)).then((r) => r.data);

export const deleteNotifications = (token) =>
  api.delete("/notification/clear", withAuth(token)).then((r) => r.data);

export const clearReadNotifications = (token) =>
  api.delete("/notification/clear-read", withAuth(token)).then((r) => r.data);

// blog


// Blogs - Public
export const fetchBlogs = (params = {}) =>
  api.get("/blogs", { params }).then((r) => r.data);

export const fetchBlogBySlug = (slug) =>
  api.get(`/blogs/${slug}`).then((r) => r.data);

// Blog Categories
export const fetchBlogCategories = () =>
  api.get("/blogs/categories").then((r) => r.data);

export const createBlogCategory = (token, data) =>
  api.post("/blogs/categories", data, withAuth(token)).then((r) => r.data);

export const createBlog = (token, formData) =>
  api
    .post("/blogs", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((r) => r.data);

export default api;