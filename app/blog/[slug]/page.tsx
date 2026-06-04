import Nav from '@/components/Nav';
import { query } from '@/lib/db';
import type { Post } from '../../api/posts/route';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

async function getPost(slug: string): Promise<Post | null> {
  try {
    const rows = await query<Post>(
      'SELECT * FROM posts WHERE slug = $1 AND published = true',
      [slug]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} MIN READ`;
}

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps) {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} — Duc Than`,
    description: post.excerpt ?? undefined,
  };
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Nav activePage="blog" />
      <div className="bg-layer bg-grid" />
      <div className="bg-layer bg-glow" />
      <div className="bg-layer bg-scan" />

      <article className="article">
        <Link href="/blog" className="back">← BACK TO JOURNAL</Link>

        <div className="article-meta">
          <span>{formatDate(post.created_at)}</span>
          {post.tags?.length > 0 && <span>{post.tags.join(' · ').toUpperCase()}</span>}
          <span>{readingTime(post.content)}</span>
        </div>

        <h1>{post.title}</h1>
        {post.excerpt && <p className="lede">{post.excerpt}</p>}

        <div className="article-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {post.tags?.length > 0 && (
          <div className="article-tags">
            {post.tags.map(t => <span key={t}>{t}</span>)}
          </div>
        )}
      </article>

      <footer className="footer">
        <div className="wrap">
          <span>© 2026 DUC THAN</span>
          <Link href="/blog" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mid)', textDecoration: 'none' }}>
            ← BACK TO JOURNAL
          </Link>
        </div>
      </footer>
    </>
  );
}
