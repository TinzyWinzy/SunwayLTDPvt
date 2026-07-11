import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { where, orderBy } from 'firebase/firestore'
import { API } from '../lib/api'
import type { Product, Category } from '../types/database'
import { ProductCard } from '../components/product/ProductCard'
import { ProductGridSkeleton } from '../components/ui/Skeleton'
import { Package } from 'lucide-react'

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const activeCategory = searchParams.get('category')

  useEffect(() => {
    API.categories.list().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        const constraints = [where('is_active', '==', true), orderBy('created_at', 'desc')]

        if (activeCategory) {
          const cat = categories.find((c) => c.slug === activeCategory)
          if (cat) {
            constraints.unshift(where('category_id', '==', cat.id))
          }
        }

        const data = await API.products.list(constraints)
        setProducts(data)
      } catch (err) {
        console.error('Failed to load products:', err)
        setError('Failed to load products. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [activeCategory, categories])

  const activeLabel = activeCategory
    ? categories.find((c) => c.slug === activeCategory)?.name || activeCategory
    : null

  return (
    <div>
      {/* Hero banner for category */}
      {activeLabel && (
        <div className="bg-primary py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white">{activeLabel}</h1>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!activeLabel && <h1 className="text-3xl font-bold mb-6">All Products</h1>}

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeCategory
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSearchParams({ category: cat.slug })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.slug
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-accent hover:underline text-sm"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg text-gray-500 font-medium">No products found</p>
            <p className="text-sm text-gray-400 mt-1">
              {activeCategory ? 'Try selecting a different category' : 'Products coming soon'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">{products.length} product{products.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
