import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { setAdminToken } from '../../utils/auth';

/**
 * Passcode gate shown before the admin shell. Exchanges the passcode for a
 * session token and hands control back to AdminLayout via onSuccess.
 */
export default function AdminLogin({ onSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passcode.trim() || busy) return;
    setBusy(true);
    setError('');

    try {
      const { token } = await api.adminLogin(passcode);
      setAdminToken(token);
      onSuccess();
    } catch (err) {
      setError(
        err.status === 401
          ? 'Incorrect passcode. Please try again.'
          : `Login failed: ${err.message}`,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <form className="admin-login" onSubmit={handleSubmit}>
        <div className="admin-login__brand">
          KDB<span>Treats</span> <em>Admin</em>
        </div>

        <h1 className="admin-login__title">Restricted area</h1>
        <p className="admin-login__sub">Enter the admin passcode to continue.</p>

        <div className="admin-login__field">
          <label className="admin-form__label" htmlFor="admin-passcode">Passcode</label>
          <input
            id="admin-passcode"
            className="admin-form__input"
            type={show ? 'text' : 'password'}
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <label className="admin-login__show">
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
          />
          Show passcode
        </label>

        {error && <p className="admin-login__error" role="alert">{error}</p>}

        <button
          type="submit"
          className="btn btn--primary btn--lg admin-login__submit"
          disabled={busy || !passcode.trim()}
        >
          {busy ? 'Checking…' : 'Enter admin'}
        </button>
      </form>

      <Link to="/" className="admin-login__back">← Back to site</Link>
    </div>
  );
}