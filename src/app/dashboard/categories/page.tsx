import { getCategories } from '@/lib/queries';
import { PageHeader } from '@/components/PageHeader';
import { DashTable, DashTh, DashTd, DashEmpty } from '@/components/DashTable';
import { createCategory, deleteCategory, toggleCategory } from './actions';
import { DeleteButton } from '@/components/DeleteButton';
import type { Category } from '@/lib/types';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'}`}
      />

      <details style={{ marginBottom: 16 }}>
        <summary className="btn btn-primary" style={{ cursor: 'pointer', listStyle: 'none', display: 'inline-flex', fontSize: 11 }}>
          + Add category
        </summary>
        <form action={createCategory} className="dash-form-panel" style={{
          marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
        }}>
          <div><label>Name</label><input name="name" required /></div>
          <div><label>Slug</label><input name="slug" required placeholder="handmade-rugs" /></div>
          <div><label>Badge</label><input name="badge" placeholder="Artisanal" /></div>
          <div><label>Sort Order</label><input name="sort_order" type="number" defaultValue="0" /></div>
          <div style={{ gridColumn: '1 / -1' }}><label>Image URL</label><input name="image_url" /></div>
          <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn btn-primary">Add category</button></div>
        </form>
      </details>

      <DashTable>
        <thead>
          <tr>
            <DashTh>Name</DashTh>
            <DashTh>Slug</DashTh>
            <DashTh>Badge</DashTh>
            <DashTh>Order</DashTh>
            <DashTh>Active</DashTh>
            <DashTh>Actions</DashTh>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <DashTd style={{ fontWeight: 500 }}>{c.name}</DashTd>
              <DashTd style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--dash-muted)' }}>{c.slug}</DashTd>
              <DashTd>{c.badge}</DashTd>
              <DashTd>{c.sort_order}</DashTd>
              <DashTd>
                <form action={toggleCategory.bind(null, c.id, !c.active)}>
                  <button type="submit" className="dash-badge" style={{
                    border: 'none', cursor: 'pointer', fontSize: 10, padding: '3px 8px',
                    background: c.active ? '#dcfce7' : '#f3f4f6',
                    color: c.active ? '#16a34a' : '#6b7280',
                  }}>
                    {c.active ? 'Active' : 'Inactive'}
                  </button>
                </form>
              </DashTd>
              <DashTd>
                <DeleteButton action={deleteCategory.bind(null, c.id)} confirm="Delete this category?" />
              </DashTd>
            </tr>
          ))}
          {categories.length === 0 && <DashEmpty colSpan={6}>No categories yet.</DashEmpty>}
        </tbody>
      </DashTable>
    </div>
  );
}
