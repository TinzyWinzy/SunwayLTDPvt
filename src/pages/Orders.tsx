import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuthStore } from '../stores/authStore'
import type { Order } from '../types/database'
import { formatCurrency, getStatusColor } from '../lib/utils'
import { Package } from 'lucide-react'

export function Orders() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function load() {
      const snap = await getDocs(
        query(
          collection(db, 'orders'),
          where('user_id', '==', user.uid),
          orderBy('created_at', 'desc'),
        ),
      )
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)))
      setLoading(false)
    }
    load()
  }, [user])

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Sign in to view your orders</h2>
        <Link to="/account" className="btn-primary">Sign In</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse h-24" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="card block hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-gray-500">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <span className={getStatusColor(order.status)}>{order.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {order.items?.length || 0} item(s)
                </div>
                <div className="font-bold">
                  {formatCurrency(order.total_usd || 0)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
