import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { saveSiteImages } from './actions';
import Image from 'next/image';

type ImageSlot = { key: string; label: string; hint?: string; fallback: string };
type Section = { title: string; page: string; slots: ImageSlot[] };

const SECTIONS: Section[] = [
  {
    title: 'Hero Carousel',
    page: 'Home page — full-screen slideshow at the top',
    slots: [
      { key: 'hero',             label: 'Slide 1', hint: 'Title & subtitle editable in Site Content',  fallback: '' },
      { key: 'promo_split',      label: 'Slide 2', hint: 'Rare Acquisitions',                          fallback: '' },
      { key: 'lifestyle_3_hero', label: 'Slide 3', hint: 'From the Field',                             fallback: '' },
    ],
  },
  {
    title: 'Origin Grid',
    page: 'Home page — 3-panel full-bleed grid below the hero (Anatolia / Persia / Caucasus)',
    slots: [
      { key: 'lifestyle_1_hero', label: 'Anatolia',  hint: 'Left panel',   fallback: '' },
      { key: 'lifestyle_2_hero', label: 'Persia',    hint: 'Centre panel · also Full-Bleed Editorial below products', fallback: '' },
      { key: 'lifestyle_4_hero', label: 'Caucasus',  hint: 'Right panel',  fallback: '' },
    ],
  },
];

export default async function SiteImagesPage() {
  const { data } = await adminClient.from('site_images').select('key, url');
  const stored: Record<string, string> = {};
  for (const row of data ?? []) stored[row.key] = row.url;

  return (
    <div style={{ maxWidth: 720 }}>
      <PageHeader title="Site Images" />
      <form action={saveSiteImages} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {SECTIONS.map(section => (
          <div key={section.title}>
            {/* Section header */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dash-black)', letterSpacing: '-0.01em' }}>
                {section.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--dash-muted)', marginTop: 2 }}>
                {section.page}
              </div>
            </div>

            {/* Slots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {section.slots.map(({ key, label, hint }) => {
                const url = stored[key] ?? '';
                return (
                  <div key={`${section.title}-${key}`} style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start', padding: 14,
                    background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
                    borderRadius: 4,
                  }}>
                    <div style={{ position: 'relative', width: 80, height: 54, flexShrink: 0, background: '#f3f4f6', overflow: 'hidden', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {url
                        ? <Image src={url} alt={label} fill style={{ objectFit: 'cover' }} unoptimized />
                        : <span style={{ fontSize: 9, color: '#aaa', textAlign: 'center', padding: '0 4px' }}>No image set</span>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ marginBottom: 3 }}>
                        {label}
                        {hint && <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--dash-muted)', marginLeft: 6 }}>— {hint}</span>}
                      </label>
                      <input
                        name={key}
                        defaultValue={stored[key] ?? ''}
                        placeholder="Paste CDN URL from CDN Manager…"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ paddingTop: 4, paddingBottom: 32 }}>
          <button type="submit" className="btn btn-primary">Save all images</button>
        </div>
      </form>
    </div>
  );
}
