import { MediaPicker } from './MediaPicker';
import type { MediaFile } from '@/lib/media-files';

const FIELD: React.CSSProperties = { marginBottom: 0 };

export function ProductFields({
  defaults,
  mediaFiles,
}: {
  defaults?: Record<string, unknown>;
  mediaFiles: MediaFile[];
}) {
  return (
    <>
      <div style={FIELD}><label>Name</label><input name="name" defaultValue={defaults?.name as string} required /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>Category</label>
          <select name="category" defaultValue={defaults?.category as string}>
            {['Vintage'].map(c =>
              <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label>Size Category</label>
          <select name="size_category" defaultValue={defaults?.size_category as string}>
            {['Small', 'Medium', 'Large', 'Runner'].map(c =>
              <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label>Price ($)</label><input name="price" type="number" step="0.01" defaultValue={defaults?.price as number} required />
      </div>
      <div><label>Description</label><textarea name="description" defaultValue={defaults?.description as string} required /></div>
      <div>
        <label>Images</label>
        <MediaPicker files={mediaFiles} defaultUrls={Array.isArray(defaults?.images) ? (defaults.images as string[]) : []} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label>Dimensions</label><input name="dimensions" defaultValue={defaults?.dimensions as string} placeholder="200×300 cm" /></div>
        <div><label>Material</label><input name="material" defaultValue={defaults?.material as string} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label>Origin</label><input name="origin" defaultValue={defaults?.origin as string} /></div>
        <div><label>Stock</label><input name="stock" type="number" defaultValue={(defaults?.stock as number) ?? 0} required /></div>
      </div>
      <div>
        <label>Rooms (comma-separated)</label>
        <input name="rooms" defaultValue={Array.isArray(defaults?.rooms) ? (defaults.rooms as string[]).join(', ') : ''} placeholder="Living Room, Bedroom" />
      </div>
    </>
  );
}
