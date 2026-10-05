/**
 * KDB Treats — API client
 * Thin wrapper around the Express backend with graceful fallbacks so the
 * site still works if the server is not running.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
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