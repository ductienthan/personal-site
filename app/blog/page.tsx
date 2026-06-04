import Nav from '@/components/Nav';
import { query } from '@/lib/db';
import type { Post } from '../api/posts/route';
import Link from 'next/link';

async function getPosts(): Promise<Post[]> {
  try {
    return await query<Post>(
      'SELECT id, slug, title, excerpt, tags, created_at FROM posts WHERE published = true ORDER BY created_at DESC'
    );
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  return new Date(iso).toISOString().slice(0, 10).replace(/-/g, '.');
}

export const metadata = {
  title: 'Journal — Duc Than',
  description: 'Writing on backend systems, RAG pipelines, and engineering under load.',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Nav activePage="blog" />

      <div className="bg-layer bg-grid" />
      <div className="bg-layer bg-glow" />
      <div className="bg-layer bg-scan" />

      {/* Header */}
      <section style={{ paddingTop: 160, paddingBottom: 40 }}>
        <div className="wrap">
          <span className="kicker">// JOURNAL</span>
          <h1 className="section-title" style={{ fontSize: 'clamp(38px,6vw,72px)', marginTop: 18 }}>
            Notes from the backend.
          </h1>
          <p className="section-sub">
            Write-ups on the systems I build and the things they teach me — RAG internals,
            latency hunting, reliability patterns, and the occasional war story.
          </p>
        </div>
      </section>

      {/* Post list */}
      <section style={{ paddingTop: 20, paddingBottom: 120 }}>
        <div className="wrap">
          {posts.length > 0 ? (
            <div className="blog-list" style={{ marginTop: 0 }}>
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="post-row">
                  <div className="post-date">{formatDate(post.created_at)}</div>
                  <div className="post-main">
                    <h3>{post.title}</h3>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    {post.tags?.length > 0 && (
                      <div className="post-tags">
                        {post.tags.map(t => <span key={t}>{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="post-arrow">→</div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)', marginTop: 40 }}>
              // No posts yet — check back soon.
            </p>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <span>© 2026 DUC THAN — SUNNYVALE, CA</span>
          <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mid)', textDecoration: 'none' }}>
            ← BACK TO HOME
          </Link>
        </div>
      </footer>
    </>
  );
}
