/**
 * Firebase seed script for Sunway Solar.
 *
 * Usage:
 *   1. Set GOOGLE_APPLICATION_CREDENTIALS env var to your service account key
 *   2. npx ts-node scripts/seed-firebase.ts
 */

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS!)

initializeApp({ credential: cert(serviceAccount as ServiceAccount) })
const db = getFirestore()

const seedData = {
  categories: [
    { name: 'Solar Generators', slug: 'solar-generators', description: 'Portable solar generators for home & office backup', sort_order: 1 },
    { name: 'Solar Panels', slug: 'solar-panels', description: 'High-efficiency solar panels', sort_order: 2 },
    { name: 'Solar Accessories', slug: 'solar-accessories', description: 'Cables, chargers, and mounting kits', sort_order: 3 },
    { name: 'Smart Home', slug: 'smart-home', description: 'Intelligent home appliances', sort_order: 4 },
    { name: 'Home & Living', slug: 'home-and-living', description: 'Home essentials and furniture', sort_order: 5 },
    { name: 'Baby & Kids', slug: 'baby-and-kids', description: 'Baby care products', sort_order: 6 },
    { name: 'Installation Services', slug: 'installation-services', description: 'Professional solar installation', sort_order: 7 },
  ],
  branches: [
    { name: 'Harare Branch', city: 'Harare', address: 'Corner Robson Manyika & Second St, E.Vanessa Building Shop 20', phone: '0242775592', lat: -17.8268, lng: 31.0535, is_pickup_point: true, is_active: true },
    { name: 'Bulawayo Branch', city: 'Bulawayo', address: 'Shop 45 Basement Plaza, Corner J.Moyo & 11th Ave, Dulys Building', phone: '0292775592', lat: -20.1483, lng: 28.5803, is_pickup_point: true, is_active: true },
    { name: 'Mutare Branch', city: 'Mutare', address: 'The Village Market, Corner 2nd St & 2nd Ave, Room N4', phone: '0208775592', lat: -18.9679, lng: 32.6706, is_pickup_point: true, is_active: true },
  ],
  products: [
    {
      name: '500W New Generation Solar Generator', slug: '500w-new-generation-solar-generator',
      category_slug: 'solar-generators', description: 'Powerful 500W portable solar generator...',
      short_description: '500W portable generator — powers fridge, TV, laptop & WiFi',
      price_usd: 160, price_zwl: 42000, stock_qty: 25,
      images: ['/500watts.jpg'],
      specs: { watts: 500, battery_capacity_wh: 480, runtime_estimates: { fridge_hrs: 6, tv_hrs: 8, laptop_hrs: 15 }, included_items: ['AC adapter', 'cigarette lighter cable', 'MC4 cable', 'user manual'], panel_compatibility: '200W 18V' },
      weight_kg: 5.5, is_active: true, is_installation_required: false,
    },
    {
      name: '2kWh Touchscreen Wall Mount Solar Generator', slug: '2kwh-touchscreen-wall-mount-solar-generator',
      category_slug: 'solar-generators', description: 'Premium 2kWh solar generator...',
      short_description: '2kWh touchscreen, wall mount, WiFi/Starlink compatible',
      price_usd: 530, price_zwl: 139000, stock_qty: 10,
      images: ['/2kwh.jpg', '/solagne.jpg'],
      specs: { watts: 2000, battery_capacity_wh: 2048, runtime_estimates: { fridge_hrs: 24, tv_hrs: 30, laptop_hrs: 60 }, included_items: ['touchscreen unit', 'wall mount bracket', 'AC cable', 'user manual'], panel_compatibility: '200W 18V' },
      weight_kg: 12, is_active: true, is_installation_required: false,
    },
    // ... (add all remaining products following the same pattern)
  ],
}

async function seed() {
  const batch = db.batch()

  // Seed categories
  const catRefs: Record<string, string> = {}
  for (const cat of seedData.categories) {
    const ref = db.collection('categories').doc()
    batch.set(ref, { ...cat, created_at: new Date() })
    catRefs[cat.slug] = ref.id
  }

  // Seed branches
  for (const branch of seedData.branches) {
    const ref = db.collection('branches').doc()
    batch.set(ref, { ...branch, created_at: new Date() })
  }

  // Seed products
  for (const prod of seedData.products) {
    const ref = db.collection('products').doc(prod.slug)
    const { category_slug, ...productData } = prod
    batch.set(ref, {
      ...productData,
      category_id: catRefs[category_slug],
      created_at: new Date(),
    })
  }

  await batch.commit()
  console.log('✅ Seed data inserted successfully')
}

seed().catch(console.error)
