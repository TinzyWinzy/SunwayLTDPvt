import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Order } from '../types/database'
import { formatCurrency, getStatusColor } from '../lib/utils'
import { ArrowLeft, Package } from 'lucide-react'

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'orders', id!))
      if (snap.exists()) {
        setOrder({ id: snap.id, ...snap.data() } as Order)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <Link to="/orders" className="btn-primary">My Orders</Link>
      </div>
    )
  }

  const timeline = [
    { status: 'pending', label: 'Order Placed', date: order.created_at },
    { status: 'paid', label: 'Payment Confirmed' },
    { status: 'processing', label: 'Processing' },
    { status: 'shipped', label: 'Shipped' },
    { status: 'delivered', label: 'Delivered' },
  ]

  const currentIdx = timeline.findIndex((t) => t.status === order.status)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500">
            {order.created_at && new Date(order.created_at).toLocaleDateString('en-ZW', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <span className={getStatusColor(order.status)}>{order.status}</span>
      </div>

      {/* Timeline */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          {timeline.map((step, i) => (
            <div key={step.status} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= currentIdx
                    ? 'bg-accent text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-xs mt-1 ${i <= currentIdx ? 'text-accent font-medium' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-4">Items</h3>
        <div className="space-y-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                {item.image_url && (
                  <img src={item.image_url} alt="" className="w-12 h-12 rounded object-cover bg-gray-100" />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">x{item.qty}</p>
                </div>
              </div>
              <span className="font-medium">{formatCurrency(item.price_usd * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(order.total_usd || 0)}</span>
        </div>
      </div>

      {/* Details */}
      <div className="card">
        <h3 className="font-semibold mb-4">Order Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Payment Method</span>
            <p className="font-medium capitalize">{order.payment_method?.replace('_', ' ') || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Delivery Type</span>
            <p className="font-medium capitalize">{order.delivery_type || 'N/A'}</p>
          </div>
          {order.tracking_number && (
            <div className="col-span-2">
              <span className="text-gray-500">Tracking Number</span>
              <p className="font-medium">{order.tracking_number}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
