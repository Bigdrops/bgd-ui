import { useState, useCallback, useRef } from 'react'
import { sampleInvoice } from './data'
import type { InvoiceData, InvoiceTotals } from './types'
import { InvoiceHeader } from './InvoiceHeader'
import { LineItemsSection } from './LineItemsSection'
import { CommercialSettings } from './CommercialSettings'
import { TotalsSection } from './TotalsSection'
import { AdditionalInfo } from './AdditionalInfo'
import { FloatingSave } from './FloatingSave'
import { QuickActions } from './QuickActions'
import './index.css'

function toWords(n: number): string {
  if (n === 0) return 'Zero Naira Only'
  const o = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const t = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const h = (n: number): string => {
    if (n === 0) return ''
    if (n < 20) return o[n]
    if (n < 100) return t[Math.floor(n / 10)] + (n % 10 ? ' ' + o[n % 10] : '')
    return o[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + h(n % 100) : '')
  }
  const ni = Math.floor(n)
  const k = Math.round((n - ni) * 100)
  let r = ''
  if (ni >= 1000000) { r += h(Math.floor(ni / 1000000)) + ' Million '; const rm = ni % 1000000; if (rm >= 1000) r += h(Math.floor(rm / 1000)) + ' Thousand '; else if (rm > 0) r += h(rm) }
  else if (ni >= 1000) { r += h(Math.floor(ni / 1000)) + ' Thousand '; const rm = ni % 1000; if (rm > 0) r += h(rm) }
  else r += h(ni)
  r = r.trim() + ' Naira'
  if (k > 0) r += ' and ' + h(k) + ' Kobo'
  return r + ' Only'
}

function computeTotals(data: InvoiceData): InvoiceTotals {
  const allItems = [...data.standaloneItems, ...data.groups.flatMap((g) => g.items)]
  const subtotal = allItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0)

  let discount = 0
  if (data.commercial.discount.type === 'percentage') discount = subtotal * (data.commercial.discount.value / 100)
  else if (data.commercial.discount.type === 'flat') discount = data.commercial.discount.value

  const afterDisc = subtotal - discount
  const vat = data.commercial.vat.enabled ? afterDisc * (data.commercial.vat.percentage / 100) : 0
  let wht = 0
  if (data.commercial.wht.type === 'percentage') wht = afterDisc * (data.commercial.wht.value / 100)
  else if (data.commercial.wht.type === 'flat') wht = data.commercial.wht.value

  const chargeItems = data.commercial.charges.items.filter((c) => c.title.trim() !== '' && c.value > 0).map((c) => ({ title: c.title, value: c.value }))
  const chargeTotal = chargeItems.reduce((s, c) => s + c.value, 0)

  const grand = Math.max(0, afterDisc + vat - wht + chargeTotal)
  return { subtotal, discount, vat, wht, chargeItems, grandTotal: grand, words: toWords(grand) }
}

export function InvoiceWorkspace() {
  const [data, setData] = useState<InvoiceData>(sampleInvoice)
  const [confirmClear, setConfirmClear] = useState(false)
  const notesRef = useRef<HTMLDivElement>(null)

  const update = useCallback((patch: Partial<InvoiceData>) => setData((prev) => ({ ...prev, ...patch })), [])
  const totals = computeTotals(data)

  const handleSave = useCallback(() => console.log('Save:', data), [data])
  const handleClear = useCallback(() => {
    setData((prev) => ({
      ...prev, groups: [], standaloneItems: [],
      commercial: { ...prev.commercial, discount: { type: 'none', value: 0, timing: 'before_tax' }, vat: { enabled: true, percentage: 7.5 }, wht: { type: 'none', value: 0 }, charges: { items: [], timing: 'after_tax' } },
      notes: '',
    }))
    setConfirmClear(false)
  }, [])

  return (
    <div className="sak-root" style={{ overflowX: 'hidden' }}>
      {/* Confirm dialog */}
      {confirmClear && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(35,31,32,0.35)', padding: '16px' }} onClick={() => setConfirmClear(false)}>
          <div className="sack-card" style={{ maxWidth: '320px', width: '100%', padding: '20px' }} onClick={(e) => e.stopPropagation()}>
            <div className="sack-heading" style={{ marginBottom: '6px' }}>Clear all data?</div>
            <p className="sack-caption" style={{ marginBottom: '14px', lineHeight: 1.5 }}>This will remove all items, groups, charges, and notes. This cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setConfirmClear(false)} className="sack-btn sack-btn-sm">Cancel</button>
              <button type="button" onClick={handleClear} className="sack-btn sack-btn-sm sack-btn-fire">Clear All</button>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <header style={{ borderBottom: '1px solid var(--ink)', padding: '0 16px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '800px', margin: '0 auto' }}>
        <span className="sack-heading" style={{ fontSize: '14px' }}>BIGDROPS</span>
        <QuickActions onSave={handleSave} onClearAll={() => setConfirmClear(true)} />
      </header>

      {/* Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 16px' }}>
        <InvoiceHeader data={data} onUpdate={update} />

        {/* Action bar */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', marginBottom: '14px', padding: '8px 12px', background: 'var(--bone)', borderRadius: '10px', border: '1px solid rgba(35,31,32,0.08)' }}>
          <button type="button" className="sack-btn sack-btn-sm sack-btn-ghost" style={{ fontSize: '10px', padding: '4px 12px' }}>Import</button>
          <button type="button" className="sack-btn sack-btn-sm sack-btn-ghost" style={{ fontSize: '10px', padding: '4px 12px' }}>Settings</button>
          <div style={{ flex: 1 }} />
          <button type="button" onClick={() => setConfirmClear(true)} className="sack-btn sack-btn-sm sack-btn-fire" style={{ fontSize: '10px', padding: '4px 12px' }}>Clear</button>
        </div>

        <LineItemsSection data={data} onUpdate={update} />

        <div style={{ marginTop: '16px' }}>
          <CommercialSettings settings={data.commercial} onUpdate={(c) => update({ commercial: c })} />
        </div>

        <div style={{ marginTop: '16px' }}>
          <TotalsSection totals={totals} />
        </div>

        <div ref={notesRef} style={{ marginTop: '16px', paddingBottom: '80px' }}>
          <AdditionalInfo notes={data.notes} onUpdate={(n) => update({ notes: n })} />
        </div>
      </main>

      <FloatingSave onSave={handleSave} />
    </div>
  )
}

export default InvoiceWorkspace
