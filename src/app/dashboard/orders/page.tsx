import Link from 'next/link';
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import type { Order } from '@/lib/types';

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '10px 20px',
  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em',
  color: 'var(--dash-muted)', borderBottom: '1px solid var(--dash-border)',
};
const TD: React.CSSProperties = { padding: '12px 20px', borderBottom: '1px solid var(--dash-border)' };

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  pending:    { bg: '#fef3c7', text: '#d97706' },
  processing: { bg: '#dbeafe', text: '#2563eb' },
  shipped:    { bg: '#ede9fe', text: '#7c3aed' },
  delivered:  { bg: '#dcfce7', text: '#16a34a' },
  cancelled:  { bg: '#fee2e2', text: '#dc2626' },
};

export default async function OrdersPage() {
  const { data } = await adminClient.from('orders').select('*').order('created_at', { ascending: false });
  const orders: Order[] = data ?? [];

  return (
    <div>
      <PageHeader title="Orders" />
      <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TH}>Order ID</th>
              <th style={TH}>Date</th>
              <th style={TH}>Status</th>
              <th style={TH}>Location</th>
              <th style={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => {
              const color = STATUS_COLOR[o.status] ?? { bg: '#f3f4f6', text: '#6b7280' };
              return (
                <tr key={o.id}>
                  <td style={{ ...TD, fontFamily: 'monospace', fontSize: 13 }}>{o.id}</td>
                  <td style={{ ...TD, color: 'var(--dash-muted)', fontSize: 13 }}>{o.date}</td>
                  <td style={TD}>
                    <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '3px 8px', background: color.bg, color: color.text }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ ...TD, color: 'var(--dash-muted)', fontSize: 13 }}>{o.location}</td>
                  <td style={TD}>
                    <Link href={`/dashboard/orders/${o.id}`} className="btn btn-secondary" style={{ padding: '5px 12px' }}>
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...TD, textAlign: 'center', color: 'var(--dash-muted)', padding: '40px 20px' }}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
