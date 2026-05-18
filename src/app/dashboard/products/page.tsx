import Link from 'next/link';
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { Plus, Pencil } from 'lucide-react';
import type { Product } from '@/lib/types';

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '10px 20px',
  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em',
  color: 'var(--dash-muted)', borderBottom: '1px solid var(--dash-border)',
};
const TD: React.CSSProperties = { padding: '12px 20px', borderBottom: '1px solid var(--dash-border)' };

export default async function ProductsPage() {
  const { data } = await adminClient.from('products').select('*').order('created_at', { ascending: false });
  const products: Product[] = data ?? [];

  return (
    <div>
      <PageHeader title="Products" action={
        <Link href="/dashboard/products/new" className="btn btn-primary">
          <Plus size={12} /> New product
        </Link>
      } />
      <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TH}>Name</th>
              <th style={TH}>Category</th>
              <th style={TH}>Price</th>
              <th style={TH}>Stock</th>
              <th style={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={TD}><span style={{ fontWeight: 500 }}>{p.name}</span></td>
                <td style={{ ...TD, color: 'var(--dash-muted)', fontSize: 13 }}>{p.category}</td>
                <td style={TD}>${p.price}</td>
                <td style={{ ...TD, fontSize: 13 }}>{p.stock}</td>
                <td style={TD}>
                  <Link href={`/dashboard/products/${p.id}`} className="btn btn-secondary" style={{ padding: '5px 12px' }}>
                    <Pencil size={11} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...TD, textAlign: 'center', color: 'var(--dash-muted)', padding: '40px 20px' }}>
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
