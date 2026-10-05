/**
 * Admin session token storage.
 * The token returned by POST /api/admin/login lives in sessionStorage so it
 * survives client-side navigation but is dropped when the tab closes.
 */

export const ADMIN_TOKEN_KEY = 'kdb_admin_token';

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}