import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import type { Post } from '../api/posts/route';
import AdminDashboard from '@/components/AdminDashboard';

async function getAllPosts(): Promise<Post[]> {
  try {
    return await query<Post>('SELECT * FROM posts ORDER BY created_at DESC');
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  const posts = await getAllPosts();
  return <AdminDashboard posts={posts} />;
}
