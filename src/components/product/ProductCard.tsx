import { Link } from 'react-router-dom'
import { ShoppingCart, Zap, Star } from 'lucide-react'
import type { Product } from '../../types/database'
import { formatCurrency } from '../../lib/utils'
import { useCartStore } from '../../stores/cartStore'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  const specs = product.specs as Record<string, unknown>
  const watts = specs?.watts as number | undefined
  const isGenerator = watts && watts > 0

  return (
    <div className="card group overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link to={`/products/${product.slug}`} className="relative block">
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-3 relative">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Zap className="w-12 h-12 text-gray-300" />
            </div>
          )}

          {/* Stock badge */}
          {product.stock_qty <= 5 && product.stock_qty > 0 && (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Only {product.stock_qty} left
            </span>
          )}

          {/* Installation badge */}
          {product.is_installation_required && (
            <span className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-1 rounded-full">
              Installation
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1">
        {product.category_id && (
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">
            {product.category_id?.replace(/-/g, ' ')}
          </p>
        )}

        <Link
          to={`/products/${product.slug}`}
          className="font-semibold text-sm leading-tight mb-1 group-hover:text-accent transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        {product.short_description && (
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">
            {product.short_description}
          </p>
        )}

        {/* Power badge */}
        {isGenerator && (
          <div className="flex items-center gap-1 mb-3">
            <Zap className="w-3 h-3 text-accent" />
            <span className="text-xs font-medium text-accent">{watts}W</span>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-lg font-extrabold text-gray-900">
              {product.price_usd === 0 ? (
                <span className="text-sm text-accent">Get a Quote</span>
              ) : (
                formatCurrency(product.price_usd)
              )}
            </div>
            {product.price_zwl && (
              <span className="text-[10px] text-gray-400">
                {formatCurrency(product.price_zwl, 'ZWL')} ref
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
            }}
            className="p-2.5 bg-primary text-white rounded-xl hover:bg-accent transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 active:scale-95"
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
