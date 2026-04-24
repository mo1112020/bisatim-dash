'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function deleteTestimonial(id: string) {
  await adminClient.from('testimonials').delete().eq('id', id);
  revalidatePath('/dashboard/reviews');
}

export async function createTestimonial(fd: FormData) {
  const { error } = await adminClient.from('testimonials').insert({
    name: fd.get('name'),
    location: fd.get('location'),
    title: fd.get('title'),
    text: fd.get('text'),
    rating: Number(fd.get('rating')),
    category: fd.get('category'),
    date: fd.get('date'),
  });
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/reviews');
}
