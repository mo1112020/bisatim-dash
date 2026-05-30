import Link from 'next/link';
import { adminClient } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { BlogFields } from '../BlogFields';
import { updateBlogPost, deleteBlogPost } from '../actions';
import { DeleteButton } from '@/components/DeleteButton';
import type { BlogPost } from '@/lib/types';

export default async function EditBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const { data } = await adminClient.from('blog_posts').select('*').eq('id', id).single();
  if (!data) notFound();
  const post = data as BlogPost;

  return (
    <div>
      <PageHeader
        title="Edit Post"
        subtitle={post.title}
        breadcrumb={[{ label: 'Blog', href: '/dashboard/blog' }]}
        action={<DeleteButton action={deleteBlogPost.bind(null, id)} confirm="Delete this post? This cannot be undone." label="Delete" />}
      />
      <form action={updateBlogPost.bind(null, id)} className="dash-form-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BlogFields defaults={post as unknown as Record<string, unknown>} />
        {error && <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" className="btn btn-primary">Save changes</button>
          <Link href="/dashboard/blog" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
