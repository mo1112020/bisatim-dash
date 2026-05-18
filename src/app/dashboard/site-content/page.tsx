import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { saveSiteSettings } from './actions';

const SETTINGS = [
  { key: 'social_instagram', label: 'Instagram URL', type: 'url'  as const, value: 'https://www.instagram.com/bisatim_/' },
  { key: 'social_pinterest', label: 'Pinterest URL', type: 'url'  as const, value: 'https://tr.pinterest.com/bisatim_/' },
  { key: 'social_tiktok',    label: 'TikTok URL',    type: 'url'  as const, value: 'https://www.tiktok.com/@bisatim_'   },
  { key: 'contact_phone',    label: 'Phone',         type: 'text' as const, value: '+90 212 000 0000'                   },
  { key: 'contact_email',    label: 'Email',         type: 'text' as const, value: ''                                   },
];

export default async function SiteContentPage() {
  const { data } = await adminClient.from('site_settings').select('key, value');
  const stored: Record<string, string> = {};
  for (const row of data ?? []) stored[row.key] = row.value;

  return (
    <div style={{ maxWidth: 480 }}>
      <PageHeader title="Site Content" />
      <form action={saveSiteSettings} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <section style={{ padding: 24, background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {SETTINGS.map(({ key, label, type, value }) => (
              <div key={key}>
                <label>{label}</label>
                <input name={key} type={type} defaultValue={stored[key] ?? value} />
              </div>
            ))}
          </div>
        </section>
        <div>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
