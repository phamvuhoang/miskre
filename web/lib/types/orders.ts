export interface OrderItem {
  product_id: string;
  product_name: string;
  product_description?: string;
  product_image_url?: string;
  size?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CreateOrderRequest {
  seller_id: string;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  shipping_address?: ShippingAddress;
  payment_method: 'stripe' | 'cod';
  items: OrderItem[];
  subtotal: number;
  shipping_cost?: number;
  tax_amount?: number;
  discount_amount?: number;
  total: number;
  stripe_session_id?: string;
  notes?: string;
}

export interface Order {
  id: string;
  order_number: string;
  seller_id: string;
  customer_email_enc?: string;
  customer_name_enc?: string;
  customer_phone_enc?: string;
  shipping_address_enc?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  payment_method: 'stripe' | 'cod';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  tracking_number?: string;
  tracking_url?: string;
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  stripe_session_id?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}
