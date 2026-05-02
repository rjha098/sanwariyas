import axios from 'axios';

// This is the backend base URL used by the frontend.
// Local example: http://localhost:5000/api
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Normalize the configured backend URL so requests always hit the Express /api routes.
const API_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Helper for all admin-only requests.
// It attaches the saved admin token in the Authorization header.
const withAdminAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Products
// Public product listing used by homepage/products page.
export const fetchProducts = (params = {}) =>
  api.get('/products', { params }).then((r) => r.data);

// Public single-product fetch by slug.
export const fetchProductBySlug = (slug) =>
  api.get(`/products/${slug}`).then((r) => r.data);

export const fetchCategories = () =>
  api.get('/products/categories').then((r) => r.data);

// Sample-product seeding helper.
export const seedProducts = () =>
  api.get('/products/seed').then((r) => r.data);

// Inquiries
// Public inquiry form submit.
export const submitInquiry = (data) =>
  api.post('/inquiry', data).then((r) => r.data);

export const fetchInquiries = (params = {}) =>
  api.get('/inquiry', { params }).then((r) => r.data);

export const updateInquiryStatus = (id, data) =>
  api.patch(`/inquiry/${id}/status`, data).then((r) => r.data);

// Admin login: username/password -> token
export const adminLogin = (credentials) =>
  api.post('/admin/login', credentials).then((r) => r.data);

// Check whether a saved admin token is still valid.
export const adminSession = (token) =>
  api.get('/admin/session', withAdminAuth(token)).then((r) => r.data);

// Product dashboard APIs
export const fetchAdminProducts = (token, params = {}) =>
  api.get('/products/admin/list', { ...withAdminAuth(token), params }).then((r) => r.data);

export const fetchAdminProductById = (token, id) =>
  api.get(`/products/admin/${id}`, withAdminAuth(token)).then((r) => r.data);

export const createAdminProduct = (token, data) =>
  api.post('/products', data, withAdminAuth(token)).then((r) => r.data);

export const updateAdminProduct = (token, id, data) =>
  api.patch(`/products/${id}`, data, withAdminAuth(token)).then((r) => r.data);

export const deleteAdminProduct = (token, id) =>
  api.delete(`/products/${id}`, withAdminAuth(token)).then((r) => r.data);

// Inquiry dashboard APIs
export const fetchAdminInquiries = (token, params = {}) =>
  api.get('/inquiry', { ...withAdminAuth(token), params }).then((r) => r.data);

export const updateAdminInquiryStatus = (token, id, data) =>
  api.patch(`/inquiry/${id}/status`, data, withAdminAuth(token)).then((r) => r.data);

export const seedAdminProducts = (token) =>
  api.get('/products/seed', withAdminAuth(token)).then((r) => r.data);

export default api;
