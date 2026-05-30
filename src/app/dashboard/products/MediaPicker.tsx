'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { MediaFile } from '@/lib/media-files';

export function MediaPicker({ files, defaultUrls }: { files: MediaFile[]; defaultUrls?: string[] }) {
  const [selected, setSelected] = useState<string[]>(defaultUrls ?? []);

  function toggle(url: string) {
    setSelected(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  }

  function moveUp(i: number) {
    if (i === 0) return;
    setSelected(prev => { const a = [...prev]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; });
  }

  function remove(url: string) {
    setSelected(prev => prev.filter(u => u !== url));
  }

  return (
    <div>
      <input type="hidden" name="images" value={selected.join('\n')} />

      {selected.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--dash-muted)', marginBottom: 6 }}>
            Selected ({selected.length}) — first image is the cover
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selected.map((url, i) => (
              <div key={url} style={{ position: 'relative', width: 72, height: 72 }}>
                <Image src={url} alt="" fill style={{ objectFit: 'cover', borderRadius: 4, border: '2px solid var(--dash-black)' }} unoptimized />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 2 }}>
                  <button
                    type="button"
                    onClick={() => remove(url)}
                    style={{ alignSelf: 'flex-end', width: 16, height: 16, borderRadius: 8, background: '#ef4444', border: 'none', color: '#fff', fontSize: 10, lineHeight: '16px', cursor: 'pointer', padding: 0 }}
                  >✕</button>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveUp(i)}
                      style={{ alignSelf: 'flex-start', width: 16, height: 16, borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: 10, lineHeight: '16px', cursor: 'pointer', padding: 0 }}
                    >↑</button>
                  )}
                </div>
                {i === 0 && (
                  <div style={{ position: 'absolute', bottom: 2, left: 2, fontSize: 8, background: 'var(--dash-black)', color: '#fff', padding: '1px 4px', borderRadius: 2 }}>cover</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ border: '1px solid var(--dash-border)', borderRadius: 4, padding: 12, background: 'var(--dash-surface)' }}>
        <div style={{ fontSize: 11, color: 'var(--dash-muted)', marginBottom: 10 }}>
          {files.length} images in CDN — click to select
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 6, maxHeight: 320, overflowY: 'auto' }}>
          {files.map(f => {
            const active = selected.includes(f.url);
            return (
              <button
                key={f.url}
                type="button"
                onClick={() => toggle(f.url)}
                title={f.name}
                style={{
                  position: 'relative', width: '100%',
                  border: active ? '2px solid var(--dash-black)' : '2px solid transparent',
                  borderRadius: 4, overflow: 'hidden', cursor: 'pointer',
                  background: '#f3f4f6', padding: 0, paddingBottom: '100%',
                }}
              >
                <Image src={f.url} alt={f.name} fill style={{ objectFit: 'cover' }} unoptimized />
                {active && (
                  <div style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: 8, background: 'var(--dash-black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontSize: 9 }}>✓</span>
                  </div>
                )}
              </button>
            );
          })}
          {files.length === 0 && (
            <div style={{ gridColumn: '1/-1', fontSize: 12, color: 'var(--dash-muted)' }}>
              No images in CDN yet. Upload images via CDN Manager first.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
