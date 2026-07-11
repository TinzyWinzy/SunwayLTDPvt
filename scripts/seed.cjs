/**
 * Firebase seed script — runs with Node.js directly.
 * Usage: node scripts/seed.js
 */
const admin = require('firebase-admin')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')

admin.initializeApp({ projectId: 'studio-5711057632-ad846' })
// Set GOOGLE_APPLICATION_CREDENTIALS env var to service account key path before running
const db = getFirestore()

async function seed() {
  console.log('Seeding Sunway Solar data...')

  // Categories
  const catRefs = {}
  const categories = [
    { name: 'Solar Generators', slug: 'solar-generators', description: 'Portable solar generators for home & office backup', sort_order: 1 },
    { name: 'Solar Panels', slug: 'solar-panels', description: 'High-efficiency solar panels', sort_order: 2 },
    { name: 'Solar Accessories', slug: 'solar-accessories', description: 'Cables, chargers, and mounting kits', sort_order: 3 },
    { name: 'Smart Home', slug: 'smart-home', description: 'Intelligent home appliances', sort_order: 4 },
    { name: 'Home & Living', slug: 'home-and-living', description: 'Home essentials and furniture', sort_order: 5 },
    { name: 'Baby & Kids', slug: 'baby-and-kids', description: 'Baby care products', sort_order: 6 },
    { name: 'Installation Services', slug: 'installation-services', description: 'Professional solar installation', sort_order: 7 },
  ]

  for (const cat of categories) {
    const ref = db.collection('categories').doc(cat.slug)
    await ref.set({ ...cat, created_at: FieldValue.serverTimestamp() })
    catRefs[cat.slug] = ref.id
    console.log(`  ✓ Category: ${cat.name}`)
  }

  // Branches
  const branches = [
    { name: 'Harare Branch', city: 'Harare', address: 'Corner Robson Manyika & Second St, E.Vanessa Building Shop 20', phone: '0242775592', lat: -17.8268, lng: 31.0535, is_pickup_point: true, is_active: true },
    { name: 'Bulawayo Branch', city: 'Bulawayo', address: 'Shop 45 Basement Plaza, Corner J.Moyo & 11th Ave, Dulys Building', phone: '0292775592', lat: -20.1483, lng: 28.5803, is_pickup_point: true, is_active: true },
    { name: 'Mutare Branch', city: 'Mutare', address: 'The Village Market, Corner 2nd St & 2nd Ave, Room N4', phone: '0208775592', lat: -18.9679, lng: 32.6706, is_pickup_point: true, is_active: true },
  ]

  for (const branch of branches) {
    await db.collection('branches').doc(branch.name.toLowerCase().replace(/\s+/g, '-')).set({
      ...branch,
      created_at: FieldValue.serverTimestamp(),
    })
    console.log(`  ✓ Branch: ${branch.name}`)
  }

  // Products
  const products = [
    {
      name: '500W New Generation Solar Generator', slug: '500w-new-generation-solar-generator',
      category_slug: 'solar-generators', description: 'Powerful 500W portable solar generator perfect for home backup. Powers fridge, TV, laptop, and WiFi simultaneously. Includes free cables and charger. Compatible with 200W solar panel (sold separately).',
      short_description: '500W portable generator — powers fridge, TV, laptop & WiFi',
      price_usd: 160, price_zwl: 42000, stock_qty: 25,
      images: ['/500watts.jpg'],
      specs: { watts: 500, battery_capacity_wh: 480, runtime_estimates: { fridge_hrs: 6, tv_hrs: 8, laptop_hrs: 15 }, included_items: ['AC adapter', 'cigarette lighter cable', 'MC4 cable', 'user manual'], panel_compatibility: '200W 18V' },
      weight_kg: 5.5, is_active: true, is_installation_required: false,
    },
    {
      name: '2kWh Touchscreen Wall Mount Solar Generator', slug: '2kwh-touchscreen-wall-mount-solar-generator',
      category_slug: 'solar-generators', description: 'Premium 2kWh solar generator with touchscreen display, wall-mountable design, compatible with WiFi/Starlink routers. Perfect for extended home backup.',
      short_description: '2kWh touchscreen, wall mount, WiFi/Starlink compatible',
      price_usd: 530, price_zwl: 139000, stock_qty: 10,
      images: ['/2kwh.jpg', '/solagne.jpg'],
      specs: { watts: 2000, battery_capacity_wh: 2048, runtime_estimates: { fridge_hrs: 24, tv_hrs: 30, laptop_hrs: 60 }, included_items: ['touchscreen unit', 'wall mount bracket', 'AC cable', 'user manual'], panel_compatibility: '200W 18V' },
      weight_kg: 12, is_active: true, is_installation_required: false,
    },
    {
      name: '1kWh Touchscreen Solar Generator', slug: '1kwh-touchscreen-solar-generator',
      category_slug: 'solar-generators', description: '1kWh solar generator with touchscreen interface, wall-mountable. Compatible with 18V 200W solar panels. Ideal medium-capacity backup.',
      short_description: '1kWh touchscreen, wall mountable, 18V 200W panel compatible',
      price_usd: 295, price_zwl: 77400, stock_qty: 15,
      images: ['/solargen.jpg', '/invertor.jpg'],
      specs: { watts: 1000, battery_capacity_wh: 1024, runtime_estimates: { fridge_hrs: 12, tv_hrs: 16, laptop_hrs: 30 }, included_items: ['touchscreen unit', 'AC cable', 'solar input cable', 'user manual'], panel_compatibility: '200W 18V' },
      weight_kg: 8, is_active: true, is_installation_required: false,
    },
    {
      name: '150W Solar Generator', slug: '150w-solar-generator',
      category_slug: 'solar-generators', description: 'Entry-level 150W solar generator with 50W panel included. Perfect for charging phones, running lights, and small TVs during load-shedding.',
      short_description: '150W starter kit — 50W panel included, phone/TV/lights',
      price_usd: 90, price_zwl: 23600, stock_qty: 30,
      images: ['/solagne.jpg'],
      specs: { watts: 150, battery_capacity_wh: 150, runtime_estimates: { tv_hrs: 3, laptop_hrs: 5, lights_hrs: 12 }, included_items: ['50W solar panel', 'AC adapter', 'cigarette lighter cable', 'user manual'], panel_compatibility: '50W included' },
      weight_kg: 3.2, is_active: true, is_installation_required: false,
    },
    {
      name: '200W 18V Solar Panel', slug: '200w-18v-solar-panel',
      category_slug: 'solar-panels', description: 'High-efficiency 200W monocrystalline solar panel, 18V output. Compatible with all Sunway solar generators. Durable aluminum frame.',
      short_description: '200W monocrystalline panel — compatible with 500W generator',
      price_usd: 200, price_zwl: 52400, stock_qty: 20,
      images: ['/rooftopsolar.jpg', '/rooftop.jpg'],
      specs: { watts: 200, voltage: 18, panel_type: 'Monocrystalline', frame: 'Aluminum alloy', warranty_years: 10 },
      weight_kg: 8.5, is_active: true, is_installation_required: true,
    },
    {
      name: 'Portable Smart Air Conditioner', slug: 'portable-smart-air-conditioner',
      category_slug: 'smart-home', description: 'Portable air conditioner with cooling and heating functions, remote control, energy efficient operation.',
      short_description: 'Cooling + heating, remote control, energy efficient',
      price_usd: 140, price_zwl: 36700, stock_qty: 12,
      images: ['/portableaircond.jpg'],
      specs: { btu: 8000, cooling_area_sqft: 200, heating: true, remote_control: true, energy_rating: 'A' },
      weight_kg: 18, is_active: true, is_installation_required: false,
    },
    {
      name: 'Intelligent Sweeping & Mopping Machine', slug: 'intelligent-sweeping-mopping-machine',
      category_slug: 'smart-home', description: '2-in-1 robotic vacuum and mop with intelligent navigation. Quiet operation, automatic docking.',
      short_description: 'Sweep + mop, quiet operation, auto-charging',
      price_usd: 40, price_zwl: 10500, stock_qty: 18,
      images: ['/inv.jpg'],
      specs: { suction_power_pa: 2500, battery_minutes: 90, dust_bin_ml: 400, water_tank_ml: 200, auto_charging: true },
      weight_kg: 3, is_active: true, is_installation_required: false,
    },
    {
      name: 'Fan Heater', slug: 'fan-heater',
      category_slug: 'smart-home', description: 'Compact fan heater with 2 heat settings and overheat protection.',
      short_description: '2 heat settings, overheat protection, compact',
      price_usd: 10, price_zwl: 2600, stock_qty: 40,
      images: ['/fan heater.jpg'],
      specs: { power_watts: 2000, heat_settings: 2, overheat_protection: true },
      weight_kg: 1.2, is_active: true, is_installation_required: false,
    },
    {
      name: '5-in-1 Foldable Baby Bath Set', slug: '5-in-1-foldable-baby-bath-set',
      category_slug: 'baby-and-kids', description: 'Complete baby bath solution: foldable tub with accessories.',
      short_description: 'Foldable tub + accessories, space-saving design',
      price_usd: 50, price_zwl: 13100, stock_qty: 22,
      images: ['/foldablebabybath.jpg'],
      specs: { folded_size_cm: '60x40x10', material: 'BPA-free PP', accessories: ['bath seat', 'scoop', 'thermometer', 'toy set'], age_range: '0-36 months' },
      weight_kg: 2.5, is_active: true, is_installation_required: false,
    },
    {
      name: '15-Piece Cookware Set', slug: '15-piece-cookware-set',
      category_slug: 'home-and-living', description: 'Premium 15-piece stainless steel cookware set. Induction compatible.',
      short_description: '15-piece stainless steel, induction compatible',
      price_usd: 30, price_zwl: 7900, stock_qty: 15,
      images: ['/pots2.jpg'],
      specs: { pieces: 15, material: 'Stainless steel', induction_compatible: true },
      weight_kg: 8, is_active: true, is_installation_required: false,
    },
    {
      name: '8-Piece Cookware Set', slug: '8-piece-cookware-set',
      category_slug: 'home-and-living', description: 'Essential 8-piece cookware set in stainless steel.',
      short_description: '8-piece stainless steel set',
      price_usd: 20, price_zwl: 5200, stock_qty: 20,
      images: ['/pots.jpg'],
      specs: { pieces: 8, material: 'Stainless steel', induction_compatible: true },
      weight_kg: 5, is_active: true, is_installation_required: false,
    },
    {
      name: '2-Piece Center Table', slug: '2-piece-center-table',
      category_slug: 'home-and-living', description: 'Modern marble-top center table set.',
      short_description: 'Marble top, modern design, 2-piece set',
      price_usd: 60, price_zwl: 15700, stock_qty: 10,
      images: ['/table2piece.jpg'],
      specs: { pieces: 2, material: 'Marble + metal', style: 'Modern' },
      weight_kg: 25, is_active: true, is_installation_required: false,
    },
    {
      name: '4-Piece Center Table', slug: '4-piece-center-table',
      category_slug: 'home-and-living', description: 'Premium 4-piece marble-top center table set.',
      short_description: 'Marble top set, 4 pieces',
      price_usd: 99, price_zwl: 25900, stock_qty: 8,
      images: ['/tables.jpg'],
      specs: { pieces: 4, material: 'Marble + metal', style: 'Modern' },
      weight_kg: 45, is_active: true, is_installation_required: false,
    },
    {
      name: 'Solar Installation Service', slug: 'solar-installation-service',
      category_slug: 'installation-services', description: 'Professional solar installation service. On-site assessment, mounting, wiring, testing.',
      short_description: 'Professional on-site assessment & installation, get a quote',
      price_usd: 0, price_zwl: 0, stock_qty: 999,
      images: ['/instal1.jpg', '/roofinstall.jpg', '/wallinstall.jpg', '/sittedroof.jpg'],
      specs: { service_types: ['on-site assessment', 'panel mounting', 'electrical wiring', 'system testing'], pricing: 'per-kW or flat rate', coverage: 'nationwide' },
      weight_kg: null, is_active: true, is_installation_required: true,
    },
  ]

  const batch = db.batch()
  for (const prod of products) {
    const { category_slug, ...productData } = prod
    const ref = db.collection('products').doc(prod.slug)
    batch.set(ref, {
      ...productData,
      category_id: catRefs[category_slug] || category_slug,
      created_at: FieldValue.serverTimestamp(),
    })
  }
  await batch.commit()
  console.log(`  ✓ ${products.length} products`)

  console.log('\n✅ Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
