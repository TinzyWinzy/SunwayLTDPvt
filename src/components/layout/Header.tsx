import { Link } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Store } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems)
  const { user, profile, signOut } = useAuthStore()

  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Store className="w-6 h-6 text-accent" />
            <span>Sunway Solar</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
            <Link to="/branches" className="hover:text-accent transition-colors">Branches</Link>
            <Link to="/orders" className="hover:text-accent transition-colors">Orders</Link>

            <Link to="/cart" className="relative p-2 hover:text-accent transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/account" className="hover:text-accent transition-colors">
                  {profile?.name || 'Account'}
                </Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="text-accent font-medium hover:underline">
                    Admin
                  </Link>
                )}
                <button onClick={signOut} className="btn-ghost text-white text-sm">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/account" className="hover:text-accent transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/products" className="block py-2 hover:text-accent">Products</Link>
            <Link to="/branches" className="block py-2 hover:text-accent">Branches</Link>
            <Link to="/orders" className="block py-2 hover:text-accent">Orders</Link>
            <Link to="/cart" className="block py-2 hover:text-accent">Cart ({totalItems()})</Link>
            {user ? (
              <>
                <Link to="/account" className="block py-2 hover:text-accent">Account</Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-accent">Admin</Link>
                )}
                <button onClick={signOut} className="block py-2 text-left w-full hover:text-accent">
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/account" className="block py-2 hover:text-accent">Sign In</Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
