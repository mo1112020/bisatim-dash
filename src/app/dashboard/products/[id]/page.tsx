import Link from 'next/link';
import { adminClient } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { ProductFields } from '../ProductFields';
import { updateProduct, deleteProduct } from '../actions';
import { listMediaFiles } from '@/lib/media-files';
import { DeleteButton } from '@/components/DeleteButton';
import type { Product } from '@/lib/types';

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const [{ data }, mediaFiles] = await Promise.all([
    adminClient.from('products').select('*').eq('id', id).single(),
    listMediaFiles(),
  ]);
  if (!data) notFound();
  const product = data as Product;

  return (
    <div>
      <PageHeader
        title="Edit Product"
        subtitle={product.name}
        breadcrumb={[{ label: 'Products', href: '/dashboard/products' }]}
        action={<DeleteButton action={deleteProduct.bind(null, id)} confirm="Delete this product? This cannot be undone." label="Delete" />}
      />
      <form action={updateProduct.bind(null, id)} className="dash-form-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ProductFields defaults={product as unknown as Record<string, unknown>} mediaFiles={mediaFiles} />
        {error && <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" className="btn btn-primary">Save changes</button>
          <Link href="/dashboard/products" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
