import { useEffect, useState } from 'react'
import { orderBy } from 'firebase/firestore'
import { API } from '../../lib/api'
import type { Order } from '../../types/database'
import { formatCurrency, getStatusColor } from '../../lib/utils'
import { TableSkeleton } from '../../components/ui/Skeleton'

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.orders.list([orderBy('created_at', 'desc')]).then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="card overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : orders.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No orders yet</p>
        ) : (
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
              {orders.map((order) => (
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
