'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/admin');
    } else {
      setError('Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
    }}>
      <div className="panel" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.28em', marginBottom: 8 }}>
            // ADMIN ACCESS
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#eaf2f8' }}>
            Sign In
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.14em', display: 'block', marginBottom: 6 }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.14em', display: 'block', marginBottom: 6 }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: '#ff6b6b', fontFamily: 'var(--font-mono)' }}>
              // {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn primary"
            style={{ marginTop: 8, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN →'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-2)',
  border: '1px solid var(--line-2)',
  color: 'var(--text)',
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  padding: '12px 14px',
  outline: 'none',
  transition: 'border-color .2s',
};
