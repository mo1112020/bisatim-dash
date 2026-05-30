import { getOverviewStats } from '@/lib/queries';
import { PageHeader } from '@/components/PageHeader';
import { Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default async function OverviewPage() {
  const stats = await getOverviewStats();
  const cards = [
    { label: 'Products', value: stats.products, icon: Package, href: '/dashboard/products' },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag, href: '/dashboard/orders' },
  ];

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle={`${stats.products + stats.orders} total records across all sections`}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} prefetch className="dash-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--dash-muted)' }}>{label}</p>
              <Icon size={14} style={{ color: 'var(--dash-muted)' }} />
            </div>
            <p style={{ fontSize: 28, fontWeight: 600, color: 'var(--dash-black)' }}>{value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
