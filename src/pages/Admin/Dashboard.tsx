import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Order } from '../../types/database'
import { formatCurrency } from '../../lib/utils'
import { DollarSign, Package, AlertTriangle, Clock } from 'lucide-react'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    revenueToday: 0,
    pendingOrders: 0,
    lowStock: 0,
    openTasks: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  useEffect(() => {
    async function load() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const [ordersSnap, lowStockSnap] = await Promise.all([
        getDocs(query(collection(db, 'orders'), orderBy('created_at', 'desc'), limit(10))),
        getDocs(query(collection(db, 'products'), where('stock_qty', '<', 5))),
      ])

      const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Order))
      setRecentOrders(orders)

      const todayOrders = orders.filter((o) => {
        const d = o.created_at ? new Date(o.created_at) : new Date(0)
        return d >= today
      })

      setStats({
        revenueToday: todayOrders.reduce((sum, o) => sum + (o.total_usd || 0), 0),
        pendingOrders: orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length,
        lowStock: lowStockSnap.size,
        openTasks: 0,
      })
    }
    load()
  }, [])

  const kpiCards = [
    { label: "Today's Revenue", value: formatCurrency(stats.revenueToday), icon: DollarSign, color: 'text-green-600' },
    { label: 'Pending Orders', value: stats.pendingOrders.toString(), icon: Package, color: 'text-yellow-600' },
    { label: 'Low Stock Items', value: stats.lowStock.toString(), icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Open Tasks', value: stats.openTasks.toString(), icon: Clock, color: 'text-blue-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{kpi.label}</span>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="text-2xl font-bold">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">Order</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Total</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3">{order.user_id?.slice(0, 8)}</td>
                  <td className="py-3">
                    <span className="badge capitalize">{order.status}</span>
                  </td>
                  <td className="py-3 font-medium">{formatCurrency(order.total_usd || 0)}</td>
                  <td className="py-3 text-gray-500">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
