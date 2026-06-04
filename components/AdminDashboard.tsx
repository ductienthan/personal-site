'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Post } from '@/app/api/posts/route';

function formatDate(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

export default function AdminDashboard({ posts: initial }: { posts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initial);
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setPosts(posts.filter(p => p.id !== id));
    setDeleting(null);
    router.refresh();
  };

  const togglePublish = async (post: Post) => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, published: !post.published }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPosts(posts.map(p => p.id === post.id ? updated : p));
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.28em', marginBottom: 8 }}>
            // CONTROL PANEL
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#eaf2f8' }}>Posts</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 6 }}>
            {posts.length} total · {posts.filter(p => p.published).length} published
          </p>
        </div>
        <Link href="/admin/new" className="btn primary">NEW POST +</Link>
      </div>

      {/* Table */}
      {posts.length === 0 ? (
        <div style={{ color: 'var(--text-dim)', fontSize: 13, padding: '40px 0' }}>
          // No posts yet. Create your first one above.
        </div>
      ) : (
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['Title', 'Slug', 'Tags', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: 500, letterSpacing: '0.12em', fontSize: 11 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} style={{ borderBottom: '1px solid var(--line)', transition: 'background .2s' }}>
                  <td style={{ padding: '16px 20px', color: '#eaf2f8', maxWidth: 260 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-dim)' }}>/{post.slug}</td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-dim)', maxWidth: 160 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.tags?.join(', ') || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      onClick={() => togglePublish(post)}
                      style={{
                        background: 'none', border: `1px solid ${post.published ? 'var(--accent)' : 'var(--line)'}`,
                        color: post.published ? 'var(--accent)' : 'var(--text-dim)',
                        fontSize: 10, padding: '4px 10px', cursor: 'pointer',
                        letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', transition: 'all .2s',
                      }}
                      title="Click to toggle"
                    >
                      {post.published ? '● LIVE' : '○ DRAFT'}
                    </button>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-dim)' }}>{formatDate(post.created_at)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Link
                        href={`/admin/${post.id}/edit`}
                        style={{ color: 'var(--text-mid)', textDecoration: 'none', fontSize: 12, letterSpacing: '0.08em', transition: 'color .2s' }}
                      >
                        EDIT
                      </Link>
                      <span style={{ color: 'var(--line-2)' }}>|</span>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: 12, letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', opacity: deleting === post.id ? 0.5 : 1 }}
                      >
                        {deleting === post.id ? '...' : 'DEL'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
