import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { saveSiteImages } from './actions';
import Image from 'next/image';

const IMAGE_KEYS: { key: string; label: string; fallback: string }[] = [
  { key: 'hero',             label: 'Home — Hero Background',        fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400' },
  { key: 'promo_split',      label: 'Home — Promo Section',          fallback: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400' },
  { key: 'about_artisan',    label: 'About — Artisan Section',       fallback: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=400' },
  { key: 'lifestyle_1_hero',  label: 'Lifestyle Card 1 — Hero',      fallback: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400' },
  { key: 'lifestyle_1_thumb', label: 'Lifestyle Card 1 — Thumbnail', fallback: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=400' },
  { key: 'lifestyle_2_hero',  label: 'Lifestyle Card 2 — Hero',      fallback: 'https://images.unsplash.com/photo-1548199973-03f0f5fc9730?q=80&w=400' },
  { key: 'lifestyle_2_thumb', label: 'Lifestyle Card 2 — Thumbnail', fallback: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=400' },
  { key: 'lifestyle_3_hero',  label: 'Lifestyle Card 3 — Hero',      fallback: 'https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=400' },
  { key: 'lifestyle_3_thumb', label: 'Lifestyle Card 3 — Thumbnail', fallback: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400' },
  { key: 'lifestyle_4_hero',  label: 'Lifestyle Card 4 — Hero',      fallback: 'https://images.unsplash.com/photo-1616486338812-3dadae4ddf4c?q=80&w=400' },
  { key: 'lifestyle_4_thumb', label: 'Lifestyle Card 4 — Thumbnail', fallback: 'https://images.unsplash.com/photo-1585412727339-54e4be3f3467?q=80&w=400' },
];

export default async function SiteImagesPage() {
  const { data } = await adminClient.from('site_images').select('key, url');
  const stored: Record<string, string> = {};
  for (const row of data ?? []) stored[row.key] = row.url;

  return (
    <div style={{ maxWidth: 680 }}>
      <PageHeader title="Site Images" />
      <form action={saveSiteImages} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {IMAGE_KEYS.map(({ key, label, fallback }) => {
          const url = stored[key] ?? fallback;
          return (
            <div key={key} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start', padding: 16,
              background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
            }}>
              <div style={{ position: 'relative', width: 96, height: 64, flexShrink: 0, background: '#f3f4f6', overflow: 'hidden' }}>
                <Image src={url} alt={label} fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
              <div style={{ flex: 1 }}>
                <label>{label}</label>
                <input name={key} defaultValue={stored[key] ?? ''} placeholder={fallback} />
              </div>
            </div>
          );
        })}
        <div style={{ paddingTop: 8 }}>
          <button type="submit" className="btn btn-primary">Save images</button>
        </div>
      </form>
    </div>
  );
}
