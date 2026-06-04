'use client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function AdminNav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 32px',
      background: 'rgba(8,11,17,0.95)',
      borderBottom: '1px solid var(--line)',
      backdropFilter: 'blur(12px)',
      fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link href="/admin" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13, letterSpacing: '0.14em' }}>
          // ADMIN
        </Link>
        <Link href="/admin/new" style={{ color: 'var(--text-mid)', textDecoration: 'none', fontSize: 12, letterSpacing: '0.1em' }}>
          NEW POST
        </Link>
        <Link href="/" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: 12, letterSpacing: '0.1em' }}>
          ↗ SITE
        </Link>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        style={{
          background: 'none', border: '1px solid var(--line-2)',
          color: 'var(--text-dim)', fontSize: 11, letterSpacing: '0.12em',
          padding: '7px 14px', cursor: 'pointer', fontFamily: 'var(--font-mono)',
          transition: 'color .2s, border-color .2s',
        }}
      >
        SIGN OUT
      </button>
    </nav>
  );
}
