import type { LineItem, LineGroup, CommercialSettings, InvoiceTotals } from '@/types/invoice'

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
  if (commercial.additionalCharges.type === 'percentage') {
    if (commercial.additionalCharges.timing === 'after_tax') {
      additionalCharges = (afterDiscount + vat) * (commercial.additionalCharges.value / 100)
    } else {
      additionalCharges = afterDiscount * (commercial.additionalCharges.value / 100)
    }
  } else if (commercial.additionalCharges.type === 'flat') {
    additionalCharges = commercial.additionalCharges.value
  }

  const install = installTotal(allItems)

  const grandTotal = afterDiscount + vat - wht + additionalCharges + install

  return {
    subtotal,
    discount,
    vat,
    wht,
    additionalCharges,
    installTotal: install,
    grandTotal: Math.max(0, grandTotal),
    amountInWords: '',
  }
}
