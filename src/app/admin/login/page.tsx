'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0E0B09;
          font-family: 'Inter', -apple-system, sans-serif;
          color: #E4DDD2;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 3rem 2.5rem;
          background: #1C1714;
          border: 1px solid rgba(184,134,74,0.12);
          border-radius: 12px;
        }
        .login-logo {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-logo h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: #CDA06A;
          letter-spacing: -0.02em;
        }
        .login-logo p {
          font-size: 0.75rem;
          color: #6B6860;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 0.5rem;
        }
        .login-divider {
          width: 48px;
          height: 1px;
          background: rgba(184,134,74,0.25);
          margin: 0 auto 2rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #A09B91;
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #141713;
          border: 1px solid rgba(184,134,74,0.1);
          border-radius: 8px;
          color: #E4DDD2;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: rgba(184,134,74,0.4);
        }
        .form-input::placeholder {
          color: #4A4840;
        }
        .login-error {
          background: rgba(220,38,38,0.1);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          margin-bottom: 1.25rem;
          font-size: 0.82rem;
          color: #fca5a5;
        }
        .login-btn {
          width: 100%;
          padding: 0.85rem;
          background: #B8864A;
          border: none;
          border-radius: 8px;
          color: #0E0B09;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .login-btn:hover { background: #CDA06A; }
        .login-btn:active { transform: scale(0.98); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="login-card">
        <div className="login-logo">
          <h1>Glashapullagh</h1>
          <p>Content Editor</p>
        </div>
        <div className="login-divider" />

        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@glashapullagh.ie"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
