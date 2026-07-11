export const SITE = {
  name: 'Sunway Solar',
  shortName: 'Sunway',
  description: 'Zimbabwe trusted solar energy & home solutions provider',
  phone: '0776 755 924',
  phoneIntl: '+263776755924',
  email: 'sales@sunway.co.zw',
  url: 'https://sunway.co.zw',
  currency: 'USD' as const,
  referenceCurrency: 'ZWL' as const,
}

export const BRAND = {
  primary: '#1f1a54',
  accent: '#ec1d27',
  background: '#ffffff',
  surface: '#f8f9fa',
  textPrimary: '#111827',
  textOnPrimary: '#ffffff',
  success: '#22c55e',
  warning: '#f59e0b',
}

export const PAYMENT_METHODS = [
  { id: 'paynow_ecocash', label: 'EcoCash', desc: 'Pay with EcoCash mobile money', icon: 'phone' },
  { id: 'paynow_onemoney', label: 'OneMoney', desc: 'Pay with OneMoney', icon: 'phone' },
  { id: 'paynow_innbucks', label: 'Innbucks', desc: 'Pay at Innbucks till point', icon: 'store' },
  { id: 'paynow_bank', label: 'Bank Transfer', desc: 'Direct bank deposit', icon: 'building' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay on delivery (pickup only)', icon: 'cash' },
] as const

export const DELIVERY = {
  freeThreshold: 50,
  deliveryFee: 5,
  freeThresholdLabel: 'Free delivery on orders over $50',
  pickupBranches: ['Harare', 'Bulawayo', 'Mutare'],
}

export const BRANCHES = [
  { name: 'Harare Branch', city: 'Harare', address: 'Corner Robson Manyika & Second St, E.Vanessa Building Shop 20', phone: '0242775592', lat: -17.8268, lng: 31.0535 },
  { name: 'Bulawayo Branch', city: 'Bulawayo', address: 'Shop 45 Basement Plaza, Corner J.Moyo & 11th Ave, Dulys Building', phone: '0292775592', lat: -20.1483, lng: 28.5803 },
  { name: 'Mutare Branch', city: 'Mutare', address: 'The Village Market, Corner 2nd St & 2nd Ave, Room N4', phone: '0208775592', lat: -18.9679, lng: 32.6706 },
]

export const PROVINCES = [
  'Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central', 'Mashonaland East',
  'Mashonaland West', 'Masvingo', 'Matabeleland North', 'Matabeleland South', 'Midlands',
]

export const ORDER_STATUSES = ['pending', 'confirmed', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const

export const ORDER_STATUS_FLOW: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['paid', 'cancelled'],
  paid: ['processing'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

export const INSTALLATION_STATUSES = ['requested', 'scheduled', 'completed', 'cancelled'] as const

export const TASK_STATUSES = ['open', 'in_progress', 'completed', 'cancelled'] as const
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const
export const CRM_INTERACTION_TYPES = ['call', 'whatsapp', 'email', 'note', 'complaint'] as const

export const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/branches', label: 'Branches' },
  { path: '/orders', label: 'Orders' },
]

export const ADMIN_NAV = [
  { path: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/admin/products', label: 'Products', icon: 'Package' },
  { path: '/admin/orders', label: 'Orders', icon: 'ShoppingCart' },
  { path: '/admin/cms', label: 'CMS', icon: 'FileText' },
  { path: '/admin/crm', label: 'CRM', icon: 'MessageSquare' },
  { path: '/admin/installations', label: 'Installations', icon: 'Calendar' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/admin/users', label: 'Users', icon: 'Users' },
]

export const PAYNOW_INSTRUCTIONS: Record<string, string> = {
  ecocash: 'Dial *151*2*4*amount*merchant# and follow prompts',
  onemoney: 'Dial *111# and select OneMoney to Pay, enter merchant code',
  innbucks: 'Visit any Innbucks till point and use merchant code provided',
  bank: 'Transfer to Sunway Pvt Ltd account and upload proof of payment',
}

export const TRUST_PERKS = [
  { icon: 'Zap', title: 'Solar Solutions', desc: 'Reliable energy for home & business' },
  { icon: 'Shield', title: 'Quality Guaranteed', desc: 'Authentic products with warranty' },
  { icon: 'Truck', title: 'Free Delivery', desc: 'On orders over $50 nationwide' },
  { icon: 'Headphones', title: '24/7 Support', desc: 'WhatsApp & phone assistance' },
]

export const ITEMS_PER_PAGE = 12
export const PAYNOW_POLL_INTERVAL_MS = 5000
export const PAYNOW_POLL_TIMEOUT_MS = 300000
