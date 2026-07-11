import { create } from 'zustand'
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type ConfirmationResult,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { UserProfile } from '../types/database'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isAdmin: boolean
  confirmationResult: ConfirmationResult | null
  initialize: () => Promise<void>
  sendOtp: (phone: string) => Promise<{ error?: string }>
  verifyOtp: (otp: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAdmin: false,
  confirmationResult: null,

  initialize: async () => {
    onAuthStateChanged(auth, async (user) => {
      set({ user })

      if (user) {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const profile = docSnap.data() as UserProfile
          set({ profile, isAdmin: profile.role === 'admin' })
        }
      } else {
        set({ profile: null, isAdmin: false })
      }

      set({ isLoading: false })
    })
  },

  sendOtp: async (phone: string) => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })

      const confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier)
      set({ confirmationResult })
      return {}
    } catch (err: unknown) {
      const e = err as { message?: string }
      return { error: e.message || 'Failed to send OTP' }
    }
  },

  verifyOtp: async (otp: string) => {
    const { confirmationResult } = get()
    if (!confirmationResult) return { error: 'No verification code sent. Request OTP first.' }

    try {
      await confirmationResult.confirm(otp)
      set({ confirmationResult: null })
      return {}
    } catch (err: unknown) {
      const e = err as { message?: string }
      return { error: e.message || 'Invalid OTP' }
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth)
    set({ user: null, profile: null, isAdmin: false, confirmationResult: null })
  },

  refreshProfile: async () => {
    const u = get().user
    if (!u) return

    const docRef = doc(db, 'users', u.uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const profile = docSnap.data() as UserProfile
      set({ profile, isAdmin: profile.role === 'admin' })
    }
  },
}))
