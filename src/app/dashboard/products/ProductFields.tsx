import { MediaPicker } from './MediaPicker';
import { DimensionsInput } from './DimensionsInput';
import { CategoryPicker } from './CategoryPicker';
import type { MediaFile } from '@/lib/media-files';
import type { Category } from '@/lib/types';

function FormSection({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="dash-form-section">
      <div className="dash-form-section-header">
        <h2 className="dash-section-title">{title}</h2>
        {desc && <p className="dash-section-desc">{desc}</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </section>
  );
}

function defaultCategorySlugs(defaults?: Record<string, unknown>): string[] {
  if (Array.isArray(defaults?.categories)) return defaults.categories as string[];
  if (typeof defaults?.category === 'string' && defaults.category) return [defaults.category];
  return [];
}

export function ProductFields({
  defaults,
  mediaFiles,
  categories,
}: {
  defaults?: Record<string, unknown>;
  mediaFiles: MediaFile[];
  categories: Category[];
}) {
  return (
    <>
      <FormSection title="Basic information" desc="Name and description shown on the storefront">
        <div className="dash-form-field">
          <label>Product name</label>
          <input name="name" defaultValue={defaults?.name as string} placeholder="e.g. Antique Persian Rug" required />
        </div>
        <div className="dash-form-field">
          <label>Description</label>
          <textarea
            name="description"
            defaultValue={defaults?.description as string}
            placeholder="Describe the product, its history, and key features…"
            style={{ minHeight: 120 }}
            required
          />
        </div>
      </FormSection>

      <FormSection title="Categories" desc="Select one or more categories for this product">
        <CategoryPicker categories={categories} defaultSlugs={defaultCategorySlugs(defaults)} />
      </FormSection>

      <FormSection title="Pricing & inventory">
        <div className="dash-form-grid">
          <div className="dash-form-field">
            <label>Price ($)</label>
            <input name="price" type="number" step="0.01" min="0" defaultValue={defaults?.price as number} placeholder="0.00" required />
          </div>
          <div className="dash-form-field">
            <label>Stock</label>
            <input name="stock" type="number" min="0" defaultValue={(defaults?.stock as number) ?? 0} required />
          </div>
        </div>
      </FormSection>

      <FormSection title="Product details">
        <DimensionsInput defaultDimensions={defaults?.dimensions as string} />
        <div className="dash-form-grid">
          <div className="dash-form-field">
            <label>Material</label>
            <input name="material" defaultValue={defaults?.material as string} placeholder="e.g. Wool" />
          </div>
          <div className="dash-form-field">
            <label>Origin</label>
            <input name="origin" defaultValue={defaults?.origin as string} placeholder="e.g. Iran" />
          </div>
        </div>
      </FormSection>

      <FormSection title="Images" desc="First selected image is used as the cover photo">
        <MediaPicker files={mediaFiles} defaultUrls={Array.isArray(defaults?.images) ? (defaults.images as string[]) : []} />
      </FormSection>
    </>
  );
}
