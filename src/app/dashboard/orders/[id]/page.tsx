import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { updateOrderStatus } from '../actions';
import { notFound } from 'next/navigation';
import type { Order, OrderItem, OrderLocation } from '@/lib/types';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  pending:    { bg: '#fef3c7', text: '#d97706' },
  processing: { bg: '#dbeafe', text: '#2563eb' },
  shipped:    { bg: '#ede9fe', text: '#7c3aed' },
  delivered:  { bg: '#dcfce7', text: '#16a34a' },
  cancelled:  { bg: '#fee2e2', text: '#dc2626' },
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await adminClient.from('orders').select('*').eq('id', id).single();
  if (!data) notFound();
  const order: Order = data;
  const color = STATUS_COLOR[order.status] ?? { bg: '#f3f4f6', text: '#6b7280' };

  async function handleUpdate(fd: FormData) {
    'use server';
    await updateOrderStatus(id, fd.get('status') as string);
  }

  return (
    <div>
      <PageHeader
        title={`Order ${order.id.slice(0, 8)}…`}
        subtitle={`${order.date} · ${order.items?.length ?? 0} item${(order.items?.length ?? 0) !== 1 ? 's' : ''}`}
        breadcrumb={[{ label: 'Orders', href: '/dashboard/orders' }]}
      />
      <div className="dash-form-panel">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {[
            { label: 'Date', value: order.date },
            { label: 'Est. Delivery', value: order.estimated_delivery || '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--dash-muted)', marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 14 }}>{value}</p>
            </div>
          ))}
          <div>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--dash-muted)', marginBottom: 4 }}>Status</p>
            <span className="dash-badge" style={{ background: color.bg, color: color.text, fontSize: 10, padding: '3px 8px' }}>
              {order.status}
            </span>
          </div>
        </div>

        {order.location && (
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--dash-border)' }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--dash-muted)', marginBottom: 10 }}>Delivery Location</p>
            {typeof order.location === 'string' ? (
              <p style={{ fontSize: 14 }}>{order.location}</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {(Object.entries(order.location as OrderLocation) as [string, string | undefined][])
                  .filter(([, v]) => v)
                  .map(([key, value]) => (
                    <div key={key}>
                      <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--dash-muted)', marginBottom: 2 }}>{key}</p>
                      <p style={{ fontSize: 13 }}>{value}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {order.items?.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--dash-muted)', marginBottom: 10 }}>Items</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {order.items.map((item, i) => {
                if (typeof item === 'string') {
                  return (
                    <li key={i} style={{ fontSize: 13, padding: '8px 12px', borderLeft: '2px solid var(--dash-border)', background: 'rgba(0,0,0,0.015)', borderRadius: '0 4px 4px 0' }}>{item}</li>
                  );
                }
                const o = item as OrderItem;
                return (
                  <li key={i} style={{ fontSize: 13, padding: '8px 12px', borderLeft: '2px solid var(--dash-border)', background: 'rgba(0,0,0,0.015)', borderRadius: '0 4px 4px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{o.name ?? o.id}</span>
                    <span style={{ color: 'var(--dash-muted)', marginLeft: 16 }}>
                      {o.quantity != null && `x${o.quantity}`}
                      {o.price != null && ` — ${o.price} SAR`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div style={{ paddingTop: 20, borderTop: '1px solid var(--dash-border)' }}>
          <form action={handleUpdate}>
            <label>Update Status</label>
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <select name="status" defaultValue={order.status} style={{ flex: 1 }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
