import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock, Store } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Store className="w-5 h-5 text-accent" />
              Sunway Solar
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Zimbabwe's trusted solar energy and home solutions provider.
              Quality products at affordable prices.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/products" className="block text-gray-300 hover:text-accent transition-colors">
                Products
              </Link>
              <Link to="/branches" className="block text-gray-300 hover:text-accent transition-colors">
                Branches
              </Link>
              <Link to="/orders" className="block text-gray-300 hover:text-accent transition-colors">
                Track Order
              </Link>
              <a
                href={`https://wa.me/263776755924`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-accent transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-accent" />
                <span>Harare, Bulawayo, Mutare</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <span>0776 755 924</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>Mon-Fri: 8AM - 5PM, Sat: 8AM - 1PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Sunway Pvt Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
