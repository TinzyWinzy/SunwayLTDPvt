import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Product } from '../types/database'
import { formatCurrency } from '../lib/utils'
import { useCartStore } from '../stores/cartStore'
import { ShoppingCart, Zap, Package, Truck, Shield } from 'lucide-react'

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'products', slug!))
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() } as Product)
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="text-accent hover:underline">Browse Products</Link>
      </div>
    )
  }

  const specs = product.specs as Record<string, unknown>
  const runtimeEstimates = specs?.runtime_estimates as Record<string, unknown> | undefined
  const includedItems = specs?.included_items as string[] | undefined

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-accent">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-accent">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {product.short_description && (
            <p className="text-gray-600 mb-4">{product.short_description}</p>
          )}

          <div className="mb-6">
            <div className="text-3xl font-bold text-accent">
              {formatCurrency(product.price_usd)}
            </div>
            {product.price_zwl && (
              <div className="text-sm text-gray-500">
                Reference: {formatCurrency(product.price_zwl, 'ZWL')}
              </div>
            )}
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => addItem(product)}
              className="btn-primary flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            {product.is_installation_required && (
              <Link
                to={`/checkout?install=${product.id}`}
                className="btn-outline"
              >
                Book Installation
              </Link>
            )}
          </div>

          {specs && Object.keys(specs).length > 0 && (
            <div className="border-t pt-6 mb-6">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Specifications
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(specs).map(([key, value]) => {
                  if (key === 'runtime_estimates' || key === 'included_items') return null
                  return (
                    <div key={key} className="text-sm">
                      <span className="text-gray-500 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>{' '}
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {runtimeEstimates && (
            <div className="border-t pt-6 mb-6">
              <h2 className="font-semibold mb-3">Runtime Estimates</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(runtimeEstimates).map(([key, value]) => (
                  <div key={key} className="card text-center">
                    <div className="text-lg font-bold text-accent">
                      {value as number}h
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {key.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {includedItems && includedItems.length > 0 && (
            <div className="border-t pt-6 mb-6">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                What's in the Box
              </h2>
              <ul className="space-y-1">
                {includedItems.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.description && (
            <div className="border-t pt-6">
              <h2 className="font-semibold mb-3">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="border-t pt-6 mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <Truck className="w-5 h-5 text-accent mx-auto mb-1" />
              <div className="text-xs font-medium">Free Delivery</div>
              <div className="text-xs text-gray-500">Orders over $50</div>
            </div>
            <div className="text-center">
              <Shield className="w-5 h-5 text-accent mx-auto mb-1" />
              <div className="text-xs font-medium">Quality</div>
              <div className="text-xs text-gray-500">100% Authentic</div>
            </div>
            <div className="text-center">
              <Package className="w-5 h-5 text-accent mx-auto mb-1" />
              <div className="text-xs font-medium">Easy Returns</div>
              <div className="text-xs text-gray-500">7-day policy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
