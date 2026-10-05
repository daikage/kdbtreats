/**
 * KDB Treats — API client
 * Thin wrapper around the Express backend with graceful fallbacks so the
 * site still works if the server is not running.
 */

import { getAdminToken } from './auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(endpoint, options = {}) {
  // Admin endpoints require a bearer token; public endpoints ignore it.
  const token = getAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }

  return data;
}

export const api = {
  /** Fetch categories + menu items. */
  getMenu: () => request('/menu'),

  /** Fetch all categories. */
  getCategories: () => request('/categories'),

  /**
   * Admin — menu items.
   */
  createMenuItem: (payload) =>
    request('/menu', { method: 'POST', body: JSON.stringify(payload) }),
  updateMenuItem: (id, payload) =>
    request(`/menu/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteMenuItem: (id) =>
    request(`/menu/${id}`, { method: 'DELETE' }),

  /**
   * Admin — categories.
   */
  createCategory: (payload) =>
    request('/categories', { method: 'POST', body: JSON.stringify(payload) }),
  updateCategory: (id, payload) =>
    request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, { method: 'DELETE' }),

  /**
   * Admin — orders.
   */
  getOrders: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
    );
    return request(`/orders${qs.toString() ? `?${qs}` : ''}`);
  },
  getOrder: (id) => request(`/orders/${id}`),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteOrder: (id) =>
    request(`/orders/${id}`, { method: 'DELETE' }),

  /**
   * Admin — messages.
   */
  getMessages: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
    );
    return request(`/messages${qs.toString() ? `?${qs}` : ''}`);
  },
  markMessageRead: (id, isRead) =>
    request(`/messages/${id}/read`, { method: 'PATCH', body: JSON.stringify({ isRead }) }),
  deleteMessage: (id) =>
    request(`/messages/${id}`, { method: 'DELETE' }),

  /**
   * Admin — authenticate with the passcode. Returns { token }.
   */
  adminLogin: (passcode) =>
    request('/admin/login', { method: 'POST', body: JSON.stringify({ passcode }) }),

  /**
   * Admin — dashboard stats.
   */
  getAdminStats: () => request('/admin/stats'),

  /** Submit a contact form message. */
  sendMessage: (payload) =>
    request('/messages', { method: 'POST', body: JSON.stringify(payload) }),

  /**
   * Submit an order.
   * @param {object} payload customer details + { items: [{ itemId, quantity }] }
   */
  createOrder: (payload) =>
    request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
};

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '2348000000000';