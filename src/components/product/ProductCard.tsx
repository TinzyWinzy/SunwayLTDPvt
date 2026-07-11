import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '../../types/database'
import { formatCurrency } from '../../lib/utils'
import { useCartStore } from '../../stores/cartStore'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="card group">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
      </Link>

      <div>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-tight mb-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.short_description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {product.short_description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-lg">{formatCurrency(product.price_usd)}</span>
            {product.price_zwl && (
              <span className="text-xs text-gray-400 block">{formatCurrency(product.price_zwl, 'ZWL')}</span>
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            className="p-2 bg-primary/5 rounded-lg hover:bg-accent hover:text-white transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
