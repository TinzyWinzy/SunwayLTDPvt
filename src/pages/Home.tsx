import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API } from '../lib/api'
import type { Product, Category } from '../types/database'
import { ProductCard } from '../components/product/ProductCard'
import { ProductGridSkeleton } from '../components/ui/Skeleton'
import { TRUST_PERKS, SITE } from '../constants'
import { Zap, Shield, Truck, Headphones } from 'lucide-react'

const iconsMap: Record<string, React.FC<{ className?: string }>> = {
  Zap, Shield, Truck, Headphones,
}

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [products, cats] = await Promise.all([
        API.products.featured(),
        API.categories.list(),
      ])
      setFeaturedProducts(products)
      setCategories(cats)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Power Your World with{' '}
              <span className="text-accent">Sunway Solar</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              {SITE.description}. Quality products at honest prices.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="btn-primary text-lg">
                Shop Now
              </Link>
              <a
                href={`https://wa.me/${SITE.phoneIntl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_PERKS.map((perk) => {
            const Icon = iconsMap[perk.icon]
            return (
              <div key={perk.title} className="text-center">
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  {Icon && <Icon className="w-6 h-6 text-accent" />}
                </div>
                <h3 className="font-semibold text-sm">{perk.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{perk.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="card text-center hover:shadow-md transition-shadow group"
              >
                <h3 className="font-semibold group-hover:text-accent transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-accent font-medium hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Need Installation?</h2>
          <p className="text-gray-200 mb-8">
            Our certified installers handle everything from assessment to setup.
            Get a free quote today.
          </p>
          <Link to="/products/solar-installation-service" className="btn-primary text-lg">
            Book Installation
          </Link>
        </div>
      </section>
    </div>
  )
}
