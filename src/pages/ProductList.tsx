import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collection, getDocs, query, orderBy, where, type QueryConstraint } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Product, Category } from '../types/database'
import { ProductCard } from '../components/product/ProductCard'

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const activeCategory = searchParams.get('category')

  useEffect(() => {
    async function loadCategories() {
      const snap = await getDocs(
        query(collection(db, 'categories'), orderBy('sort_order')),
      )
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category)))
    }
    loadCategories()
  }, [])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      const constraints: QueryConstraint[] = [
        where('is_active', '==', true),
        orderBy('created_at', 'desc'),
      ]

      if (activeCategory) {
        const cat = categories.find((c) => c.slug === activeCategory)
        if (cat) {
          constraints.unshift(where('category_id', '==', cat.id))
        }
      }

      const snap = await getDocs(query(collection(db, 'products'), ...constraints))
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)))
      setLoading(false)
    }
    loadProducts()
  }, [activeCategory, categories])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSearchParams({})}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !activeCategory
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSearchParams({ category: cat.slug })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-1">Try a different category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
