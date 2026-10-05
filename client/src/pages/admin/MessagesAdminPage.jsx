import { useEffect, useState, useCallback } from 'react';
import { api } from '../../utils/api';

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const showNotice = (text, type = 'ok') => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { messages: data } = await api.getMessages();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleRead = async (message) => {
    setBusyId(message.id);
    try {
      await api.markMessageRead(message.id, !message.isRead);
      setMessages((msgs) => msgs.map((m) => (m.id === message.id ? { ...m, isRead: !message.isRead } : m)));
    } catch (e) {
      showNotice(e.message, 'err');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (message) => {
    if (!window.confirm(`Delete message from ${message.name}? This cannot be undone.`)) return;
    setBusyId(message.id);
    try {
      await api.deleteMessage(message.id);
      setMessages((msgs) => msgs.filter((m) => m.id !== message.id));
      if (expanded === message.id) setExpanded(null);
      showNotice('Message deleted');
    } catch (e) {
      showNotice(e.message, 'err');
    } finally {
      setBusyId(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="admin-messages-page">
      {notice && (
        <div className={`admin-notice admin-notice--${notice.type}`} role="status">{notice.text}</div>
      )}

      <div className="admin-toolbar">
        <p className="admin-toolbar__note">
          {unreadCount > 0 ? `${unreadCount} unread message(s)` : 'All messages read'}
        </p>
        <button className="btn btn--outline" onClick={load}>Refresh</button>
      </div>

      {error && (
        <div className="admin-error">
          <p>Could not load messages: {error}</p>
          <button className="btn btn--outline" onClick={load}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading messages…</div>
      ) : messages.length === 0 ? (
        <div className="admin-empty">No messages yet.</div>
      ) : (
        <div className="admin-message-list">
          {messages.map((message) => (
            <div key={message.id} className={`admin-message ${message.isRead ? '' : 'admin-message--unread'}`}>
              <button className="admin-message__main" onClick={() => setExpanded(expanded === message.id ? null : message.id)}>
                <span className="admin-message__dot" aria-hidden="true" />
                <span className="admin-message__name">{message.name}</span>
                <span className="admin-message__email">{message.email}</span>
                <span className="admin-message__preview">{message.message.slice(0, 60)}{message.message.length > 60 ? '…' : ''}</span>
                <span className="admin-message__date">{formatDate(message.createdAt)}</span>
                <span className="admin-order__chevron">{expanded === message.id ? '▲' : '▼'}</span>
              </button>

              <div className="admin-message__actions">
                <button
                  className={`admin-toggle ${message.isRead ? 'is-on' : 'is-off'}`}
                  disabled={busyId === message.id}
                  onClick={() => toggleRead(message)}
                  title={message.isRead ? 'Mark as unread' : 'Mark as read'}
                >
                  {message.isRead ? '✓ Read' : '○ Unread'}
                </button>
                <button
                  className="admin-btn-icon admin-btn-icon--danger"
                  title="Delete message"
                  disabled={busyId === message.id}
                  onClick={() => handleDelete(message)}
                >
                  🗑️
                </button>
              </div>

              {expanded === message.id && (
                <div className="admin-message__body">
                  <p>{message.message}</p>
                  <a className="admin-panel__link" href={`mailto:${message.email}`}>Reply to {message.email} →</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}