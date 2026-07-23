import type { LineItem, LineGroup, InvoiceData, Client, UnitType } from './types'
let _id = 0
export const uid = () => `nu${++_id}-${Math.random().toString(36).slice(2, 7)}`
export const CLIENTS: Client[] = [
  { id: 'c1', name: 'Violet Financial', email: 'billing@violetfin.com', address: '12 Kreuzberg Str, Berlin' },
  { id: 'c2', name: 'Lavender Labs', email: 'ap@lavenderlabs.io', address: '88 Charlottenburg, Berlin' },
  { id: 'c3', name: 'Plum Ventures', email: 'finance@plumvc.co', address: '5 Mitte Platz, Berlin' },
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
  const g1 = [mkItem('Brand Strategy Consultation', 1, 'lot', 9500, 1), mkItem('Market Research Report', 1, 'lot', 4200, 2)]
  const g2 = [mkItem('UI/UX Design Sprint', 5, 'day', 2800, 3), mkItem('Prototype Development', 1, 'lot', 6500, 4)]
  return {
    invoiceNumber: `NR-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    title: 'Design & Strategy Services',
    client: CLIENTS[0], referenceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    groups: [
      { id: uid(), name: 'Strategy', order: 0, items: g1, subtotal: g1.reduce((s, i) => s + i.total, 0) },
      { id: uid(), name: 'Design & Development', order: 1, items: g2, subtotal: g2.reduce((s, i) => s + i.total, 0) },
    ],
    standaloneItems: [],
    commercial: { paymentTerms: 'Net 30', discount: { enabled: false, value: 0, type: 'percentage', timing: 'beforeTax' }, vat: { enabled: false, rate: 0 }, wht: { enabled: false, rate: 0, unit: 'percentage' }, charges: [] },
    additional: { notes: 'Thank you for your partnership.', terms: 'Payment due within 30 days of invoice date.' },
  }
}
