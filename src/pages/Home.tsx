import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Product, Category } from '../types/database'
import { ProductCard } from '../components/product/ProductCard'
import { Zap, Shield, Truck, Headphones } from 'lucide-react'

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function load() {
      const productsSnap = await getDocs(
        query(
          collection(db, 'products'),
          where('is_active', '==', true),
          orderBy('created_at', 'desc'),
          limit(4),
        ),
      )
      const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
      setFeaturedProducts(products)

      const catsSnap = await getDocs(
        query(collection(db, 'categories'), orderBy('sort_order')),
      )
      const cats = catsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Category))
      setCategories(cats)
    }
    load()
  }, [])

  const perks = [
    { icon: Zap, title: 'Solar Solutions', desc: 'Reliable energy for home & business' },
    { icon: Shield, title: 'Quality Guaranteed', desc: 'Authentic products with warranty' },
    { icon: Truck, title: 'Free Delivery', desc: 'On orders over $50 nationwide' },
    { icon: Headphones, title: '24/7 Support', desc: 'WhatsApp & phone assistance' },
  ]

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
              Zimbabwe's trusted source for solar generators, panels, and home essentials.
              Quality products at honest prices.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="btn-primary text-lg">
                Shop Now
              </Link>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '263776755924'}`}
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
          {perks.map((perk) => (
            <div key={perk.title} className="text-center">
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3">
                <perk.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-sm">{perk.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{perk.desc}</p>
            </div>
          ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
