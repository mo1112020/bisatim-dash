import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase-admin';

const BUCKET = 'media';
const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

export async function GET() {
  const { data, error } = await adminClient.storage.from(BUCKET).list('', { limit: 500 });
  if (error) return NextResponse.json([], { status: 200 });
  const files = (data ?? [])
    .filter(f => f.name && f.name !== '.emptyFolderPlaceholder')
    .map(f => ({ name: f.name, url: `${STORAGE_BASE}/${f.name}` }));
  return NextResponse.json(files);
}
