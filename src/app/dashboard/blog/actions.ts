'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBlogPost(fd: FormData) {
  const { error } = await adminClient.from('blog_posts').insert({
    title: fd.get('title'),
    excerpt: fd.get('excerpt'),
    content: fd.get('content'),
    image: fd.get('image'),
    date: fd.get('date'),
    author: fd.get('author'),
    category: fd.get('category'),
    meta_description: fd.get('meta_description') || null,
  });
  if (error) redirect(`/dashboard/blog/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/dashboard/blog');
  redirect('/dashboard/blog');
}

export async function updateBlogPost(id: string, fd: FormData) {
  const { error } = await adminClient.from('blog_posts').update({
    title: fd.get('title'),
    excerpt: fd.get('excerpt'),
    content: fd.get('content'),
    image: fd.get('image'),
    date: fd.get('date'),
    author: fd.get('author'),
    category: fd.get('category'),
    meta_description: fd.get('meta_description') || null,
  }).eq('id', id);
  if (error) redirect(`/dashboard/blog/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath('/dashboard/blog');
  redirect('/dashboard/blog');
}

export async function deleteBlogPost(id: string) {
  await adminClient.from('blog_posts').delete().eq('id', id);
  revalidatePath('/dashboard/blog');
  redirect('/dashboard/blog');
}
