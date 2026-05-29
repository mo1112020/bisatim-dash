import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { Package, FileText, ShoppingBag, Star } from 'lucide-react';

async function getStats() {
  const [products, blog, orders, testimonials] = await Promise.all([
    adminClient.from('products').select('id', { count: 'exact', head: true }),
    adminClient.from('blog_posts').select('id', { count: 'exact', head: true }),
    adminClient.from('orders').select('id', { count: 'exact', head: true }),
    adminClient.from('testimonials').select('id', { count: 'exact', head: true }),
  ]);
  return {
    products: products.count ?? 0,
    blog: blog.count ?? 0,
    orders: orders.count ?? 0,
    reviews: testimonials.count ?? 0,
  };
}

export default async function OverviewPage() {
  const stats = await getStats();
  const cards = [
    { label: 'Products', value: stats.products, icon: Package, href: '/dashboard/products' },
    { label: 'Blog Posts', value: stats.blog, icon: FileText, href: '/dashboard/blog' },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag, href: '/dashboard/orders' },
    { label: 'Reviews', value: stats.reviews, icon: Star, href: '/dashboard/reviews' },
  ];

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle={`${stats.products + stats.blog + stats.orders + stats.reviews} total records across all sections`}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {cards.map(({ label, value, icon: Icon, href }) => (
          <a key={label} href={href} className="dash-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--dash-muted)' }}>{label}</p>
              <Icon size={14} style={{ color: 'var(--dash-muted)' }} />
            </div>
            <p style={{ fontSize: 28, fontWeight: 600, color: 'var(--dash-black)' }}>{value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
