// // FILE: client/src/lib/api.js
import axios from "axios";
import { tokenStorage } from "./tokenStorage";

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const API_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

const isTokenLocallyExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false; // no exp claim — let the server decide
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // unparseable token — treat as expired/invalid
  }
};

api.interceptors.request.use((config) => {
  if (config.url === "/auth/session" || config.url === "/auth/heartbeat") {
    const token = config.headers.Authorization?.split(" ")[1];
    if (token && isTokenLocallyExpired(token)) {
      return Promise.reject({
        isLocalPreflightReject: true,
        response: { status: 401 },
      });
    }
  }
  return config;
});

//  ENTERPRISE FIX: Global Request Queue for Rate Limits
let isRateLimitPaused = false;
let failedQueue = [];

//  ENTERPRISE FIX: Redirect Lock to prevent Race Condition UI stutter
let isRedirecting = false;

const processQueue = (error, config = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(api(prom.config));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (error.isLocalPreflightReject) {
      if (typeof window !== "undefined") {
        tokenStorage.clear();
        localStorage.removeItem("sanwariyas_user");
        if (window.location.pathname !== "/login" && !isRedirecting) {
          isRedirecting = true;
          window.location.href = `/login?session_expired=true&reason=Session+Expired`;
        }
      }
      return Promise.reject(error);
    }

    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      error.isTimeout = true;
      error.userMessage =
        "Server is taking too long to respond. Please try again.";
    }

    // Global Retry Queue for 429
    if (response && response.status === 429) {
      if (isRateLimitPaused) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config });
        });
      }

      config._retryCount = config._retryCount || 0;

      if (config._retryCount < 2) {
        isRateLimitPaused = true;
        config._retryCount += 1;

        const retryAfter = response.headers["retry-after"];
        const jitter = Math.floor(Math.random() * 500);
        const waitTime = retryAfter
          ? parseInt(retryAfter, 10) * 1000 + jitter
          : 2000 * Math.pow(2, config._retryCount) + jitter;

        await new Promise((resolve) => setTimeout(resolve, waitTime));

        isRateLimitPaused = false;
        processQueue(null);
        return api(config);
      }
    }

    if (response && response.status === 401) {
      if (typeof window !== "undefined") {
        tokenStorage.clear();
        localStorage.removeItem("sanwariyas_user");

        if (window.location.pathname !== "/login" && !isRedirecting) {
          isRedirecting = true;
          const backendMessage =
            response.data?.message ||
            "Your session has expired. Please log in again.";
          const encodedReason = encodeURIComponent(backendMessage);

          window.location.href = `/login?session_expired=true&reason=${encodedReason}`;
        }
      }
    }

    return Promise.reject(error);
  },
);

const withAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ─────────────────────────────────────────
// AUTH & EXPORTS
// ─────────────────────────────────────────
export const unifiedLogin = (credentials) =>
  api.post("/auth/login", credentials).then((r) => r.data);
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
export const authLogout = (token) =>
  api.post("/auth/logout", {}, withAuth(token)).then((r) => r.data);

// PRODUCTS
export const fetchProducts = (params = {}) =>
  api.get("/products", { params }).then((r) => r.data);
export const fetchProductBySlug = (slug) =>
  api.get(`/products/${slug}`).then((r) => r.data);
export const fetchProductCategories = () =>
  api.get("/products/categories").then((r) => r.data);
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

// INQUIRIES
export const submitInquiry = (data, token) =>
  api.post("/inquiry", data, withAuth(token)).then((r) => r.data);
export const fetchAdminInquiries = (token, params = {}) =>
  api.get("/inquiry", { ...withAuth(token), params }).then((r) => r.data);
export const updateAdminInquiryStatus = (token, id, data) =>
  api.patch(`/inquiry/${id}/status`, data, withAuth(token)).then((r) => r.data);

// LOOKBOOK
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

// NOTIFICATIONS
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
export const deleteNotificationByInquiry = (token, inquiryId) =>
  api
    .delete(`/notification/by-inquiry/${inquiryId}`, withAuth(token))
    .then((r) => r.data);

// BLOGS
export const fetchBlogs = (params = {}) =>
  api.get("/blogs", { params }).then((r) => r.data);
export const fetchBlogBySlug = (slug) =>
  api.get(`/blogs/${slug}`).then((r) => r.data);
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
