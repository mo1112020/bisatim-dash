'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function saveSiteSettings(fd: FormData) {
  const entries = Array.from(fd.entries());
  for (const [key, value] of entries) {
    await adminClient.from('site_settings').upsert(
      { key, value: value as string },
      { onConflict: 'key' },
    );
  }
  revalidatePath('/dashboard/site-content');
}
