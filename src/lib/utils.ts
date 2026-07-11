import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: 'USD' | 'ZWL' = 'USD'): string {
  if (currency === 'ZWL') {
    return `ZWL ${amount.toLocaleString('en-ZW', { minimumFractionDigits: 2 })}`
  }
  return `$${amount.toFixed(2)}`
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'badge-pending',
    confirmed: 'badge-pending',
    paid: 'badge-paid',
    processing: 'badge-pending',
    shipped: 'badge-shipped',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
  }
  return colors[status] || 'badge-pending'
}
