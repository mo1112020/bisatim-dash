import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase-admin';
import type { StorageFile } from '@/app/dashboard/cdn/types';

const BUCKET = 'media';
const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + '.webp';
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const file = fd.get('file') as File;
    if (!file || !file.size) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const sharp = (await import('sharp')).default;
    const buffer = Buffer.from(await file.arrayBuffer());
    const pipeline = sharp(buffer).resize({ width: 1920, withoutEnlargement: true });

    let quality = 80;
    let compressed = await pipeline.clone().webp({ quality }).toBuffer();
    while (compressed.length > 15 * 1024 * 1024 && quality > 20) {
      quality -= 10;
      compressed = await pipeline.clone().webp({ quality }).toBuffer();
    }

    const slug = slugify(file.name);

    const { error } = await adminClient.storage.from(BUCKET).upload(slug, compressed, {
      contentType: 'image/webp',
      upsert: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result: StorageFile = {
      name: slug,
      path: slug,
      url: `${STORAGE_BASE}/${slug}`,
      size: compressed.length,
      inUse: false,
    };

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
