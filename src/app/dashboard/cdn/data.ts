import { unstable_cache } from 'next/cache';
import { adminClient } from '@/lib/supabase-admin';
import type { StorageFile } from './types';

const BUCKET = 'media';
const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

async function getUsedUrls(): Promise<Set<string>> {
  const used = new Set<string>();

  const [siteImages, products, blogs] = await Promise.all([
    adminClient.from('site_images').select('url'),
    adminClient.from('products').select('images'),
    adminClient.from('blog_posts').select('image'),
  ]);

  for (const row of siteImages.data ?? []) {
    if (row.url) used.add(row.url);
  }
  for (const row of products.data ?? []) {
    if (Array.isArray(row.images)) {
      for (const url of row.images) if (url) used.add(url);
    } else if (row.images) {
      used.add(row.images);
    }
  }
  for (const row of blogs.data ?? []) {
    if (row.image) used.add(row.image);
  }

  return used;
}

async function fetchCdnData(): Promise<StorageFile[]> {
  try {
    const [listResult, usedUrls] = await Promise.all([
      adminClient.storage.from(BUCKET).list('', { limit: 500 }),
      getUsedUrls(),
    ]);

    if (listResult.error) return [];

    return (listResult.data ?? [])
      .filter(f => f.name && f.name !== '.emptyFolderPlaceholder')
      .map(f => {
        const url = `${STORAGE_BASE}/${f.name}`;
        return {
          name: f.name,
          path: f.name,
          url,
          size: f.metadata?.size ?? 0,
          inUse: usedUrls.has(url),
        };
      });
  } catch {
    return [];
  }
}

export const loadCdnData = unstable_cache(fetchCdnData, ['cdn-data'], {
  revalidate: 60,
  tags: ['cdn', 'media'],
});
