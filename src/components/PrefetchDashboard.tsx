'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ROUTES = [
  '/dashboard',
  '/dashboard/products',
  '/dashboard/orders',
  '/dashboard/categories',
  '/dashboard/site-images',
  '/dashboard/cdn',
];

export function PrefetchDashboard() {
  const router = useRouter();

  useEffect(() => {
    for (const route of ROUTES) router.prefetch(route);
  }, [router]);

  return null;
}
