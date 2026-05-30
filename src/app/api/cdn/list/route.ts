import { NextResponse } from 'next/server';
import { listMediaFiles } from '@/lib/media-files';

export async function GET() {
  const files = await listMediaFiles();
  return NextResponse.json(files);
}
