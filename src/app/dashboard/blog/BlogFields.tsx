export function BlogFields({ defaults }: { defaults?: Record<string, unknown> }) {
  return (
    <>
      <div><label>Title</label><input name="title" defaultValue={defaults?.title as string} required /></div>
      <div><label>Excerpt</label><textarea name="excerpt" defaultValue={defaults?.excerpt as string} required style={{ minHeight: 70 }} /></div>
      <div><label>Content (HTML or Markdown)</label><textarea name="content" defaultValue={defaults?.content as string} required style={{ minHeight: 220 }} /></div>
      <div><label>Cover Image URL</label><input name="image" defaultValue={defaults?.image as string} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label>Author</label><input name="author" defaultValue={defaults?.author as string} /></div>
        <div><label>Category</label><input name="category" defaultValue={defaults?.category as string} /></div>
      </div>
      <div><label>Date</label><input name="date" type="date" defaultValue={(defaults?.date as string) ?? new Date().toISOString().slice(0, 10)} /></div>
      <div><label>Meta Description</label><textarea name="meta_description" defaultValue={(defaults?.meta_description as string) ?? ''} style={{ minHeight: 64 }} /></div>
    </>
  );
}
