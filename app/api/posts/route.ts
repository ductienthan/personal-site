import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

// GET /api/posts — public: returns published posts; admin: returns all
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAdmin = !!(session?.user as { role?: string })?.role;

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') ?? '50', 10);

  let posts: Post[];
  if (isAdmin) {
    posts = await query<Post>(
      'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
  } else {
    posts = await query<Post>(
      'SELECT * FROM posts WHERE published = true ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
  }

  return NextResponse.json(posts);
}

// POST /api/posts — admin only
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as { role?: string })?.role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, excerpt, content, tags = [], published = false } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'title, slug, content required' }, { status: 400 });
  }

  const [post] = await query<Post>(
    `INSERT INTO posts (title, slug, excerpt, content, tags, published)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, slug, excerpt ?? null, content, tags, published]
  );

  return NextResponse.json(post, { status: 201 });
}
