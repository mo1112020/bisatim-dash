'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { BlogFields } from '../BlogFields';
import { createBlogPost } from '../actions';

export default function NewBlogPage() {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createBlogPost(new FormData(e.currentTarget));
      router.push('/dashboard/blog');
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="New Post" subtitle="Write a new blog article" breadcrumb={[{ label: 'Blog', href: '/dashboard/blog' }]} />
      <form onSubmit={handleSubmit} className="dash-form-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BlogFields />
        {error && <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Create post'}
          </button>
          <a href="/dashboard/blog" className="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  );
}
