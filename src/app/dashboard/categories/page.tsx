import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { createCategory, deleteCategory, toggleCategory } from './actions';
import { DeleteButton } from '@/components/DeleteButton';
import type { Category } from '@/lib/types';

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '10px 20px',
  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em',
  color: 'var(--dash-muted)', borderBottom: '1px solid var(--dash-border)',
};
const TD: React.CSSProperties = { padding: '12px 20px', borderBottom: '1px solid var(--dash-border)' };

export default async function CategoriesPage() {
  const { data } = await adminClient.from('categories').select('*').order('sort_order');
  const categories: Category[] = data ?? [];

  return (
    <div style={{ maxWidth: 860 }}>
      <PageHeader title="Categories" />

      <details style={{ marginBottom: 20 }}>
        <summary className="btn btn-primary" style={{ cursor: 'pointer', listStyle: 'none', display: 'inline-flex' }}>
          + Add category
        </summary>
        <form action={createCategory} style={{
          marginTop: 12, padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
          background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
        }}>
          <div><label>Name</label><input name="name" required /></div>
          <div><label>Slug</label><input name="slug" required placeholder="handmade-rugs" /></div>
          <div><label>Badge</label><input name="badge" placeholder="Artisanal" /></div>
          <div><label>Sort Order</label><input name="sort_order" type="number" defaultValue="0" /></div>
          <div style={{ gridColumn: '1 / -1' }}><label>Image URL</label><input name="image_url" /></div>
          <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn btn-primary">Add category</button></div>
        </form>
      </details>

      <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TH}>Name</th>
              <th style={TH}>Slug</th>
              <th style={TH}>Badge</th>
              <th style={TH}>Order</th>
              <th style={TH}>Active</th>
              <th style={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td style={{ ...TD, fontWeight: 500 }}>{c.name}</td>
                <td style={{ ...TD, fontFamily: 'monospace', fontSize: 12, color: 'var(--dash-muted)' }}>{c.slug}</td>
                <td style={{ ...TD, fontSize: 13 }}>{c.badge}</td>
                <td style={{ ...TD, fontSize: 13 }}>{c.sort_order}</td>
                <td style={TD}>
                  <form action={toggleCategory.bind(null, c.id, !c.active)}>
                    <button type="submit" style={{
                      fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em',
                      padding: '3px 8px', border: 'none', cursor: 'pointer',
                      background: c.active ? '#dcfce7' : '#f3f4f6',
                      color: c.active ? '#16a34a' : '#6b7280',
                    }}>
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </form>
                </td>
                <td style={TD}>
                  <DeleteButton action={deleteCategory.bind(null, c.id)} confirm="Delete this category?" />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...TD, textAlign: 'center', color: 'var(--dash-muted)', padding: '40px 20px' }}>
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
