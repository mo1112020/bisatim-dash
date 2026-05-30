export interface Product {
  id: string;
  name: string;
  categories: string[];
  price: number;
  description: string;
  images: string[];
  dimensions: string;
  dimensions_ft: string;
  material: string;
  origin: string;
  stock: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
  images?: string[];
  origin?: string;
  reviews?: unknown;
  category?: string;
  categories?: string[];
  material?: string;
  dimensions?: string;
  description?: string;
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  badge: string;
  image_url: string;
  sort_order: number;
  active: boolean;
}

export interface SiteImage {
  key: string;
  url: string;
}
