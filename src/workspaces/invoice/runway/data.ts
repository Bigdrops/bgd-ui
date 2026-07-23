import type { LineItem, LineGroup, InvoiceData, Client, UnitType } from './types'

let _id = 0
export const uid = () => `rw${++_id}-${Math.random().toString(36).slice(2, 7)}`

export const CLIENTS: Client[] = [
  { id: 'c1', name: 'Meridian Capital', email: 'ap@meridiancap.com', address: '55 Water St, New York' },
  { id: 'c2', name: 'Summit Partners', email: 'billing@summitpartners.com', address: '100 Federal St, Boston' },
  { id: 'c3', name: 'Keystone Ventures', email: 'finance@keystonevc.io', address: '200 Sand Hill Rd, Menlo Park' },
]

export const UNITS: { value: UnitType; label: string }[] = [
  { value: 'pcs', label: 'Pcs' }, { value: 'kg', label: 'Kg' }, { value: 'lb', label: 'Lb' },
  { value: 'hr', label: 'Hr' }, { value: 'day', label: 'Day' }, { value: 'lot', label: 'Lot' },
  { value: 'set', label: 'Set' }, { value: 'box', label: 'Box' },
]

function mkItem(d: string, q: number, u: UnitType, p: number, n: number): LineItem {
  return { id: uid(), number: n, description: d, subDescription: '', quantity: q, unit: u, unitPrice: p, total: q * p }
}

export function emptyItem(n: number): LineItem {
  return { id: uid(), number: n, description: '', subDescription: '', quantity: 1, unit: 'pcs', unitPrice: 0, total: 0 }
}

export function emptyGroup(o: number): LineGroup {
  return { id: uid(), name: '', order: o, items: [emptyItem(1)], subtotal: 0 }
}

export function sampleInvoice(): InvoiceData {
  const g1 = [mkItem('Q3 Financial Analysis Report', 1, 'lot', 12500, 1), mkItem('Data Modeling & Forecasting', 40, 'hr', 185, 2)]
  const g2 = [mkItem('Board Meeting Presentation', 1, 'lot', 4500, 3), mkItem('Executive Summary Document', 1, 'lot', 2200, 4)]
  return {
    invoiceNumber: `RW-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    title: 'Advisory Services — Q3 2026',
    client: CLIENTS[0],
    referenceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    groups: [
      { id: uid(), name: 'Financial Analysis', order: 0, items: g1, subtotal: g1.reduce((s, i) => s + i.total, 0) },
      { id: uid(), name: 'Advisory Deliverables', order: 1, items: g2, subtotal: g2.reduce((s, i) => s + i.total, 0) },
    ],
    standaloneItems: [],
    commercial: {
      paymentTerms: 'Net 30',
      discount: { enabled: false, value: 0, type: 'percentage', timing: 'beforeTax' },
      vat: { enabled: false, rate: 0 },
      wht: { enabled: false, rate: 0, unit: 'percentage' },
      charges: [],
    },
    additional: { notes: 'Thank you for your business.', terms: 'Payment due within 30 days of invoice date.' },
  }
}
