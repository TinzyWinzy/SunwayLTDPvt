import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Spinner } from './ui/Skeleton'

interface Props {
  children: React.ReactNode
}

export function AdminAuthGuard({ children }: Props) {
  const { user, profile, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/account" replace />
  }

  return <>{children}</>
}
