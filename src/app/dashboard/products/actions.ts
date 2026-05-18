'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function createProduct(fd: FormData) {
  const images = (fd.get('images') as string).split('\n').map(s => s.trim()).filter(Boolean);
  const rooms = (fd.get('rooms') as string).split(',').map(s => s.trim()).filter(Boolean);
  const { error } = await adminClient.from('products').insert({
    name: fd.get('name'),
    category: fd.get('category'),
    price: Number(fd.get('price')),
    description: fd.get('description'),
    images,
    dimensions: fd.get('dimensions'),
    size_category: fd.get('size_category'),
    rooms,
    material: fd.get('material'),
    origin: fd.get('origin'),
    stock: Number(fd.get('stock')),
  });
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/products');
}

export async function updateProduct(id: string, fd: FormData) {
  const images = (fd.get('images') as string).split('\n').map(s => s.trim()).filter(Boolean);
  const rooms = (fd.get('rooms') as string).split(',').map(s => s.trim()).filter(Boolean);
  const { error } = await adminClient.from('products').update({
    name: fd.get('name'),
    category: fd.get('category'),
    price: Number(fd.get('price')),
    description: fd.get('description'),
    images,
    dimensions: fd.get('dimensions'),
    size_category: fd.get('size_category'),
    rooms,
    material: fd.get('material'),
    origin: fd.get('origin'),
    stock: Number(fd.get('stock')),
  }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/products');
}

export async function deleteProduct(id: string) {
  await adminClient.from('products').delete().eq('id', id);
  revalidatePath('/dashboard/products');
}
