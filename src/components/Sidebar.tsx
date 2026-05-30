'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag,
  Tag, Image, Cloud, ChevronRight,
} from 'lucide-react';
import { SignOutButton } from '@/components/SignOutButton';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/categories', label: 'Categories', icon: Tag },
  { href: '/dashboard/site-images', label: 'Site Images', icon: Image },
  { href: '/dashboard/cdn', label: 'CDN Manager', icon: Cloud },
];

export function Sidebar() {
  const pathname = usePathname() ?? '/dashboard';
  const router = useRouter();

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: 220,
      display: 'flex', flexDirection: 'column',
      background: 'var(--dash-black)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ color: '#fff', fontWeight: 300, fontSize: 15, letterSpacing: '-0.01em' }}>Bisāṭim</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 3 }}>Vintage Archive</p>
      </div>
      <nav style={{ flex: 1, paddingTop: 8, overflowY: 'auto' }}>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch
              onMouseEnter={() => router.prefetch(href)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 24px',
                fontSize: 13, textDecoration: 'none',
                color: active ? '#fff' : 'rgba(255,255,255,0.42)',
                background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
              }}
            >
              <Icon size={14} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={11} style={{ opacity: 0.4 }} />}
            </Link>
          );
        })}
      </nav>
      <SignOutButton />
    </aside>
  );
}
