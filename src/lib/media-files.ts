import { unstable_cache } from 'next/cache';
import { adminClient } from '@/lib/supabase-admin';

const BUCKET = 'media';

export type MediaFile = { name: string; url: string };

async function fetchMediaFiles(): Promise<MediaFile[]> {
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
  const { data, error } = await adminClient.storage.from(BUCKET).list('', { limit: 500 });
  if (error) return [];
  return (data ?? [])
    .filter(f => f.name && f.name !== '.emptyFolderPlaceholder')
    .map(f => ({ name: f.name!, url: `${base}/${f.name}` }));
}

export const getMediaFiles = unstable_cache(fetchMediaFiles, ['media-files'], {
  revalidate: 120,
  tags: ['media'],
});

export async function listMediaFiles(): Promise<MediaFile[]> {
  return getMediaFiles();
}
