import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { formatPrice } from '../../data/menu';

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
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { stats: data } = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !stats) {
    return <div className="admin-loading">Loading dashboard…</div>;
  }

  if (error && !stats) {
    return (
      <div className="admin-error">
        <p>Could not load dashboard: {error}</p>
        <button className="btn btn--outline" onClick={load}>Retry</button>
      </div>
    );
  }

  const maxDayRevenue = Math.max(1, ...(stats?.dailySales ?? []).map((d) => d.revenue));
  const maxQuantity = Math.max(1, ...(stats?.popularItems ?? []).map((p) => p.quantity));

  const cards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: '💰', accent: 'gold' },
    { label: "Today's Revenue", value: formatPrice(stats.todayRevenue), icon: '📈', accent: 'green' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '🧾', accent: 'cream' },
    { label: 'Orders Today', value: stats.todayOrders, icon: '🛍️', accent: 'cream' },
    { label: 'Pending Orders', value: stats.statusBreakdown.pending, icon: '⏳', accent: 'rust' },
    { label: 'Menu Items', value: stats.menuItemCount, icon: '🍢', accent: 'cream' },
    { label: 'Categories', value: stats.categoryCount, icon: '🗂️', accent: 'cream' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: '📬', accent: 'rust' },
  ];

  const statusEntries = Object.entries(stats.statusBreakdown ?? {});

  return (
    <div className="admin-dashboard">
      <div className="admin-toolbar">
        <p className="admin-toolbar__note">Overview of your store. Data refreshes on every visit.</p>
        <button className="btn btn--outline" onClick={load}>Refresh</button>
      </div>

      {/* Stat cards */}
      <div className="admin-cards">
        {cards.map((card) => (
          <div key={card.label} className={`admin-card admin-card--${card.accent}`}>
            <span className="admin-card__icon">{card.icon}</span>
            <div className="admin-card__value">{card.value}</div>
            <div className="admin-card__label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        {/* Last 7 days revenue */}
        <section className="admin-panel">
          <h2 className="admin-panel__title">Sales — last 7 days</h2>
          <div className="admin-bars">
            {stats.dailySales.map((day) => (
              <div key={day.date} className="admin-bars__col">
                <div className="admin-bars__track">
                  <div
                    className="admin-bars__fill"
                    style={{ height: `${Math.max(4, Math.round((day.revenue / maxDayRevenue) * 100))}%` }}
                    title={`${formatPrice(day.revenue)} · ${day.orders} order(s)`}
                  />
                </div>
                <span className="admin-bars__label">{new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <span className="admin-bars__value">{formatPrice(day.revenue)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Best sellers */}
        <section className="admin-panel">
          <h2 className="admin-panel__title">Best sellers</h2>
          {stats.popularItems.length === 0 && <p className="admin-empty">No orders yet.</p>}
          <ul className="admin-list">
            {stats.popularItems.map((item) => (
              <li key={item.name} className="admin-list__row">
                <span className="admin-list__name">{item.name}</span>
                <div className="admin-list__meta">
                  <span className="admin-list__bar">
                    <span style={{ width: `${Math.round((item.quantity / maxQuantity) * 100)}%` }} />
                  </span>
                  <span className="admin-list__num">×{item.quantity}</span>
                  <span className="admin-list__num">{formatPrice(item.revenue)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="admin-grid-2">
        {/* Status breakdown */}
        <section className="admin-panel">
          <h2 className="admin-panel__title">Orders by status</h2>
          <div className="admin-status-chips">
            {statusEntries.map(([status, count]) => (
              <div key={status} className={`admin-chip admin-chip--${status}`}>
                <span className="admin-chip__dot" />
                <span className="admin-chip__label">{STATUS_LABELS[status] ?? status}</span>
                <span className="admin-chip__count">{count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent orders */}
        <section className="admin-panel">
          <h2 className="admin-panel__title">Recent orders</h2>
          {stats.recentOrders.length === 0 && <p className="admin-empty">No orders yet.</p>}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.customerName}</td>
                    <td>{formatPrice(o.totalPrice)}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${o.status}`}>
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </td>
                    <td>{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/admin/orders" className="admin-panel__link">View all orders →</Link>
        </section>
      </div>
    </div>
  );
}