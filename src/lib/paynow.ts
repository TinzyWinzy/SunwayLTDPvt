type PaynowMethod = 'ecocash' | 'onemoney' | 'innbucks' | 'bank'

interface PaynowInitiateResponse {
  success: boolean
  poll_url?: string
  instructions?: string
  error?: string
}

export async function initiatePaynowPayment(
  orderId: string,
  amount: number,
  phone: string,
  method: PaynowMethod,
): Promise<PaynowInitiateResponse> {
  const functionUrl = import.meta.env.VITE_PAYNOW_INITIATE_FUNCTION

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount, phone, method }),
  })
  return response.json()
}

export async function checkPaynowStatus(orderId: string): Promise<PaynowInitiateResponse> {
  const functionUrl = import.meta.env.VITE_PAYNOW_STATUS_FUNCTION

  const response = await fetch(`${functionUrl}?orderId=${orderId}`)
  return response.json()
}

export function getPaynowInstructions(method: PaynowMethod): string {
  const instructions: Record<PaynowMethod, string> = {
    ecocash: 'Dial *151*2*4*amount*merchant# and follow prompts',
    onemoney: 'Dial *111# and select OneMoney to Pay, enter merchant code',
    innbucks: 'Visit any Innbucks till point and use merchant code provided',
    bank: 'Transfer to Sunway Pvt Ltd account and upload proof of payment',
  }
  return instructions[method]
}
