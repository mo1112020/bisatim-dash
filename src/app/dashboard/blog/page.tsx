import Link from 'next/link';
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { DashTable, DashTh, DashTd, DashEmpty } from '@/components/DashTable';
import { Plus, Pencil } from 'lucide-react';
import type { BlogPost } from '@/lib/types';

export default async function BlogPage() {
  const { data } = await adminClient.from('blog_posts').select('*').order('created_at', { ascending: false });
  const posts: BlogPost[] = data ?? [];

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        subtitle={`${posts.length} post${posts.length !== 1 ? 's' : ''}`}
        action={
          <Link href="/dashboard/blog/new" className="btn btn-primary">
            <Plus size={12} /> New post
          </Link>
        }
      />
      <DashTable>
        <thead>
          <tr>
            <DashTh>Title</DashTh>
            <DashTh>Category</DashTh>
            <DashTh>Author</DashTh>
            <DashTh>Date</DashTh>
            <DashTh>Actions</DashTh>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id}>
              <DashTd style={{ fontWeight: 500, maxWidth: 300 }}>
                <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
              </DashTd>
              <DashTd style={{ color: 'var(--dash-muted)' }}>{p.category}</DashTd>
              <DashTd style={{ color: 'var(--dash-muted)' }}>{p.author}</DashTd>
              <DashTd style={{ color: 'var(--dash-muted)' }}>{p.date}</DashTd>
              <DashTd>
                <Link href={`/dashboard/blog/${p.id}`} className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: 10 }}>
                  <Pencil size={11} /> Edit
                </Link>
              </DashTd>
            </tr>
          ))}
          {posts.length === 0 && <DashEmpty colSpan={5}>No posts yet.</DashEmpty>}
        </tbody>
      </DashTable>
    </div>
  );
}
