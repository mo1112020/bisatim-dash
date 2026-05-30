import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { ProductFields } from '../ProductFields';
import { createProduct } from '../actions';
import { listMediaFiles } from '@/lib/media-files';

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const mediaFiles = await listMediaFiles();

  return (
    <div>
      <PageHeader title="New Product" subtitle="Add a new product to the catalog" breadcrumb={[{ label: 'Products', href: '/dashboard/products' }]} />
      <form action={createProduct} className="dash-form-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ProductFields mediaFiles={mediaFiles} />
        {error && <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" className="btn btn-primary">Create product</button>
          <Link href="/dashboard/products" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
