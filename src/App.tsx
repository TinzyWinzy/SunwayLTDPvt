import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { AdminLayout } from './components/layout/AdminLayout'
import { Home } from './pages/Home'
import { ProductList } from './pages/ProductList'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Orders } from './pages/Orders'
import { OrderDetail } from './pages/OrderDetail'
import { Account } from './pages/Account'
import { AdminDashboard } from './pages/Admin/Dashboard'
import { AdminProducts } from './pages/Admin/Products'
import { AdminOrders } from './pages/Admin/Orders'
import { AdminCMS } from './pages/Admin/CMS'
import { AdminCRM } from './pages/Admin/CRM'
import { AdminInstallations } from './pages/Admin/Installations'
import { AdminAnalytics } from './pages/Admin/Analytics'

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/account" replace />
  }

  return <>{children}</>
}

export function App() {
  const initialize = useAuthStore((s) => s.initialize)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes with AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="cms" element={<AdminCMS />} />
          <Route path="crm" element={<AdminCRM />} />
          <Route path="installations" element={<AdminInstallations />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        {/* Public routes */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/account" element={<Account />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
