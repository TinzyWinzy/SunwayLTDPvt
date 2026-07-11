import { Link, useLocation, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, FileText, Users, Calendar, BarChart3, MessageSquare } from 'lucide-react'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/admin/cms', label: 'CMS', icon: FileText },
  { path: '/admin/crm', label: 'CRM', icon: MessageSquare },
  { path: '/admin/installations', label: 'Installations', icon: Calendar },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/users', label: 'Users', icon: Users },
]

export function AdminLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-primary text-white flex-shrink-0 hidden lg:block">
        <div className="p-4 border-b border-white/10">
          <Link to="/admin" className="font-bold text-lg">Sunway Admin</Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 bg-gray-50">
        <header className="bg-white border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-sm text-gray-500 hover:text-accent">
              &larr; Back to Store
            </Link>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
