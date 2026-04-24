# Bisatim Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full admin dashboard at `bisatimdash/` that lets the team manage every editable entity in the bisatim.com frontend.

**Architecture:** Next.js 15 App Router with Supabase Auth protecting all `/dashboard/*` routes via middleware. Server Actions handle all mutations with the service-role key (never exposed to the browser). UI is plain Tailwind CSS — no component library — matching the bisatim aesthetic.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, @supabase/supabase-js, @supabase/ssr, lucide-react

---

## File Map

```
bisatimdash/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx               – root layout (font, base styles)
│   │   ├── page.tsx                 – redirect → /dashboard
│   │   ├── login/page.tsx           – email/password login
│   │   └── dashboard/
│   │       ├── layout.tsx           – sidebar + auth guard
│   │       ├── page.tsx             – overview stats
│   │       ├── products/
│   │       │   ├── page.tsx         – product list
│   │       │   ├── new/page.tsx     – create product
│   │       │   └── [id]/page.tsx    – edit product
│   │       ├── blog/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── orders/
│   │       │   ├── page.tsx         – order list
│   │       │   └── [id]/page.tsx    – order detail + status update
│   │       ├── reviews/page.tsx     – testimonials list + delete
│   │       ├── categories/page.tsx  – categories CRUD (inline)
│   │       ├── site-content/page.tsx – site_settings key/value editor
│   │       └── site-images/page.tsx  – site_images URL editor
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── PageHeader.tsx
│   │   ├── DataTable.tsx            – reusable sortable table
│   │   └── FormField.tsx            – label + input wrapper
│   ├── lib/
│   │   ├── supabase-browser.ts      – createBrowserClient()
│   │   ├── supabase-server.ts       – createServerClient() (cookies)
│   │   ├── supabase-admin.ts        – createClient(SERVICE_ROLE)
│   │   └── types.ts                 – shared TS types for all tables
│   └── middleware.ts                – protect /dashboard/* routes
├── .env.local
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

### Task 1: Scaffold project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `.env.local`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "bisatimdash",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start --port 3001"
  },
  "dependencies": {
    "next": "^15.3.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.49.4",
    "@supabase/ssr": "^0.6.1",
    "lucide-react": "^0.511.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "postcss": "^8"
  }
}
```

- [ ] **Step 2: Create next.config.ts**

```ts
import type { NextConfig } from 'next';
const config: NextConfig = {};
export default config;
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create postcss.config.mjs**

```js
const config = { plugins: { '@tailwindcss/postcss': {} } };
export default config;
```

- [ ] **Step 5: Create .env.local**

```env
NEXT_PUBLIC_SUPABASE_URL=https://lllzsfnqkqmlihglnjwm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=***REMOVED_ANON_KEY***
SUPABASE_SERVICE_ROLE_KEY=***REMOVED_SERVICE_KEY***
NODE_TLS_REJECT_UNAUTHORIZED=0
```

- [ ] **Step 6: Install dependencies**

```bash
cd bisatimdash && npm install
```

---

### Task 2: Supabase clients + types + middleware

**Files:**
- Create: `src/lib/supabase-browser.ts`
- Create: `src/lib/supabase-server.ts`
- Create: `src/lib/supabase-admin.ts`
- Create: `src/lib/types.ts`
- Create: `src/middleware.ts`

- [ ] **Step 1: Create src/lib/supabase-browser.ts**

```ts
import { createBrowserClient } from '@supabase/ssr';

export function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 2: Create src/lib/supabase-server.ts**

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (pairs) => pairs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    },
  );
}
```

- [ ] **Step 3: Create src/lib/supabase-admin.ts**

```ts
import { createClient } from '@supabase/supabase-js';

export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
```

- [ ] **Step 4: Create src/lib/types.ts**

```ts
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  sale_price: number | null;
  description: string;
  images: string[];
  dimensions: string;
  size_category: string;
  rooms: string[];
  material: string;
  origin: string;
  stock: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  meta_description: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  status: string;
  date: string;
  items: string[];
  estimated_delivery: string;
  location: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  title: string;
  text: string;
  date: string;
  rating: number;
  category: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  badge: string;
  image_url: string;
  sort_order: number;
  active: boolean;
}

export interface SiteSetting {
  key: string;
  value: string;
  label?: string;
}

export interface SiteImage {
  key: string;
  url: string;
}
```

- [ ] **Step 5: Create src/middleware.ts**

```ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (pairs) => {
          pairs.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          pairs.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
```

---

### Task 3: Root layout + globals + login page

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: Create src/app/globals.css**

```css
@import "tailwindcss";

:root {
  --dash-bg: #f5f4f2;
  --dash-surface: #ffffff;
  --dash-border: rgba(0,0,0,0.08);
  --dash-black: #1a1a18;
  --dash-muted: rgba(26,26,24,0.45);
  --dash-accent: #1a1a18;
}

body {
  background: var(--dash-bg);
  color: var(--dash-black);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: opacity 0.15s;
  cursor: pointer;
  border: none;
}

.btn:hover { opacity: 0.8; }

.btn-primary {
  background: var(--dash-black);
  color: #fff;
}

.btn-secondary {
  background: transparent;
  color: var(--dash-black);
  border: 1px solid var(--dash-border);
}

.btn-danger {
  background: #dc2626;
  color: #fff;
}

input, textarea, select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--dash-border);
  background: #fff;
  font-size: 14px;
  color: var(--dash-black);
  outline: none;
  transition: border-color 0.15s;
}

input:focus, textarea:focus, select:focus {
  border-color: var(--dash-black);
}

textarea { min-height: 100px; resize: vertical; }

label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--dash-muted);
  margin-bottom: 6px;
}
```

- [ ] **Step 2: Create src/app/layout.tsx**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bisatim Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create src/app/page.tsx**

```tsx
import { redirect } from 'next/navigation';
export default function Root() { redirect('/dashboard'); }
```

- [ ] **Step 4: Create src/app/login/page.tsx**

```tsx
'use client';
import { useState } from 'react';
import { getBrowserClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--dash-bg)' }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-light tracking-tight" style={{ color: 'var(--dash-black)' }}>Bisatim</h1>
          <p className="mt-1 text-xs uppercase tracking-widest" style={{ color: 'var(--dash-muted)' }}>Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8" style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
          <div className="mb-5">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="mb-6">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="mb-4 text-xs text-red-600">{error}</p>}
          <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

### Task 4: Sidebar + Dashboard layout

**Files:**
- Create: `src/components/Sidebar.tsx`
- Create: `src/components/PageHeader.tsx`
- Create: `src/app/dashboard/layout.tsx`

- [ ] **Step 1: Create src/components/Sidebar.tsx**

```tsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FileText, ShoppingBag,
  Star, Tag, Settings, Image, LogOut, ChevronRight,
} from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/blog', label: 'Blog', icon: FileText },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/categories', label: 'Categories', icon: Tag },
  { href: '/dashboard/site-content', label: 'Site Content', icon: Settings },
  { href: '/dashboard/site-images', label: 'Site Images', icon: Image },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = getBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col"
      style={{ background: 'var(--dash-black)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-white font-light tracking-tight text-base">Bisatim</p>
        <p className="text-xs uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Dashboard</p>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
              style={{
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
              }}
            >
              <Icon size={15} />
              {label}
              {active && <ChevronRight size={12} className="ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={signOut}
        className="flex items-center gap-3 px-6 py-4 text-sm transition-colors border-t"
        style={{ color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <LogOut size={14} />
        Sign out
      </button>
    </aside>
  );
}
```

- [ ] **Step 2: Create src/components/PageHeader.tsx**

```tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  breadcrumb?: { label: string; href: string }[];
  action?: React.ReactNode;
}

export function PageHeader({ title, breadcrumb, action }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        {breadcrumb && (
          <div className="flex items-center gap-1 mb-1.5">
            {breadcrumb.map((b, i) => (
              <span key={b.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={11} style={{ color: 'var(--dash-muted)' }} />}
                <Link href={b.href} className="text-xs uppercase tracking-wider hover:underline"
                  style={{ color: 'var(--dash-muted)' }}>{b.label}</Link>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-xl font-light tracking-tight">{title}</h1>
      </div>
      {action}
    </div>
  );
}
```

- [ ] **Step 3: Create src/app/dashboard/layout.tsx**

```tsx
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-56 p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
```

---

### Task 5: Overview (stats) page

**Files:**
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Create src/app/dashboard/page.tsx**

```tsx
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
      <PageHeader title="Overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <a key={label} href={href}
            className="p-6 block transition-shadow hover:shadow-md"
            style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--dash-muted)' }}>{label}</p>
              <Icon size={16} style={{ color: 'var(--dash-muted)' }} />
            </div>
            <p className="text-3xl font-light">{value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
```

---

### Task 6: Products management

**Files:**
- Create: `src/app/dashboard/products/page.tsx`
- Create: `src/app/dashboard/products/new/page.tsx`
- Create: `src/app/dashboard/products/[id]/page.tsx`
- Create: `src/app/dashboard/products/actions.ts`

- [ ] **Step 1: Create src/app/dashboard/products/actions.ts**

```ts
'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function createProduct(fd: FormData) {
  const images = (fd.get('images') as string).split('\n').map(s => s.trim()).filter(Boolean);
  const rooms = (fd.get('rooms') as string).split(',').map(s => s.trim()).filter(Boolean);
  const { error } = await adminClient.from('products').insert({
    name: fd.get('name'),
    category: fd.get('category'),
    price: Number(fd.get('price')),
    sale_price: fd.get('sale_price') ? Number(fd.get('sale_price')) : null,
    description: fd.get('description'),
    images,
    dimensions: fd.get('dimensions'),
    size_category: fd.get('size_category'),
    rooms,
    material: fd.get('material'),
    origin: fd.get('origin'),
    stock: Number(fd.get('stock')),
  });
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/products');
}

export async function updateProduct(id: string, fd: FormData) {
  const images = (fd.get('images') as string).split('\n').map(s => s.trim()).filter(Boolean);
  const rooms = (fd.get('rooms') as string).split(',').map(s => s.trim()).filter(Boolean);
  const { error } = await adminClient.from('products').update({
    name: fd.get('name'),
    category: fd.get('category'),
    price: Number(fd.get('price')),
    sale_price: fd.get('sale_price') ? Number(fd.get('sale_price')) : null,
    description: fd.get('description'),
    images,
    dimensions: fd.get('dimensions'),
    size_category: fd.get('size_category'),
    rooms,
    material: fd.get('material'),
    origin: fd.get('origin'),
    stock: Number(fd.get('stock')),
  }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/products');
}

export async function deleteProduct(id: string) {
  await adminClient.from('products').delete().eq('id', id);
  revalidatePath('/dashboard/products');
}
```

- [ ] **Step 2: Create src/app/dashboard/products/page.tsx**

```tsx
import Link from 'next/link';
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { Plus, Pencil } from 'lucide-react';
import type { Product } from '@/lib/types';

export default async function ProductsPage() {
  const { data } = await adminClient.from('products').select('*').order('created_at', { ascending: false });
  const products: Product[] = data ?? [];

  return (
    <div>
      <PageHeader title="Products" action={
        <Link href="/dashboard/products/new" className="btn btn-primary">
          <Plus size={13} /> New product
        </Link>
      } />
      <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
              {['Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider"
                  style={{ color: 'var(--dash-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--dash-border)' }}
                className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium">{p.name}</td>
                <td className="px-5 py-3" style={{ color: 'var(--dash-muted)' }}>{p.category}</td>
                <td className="px-5 py-3">
                  {p.sale_price
                    ? <><span className="line-through mr-2" style={{ color: 'var(--dash-muted)' }}>${p.price}</span><span className="text-red-600">${p.sale_price}</span></>
                    : `$${p.price}`}
                </td>
                <td className="px-5 py-3">{p.stock}</td>
                <td className="px-5 py-3">
                  <Link href={`/dashboard/products/${p.id}`} className="btn btn-secondary py-1 px-3 text-xs">
                    <Pencil size={11} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center" style={{ color: 'var(--dash-muted)' }}>No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create src/app/dashboard/products/new/page.tsx**

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { createProduct } from '../actions';

export default function NewProductPage() {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createProduct(new FormData(e.currentTarget));
      router.push('/dashboard/products');
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="New Product"
        breadcrumb={[{ label: 'Products', href: '/dashboard/products' }]}
      />
      <form onSubmit={handleSubmit} className="p-6 space-y-5"
        style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <ProductFields />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Create product'}
          </button>
          <a href="/dashboard/products" className="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  );
}

function ProductFields({ defaults }: { defaults?: Record<string, unknown> }) {
  return (
    <>
      <div><label>Name</label><input name="name" defaultValue={defaults?.name as string} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Category</label>
          <select name="category" defaultValue={defaults?.category as string}>
            {['Handmade', 'Vintage', 'Machine', 'Kilim', 'Modern'].map(c =>
              <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label>Size Category</label>
          <select name="size_category" defaultValue={defaults?.size_category as string}>
            {['Small', 'Medium', 'Large', 'Runner'].map(c =>
              <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label>Price ($)</label><input name="price" type="number" step="0.01" defaultValue={defaults?.price as number} required /></div>
        <div><label>Sale Price ($) — optional</label><input name="sale_price" type="number" step="0.01" defaultValue={defaults?.sale_price as number ?? ''} /></div>
      </div>
      <div><label>Description</label><textarea name="description" defaultValue={defaults?.description as string} required /></div>
      <div>
        <label>Images (one URL per line)</label>
        <textarea name="images" defaultValue={Array.isArray(defaults?.images) ? (defaults.images as string[]).join('\n') : ''} placeholder="https://..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label>Dimensions</label><input name="dimensions" defaultValue={defaults?.dimensions as string} placeholder="200x300 cm" /></div>
        <div><label>Material</label><input name="material" defaultValue={defaults?.material as string} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label>Origin</label><input name="origin" defaultValue={defaults?.origin as string} /></div>
        <div><label>Stock</label><input name="stock" type="number" defaultValue={defaults?.stock as number ?? 0} required /></div>
      </div>
      <div>
        <label>Rooms (comma-separated)</label>
        <input name="rooms" defaultValue={Array.isArray(defaults?.rooms) ? (defaults.rooms as string[]).join(', ') : ''} placeholder="Living Room, Bedroom" />
      </div>
    </>
  );
}

export { ProductFields };
```

- [ ] **Step 4: Create src/app/dashboard/products/[id]/page.tsx**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { ProductFields } from '../new/page';
import { updateProduct, deleteProduct } from '../actions';
import type { Product } from '@/lib/types';
import { getBrowserClient } from '@/lib/supabase-browser';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getBrowserClient().from('products').select('*').eq('id', id).single()
      .then(({ data }) => setProduct(data));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProduct(id, new FormData(e.currentTarget));
      router.push('/dashboard/products');
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    router.push('/dashboard/products');
  }

  if (!product) return <p className="p-8" style={{ color: 'var(--dash-muted)' }}>Loading…</p>;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Edit Product"
        breadcrumb={[{ label: 'Products', href: '/dashboard/products' }]}
        action={
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        }
      />
      <form onSubmit={handleSubmit} className="p-6 space-y-5"
        style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <ProductFields defaults={product as unknown as Record<string, unknown>} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <a href="/dashboard/products" className="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  );
}
```

---

### Task 7: Blog management

**Files:**
- Create: `src/app/dashboard/blog/actions.ts`
- Create: `src/app/dashboard/blog/page.tsx`
- Create: `src/app/dashboard/blog/new/page.tsx`
- Create: `src/app/dashboard/blog/[id]/page.tsx`

- [ ] **Step 1: Create src/app/dashboard/blog/actions.ts**

```ts
'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function createBlogPost(fd: FormData) {
  const { error } = await adminClient.from('blog_posts').insert({
    title: fd.get('title'),
    excerpt: fd.get('excerpt'),
    content: fd.get('content'),
    image: fd.get('image'),
    date: fd.get('date'),
    author: fd.get('author'),
    category: fd.get('category'),
    meta_description: fd.get('meta_description') || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/blog');
}

export async function updateBlogPost(id: string, fd: FormData) {
  const { error } = await adminClient.from('blog_posts').update({
    title: fd.get('title'),
    excerpt: fd.get('excerpt'),
    content: fd.get('content'),
    image: fd.get('image'),
    date: fd.get('date'),
    author: fd.get('author'),
    category: fd.get('category'),
    meta_description: fd.get('meta_description') || null,
  }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/blog');
}

export async function deleteBlogPost(id: string) {
  await adminClient.from('blog_posts').delete().eq('id', id);
  revalidatePath('/dashboard/blog');
}
```

- [ ] **Step 2: Create src/app/dashboard/blog/page.tsx**

```tsx
import Link from 'next/link';
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { Plus, Pencil } from 'lucide-react';
import type { BlogPost } from '@/lib/types';

export default async function BlogPage() {
  const { data } = await adminClient.from('blog_posts').select('*').order('created_at', { ascending: false });
  const posts: BlogPost[] = data ?? [];

  return (
    <div>
      <PageHeader title="Blog Posts" action={
        <Link href="/dashboard/blog/new" className="btn btn-primary">
          <Plus size={13} /> New post
        </Link>
      } />
      <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
              {['Title', 'Category', 'Author', 'Date', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider"
                  style={{ color: 'var(--dash-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--dash-border)' }} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium max-w-xs truncate">{p.title}</td>
                <td className="px-5 py-3" style={{ color: 'var(--dash-muted)' }}>{p.category}</td>
                <td className="px-5 py-3" style={{ color: 'var(--dash-muted)' }}>{p.author}</td>
                <td className="px-5 py-3" style={{ color: 'var(--dash-muted)' }}>{p.date}</td>
                <td className="px-5 py-3">
                  <Link href={`/dashboard/blog/${p.id}`} className="btn btn-secondary py-1 px-3 text-xs">
                    <Pencil size={11} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center" style={{ color: 'var(--dash-muted)' }}>No posts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create src/app/dashboard/blog/new/page.tsx**

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { createBlogPost } from '../actions';

export default function NewBlogPage() {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createBlogPost(new FormData(e.currentTarget));
      router.push('/dashboard/blog');
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="New Post" breadcrumb={[{ label: 'Blog', href: '/dashboard/blog' }]} />
      <form onSubmit={handleSubmit} className="p-6 space-y-5"
        style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <BlogFields />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Create post'}
          </button>
          <a href="/dashboard/blog" className="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  );
}

function BlogFields({ defaults }: { defaults?: Record<string, unknown> }) {
  return (
    <>
      <div><label>Title</label><input name="title" defaultValue={defaults?.title as string} required /></div>
      <div><label>Excerpt</label><textarea name="excerpt" defaultValue={defaults?.excerpt as string} required style={{ minHeight: 70 }} /></div>
      <div><label>Content (HTML or Markdown)</label><textarea name="content" defaultValue={defaults?.content as string} required style={{ minHeight: 200 }} /></div>
      <div><label>Cover Image URL</label><input name="image" defaultValue={defaults?.image as string} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label>Author</label><input name="author" defaultValue={defaults?.author as string} /></div>
        <div><label>Category</label><input name="category" defaultValue={defaults?.category as string} /></div>
      </div>
      <div><label>Date (YYYY-MM-DD)</label><input name="date" type="date" defaultValue={defaults?.date as string ?? new Date().toISOString().slice(0,10)} /></div>
      <div><label>Meta Description</label><textarea name="meta_description" defaultValue={defaults?.meta_description as string ?? ''} style={{ minHeight: 60 }} /></div>
    </>
  );
}

export { BlogFields };
```

- [ ] **Step 4: Create src/app/dashboard/blog/[id]/page.tsx**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { BlogFields } from '../new/page';
import { updateBlogPost, deleteBlogPost } from '../actions';
import type { BlogPost } from '@/lib/types';
import { getBrowserClient } from '@/lib/supabase-browser';

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getBrowserClient().from('blog_posts').select('*').eq('id', id).single()
      .then(({ data }) => setPost(data));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateBlogPost(id, new FormData(e.currentTarget));
      router.push('/dashboard/blog');
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post?')) return;
    await deleteBlogPost(id);
    router.push('/dashboard/blog');
  }

  if (!post) return <p className="p-8" style={{ color: 'var(--dash-muted)' }}>Loading…</p>;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit Post" breadcrumb={[{ label: 'Blog', href: '/dashboard/blog' }]}
        action={<button onClick={handleDelete} className="btn btn-danger">Delete</button>} />
      <form onSubmit={handleSubmit} className="p-6 space-y-5"
        style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <BlogFields defaults={post as unknown as Record<string, unknown>} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <a href="/dashboard/blog" className="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  );
}
```

---

### Task 8: Orders management

**Files:**
- Create: `src/app/dashboard/orders/actions.ts`
- Create: `src/app/dashboard/orders/page.tsx`
- Create: `src/app/dashboard/orders/[id]/page.tsx`

- [ ] **Step 1: Create src/app/dashboard/orders/actions.ts**

```ts
'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(id: string, status: string) {
  await adminClient.from('orders').update({ status }).eq('id', id);
  revalidatePath('/dashboard/orders');
}
```

- [ ] **Step 2: Create src/app/dashboard/orders/page.tsx**

```tsx
import Link from 'next/link';
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import type { Order } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  pending: '#d97706',
  processing: '#2563eb',
  shipped: '#7c3aed',
  delivered: '#16a34a',
  cancelled: '#dc2626',
};

export default async function OrdersPage() {
  const { data } = await adminClient.from('orders').select('*').order('created_at', { ascending: false });
  const orders: Order[] = data ?? [];

  return (
    <div>
      <PageHeader title="Orders" />
      <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
              {['Order ID', 'Date', 'Status', 'Location', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider"
                  style={{ color: 'var(--dash-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--dash-border)' }} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-sm">{o.id}</td>
                <td className="px-5 py-3" style={{ color: 'var(--dash-muted)' }}>{o.date}</td>
                <td className="px-5 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5"
                    style={{ background: `${STATUS_COLORS[o.status] ?? '#888'}22`, color: STATUS_COLORS[o.status] ?? '#888' }}>
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-3" style={{ color: 'var(--dash-muted)' }}>{o.location}</td>
                <td className="px-5 py-3">
                  <Link href={`/dashboard/orders/${o.id}`} className="btn btn-secondary py-1 px-3 text-xs">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center" style={{ color: 'var(--dash-muted)' }}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create src/app/dashboard/orders/[id]/page.tsx**

```tsx
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

  return (
    <div className="max-w-xl">
      <PageHeader title={`Order ${order.id}`} breadcrumb={[{ label: 'Orders', href: '/dashboard/orders' }]} />
      <div className="p-6 space-y-4" style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p style={{ color: 'var(--dash-muted)' }} className="text-xs uppercase tracking-wider mb-1">Date</p><p>{order.date}</p></div>
          <div><p style={{ color: 'var(--dash-muted)' }} className="text-xs uppercase tracking-wider mb-1">Location</p><p>{order.location}</p></div>
          <div><p style={{ color: 'var(--dash-muted)' }} className="text-xs uppercase tracking-wider mb-1">Est. Delivery</p><p>{order.estimated_delivery}</p></div>
        </div>
        {order.items?.length > 0 && (
          <div>
            <p style={{ color: 'var(--dash-muted)' }} className="text-xs uppercase tracking-wider mb-2">Items</p>
            <ul className="space-y-1 text-sm">
              {order.items.map((item, i) => <li key={i} className="border-l-2 pl-3" style={{ borderColor: 'var(--dash-border)' }}>{item}</li>)}
            </ul>
          </div>
        )}
        <form action={async (fd: FormData) => {
          'use server';
          await updateOrderStatus(id, fd.get('status') as string);
        }}>
          <label>Update Status</label>
          <div className="flex gap-2 mt-1">
            <select name="status" defaultValue={order.status} className="flex-1">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

### Task 9: Reviews (testimonials) management

**Files:**
- Create: `src/app/dashboard/reviews/page.tsx`
- Create: `src/app/dashboard/reviews/actions.ts`

- [ ] **Step 1: Create src/app/dashboard/reviews/actions.ts**

```ts
'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function deleteTestimonial(id: string) {
  await adminClient.from('testimonials').delete().eq('id', id);
  revalidatePath('/dashboard/reviews');
}

export async function createTestimonial(fd: FormData) {
  const { error } = await adminClient.from('testimonials').insert({
    name: fd.get('name'),
    location: fd.get('location'),
    title: fd.get('title'),
    text: fd.get('text'),
    rating: Number(fd.get('rating')),
    category: fd.get('category'),
    date: fd.get('date'),
  });
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/reviews');
}
```

- [ ] **Step 2: Create src/app/dashboard/reviews/page.tsx**

```tsx
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { deleteTestimonial, createTestimonial } from './actions';
import { Star, Trash2 } from 'lucide-react';
import type { Testimonial } from '@/lib/types';

export default async function ReviewsPage() {
  const { data } = await adminClient.from('testimonials').select('*').order('created_at', { ascending: false });
  const testimonials: Testimonial[] = data ?? [];

  return (
    <div>
      <PageHeader title="Reviews & Testimonials" />

      {/* Add new */}
      <details className="mb-6">
        <summary className="btn btn-primary cursor-pointer inline-flex items-center gap-2">Add testimonial</summary>
        <form action={createTestimonial} className="mt-4 p-6 grid grid-cols-2 gap-4"
          style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
          <div><label>Name</label><input name="name" required /></div>
          <div><label>Location</label><input name="location" /></div>
          <div><label>Title (product/topic)</label><input name="title" /></div>
          <div><label>Category</label><input name="category" /></div>
          <div><label>Rating (1–5)</label><input name="rating" type="number" min="1" max="5" defaultValue="5" /></div>
          <div><label>Date</label><input name="date" defaultValue={new Date().getFullYear().toString()} /></div>
          <div className="col-span-2"><label>Review Text</label><textarea name="text" required /></div>
          <div className="col-span-2"><button type="submit" className="btn btn-primary">Add review</button></div>
        </form>
      </details>

      <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
              {['Name', 'Rating', 'Category', 'Text', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider"
                  style={{ color: 'var(--dash-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {testimonials.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--dash-border)' }} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{t.name}<br /><span className="text-xs" style={{ color: 'var(--dash-muted)' }}>{t.location}</span></td>
                <td className="px-5 py-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < t.rating ? 'fill-current' : ''} style={{ color: i < t.rating ? '#d97706' : '#ddd' }} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 text-sm" style={{ color: 'var(--dash-muted)' }}>{t.category}</td>
                <td className="px-5 py-3 text-sm max-w-xs">
                  <p className="line-clamp-2" style={{ color: 'var(--dash-muted)' }}>{t.text}</p>
                </td>
                <td className="px-5 py-3">
                  <form action={deleteTestimonial.bind(null, t.id)}>
                    <button type="submit" className="btn btn-danger py-1 px-3 text-xs"
                      onClick={e => { if (!confirm('Delete?')) e.preventDefault(); }}>
                      <Trash2 size={11} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center" style={{ color: 'var(--dash-muted)' }}>No reviews yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### Task 10: Categories management

**Files:**
- Create: `src/app/dashboard/categories/actions.ts`
- Create: `src/app/dashboard/categories/page.tsx`

- [ ] **Step 1: Create src/app/dashboard/categories/actions.ts**

```ts
'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function createCategory(fd: FormData) {
  const { error } = await adminClient.from('categories').insert({
    name: fd.get('name'),
    slug: fd.get('slug'),
    badge: fd.get('badge'),
    image_url: fd.get('image_url'),
    sort_order: Number(fd.get('sort_order') ?? 0),
    active: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/categories');
}

export async function updateCategory(id: string, fd: FormData) {
  await adminClient.from('categories').update({
    name: fd.get('name'),
    slug: fd.get('slug'),
    badge: fd.get('badge'),
    image_url: fd.get('image_url'),
    sort_order: Number(fd.get('sort_order') ?? 0),
    active: fd.get('active') === 'true',
  }).eq('id', id);
  revalidatePath('/dashboard/categories');
}

export async function deleteCategory(id: string) {
  await adminClient.from('categories').delete().eq('id', id);
  revalidatePath('/dashboard/categories');
}
```

- [ ] **Step 2: Create src/app/dashboard/categories/page.tsx**

```tsx
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { createCategory, deleteCategory } from './actions';
import { Trash2 } from 'lucide-react';
import type { Category } from '@/lib/types';

export default async function CategoriesPage() {
  const { data } = await adminClient.from('categories').select('*').order('sort_order');
  const categories: Category[] = data ?? [];

  return (
    <div className="max-w-3xl">
      <PageHeader title="Categories" />

      {/* Add form */}
      <details className="mb-6">
        <summary className="btn btn-primary cursor-pointer inline-flex items-center gap-2">Add category</summary>
        <form action={createCategory} className="mt-4 p-6 grid grid-cols-2 gap-4"
          style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
          <div><label>Name</label><input name="name" required /></div>
          <div><label>Slug</label><input name="slug" required placeholder="handmade-rugs" /></div>
          <div><label>Badge</label><input name="badge" placeholder="Artisanal" /></div>
          <div><label>Sort Order</label><input name="sort_order" type="number" defaultValue="0" /></div>
          <div className="col-span-2"><label>Image URL</label><input name="image_url" /></div>
          <div className="col-span-2"><button type="submit" className="btn btn-primary">Add</button></div>
        </form>
      </details>

      <div style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--dash-border)' }}>
              {['Name', 'Slug', 'Badge', 'Order', 'Active', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider"
                  style={{ color: 'var(--dash-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--dash-border)' }} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 font-mono text-sm" style={{ color: 'var(--dash-muted)' }}>{c.slug}</td>
                <td className="px-5 py-3 text-sm">{c.badge}</td>
                <td className="px-5 py-3 text-sm">{c.sort_order}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold uppercase px-2 py-0.5 ${c.active ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>
                    {c.active ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <form action={deleteCategory.bind(null, c.id)}>
                    <button type="submit" className="btn btn-danger py-1 px-3 text-xs"
                      onClick={e => { if (!confirm('Delete?')) e.preventDefault(); }}>
                      <Trash2 size={11} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### Task 11: Site Content editor

**Files:**
- Create: `src/app/dashboard/site-content/actions.ts`
- Create: `src/app/dashboard/site-content/page.tsx`

- [ ] **Step 1: Create src/app/dashboard/site-content/actions.ts**

```ts
'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function saveSiteSettings(fd: FormData) {
  const entries = Array.from(fd.entries());
  for (const [key, value] of entries) {
    await adminClient.from('site_settings').upsert(
      { key, value: value as string },
      { onConflict: 'key' }
    );
  }
  revalidatePath('/dashboard/site-content');
}
```

- [ ] **Step 2: Create src/app/dashboard/site-content/page.tsx**

```tsx
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { saveSiteSettings } from './actions';

const SITE_SETTING_DEFAULTS: Record<string, { label: string; value: string; type: 'text' | 'textarea' | 'url'; group: string }> = {
  promo_text:            { label: 'Promo Banner Text',           value: 'Mid-Season Sale: Up to 40% off Vintage Collections!', type: 'text',     group: 'Home' },
  hero_badge:            { label: 'Hero Badge',                  value: 'The Summer Edit',                                     type: 'text',     group: 'Home' },
  hero_title:            { label: 'Hero Title',                  value: 'Artisan',                                             type: 'text',     group: 'Home' },
  hero_title_italic:     { label: 'Hero Title (italic)',         value: 'Masterpieces',                                        type: 'text',     group: 'Home' },
  hero_subtitle:         { label: 'Hero Subtitle',               value: 'Elevate your home with our curated selection…',       type: 'textarea', group: 'Home' },
  promo_members_title:   { label: 'Members Promo Title',         value: 'Join our Rewards Club & Get $50 Off.',                type: 'text',     group: 'Home' },
  promo_members_sub:     { label: 'Members Promo Subtitle',      value: 'Unlock early access to sales…',                      type: 'textarea', group: 'Home' },
  trust_1_label:         { label: 'Trust Badge 1 — Label',       value: 'Verified Integrity',   type: 'text', group: 'Trust' },
  trust_1_sub:           { label: 'Trust Badge 1 — Subtext',     value: 'Every rug certified',  type: 'text', group: 'Trust' },
  trust_2_label:         { label: 'Trust Badge 2 — Label',       value: 'Free Shipping',        type: 'text', group: 'Trust' },
  trust_2_sub:           { label: 'Trust Badge 2 — Subtext',     value: 'Worldwide, fully insured', type: 'text', group: 'Trust' },
  trust_3_label:         { label: 'Trust Badge 3 — Label',       value: '30-Day Returns',       type: 'text', group: 'Trust' },
  trust_3_sub:           { label: 'Trust Badge 3 — Subtext',     value: 'Hassle-free policy',   type: 'text', group: 'Trust' },
  trust_4_label:         { label: 'Trust Badge 4 — Label',       value: 'Direct from Makers',   type: 'text', group: 'Trust' },
  trust_4_sub:           { label: 'Trust Badge 4 — Subtext',     value: 'No middlemen',         type: 'text', group: 'Trust' },
  contact_address:       { label: 'Address',                     value: 'Grand Bazaar Quarter, Istanbul, Turkey', type: 'text', group: 'Contact' },
  contact_phone:         { label: 'Phone',                       value: '+90 212 000 0000',     type: 'text', group: 'Contact' },
  social_instagram:      { label: 'Instagram URL',               value: 'https://www.instagram.com/bisatim_/', type: 'url', group: 'Social' },
  social_pinterest:      { label: 'Pinterest URL',               value: 'https://tr.pinterest.com/bisatim_/', type: 'url', group: 'Social' },
  social_tiktok:         { label: 'TikTok URL',                  value: 'https://www.tiktok.com/@bisatim_',    type: 'url', group: 'Social' },
  footer_shipping_title: { label: 'Footer Shipping Title',       value: 'Free Worldwide Shipping', type: 'text', group: 'Footer' },
  footer_shipping_desc:  { label: 'Footer Shipping Description', value: 'Every rug is hand-packed…', type: 'text', group: 'Footer' },
};

const GROUPS = ['Home', 'Trust', 'Contact', 'Social', 'Footer'];

export default async function SiteContentPage() {
  const { data } = await adminClient.from('site_settings').select('key, value');
  const stored: Record<string, string> = {};
  for (const row of data ?? []) stored[row.key] = row.value;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Site Content" />
      <form action={saveSiteSettings} className="space-y-8">
        {GROUPS.map(group => {
          const keys = Object.entries(SITE_SETTING_DEFAULTS).filter(([, def]) => def.group === group);
          return (
            <section key={group} className="p-6 space-y-4"
              style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
              <h2 className="text-xs font-semibold uppercase tracking-widest pb-2 border-b"
                style={{ color: 'var(--dash-muted)', borderColor: 'var(--dash-border)' }}>{group}</h2>
              {keys.map(([key, def]) => (
                <div key={key}>
                  <label>{def.label}</label>
                  {def.type === 'textarea'
                    ? <textarea name={key} defaultValue={stored[key] ?? def.value} />
                    : <input name={key} type={def.type} defaultValue={stored[key] ?? def.value} />}
                </div>
              ))}
            </section>
          );
        })}
        <button type="submit" className="btn btn-primary">Save all settings</button>
      </form>
    </div>
  );
}
```

---

### Task 12: Site Images editor

**Files:**
- Create: `src/app/dashboard/site-images/actions.ts`
- Create: `src/app/dashboard/site-images/page.tsx`

- [ ] **Step 1: Create src/app/dashboard/site-images/actions.ts**

```ts
'use server';
import { adminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function saveSiteImages(fd: FormData) {
  const entries = Array.from(fd.entries());
  for (const [key, value] of entries) {
    if (!value) continue;
    await adminClient.from('site_images').upsert(
      { key, url: value as string },
      { onConflict: 'key' }
    );
  }
  revalidatePath('/dashboard/site-images');
}
```

- [ ] **Step 2: Create src/app/dashboard/site-images/page.tsx**

```tsx
import { adminClient } from '@/lib/supabase-admin';
import { PageHeader } from '@/components/PageHeader';
import { saveSiteImages } from './actions';
import Image from 'next/image';

const IMAGE_KEYS: { key: string; label: string; fallback: string }[] = [
  { key: 'hero', label: 'Home — Hero Background', fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400' },
  { key: 'promo_split', label: 'Home — Promo Section', fallback: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400' },
  { key: 'about_artisan', label: 'About — Artisan Section', fallback: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=400' },
  { key: 'lifestyle_1_hero', label: 'Lifestyle Card 1 (Hero)', fallback: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400' },
  { key: 'lifestyle_1_thumb', label: 'Lifestyle Card 1 (Thumb)', fallback: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=400' },
  { key: 'lifestyle_2_hero', label: 'Lifestyle Card 2 (Hero)', fallback: 'https://images.unsplash.com/photo-1548199973-03f0f5fc9730?q=80&w=400' },
  { key: 'lifestyle_2_thumb', label: 'Lifestyle Card 2 (Thumb)', fallback: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=400' },
  { key: 'lifestyle_3_hero', label: 'Lifestyle Card 3 (Hero)', fallback: 'https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=400' },
  { key: 'lifestyle_3_thumb', label: 'Lifestyle Card 3 (Thumb)', fallback: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400' },
  { key: 'lifestyle_4_hero', label: 'Lifestyle Card 4 (Hero)', fallback: 'https://images.unsplash.com/photo-1616486338812-3dadae4ddf4c?q=80&w=400' },
  { key: 'lifestyle_4_thumb', label: 'Lifestyle Card 4 (Thumb)', fallback: 'https://images.unsplash.com/photo-1585412727339-54e4be3f3467?q=80&w=400' },
];

export default async function SiteImagesPage() {
  const { data } = await adminClient.from('site_images').select('key, url');
  const stored: Record<string, string> = {};
  for (const row of data ?? []) stored[row.key] = row.url;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Site Images" />
      <form action={saveSiteImages} className="space-y-4">
        {IMAGE_KEYS.map(({ key, label, fallback }) => {
          const url = stored[key] ?? fallback;
          return (
            <div key={key} className="p-4 flex gap-4 items-start"
              style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' }}>
              <div className="relative w-24 h-16 shrink-0 bg-gray-100 overflow-hidden">
                <Image src={url} alt={label} fill className="object-cover" unoptimized />
              </div>
              <div className="flex-1">
                <label>{label}</label>
                <input name={key} defaultValue={stored[key] ?? ''} placeholder={fallback} />
              </div>
            </div>
          );
        })}
        <button type="submit" className="btn btn-primary">Save images</button>
      </form>
    </div>
  );
}
```
