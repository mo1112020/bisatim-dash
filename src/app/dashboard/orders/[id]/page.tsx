import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { updateOrderStatus } from '../actions';
import { notFound } from 'next/navigation';
import type { Order } from '@/lib/types';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await adminClient.from('orders').select('*').eq('id', id).single();
  if (!data) notFound();
  const order: Order = data;

  async function handleUpdate(fd: FormData) {
    'use server';
    await updateOrderStatus(id, fd.get('status') as string);
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <PageHeader title={`Order ${order.id}`} breadcrumb={[{ label: 'Orders', href: '/dashboard/orders' }]} />
      <div style={{ padding: 28, background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {[
            { label: 'Date', value: order.date },
            { label: 'Location', value: order.location },
            { label: 'Est. Delivery', value: order.estimated_delivery },
            { label: 'Status', value: order.status },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--dash-muted)', marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 14 }}>{value}</p>
            </div>
          ))}
        </div>

        {order.items?.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--dash-muted)', marginBottom: 10 }}>Items</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {order.items.map((item, i) => (
                <li key={i} style={{ fontSize: 13, paddingLeft: 12, borderLeft: '2px solid var(--dash-border)' }}>{item}</li>
              ))}
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
