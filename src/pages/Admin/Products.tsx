import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Product } from '../../types/database'
import { formatCurrency } from '../../lib/utils'

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const snap = await getDocs(query(collection(db, 'products'), orderBy('created_at', 'desc')))
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="btn-primary text-sm">Add Product</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Price (USD)</th>
              <th className="pb-3 font-medium">Stock</th>
              <th className="pb-3 font-medium">Active</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-500">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-500">No products</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500">{product.category_id?.slice(0, 8)}</td>
                  <td className="py-3">{formatCurrency(product.price_usd)}</td>
                  <td className="py-3">
                    <span className={product.stock_qty < 5 ? 'text-red-600 font-medium' : ''}>
                      {product.stock_qty}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`w-2 h-2 rounded-full inline-block ${product.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="py-3">
                    <button className="text-accent text-xs hover:underline">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
