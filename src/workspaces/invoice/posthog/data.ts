import type { LineItem, LineGroup, InvoiceData, Client, UnitType } from './types'
let _id = 0
export const uid = () => `ph${++_id}-${Math.random().toString(36).slice(2, 7)}`
export const CLIENTS: Client[] = [
  { id: 'c1', name: 'Acme Corp', email: 'billing@acme.com', address: '100 Main St, San Francisco' },
  { id: 'c2', name: 'TechFlow Inc', email: 'ap@techflow.io', address: '250 Market St, Portland' },
  { id: 'c3', name: 'DataBridge', email: 'finance@databridge.co', address: '400 Broadway, New York' },
]
export const UNITS: { value: UnitType; label: string }[] = [
  { value: 'pcs', label: 'Pcs' }, { value: 'kg', label: 'Kg' }, { value: 'lb', label: 'Lb' },
  { value: 'hr', label: 'Hr' }, { value: 'day', label: 'Day' }, { value: 'lot', label: 'Lot' },
  { value: 'set', label: 'Set' }, { value: 'box', label: 'Box' },
]
function mkItem(d: string, q: number, u: UnitType, p: number, n: number): LineItem {
  return { id: uid(), number: n, description: d, subDescription: '', quantity: q, unit: u, unitPrice: p, total: q * p }
}
export function emptyItem(n: number): LineItem { return { id: uid(), number: n, description: '', subDescription: '', quantity: 1, unit: 'pcs', unitPrice: 0, total: 0 } }
export function emptyGroup(o: number): LineGroup { return { id: uid(), name: '', order: o, items: [emptyItem(1)], subtotal: 0 } }
export function sampleInvoice(): InvoiceData {
  const g1 = [mkItem('Product Analytics Setup', 1, 'lot', 8500, 1), mkItem('Event Tracking Configuration', 20, 'hr', 125, 2)]
  const g2 = [mkItem('Dashboard Customization', 1, 'lot', 3200, 3), mkItem('Team Training Session', 4, 'hr', 150, 4)]
  return {
    invoiceNumber: `PH-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    title: 'Analytics Platform Services',
    client: CLIENTS[0], referenceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    groups: [
      { id: uid(), name: 'Setup & Configuration', order: 0, items: g1, subtotal: g1.reduce((s, i) => s + i.total, 0) },
      { id: uid(), name: 'Customization & Training', order: 1, items: g2, subtotal: g2.reduce((s, i) => s + i.total, 0) },
    ],
    standaloneItems: [],
    commercial: { paymentTerms: 'Net 30', discount: { enabled: false, value: 0, type: 'percentage', timing: 'beforeTax' }, vat: { enabled: false, rate: 0 }, wht: { enabled: false, rate: 0, unit: 'percentage' }, charges: [] },
    additional: { notes: 'Thank you for choosing our platform.', terms: 'Payment due within 30 days.' },
  }
}
