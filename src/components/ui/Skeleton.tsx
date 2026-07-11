export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-8 w-8 bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-xl" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="flex gap-3">
            <div className="h-12 bg-gray-200 rounded-lg w-40" />
            <div className="h-12 bg-gray-200 rounded-lg w-40" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card animate-pulse h-24" />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-3 border-b last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 bg-gray-200 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )
}
