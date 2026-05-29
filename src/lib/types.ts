export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
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

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  rooms?: string[];
  stock?: number;
  images?: string[];
  origin?: string;
  reviews?: unknown;
  category?: string;
  material?: string;
  dimensions?: string;
  description?: string;
  sizeCategory?: string;
}

export interface OrderLocation {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  street?: string;
  district?: string;
  zip?: string;
  country?: string;
  notes?: string;
  [key: string]: string | undefined;
}

export interface Order {
  id: string;
  status: string;
  date: string;
  items: (OrderItem | string)[];
  estimated_delivery: string;
  location: OrderLocation | string | null;
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
