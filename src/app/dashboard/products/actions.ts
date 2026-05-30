'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(fd: FormData) {
  const images = (fd.get('images') as string).split('\n').map(s => s.trim()).filter(Boolean);
  const categories = fd.getAll('categories').map(String).filter(Boolean);
  const { error } = await adminClient.from('products').insert({
    name: fd.get('name'),
    categories,
    price: Number(fd.get('price')),
    description: fd.get('description'),
    images,
    dimensions: fd.get('dimensions'),
    dimensions_ft: fd.get('dimensions_ft'),
    material: fd.get('material'),
    origin: fd.get('origin'),
    stock: Number(fd.get('stock')),
  });
  if (error) redirect(`/dashboard/products/new?error=${encodeURIComponent(error.message)}`);
  revalidateTag('products');
  revalidateTag('overview');
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function updateProduct(id: string, fd: FormData) {
  const images = (fd.get('images') as string).split('\n').map(s => s.trim()).filter(Boolean);
  const categories = fd.getAll('categories').map(String).filter(Boolean);
  const { error } = await adminClient.from('products').update({
    name: fd.get('name'),
    categories,
    price: Number(fd.get('price')),
    description: fd.get('description'),
    images,
    dimensions: fd.get('dimensions'),
    dimensions_ft: fd.get('dimensions_ft'),
    material: fd.get('material'),
    origin: fd.get('origin'),
    stock: Number(fd.get('stock')),
  }).eq('id', id);
  if (error) redirect(`/dashboard/products/${id}?error=${encodeURIComponent(error.message)}`);
  revalidateTag('products');
  revalidateTag('overview');
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
  await adminClient.from('products').delete().eq('id', id);
  revalidateTag('products');
  revalidateTag('overview');
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}
