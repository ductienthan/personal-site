import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  return <PostEditor mode="new" />;
}
