'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateOrderStatus(id: string, status: string) {
  await adminClient.from('orders').update({ status }).eq('id', id);
  revalidateTag('orders');
  revalidateTag('overview');
  revalidatePath('/dashboard/orders');
  revalidatePath(`/dashboard/orders/${id}`);
}
