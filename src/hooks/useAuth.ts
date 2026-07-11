import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const isLoading = useAuthStore((s) => s.isLoading)
  const sendOtp = useAuthStore((s) => s.sendOtp)
  const verifyOtp = useAuthStore((s) => s.verifyOtp)
  const signOut = useAuthStore((s) => s.signOut)

  return { user, profile, isAdmin, isLoading, sendOtp, verifyOtp, signOut }
}
