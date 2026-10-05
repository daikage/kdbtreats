import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardPage from './DashboardPage';
import MenuAdminPage from './MenuAdminPage';
import OrdersAdminPage from './OrdersAdminPage';
import MessagesAdminPage from './MessagesAdminPage';
import AdminLogin from './AdminLogin';
import { api } from '../../utils/api';
import { getAdminToken, clearAdminToken } from '../../utils/auth';

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/menu': 'Menu Manager',
  '/admin/orders': 'Orders & Sales',
  '/admin/messages': 'Messages',
};

export default function AdminLayout() {
  const location = useLocation();
  const [badges, setBadges] = useState({ pending: 0, unread: 0 });
  const [authed, setAuthed] = useState(() => Boolean(getAdminToken()));
  const [checking, setChecking] = useState(() => Boolean(getAdminToken()));

  const pageTitle = TITLES[location.pathname] ?? 'Dashboard';

  // Validate an existing token on entry; a 401 clears it back to the
  // passcode screen, while a network error still lets the admin UI render
  // (the individual pages surface their own "retry" states).
  useEffect(() => {
    if (!getAdminToken()) return;
    let active = true;
    api.getAdminStats()
      .then(() => { if (active) setAuthed(true); })
      .catch((err) => {
        if (!active) return;
        if (err.status === 401) {
          clearAdminToken();
          setAuthed(false);
        } else {
          setAuthed(true);
        }
      })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  // Refresh sidebar badges whenever the admin section changes.
  useEffect(() => {
    if (!authed) return;
    let active = true;
    api.getAdminStats()
      .then(({ stats }) => {
        if (!active) return;
        setBadges({
          pending: stats.statusBreakdown.pending ?? 0,
          unread: stats.unreadMessages ?? 0,
        });
      })
      .catch(() => {});
    return () => { active = false; };
  }, [authed, location.pathname]);

  if (checking) {
    return <div className="admin-loading admin-loading--full">Checking access…</div>;
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => { setAuthed(true); setChecking(false); }} />;
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/menu', label: 'Menu', icon: '🍢' },
    { to: '/admin/orders', label: 'Orders', icon: '🛍️', badge: badges.pending },
    { to: '/admin/messages', label: 'Messages', icon: '✉️', badge: badges.unread },
  ];

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <Link to="/admin" className="admin__brand">
          KDB<span>Treats</span> <em>Admin</em>
        </Link>

        <nav className="admin__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin__nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="admin__nav-icon">{item.icon}</span>
              {item.label}
              {item.badge > 0 && <span className="admin__nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin__sidebar-footer">
          <Link to="/" className="admin__back-link">← Back to site</Link>
        </div>
      </aside>

      <div className="admin__main">
        <header className="admin__topbar">
          <h1 className="admin__page-title">{pageTitle}</h1>
          <Link to="/" className="btn btn--primary">View site ↗</Link>
        </header>

        <main className="admin__content">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="menu" element={<MenuAdminPage />} />
            <Route path="orders" element={<OrdersAdminPage />} />
            <Route path="messages" element={<MessagesAdminPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}