import Link from 'next/link';
import AdminNav from '@/components/AdminNav';

export const metadata = { title: 'Admin — Duc Than' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'var(--font-mono)' }}>
      <AdminNav />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 32px 60px' }}>
        {children}
      </main>
    </div>
  );
}
