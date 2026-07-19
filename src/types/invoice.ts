export interface Client {
  id: string
  name: string
  email: string
  address?: string
  phone?: string
  taxId?: string
}

export type UnitType = 'pcs' | 'kg' | 'lb' | 'hr' | 'day' | 'mth' | 'lot' | 'set' | 'box' | 'pair' | 'roll' | 'ft' | 'm' | 'in' | 'yd'

export type ConditionType = 'new' | 'used' | 'refurbished' | 'open_box' | 'like_new'

export type DiscountType = 'none' | 'percentage' | 'flat'
export type TaxTiming = 'before_tax' | 'after_tax'

export type ChargeType = 'none'

export interface AdditionalCharge {
  id: string
  title: string
  value: number
}

export interface CustomColumn {
  id: string
  name: string
  type: 'text' | 'number' | 'select'
  options?: string[]
  width?: number
}

export interface LineItem {
  id: string
  description: string
  subDescription?: string
  imageUrl?: string
  quantity: number
  unit: UnitType
  unitPrice: number
  make?: string
  partNumber?: string
  condition?: ConditionType
  installRate?: number
  vatOverride?: number
  discountOverride?: number
  customValues?: Record<string, string | number>
  groupId?: string
  collapsed?: boolean
}

export interface LineGroup {
  id: string
  title: string
  collapsed: boolean
  items: LineItem[]
}

export interface PaymentTerms {
  id: string
  label: string
  days: number
}

export interface CommercialSettings {
  paymentTerms: PaymentTerms | null
  discount: {
    type: DiscountType
    value: number
    timing: TaxTiming
  }
  vat: {
    enabled: boolean
    percentage: number
  }
  wht: {
    type: DiscountType
    value: number
  }
  additionalCharges: {
    items: AdditionalCharge[]
    timing: TaxTiming
  }
  customFields: Array<{ label: string; value: string | number }>
}

export interface AdditionalInfo {
  notes: string
  terms: string
  signatory: string
  signatureUrl: string
  referenceLinks: Array<{ label: string; url: string }>
}

export interface InvoiceHeader {
  title: string
  invoiceNumber: string
  clientId: string
  purchaseOrder: string
  issueDate: string
  dueDate: string
  status: 'draft' | 'pending' | 'sent' | 'paid' | 'overdue'
  customFields: Array<{ label: string; value: string }>
}

export interface LineItemsState {
  standalone: LineItem[]
  groups: LineGroup[]
}

export interface Invoice {
  header: InvoiceHeader
  groups: LineGroup[]
  standaloneItems: LineItem[]
  commercial: CommercialSettings
  additional: AdditionalInfo
  customColumns: CustomColumn[]
}

export interface InvoiceTotals {
  subtotal: number
  discount: number
  vat: number
  wht: number
  additionalCharges: number
  installTotal: number
  grandTotal: number
  amountInWords: string
}
