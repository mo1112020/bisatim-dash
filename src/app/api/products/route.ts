import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase-admin';
import type { Product } from '@/lib/types';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');

  const { data, error } = await adminClient
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let products = (data ?? []) as Product[];

  if (category) {
    products = products.filter(p =>
      Array.isArray(p.categories) && p.categories.includes(category),
    );
  }

  return NextResponse.json(products);
}
