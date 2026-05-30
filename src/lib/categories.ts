import { getCategories as getCachedCategories } from '@/lib/queries';
import type { Category } from '@/lib/types';

export async function listCategories(): Promise<Category[]> {
  return getCachedCategories();
}

export function categoriesForProduct(all: Category[], assignedSlugs: string[] = []): Category[] {
  const assigned = new Set(assignedSlugs);
  return all.filter(c => c.active || assigned.has(c.slug));
}
