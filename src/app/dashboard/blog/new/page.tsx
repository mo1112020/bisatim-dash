import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { BlogFields } from '../BlogFields';
import { createBlogPost } from '../actions';

export default async function NewBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <PageHeader title="New Post" subtitle="Write a new blog article" breadcrumb={[{ label: 'Blog', href: '/dashboard/blog' }]} />
      <form action={createBlogPost} className="dash-form-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BlogFields />
        {error && <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" className="btn btn-primary">Create post</button>
          <Link href="/dashboard/blog" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
