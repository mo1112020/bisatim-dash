'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { ProductFields } from '../ProductFields';
import { createProduct } from '../actions';

export default function NewProductPage() {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createProduct(new FormData(e.currentTarget));
      router.push('/dashboard/products');
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="New Product" subtitle="Add a new product to the catalog" breadcrumb={[{ label: 'Products', href: '/dashboard/products' }]} />
      <form onSubmit={handleSubmit} className="dash-form-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ProductFields />
        {error && <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Create product'}
          </button>
          <a href="/dashboard/products" className="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  );
}
