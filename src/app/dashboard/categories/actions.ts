'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createCategory(fd: FormData) {
  const { error } = await adminClient.from('categories').insert({
    name: fd.get('name'),
    slug: fd.get('slug'),
    badge: fd.get('badge'),
    image_url: fd.get('image_url'),
    sort_order: Number(fd.get('sort_order') ?? 0),
    active: true,
  });
  if (error) throw new Error(error.message);
  revalidateTag('categories');
  revalidatePath('/dashboard/categories');
}

export async function toggleCategory(id: string, active: boolean) {
  await adminClient.from('categories').update({ active }).eq('id', id);
  revalidateTag('categories');
  revalidatePath('/dashboard/categories');
}

export async function deleteCategory(id: string) {
  await adminClient.from('categories').delete().eq('id', id);
  revalidateTag('categories');
  revalidatePath('/dashboard/categories');
}
