import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Order } from '../../types/database'
import { formatCurrency } from '../../lib/utils'

export function AdminAnalytics() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, 'orders'))
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)))
    }
    load()
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_usd || 0), 0)
  const paidOrders = orders.filter((o) => o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped')
  const pickupOrders = orders.filter((o) => o.delivery_type === 'pickup')
  const deliveryOrders = orders.filter((o) => o.delivery_type === 'nationwide')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue) },
          { label: 'Total Orders', value: orders.length.toString() },
          { label: 'Completed Orders', value: paidOrders.length.toString() },
          { label: 'Pending Revenue', value: formatCurrency(
            orders.filter((o) => o.status === 'pending').reduce((s, o) => s + (o.total_usd || 0), 0)
          )},
        ].map((stat) => (
          <div key={stat.label} className="card">
            <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Delivery vs Pickup</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500">Nationwide Delivery</div>
              <div className="text-lg font-bold">{deliveryOrders.length} ({orders.length ? Math.round(deliveryOrders.length / orders.length * 100) : 0}%)</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">Branch Pickup</div>
              <div className="text-lg font-bold">{pickupOrders.length} ({orders.length ? Math.round(pickupOrders.length / orders.length * 100) : 0}%)</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Payment Methods</h3>
          <div className="space-y-2">
            {['paynow_ecocash', 'paynow_onemoney', 'paynow_innbucks', 'paynow_bank', 'cod'].map((method) => {
              const count = orders.filter((o) => o.payment_method === method).length
              return (
                <div key={method} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{method.replace('paynow_', '').replace('_', ' ')}</span>
                  <span className="font-medium">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
