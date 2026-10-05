import { useEffect, useState, useCallback } from 'react';
import { api } from '../../utils/api';
import { formatPrice } from '../../data/menu';

const STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [expanded, setExpanded] = useState(null); // order id
  const [detail, setDetail] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const showNotice = (text, type = 'ok') => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { orders: data } = await api.getOrders(filter === 'all' ? {} : { status: filter });
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const loadDetail = async (id) => {
    if (expanded === id) {
      setExpanded(null);
      setDetail(null);
      return;
    }
    setExpanded(id);
    setDetail(null);
    try {
      const { order } = await api.getOrder(id);
      setDetail(order);
    } catch (err) {
      setDetail({ error: err.message });
    }
  };

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await api.updateOrderStatus(id, status);
      showNotice(`Order #${id} marked as ${STATUS_LABELS[status] ?? status}`);
      load();
      if (detail && detail.id === id) {
        const { order } = await api.getOrder(id);
        setDetail(order);
      }
    } catch (e) {
      showNotice(e.message, 'err');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete order #${order.id} from ${order.customerName}? This cannot be undone.`)) return;
    setBusyId(order.id);
    try {
      await api.deleteOrder(order.id);
      showNotice(`Deleted order #${order.id}`);
      setExpanded(null);
      setDetail(null);
      load();
    } catch (e) {
      showNotice(e.message, 'err');
    } finally {
      setBusyId(null);
    }
  };

  const totals = orders.reduce(
    (acc, o) => ({ count: acc.count + 1, revenue: acc.revenue + o.totalPrice }),
    { count: 0, revenue: 0 },
  );

  return (
    <div className="admin-orders-page">
      {notice && (
        <div className={`admin-notice admin-notice--${notice.type}`} role="status">{notice.text}</div>
      )}

      <div className="admin-toolbar">
        <div className="admin-filter">
          <button
            className={`admin-filter__btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`admin-filter__btn ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="admin-toolbar__stats">
          <span>{totals.count} order(s)</span>
          <span className="admin-toolbar__revenue">Total: {formatPrice(totals.revenue)}</span>
        </div>
      </div>

      {error && (
        <div className="admin-error">
          <p>Could not load orders: {error}</p>
          <button className="btn btn--outline" onClick={load}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">No orders {filter !== 'all' ? `with status "${STATUS_LABELS[filter]}"` : ''} yet.</div>
      ) : (
        <div className="admin-order-list">
          {orders.map((order) => (
            <div key={order.id} className="admin-order">
              <div className="admin-order__row">
                <button className="admin-order__main" onClick={() => loadDetail(order.id)} aria-expanded={expanded === order.id}>
                  <span className="admin-order__id">#{order.id}</span>
                  <span className="admin-order__customer">{order.customerName}</span>
                  <span className="admin-order__phone">{order.customerPhone && `📞 ${order.customerPhone}`}</span>
                  <span className="admin-order__date">{formatDate(order.createdAt)}</span>
                  <span className="admin-order__total">{formatPrice(order.totalPrice)}</span>
                  <span className={`admin-badge admin-badge--${order.status}`}>{STATUS_LABELS[order.status] ?? order.status}</span>
                  <span className="admin-order__chevron">{expanded === order.id ? '▲' : '▼'}</span>
                </button>

                <div className="admin-order__actions">
                  <select
                    className="admin-select"
                    value={order.status}
                    disabled={busyId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <button
                    className="admin-btn-icon admin-btn-icon--danger"
                    title="Delete order"
                    disabled={busyId === order.id}
                    onClick={() => handleDelete(order)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {expanded === order.id && (
                <div className="admin-order__detail">
                  {!detail ? (
                    <div className="admin-loading">Loading details…</div>
                  ) : detail.error ? (
                    <p className="admin-empty">{detail.error}</p>
                  ) : (
                    <div className="admin-order__detail-grid">
                      <div className="admin-order__detail-block">
                        <h4>Customer</h4>
                        <p>{detail.customerName}</p>
                        <p>📞 {detail.customerPhone || '—'}</p>
                        <p>✉️ {detail.customerEmail || '—'}</p>
                        <p>📍 {detail.customerAddress}</p>
                        {detail.customerNote && <p className="admin-order__note">“{detail.customerNote}”</p>}
                      </div>
                      <div className="admin-order__detail-block">
                        <h4>Items</h4>
                        {detail.items.map((item, idx) => (
                          <div key={idx} className="admin-order__line">
                            <span>{item.name}</span>
                            <span>×{item.quantity}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <div className="admin-order__line admin-order__line--total">
                          <span>Total</span>
                          <span>{formatPrice(detail.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}