import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { query } from '@/lib/db';
import type { Post } from '../../../api/posts/route';
import PostEditor from '@/components/PostEditor';

async function getPost(id: string): Promise<Post | null> {
  try {
    const rows = await query<Post>('SELECT * FROM posts WHERE id = $1', [id]);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  const post = await getPost(params.id);
  if (!post) notFound();

  return <PostEditor post={post} mode="edit" />;
}
