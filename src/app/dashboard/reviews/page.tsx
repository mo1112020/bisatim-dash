import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { deleteTestimonial, createTestimonial } from './actions';
import { DeleteButton } from '@/components/DeleteButton';
import type { Testimonial } from '@/lib/types';

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '10px 20px',
  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em',
  color: 'var(--dash-muted)', borderBottom: '1px solid var(--dash-border)',
};
const TD: React.CSSProperties = { padding: '12px 20px', borderBottom: '1px solid var(--dash-border)' };

export default async function ReviewsPage() {
  const { data } = await adminClient.from('testimonials').select('*').order('created_at', { ascending: false });
  const testimonials: Testimonial[] = data ?? [];

  return (
    <div>
      <PageHeader title="Reviews & Testimonials" />

      <details style={{ marginBottom: 20 }}>
        <summary className="btn btn-primary" style={{ cursor: 'pointer', listStyle: 'none', display: 'inline-flex' }}>
          + Add testimonial
        </summary>
        <form action={createTestimonial} style={{
          marginTop: 12, padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
          background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
        }}>
          <div><label>Name</label><input name="name" required /></div>
          <div><label>Location</label><input name="location" /></div>
          <div><label>Title (product / topic)</label><input name="title" /></div>
          <div><label>Category</label><input name="category" /></div>
          <div><label>Rating (1–5)</label><input name="rating" type="number" min="1" max="5" defaultValue="5" /></div>
          <div><label>Date</label><input name="date" defaultValue={new Date().getFullYear().toString()} /></div>
          <div style={{ gridColumn: '1 / -1' }}><label>Review Text</label><textarea name="text" required /></div>
          <div style={{ gridColumn: '1 / -1' }}><button type="submit" className="btn btn-primary">Add review</button></div>
        </form>
      </details>

      <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TH}>Name</th>
              <th style={TH}>Rating</th>
              <th style={TH}>Category</th>
              <th style={TH}>Text</th>
              <th style={TH}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map(t => (
              <tr key={t.id}>
                <td style={TD}>
                  <span style={{ fontWeight: 500 }}>{t.name}</span>
                  <br />
                  <span style={{ fontSize: 11, color: 'var(--dash-muted)' }}>{t.location}</span>
                </td>
                <td style={TD}>
                  <span style={{ fontSize: 13 }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                </td>
                <td style={{ ...TD, fontSize: 13, color: 'var(--dash-muted)' }}>{t.category}</td>
                <td style={{ ...TD, maxWidth: 280 }}>
                  <p style={{ fontSize: 13, color: 'var(--dash-muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {t.text}
                  </p>
                </td>
                <td style={TD}>
                  <DeleteButton action={deleteTestimonial.bind(null, t.id)} confirm="Delete this review?" />
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...TD, textAlign: 'center', color: 'var(--dash-muted)', padding: '40px 20px' }}>
                  No reviews yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
