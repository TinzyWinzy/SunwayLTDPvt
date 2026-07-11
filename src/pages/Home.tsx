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
      {/* Hero with background image */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/rooftopsolar.jpg"
            alt="Solar installation"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/60" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-accent/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                Zimbabwe's Trusted Solar Provider
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-white">
                Power Your Life with{' '}
                <span className="text-accent">Solar Energy</span>
              </h1>
              <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                Premium solar generators, panels, and home solutions. Reliable backup power
                for your home and business. Delivery nationwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="btn-primary text-lg px-8 py-3.5 inline-flex items-center gap-2 shadow-lg shadow-accent/25"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href={`https://wa.me/${SITE.phoneIntl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Hero product showcase */}
            <div className="hidden md:block relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <img
                  src="/solargen.jpg"
                  alt="Solar Generator"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <div className="mt-4 text-white">
                  <div className="text-sm text-gray-300">Starting from</div>
                  <div className="text-3xl font-bold text-accent">$90</div>
                  <div className="text-sm text-gray-300">150W - 2kWh Solar Generators</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

      {/* CTA Banner */}
      <section className="relative bg-accent overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/roofinstall.jpg" alt="Installation" className="w-full h-full object-cover" />
        </div>
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
