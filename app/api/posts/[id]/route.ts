import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import type { Post } from '../route';

type Params = { params: { id: string } };

// GET /api/posts/[id] — public (by id or slug)
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = params;
  const bySlug = isNaN(Number(id));

  const rows = await query<Post>(
    bySlug
      ? 'SELECT * FROM posts WHERE slug = $1 AND published = true'
      : 'SELECT * FROM posts WHERE id = $1',
    [id]
  );

  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

// PUT /api/posts/[id] — admin only
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { role?: string })?.role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, excerpt, content, tags, published } = body;

  const [post] = await query<Post>(
    `UPDATE posts
     SET title=$1, slug=$2, excerpt=$3, content=$4, tags=$5, published=$6
     WHERE id=$7
     RETURNING *`,
    [title, slug, excerpt ?? null, content, tags ?? [], published ?? false, params.id]
  );

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

// DELETE /api/posts/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { role?: string })?.role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await query('DELETE FROM posts WHERE id = $1', [params.id]);
  return NextResponse.json({ success: true });
}
