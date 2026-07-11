import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AdminAuthGuard } from './components/AdminAuthGuard'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { AdminLayout } from './components/layout/AdminLayout'
import { Spinner } from './components/ui/Skeleton'
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

function AppShell({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (isLoading) {
    return <Spinner />
  }

  return <ErrorBoundary>{children}</ErrorBoundary>
}

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminAuthGuard>
                <AdminLayout />
              </AdminAuthGuard>
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
      </AppShell>
    </BrowserRouter>
  )
}
