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
];

export default async function SiteImagesPage() {
  const { data } = await adminClient.from('site_images').select('key, url');
  const stored: Record<string, string> = {};
  for (const row of data ?? []) stored[row.key] = row.url;
  const slotCount = SECTIONS.reduce((n, s) => n + s.slots.length, 0);

  return (
    <div>
      <PageHeader
        title="Site Images"
        subtitle={`${slotCount} image slot${slotCount !== 1 ? 's' : ''} across ${SECTIONS.length} sections`}
      />
      <form action={saveSiteImages} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {SECTIONS.map(section => (
          <div key={section.title}>
            <div style={{ marginBottom: 12 }}>
              <div className="dash-section-title">{section.title}</div>
              <div className="dash-section-desc">{section.page}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {section.slots.map(({ key, label, hint }) => {
                const url = stored[key] ?? '';
                return (
                  <div key={`${section.title}-${key}`} className="dash-panel" style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start', padding: 14,
                  }}>
                    <div style={{ position: 'relative', width: 80, height: 54, flexShrink: 0, background: '#f3f4f6', overflow: 'hidden', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

        <div>
          <button type="submit" className="btn btn-primary">Save all images</button>
        </div>
      </form>
    </div>
  );
}
