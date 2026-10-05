import { useEffect, useState, useCallback } from 'react';
import { api } from '../../utils/api';
import { formatPrice } from '../../data/menu';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
  spiceLevel: 0,
  isAvailable: true,
  isFeatured: false,
};

function ItemForm({ initial, categories, saving, onCancel, onSubmit }) {
  const [form, setForm] = useState(initial);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      id: initial.id,
      price: Number(form.price),
      spiceLevel: Number(form.spiceLevel),
      description: form.description,
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form__grid">
        <label className="admin-form__field admin-form__field--full">
          <span className="admin-form__label">Name *</span>
          <input className="admin-form__input" value={form.name} onChange={set('name')} required />
        </label>

        <label className="admin-form__field admin-form__field--full">
          <span className="admin-form__label">Description</span>
          <textarea className="admin-form__input" rows="3" value={form.description} onChange={set('description')} />
        </label>

        <label className="admin-form__field">
          <span className="admin-form__label">Category *</span>
          <select className="admin-form__input" value={form.category} onChange={set('category')} required>
            <option value="">— choose a category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
        </label>

        <label className="admin-form__field">
          <span className="admin-form__label">Price (₦) *</span>
          <input
            className="admin-form__input"
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={set('price')}
            required
          />
        </label>

        <label className="admin-form__field admin-form__field--full">
          <span className="admin-form__label">Image URL</span>
          <input className="admin-form__input" value={form.image} onChange={set('image')} placeholder="/images/puff-puff.jpg" />
        </label>

        <label className="admin-form__field">
          <span className="admin-form__label">Spice level (0–5)</span>
          <select className="admin-form__input" value={form.spiceLevel} onChange={set('spiceLevel')}>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} {'🌶️'.repeat(n) || '— mild'}</option>
            ))}
          </select>
        </label>

        <div className="admin-form__checks admin-form__field--full">
          <label className="admin-form__check">
            <input type="checkbox" checked={form.isAvailable} onChange={set('isAvailable')} />
            Available
          </label>
          <label className="admin-form__check">
            <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} />
            Featured
          </label>
        </div>
      </div>

      <div className="admin-form__actions">
        <button type="button" className="btn btn--outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : initial.id ? 'Save changes' : 'Add item'}
        </button>
      </div>
    </form>
  );
}

export default function MenuAdminPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', item }
  const [saving, setSaving] = useState(false);

  const showNotice = (text, type = 'ok') => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [menu, cats] = await Promise.all([api.getMenu(), api.getCategories()]);
      setItems(menu.items);
      setCategories(cats.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const query = search.trim().toLowerCase();
  const filteredItems = query
    ? items.filter(
        (i) => i.name.toLowerCase().includes(query)
          || i.description.toLowerCase().includes(query)
          || i.category.toLowerCase().includes(query),
      )
    : items;

  const toggleAvailability = async (item) => {
    try {
      await api.updateMenuItem(item.id, { ...item, isAvailable: !item.isAvailable });
      showNotice(`"${item.name}" is now ${!item.isAvailable ? 'available' : 'unavailable'}`);
      load();
    } catch (e) { showNotice(e.message, 'err'); }
  };

  const toggleFeatured = async (item) => {
    try {
      await api.updateMenuItem(item.id, { ...item, isFeatured: !item.isFeatured });
      showNotice(`"${item.name}" ${item.isFeatured ? 'removed from' : 'added to'} featured`);
      load();
    } catch (e) { showNotice(e.message, 'err'); }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}" from the menu? This cannot be undone.`)) return;
    try {
      await api.deleteMenuItem(item.id);
      showNotice(`Deleted "${item.name}"`);
      load();
    } catch (e) { showNotice(e.message, 'err'); }
  };

  const handleSave = async (payload, mode) => {
    setSaving(true);
    try {
      if (mode === 'create') {
        await api.createMenuItem(payload);
        showNotice(`Added "${payload.name}" to the menu`);
      } else {
        await api.updateMenuItem(payload.id, payload);
        showNotice(`Saved "${payload.name}"`);
      }
      setModal(null);
      load();
    } catch (e) {
      showNotice(e.message, 'err');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-menu-page">
      {notice && (
        <div className={`admin-notice admin-notice--${notice.type}`} role="status">
          {notice.text}
        </div>
      )}

      {error && (
        <div className="admin-error">
          <p>Could not load menu: {error}</p>
          <button className="btn btn--outline" onClick={load}>Retry</button>
        </div>
      )}

      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Search items by name, description or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn--primary" onClick={() => setModal({ mode: 'create' })}>
          + Add item
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading menu…</div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Spice</th>
                  <th>Available</th>
                  <th>Featured</th>
                  <th className="admin-table__actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-item-cell">
                        {item.image
                          ? <img className="admin-item-cell__img" src={item.image} alt={item.name} />
                          : <span className="admin-item-cell__img admin-item-cell__img--placeholder">🍽️</span>}
                        <div>
                          <div className="admin-item-cell__name">{item.name}</div>
                          <div className="admin-item-cell__desc">{item.description || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{item.spiceLevel > 0 ? '🌶️'.repeat(item.spiceLevel) : '—'}</td>
                    <td>
                      <button
                        className={`admin-toggle ${item.isAvailable ? 'is-on' : 'is-off'}`}
                        onClick={() => toggleAvailability(item)}
                        title="Toggle availability"
                      >
                        {item.isAvailable ? '✓ On' : '✕ Off'}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`admin-toggle ${item.isFeatured ? 'is-on' : 'is-off'}`}
                        onClick={() => toggleFeatured(item)}
                        title="Toggle featured"
                      >
                        {item.isFeatured ? '★ Yes' : '☆ No'}
                      </button>
                    </td>
                    <td className="admin-table__actions">
                      <button
                        className="admin-btn-icon"
                        title="Edit"
                        onClick={() => setModal({ mode: 'edit', item })}
                      >
                        ✏️
                      </button>
                      <button
                        className="admin-btn-icon admin-btn-icon--danger"
                        title="Delete"
                        onClick={() => handleDeleteItem(item)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan="7" className="admin-empty">No items match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <CategoryManager categories={categories} showNotice={showNotice} load={load} />
        </>
      )}

      {modal && (
        <div className="admin-modal__overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{modal.mode === 'edit' ? `Edit "${modal.item.name}"` : 'Add a new menu item'}</h2>
              <button className="admin-modal__close" onClick={() => setModal(null)} aria-label="Close">✕</button>
            </div>
            <ItemForm
              initial={modal.mode === 'edit' ? { ...EMPTY_FORM, ...modal.item } : EMPTY_FORM}
              categories={categories}
              saving={saving}
              onCancel={() => setModal(null)}
              onSubmit={(payload) => handleSave(payload, modal.mode)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryManager({ categories, showNotice, load }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState({ name: '', icon: '', sortOrder: '' });
  const [busy, setBusy] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.createCategory({ name, icon, sortOrder: Number(sortOrder) || 0 });
      showNotice(`Added category "${name}"`);
      setName(''); setIcon(''); setSortOrder('');
      load();
    } catch (err) {
      showNotice(err.message, 'err');
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = async (cat) => {
    setBusy(true);
    try {
      await api.updateCategory(cat.id, editing);
      showNotice(`Saved category "${editing.name}"`);
      setEditingId(null);
      load();
    } catch (err) {
      showNotice(err.message, 'err');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? Only empty categories can be deleted.`)) return;
    setBusy(true);
    try {
      await api.deleteCategory(cat.id);
      showNotice(`Deleted category "${cat.name}"`);
      load();
    } catch (err) {
      showNotice(err.message, 'err');
    } finally {
      setBusy(false);
    }
  };

  const sorted = [...categories]
    .filter((c) => c.id !== 'all')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="admin-panel admin-panel--categories">
      <h2 className="admin-panel__title">Categories</h2>

      {sorted.length === 0 && <p className="admin-empty">No categories yet.</p>}

      <div className="admin-categories">
        {sorted.map((cat) => (
          <div key={cat.id} className="admin-category">
            {editingId === cat.id ? (
              <div className="admin-category__edit">
                <input
                  className="admin-form__input"
                  value={editing.name}
                  onChange={(e) => setEditing((ed) => ({ ...ed, name: e.target.value }))}
                  placeholder="Name"
                />
                <input
                  className="admin-form__input admin-category__icon-input"
                  value={editing.icon}
                  onChange={(e) => setEditing((ed) => ({ ...ed, icon: e.target.value }))}
                  placeholder="Icon"
                  maxLength="4"
                />
                <input
                  className="admin-form__input admin-category__order-input"
                  type="number"
                  value={editing.sortOrder}
                  onChange={(e) => setEditing((ed) => ({ ...ed, sortOrder: e.target.value }))}
                  placeholder="Order"
                />
                <button className="admin-btn-icon" title="Save" disabled={busy} onClick={() => handleEdit(cat)}>💾</button>
                <button className="admin-btn-icon" title="Cancel" onClick={() => setEditingId(null)}>✕</button>
              </div>
            ) : (
              <>
                <span className="admin-category__icon">{cat.icon}</span>
                <span className="admin-category__name">{cat.name}</span>
                <span className="admin-category__slug">{cat.slug}</span>
                <div className="admin-category__actions">
                  <button
                    className="admin-btn-icon"
                    title="Edit"
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditing({ name: cat.name, icon: cat.icon ?? '', sortOrder: String(cat.sortOrder) });
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="admin-btn-icon admin-btn-icon--danger"
                    title="Delete"
                    onClick={() => handleDelete(cat)}
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <form className="admin-form admin-form--row" onSubmit={handleAdd}>
        <input
          className="admin-form__input"
          placeholder="New category name (e.g. Desserts)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="admin-form__input admin-category__icon-input"
          placeholder="Icon"
          maxLength="4"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
        <input
          className="admin-form__input admin-category__order-input"
          type="number"
          placeholder="Order"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
        <button className="btn btn--primary" disabled={busy}>Add category</button>
      </form>
    </section>
  );
}