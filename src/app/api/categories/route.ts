import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase-admin';
import type { Category } from '@/lib/types';

export async function GET() {
  const { data, error } = await adminClient
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data ?? []) as Category[]);
}
