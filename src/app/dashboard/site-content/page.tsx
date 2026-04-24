import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { saveSiteSettings } from './actions';

const SETTINGS: Record<string, { label: string; value: string; type: 'text' | 'textarea' | 'url'; group: string }> = {
  promo_text:            { label: 'Promo Banner Text',              value: 'Mid-Season Sale: Up to 40% off Vintage Collections!', type: 'text',     group: 'Home' },
  hero_badge:            { label: 'Hero Badge',                     value: 'The Summer Edit',                                     type: 'text',     group: 'Home' },
  hero_title:            { label: 'Hero Title',                     value: 'Artisan',                                             type: 'text',     group: 'Home' },
  hero_title_italic:     { label: 'Hero Title (italic part)',       value: 'Masterpieces',                                        type: 'text',     group: 'Home' },
  hero_subtitle:         { label: 'Hero Subtitle',                  value: 'Elevate your home with our curated selection…',       type: 'textarea', group: 'Home' },
  promo_members_title:   { label: 'Members Promo — Title',          value: 'Join our Rewards Club & Get $50 Off.',                type: 'text',     group: 'Home' },
  promo_members_sub:     { label: 'Members Promo — Subtitle',       value: 'Unlock early access to sales…',                      type: 'textarea', group: 'Home' },
  trust_1_label:         { label: 'Trust Badge 1 — Label',          value: 'Verified Integrity',       type: 'text', group: 'Trust' },
  trust_1_sub:           { label: 'Trust Badge 1 — Subtext',        value: 'Every rug certified',      type: 'text', group: 'Trust' },
  trust_2_label:         { label: 'Trust Badge 2 — Label',          value: 'Free Shipping',            type: 'text', group: 'Trust' },
  trust_2_sub:           { label: 'Trust Badge 2 — Subtext',        value: 'Worldwide, fully insured', type: 'text', group: 'Trust' },
  trust_3_label:         { label: 'Trust Badge 3 — Label',          value: '30-Day Returns',           type: 'text', group: 'Trust' },
  trust_3_sub:           { label: 'Trust Badge 3 — Subtext',        value: 'Hassle-free policy',       type: 'text', group: 'Trust' },
  trust_4_label:         { label: 'Trust Badge 4 — Label',          value: 'Direct from Makers',       type: 'text', group: 'Trust' },
  trust_4_sub:           { label: 'Trust Badge 4 — Subtext',        value: 'No middlemen',             type: 'text', group: 'Trust' },
  contact_address:       { label: 'Address',                        value: 'Grand Bazaar Quarter, Istanbul, Turkey', type: 'text', group: 'Contact' },
  contact_phone:         { label: 'Phone',                          value: '+90 212 000 0000',     type: 'text',  group: 'Contact' },
  social_instagram:      { label: 'Instagram URL',                  value: 'https://www.instagram.com/bisatim_/', type: 'url', group: 'Social' },
  social_pinterest:      { label: 'Pinterest URL',                  value: 'https://tr.pinterest.com/bisatim_/', type: 'url', group: 'Social' },
  social_tiktok:         { label: 'TikTok URL',                     value: 'https://www.tiktok.com/@bisatim_',    type: 'url', group: 'Social' },
  footer_shipping_title: { label: 'Footer — Shipping Title',        value: 'Free Worldwide Shipping', type: 'text', group: 'Footer' },
  footer_shipping_desc:  { label: 'Footer — Shipping Description',  value: 'Every rug is hand-packed and insured.', type: 'text', group: 'Footer' },
};

const GROUPS = ['Home', 'Trust', 'Contact', 'Social', 'Footer'];

export default async function SiteContentPage() {
  const { data } = await adminClient.from('site_settings').select('key, value');
  const stored: Record<string, string> = {};
  for (const row of data ?? []) stored[row.key] = row.value;

  return (
    <div style={{ maxWidth: 680 }}>
      <PageHeader title="Site Content" />
      <form action={saveSiteSettings} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {GROUPS.map(group => {
          const keys = Object.entries(SETTINGS).filter(([, def]) => def.group === group);
          return (
            <section key={group} style={{ padding: 24, background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
              <h2 style={{
                fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em',
                color: 'var(--dash-muted)', paddingBottom: 14, marginBottom: 16,
                borderBottom: '1px solid var(--dash-border)',
              }}>{group}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {keys.map(([key, def]) => (
                  <div key={key}>
                    <label>{def.label}</label>
                    {def.type === 'textarea'
                      ? <textarea name={key} defaultValue={stored[key] ?? def.value} style={{ minHeight: 80 }} />
                      : <input name={key} type={def.type} defaultValue={stored[key] ?? def.value} />}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        <div>
          <button type="submit" className="btn btn-primary">Save all settings</button>
        </div>
      </form>
    </div>
  );
}
