import { unstable_cache } from 'next/cache';
import { adminClient } from '@/lib/supabase-admin';
import type { Product, Order, Category } from '@/lib/types';

export const getProducts = unstable_cache(
  async () => {
    const { data } = await adminClient.from('products').select('*').order('created_at', { ascending: false });
    return (data ?? []) as Product[];
  },
  ['products-list'],
  { tags: ['products'], revalidate: 300 },
);

export const getOrders = unstable_cache(
  async () => {
    const { data } = await adminClient.from('orders').select('*').order('created_at', { ascending: false });
    return (data ?? []) as Order[];
  },
  ['orders-list'],
  { tags: ['orders'], revalidate: 300 },
);

export const getCategories = unstable_cache(
  async () => {
    const { data } = await adminClient.from('categories').select('*').order('sort_order');
    return (data ?? []) as Category[];
  },
  ['categories-list'],
  { tags: ['categories'], revalidate: 300 },
);

export const getOverviewStats = unstable_cache(
  async () => {
    const [products, orders] = await Promise.all([
      adminClient.from('products').select('id', { count: 'exact', head: true }),
      adminClient.from('orders').select('id', { count: 'exact', head: true }),
    ]);
    return {
      products: products.count ?? 0,
      orders: orders.count ?? 0,
    };
  },
  ['overview-stats'],
  { tags: ['overview', 'products', 'orders'], revalidate: 300 },
);
