import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { menuItems as fallbackItems, categories as fallbackCategories } from '../data/menu';

/**
 * Live menu data with graceful degradation.
 *
 * Fetches from the backend so admin edits (add/remove items, prices,
 * availability) appear on the storefront. Falls back to the bundled seed
 * data when the API is unreachable, and caches results for 60s so the
 * menu/filters/home components don't hammer the server on every mount.
 */
const CACHE_TTL = 60_000;
let cached = null; // { data, at }
let inflight = null;

function loadMenu() {
  if (cached && Date.now() - cached.at < CACHE_TTL) return Promise.resolve(cached.data);

  if (!inflight) {
    inflight = api
      .getMenu()
      .then((data) => {
        cached = { data, at: Date.now() };
        inflight = null;
        return data;
      })
      .catch((err) => {
        inflight = null;
        console.warn('[menu] API unavailable — using bundled menu data.', err?.message ?? err);
        return null;
      });
  }
  return inflight;
}

export function useMenu() {
  const [menu, setMenu] = useState(() => ({
    items: fallbackItems,
    categories: fallbackCategories,
    fromApi: false,
  }));

  useEffect(() => {
    let active = true;
    loadMenu().then((data) => {
      if (!active) return;
      if (data) {
        setMenu({ items: data.items, categories: data.categories, fromApi: true });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return menu;
}