import { MediaPicker } from './MediaPicker';

const FIELD: React.CSSProperties = { marginBottom: 0 };

export function ProductFields({ defaults }: { defaults?: Record<string, unknown> }) {
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label>Price ($)</label><input name="price" type="number" step="0.01" defaultValue={defaults?.price as number} required /></div>
        <div><label>Sale Price ($) — optional</label><input name="sale_price" type="number" step="0.01" defaultValue={(defaults?.sale_price as number) ?? ''} /></div>
      </div>
      <div><label>Description</label><textarea name="description" defaultValue={defaults?.description as string} required /></div>
      <div>
        <label>Images</label>
        <MediaPicker defaultUrls={Array.isArray(defaults?.images) ? (defaults.images as string[]) : []} />
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
