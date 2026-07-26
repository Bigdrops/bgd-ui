import type { LineItem, LineGroup, CommercialSettings, InvoiceTotals } from '@/types/invoice'

export function calcRowTotal(qty: number, price: number): number {
  return qty * price
}

function lineItemTotal(item: LineItem): number {
  const base = item.quantity * item.unitPrice
  if (item.discountOverride && item.discountOverride > 0) {
    return base * (1 - item.discountOverride / 100)
  }
  return base
}

function groupSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineItemTotal(item), 0)
}

function installTotal(items: LineItem[]): number {
  return items.reduce((sum, item) => {
    if (item.installRate && item.installRate > 0) {
      return sum + item.installRate * item.quantity
    }
    return sum
  }, 0)
}

export function calculateTotals(
  groups: LineGroup[],
  commercial: CommercialSettings
): InvoiceTotals {
  const allItems = groups.flatMap((g) => g.items)

  const subtotal = allItems.reduce((sum, item) => sum + lineItemTotal(item), 0)

  let discount = 0
  if (commercial.discount.type === 'percentage') {
    discount = subtotal * (commercial.discount.value / 100)
  } else if (commercial.discount.type === 'flat') {
    discount = commercial.discount.value
  }

  const afterDiscount = subtotal - discount

  let vat = 0
  if (commercial.vat.enabled) {
    if (commercial.discount.timing === 'before_tax') {
      vat = afterDiscount * (commercial.vat.percentage / 100)
    } else {
      vat = subtotal * (commercial.vat.percentage / 100)
    }
  }

  let wht = 0
  if (commercial.wht.type === 'percentage') {
    wht = afterDiscount * (commercial.wht.value / 100)
  } else if (commercial.wht.type === 'flat') {
    wht = commercial.wht.value
  }

  let additionalCharges = 0
  additionalCharges = commercial.additionalCharges.items.reduce((sum, c) => sum + c.value, 0)

  const install = installTotal(allItems)

  const grandTotal = afterDiscount + vat - wht + additionalCharges + install

  return {
    subtotal,
    discount,
    vat,
    wht,
    additionalCharges,
    additionalChargeItems: commercial.additionalCharges.items.map((c) => ({ title: c.title, value: c.value })),
    installTotal: install,
    grandTotal: Math.max(0, grandTotal),
    amountInWords: '',
  }
}

export function money(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero'
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
  const h = (n: number): string => { if (n===0) return ''; if (n<20) return ones[n]; if (n<100) return tens[Math.floor(n/10)]+(n%10?' '+ones[n%10]:''); return ones[Math.floor(n/100)]+' Hundred'+(n%100?' and '+h(n%100):'') }
  const ni = Math.floor(num)
  let r = ''
  if (ni>=1000000){r+=h(Math.floor(ni/1000000))+' Million ';const rm=ni%1000000;if(rm>=1000)r+=h(Math.floor(rm/1000))+' Thousand ';else if(rm>0)r+=h(rm)}
  else if(ni>=1000){r+=h(Math.floor(ni/1000))+' Thousand ';const rm=ni%1000;if(rm>0)r+=h(rm)}
  else r+=h(ni)
  return r.trim()
}

export function calcTotals(
  sections: any[],
  discount: { value: number; type: string; timing: string },
  charges: any[],
  vatRate: number,
  wht: { rate: number; unit: string }
) {
  let subtotal = 0
  sections.forEach((s: any) => {
    if (s.type === 'item') subtotal += calcRowTotal(Number(s.qty) || 0, Number(s.price) || 0)
    else if (s.type === 'group') s.items.forEach((it: any) => subtotal += calcRowTotal(Number(it.qty) || 0, Number(it.price) || 0))
  })

  let discountAmt = 0
  if (discount.value > 0) {
    if (discount.type === 'percentage') discountAmt = subtotal * (discount.value / 100)
    else discountAmt = discount.value
  }

  const chargeTotal = charges.filter((c) => c.taxable && Number(c.value) !== 0).reduce((s, c) => s + Number(c.value), 0)
  const nonTaxedCharges = charges.filter((c) => !c.taxable && Number(c.value) !== 0).reduce((s, c) => s + Number(c.value), 0)

  const afterDiscount = discount.timing === 'beforeTax' ? subtotal - discountAmt : subtotal
  const vat = vatRate > 0 ? afterDiscount * (vatRate / 100) : 0

  const whtAmt = wht.rate > 0 && wht.unit === 'percentage' ? (subtotal - (discount.timing === 'beforeTax' ? discountAmt : 0)) * (wht.rate / 100) : wht.rate > 0 ? wht.rate : 0

  const grandTotal = subtotal - discountAmt + vat + chargeTotal - whtAmt + nonTaxedCharges

  return { subtotal, discountAmt, vat, whtAmt, chargeTotal, nonTaxedCharges, grandTotal: Math.max(0, grandTotal) }
}
