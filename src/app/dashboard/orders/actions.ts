'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(id: string, status: string) {
  await adminClient.from('orders').update({ status }).eq('id', id);
  revalidatePath('/dashboard/orders');
  revalidatePath(`/dashboard/orders/${id}`);
}
