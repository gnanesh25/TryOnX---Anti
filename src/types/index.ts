// Database types matching Supabase schema

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  brand: string | null
  category_id: string | null
  selling_price_paise: number
  compare_price_paise: number | null
  is_active: boolean
  is_featured: boolean
  supports_tryon: boolean
  tryon_garment_image_url: string | null
  material: string | null
  care_instructions: string | null
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  // Joins
  category?: Category
  images?: ProductImage[]
  variants?: ProductVariant[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  color: string | null
  color_hex: string | null
  size: string | null
  stock_quantity: number
  selling_price_paise: number | null // overrides product price if set
  compare_price_paise: number | null
  is_active: boolean
}

export interface CartItem {
  id: string // variant id
  product_id: string
  product_name: string
  product_slug: string
  variant_sku: string
  color: string | null
  color_hex: string | null
  size: string | null
  image_url: string | null
  selling_price_paise: number
  quantity: number
}

export interface WishlistItem {
  product_id: string
  product_name: string
  product_slug: string
  image_url: string | null
  selling_price_paise: number
  added_at: string
}

export interface CheckoutForm {
  first_name: string
  last_name: string
  email: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  delivery_instructions?: string
  payment_method: 'online' | 'cod'
  coupon_code?: string
}

export interface Order {
  id: string
  order_number: string
  tracking_token: string
  status: OrderStatus
  payment_method: 'online' | 'cod'
  payment_status: PaymentStatus
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: ShippingAddress
  subtotal_paise: number
  discount_paise: number
  shipping_paise: number
  tax_paise: number
  total_paise: number
  coupon_code: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refund_pending'
  | 'refunded'

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  // Snapshot — never changes after order
  product_name: string
  variant_sku: string
  color: string | null
  size: string | null
  image_url: string | null
  quantity: number
  unit_price_paise: number
  total_price_paise: number
}

export interface ShippingAddress {
  first_name: string
  last_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
}

export interface TryOnJob {
  id: string
  session_id: string
  product_id: string
  variant_id: string | null
  person_image_url: string
  garment_image_url: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result_url: string | null
  provider: string
  error_message: string | null
  created_at: string
  completed_at: string | null
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'editor'
  is_active: boolean
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number // percent or paise
  min_order_paise: number | null
  max_discount_paise: number | null
  usage_limit: number | null
  usage_count: number
  valid_from: string
  valid_until: string | null
  is_active: boolean
}

export interface StoreSettings {
  id: string
  key: string
  value: string
  label: string
  updated_at: string
}

// API response wrappers
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  page_size: number
  total_pages: number
}

export interface ProductFilter {
  category?: string
  brand?: string
  min_price?: number
  max_price?: number
  sizes?: string[]
  colors?: string[]
  in_stock?: boolean
  supports_tryon?: boolean
  q?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
  page?: number
  page_size?: number
}
