import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string }[];
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumb, action }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
      <div>
        {breadcrumb && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
            {breadcrumb.map((b, i) => (
              <span key={b.href} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {i > 0 && <ChevronRight size={10} style={{ color: 'var(--dash-muted)' }} />}
                <Link href={b.href} style={{
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--dash-muted)', textDecoration: 'none',
                }}>{b.label}</Link>
              </span>
            ))}
          </div>
        )}
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--dash-black)' }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 12, color: 'var(--dash-muted)', marginTop: 4 }}>{subtitle}</p>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}
