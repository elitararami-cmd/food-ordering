export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: 'kg' | 'box';
  image_path: string | null;
  active: number;
  created_at: string;
}

export interface CartItem {
  product_id: number;
  product_name: string;
  unit: 'kg' | 'box';
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  delivery_date: string;
  notes: string;
  total: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
  items_summary?: string;
  phone_order_count?: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  unit: string;
  quantity: number;
  price: number;
}
