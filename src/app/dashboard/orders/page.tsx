import Link from 'next/link';
import { getOrders } from '@/lib/queries';
import { PageHeader } from '@/components/PageHeader';
import { DashTable, DashTh, DashTd, DashEmpty } from '@/components/DashTable';
import type { Order, OrderLocation } from '@/lib/types';

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  pending:    { bg: '#fef3c7', text: '#d97706' },
  processing: { bg: '#dbeafe', text: '#2563eb' },
  shipped:    { bg: '#ede9fe', text: '#7c3aed' },
  delivered:  { bg: '#dcfce7', text: '#16a34a' },
  cancelled:  { bg: '#fee2e2', text: '#dc2626' },
};

function formatLocation(location: Order['location']) {
  if (!location) return '—';
  if (typeof location === 'string') return location;
  const loc = location as OrderLocation;
  return loc.city || loc.address || loc.name || '—';
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} order${orders.length !== 1 ? 's' : ''}`}
      />
      <DashTable>
        <thead>
          <tr>
            <DashTh>Order ID</DashTh>
            <DashTh>Date</DashTh>
            <DashTh>Status</DashTh>
            <DashTh>Location</DashTh>
            <DashTh>Actions</DashTh>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => {
            const color = STATUS_COLOR[o.status] ?? { bg: '#f3f4f6', text: '#6b7280' };
            return (
              <tr key={o.id}>
                <DashTd style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.id.slice(0, 8)}…</DashTd>
                <DashTd style={{ color: 'var(--dash-muted)' }}>{o.date}</DashTd>
                <DashTd>
                  <span className="dash-badge" style={{ background: color.bg, color: color.text, fontSize: 10, padding: '3px 8px' }}>
                    {o.status}
                  </span>
                </DashTd>
                <DashTd style={{ color: 'var(--dash-muted)' }}>{formatLocation(o.location)}</DashTd>
                <DashTd>
                  <Link href={`/dashboard/orders/${o.id}`} className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: 10 }}>
                    View
                  </Link>
                </DashTd>
              </tr>
            );
          })}
          {orders.length === 0 && <DashEmpty colSpan={5}>No orders yet.</DashEmpty>}
        </tbody>
      </DashTable>
    </div>
  );
}
