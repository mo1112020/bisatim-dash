'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { ProductFields } from '../ProductFields';
import { updateProduct, deleteProduct } from '../actions';
import type { Product } from '@/lib/types';
import { getBrowserClient } from '@/lib/supabase-browser';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getBrowserClient().from('products').select('*').eq('id', id).single()
      .then(({ data }) => setProduct(data));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProduct(id, new FormData(e.currentTarget));
      router.push('/dashboard/products');
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await deleteProduct(id);
    router.push('/dashboard/products');
  }

  if (!product) return <p style={{ padding: 40, color: 'var(--dash-muted)' }}>Loading…</p>;

  return (
    <div style={{ maxWidth: 660 }}>
      <PageHeader
        title="Edit Product"
        breadcrumb={[{ label: 'Products', href: '/dashboard/products' }]}
        action={<button onClick={handleDelete} className="btn btn-danger">Delete</button>}
      />
      <form onSubmit={handleSubmit} style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <ProductFields defaults={product as unknown as Record<string, unknown>} />
        {error && <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <a href="/dashboard/products" className="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  );
}
