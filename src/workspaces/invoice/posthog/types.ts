export type UnitType = 'pcs' | 'kg' | 'lb' | 'hr' | 'day' | 'lot' | 'set' | 'box'
export interface Client { id: string; name: string; email: string; address?: string }
export interface AdditionalCharge { id: string; label: string; value: number; taxable: boolean }
export interface LineItem { id: string; number: number; description: string; subDescription: string; quantity: number; unit: UnitType; unitPrice: number; total: number }
export interface LineGroup { id: string; name: string; order: number; items: LineItem[]; subtotal: number }
export interface Discount { enabled: boolean; value: number; type: 'percentage' | 'flat'; timing: 'beforeTax' | 'afterTax' }
export interface Vat { enabled: boolean; rate: number }
export interface Wht { enabled: boolean; rate: number; unit: 'percentage' | 'flat' }
export interface CommercialSettings { paymentTerms: string; discount: Discount; vat: Vat; wht: Wht; charges: AdditionalCharge[] }
export interface AdditionalInfo { notes: string; terms: string }
export interface DocumentTotals { subtotal: number; discount: number; vat: number; wht: number; taxedCharges: number; nonTaxedCharges: number; grandTotal: number; amountInWords: string }
export interface InvoiceData { invoiceNumber: string; title: string; client: Client | null; referenceNumber: string; issueDate: string; dueDate: string; groups: LineGroup[]; standaloneItems: LineItem[]; commercial: CommercialSettings; additional: AdditionalInfo }
