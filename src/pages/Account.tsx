import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { User, Phone, LogOut } from 'lucide-react'

export function Account() {
  const navigate = useNavigate()
  const { user, profile, isLoading, sendOtp, verifyOtp, signOut } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSendOtp = async () => {
    setError('')
    setBusy(true)
    const formattedPhone = phone.startsWith('+') ? phone : `+263${phone.replace(/^0/, '')}`
    const result = await sendOtp(formattedPhone)
    if (result.error) {
      setError(result.error)
    } else {
      setOtpSent(true)
    }
    setBusy(false)
  }

  const handleVerifyOtp = async () => {
    setError('')
    setBusy(true)
    const result = await verifyOtp(otp)
    if (result.error) {
      setError(result.error)
    } else {
      navigate('/')
    }
    setBusy(false)
  }

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="card text-center">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-1">{profile?.name || 'Customer'}</h2>
          <p className="text-sm text-gray-500 mb-1">{profile?.phone || user.phoneNumber}</p>
          {profile?.email && (
            <p className="text-sm text-gray-500 mb-4">{profile.email}</p>
          )}
          {profile?.role !== 'customer' && (
            <span className="badge bg-primary/10 text-primary capitalize mb-4 inline-block">
              {profile?.role}
            </span>
          )}
          <div className="space-y-3 mt-6">
            <button className="btn-outline w-full">My Orders</button>
            <button className="btn-outline w-full">Saved Addresses</button>
            {profile?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="btn-primary w-full"
              >
                Admin Dashboard
              </button>
            )}
            <button
              onClick={signOut}
              className="flex items-center justify-center gap-2 w-full py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card">
        <div className="text-center mb-6">
          <Phone className="w-10 h-10 text-accent mx-auto mb-2" />
          <h2 className="text-xl font-bold">Sign In</h2>
          <p className="text-sm text-gray-500">Enter your Zimbabwe phone number</p>
        </div>

        <div id="recaptcha-container" />

        {!otpSent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 0776 755 924"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter without the leading 0 or with country code
              </p>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleSendOtp}
              disabled={busy || !phone}
              className="btn-primary w-full"
            >
              {busy ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleVerifyOtp}
              disabled={busy || otp.length < 6}
              className="btn-primary w-full"
            >
              {busy ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              onClick={() => { setOtpSent(false); setError('') }}
              className="w-full text-sm text-gray-500 hover:text-accent"
            >
              Change phone number
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
