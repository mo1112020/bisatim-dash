'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { BlogFields } from '../BlogFields';
import { updateBlogPost, deleteBlogPost } from '../actions';
import type { BlogPost } from '@/lib/types';
import { getBrowserClient } from '@/lib/supabase-browser';

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getBrowserClient().from('blog_posts').select('*').eq('id', id).single()
      .then(({ data }) => setPost(data));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateBlogPost(id, new FormData(e.currentTarget));
      router.push('/dashboard/blog');
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await deleteBlogPost(id);
    router.push('/dashboard/blog');
  }

  if (!post) return <p style={{ padding: 40, color: 'var(--dash-muted)', fontSize: 13 }}>Loading…</p>;

  return (
    <div>
      <PageHeader
        title="Edit Post"
        subtitle={post.title}
        breadcrumb={[{ label: 'Blog', href: '/dashboard/blog' }]}
        action={<button onClick={handleDelete} className="btn btn-danger">Delete</button>}
      />
      <form onSubmit={handleSubmit} className="dash-form-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BlogFields defaults={post as unknown as Record<string, unknown>} />
        {error && <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <a href="/dashboard/blog" className="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  );
}
