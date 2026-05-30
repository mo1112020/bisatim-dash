import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { ProductFields } from '../ProductFields';
import { createProduct } from '../actions';
import { listMediaFiles } from '@/lib/media-files';
import { listCategories, categoriesForProduct } from '@/lib/categories';
import { SubmitButton } from '@/components/SubmitButton';

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [mediaFiles, allCategories] = await Promise.all([
    listMediaFiles(),
    listCategories(),
  ]);
  const categories = categoriesForProduct(allCategories);

  return (
    <div>
      <PageHeader
        title="New Product"
        subtitle="Add a new product to the catalog"
        breadcrumb={[{ label: 'Products', href: '/dashboard/products' }]}
      />
      <form action={createProduct} className="dash-form-panel">
        <ProductFields mediaFiles={mediaFiles} categories={categories} />
        {error && <p className="dash-form-error">{error}</p>}
        <div className="dash-form-actions">
          <SubmitButton pendingLabel="Creating…">Create product</SubmitButton>
          <Link href="/dashboard/products" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
