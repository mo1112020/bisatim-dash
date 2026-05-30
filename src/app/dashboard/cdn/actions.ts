'use server';
import { revalidateTag } from 'next/cache';
import { adminClient } from '@/lib/supabase-admin';

const BUCKET = 'media';

export async function deleteImage(path: string) {
  if (!path) throw new Error('No path provided');
  const { error } = await adminClient.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Storage delete failed: ${error.message}`);
  revalidateTag('media');
  revalidateTag('cdn');
}
