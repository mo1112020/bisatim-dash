import Link from 'next/link';
import { adminClient } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { ProductFields } from '../ProductFields';
import { updateProduct, deleteProduct } from '../actions';
import { listMediaFiles } from '@/lib/media-files';
import { listCategories, categoriesForProduct } from '@/lib/categories';
import { SubmitButton } from '@/components/SubmitButton';
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
  const [{ data }, mediaFiles, allCategories] = await Promise.all([
    adminClient.from('products').select('*').eq('id', id).single(),
    listMediaFiles(),
    listCategories(),
  ]);
  if (!data) notFound();
  const product = data as Product;
  const categories = categoriesForProduct(
    allCategories,
    Array.isArray(product.categories) ? product.categories : [],
  );

  return (
    <div>
      <PageHeader
        title="Edit Product"
        subtitle={product.name}
        breadcrumb={[{ label: 'Products', href: '/dashboard/products' }]}
        action={<DeleteButton action={deleteProduct.bind(null, id)} confirm="Delete this product? This cannot be undone." label="Delete" />}
      />
      <form action={updateProduct.bind(null, id)} className="dash-form-panel">
        <ProductFields defaults={product as unknown as Record<string, unknown>} mediaFiles={mediaFiles} categories={categories} />
        {error && <p className="dash-form-error">{error}</p>}
        <div className="dash-form-actions">
          <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
          <Link href="/dashboard/products" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
