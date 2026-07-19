import type { Client, LineItem, LineGroup, CommercialSettings, AdditionalInfo, InvoiceHeader, Invoice, CustomColumn, PaymentTerms } from '@/types/invoice'
import { generateId, generateInvoiceNumber } from '@/lib/utils'

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Dangote Industries', email: 'accounts@dangote.com', address: '14 Marina, Lagos', phone: '+234 1 271 0500', taxId: '12345678-0001' },
  { id: 'c2', name: 'Zenith Bank Plc', email: 'ap@zenithbank.com', address: '47 Marina, Lagos', phone: '+234 1 461 0505', taxId: '12345678-0002' },
  { id: 'c3', name: 'MTN Nigeria', email: 'procurement@mtn.com', address: '4 NWALC Road, Lagos', phone: '+234 803 101 0001', taxId: '12345678-0003' },
  { id: 'c4', name: 'Nigerian Breweries', email: 'finance@nbplc.com', address: '1 Love Garden, Lagos', phone: '+234 1 270 7200', taxId: '12345678-0004' },
  { id: 'c5', name: 'Access Bank Plc', email: 'ap@accessbank.com', address: '14 Commercial Avenue, Lagos', phone: '+234 1 271 2311', taxId: '12345678-0005' },
  { id: 'c6', name: 'Lafarge Africa', email: 'accounts@lafarge.com', address: '4 Grosvener Close, Lagos', phone: '+234 1 460 1200', taxId: '12345678-0006' },
  { id: 'c7', name: 'Shell Nigeria', email: 'procurement@shell.com', address: '1 Walters Close, Lagos', phone: '+234 1 870 9000', taxId: '12345678-0007' },
]

export const PAYMENT_TERMS: PaymentTerms[] = [
  { id: 'net0', label: 'Due on Receipt', days: 0 },
  { id: 'net7', label: 'Net 7', days: 7 },
  { id: 'net14', label: 'Net 14', days: 14 },
  { id: 'net30', label: 'Net 30', days: 30 },
  { id: 'net45', label: 'Net 45', days: 45 },
  { id: 'net60', label: 'Net 60', days: 60 },
  { id: 'net90', label: 'Net 90', days: 90 },
]

const today = new Date()
const dueDate = new Date(today)
dueDate.setDate(dueDate.getDate() + 30)

function dateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

export function createEmptyItem(groupId?: string): LineItem {
  return {
    id: generateId(),
    description: '',
    subDescription: '',
    quantity: 1,
    unit: 'pcs',
    unitPrice: 0,
    groupId,
  }
}

export function createEmptyGroup(): LineGroup {
  return {
    id: generateId(),
    title: 'Untitled Group',
    collapsed: false,
    items: [createEmptyItem()],
  }
}

export function getDefaultCommercial(): CommercialSettings {
  return {
    paymentTerms: PAYMENT_TERMS.find((p) => p.id === 'net30') ?? null,
    discount: { type: 'none', value: 0, timing: 'before_tax' },
    vat: { enabled: true, percentage: 7.5 },
    wht: { type: 'none', value: 0 },
    additionalCharges: { type: 'none', value: 0, timing: 'after_tax' },
    customFields: [],
  }
}

export function getDefaultAdditional(): AdditionalInfo {
  return {
    notes: '',
    terms: '',
    signatory: '',
    referenceLinks: [],
  }
}

export function getDefaultHeader(): InvoiceHeader {
  return {
    title: 'Supply of Industrial Equipment',
    invoiceNumber: generateInvoiceNumber(),
    clientId: '',
    purchaseOrder: '',
    issueDate: dateStr(today),
    dueDate: dateStr(dueDate),
    status: 'draft',
    customFields: [],
  }
}

export function getDefaultCustomColumns(): CustomColumn[] {
  return [
    { id: 'cc1', name: 'Make', type: 'text', width: 120 },
    { id: 'cc2', name: 'Part Number', type: 'text', width: 120 },
    { id: 'cc3', name: 'Condition', type: 'select', options: ['New', 'Used', 'Refurbished', 'Open Box', 'Like New'], width: 110 },
    { id: 'cc4', name: 'Install Rate', type: 'number', width: 100 },
  ]
}

export function createSampleInvoice(): Invoice {
  const group1Items: LineItem[] = [
    { id: generateId(), description: 'Caterpillar 320F Hydraulic Excavator', subDescription: 'Long Reach Configuration', quantity: 1, unit: 'pcs', unitPrice: 45000000, make: 'Caterpillar', partNumber: '320FLR-NG', condition: 'new', groupId: 'g1' },
    { id: generateId(), description: 'CAT Engine Oil Filter — 1R-0750', subDescription: 'Genuine OEM Parts', quantity: 12, unit: 'pcs', unitPrice: 28500, make: 'Caterpillar', partNumber: '1R-0750', condition: 'new', groupId: 'g1' },
    { id: generateId(), description: 'Hydraulic Oil ISO VG 46 — 20L Drum', quantity: 8, unit: 'pcs', unitPrice: 67500, groupId: 'g1' },
  ]

  const group2Items: LineItem[] = [
    { id: generateId(), description: 'Installation & Commissioning Service', subDescription: 'On-site, 5-day scope', quantity: 1, unit: 'lot', unitPrice: 3500000, installRate: 0, groupId: 'g2' },
    { id: generateId(), description: 'Operator Training Program', subDescription: '2 operators × 3 days', quantity: 6, unit: 'day', unitPrice: 150000, groupId: 'g2' },
    { id: generateId(), description: 'Transport & Logistics — Port to Site', quantity: 1, unit: 'lot', unitPrice: 2800000, groupId: 'g2' },
  ]

  return {
    header: getDefaultHeader(),
    groups: [
      { id: 'g1', title: 'Equipment & Parts', collapsed: false, items: group1Items },
      { id: 'g2', title: 'Services & Logistics', collapsed: false, items: group2Items },
    ],
    standaloneItems: [],
    commercial: {
      ...getDefaultCommercial(),
      discount: { type: 'percentage', value: 5, timing: 'before_tax' },
    },
    additional: getDefaultAdditional(),
    customColumns: getDefaultCustomColumns(),
  }
}
