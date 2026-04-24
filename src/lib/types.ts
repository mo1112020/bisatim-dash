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
