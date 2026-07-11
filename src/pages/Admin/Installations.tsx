import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { InstallationBooking } from '../../types/database'

export function AdminInstallations() {
  const [bookings, setBookings] = useState<InstallationBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const snap = await getDocs(query(collection(db, 'installation_bookings'), orderBy('created_at', 'desc')))
      setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() } as InstallationBooking)))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Installation Bookings</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Preferred Date</th>
              <th className="pb-3 font-medium">Scheduled</th>
              <th className="pb-3 font-medium">Installer</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-500">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-gray-500">No bookings</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">{booking.id.slice(0, 8)}</td>
                  <td className="py-3">{booking.user_id?.slice(0, 8)}</td>
                  <td className="py-3">{booking.preferred_date || 'N/A'}</td>
                  <td className="py-3">{booking.scheduled_date || 'Not set'}</td>
                  <td className="py-3 text-xs">{booking.assigned_installer_id?.slice(0, 8) || 'Unassigned'}</td>
                  <td className="py-3">
                    <span className="badge capitalize">{booking.status}</span>
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
