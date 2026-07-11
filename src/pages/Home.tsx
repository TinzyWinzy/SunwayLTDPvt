import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API } from '../lib/api'
import type { Product, Category } from '../types/database'
import { ProductCard } from '../components/product/ProductCard'
import { ProductGridSkeleton } from '../components/ui/Skeleton'
import { TRUST_PERKS, SITE } from '../constants'
import { Zap, Shield, Truck, Headphones, ChevronRight, ArrowRight } from 'lucide-react'

const iconsMap: Record<string, React.FC<{ className?: string }>> = {
  Zap, Shield, Truck, Headphones,
}

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [products, cats] = await Promise.all([
          API.products.featured(),
          API.categories.list(),
        ])
        setFeaturedProducts(products)
        setCategories(cats)
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0f0d2e] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        {/* Glow orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />

        {/* Decorative lines */}
        <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-20 left-10 w-48 h-48 border border-white/[0.03] rounded-full" />

        <div className="relative w-full max-w-7xl mx-auto px-4 py-20 md:py-16">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left: Text */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300 font-medium">
                  Serving Zimbabwe since 2020
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 text-white tracking-tight">
                Solar Power
                <br />
                <span className="text-accent">Made Simple</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
                Premium solar generators, panels, and home essentials —
                delivered anywhere in Zimbabwe. Reliable backup power
                without the hassle.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  to="/products"
                  className="group bg-accent hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-accent/30 transition-all hover:shadow-2xl hover:shadow-accent/40 hover:-translate-y-0.5"
                >
                  Explore Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`https://wa.me/${SITE.phoneIntl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border-2 border-white/15 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary transition-all"
                >
                  WhatsApp
                  <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                <div>
                  <div className="text-2xl font-bold text-white">14+</div>
                  <div className="text-sm text-gray-400">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-sm text-gray-400">Branches</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">$50+</div>
                  <div className="text-sm text-gray-400">Free Delivery</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>

            {/* Right: Product Showcase Cards */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="relative">
                {/* Floating card 1 — main generator */}
                <div className="relative z-20 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl">
                  <img
                    src="/solargen.jpg"
                    alt="Solar Generator"
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">Solar Generator</span>
                    <span className="bg-accent/20 text-accent text-xs font-bold px-2.5 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-2xl font-bold">$160</span>
                    <span className="text-gray-400 text-xs">500W model</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Zap className="w-3 h-3 text-accent" />
                    Powers fridge, TV, laptop & WiFi
                  </div>
                </div>

                {/* Floating card 2 — offset */}
                <div className="relative z-10 -mt-4 ml-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                      <img src="/2kwh.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">2kWh Wall Mount</div>
                      <div className="text-accent font-bold">$530</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Floating card 3 — more offset */}
                <div className="relative z-0 -mt-4 ml-16 bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                      <img src="/solagne.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">150W Starter Kit</div>
                      <div className="text-accent font-bold">$90</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Decorative glow behind cards */}
                <div className="absolute -inset-8 bg-gradient-to-br from-accent/10 via-transparent to-primary-400/10 rounded-3xl blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Trust perks */}
      <section className="py-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_PERKS.map((perk) => {
            const Icon = iconsMap[perk.icon]
            return (
              <div key={perk.title} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  {Icon && <Icon className="w-5 h-5 text-accent" />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{perk.title}</h3>
                  <p className="text-xs text-gray-500">{perk.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
            <p className="text-gray-500">Find exactly what you need for your home and business</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="card group hover:shadow-lg hover:border-accent/20 transition-all"
              >
                <h3 className="font-semibold group-hover:text-accent transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-gray-500 mt-2">{cat.description}</p>
                )}
                <div className="flex items-center gap-1 mt-3 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-500">Our most popular solar solutions and home essentials</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1 text-accent font-medium hover:underline"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg">No products available right now</p>
              <p className="text-sm mt-1">Check back soon or contact us on WhatsApp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="btn-outline inline-flex items-center gap-2">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Installation Showcase */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Our Installation Work</h2>
            <p className="text-gray-500 text-sm mt-1">Professional solar setups across Zimbabwe</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['/roofinstall.jpg', '/wallinstall.jpg', '/sittedroof.jpg', '/instal1.jpg'].map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={img}
                  alt={`Installation ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us + Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/5 rounded-2xl -rotate-2" />
              <img
                src="/team.jpg"
                alt="Sunway Solar Team"
                className="relative w-full h-80 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-white px-5 py-3 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">5+</div>
                <div className="text-xs text-gray-300">Years Experience</div>
              </div>
            </div>

            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-3xl font-bold mt-2 mb-6">
                Zimbabwe's Trusted Solar Partner
              </h2>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-accent text-lg font-bold">01</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Expert Installation Team</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Certified technicians with years of hands-on experience installing solar
                      systems across Zimbabwe.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-accent text-lg font-bold">02</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Quality Products Guaranteed</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      We source only authentic, warrantied solar equipment and home products
                      from trusted manufacturers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-accent text-lg font-bold">03</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Nationwide Reach</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Branches in Harare, Bulawayo, and Mutare with delivery to every corner
                      of the country.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/branches"
                className="mt-8 inline-flex items-center gap-2 text-accent font-medium hover:underline"
              >
                Visit Our Branches <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative bg-gradient-to-r from-accent to-accent-600 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional Solar Installation
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Our certified installers handle everything — on-site assessment, mounting, wiring,
            and system testing. Get a free quote today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products/solar-installation-service"
              className="bg-white text-accent px-8 py-3.5 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              Book Installation <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`https://wa.me/${SITE.phoneIntl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
