'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Post } from '@/app/api/posts/route';

interface PostEditorProps {
  post?: Post;
  mode: 'new' | 'edit';
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function PostEditor({ post, mode }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [tags, setTags] = useState(post?.tags?.join(', ') ?? '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (mode === 'new') setSlug(slugify(val));
  };

  const handleSave = async () => {
    if (!title || !slug || !content) {
      setError('Title, slug, and content are required.');
      return;
    }
    setSaving(true);
    setError('');

    const tagsArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const url = mode === 'new' ? '/api/posts' : `/api/posts/${post!.id}`;
    const method = mode === 'new' ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, excerpt, content, tags: tagsArray, published }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Failed to save.');
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.28em', marginBottom: 8 }}>
            // {mode === 'new' ? 'NEW POST' : 'EDIT POST'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#eaf2f8' }}>
            {mode === 'new' ? 'Create Post' : 'Edit Post'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => setPreview(p => !p)}
            style={{ background: 'none', border: '1px solid var(--line-2)', color: preview ? 'var(--accent)' : 'var(--text-dim)', padding: '10px 18px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}
          >
            {preview ? 'EDITOR' : 'PREVIEW'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn primary"
            style={{ opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'SAVING...' : 'SAVE POST'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: '#ff6b6b', fontFamily: 'var(--font-mono)', fontSize: 12, marginBottom: 20 }}>
          // Error: {error}
        </div>
      )}

      {/* Meta fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Field label="TITLE">
          <input
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Post title..."
            style={inputStyle}
          />
        </Field>
        <Field label="SLUG">
          <input
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="my-post-slug"
            style={inputStyle}
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Field label="TAGS (comma-separated)">
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="RAG, pgvector, LLM"
            style={inputStyle}
          />
        </Field>
        <Field label="STATUS">
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', height: 46 }}>
            <input
              type="checkbox"
              checked={published}
              onChange={e => setPublished(e.target.checked)}
              style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: published ? 'var(--accent)' : 'var(--text-dim)', letterSpacing: '0.1em' }}>
              {published ? '● PUBLISHED' : '○ DRAFT'}
            </span>
          </label>
        </Field>
      </div>

      <Field label="EXCERPT (optional)">
        <input
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="One-line summary shown in the post list..."
          style={{ ...inputStyle, marginBottom: 16 }}
        />
      </Field>

      {/* Editor / Preview */}
      {preview ? (
        <div className="panel" style={{ minHeight: 500 }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.14em', marginBottom: 16 }}>// PREVIEW</div>
          <div className="article-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '*Nothing to preview.*'}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <Field label="CONTENT (Markdown)">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="# Title&#10;&#10;Write your post in Markdown..."
            style={{
              ...inputStyle,
              height: 520,
              resize: 'vertical',
              lineHeight: 1.7,
            }}
          />
        </Field>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.14em', display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
        {label}
      </label>
      {children}
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
  display: 'block',
};
