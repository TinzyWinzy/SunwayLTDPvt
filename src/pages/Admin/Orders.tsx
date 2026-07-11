import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Order } from '../../types/database'
import { formatCurrency, getStatusColor } from '../../lib/utils'

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const snap = await getDocs(query(collection(db, 'orders'), orderBy('created_at', 'desc')))
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-medium">Order #</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Items</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium">Payment</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-mono text-xs">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3 text-xs">{order.user_id?.slice(0, 12)}...</td>
                  <td className="py-3">{order.items?.length || 0}</td>
                  <td className="py-3 font-medium">{formatCurrency(order.total_usd || 0)}</td>
                  <td className="py-3 text-xs capitalize">{order.payment_method?.replace('_', ' ') || '-'}</td>
                  <td className="py-3"><span className={getStatusColor(order.status)}>{order.status}</span></td>
                  <td className="py-3 text-gray-500 text-xs">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
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
