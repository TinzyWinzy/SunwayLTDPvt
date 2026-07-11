import { useEffect, useState } from 'react'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import { API } from '../lib/api'
import type { Branch } from '../types/database'
import { SITE } from '../constants'

export function Branches() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.branches.list().then((data) => {
      setBranches(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Our Branches</h1>
          <p className="text-gray-300 text-lg">Visit us at any of our locations across Zimbabwe</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse h-48" />
            ))}
          </div>
        ) : branches.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">No branches available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {branches.map((branch) => (
              <div key={branch.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{branch.name}</h3>
                    <p className="text-sm text-accent font-medium">{branch.city}</p>
                  </div>
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                  {branch.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${branch.phone}`} className="hover:text-accent">
                        {branch.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>Mon-Fri 8AM-5PM, Sat 8AM-1PM</span>
                  </div>
                </div>

                {branch.lat && branch.lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent font-medium hover:underline"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                )}

                {branch.is_pickup_point && (
                  <span className="mt-3 inline-block bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    Pickup Point
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Banner */}
        <div className="card bg-primary/5 border-primary/10 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Can't Visit Us?</h2>
          <p className="text-gray-600 mb-4">
            Order online and get delivery nationwide. Or WhatsApp us for quick assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${SITE.phoneIntl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              WhatsApp {SITE.phone}
            </a>
            <a href={`tel:${SITE.phoneIntl}`} className="btn-outline inline-flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Call {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
