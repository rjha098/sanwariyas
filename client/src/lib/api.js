// FILE: client/src/lib/api.js
import axios from 'axios';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const API_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true, // Uncomment when you add httpOnly cookie support
});

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
  api.post('/auth/login', credentials).then((r) => r.data);

// export const customerSignup = (data) =>
//   api.post('/auth/customer/signup', data).then((r) => r.data);

/**
 * SESSION CHECK
 * Called on app mount to restore an in-memory session.
 * Returns { token, user } if session is still valid.
 */
// ✅ Updated checkAuthSession in api.js
// 1. checkAuthSession update karo:
export const checkAuthSession = (token) =>
  api.get('/auth/session', token ? { headers: { Authorization: `Bearer ${token}` } } : {})
    .then((r) => r.data);

// 2. Ye 2 functions add karo (unifiedLogin ke neeche):
export const verifyOTP = (data) =>
  api.post('/auth/verify-otp', data).then((r) => r.data);

export const customerSignup = (data) =>
  api.post('/auth/customer/signup', data).then((r) => r.data);

/**
 * LOGOUT (optional backend invalidation)
 */
export const authLogout = (token) =>
  api.post('/auth/logout', {}, withAuth(token)).then((r) => r.data);

// ─────────────────────────────────────────
// PRODUCTS — PUBLIC
// ─────────────────────────────────────────
export const fetchProducts = (params = {}) =>
  api.get('/products', { params }).then((r) => r.data);

export const fetchProductBySlug = (slug) =>
  api.get(`/products/${slug}`).then((r) => r.data);

export const fetchProductCategories = () => api.get('/products/categories').then(r => r.data);

// ─────────────────────────────────────────
// PRODUCTS — ADMIN
// ─────────────────────────────────────────
export const fetchAdminProducts = (token, params = {}) =>
  api.get('/products/admin/list', { ...withAuth(token), params }).then((r) => r.data);

export const fetchAdminProductById = (token, id) =>
  api.get(`/products/admin/${id}`, withAuth(token)).then((r) => r.data);

export const createAdminProduct = (token, data) =>
  api.post('/products', data, withAuth(token)).then((r) => r.data);

export const updateAdminProduct = (token, id, data) =>
  api.patch(`/products/${id}`, data, withAuth(token)).then((r) => r.data);

export const deleteAdminProduct = (token, id) =>
  api.delete(`/products/${id}`, withAuth(token)).then((r) => r.data);

export const seedAdminProducts = (token) =>
  api.get('/products/seed', withAuth(token)).then((r) => r.data);

// ─────────────────────────────────────────
// INQUIRIES — PUBLIC (guest submit only)
// ─────────────────────────────────────────
export const submitInquiry = (data, token) =>
  api.post('/inquiry', data, withAuth(token)).then((r) => r.data);

// ─────────────────────────────────────────
// INQUIRIES — ADMIN
// ─────────────────────────────────────────
export const fetchAdminInquiries = (token, params = {}) =>
  api.get('/inquiry', { ...withAuth(token), params }).then((r) => r.data);

export const updateAdminInquiryStatus = (token, id, data) =>
  api.patch(`/inquiry/${id}/status`, data, withAuth(token)).then((r) => r.data);

// ─────────────────────────────────────────
// LOOKBOOK
// ─────────────────────────────────────────
export const fetchLookbook = () =>
  api.get('/lookbook').then((r) => r.data);

export const createLookbookItem = (token, formData) =>
  api.post('/lookbook', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }).then((r) => r.data);

export const deleteLookbookItem = (token, id) =>
  api.delete(`/lookbook/${id}`, withAuth(token)).then((r) => r.data);


// ─────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────
export const fetchUnreadCount = (token) =>
  api.get('/notification/unread-count', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.data);

export const fetchNotifications = (token) =>
  api.get('/notification', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.data);

export const markNotificationsRead = (token) =>
  api.patch('/notification/mark-read', {}, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.data);



  export const deleteNotifications = (token) =>
  api.delete('/notification/clear', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((r) => r.data);


  export const clearReadNotifications = (token) =>
  api.delete('/notification/clear-read', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((r) => r.data);




  // blog

// Blog Categories
export const fetchBlogCategories = () => api.get('/blogs/categories').then(r => r.data);
export const createBlogCategory = (token, data) => api.post('/blogs/categories', data, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);
export const createBlog = (token, formData) => api.post('/blogs', formData, { 
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } 
}).then(r => r.data);


export default api;