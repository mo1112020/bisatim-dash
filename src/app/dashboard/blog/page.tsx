import Link from 'next/link';
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { Plus, Pencil } from 'lucide-react';
import type { BlogPost } from '@/lib/types';

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '10px 20px',
  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em',
  color: 'var(--dash-muted)', borderBottom: '1px solid var(--dash-border)',
};
const TD: React.CSSProperties = { padding: '12px 20px', borderBottom: '1px solid var(--dash-border)' };

export default async function BlogPage() {
  const { data } = await adminClient.from('blog_posts').select('*').order('created_at', { ascending: false });
  const posts: BlogPost[] = data ?? [];

  return (
    <div>
      <PageHeader title="Blog Posts" action={
        <Link href="/dashboard/blog/new" className="btn btn-primary">
          <Plus size={12} /> New post
        </Link>
      } />
      <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TH}>Title</th>
              <th style={TH}>Category</th>
              <th style={TH}>Author</th>
              <th style={TH}>Date</th>
              <th style={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id}>
                <td style={{ ...TD, fontWeight: 500, maxWidth: 300 }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                </td>
                <td style={{ ...TD, color: 'var(--dash-muted)', fontSize: 13 }}>{p.category}</td>
                <td style={{ ...TD, color: 'var(--dash-muted)', fontSize: 13 }}>{p.author}</td>
                <td style={{ ...TD, color: 'var(--dash-muted)', fontSize: 13 }}>{p.date}</td>
                <td style={TD}>
                  <Link href={`/dashboard/blog/${p.id}`} className="btn btn-secondary" style={{ padding: '5px 12px' }}>
                    <Pencil size={11} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...TD, textAlign: 'center', color: 'var(--dash-muted)', padding: '40px 20px' }}>
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
