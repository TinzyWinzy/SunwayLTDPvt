import { useState, useCallback, useRef } from 'react'
import { initiatePaynowPayment, checkPaynowStatus } from '../lib/paynow'

type PaynowStatus = 'idle' | 'initiating' | 'awaiting_payment' | 'paid' | 'failed' | 'cancelled'

export function usePaynow() {
  const [status, setStatus] = useState<PaynowStatus>('idle')
  const [pollUrl, setPollUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const initiatePayment = useCallback(async (
    orderId: string,
    amount: number,
    phone: string,
    method: 'ecocash' | 'onemoney' | 'innbucks' | 'bank',
  ) => {
    setStatus('initiating')
    setError(null)

    try {
      const result = await initiatePaynowPayment(orderId, amount, phone, method)

      if (!result.success) {
        setError(result.error || 'Payment initiation failed')
        setStatus('failed')
        return
      }

      setPollUrl(result.poll_url || null)
      setStatus('awaiting_payment')

      // Poll for status every 5 seconds
      intervalRef.current = setInterval(async () => {
        const pollResult = await checkPaynowStatus(orderId)

        if (pollResult.success) {
          setStatus('paid')
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      }, 5000)

      // Stop polling after 5 minutes
      setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          if (status === 'awaiting_payment') {
            setStatus('failed')
            setError('Payment timeout')
          }
        }
      }, 300000)
    } catch {
      setError('Failed to initiate payment')
      setStatus('failed')
    }
  }, [status])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setStatus('idle')
    setPollUrl(null)
    setError(null)
  }, [])

  return { status, pollUrl, error, initiatePayment, reset }
}
