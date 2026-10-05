import { Router } from 'express';
import db, { getCategories, getMenuItems } from '../db.js';

const router = Router();

/** GET /api/menu — categories + items (supports ?category= and ?featured=) */
router.get('/menu', (req, res) => {
  const { category, featured } = req.query;
  let items = getMenuItems();

  if (category && category !== 'all') {
    items = items.filter((i) => i.category === category);
  }
  if (featured === 'true') {
    items = items.filter((i) => i.isFeatured);
  }

  res.json({ categories: getCategories(), items });
});

/** GET /api/categories */
router.get('/categories', (_req, res) => {
  res.json({ categories: getCategories() });
});

/** GET /api/menu/:id */
router.get('/menu/:id', (req, res) => {
  const row = db
    .prepare('SELECT * FROM menu_items WHERE id = ?')
    .get(Number(req.params.id));

  if (!row) return res.status(404).json({ error: 'Menu item not found' });

  res.json({
    item: {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      image: row.image,
      spiceLevel: row.spice_level,
      isAvailable: !!row.is_available,
      isFeatured: !!row.is_featured,
    },
  });
});

/** PATCH /api/menu/:id — toggle availability / featured (admin) */
router.patch('/menu/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Menu item not found' });

  const { isAvailable, isFeatured, price } = req.body ?? {};

  db.prepare(`
    UPDATE menu_items SET
      is_available = COALESCE(?, is_available),
      is_featured  = COALESCE(?, is_featured),
      price        = COALESCE(?, price)
    WHERE id = ?
  `).run(
    isAvailable === undefined ? null : isAvailable ? 1 : 0,
    isFeatured === undefined ? null : isFeatured ? 1 : 0,
    price === undefined ? null : Number(price),
    id,
  );

  const updated = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
  res.json({
    item: {
      ...updated,
      spiceLevel: updated.spice_level,
      isAvailable: !!updated.is_available,
      isFeatured: !!updated.is_featured,
    },
  });
});

export default router;