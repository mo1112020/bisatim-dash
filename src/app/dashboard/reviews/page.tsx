import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { DashTable, DashTh, DashTd, DashEmpty } from '@/components/DashTable';
import { deleteTestimonial, createTestimonial } from './actions';
import { DeleteButton } from '@/components/DeleteButton';
import type { Testimonial } from '@/lib/types';

export default async function ReviewsPage() {
  const { data } = await adminClient.from('testimonials').select('*').order('created_at', { ascending: false });
  const testimonials: Testimonial[] = data ?? [];

  return (
    <div>
      <PageHeader
        title="Reviews & Testimonials"
        subtitle={`${testimonials.length} review${testimonials.length !== 1 ? 's' : ''}`}
      />

      <details style={{ marginBottom: 16 }}>
        <summary className="btn btn-primary" style={{ cursor: 'pointer', listStyle: 'none', display: 'inline-flex', fontSize: 11 }}>
          + Add testimonial
        </summary>
        <form action={createTestimonial} className="dash-form-panel" style={{
          marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
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

      <DashTable>
        <thead>
          <tr>
            <DashTh>Name</DashTh>
            <DashTh>Rating</DashTh>
            <DashTh>Category</DashTh>
            <DashTh>Text</DashTh>
            <DashTh>Delete</DashTh>
          </tr>
        </thead>
        <tbody>
          {testimonials.map(t => (
            <tr key={t.id}>
              <DashTd>
                <span style={{ fontWeight: 500 }}>{t.name}</span>
                <br />
                <span style={{ fontSize: 11, color: 'var(--dash-muted)' }}>{t.location}</span>
              </DashTd>
              <DashTd>
                <span>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
              </DashTd>
              <DashTd style={{ color: 'var(--dash-muted)' }}>{t.category}</DashTd>
              <DashTd style={{ maxWidth: 280 }}>
                <p style={{ color: 'var(--dash-muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {t.text}
                </p>
              </DashTd>
              <DashTd>
                <DeleteButton action={deleteTestimonial.bind(null, t.id)} confirm="Delete this review?" />
              </DashTd>
            </tr>
          ))}
          {testimonials.length === 0 && <DashEmpty colSpan={5}>No reviews yet.</DashEmpty>}
        </tbody>
      </DashTable>
    </div>
  );
}
