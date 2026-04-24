'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function saveSiteImages(fd: FormData) {
  const entries = Array.from(fd.entries());
  for (const [key, value] of entries) {
    if (!value) continue;
    await adminClient.from('site_images').upsert(
      { key, url: value as string },
      { onConflict: 'key' },
    );
  }
  revalidatePath('/dashboard/site-images');
}
