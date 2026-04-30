'use client';
import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { deleteImage } from './actions';
import type { StorageFile } from './types';

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Filter = 'all' | 'used' | 'unused';

export function UploadForm({ files }: { files: StorageFile[] }) {
  const [localFiles, setLocalFiles] = useState<StorageFile[]>(files);
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const fileRef = useRef<HTMLInputElement>(null);

  const realFiles = localFiles.filter(f => !f.path.startsWith('__temp__'));
  const usedCount = realFiles.filter(f => f.inUse).length;
  const unusedCount = realFiles.filter(f => !f.inUse).length;
  const totalSize = localFiles.reduce((a, f) => a + f.size, 0);

  const visible = localFiles.filter(f => {
    if (f.path.startsWith('__temp__')) return true; // always show uploading files
    if (filter === 'used') return f.inUse;
    if (filter === 'unused') return !f.inUse;
    return true;
  });

  function triggerUpload(fileList: FileList | null) {
    if (!fileList?.length) return;
    for (const file of Array.from(fileList)) {
      const previewUrl = URL.createObjectURL(file);
      const tempPath = `__temp__${Date.now()}__${file.name}`;

      setLocalFiles(prev => [...prev, {
        name: file.name,
        path: tempPath,
        url: previewUrl,
        size: file.size,
        inUse: false,
      }]);

      startTransition(async () => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/cdn/upload', { method: 'POST', body: fd });
        const result: StorageFile = await res.json();
        URL.revokeObjectURL(previewUrl);
        if (res.ok) {
          setLocalFiles(prev => prev.map(f => f.path === tempPath ? { ...result, inUse: false } : f));
        } else {
          setLocalFiles(prev => prev.filter(f => f.path !== tempPath));
        }
      });
    }
  }

  function handleDelete(path: string) {
    setLocalFiles(prev => prev.filter(f => f.path !== path));
    startTransition(() => deleteImage(path));
  }

  function handleDeleteAllUnused() {
    const toDelete = localFiles.filter(f => !f.inUse && !f.path.startsWith('__temp__'));
    setLocalFiles(prev => prev.filter(f => f.inUse || f.path.startsWith('__temp__')));
    startTransition(async () => {
      await Promise.all(toDelete.map(f => deleteImage(f.path)));
    });
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  const filterBtn = (label: string, value: Filter, count: number) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      style={{
        padding: '5px 12px', fontSize: 11, fontWeight: 500, borderRadius: 4,
        border: `1px solid ${filter === value ? 'var(--dash-black)' : 'var(--dash-border)'}`,
        background: filter === value ? 'var(--dash-black)' : 'transparent',
        color: filter === value ? '#fff' : 'var(--dash-muted)',
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      {label} <span style={{ opacity: 0.6 }}>({count})</span>
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--dash-black)' }}>CDN Manager</h1>
          <p style={{ fontSize: 12, color: 'var(--dash-muted)', marginTop: 4 }}>
            {realFiles.length} file{realFiles.length !== 1 ? 's' : ''} · {fmt(totalSize)}
          </p>
        </div>
        <button
          className="btn btn-primary"
          type="button"
          disabled={isPending}
          onClick={() => fileRef.current?.click()}
        >
          {isPending ? 'Uploading…' : '↑ Upload images'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => triggerUpload(e.target.files)}
      />

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          triggerUpload(e.dataTransfer.files);
        }}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragging ? 'var(--dash-black)' : 'var(--dash-border)'}`,
          borderRadius: 6, padding: '14px 20px', textAlign: 'center',
          color: 'var(--dash-muted)', fontSize: 12, marginBottom: 16,
          background: dragging ? 'rgba(0,0,0,0.02)' : 'transparent',
          transition: 'all 0.15s', cursor: 'pointer',
        }}
      >
        {isPending ? 'Uploading and compressing…' : 'Drop images here or click to upload — auto-compressed to WebP'}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {filterBtn('All', 'all', realFiles.length)}
          {filterBtn('In use', 'used', usedCount)}
          {filterBtn('Unused', 'unused', unusedCount)}
        </div>
        {unusedCount > 0 && (
          <button
            type="button"
            className="btn btn-danger"
            style={{ fontSize: 11, padding: '5px 12px' }}
            onClick={() => {
              if (confirm(`Delete all ${unusedCount} unused image${unusedCount !== 1 ? 's' : ''}?`)) {
                handleDeleteAllUnused();
              }
            }}
          >
            Delete all unused ({unusedCount})
          </button>
        )}
      </div>

      {/* Gallery grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {visible.map((file, i) => {
          const isTemp = file.path.startsWith('__temp__');
          return (
            <div key={file.path} style={{
              background: 'var(--dash-surface)',
              border: '1px solid var(--dash-border)',
              borderRadius: 6, overflow: 'hidden',
              opacity: isTemp ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}>
              <div style={{ position: 'relative', aspectRatio: '4/3', background: '#f3f4f6' }}>
                <Image src={file.url} alt={file.name} fill style={{ objectFit: 'cover' }} unoptimized priority={i === 0} />
                {/* Usage badge */}
                {!isTemp && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6,
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.04em',
                    padding: '2px 6px', borderRadius: 3,
                    background: file.inUse ? 'rgba(16,185,129,0.9)' : 'rgba(0,0,0,0.45)',
                    color: '#fff',
                  }}>
                    {file.inUse ? 'IN USE' : 'UNUSED'}
                  </div>
                )}
                {isTemp && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6,
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.04em',
                    padding: '2px 6px', borderRadius: 3,
                    background: 'rgba(99,102,241,0.9)', color: '#fff',
                  }}>
                    UPLOADING
                  </div>
                )}
              </div>
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: 11, color: 'var(--dash-black)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--dash-muted)', marginTop: 2 }}>
                  {fmt(file.size)}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '5px 0', fontSize: 10 }}
                    disabled={isTemp}
                    onClick={() => copyUrl(file.url)}
                  >
                    {copied === file.url ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ padding: '5px 10px', fontSize: 10 }}
                    disabled={isTemp}
                    onClick={() => handleDelete(file.path)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p style={{ color: 'var(--dash-muted)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
          {filter === 'all' ? 'No images yet. Upload something above.' : `No ${filter === 'used' ? 'in-use' : 'unused'} images.`}
        </p>
      )}
    </div>
  );
}
