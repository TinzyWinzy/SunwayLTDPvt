export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  image_url: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category_id: string | null
  description: string | null
  short_description: string | null
  price_usd: number
  price_zwl: number | null
  stock_qty: number
  images: string[] | null
  specs: Record<string, unknown>
  weight_kg: number | null
  is_active: boolean
  is_installation_required: boolean
  created_at: string
}

export interface Branch {
  id: string
  name: string
  city: string
  address: string
  phone: string | null
  is_pickup_point: boolean
  lat: number | null
  lng: number | null
  is_active: boolean
  created_at: string
}

export interface UserProfile {
  id: string
  name: string | null
  phone: string
  email: string | null
  role: 'customer' | 'admin' | 'installer'
  addresses: Record<string, unknown>[] | null
  created_at: string
}

export interface OrderItem {
  product_id: string
  name: string
  qty: number
  price_usd: number
  image_url: string | null
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total_usd: number
  total_zwl: number | null
  status: 'pending' | 'confirmed' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: 'paynow_ecocash' | 'paynow_onemoney' | 'paynow_innbucks' | 'paynow_bank' | 'cod' | null
  paynow_poll_url: string | null
  paynow_status: 'pending' | 'paid' | 'cancelled' | 'failed' | null
  delivery_type: 'nationwide' | 'pickup' | null
  delivery_address: Record<string, unknown> | null
  branch_id: string | null
  tracking_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface InstallationBooking {
  id: string
  order_id: string
  user_id: string
  address: Record<string, unknown>
  preferred_date: string | null
  scheduled_date: string | null
  assigned_installer_id: string | null
  status: 'requested' | 'scheduled' | 'completed' | 'cancelled'
  installer_notes: string | null
  created_at: string
}

export interface CMSPage {
  id: string
  slug: string
  title: string | null
  content: CMSPageBlock[] | null
  is_published: boolean
  updated_at: string
  updated_by: string | null
}

export interface CMSPageBlock {
  type: 'hero' | 'text' | 'image' | 'products_grid' | 'testimonial'
  data: Record<string, unknown>
}

export interface CRMInteraction {
  id: string
  user_id: string
  order_id: string | null
  type: 'call' | 'whatsapp' | 'email' | 'note' | 'complaint'
  direction: 'inbound' | 'outbound'
  content: string | null
  created_by: string
  created_at: string
}

export interface CRMTask {
  id: string
  assigned_to: string
  type: 'follow_up' | 'installation' | 'delivery' | 'complaint' | null
  related_order_id: string | null
  due_date: string | null
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  description: string | null
  created_at: string
}
