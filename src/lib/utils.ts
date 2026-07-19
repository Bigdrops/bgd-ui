import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const y = now.getFullYear().toString().slice(-2)
  const m = (now.getMonth() + 1).toString().padStart(2, '0')
  const seq = Math.floor(Math.random() * 9000 + 1000)
  return `INV-${y}${m}-${seq}`
}

export function toWords(num: number): string {
  if (num === 0) return 'Zero Naira Only'

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  const convertHundreds = (n: number): string => {
    if (n === 0) return ''
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertHundreds(n % 100) : '')
  }

  const naira = Math.floor(num)
  const kobo = Math.round((num - naira) * 100)

  let result = ''
  if (naira >= 1000000) {
    result += convertHundreds(Math.floor(naira / 1000000)) + ' Million '
    const rem = naira % 1000000
    if (rem >= 1000) result += convertHundreds(Math.floor(rem / 1000)) + ' Thousand '
    else if (rem > 0) result += convertHundreds(rem)
  } else if (naira >= 1000) {
    result += convertHundreds(Math.floor(naira / 1000)) + ' Thousand '
    const rem = naira % 1000
    if (rem > 0) result += convertHundreds(rem)
  } else {
    result += convertHundreds(naira)
  }

  result = result.trim() + ' Naira'
  if (kobo > 0) {
    result += ' and ' + convertHundreds(kobo) + ' Kobo'
  }
  result += ' Only'

  return result
}
