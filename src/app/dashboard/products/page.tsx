import Link from 'next/link';
import { getProducts } from '@/lib/queries';
import { PageHeader } from '@/components/PageHeader';
import { DashTable, DashTh, DashTd, DashEmpty } from '@/components/DashTable';
import { Plus, Pencil } from 'lucide-react';
import type { Product } from '@/lib/types';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} product${products.length !== 1 ? 's' : ''}`}
        action={
          <Link href="/dashboard/products/new" className="btn btn-primary">
            <Plus size={12} /> New product
          </Link>
        }
      />
      <DashTable>
        <thead>
          <tr>
            <DashTh>Name</DashTh>
            <DashTh>Categories</DashTh>
            <DashTh>Price</DashTh>
            <DashTh>Stock</DashTh>
            <DashTh>Actions</DashTh>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <DashTd style={{ fontWeight: 500 }}>{p.name}</DashTd>
              <DashTd style={{ color: 'var(--dash-muted)' }}>
                {Array.isArray(p.categories) && p.categories.length > 0
                  ? p.categories.join(', ')
                  : '—'}
              </DashTd>
              <DashTd>${p.price}</DashTd>
              <DashTd>{p.stock}</DashTd>
              <DashTd>
                <Link href={`/dashboard/products/${p.id}`} className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: 10 }}>
                  <Pencil size={11} /> Edit
                </Link>
              </DashTd>
            </tr>
          ))}
          {products.length === 0 && <DashEmpty colSpan={5}>No products yet.</DashEmpty>}
        </tbody>
      </DashTable>
    </div>
  );
}
