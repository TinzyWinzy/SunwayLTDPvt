import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../lib/api'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { formatCurrency } from '../lib/utils'
import { DELIVERY, PAYMENT_METHODS } from '../constants'
import { CreditCard, MapPin, Package } from 'lucide-react'

type Step = 'delivery' | 'review' | 'payment'

export function Checkout() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [step, setStep] = useState<Step>('delivery')
  const [deliveryType, setDeliveryType] = useState<'nationwide' | 'pickup'>('nationwide')
  const [paymentMethod, setPaymentMethod] = useState<string>('paynow_ecocash')
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const delivery = totalPrice() >= DELIVERY.freeThreshold ? 0 : DELIVERY.deliveryFee
  const grandTotal = totalPrice() + delivery

  const handleSubmitOrder = async () => {
    if (!user) {
      navigate('/account')
      return
    }

    setSubmitting(true)

    try {
      const orderId = await API.orders.create({
        user_id: user.uid,
        items: items.map((i) => ({
          product_id: i.product.id,
          name: i.product.name,
          qty: i.quantity,
          price_usd: i.product.price_usd,
          image_url: i.product.images?.[0] || null,
        })),
        total_usd: grandTotal,
        total_zwl: null,
        status: 'pending',
        payment_method: paymentMethod as 'paynow_ecocash' | 'paynow_onemoney' | 'paynow_innbucks' | 'paynow_bank' | 'cod' | null,
        paynow_poll_url: null,
        paynow_status: null,
        delivery_type: deliveryType,
        delivery_address: null,
        branch_id: null,
        tracking_number: null,
        notes: null,
      })

      clearCart()
      navigate(`/orders/${orderId}`)
    } catch (err) {
      console.error('Order failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex items-center gap-2 mb-8">
        {(['delivery', 'review', 'payment'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? 'bg-accent text-white'
                  : i < ['delivery', 'review', 'payment'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm capitalize ${step === s ? 'font-medium' : 'text-gray-500'}`}>
              {s}
            </span>
            {i < 2 && <div className="w-12 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {step === 'delivery' && (
        <div className="card">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Delivery Method
          </h2>

          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="delivery"
                value="nationwide"
                checked={deliveryType === 'nationwide'}
                onChange={() => setDeliveryType('nationwide')}
                className="mt-1"
              />
              <div>
                <div className="font-medium">Nationwide Delivery</div>
                <div className="text-sm text-gray-500">
                  {delivery === 0 ? 'Free delivery' : `$${DELIVERY.deliveryFee.toFixed(2)} delivery fee`}
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="delivery"
                value="pickup"
                checked={deliveryType === 'pickup'}
                onChange={() => setDeliveryType('pickup')}
                className="mt-1"
              />
              <div>
                <div className="font-medium">Branch Pickup</div>
                <div className="text-sm text-gray-500">
                  Free pickup at {DELIVERY.pickupBranches.join(', ')}
                </div>
              </div>
            </label>
          </div>

          {deliveryType === 'nationwide' && (
            <div className="space-y-3 mb-6">
              <input placeholder="Full Name" className="input-field" />
              <input placeholder="Phone Number" className="input-field" />
              <input placeholder="City" className="input-field" />
              <textarea placeholder="Full Address" className="input-field" rows={3} />
            </div>
          )}

          <button onClick={() => setStep('review')} className="btn-primary w-full">
            Continue to Review
          </button>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              Order Summary
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>{formatCurrency(item.product.price_usd * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-3" />
              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span>{delivery === 0 ? 'Free' : `$${DELIVERY.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('delivery')} className="btn-outline flex-1">
              Back
            </button>
            <button onClick={() => setStep('payment')} className="btn-primary flex-1">
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              Payment Method
            </h2>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    paymentMethod === method.id && 'border-accent bg-accent/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{method.label}</div>
                    <div className="text-sm text-gray-500">{method.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card bg-primary/5 border-primary/10">
            <p className="text-sm font-medium">Total to pay: {formatCurrency(grandTotal)}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('review')} className="btn-outline flex-1">
              Back
            </button>
            <button
              onClick={handleSubmitOrder}
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
